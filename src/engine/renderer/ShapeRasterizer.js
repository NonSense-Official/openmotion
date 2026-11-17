function formatColor(color, defaultColor = 'rgba(255, 255, 255, 1)') {
  if (!color) return defaultColor;
  if (typeof color === 'string') return color;
  if (Array.isArray(color)) {
    const r = Math.round(Math.max(0, Math.min(1, color[0] ?? 1)) * 255);
    const g = Math.round(Math.max(0, Math.min(1, color[1] ?? 1)) * 255);
    const b = Math.round(Math.max(0, Math.min(1, color[2] ?? 1)) * 255);
    const a = color[3] !== undefined ? Math.max(0, Math.min(1, color[3])) : 1;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  }
  if (typeof color === 'number') {
    const a = ((color >>> 24) & 255) / 255;
    const r = (color >>> 16) & 255;
    const g = (color >>> 8) & 255;
    const b = color & 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  }
  return defaultColor;
}

function createOffscreenCanvas(width, height) {
  const w = Math.max(1, Math.ceil(width));
  const h = Math.max(1, Math.ceil(height));
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }
  return null;
}

function parseSvgPath(pathStr) {
  if (!pathStr || typeof pathStr !== 'string') return [];
  const commands = [];
  const regex = /([a-df-z])\s*([^a-df-z]*)/gi;
  let match;
  while ((match = regex.exec(pathStr)) !== null) {
    const type = match[1].toUpperCase();
    const numbers = match[2].trim().split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n));
    commands.push([type, ...numbers]);
  }
  return commands;
}

export class ShapeRasterizer {
  constructor() {
    this.shapeDefs = new Map();
  }

  registerShapeDef(type, def) {
    if (type && def) this.shapeDefs.set(type, def);
  }

  executeCommands(ctx, commands, scale = 1) {
    ctx.beginPath();
    for (const cmd of commands) {
      const type = cmd[0];
      if (type === 'M') ctx.moveTo(cmd[1] * scale, cmd[2] * scale);
      else if (type === 'L') ctx.lineTo(cmd[1] * scale, cmd[2] * scale);
      else if (type === 'C') ctx.bezierCurveTo(cmd[1] * scale, cmd[2] * scale, cmd[3] * scale, cmd[4] * scale, cmd[5] * scale, cmd[6] * scale);
      else if (type === 'Q') ctx.quadraticCurveTo(cmd[1] * scale, cmd[2] * scale, cmd[3] * scale, cmd[4] * scale);
      else if (type === 'Z') ctx.closePath();
    }
  }

  buildPath(ctx, layer, width, height, scale = 1) {
    const type = layer.shapeType || '.rect';
    const w = width * scale;
    const h = height * scale;

    const customDef = this.shapeDefs.get(type);
    if (customDef && typeof customDef.getPath === 'function') {
      try {
        const cmds = customDef.getPath(layer.shapeProps || layer);
        if (cmds && cmds.length) {
          this.executeCommands(ctx, cmds, scale);
          return;
        }
      } catch {}
    }

    if (layer.path) {
      const cmds = Array.isArray(layer.path.commands)
        ? layer.path.commands
        : (typeof layer.path === 'string' ? parseSvgPath(layer.path) : (layer.path.d ? parseSvgPath(layer.path.d) : null));
      if (cmds && cmds.length) {
        this.executeCommands(ctx, cmds, scale);
        return;
      }
    }

    if (type === '.circle' || type === 'circle' || type === '.ellipse' || type === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(0.5, w / 2), Math.max(0.5, h / 2), 0, 0, Math.PI * 2);
      return;
    }

    if (type === '.pie' || type === 'pie') {
      const startRad = ((layer.startAngle || 0) * Math.PI) / 180;
      const endRad = ((layer.endAngle !== undefined ? layer.endAngle : 360) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.ellipse(0, 0, Math.max(0.5, w / 2), Math.max(0.5, h / 2), 0, startRad, endRad, false);
      ctx.closePath();
      return;
    }

    if (type === '.roundrect' || type === 'roundrect' || ((type === '.rect' || type === 'rect') && layer.cornerRadius > 0)) {
      const radius = Math.min((layer.cornerRadius || 0) * scale, Math.min(w, h) / 2);
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function' && radius > 0) {
        ctx.roundRect(-w / 2, -h / 2, w, h, radius);
      } else if (radius > 0) {
        const x = -w / 2;
        const y = -h / 2;
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
      } else {
        ctx.rect(-w / 2, -h / 2, w, h);
      }
      return;
    }

    if (type === '.star' || type === 'star') {
      const points = Math.max(3, layer.points || 5);
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * (layer.innerRadius || 0.4);
      const step = Math.PI / points;
      ctx.beginPath();
      for (let i = 0; i < 2 * points; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * step) - (Math.PI / 2);
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      return;
    }

    if (type === '.poly' || type === 'poly' || type === '.triangle' || type === 'triangle' || type === '.penta' || type === 'penta') {
      const sides = (type === '.triangle' || type === 'triangle') ? 3 : ((type === '.penta' || type === 'penta') ? 5 : Math.max(3, layer.points || 5));
      const rx = Math.max(0.5, w / 2);
      const ry = Math.max(0.5, h / 2);
      const step = (Math.PI * 2) / sides;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * step) - (Math.PI / 2);
        const px = Math.cos(angle) * rx;
        const py = Math.sin(angle) * ry;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      return;
    }

    if (type === '.line' || type === 'line') {
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      return;
    }

    ctx.beginPath();
    ctx.rect(-w / 2, -h / 2, w, h);
  }

  createGradient(ctx, gradient, width, height) {
    if (!gradient) return '#ffffff';
    const sx = (gradient.start ? gradient.start[0] : (gradient.type === 'radial' ? 0.5 : 0)) * width - width / 2;
    const sy = (gradient.start ? gradient.start[1] : (gradient.type === 'radial' ? 0.5 : 0)) * height - height / 2;
    const ex = (gradient.end ? gradient.end[0] : (gradient.type === 'radial' ? 0.5 : 1)) * width - width / 2;
    const ey = (gradient.end ? gradient.end[1] : (gradient.type === 'radial' ? 0.5 : 0)) * height - height / 2;

    const grad = gradient.type === 'radial'
      ? ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(0.001, Math.hypot(ex - sx, ey - sy)))
      : ctx.createLinearGradient(sx, sy, ex, ey);

    if (gradient.stops && gradient.stops.length > 0) {
      for (const stop of gradient.stops) {
        grad.addColorStop(Math.max(0, Math.min(1, stop.t ?? 0)), formatColor(stop.color));
      }
    } else {
      grad.addColorStop(0, formatColor(gradient.startColor || '#ffffff'));
      grad.addColorStop(1, formatColor(gradient.endColor || '#000000'));
    }
    return grad;
  }

  applyShadow(ctx, layer, scale = 1) {
    const isShadowOn = layer.shadowEnabled !== undefined
      ? !!layer.shadowEnabled
      : !!(layer.shadow && layer.shadow.enabled !== false && (layer.shadow.size > 0 || (layer.shadow.offset && (layer.shadow.offset[0] || layer.shadow.offset[1]))));

    if (!isShadowOn) return false;

    const radius = (layer.shadowRadius !== undefined ? Number(layer.shadowRadius) : (layer.shadow ? Number(layer.shadow.size) : 0)) * scale;
    const offsetX = (layer.shadowX !== undefined ? Number(layer.shadowX) : (layer.shadow && layer.shadow.offset ? layer.shadow.offset[0] : 0)) * scale;
    const offsetY = (layer.shadowY !== undefined ? Number(layer.shadowY) : (layer.shadow && layer.shadow.offset ? layer.shadow.offset[1] : 0)) * scale;
    const alpha = layer.shadowAlpha !== undefined ? Number(layer.shadowAlpha) / 100 : (layer.shadow && layer.shadow.color ? layer.shadow.color[3] : 0.6);
    const rawColor = layer.shadowColor || (layer.shadow && layer.shadow.color) || [0, 0, 0, 1];

    ctx.shadowColor = Array.isArray(rawColor)
      ? `rgba(${Math.round(Math.max(0, Math.min(1, rawColor[0] ?? 0)) * 255)}, ${Math.round(Math.max(0, Math.min(1, rawColor[1] ?? 0)) * 255)}, ${Math.round(Math.max(0, Math.min(1, rawColor[2] ?? 0)) * 255)}, ${((rawColor[3] ?? 1) * Math.max(0, Math.min(1, alpha))).toFixed(3)})`
      : String(rawColor || 'rgba(0,0,0,0.6)');
    ctx.shadowBlur = radius;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    return true;
  }

  drawStroke(ctx, layer, width, height, scale = 1) {
    const isStrokeOn = layer.strokeEnabled !== undefined ? !!layer.strokeEnabled : !!(layer.border && layer.border.size > 0);
    const strokeWidth = (layer.strokeWidth !== undefined ? Number(layer.strokeWidth) : (layer.border ? Number(layer.border.size) : 0)) * scale;
    if (!isStrokeOn || strokeWidth <= 0) return;

    const strokeColor = formatColor(layer.strokeColor || (layer.border && layer.border.color), '#ffffff');
    const strokePos = layer.strokePosition || (layer.border ? layer.border.direction : 'outside');

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = layer.strokeCap === 'square' ? 'square' : (layer.strokeCap === 'butt' ? 'butt' : 'round');
    ctx.lineJoin = layer.strokeJoin === 'bevel' ? 'bevel' : (layer.strokeJoin === 'miter' ? 'miter' : 'round');

    if (strokePos === 'inside') {
      this.buildPath(ctx, layer, width, height, scale);
      ctx.clip();
      this.buildPath(ctx, layer, width, height, scale);
      ctx.lineWidth = strokeWidth * 2;
      ctx.stroke();
    } else if (strokePos === 'outside') {
      this.buildPath(ctx, layer, width, height, scale);
      ctx.rect(-100000, -100000, 200000, 200000);
      ctx.clip('evenodd');
      this.buildPath(ctx, layer, width, height, scale);
      ctx.lineWidth = strokeWidth * 2;
      ctx.stroke();
    } else {
      this.buildPath(ctx, layer, width, height, scale);
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderToContext(ctx, layer, width, height, scale = 1) {
    const w = width * scale;
    const h = height * scale;

    if (layer.fillType !== 'none') {
      ctx.save();
      this.applyShadow(ctx, layer, scale);
      ctx.fillStyle = (layer.fillType === 'gradient' && layer.gradient)
        ? this.createGradient(ctx, layer.gradient, w, h)
        : formatColor(layer.fillColor || layer.color, 'rgba(255, 255, 255, 1)');
      this.buildPath(ctx, layer, width, height, scale);
      ctx.fill();
      ctx.restore();
    }

    this.drawStroke(ctx, layer, width, height, scale);
  }

  rasterize(layer, options = {}) {
    const scale = options.scale || 1;
    let rawW = 100;
    let rawH = 100;
    if (Array.isArray(layer.size)) {
      rawW = (layer.size[0] || 100) * 2;
      rawH = (layer.size[1] || 100) * 2;
    } else if (layer.size?.value && Array.isArray(layer.size.value)) {
      rawW = (layer.size.value[0] || 100) * 2;
      rawH = (layer.size.value[1] || 100) * 2;
    } else if (layer.width && layer.height) {
      rawW = layer.width;
      rawH = layer.height;
    }
    const padding = options.padding !== undefined ? options.padding : 16;
    const strokeWidth = (layer.strokeWidth !== undefined ? Number(layer.strokeWidth) : (layer.border ? Number(layer.border.size) : 0)) * scale;
    const width = Math.ceil((rawW * scale) + strokeWidth + (padding * 2));
    const height = Math.ceil((rawH * scale) + strokeWidth + (padding * 2));

    const canvas = createOffscreenCanvas(width, height);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    this.renderToContext(ctx, layer, rawW, rawH, scale);
    ctx.restore();

    return { canvas, ctx, width, height };
  }
}

export const shapeRasterizer = new ShapeRasterizer();
export default ShapeRasterizer;
