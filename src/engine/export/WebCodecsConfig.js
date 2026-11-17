const AVC_PROFILES = [
  { id: 'h264', codec: 'avc1.640033' },
  { id: 'h264', codec: 'avc1.64002A' },
  { id: 'h264', codec: 'avc1.4D0028' },
  { id: 'h264', codec: 'avc1.42E01F' }
];

export function isWebCodecsSupported() {
  return typeof globalThis.VideoEncoder === 'function' && typeof globalThis.VideoFrame === 'function';
}

export function isAudioEncoderSupported() {
  return typeof globalThis.AudioEncoder === 'function' && typeof globalThis.AudioData === 'function';
}

export async function findSupportedVideoConfig({ width, height, bitrate = 6000000, fps = 30 }) {
  if (!isWebCodecsSupported()) return null;
  for (const prof of AVC_PROFILES) {
    const config = {
      codec: prof.codec,
      width,
      height,
      bitrate,
      framerate: fps,
      latencyMode: 'realtime',
      hardwareAcceleration: 'prefer-hardware',
      avc: { format: 'avc' }
    };
    try {
      const res = await VideoEncoder.isConfigSupported(config);
      if (res && res.supported) {
        return { ...prof, config };
      }
    } catch {}
  }
  return null;
}

export async function findSupportedAudioConfig({ sampleRate = 48000, bitrate = 128000, channels = 2 } = {}) {
  if (!isAudioEncoderSupported()) {
    return { ok: false, reason: 'AudioEncoder not supported' };
  }
  const sampleRates = [sampleRate, 48000, 44100, 32000, 24000, 22050, 16000].filter((v, i, a) => a.indexOf(v) === i);
  for (const sr of sampleRates) {
    for (const ch of [channels, 2, 1].filter((v, i, a) => a.indexOf(v) === i)) {
      const config = {
        codec: 'mp4a.40.2',
        sampleRate: sr,
        numberOfChannels: ch,
        bitrate: Math.round(bitrate),
        aac: { format: 'aac' }
      };
      try {
        const res = await AudioEncoder.isConfigSupported(config);
        if (res && res.supported) {
          return { ok: true, config: res.config || config, sampleRate: sr, channels: ch };
        }
      } catch {}
    }
  }
  return { ok: false, reason: 'AAC unsupported on all sample rates' };
}
