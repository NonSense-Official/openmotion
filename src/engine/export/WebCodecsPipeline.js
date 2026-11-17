import { MediabunnyMuxer } from './MediabunnyMuxer.js';
import {
  isWebCodecsSupported,
  isAudioEncoderSupported,
  findSupportedVideoConfig,
  findSupportedAudioConfig
} from './WebCodecsConfig.js';

export {
  isWebCodecsSupported,
  isAudioEncoderSupported,
  findSupportedVideoConfig,
  findSupportedAudioConfig
};

export async function renderAudioMix({
  url,
  tracks = null,
  startMs = 0,
  endMs = 0,
  rate = 1,
  offsetMs = 0,
  inTimeMs = 0,
  sampleRate = 48000,
  channels = 2,
  onProgress = () => {}
}) {
  if (typeof OfflineAudioContext === 'undefined') {
    const err = new Error('OfflineAudioContext not available');
    err.audioFailure = true;
    throw err;
  }

  const durationSec = Math.max(0, (endMs - startMs) / 1000);
  const lengthFrames = Math.max(1, Math.round(durationSec * sampleRate));
  const ctx = new OfflineAudioContext(channels, lengthFrames, sampleRate);

  const trackList = Array.isArray(tracks) && tracks.length ? tracks : [{
    url,
    rate,
    offsetMs,
    inTimeMs,
    layerStartMs: 0,
    layerEndMs: endMs
  }];

  let activeCount = 0;
  for (const tr of trackList) {
    if (!tr || !tr.url) continue;
    let audioBuf;
    try {
      const res = await fetch(tr.url);
      const arrayBuf = await res.arrayBuffer();
      audioBuf = await ctx.decodeAudioData(arrayBuf);
    } catch (e) {
      continue;
    }

    const trRate = tr.rate || 1;
    const lStart = Number.isFinite(tr.layerStartMs) ? tr.layerStartMs : startMs;
    const lEnd = Number.isFinite(tr.layerEndMs) ? tr.layerEndMs : endMs;
    const trOffset = Number(tr.offsetMs) || 0;
    const trInTime = Math.max(0, Number(tr.inTimeMs) || 0);

    const effectiveStart = Math.max(startMs, lStart);
    const effectiveEnd = Math.min(endMs, lEnd);
    if (effectiveEnd <= effectiveStart) continue;

    let sourceTime = trInTime + (effectiveStart - trOffset - lStart) * trRate;
    let outStart = effectiveStart;
    if (sourceTime < 0) {
      outStart += -sourceTime / trRate;
      sourceTime = 0;
    }
    if (outStart >= effectiveEnd) continue;

    const destStartSec = (outStart - startMs) / 1000;
    const durationToPlaySec = (effectiveEnd - outStart) / 1000;

    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    src.playbackRate.value = trRate;
    src.connect(ctx.destination);
    src.start(destStartSec, sourceTime / 1000, durationToPlaySec);
    activeCount++;
  }

  if (activeCount === 0) return null;
  return ctx.startRendering();
}

export async function encodeAudioPackets({
  audioBuffer,
  bitrate = 128000,
  onProgress = () => {}
}) {
  const audioSupport = await findSupportedAudioConfig({
    sampleRate: audioBuffer.sampleRate,
    bitrate,
    channels: audioBuffer.numberOfChannels
  });

  if (!audioSupport.ok) {
    const err = new Error(`AudioEncoder configuration failed: ${audioSupport.reason}`);
    err.audioFailure = true;
    throw err;
  }

  const { config, sampleRate, channels } = audioSupport;
  const packets = [];
  let encodeError = null;

  const audioEncoder = new AudioEncoder({
    output: (chunk, metadata) => {
      packets.push({ chunk, metadata });
    },
    error: (err) => {
      encodeError = err;
    }
  });

  audioEncoder.configure(config);

  const chunkSize = Math.max(1024, Math.round(sampleRate / 10));
  const channelData = [];
  for (let ch = 0; ch < channels; ch++) {
    channelData.push(audioBuffer.getChannelData(Math.min(ch, audioBuffer.numberOfChannels - 1)));
  }

  try {
    for (let offset = 0; offset < audioBuffer.length; offset += chunkSize) {
      if (encodeError) throw encodeError;
      const numFrames = Math.min(chunkSize, audioBuffer.length - offset);
      const planarData = new Float32Array(numFrames * channels);

      for (let ch = 0; ch < channels; ch++) {
        planarData.set(channelData[ch].subarray(offset, offset + numFrames), ch * numFrames);
      }

      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate,
        numberOfFrames: numFrames,
        numberOfChannels: channels,
        timestamp: Math.round((offset / sampleRate) * 1000000),
        data: planarData
      });

      audioEncoder.encode(audioData);
      audioData.close();

      while (audioEncoder.encodeQueueSize > 32) {
        await new Promise((r) => setTimeout(r, 2));
        if (encodeError) throw encodeError;
      }
    }
    await audioEncoder.flush();
  } catch (err) {
    const error = new Error(`Audio encoding failed: ${err?.message || err}`);
    error.audioFailure = true;
    throw error;
  } finally {
    try { audioEncoder.close(); } catch {}
  }

  if (encodeError) {
    const error = new Error(`Audio encoding failed: ${encodeError.message || encodeError}`);
    error.audioFailure = true;
    throw error;
  }

  return { packets, sampleRate, channels, seconds: audioBuffer.duration };
}

export async function exportWebCodecsVideo({
  canvas,
  renderFrame,
  prepareFrame = null,
  startMs = 0,
  endMs,
  fps = 30,
  bitrate = 6000000,
  keyFrameEverySec = 2,
  audio = null,
  onProgress = () => {},
  isCancelled = () => false
}) {
  const width = canvas.width - (canvas.width % 2);
  const height = canvas.height - (canvas.height % 2);
  const stepMs = 1000 / fps;
  const totalFrames = Math.max(1, Math.round((endMs - startMs) / stepMs) + 1);

  const videoConfig = await findSupportedVideoConfig({ width, height, bitrate, fps });
  if (!videoConfig) {
    const err = new Error('No supported H.264 profile found for VideoEncoder.');
    err.codecFailure = true;
    throw err;
  }

  const hasAudioSource = !!(audio && (audio.url || (Array.isArray(audio.tracks) && audio.tracks.length)));
  let audioResult = null;

  if (hasAudioSource) {
    try {
      const audioBuffer = await renderAudioMix({
        url: audio.url,
        tracks: audio.tracks,
        startMs,
        endMs,
        rate: audio.rate,
        offsetMs: audio.offsetMs,
        inTimeMs: audio.inTimeMs,
        sampleRate: audio.sampleRate || 48000,
        channels: 2,
        onProgress
      });
      if (audioBuffer && audioBuffer.length) {
        audioResult = await encodeAudioPackets({
          audioBuffer,
          bitrate: audio.bitrate || 128000,
          onProgress
        });
      }
    } catch (err) {
      const error = new Error(`Audio preparation failed: ${err.message || err}`);
      error.audioFailure = true;
      throw error;
    }
  }

  const muxer = await MediabunnyMuxer.create({ fps });
  muxer.addVideoTrack();
  if (audioResult) muxer.addAudioTrack();
  await muxer.start();

  if (audioResult) {
    for (const pkt of audioResult.packets) {
      await muxer.queueAudioPacket(pkt.chunk, pkt.metadata);
    }
  }

  let encodeError = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => {
      muxer.queueFrame(chunk, metadata);
    },
    error: (err) => {
      encodeError = err;
    }
  });

  try {
    videoEncoder.configure(videoConfig.config);
  } catch (err) {
    try { videoEncoder.close(); } catch {}
    const error = new Error(`VideoEncoder rejected configuration: ${err.message}`);
    error.codecFailure = true;
    throw error;
  }

  const keyFrameInterval = Math.max(1, Math.round(fps * keyFrameEverySec));
  let cancelled = false;

  try {
    for (let i = 0; i < totalFrames; i++) {
      if (isCancelled()) {
        cancelled = true;
        break;
      }
      if (encodeError) {
        const err = new Error(`VideoEncoder runtime error: ${encodeError.message || encodeError}`);
        err.codecFailure = true;
        throw err;
      }

      const curMs = startMs + i * stepMs;
      if (prepareFrame) await prepareFrame(curMs);
      renderFrame(curMs);

      const frame = new VideoFrame(canvas, {
        timestamp: Math.round(i * stepMs * 1000),
        duration: Math.round(stepMs * 1000)
      });

      videoEncoder.encode(frame, { keyFrame: i % keyFrameInterval === 0 });
      frame.close();

      while (videoEncoder.encodeQueueSize > 6) {
        await new Promise((r) => setTimeout(r, 2));
        if (encodeError) {
          const err = new Error(`VideoEncoder runtime error: ${encodeError.message || encodeError}`);
          err.codecFailure = true;
          throw err;
        }
      }

      onProgress({
        phase: 'render',
        frame: i + 1,
        total: totalFrames,
        pct: Math.round(((i + 1) / totalFrames) * 100),
        encodedBytes: muxer.byteLength
      });
      await new Promise((r) => setTimeout(r, 0));
    }

    if (!cancelled) {
      await videoEncoder.flush();
    }
  } catch (err) {
    try { muxer.cancel(); } catch {}
    throw err;
  } finally {
    try { videoEncoder.close(); } catch {}
  }

  if (cancelled || isCancelled()) {
    try { muxer.cancel(); } catch {}
    return {
      status: 'cancelled',
      cancelled: true,
      blob: null,
      codec: videoConfig.id,
      width,
      height,
      fps,
      frames: muxer.frameCount,
      mode: 'webcodecs',
      audio: null
    };
  }

  let finalBuffer;
  try {
    finalBuffer = await muxer.finish();
  } catch (err) {
    const error = new Error(`Muxing finalized with error: ${err.message || err}`);
    error.muxFailure = true;
    throw error;
  }

  const blob = new Blob([finalBuffer], { type: 'video/mp4' });

  return {
    status: 'success',
    cancelled: false,
    blob,
    codec: videoConfig.id,
    width,
    height,
    fps,
    frames: muxer.frameCount,
    mode: 'webcodecs',
    bitrate,
    audio: audioResult ? {
      packets: audioResult.packets.length,
      sampleRate: audioResult.sampleRate,
      channels: audioResult.channels,
      seconds: audioResult.seconds,
      bytes: muxer.audioByteLength
    } : null
  };
}
