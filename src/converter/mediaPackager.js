const AM_PREFIX_REGEX = /^(?:am|amproj|amres|amv):/i;
const VIDEO_EXT_REGEX = /\.(mp4|webm|mov|m4v|ogv)$/i;
const AUDIO_EXT_REGEX = /\.(mp3|m4a|aac|wav|ogg|opus)$/i;
const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;

export function detectMediaKind(mime = '', filename = '') {
  const mimeType = String(mime || '').toLowerCase();
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';

  const name = String(filename || '');
  if (VIDEO_EXT_REGEX.test(name)) return 'video';
  if (AUDIO_EXT_REGEX.test(name)) return 'audio';
  if (IMAGE_EXT_REGEX.test(name)) return 'image';

  return '';
}

export function generateMediaAliases(name) {
  const input = String(name || '').trim();
  if (!input) return [];

  const aliases = new Set();
  const addVariant = (str) => {
    if (!str) return;
    const lower = str.toLowerCase();
    aliases.add(lower);
    try {
      aliases.add(decodeURIComponent(lower));
    } catch {}
  };

  addVariant(input);
  const strippedPrefix = input.replace(AM_PREFIX_REGEX, '');
  addVariant(strippedPrefix);

  const base = strippedPrefix.split(/[\\/]/).pop() || strippedPrefix;
  addVariant(base);
  addVariant(base.replace(/\.[^.]+$/, ''));

  return Array.from(aliases);
}

export class MediaRegistry {
  constructor() {
    this.refs = [];
    this.byName = new Map();
    this.aliases = new Map();
    this.createdBlobUrls = new Set();
  }

  add(entry) {
    if (!entry) return false;
    const url = entry.url || entry.src;
    const name = entry.name || (url ? String(url).split('/').pop() : '');
    if (!url || !name) return false;

    const existing = this.byName.get(name);
    if (existing) {
      existing.url = url;
      if (entry.blob) existing.blob = entry.blob;
      return false;
    }

    const kind = entry.kind || detectMediaKind(entry.mime, name);
    const item = {
      name,
      url,
      mime: String(entry.mime || ''),
      kind,
      isVideo: kind === 'video',
      isAudio: kind === 'audio',
      blob: entry.blob || null
    };

    if (url.startsWith('blob:')) {
      this.createdBlobUrls.add(url);
    }

    this.refs.push(item);
    this.byName.set(name, item);

    for (const alias of generateMediaAliases(name)) {
      if (!this.aliases.has(alias)) {
        this.aliases.set(alias, name);
      }
    }

    return true;
  }

  addAll(entries) {
    if (!Array.isArray(entries)) return 0;
    let addedCount = 0;
    for (const entry of entries) {
      if (this.add(entry)) addedCount++;
    }
    return addedCount;
  }

  list() {
    return this.refs;
  }

  has(name) {
    return this.byName.has(String(name || ''));
  }

  byFileName(name) {
    return this.byName.get(String(name || '')) || null;
  }

  find(query) {
    const trimmed = String(query || '').trim();
    if (!trimmed) return null;

    const direct = this.byName.get(trimmed);
    if (direct) return direct;

    for (const alias of generateMediaAliases(trimmed)) {
      const canonical = this.aliases.get(alias);
      if (canonical) {
        const found = this.byName.get(canonical);
        if (found) return found;
      }
    }
    return null;
  }

  candidates(kind, usedSet = new Set()) {
    return this.refs.filter((ref) => ref.kind === kind && !usedSet.has(ref.name));
  }

  matchLayerMedia(layerUri, filename, type, usedSet = new Set()) {
    const byUri = layerUri ? this.find(layerUri) : null;
    if (byUri) return byUri;

    const byName = filename ? this.find(filename) : null;
    if (byName) return byName;

    const kind = detectMediaKind(type, filename || layerUri);
    if (!kind || kind === 'audio') return null;

    const cand = this.candidates(kind, usedSet);
    return cand.length === 1 ? cand[0] : null;
  }

  clear() {
    for (const url of this.createdBlobUrls) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
    this.createdBlobUrls.clear();
    this.refs = [];
    this.byName.clear();
    this.aliases.clear();
  }
}

export async function downloadMediaBlob(url, onProgress = null, signal = null) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL unduhan media tidak valid');
  }

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Gagal mengunduh media HTTP ${res.status}`);
  }

  const contentLength = Number(res.headers.get('content-length')) || 0;
  const mime = res.headers.get('content-type') || 'application/octet-stream';

  if (!onProgress || !res.body || typeof ReadableStream === 'undefined') {
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    return {
      blob,
      objectUrl,
      size: blob.size,
      mime: blob.type || mime,
      name: url.split('/').pop() || 'media.bin'
    };
  }

  const reader = res.body.getReader();
  const chunks = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.length;
    if (contentLength > 0) {
      onProgress({
        loaded: receivedBytes,
        total: contentLength,
        percent: Math.min(100, Math.round((receivedBytes / contentLength) * 100))
      });
    }
  }

  const blob = new Blob(chunks, { type: mime });
  const objectUrl = URL.createObjectURL(blob);

  return {
    blob,
    objectUrl,
    size: blob.size,
    mime,
    name: url.split('/').pop() || 'media.bin'
  };
}

export async function downloadMediaBlobs(mediaList, options = {}) {
  const { concurrency = 4, onProgress = null, signal = null } = options;
  if (!Array.isArray(mediaList) || mediaList.length === 0) {
    return new Map();
  }

  const results = new Map();
  let completed = 0;
  let cursor = 0;

  const runWorker = async () => {
    while (cursor < mediaList.length) {
      if (signal?.aborted) break;
      const index = cursor++;
      const item = mediaList[index];
      const targetUrl = typeof item === 'string' ? item : item?.url || item?.src;
      const name = (typeof item === 'object' && item?.name) ? item.name : targetUrl.split('/').pop();

      try {
        const downloaded = await downloadMediaBlob(targetUrl, null, signal);
        results.set(name, {
          name,
          ...downloaded,
          kind: detectMediaKind(downloaded.mime, name)
        });
      } catch (err) {
        results.set(name, {
          name,
          error: err.message,
          failed: true
        });
      } finally {
        completed++;
        if (onProgress) {
          onProgress({
            completed,
            total: mediaList.length,
            percent: Math.round((completed / mediaList.length) * 100)
          });
        }
      }
    }
  };

  const pool = Array.from({ length: Math.min(concurrency, mediaList.length) }, () => runWorker());
  await Promise.all(pool);
  return results;
}

export function createProjectPackage({ title = 'Proyek OpenMotion', xml = '', media = [], isTemplate = false, metadata = {} }) {
  if (!xml) {
    throw new Error('XML proyek tidak boleh kosong untuk membuat paket');
  }

  const packageData = {
    format: 'openmotion-package',
    version: '1.0',
    title,
    isTemplate: Boolean(isTemplate),
    exportedAt: new Date().toISOString(),
    xml,
    media: Array.isArray(media) ? media.map((m) => ({
      name: m.name,
      url: m.url || m.src || '',
      mime: m.mime || '',
      kind: m.kind || detectMediaKind(m.mime, m.name)
    })) : [],
    metadata
  };

  const jsonString = JSON.stringify(packageData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  return {
    packageData,
    jsonString,
    blob,
    filename: `${title.replace(/[\/\\:*?"<>|]/g, '_')}${isTemplate ? '.amtemplate' : '.amproject'}`
  };
}

export async function parseProjectPackage(source) {
  let text = '';
  if (typeof source === 'string') {
    text = source;
  } else if (source instanceof Blob || source instanceof File) {
    text = await source.text();
  } else {
    throw new Error('Format sumber paket proyek tidak didukung');
  }

  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Berkas paket bukan format JSON yang valid');
  }

  if (!parsed || typeof parsed !== 'object' || !parsed.xml) {
    throw new Error('Berkas paket tidak memiliki data scene XML');
  }

  return {
    title: parsed.title || parsed.name || 'Proyek Impor',
    xml: parsed.xml,
    media: Array.isArray(parsed.media) ? parsed.media : [],
    isTemplate: Boolean(parsed.isTemplate),
    exportedAt: parsed.exportedAt || null,
    metadata: parsed.metadata || {}
  };
}

export function revokeBlobUrls(urls = []) {
  if (!Array.isArray(urls)) return;
  for (const url of urls) {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
  }
}
