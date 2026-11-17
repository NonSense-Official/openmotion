import { ShapeRasterizer } from './ShapeRasterizer.js';
import { TextRasterizer } from './TextRasterizer.js';

export class LayerRasterizerCache {
  constructor() {
    this.shapeRasterizer = new ShapeRasterizer();
    this.textRasterizer = new TextRasterizer();
    this.cache = new Map();
  }

  computeShapeKey(layer) {
    const p = layer.shapeProps || {};
    return [
      layer.id,
      layer.shapeType || '.rect',
      layer.width || 0,
      layer.height || 0,
      JSON.stringify(layer.fill || layer.color || ''),
      JSON.stringify(layer.stroke || ''),
      layer.strokeWidth || 0,
      p.radius ?? '',
      p.points ?? '',
      p.innerRadius ?? ''
    ].join(':');
  }

  computeTextKey(layer) {
    return [
      layer.id,
      layer.text || '',
      layer.fontSize || 24,
      layer.font || 'Roboto',
      layer.align || 'center',
      layer.width || 0,
      layer.height || 0,
      JSON.stringify(layer.fill || layer.color || '')
    ].join(':');
  }

  rasterizeShape(layer, sceneW, sceneH) {
    const key = this.computeShapeKey(layer);
    const cached = this.cache.get(key);
    if (cached) return cached;

    const w = layer.width || sceneW || 720;
    const h = layer.height || sceneH || 1280;

    let res = null;
    try {
      res = this.shapeRasterizer.rasterize(layer, { width: w, height: h });
    } catch {}

    const canvas = res?.canvas || null;
    if (canvas) {
      this.cache.set(key, canvas);
    }
    return canvas;
  }

  rasterizeText(layer, sceneW, sceneH) {
    const key = this.computeTextKey(layer);
    const cached = this.cache.get(key);
    if (cached) return cached;

    const w = layer.width || sceneW || 720;
    const h = layer.height || sceneH || 1280;

    let res = null;
    try {
      res = this.textRasterizer.rasterize(layer, { width: w, height: h, maxWidth: w });
    } catch {}

    const canvas = res?.canvas || null;
    if (canvas) {
      this.cache.set(key, canvas);
    }
    return canvas;
  }

  clear() {
    this.cache.clear();
  }
}
