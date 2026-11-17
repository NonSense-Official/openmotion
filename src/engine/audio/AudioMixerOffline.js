export class AudioMixerOffline {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 48000;
    this.channels = options.channels || 2;
    this.bufferCache = new Map();
  }

  async loadTrackBuffer(url, context, onProgress) {
    if (!url) return null;
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url);
    }

    if (onProgress) {
      onProgress({
        phase: 'audio',
        stage: 'fetch',
        message: `Loading audio: ${url.slice(-40)}`
      });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load audio (${response.status}): ${url}`);
    }

    const arrayBuf = await response.arrayBuffer();
    if (onProgress) {
      onProgress({
        phase: 'audio',
        stage: 'decode',
        bytes: arrayBuf.byteLength
      });
    }

    const audioBuffer = await context.decodeAudioData(arrayBuf.slice(0));
    this.bufferCache.set(url, audioBuffer);
    return audioBuffer;
  }

  async mix(options = {}) {
    const {
      tracks = [],
      startMs = 0,
      endMs = 0,
      sampleRate = this.sampleRate,
      channels = this.channels,
      onProgress = () => {}
    } = options;

    const OfflineCtxClass = typeof globalThis !== 'undefined'
      ? (globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext)
      : null;

    if (!OfflineCtxClass) {
      throw new Error('OfflineAudioContext is not supported in this environment');
    }

    const durationSec = Math.max(0, (endMs - startMs) / 1000);
    const totalFrames = Math.max(1, Math.round(durationSec * sampleRate));
    const offlineCtx = new OfflineCtxClass(channels, totalFrames, sampleRate);

    const validTracks = tracks.filter((t) => {
      if (!t || t.muted || t.hidden) return false;
      const tStart = Number(t.startTime) || 0;
      const tEnd = Number(t.endTime) || 0;
      return tEnd > tStart && tEnd > startMs && tStart < endMs;
    });

    if (validTracks.length === 0) {
      return offlineCtx.createBuffer(channels, totalFrames, sampleRate);
    }

    let activeTrackCount = 0;
    const errors = [];

    for (let i = 0; i < validTracks.length; i++) {
      const track = validTracks[i];
      let buffer = track.buffer || null;

      if (!buffer && (track.src || track.url)) {
        try {
          buffer = await this.loadTrackBuffer(track.src || track.url, offlineCtx, onProgress);
        } catch (err) {
          errors.push(err.message);
          onProgress({
            phase: 'audio',
            stage: 'skip',
            message: `Skipping track ${track.id || i}: ${err.message}`
          });
          continue;
        }
      }

      if (!buffer) continue;

      const trackSpeed = Math.max(0.0625, Math.min(4, Number(track.speed || 1) * Number(track.rate || 1)));
      const layerStart = Math.max(startMs, Number(track.startTime) || 0);
      const layerEnd = Math.min(endMs, Number(track.endTime) || 0);
      const inTime = Math.max(0, Number(track.inTime) || 0);

      const offsetIntoLayer = layerStart - (Number(track.startTime) || 0);
      let sourceStartOffsetSec = (inTime + offsetIntoLayer * trackSpeed) / 1000;

      let scheduledStartSec = (layerStart - startMs) / 1000;
      let scheduledDurationSec = (layerEnd - layerStart) / 1000 / trackSpeed;

      if (sourceStartOffsetSec < 0) {
        const adjustSec = -sourceStartOffsetSec;
        scheduledStartSec += adjustSec;
        scheduledDurationSec -= adjustSec;
        sourceStartOffsetSec = 0;
      }

      if (scheduledDurationSec <= 0 || sourceStartOffsetSec >= buffer.duration) {
        continue;
      }

      const availableBufferSec = (buffer.duration - sourceStartOffsetSec) / trackSpeed;
      const actualDurationSec = Math.min(scheduledDurationSec, availableBufferSec);

      if (actualDurationSec <= 0) continue;

      const sourceNode = offlineCtx.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.playbackRate.setValueAtTime(trackSpeed, 0);

      const gainNode = offlineCtx.createGain();
      this._applyTrackGainCurve(gainNode, track, layerStart, layerEnd, scheduledStartSec, actualDurationSec);

      sourceNode.connect(gainNode);
      gainNode.connect(offlineCtx.destination);

      sourceNode.start(scheduledStartSec, sourceStartOffsetSec, actualDurationSec);
      activeTrackCount++;
    }

    if (activeTrackCount === 0) {
      return offlineCtx.createBuffer(channels, totalFrames, sampleRate);
    }

    onProgress({
      phase: 'audio',
      stage: 'render',
      frames: totalFrames,
      tracks: activeTrackCount
    });

    const renderedBuffer = await offlineCtx.startRendering();

    onProgress({
      phase: 'audio',
      stage: 'complete',
      duration: renderedBuffer.duration
    });

    return renderedBuffer;
  }

  _applyTrackGainCurve(gainNode, track, layerStart, layerEnd, scheduledStartSec, durationSec) {
    const rawGain = track.volume !== undefined ? track.volume : (track.gain && track.gain.value ? track.gain.value[0] : 1);
    const baseGain = Math.max(0, Math.min(2, Number(rawGain) || 1));
    const gainPoints = track.gainPoints || (track.gain && track.gain.kfs) || null;

    if (!Array.isArray(gainPoints) || gainPoints.length === 0) {
      gainNode.gain.setValueAtTime(baseGain, scheduledStartSec);
      return;
    }

    const trackStart = Number(track.startTime) || 0;
    const trackEnd = Number(track.endTime) || 0;
    const trackDuration = Math.max(1, trackEnd - trackStart);
    const steps = 32;

    for (let step = 0; step <= steps; step++) {
      const stepRatio = step / steps;
      const currentMs = layerStart + (layerEnd - layerStart) * stepRatio;
      const normTime = Math.max(0, Math.min(1, (currentMs - trackStart) / trackDuration));
      const val = interpolateGainPoints(gainPoints, normTime) * baseGain;
      const clamped = Math.max(0, Math.min(2, val));
      const timeOffset = scheduledStartSec + durationSec * stepRatio;
      gainNode.gain.setValueAtTime(clamped, timeOffset);
    }
  }

  clearCache() {
    this.bufferCache.clear();
  }
}

function interpolateGainPoints(points, t) {
  if (!points || !points.length) return 1;
  if (t <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (t <= points[i][0]) {
      const [t0, v0] = points[i - 1];
      const [t1, v1] = points[i];
      const span = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * span;
    }
  }
  return points[points.length - 1][1];
}

export async function mixAudioTracks(options) {
  const mixer = new AudioMixerOffline({
    sampleRate: options.sampleRate,
    channels: options.channels
  });
  return mixer.mix(options);
}
