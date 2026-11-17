const SAMPLE_PRESET_IMAGES = [
  '/preset/12w4v1.jpg',
  '/preset/13qsyx.jpg',
  '/preset/e43rss.jpg',
  '/preset/mvz3k2.jpg',
  '/preset/vvz8is.jpg'
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export class MediaAssetLoader {
  constructor(options = {}) {
    this.projectId = options.projectId || '';
    this.basePath = options.basePath || '/preset/';
    this.cache = new Map();
    this.videoElements = new Set();
    this.mediaMode = 'preview';
  }

  setProjectId(projectId, packageId = null) {
    this.projectId = projectId || '';
    if (packageId) this.packageId = packageId;
  }

  setMediaMode(mode) {
    this.mediaMode = mode === 'export' ? 'export' : 'preview';
  }

  getSampleFallback(uri = '') {
    const idx = hashString(String(uri)) % SAMPLE_PRESET_IMAGES.length;
    return SAMPLE_PRESET_IMAGES[idx];
  }

  resolveUrl(uri) {
    if (!uri || typeof uri !== 'string') return this.getSampleFallback('');
    let clean = uri.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:') || clean.startsWith('data:')) {
      return clean;
    }
    if (clean.startsWith('content://') || clean.startsWith('file://') || clean.startsWith('android.resource://')) {
      return this.getSampleFallback(clean);
    }
    if (clean.startsWith('amproj:')) {
      clean = clean.slice(7);
    }
    const cleanName = clean.replace(/^[./\\]+/, '');
    const pid = this.packageId || this.projectId;
    if (pid) {
      return `/api/media?pid=${encodeURIComponent(pid)}&name=${encodeURIComponent(cleanName)}`;
    }
    return `${this.basePath}${encodeURIComponent(cleanName)}`;
  }

  isVideoUri(uri) {
    if (!uri || typeof uri !== 'string') return false;
    return /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i.test(uri);
  }

  getMediaKey(layer) {
    return layer.mediaName || layer.fillVideo || layer.fillImage || layer.uri || '';
  }

  loadMedia(uri, isVideo = false) {
    const key = uri;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const resolvedUrl = this.resolveUrl(uri);
    const fallbackUrl = this.getSampleFallback(uri);

    if (isVideo || this.isVideoUri(uri)) {
      if (typeof document === 'undefined') return null;
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = 'auto';
      video.src = resolvedUrl;

      const record = { type: 'video', element: video, ready: false, width: 0, height: 0, failed: false };
      video.addEventListener('loadedmetadata', () => {
        record.ready = true;
        record.width = video.videoWidth || 1280;
        record.height = video.videoHeight || 720;
      }, { once: true });
      video.addEventListener('error', () => {
        record.failed = true;
        record.ready = false;
        if (!video._didFallback) {
          video._didFallback = true;
          this.loadFallbackImage(key, record, fallbackUrl);
        }
      }, { once: true });

      this.videoElements.add(video);
      this.cache.set(key, record);
      return record;
    }

    if (typeof Image === 'undefined') return null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const record = { type: 'image', element: img, ready: false, width: 0, height: 0 };

    img.onload = () => {
      record.ready = true;
      record.width = img.naturalWidth || 1280;
      record.height = img.naturalHeight || 720;
    };
    img.onerror = () => {
      if (!img._didFallback) {
        img._didFallback = true;
        img.src = fallbackUrl;
      } else {
        record.ready = false;
      }
    };
    img.src = resolvedUrl;

    this.cache.set(key, record);
    return record;
  }

  loadFallbackImage(key, record, fallbackUrl) {
    if (typeof Image === 'undefined') return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      record.type = 'image';
      record.element = img;
      record.ready = true;
      record.width = img.naturalWidth || 1280;
      record.height = img.naturalHeight || 720;
    };
    img.src = fallbackUrl;
  }

  getMediaForLayer(layer) {
    const key = this.getMediaKey(layer);
    if (!key) return null;
    const isVideo = Boolean(layer.fillVideo) || layer.fillType === 'video' || this.isVideoUri(key);
    return this.loadMedia(key, isVideo);
  }

  async prepareMediaAtTime(scene, timeMs) {
    if (!scene || !scene.layers) return 0;
    const promises = [];

    for (const layer of scene.layers) {
      if (layer.hidden) continue;
      const start = layer.startTime ?? 0;
      const end = layer.endTime ?? Infinity;
      if (timeMs < start || timeMs > end) continue;

      const key = this.getMediaKey(layer);
      if (!key) continue;

      const media = this.getMediaForLayer(layer);
      if (media && media.type === 'video' && media.element) {
        const video = media.element;
        const targetSec = Math.max(0, (timeMs - start + (layer.inTime || 0)) / 1000);
        if (Math.abs(video.currentTime - targetSec) > 0.04) {
          promises.push(
            new Promise((resolve) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                resolve();
              };
              video.addEventListener('seeked', onSeeked, { once: true });
              try {
                video.currentTime = targetSec;
              } catch {
                resolve();
              }
            })
          );
        }
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
    return promises.length;
  }

  playVideos() {
    for (const video of this.videoElements) {
      try {
        video.play().catch(() => {});
      } catch {}
    }
  }

  pauseVideos() {
    for (const video of this.videoElements) {
      try {
        video.pause();
      } catch {}
    }
  }

  dispose() {
    this.pauseVideos();
    for (const video of this.videoElements) {
      video.src = '';
      video.load();
    }
    this.videoElements.clear();
    this.cache.clear();
  }
}
