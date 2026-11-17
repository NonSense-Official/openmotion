import { LayerCompositor } from './LayerCompositor.js';
import { HierarchyResolver } from '../scene/HierarchyResolver.js';
import { TransformResolver } from './TransformResolver.js';
import { LayerRasterizerCache } from './LayerRasterizerCache.js';
import { MediaAssetLoader } from './MediaAssetLoader.js';

export class WebGLRenderer {
  constructor(canvas, options = {}) {
    if (!canvas) {
      throw new Error('WebGLRenderer requires a canvas element or OffscreenCanvas');
    }
    this.canvas = canvas;
    const glOptions = {
      alpha: options.alpha ?? true,
      antialias: options.antialias ?? false,
      depth: options.depth ?? false,
      stencil: options.stencil ?? false,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? true,
      premultipliedAlpha: options.premultipliedAlpha ?? true,
      powerPreference: options.powerPreference || 'high-performance'
    };

    this.gl2 = !options.forceWebGL1 && typeof canvas.getContext === 'function'
      ? canvas.getContext('webgl2', glOptions)
      : null;
    this.gl = this.gl2 || (typeof canvas.getContext === 'function'
      ? canvas.getContext('webgl', glOptions) || canvas.getContext('experimental-webgl', glOptions)
      : null);

    if (!this.gl) throw new Error('WebGL not supported');

    this.isWebGL2 = Boolean(this.gl2);
    this.compositor = new LayerCompositor(this.gl, this.isWebGL2);
    this.rasterizerCache = new LayerRasterizerCache();
    this.mediaLoader = new MediaAssetLoader();

    this.width = canvas.width || 1280;
    this.height = canvas.height || 720;
    this.clearColor = [0.035, 0.039, 0.055, 1.0];
    this.scene = null;
    this.textures = new Map();
    this.renderTargets = new Map();
    this.placeholderTexture = this.createPlaceholderTexture();
    this.setSize(this.width, this.height);
  }

  createPlaceholderTexture() {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }

  setSize(width, height) {
    this.width = Math.max(1, Math.round(width));
    this.height = Math.max(1, Math.round(height));
    if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
    this.gl.viewport(0, 0, this.width, this.height);
  }

  getSize() {
    return { width: this.width, height: this.height };
  }

  parseColor(color) {
    if (!color) return this.clearColor;
    if (Array.isArray(color) && color.length >= 3) {
      const s = color[0] > 1 || color[1] > 1 || color[2] > 1 ? 1 / 255 : 1;
      return [color[0] * s, color[1] * s, color[2] * s, color[3] !== undefined ? color[3] * (color[3] > 1 ? 1 / 255 : 1) : 1.0];
    }
    if (typeof color === 'string') {
      const hex = color.trim().replace(/^#/, '');
      if (hex.length === 6 || hex.length === 8) {
        const num = parseInt(hex, 16);
        return hex.length === 6
          ? [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255, 1.0]
          : [((num >> 24) & 255) / 255, ((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
      }
    }
    return this.clearColor;
  }

  clear(color = null) {
    const gl = this.gl;
    const c = color ? this.parseColor(color) : this.clearColor;
    gl.clearColor(c[0], c[1], c[2], c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  getTexture(key) {
    const entry = this.textures.get(key);
    return entry ? entry.texture : null;
  }

  hasTexture(key) {
    return this.textures.has(key);
  }

  getSourceDimensions(source) {
    if (!source) return { width: 0, height: 0 };
    if (typeof source.videoWidth === 'number' && source.videoWidth > 0) {
      return { width: source.videoWidth, height: source.videoHeight };
    }
    if (typeof source.naturalWidth === 'number' && source.naturalWidth > 0) {
      return { width: source.naturalWidth, height: source.naturalHeight };
    }
    if (typeof source.width === 'number' && typeof source.height === 'number') {
      return { width: source.width, height: source.height };
    }
    return { width: 0, height: 0 };
  }

  createTexture(key, source, options = {}) {
    const gl = this.gl;
    this.deleteTexture(key);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha ?? true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flipY ?? false);

    const wrap = options.wrapRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    const filter = options.nearest ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

    const dims = this.getSourceDimensions(source);
    let width = dims.width || options.width || 0;
    let height = dims.height || options.height || 0;

    try {
      if (source && (width > 0 && height > 0 || source.tagName === 'VIDEO')) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      } else if (source && source instanceof Uint8Array && width > 0 && height > 0) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
      } else if (width > 0 && height > 0) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
    } catch {}

    this.textures.set(key, { texture, width, height });
    return texture;
  }

  updateTexture(key, source) {
    const entry = this.textures.get(key);
    if (!entry) return this.createTexture(key, source);

    const dims = this.getSourceDimensions(source);
    if (dims.width > 0 && dims.height > 0) {
      if (dims.width === entry.width && dims.height === entry.height) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, entry.texture);
        try {
          this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
          return entry.texture;
        } catch {}
      }
    }
    return this.createTexture(key, source);
  }

  deleteTexture(key) {
    const entry = this.textures.get(key);
    if (entry) {
      this.gl.deleteTexture(entry.texture);
      this.textures.delete(key);
    }
  }

  clearTextureCache() {
    for (const entry of this.textures.values()) this.gl.deleteTexture(entry.texture);
    this.textures.clear();
  }

  getRenderTarget(key, width, height) {
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    const existing = this.renderTargets.get(key);
    if (existing && existing.width === w && existing.height === h) return existing;

    this.deleteRenderTarget(key);
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const rt = { fbo, texture: tex, width: w, height: h };
    this.renderTargets.set(key, rt);
    return rt;
  }

  bindRenderTarget(target = null) {
    const gl = this.gl;
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.width, target.height);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.width, this.height);
    }
  }

  deleteRenderTarget(key) {
    const rt = this.renderTargets.get(key);
    if (rt) {
      this.gl.deleteFramebuffer(rt.fbo);
      this.gl.deleteTexture(rt.texture);
      this.renderTargets.delete(key);
    }
  }

  clearRenderTargets() {
    for (const rt of this.renderTargets.values()) {
      this.gl.deleteFramebuffer(rt.fbo);
      this.gl.deleteTexture(rt.texture);
    }
    this.renderTargets.clear();
  }

  setScene(scene) {
    this.scene = scene;
    if (scene) {
      if (!scene.layerById || scene.layerById.size === 0) HierarchyResolver.resolveHierarchy(scene);
      if (scene.id || scene.packageId) this.mediaLoader.setProjectId(scene.id, scene.packageId);
      if (scene.width && scene.height) this.setSize(scene.width, scene.height);
    }
  }

  getScene() {
    return this.scene;
  }

  async prepareMedia(timeMs) {
    return await this.mediaLoader.prepareMediaAtTime(this.scene, timeMs);
  }

  playMedia() {
    this.mediaLoader.playVideos();
  }

  pauseMedia() {
    this.mediaLoader.pauseVideos();
  }

  resolveLayerTexture(layer, sceneW, sceneH, timeMs = 0) {
    const hasMedia = Boolean(layer.fillVideo || layer.fillImage || layer.mediaName || (layer.fillType === 'media'));
    const isText = layer.tag === 'text' || layer.text != null;
    const isShape = (layer.tag === 'shape' || layer.shapeType || layer.points) && !hasMedia;

    if (hasMedia) {
      const media = this.mediaLoader.getMediaForLayer(layer);
      if (media && media.element) {
        if (media.type === 'video') {
          const video = media.element;
          const start = layer.startTime ?? 0;
          const inSec = (layer.inTime || 0) / 1000;
          const targetSec = Math.max(0, (timeMs - start) / 1000 + inSec);
          if (video.paused) {
            if (Math.abs(video.currentTime - targetSec) > 0.04) {
              try { video.currentTime = targetSec; } catch {}
            }
          } else {
            if (Math.abs(video.currentTime - targetSec) > 0.25) {
              try { video.currentTime = targetSec; } catch {}
            }
          }
        }
        const key = `media_${layer.id}_${media.type}`;
        return this.updateTexture(key, media.element);
      }
    } else if (isText) {
      const canvas = this.rasterizerCache.rasterizeText(layer, sceneW, sceneH);
      if (canvas) return this.updateTexture(`text_${layer.id}`, canvas);
    } else if (isShape) {
      const canvas = this.rasterizerCache.rasterizeShape(layer, sceneW, sceneH);
      if (canvas) return this.updateTexture(`shape_${layer.id}`, canvas);
    }

    return layer.texture
      || layer.cachedTexture
      || (layer.id ? this.getTexture(layer.id) : null)
      || this.placeholderTexture;
  }

  renderAt(timeMs, sceneOverride = null) {
    const scene = sceneOverride || this.scene;
    if (!scene) {
      this.clear();
      return;
    }

    const sceneW = scene.width || this.width;
    const sceneH = scene.height || this.height;

    this.bindRenderTarget(null);
    this.clear(scene.bgcolor);

    const layerById = scene.layerById || HierarchyResolver.buildLayerMap(scene);
    const layers = scene.layers || [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.hidden) continue;
      if (layer.tag === 'audio' || layer.tag === 'nullobj' || layer.tag === 'camera') continue;

      const start = layer.startTime ?? 0;
      const end = layer.endTime ?? Infinity;
      if (timeMs < start || timeMs > end) continue;

      const { matrix, opacity, normTime } = TransformResolver.computeWorldMatrix(layer, timeMs, sceneW, sceneH, layerById);
      if (opacity <= 0.001) continue;

      let layerW = layer.width;
      let layerH = layer.height;
      if (!layerW || !layerH) {
        if (layer.size) {
          const sz = TransformResolver.evalChannel(layer.size, timeMs, normTime);
          if (Array.isArray(sz) && sz[0] > 0 && sz[1] > 0) {
            layerW = sz[0] * 2;
            layerH = sz[1] * 2;
          }
        }
      }
      if (!layerW || !layerH) {
        if (layer.shapeProps?.size) {
          const sz = TransformResolver.evalChannel(layer.shapeProps.size.channel, timeMs, normTime);
          if (Array.isArray(sz) && sz[0] > 0 && sz[1] > 0) {
            layerW = sz[0] * 2;
            layerH = sz[1] * 2;
          }
        }
      }
      if (!layerW || !layerH) {
        if (layer.fillType === 'media' || layer.fillVideo || layer.fillImage || layer.mediaName) {
          layerW = sceneW;
          layerH = sceneH;
        }
      }
      layerW = layerW || 100;
      layerH = layerH || 100;

      const texture = this.resolveLayerTexture(layer, sceneW, sceneH, timeMs);
      if (!texture) continue;

      const transform = TransformResolver.computeShaderTransform(matrix, layerW, layerH, sceneW, sceneH);
      this.compositor.drawLayer(texture, {
        transform,
        opacity,
        blendMode: layer.blendMode || 'normal'
      });
    }
  }

  dispose() {
    this.clearTextureCache();
    this.clearRenderTargets();
    this.rasterizerCache.clear();
    this.mediaLoader.dispose();
    if (this.placeholderTexture) {
      this.gl.deleteTexture(this.placeholderTexture);
      this.placeholderTexture = null;
    }
    if (this.compositor) {
      this.compositor.dispose();
      this.compositor = null;
    }
    this.scene = null;
  }
}
