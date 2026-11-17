const defaultMediabunnyLoader = () => import('https://cdn.jsdelivr.net/npm/mediabunny@1.55.6/+esm');
let mediabunnyLoader = defaultMediabunnyLoader;
let mediabunnyPromise = null;

export function setMediabunnyLoader(loader) {
  mediabunnyLoader = typeof loader === 'function' ? loader : defaultMediabunnyLoader;
  mediabunnyPromise = null;
}

export async function loadMediabunny() {
  if (!mediabunnyPromise) {
    mediabunnyPromise = mediabunnyLoader();
  }
  return mediabunnyPromise;
}

export class MediabunnyMuxer {
  constructor({ fps = 30 } = {}, mb) {
    this.mb = mb;
    this.fps = fps;
    this.output = new mb.Output({
      format: new mb.Mp4OutputFormat(),
      target: new mb.BufferTarget()
    });
    this.videoSource = null;
    this.audioSource = null;
    this.queuePromise = Promise.resolve();
    this.lastError = null;
    this.videoFrames = 0;
    this.audioPackets = 0;
    this.videoBytesTotal = 0;
    this.audioBytesTotal = 0;
  }

  static async create({ fps = 30 } = {}) {
    const mb = await loadMediabunny();
    return new MediabunnyMuxer({ fps }, mb);
  }

  addVideoTrack() {
    this.videoSource = new this.mb.EncodedVideoPacketSource('avc');
    this.output.addVideoTrack(this.videoSource, {
      frameRate: this.fps
    });
  }

  addAudioTrack() {
    this.audioSource = new this.mb.EncodedAudioPacketSource('aac');
    this.output.addAudioTrack(this.audioSource);
  }

  async start() {
    await this.output.start();
  }

  queueFrame(chunk, metadata) {
    this.videoFrames++;
    this.videoBytesTotal += chunk.byteLength || 0;
    const packet = this.mb.EncodedPacket.fromEncodedChunk(chunk);
    this.queuePromise = this.queuePromise
      .then(() => this.videoSource.add(packet, metadata))
      .catch((err) => {
        if (!this.lastError) this.lastError = err;
      });
    return this.queuePromise;
  }

  queueAudioPacket(chunk, metadata) {
    this.audioPackets++;
    this.audioBytesTotal += chunk.byteLength || 0;
    const packet = this.mb.EncodedPacket.fromEncodedChunk(chunk);
    this.queuePromise = this.queuePromise
      .then(() => this.audioSource.add(packet, metadata))
      .catch((err) => {
        if (!this.lastError) this.lastError = err;
      });
    return this.queuePromise;
  }

  get frameCount() {
    return this.videoFrames;
  }

  get audioCount() {
    return this.audioPackets;
  }

  get hasAudio() {
    return !!this.audioSource;
  }

  get byteLength() {
    return this.videoBytesTotal;
  }

  get audioByteLength() {
    return this.audioBytesTotal;
  }

  async drain() {
    await this.queuePromise;
    if (this.lastError) {
      throw this.lastError;
    }
  }

  cancel() {
    this.queuePromise = this.queuePromise.catch(() => {});
    try {
      if (this.output && typeof this.output.cancel === 'function') {
        return this.output.cancel();
      }
    } catch {}
    return Promise.resolve();
  }

  async finish() {
    await this.drain();
    await this.output.finalize();
    return this.output.target.buffer;
  }
}
