import { exportWebCodecsVideo, isWebCodecsSupported, findSupportedVideoConfig, findSupportedAudioConfig, renderAudioMix } from './WebCodecsPipeline.js';
import { exportFramesFFmpeg, muxVideoWithAudioFFmpeg } from './FfmpegWasmPipeline.js';
import { exportImageSequenceZip, exportCurrentFramePng } from './SequenceZipPackager.js';

export async function detectExportCapabilities({
  width = 1280,
  height = 720,
  bitrate = 6000000,
  fps = 30,
  needAudio = false
} = {}) {
  const webcodecs = isWebCodecsSupported();
  let videoConfig = null;
  if (webcodecs) {
    videoConfig = await findSupportedVideoConfig({ width, height, bitrate, fps });
  }

  let audioConfig = null;
  if (needAudio) {
    audioConfig = await findSupportedAudioConfig();
  }

  return {
    webcodecs,
    hardwareVideoSupported: !!videoConfig,
    hardwareAudioSupported: !!(audioConfig && audioConfig.ok),
    ffmpegAvailable: true
  };
}

async function tryHybridFallback(options) {
  const {
    onProgress = () => {},
    isCancelled = () => false,
    audio,
    startMs = 0,
    endMs = 0
  } = options;

  onProgress({
    phase: 'fallback',
    stage: 'hybrid',
    message: 'Menyiapkan audio PCM untuk muxing FFmpeg...'
  });

  let audioBuffer = null;
  try {
    audioBuffer = await renderAudioMix({
      url: audio?.url,
      tracks: audio?.tracks,
      startMs,
      endMs,
      rate: audio?.rate,
      offsetMs: audio?.offsetMs,
      inTimeMs: audio?.inTimeMs,
      sampleRate: audio?.sampleRate || 48000,
      channels: 2,
      onProgress
    });
  } catch (err) {
    return null;
  }

  if (!audioBuffer || !audioBuffer.length) {
    return null;
  }

  onProgress({
    phase: 'fallback',
    stage: 'hybrid',
    message: 'Encoding video WebCodecs (tanpa audio)...'
  });

  let videoResult = null;
  try {
    videoResult = await exportWebCodecsVideo({
      ...options,
      audio: null
    });
  } catch (err) {
    return null;
  }

  if (!videoResult || videoResult.cancelled || !videoResult.blob) {
    return videoResult;
  }

  if (isCancelled()) {
    return {
      status: 'cancelled',
      cancelled: true,
      blob: null,
      codec: videoResult.codec,
      width: videoResult.width,
      height: videoResult.height,
      fps: videoResult.fps,
      frames: videoResult.frames,
      mode: 'hybrid'
    };
  }

  try {
    const videoBytes = new Uint8Array(await videoResult.blob.arrayBuffer());
    const hybridResult = await muxVideoWithAudioFFmpeg({
      videoBytes,
      videoCodec: videoResult.codec,
      width: videoResult.width,
      height: videoResult.height,
      fps: videoResult.fps,
      frames: videoResult.frames,
      renderAudio: async () => audioBuffer,
      onProgress,
      isCancelled
    });
    return hybridResult;
  } catch (err) {
    return null;
  }
}

export async function exportVideo(options) {
  const {
    codec = 'h264',
    forceFFmpeg = false,
    audio = null,
    onProgress = () => {},
    isCancelled = () => false
  } = options;

  const hasAudio = !!(audio && (audio.url || (Array.isArray(audio.tracks) && audio.tracks.length)));

  if (forceFFmpeg || codec === 'h265') {
    onProgress({
      phase: 'fallback',
      stage: 'select',
      message: 'Menggunakan FFmpeg WASM sebagai pipeline encoding.'
    });
    return exportFramesFFmpeg({
      ...options,
      audioRequested: hasAudio,
      renderAudio: hasAudio ? () => renderAudioMix({
        url: audio.url,
        tracks: audio.tracks,
        startMs: options.startMs || 0,
        endMs: options.endMs || 0,
        rate: audio.rate,
        offsetMs: audio.offsetMs,
        inTimeMs: audio.inTimeMs,
        sampleRate: audio.sampleRate || 48000,
        channels: 2,
        onProgress
      }) : null
    });
  }

  try {
    return await exportWebCodecsVideo(options);
  } catch (err) {
    if (isCancelled() || err.name === 'AbortError') {
      return { status: 'cancelled', cancelled: true };
    }

    if (err.audioFailure && hasAudio) {
      onProgress({
        phase: 'fallback',
        stage: 'fallback-hybrid',
        message: 'WebCodecs audio gagal, mencoba mode hybrid (video WebCodecs + audio FFmpeg)...'
      });
      const hybridResult = await tryHybridFallback(options);
      if (hybridResult) {
        return hybridResult;
      }
    }

    if (err.codecFailure || err.audioFailure || err.muxFailure) {
      onProgress({
        phase: 'fallback',
        stage: 'fallback-select',
        message: 'Mengalihkan ke FFmpeg WASM software encoding...'
      });
      return exportFramesFFmpeg({
        ...options,
        audioRequested: hasAudio,
        renderAudio: hasAudio ? () => renderAudioMix({
          url: audio.url,
          tracks: audio.tracks,
          startMs: options.startMs || 0,
          endMs: options.endMs || 0,
          rate: audio.rate,
          offsetMs: audio.offsetMs,
          inTimeMs: audio.inTimeMs,
          sampleRate: audio.sampleRate || 48000,
          channels: 2,
          onProgress
        }) : null
      });
    }

    throw err;
  }
}

export async function exportSequence(options) {
  return exportImageSequenceZip(options);
}

export async function exportCurrentFrame(canvas) {
  return exportCurrentFramePng(canvas);
}
