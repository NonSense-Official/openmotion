export class WaveformGenerator {
  static generatePeaksFromChannelData(channelData, sampleCount = 120) {
    if (!channelData || channelData.length === 0) {
      return new Float32Array(sampleCount).fill(0.12);
    }

    const totalLength = channelData.length;
    const count = Math.max(1, Math.floor(sampleCount));
    const blockSize = Math.max(1, Math.floor(totalLength / count));
    const peaks = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, totalLength);
      let sum = 0;
      let peak = 0;

      for (let j = start; j < end; j++) {
        const abs = Math.abs(channelData[j]);
        if (abs > peak) peak = abs;
        sum += abs;
      }

      const length = end - start || 1;
      const avg = sum / length;
      const combined = peak * 0.6 + avg * 1.2;
      peaks[i] = Math.max(0.12, Math.min(1, combined));
    }

    return Array.from(peaks);
  }

  static generatePeaks(audioBuffer, sampleCount = 120) {
    if (!audioBuffer || typeof audioBuffer.getChannelData !== 'function') {
      return new Array(sampleCount).fill(0.12);
    }

    const channelCount = audioBuffer.numberOfChannels || 1;
    const length = audioBuffer.length;
    const count = Math.max(1, Math.floor(sampleCount));
    const blockSize = Math.max(1, Math.floor(length / count));
    const peaks = new Array(count);

    const channels = [];
    for (let c = 0; c < channelCount; c++) {
      channels.push(audioBuffer.getChannelData(c));
    }

    for (let i = 0; i < count; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, length);
      let sum = 0;
      let peak = 0;

      for (let j = start; j < end; j++) {
        let sample = 0;
        for (let c = 0; c < channelCount; c++) {
          sample += Math.abs(channels[c][j] || 0);
        }
        sample /= channelCount;
        if (sample > peak) peak = sample;
        sum += sample;
      }

      const blockSizeActual = end - start || 1;
      const avg = sum / blockSizeActual;
      const amp = peak * 0.5 + avg * 1.4;
      peaks[i] = Math.max(0.12, Math.min(1, amp));
    }

    return peaks;
  }

  static generateProceduralPeaks(seedString = '', sampleCount = 120) {
    const count = Math.max(1, Math.floor(sampleCount));
    const str = String(seedString || 'openmotion');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }

    const peaks = new Array(count);
    for (let i = 0; i < count; i++) {
      const norm = i / count;
      const s1 = Math.sin(norm * 18.0 + hash * 0.1);
      const s2 = Math.cos(norm * 42.0 + hash * 0.05);
      const s3 = Math.sin(norm * 90.0 + (i % 7));
      let amp = Math.abs(s1 * 0.45 + s2 * 0.35 + s3 * 0.2);
      const env = Math.sin(Math.min(1, Math.max(0, norm)) * Math.PI);
      amp = Math.min(1, Math.max(0.12, amp * (0.4 + 0.6 * env)));
      peaks[i] = Number(amp.toFixed(3));
    }
    return peaks;
  }

  static async decodeAudioPeaksFromUrl(url, sampleCount = 120, optAudioContext = null) {
    if (!url) return WaveformGenerator.generateProceduralPeaks(url, sampleCount);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      return await WaveformGenerator.decodeAudioPeaksFromArrayBuffer(arrayBuffer, sampleCount, optAudioContext);
    } catch {
      return WaveformGenerator.generateProceduralPeaks(url, sampleCount);
    }
  }

  static async decodeAudioPeaksFromArrayBuffer(arrayBuffer, sampleCount = 120, optAudioContext = null) {
    if (!arrayBuffer) return WaveformGenerator.generateProceduralPeaks('', sampleCount);

    const AudioContextClass = typeof window !== 'undefined'
      ? (window.AudioContext || window.webkitAudioContext)
      : (typeof globalThis !== 'undefined' ? (globalThis.AudioContext || globalThis.webkitAudioContext) : null);

    let ctx = optAudioContext;
    let shouldClose = false;

    if (!ctx) {
      if (typeof OfflineAudioContext !== 'undefined') {
        ctx = new OfflineAudioContext(1, 1, 44100);
      } else if (AudioContextClass) {
        ctx = new AudioContextClass();
        shouldClose = true;
      }
    }

    if (!ctx || typeof ctx.decodeAudioData !== 'function') {
      return WaveformGenerator.generateProceduralPeaks('audio', sampleCount);
    }

    try {
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      return WaveformGenerator.generatePeaks(audioBuffer, sampleCount);
    } catch {
      return WaveformGenerator.generateProceduralPeaks('audio_fallback', sampleCount);
    } finally {
      if (shouldClose && ctx && typeof ctx.close === 'function') {
        ctx.close().catch(() => {});
      }
    }
  }

  static computeWaveformBarGeometry(peaks, width, height, barWidth = 2.5, barSpacing = 4) {
    const w = Math.max(10, Number(width) || 100);
    const h = Math.max(8, Number(height) || 28);
    const count = Math.max(1, Math.floor(w / barSpacing));
    const midY = h / 2;
    const bars = [];

    const sourcePeaks = Array.isArray(peaks) && peaks.length > 0 ? peaks : null;

    for (let i = 0; i < count; i++) {
      const x = i * barSpacing + 1;
      const norm = i / Math.max(1, count);
      let amplitude = 0.4;

      if (sourcePeaks) {
        const peakIndex = Math.min(sourcePeaks.length - 1, Math.floor(norm * sourcePeaks.length));
        amplitude = Math.max(0.12, Math.min(1, sourcePeaks[peakIndex] || 0.12));
      }

      const barHeight = Math.max(3, Math.round(amplitude * (h - 6)));
      const y = Math.round(midY - barHeight / 2);

      bars.push({
        x,
        y,
        width: barWidth,
        height: barHeight,
        rx: 1.2,
        amplitude
      });
    }

    return bars;
  }
}

export const generatePeaks = WaveformGenerator.generatePeaks;
export const generateProceduralPeaks = WaveformGenerator.generateProceduralPeaks;
export const computeWaveformBarGeometry = WaveformGenerator.computeWaveformBarGeometry;
