import { LayerModel } from './LayerModel.js';
import { HierarchyResolver } from './HierarchyResolver.js';

export class SceneModel {
  constructor(data = {}) {
    this.id = data.id || `scene_${Math.random().toString(36).substring(2, 9)}`;
    this.title = data.title || data.name || 'Proyek Baru';
    this.width = Number.isFinite(data.width) && data.width > 0 ? data.width : 1080;
    this.height = Number.isFinite(data.height) && data.height > 0 ? data.height : 1920;
    this.fps = Number.isFinite(data.fps) && data.fps > 0 ? data.fps : 30;
    this.totalTime = Number.isFinite(data.totalTime) && data.totalTime >= 0
      ? data.totalTime
      : (Number.isFinite(data.duration) ? data.duration : 5000);
    this.bgcolor = Array.isArray(data.bgcolor) ? [...data.bgcolor] : [0, 0, 0, 1];
    this.exportWidth = Number.isFinite(data.exportWidth) ? data.exportWidth : 0;
    this.exportHeight = Number.isFinite(data.exportHeight) ? data.exportHeight : 0;
    this.precompose = data.precompose || '';
    this.media = Array.isArray(data.media) ? JSON.parse(JSON.stringify(data.media)) : [];
    this.audio = Array.isArray(data.audio) ? JSON.parse(JSON.stringify(data.audio)) : [];
    this.bookmarks = Array.isArray(data.bookmarks) ? [...data.bookmarks].sort((a, b) => a - b) : [];
    this.cameraViewEnabled = data.cameraViewEnabled !== false;

    this.layers = [];
    if (Array.isArray(data.layers)) {
      this.layers = data.layers.map((l) => (l instanceof LayerModel ? l : new LayerModel(l)));
    }

    this.layerById = new Map();
    this.resolveHierarchy();
  }

  get duration() {
    return this.totalTime;
  }

  set duration(value) {
    this.totalTime = Math.max(0, Number(value) || 0);
  }

  get totalFrames() {
    return Math.round((this.totalTime / 1000) * this.fps);
  }

  resolveHierarchy() {
    return HierarchyResolver.resolveHierarchy(this);
  }

  findLayer(id) {
    if (!id) return null;
    if (this.layerById && this.layerById.has(id)) {
      return this.layerById.get(id);
    }
    const stack = [...this.layers];
    while (stack.length > 0) {
      const current = stack.pop();
      if (current.id === id) return current;
      if (current.scene && Array.isArray(current.scene.layers)) {
        stack.push(...current.scene.layers);
      }
    }
    return null;
  }

  findLayerIndex(id) {
    if (!id) return -1;
    return this.layers.findIndex((l) => l.id === id);
  }

  addLayer(layerDataOrInstance, index = -1) {
    const layer = layerDataOrInstance instanceof LayerModel
      ? layerDataOrInstance
      : new LayerModel(layerDataOrInstance);

    if (index >= 0 && index <= this.layers.length) {
      this.layers.splice(index, 0, layer);
    } else {
      this.layers.push(layer);
    }

    this.resolveHierarchy();
    return layer;
  }

  removeLayer(id) {
    const index = this.findLayerIndex(id);
    if (index === -1) return null;

    const [removed] = this.layers.splice(index, 1);

    for (const layer of this.layers) {
      if (layer.parentId === id) {
        layer.parentId = '';
        layer.parentLayer = null;
      }
    }

    this.resolveHierarchy();
    return removed;
  }

  reorderLayer(id, newIndex) {
    const oldIndex = this.findLayerIndex(id);
    if (oldIndex === -1) return false;

    const targetIndex = Math.max(0, Math.min(this.layers.length - 1, newIndex));
    if (oldIndex === targetIndex) return true;

    const [layer] = this.layers.splice(oldIndex, 1);
    this.layers.splice(targetIndex, 0, layer);
    return true;
  }

  duplicateLayer(id) {
    const original = this.findLayer(id);
    if (!original) return null;

    const duplicate = original.clone();
    duplicate.label = `${original.label} Salinan`;

    const index = this.findLayerIndex(id);
    this.addLayer(duplicate, index + 1);
    return duplicate;
  }

  getActiveLayers(timeMs, options = {}) {
    const includeHidden = Boolean(options.includeHidden);
    return this.layers.filter((layer) => {
      if (!includeHidden && layer.hidden) return false;
      return layer.isActiveAt(timeMs);
    });
  }

  setLayerParent(layerId, parentId) {
    const layer = this.findLayer(layerId);
    if (!layer) return false;
    return HierarchyResolver.setLayerParent(layer, parentId, this);
  }

  removeLayerParent(layerId) {
    const layer = this.findLayer(layerId);
    if (!layer) return false;
    return HierarchyResolver.removeLayerParent(layer, this);
  }

  addMedia(mediaItem) {
    if (!mediaItem) return;
    const exists = this.media.some((m) => (
      (m.uri && m.uri === mediaItem.uri) ||
      (m.filename && m.filename === mediaItem.filename)
    ));
    if (!exists) {
      this.media.push({ ...mediaItem });
    }
  }

  addBookmark(timeMs) {
    const time = Math.max(0, Number(timeMs) || 0);
    if (!this.bookmarks.includes(time)) {
      this.bookmarks.push(time);
      this.bookmarks.sort((a, b) => a - b);
    }
  }

  removeBookmark(timeMs, toleranceMs = 20) {
    const time = Number(timeMs) || 0;
    this.bookmarks = this.bookmarks.filter((b) => Math.abs(b - time) > toleranceMs);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      width: this.width,
      height: this.height,
      fps: this.fps,
      totalTime: this.totalTime,
      bgcolor: [...this.bgcolor],
      exportWidth: this.exportWidth,
      exportHeight: this.exportHeight,
      precompose: this.precompose,
      media: JSON.parse(JSON.stringify(this.media)),
      audio: JSON.parse(JSON.stringify(this.audio)),
      bookmarks: [...this.bookmarks],
      cameraViewEnabled: this.cameraViewEnabled,
      layers: this.layers.map((l) => l.toJSON())
    };
  }

  static fromJSON(data) {
    return new SceneModel(data);
  }
}
