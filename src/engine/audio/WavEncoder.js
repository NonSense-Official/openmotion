export class WavEncoder {
  static encode(audioBuffer) {
    if (!audioBuffer) {
      throw new Error('AudioBuffer is required for WAV encoding');
    }

    const numChannels = audioBuffer.numberOfChannels || 1;
    const sampleRate = audioBuffer.sampleRate || 44100;
    const numFrames = audioBuffer.length || 0;

    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    return WavEncoder.encodeFromChannels(channels, sampleRate);
  }

  static encodeFromChannels(channels, sampleRate = 44100) {
    if (!Array.isArray(channels) || channels.length === 0) {
      throw new Error('At least one channel Float32Array is required');
    }

    const numChannels = channels.length;
    const numFrames = channels[0].length;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    function writeAscii(offset, text) {
      for (let i = 0; i < text.length; i++) {
        view.setUint8(offset + i, text.charCodeAt(i));
      }
    }

    writeAscii(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(8, 'WAVE');

    writeAscii(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);

    writeAscii(36, 'data');
    view.setUint32(40, dataSize, true);

    const int16View = new Int16Array(arrayBuffer, 44, numFrames * numChannels);
    let sampleIndex = 0;

    for (let frame = 0; frame < numFrames; frame++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const floatSample = channels[ch][frame];
        const clamped = Math.max(-1, Math.min(1, floatSample || 0));
        int16View[sampleIndex++] = clamped < 0 ? (clamped * 32768) | 0 : (clamped * 32767) | 0;
      }
    }

    return new Uint8Array(arrayBuffer);
  }

  static encodeToBlob(audioBuffer) {
    const bytes = WavEncoder.encode(audioBuffer);
    return new Blob([bytes], { type: 'audio/wav' });
  }

  static getWavDuration(wavBytes) {
    if (!wavBytes || wavBytes.byteLength < 44) return 0;
    const view = wavBytes instanceof DataView ? wavBytes : new DataView(wavBytes.buffer, wavBytes.byteOffset, wavBytes.byteLength);
    const sampleRate = view.getUint32(24, true);
    const blockAlign = view.getUint16(32, true);
    const dataSize = view.getUint32(40, true);
    if (!sampleRate || !blockAlign) return 0;
    const numFrames = dataSize / blockAlign;
    return numFrames / sampleRate;
  }
}

export function encodeWav(audioBuffer) {
  return WavEncoder.encode(audioBuffer);
}

export function encodeWavFromChannelData(channels, sampleRate) {
  return WavEncoder.encodeFromChannels(channels, sampleRate);
}

export function encodeWavBlob(audioBuffer) {
  return WavEncoder.encodeToBlob(audioBuffer);
}
