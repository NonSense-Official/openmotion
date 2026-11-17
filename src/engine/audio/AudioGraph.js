export class AudioGraph {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 48000;
    this.context = null;
    this.masterGain = null;
    this.analyser = null;
    this.tracks = new Map();
    this.bufferCache = new Map();
    this.isPlaying = false;
    this.currentTimeMs = 0;
    this.playbackRate = 1;
    this.volume = options.volume !== undefined ? options.volume : 1;
    this.muted = false;
    this._initialized = false;
  }

  init() {
    if (this._initialized && this.context) {
      if (this.context.state === 'suspended') this.context.resume().catch(() => {});
      return this.context;
    }

    const AudioContextClass = typeof window !== 'undefined'
      ? (window.AudioContext || window.webkitAudioContext)
      : null;
    if (!AudioContextClass) return null;

    this.context = new AudioContextClass({ sampleRate: this.sampleRate });
    this.masterGain = this.context.createGain();
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.context.currentTime);

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this._initialized = true;
    return this.context;
  }

  async resume() {
    if (!this.context) this.init();
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  close() {
    this.stopAll();
    this.clearTracks();
    if (this.context && this.context.state !== 'closed') {
      this.context.close().catch(() => {});
    }
    this.context = null;
    this.masterGain = null;
    this.analyser = null;
    this._initialized = false;
  }

  setMasterVolume(val) {
    this.volume = Math.max(0, Math.min(2, Number(val) || 0));
    if (this.masterGain && this.context) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.context.currentTime);
    }
  }

  getMasterVolume() {
    return this.volume;
  }

  setMasterMute(muted) {
    this.muted = !!muted;
    if (this.masterGain && this.context) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.context.currentTime);
    }
  }

  getMasterLevel() {
    if (!this.analyser) return { peak: 0, rms: 0 };
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    let sumSquares = 0, peak = 0;
    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - 128) / 128;
      const abs = Math.abs(normalized);
      if (abs > peak) peak = abs;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / data.length);
    return { peak: Math.min(1, peak), rms: Math.min(1, rms * 1.4) };
  }

  async loadBuffer(url) {
    if (!url) return null;
    if (this.bufferCache.has(url)) return this.bufferCache.get(url);
    if (!this.context) this.init();
    if (!this.context) return null;

    try {
      const res = await fetch(url);
      const arrayBuf = await res.arrayBuffer();
      const decoded = await this.context.decodeAudioData(arrayBuf);
      this.bufferCache.set(url, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  addTrack(trackConfig) {
    if (!trackConfig || !trackConfig.id) return null;
    this.removeTrack(trackConfig.id);
    this.init();
    const trackGain = this.context ? this.context.createGain() : null;
    if (trackGain && this.masterGain) trackGain.connect(this.masterGain);
    const track = {
      id: trackConfig.id,
      src: trackConfig.src || trackConfig.url || '',
      startTime: Number(trackConfig.startTime) || 0,
      endTime: Number(trackConfig.endTime) || 0,
      inTime: Number(trackConfig.inTime) || 0,
      speed: Number(trackConfig.speed) || 1,
      volume: trackConfig.volume !== undefined ? Number(trackConfig.volume) : 1,
      gainPoints: trackConfig.gainPoints || (trackConfig.gain && trackConfig.gain.kfs) || null,
      muted: !!trackConfig.muted,
      hidden: !!trackConfig.hidden,
      gainNode: trackGain,
      sourceNode: null,
      buffer: trackConfig.buffer || null,
      sourceStartTime: 0
    };
    this.tracks.set(track.id, track);
    this._updateTrackGain(track, this.currentTimeMs);
    if (track.src && !track.buffer) {
      this.loadBuffer(track.src).then((buf) => {
        if (buf && this.tracks.has(track.id)) {
          track.buffer = buf;
          if (this.isPlaying) this._startTrack(track, this.currentTimeMs, this.playbackRate);
        }
      });
    }
    return track;
  }

  removeTrack(id) {
    const track = this.tracks.get(id);
    if (!track) return;
    this._stopTrack(track);
    if (track.gainNode) {
      try { track.gainNode.disconnect(); } catch {}
    }
    this.tracks.delete(id);
  }

  clearTracks() {
    for (const id of Array.from(this.tracks.keys())) {
      this.removeTrack(id);
    }
  }

  getTrack(id) {
    return this.tracks.get(id) || null;
  }

  syncTracks(layers) {
    if (!Array.isArray(layers)) return;
    const currentIds = new Set();
    for (const layer of layers) {
      if (!layer || !layer.id) continue;
      if (layer.tag && layer.tag !== 'audio' && layer.tag !== 'video' && layer.type !== 'audio') continue;
      currentIds.add(layer.id);
      const existing = this.tracks.get(layer.id);
      if (!existing) {
        this.addTrack(layer);
      } else {
        existing.startTime = Number(layer.startTime) || 0;
        existing.endTime = Number(layer.endTime) || 0;
        existing.inTime = Number(layer.inTime) || 0;
        existing.speed = Number(layer.speed) || 1;
        existing.volume = layer.volume !== undefined ? Number(layer.volume) : 1;
        existing.gainPoints = layer.gainPoints || (layer.gain && layer.gain.kfs) || null;
        existing.muted = !!layer.muted;
        existing.hidden = !!layer.hidden;
        if (layer.src && layer.src !== existing.src) {
          existing.src = layer.src;
          existing.buffer = null;
          this.loadBuffer(existing.src).then((buf) => {
            if (buf && this.tracks.has(existing.id)) existing.buffer = buf;
          });
        }
        this._updateTrackGain(existing, this.currentTimeMs);
      }
    }
    for (const id of Array.from(this.tracks.keys())) {
      if (!currentIds.has(id)) this.removeTrack(id);
    }
  }

  play(timeMs, playbackRate = 1) {
    this.resume();
    this.isPlaying = true;
    this.currentTimeMs = Number(timeMs) || 0;
    this.playbackRate = Number(playbackRate) || 1;
    for (const track of this.tracks.values()) {
      this._startTrack(track, this.currentTimeMs, this.playbackRate);
    }
  }

  pause() {
    this.isPlaying = false;
    this.stopAll();
  }

  seek(timeMs, playbackRate = 1, isPlaying = false) {
    this.currentTimeMs = Number(timeMs) || 0;
    this.playbackRate = Number(playbackRate) || 1;
    this.stopAll();
    if (isPlaying) {
      this.play(this.currentTimeMs, this.playbackRate);
    } else {
      for (const track of this.tracks.values()) {
        this._updateTrackGain(track, this.currentTimeMs);
      }
    }
  }

  stopAll() {
    for (const track of this.tracks.values()) this._stopTrack(track);
  }

  _startTrack(track, timeMs, playbackRate) {
    this._stopTrack(track);
    if (!this.context || !track.buffer || track.muted || track.hidden) return;

    const rate = Math.max(0.0625, Math.min(4, (track.speed || 1) * (playbackRate || 1)));
    const startMs = track.startTime, endMs = track.endTime;
    if (timeMs < startMs || timeMs >= endMs) return;

    const sourceOffsetSec = Math.max(0, ((track.inTime || 0) + (timeMs - startMs) * (track.speed || 1)) / 1000);
    const durationRemainingSec = Math.max(0, (endMs - timeMs) / 1000 / rate);
    if (sourceOffsetSec >= track.buffer.duration) return;

    try {
      const source = this.context.createBufferSource();
      source.buffer = track.buffer;
      source.playbackRate.setValueAtTime(rate, this.context.currentTime);
      this._updateTrackGain(track, timeMs);
      source.connect(track.gainNode);

      const delaySec = 0.005;
      source.start(this.context.currentTime + delaySec, sourceOffsetSec, durationRemainingSec);
      track.sourceNode = source;
      track.sourceStartTime = this.context.currentTime + delaySec;
    } catch {}
  }

  _stopTrack(track) {
    if (track.sourceNode) {
      try {
        track.sourceNode.stop();
        track.sourceNode.disconnect();
      } catch {}
      track.sourceNode = null;
    }
  }

  _updateTrackGain(track, timeMs) {
    if (!track.gainNode || !this.context) return;
    if (track.muted || track.hidden) {
      track.gainNode.gain.setValueAtTime(0, this.context.currentTime);
      return;
    }

    let g = track.volume !== undefined ? track.volume : 1;
    if (Array.isArray(track.gainPoints) && track.gainPoints.length > 0) {
      const dur = Math.max(1, track.endTime - track.startTime);
      const normTime = Math.max(0, Math.min(1, (timeMs - track.startTime) / dur));
      g = interpolateGain(track.gainPoints, normTime);
    }
    const clampedGain = Math.max(0, Math.min(2, g));
    track.gainNode.gain.setValueAtTime(clampedGain, this.context.currentTime);
  }
}

function interpolateGain(points, t) {
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
