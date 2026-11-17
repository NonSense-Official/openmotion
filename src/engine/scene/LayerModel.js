export class LayerModel {
  constructor(data = {}) {
    this.id = data.id || `layer_${Math.random().toString(36).substring(2, 9)}`;
    this.label = data.label || data.name || 'Layer';
    this.tag = data.tag || data.type || 'shape';
    this.startTime = Number.isFinite(data.startTime) ? data.startTime : 0;
    this.endTime = Number.isFinite(data.endTime) ? data.endTime : (this.startTime + 3000);
    this.inTime = Number.isFinite(data.inTime) ? data.inTime : 0;
    this.outTime = Number.isFinite(data.outTime) ? data.outTime : 0;
    this.speed = Number.isFinite(data.speed) && data.speed > 0 ? data.speed : 1;
    this.stretch = Number.isFinite(data.stretch) && data.stretch > 0 ? data.stretch : 1;
    this.timeOffset = Number.isFinite(data.timeOffset) ? data.timeOffset : 0;
    this.freezeTime = data.freezeTime != null ? Number(data.freezeTime) : null;
    this.hidden = Boolean(data.hidden);
    this.locked = Boolean(data.locked);
    this.muted = Boolean(data.muted);
    this.parentId = data.parentId || '';
    this.parentLayer = null;
    this.children = [];
    this.blendMode = data.blendMode || data.blending || 'normal';
    this.opacity = data.opacity ? { ...data.opacity } : { value: [1], kfs: [] };
    this.transform = data.transform ? JSON.parse(JSON.stringify(data.transform)) : {
      location: { value: [0, 0, 0], kfs: [] },
      scale: { value: [1, 1], kfs: [] },
      rotation: { value: [0], kfs: [] },
      pivot: { value: [0, 0], kfs: [] },
      skew: { value: [0, 0], kfs: [] }
    };
    this.fillType = data.fillType || 'color';
    this.fillColor = Array.isArray(data.fillColor) ? [...data.fillColor] : [1, 1, 1, 1];
    this.fillImage = data.fillImage || '';
    this.fillVideo = data.fillVideo || '';
    this.mediaFillMode = data.mediaFillMode || 'fill';
    this.shapeType = data.shapeType || '';
    this.shapeProps = data.shapeProps ? { ...data.shapeProps } : {};
    this.strokes = Array.isArray(data.strokes) ? JSON.parse(JSON.stringify(data.strokes)) : [];
    this.textContent = data.textContent || '';
    this.fontSize = Number.isFinite(data.fontSize) ? data.fontSize : 24;
    this.font = data.font || '';
    this.align = data.align || 'center';
    this.letterSpacing = Number.isFinite(data.letterSpacing) ? data.letterSpacing : 0;
    this.lineSpacing = Number.isFinite(data.lineSpacing) ? data.lineSpacing : 1;
    this.effects = Array.isArray(data.effects) ? JSON.parse(JSON.stringify(data.effects)) : [];
    this.scene = data.scene || null;
    this.cameraType = data.cameraType || 'perspective';
    this.fov = Number.isFinite(data.fov) ? data.fov : 60;
    this.cameraZoom = Number.isFinite(data.cameraZoom) ? data.cameraZoom : 500;
  }

  get duration() {
    return Math.max(0, this.endTime - this.startTime);
  }

  set duration(value) {
    const validDuration = Math.max(0, Number(value) || 0);
    this.endTime = this.startTime + validDuration;
  }

  isActiveAt(time) {
    if (this.hidden) return false;
    const dur = this.endTime - this.startTime;
    if (dur <= 0) return time === this.startTime;
    return time >= this.startTime && time < this.endTime;
  }

  getInterval() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration
    };
  }

  setInterval(startTime, endTime) {
    const start = Number.isFinite(startTime) ? startTime : this.startTime;
    let end = Number.isFinite(endTime) ? endTime : this.endTime;
    if (end < start) end = start;
    this.startTime = start;
    this.endTime = end;
    return this.getInterval();
  }

  trimIn(newStart) {
    const start = Math.min(Number(newStart) || 0, this.endTime);
    this.startTime = Math.max(0, start);
    return this.getInterval();
  }

  trimOut(newEnd) {
    const end = Math.max(Number(newEnd) || 0, this.startTime);
    this.endTime = end;
    return this.getInterval();
  }

  shift(deltaMs) {
    const delta = Number(deltaMs) || 0;
    this.startTime += delta;
    this.endTime += delta;
    return this.getInterval();
  }

  getProgress(globalTime) {
    if (this.freezeTime !== null && Number.isFinite(this.freezeTime)) {
      return Math.max(0, Math.min(1, this.freezeTime));
    }
    const dur = this.endTime - this.startTime;
    if (dur <= 0) return 0;
    const progress = (globalTime - this.startTime) / dur;
    return Math.max(0, Math.min(1, progress));
  }

  getLocalTime(globalTime) {
    if (this.freezeTime !== null && Number.isFinite(this.freezeTime)) {
      const dur = this.duration;
      return (this.freezeTime * dur * this.speed) + this.inTime;
    }
    const elapsed = globalTime - this.startTime;
    const scaledTime = (elapsed * this.speed) / this.stretch;
    return scaledTime + this.inTime + this.timeOffset;
  }

  getMediaTime(globalTime) {
    return Math.max(0, this.getLocalTime(globalTime));
  }

  clone(newId = null) {
    const serialized = this.toJSON();
    serialized.id = newId || `layer_${Math.random().toString(36).substring(2, 9)}`;
    serialized.parentId = this.parentId;
    return LayerModel.fromJSON(serialized);
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      tag: this.tag,
      startTime: this.startTime,
      endTime: this.endTime,
      inTime: this.inTime,
      outTime: this.outTime,
      speed: this.speed,
      stretch: this.stretch,
      timeOffset: this.timeOffset,
      freezeTime: this.freezeTime,
      hidden: this.hidden,
      locked: this.locked,
      muted: this.muted,
      parentId: this.parentId,
      blendMode: this.blendMode,
      opacity: JSON.parse(JSON.stringify(this.opacity)),
      transform: JSON.parse(JSON.stringify(this.transform)),
      fillType: this.fillType,
      fillColor: [...this.fillColor],
      fillImage: this.fillImage,
      fillVideo: this.fillVideo,
      mediaFillMode: this.mediaFillMode,
      shapeType: this.shapeType,
      shapeProps: { ...this.shapeProps },
      strokes: JSON.parse(JSON.stringify(this.strokes)),
      textContent: this.textContent,
      fontSize: this.fontSize,
      font: this.font,
      align: this.align,
      letterSpacing: this.letterSpacing,
      lineSpacing: this.lineSpacing,
      effects: JSON.parse(JSON.stringify(this.effects)),
      cameraType: this.cameraType,
      fov: this.fov,
      cameraZoom: this.cameraZoom
    };
  }

  static fromJSON(data) {
    return new LayerModel(data);
  }
}
