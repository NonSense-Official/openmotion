const FFMPEG_WRAPPER_VERSION = '0.12.10';
const FFMPEG_CORE_VERSION = '0.12.6';

const DEFAULT_FFMPEG_CONFIG = {
  moduleURL: `/ffmpeg/index.js?v=${FFMPEG_WRAPPER_VERSION}`,
  coreURL: `/ffmpeg-core/ffmpeg-core.js?v=${FFMPEG_CORE_VERSION}`,
  wasmURL: `/ffmpeg-core/ffmpeg-core.wasm?v=${FFMPEG_CORE_VERSION}`
};

let activeLoadPromise = null;
let ffmpegInstance = null;
let moduleImportLoader = (url) => import(/* @vite-ignore */ url);
let customConfig = null;

export function setFFmpegConfigForTests(cfg) {
  customConfig = cfg || null;
}

export function setFFmpegModuleLoaderForTests(loader) {
  moduleImportLoader = typeof loader === 'function' ? loader : (url) => import(/* @vite-ignore */ url);
}

export function getFFmpegConfig() {
  const globalCfg = (typeof globalThis !== 'undefined' && globalThis.AM_FFMPEG_CONFIG) || {};
  return { ...DEFAULT_FFMPEG_CONFIG, ...globalCfg, ...(customConfig || {}) };
}

export function isFFmpegLoaded() {
  return !!(ffmpegInstance && ffmpegInstance.loaded);
}

export function resetFFmpeg() {
  if (ffmpegInstance) {
    try { ffmpegInstance.terminate(); } catch {}
  }
  ffmpegInstance = null;
  activeLoadPromise = null;
}

function resolveUrl(url) {
  try {
    const base = typeof location !== 'undefined' && location.href ? location.href : 'http://localhost/';
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

function createFfmpegError(message, cause) {
  const err = new Error(message);
  err.ffmpegFailure = true;
  if (cause) err.cause = cause;
  return err;
}

export async function preloadToBlobURL(url, { onProgress = () => {}, stage = 'ffmpeg-download', label = 'Mengunduh FFmpeg' } = {}) {
  if (typeof fetch !== 'function' || typeof Blob === 'undefined' || typeof URL?.createObjectURL !== 'function') return url;
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok || !res.body || typeof res.body.getReader !== 'function') return url;

    const total = Number(res.headers.get('content-length')) || 0;
    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;
    let lastLoaded = 0;
    let lastTime = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;

      const now = Date.now();
      const threshold = total ? Math.max(1, total / 100) : 4 * 1048576;
      if (!done && loaded - lastLoaded < threshold && now - lastTime < 300) continue;
      lastLoaded = loaded;
      lastTime = now;

      const pct = total ? ` ${Math.round((loaded / total) * 100)}%` : '';
      const mb = total ? ` (${(loaded / 1048576).toFixed(1)}/${(total / 1048576).toFixed(1)} MB)` : '';
      onProgress({ phase: 'fallback', stage, loaded, total, message: `${label}${pct}${mb}` });
    }

    const type = stage === 'ffmpeg-wasm' ? 'application/wasm' : 'text/javascript';
    return URL.createObjectURL(new Blob(chunks, { type }));
  } catch {
    return url;
  }
}

export async function loadFFmpeg({ onProgress = () => {} } = {}) {
  if (activeLoadPromise) return activeLoadPromise;

  activeLoadPromise = (async () => {
    const cfg = getFFmpegConfig();
    onProgress({ phase: 'fallback', stage: 'ffmpeg-load', message: 'Memuat FFmpeg WASM...' });

    let exports;
    try {
      exports = await moduleImportLoader(cfg.moduleURL);
    } catch (err) {
      activeLoadPromise = null;
      throw createFfmpegError(`Gagal memuat modul FFmpeg (${cfg.moduleURL}): ${err?.message || err}`, err);
    }

    const FFmpegClass = exports?.FFmpeg || exports?.default?.FFmpeg || exports?.default;
    if (typeof FFmpegClass !== 'function') {
      activeLoadPromise = null;
      throw createFfmpegError('Modul FFmpeg tidak mengekspor kelas FFmpeg.');
    }

    const instance = new FFmpegClass();
    const blobUrls = [];
    try {
      const coreBlobUrl = await preloadToBlobURL(resolveUrl(cfg.coreURL), { onProgress, stage: 'ffmpeg-core', label: 'Mengunduh inti FFmpeg' });
      if (coreBlobUrl.startsWith('blob:')) blobUrls.push(coreBlobUrl);

      const wasmBlobUrl = await preloadToBlobURL(resolveUrl(cfg.wasmURL), { onProgress, stage: 'ffmpeg-wasm', label: 'Mengunduh WASM FFmpeg' });
      if (wasmBlobUrl.startsWith('blob:')) blobUrls.push(wasmBlobUrl);

      await instance.load({ coreURL: coreBlobUrl, wasmURL: wasmBlobUrl });
    } catch (err) {
      activeLoadPromise = null;
      throw createFfmpegError(`Gagal menginisialisasi FFmpeg WASM: ${err?.message || err}`, err);
    } finally {
      for (const b of blobUrls) {
        try { URL.revokeObjectURL(b); } catch {}
      }
    }

    ffmpegInstance = instance;
    onProgress({ phase: 'fallback', stage: 'ffmpeg-ready', message: 'FFmpeg ready' });
    return instance;
  })();

  return activeLoadPromise;
}

export function audioBufferToWav(audioBuffer) {
  const numCh = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const numFrames = audioBuffer.length;
  const blockAlign = numCh * 2;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeAscii = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeAscii(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels = Array.from({ length: numCh }, (_, ch) => audioBuffer.getChannelData(ch));
  const pcm16 = new Int16Array(buffer, 44, numFrames * numCh);
  let pcmIdx = 0;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, channels[ch][i] || 0));
      pcm16[pcmIdx++] = s < 0 ? (s * 32768) | 0 : (s * 32767) | 0;
    }
  }
  return new Uint8Array(buffer);
}

export async function canvasToJpegBytes(canvas, quality = 0.85) {
  if (typeof canvas.toBlob === 'function') {
    const blob = await new Promise((res, rej) => {
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob returned null'))), 'image/jpeg', quality);
    });
    return new Uint8Array(await blob.arrayBuffer());
  }
  if (typeof canvas.convertToBlob === 'function') {
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    return new Uint8Array(await blob.arrayBuffer());
  }
  throw new Error('Canvas does not support JPEG blob export.');
}

export function buildFFmpegArgs({
  fps = 30,
  hasAudio = false,
  codec = 'h264',
  crf = 26,
  audioBitrate = 128,
  preset = 'ultrafast'
} = {}) {
  const args = ['-hide_banner', '-loglevel', 'error', '-framerate', String(fps), '-i', 'frame%06d.jpg'];
  if (hasAudio) args.push('-i', 'audio.wav');
  args.push('-c:v', codec === 'h265' ? 'libx265' : 'libx264', '-preset', preset, '-crf', String(crf), '-pix_fmt', 'yuv420p');
  if (codec === 'h265') args.push('-tag:v', 'hvc1');
  if (hasAudio) args.push('-c:a', 'aac', '-b:a', `${Math.round(audioBitrate)}k`, '-shortest');
  args.push('-movflags', '+faststart', 'out.mp4');
  return args;
}

async function execFfmpegWithAbort(ffmpeg, args, isCancelled) {
  const abortController = new AbortController();
  const cancelTimer = setInterval(() => {
    if (isCancelled()) abortController.abort();
  }, 100);
  try {
    return await ffmpeg.exec(args, -1, { signal: abortController.signal });
  } finally {
    clearInterval(cancelTimer);
  }
}

async function cleanupVirtualFiles(ffmpeg, fileNames) {
  for (const f of fileNames) {
    try { await ffmpeg.deleteFile(f); } catch {}
  }
}

export async function muxVideoWithAudioFFmpeg({
  videoBytes,
  videoCodec = 'h264',
  width,
  height,
  fps = 30,
  frames = null,
  renderAudio,
  onProgress = () => {},
  isCancelled = () => false
}) {
  const ffmpeg = await loadFFmpeg({ onProgress });
  const files = ['video.mp4', 'audio.wav', 'out.mp4'];

  const progressHandler = (e) => {
    const p = typeof e?.progress === 'number' ? Math.round(e.progress * 100) : null;
    onProgress({ phase: 'fallback', stage: 'encode-progress', progress: e?.progress, message: p !== null ? `Menggabungkan audio… ${p}%` : 'Menggabungkan audio…' });
  };

  try {
    ffmpeg.on('progress', progressHandler);
    await ffmpeg.writeFile('video.mp4', videoBytes instanceof Uint8Array ? videoBytes : new Uint8Array(videoBytes));

    if (typeof renderAudio !== 'function') {
      const err = new Error('Audio diminta tetapi fungsi render audio tidak tersedia.');
      err.audioFailure = true;
      throw err;
    }

    const audioBuf = await renderAudio();
    if (!audioBuf || !audioBuf.length) {
      const err = new Error('AudioBuffer kosong.');
      err.audioFailure = true;
      throw err;
    }

    await ffmpeg.writeFile('audio.wav', audioBufferToWav(audioBuf));
    const args = ['-hide_banner', '-loglevel', 'error', '-i', 'video.mp4', '-i', 'audio.wav', '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', 'out.mp4'];

    const exitCode = await execFfmpegWithAbort(ffmpeg, args, isCancelled);
    if (isCancelled()) {
      resetFFmpeg();
      return { status: 'cancelled', cancelled: true, blob: null, codec: videoCodec, width, height, fps, frames, mode: 'hybrid' };
    }

    if (exitCode !== 0) {
      const err = createFfmpegError(`FFmpeg muxing exit code ${exitCode}`);
      err.audioFailure = true;
      throw err;
    }

    const outData = await ffmpeg.readFile('out.mp4');
    const blob = new Blob([outData instanceof Uint8Array ? outData : new Uint8Array(outData)], { type: 'video/mp4' });
    return { status: 'success', cancelled: false, blob, codec: videoCodec, width, height, fps, frames, mode: 'hybrid' };
  } finally {
    try { ffmpeg.off('progress', progressHandler); } catch {}
    await cleanupVirtualFiles(ffmpeg, files);
  }
}

export async function exportFramesFFmpeg({
  canvas,
  snapshot = null,
  renderFrame,
  prepareFrame = null,
  startMs = 0,
  endMs,
  fps = 30,
  bitrate = 6000000,
  codec = 'h264',
  crf = null,
  jpegQuality = 0.85,
  renderAudio = null,
  audioRequested = false,
  onProgress = () => {},
  isCancelled = () => false
}) {
  const width = canvas.width - (canvas.width % 2);
  const height = canvas.height - (canvas.height % 2);
  const stepMs = 1000 / fps;
  const totalFrames = Math.max(1, Math.round((endMs - startMs) / stepMs) + 1);

  const ffmpeg = await loadFFmpeg({ onProgress });
  const createdFiles = [];

  const progressHandler = (e) => {
    const p = typeof e?.progress === 'number' ? Math.round(e.progress * 100) : null;
    onProgress({ phase: 'fallback', stage: 'encode-progress', progress: e?.progress, message: p !== null ? `Encoding video… ${p}%` : 'Encoding video…' });
  };

  try {
    ffmpeg.on('progress', progressHandler);

    let hasAudio = false;
    if (audioRequested && typeof renderAudio === 'function') {
      const audioBuf = await renderAudio();
      if (audioBuf && audioBuf.length) {
        await ffmpeg.writeFile('audio.wav', audioBufferToWav(audioBuf));
        createdFiles.push('audio.wav');
        hasAudio = true;
      }
    }

    for (let i = 0; i < totalFrames; i++) {
      if (isCancelled()) {
        resetFFmpeg();
        return { status: 'cancelled', cancelled: true, blob: null, codec, width, height, fps, frames: i, mode: 'ffmpeg' };
      }

      const curMs = startMs + i * stepMs;
      if (prepareFrame) await prepareFrame(curMs);
      renderFrame(curMs);

      const targetCanvas = snapshot?.canvas || canvas;
      if (snapshot?.ctx && snapshot.canvas !== canvas) {
        snapshot.ctx.drawImage(canvas, 0, 0, width, height);
      }

      const jpegBytes = await canvasToJpegBytes(targetCanvas, jpegQuality);
      const frameFileName = `frame${String(i + 1).padStart(6, '0')}.jpg`;
      await ffmpeg.writeFile(frameFileName, jpegBytes);
      createdFiles.push(frameFileName);

      onProgress({ phase: 'render', frame: i + 1, total: totalFrames, pct: Math.round(((i + 1) / totalFrames) * 100) });
      await new Promise((r) => setTimeout(r, 0));
    }

    const args = buildFFmpegArgs({ fps, hasAudio, codec, crf: crf || (codec === 'h265' ? 30 : 26) });
    const exitCode = await execFfmpegWithAbort(ffmpeg, args, isCancelled);

    if (isCancelled()) {
      resetFFmpeg();
      return { status: 'cancelled', cancelled: true, blob: null, codec, width, height, fps, frames: totalFrames, mode: 'ffmpeg' };
    }

    if (exitCode !== 0) throw createFfmpegError(`FFmpeg encode failed with exit code ${exitCode}`);

    const outData = await ffmpeg.readFile('out.mp4');
    const blob = new Blob([outData instanceof Uint8Array ? outData : new Uint8Array(outData)], { type: 'video/mp4' });
    return { status: 'success', cancelled: false, blob, codec, width, height, fps, frames: totalFrames, mode: 'ffmpeg', bitrate };
  } finally {
    try { ffmpeg.off('progress', progressHandler); } catch {}
    await cleanupVirtualFiles(ffmpeg, [...createdFiles, 'out.mp4']);
  }
}
