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

export class TextRasterizer {
  constructor() {
    this.customFonts = new Map();
    this.measurementCanvas = null;
    this.measurementCtx = null;
  }

  registerFont(name, familyOrUrl) {
    if (name && familyOrUrl) this.customFonts.set(name, familyOrUrl);
  }

  resolveFont(fontProp, fontWeightProp, fontStyleProp) {
    let family = 'Roboto';
    let weight = fontWeightProp ? String(fontWeightProp) : 'normal';
    let style = fontStyleProp ? String(fontStyleProp) : 'normal';

    if (fontProp) {
      const cleanFont = String(fontProp).replace(/&amp;/g, '&');
      if (cleanFont.includes('googlefonts')) {
        const match = cleanFont.match(/name=([^&]+)/);
        if (match) family = decodeURIComponent(match[1]);
      } else if (cleanFont.includes('imported?name=')) {
        const match = cleanFont.match(/name=([^&]+)/);
        if (match) {
          const raw = decodeURIComponent(match[1]);
          const base = raw.replace(/\.[^/.]+$/, '');
          family = this.customFonts.get(base) || this.customFonts.get(raw) || base;
        }
      } else {
        const trimmed = cleanFont.trim();
        family = this.customFonts.get(trimmed) || trimmed;
      }
      const weightMatch = cleanFont.match(/weight=([^&]+)/);
      if (weightMatch) weight = weightMatch[1];
      if (cleanFont.includes('italic=1')) style = 'italic';
    }

    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      if (family && !family.includes('/') && family !== 'Roboto' && family !== 'sans-serif') {
        const sel = `link[data-font="${family}"]`;
        if (typeof document.querySelector === 'function' && !document.querySelector(sel)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.dataset.font = family;
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
          if (document.head) document.head.appendChild(link);
        }
      }
    }

    return { family, weight, style };
  }

  buildFontString(fontSize, family, weight, style) {
    const size = Math.max(1, fontSize || 18);
    return `${style || 'normal'} ${weight || 'normal'} ${size}px "${family || 'Roboto'}", "Roboto", sans-serif`;
  }

  getMeasurementContext() {
    if (!this.measurementCtx) {
      this.measurementCanvas = createOffscreenCanvas(100, 100);
      if (this.measurementCanvas) this.measurementCtx = this.measurementCanvas.getContext('2d');
    }
    return this.measurementCtx;
  }

  wrapLines(text, maxWidth, ctx, letterSpacing = 0) {
    const rawLines = String(text || '').split('\n');
    if (!(maxWidth > 0)) return rawLines;

    const wrapped = [];
    for (const rawLine of rawLines) {
      if (!rawLine) {
        wrapped.push('');
        continue;
      }
      const words = rawLine.split(' ');
      let cur = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const test = `${cur} ${words[i]}`;
        const measured = ctx.measureText(test).width + (test.length * letterSpacing);
        if (measured <= maxWidth) {
          cur = test;
        } else {
          wrapped.push(cur);
          cur = words[i];
        }
      }
      wrapped.push(cur);
    }
    return wrapped;
  }

  measure(layer, options = {}) {
    const ctx = options.ctx || this.getMeasurementContext();
    const scale = options.scale || 1;
    const fontSize = Math.max(1, (layer.fontSize || 18) * scale);
    const { family, weight, style } = this.resolveFont(layer.font, layer.fontWeight, layer.fontStyle);
    const fontStr = this.buildFontString(fontSize, family, weight, style);

    if (ctx) ctx.font = fontStr;

    const lineMul = layer.lineSpacing !== undefined ? Math.max(0.1, Number(layer.lineSpacing)) : 1;
    const lineHeight = fontSize * 1.2 * lineMul;
    const letterSpacing = layer.letterSpacing !== undefined ? Number(layer.letterSpacing) * fontSize : 0;
    const wrapWidth = (layer.wrapWidth && layer.wrapWidth > 0) ? layer.wrapWidth * scale : 0;
    const rawText = layer.textContent || layer.text || '';
    const lines = ctx ? this.wrapLines(rawText, wrapWidth, ctx, letterSpacing) : String(rawText).split('\n');

    let maxLineWidth = 0;
    const measuredLines = [];
    for (const lineText of lines) {
      const lineWidth = ctx ? (ctx.measureText(lineText).width + (lineText.length * letterSpacing)) : (lineText.length * fontSize * 0.6);
      if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
      measuredLines.push({ text: lineText, width: lineWidth, words: lineText ? lineText.split(' ') : [] });
    }

    return {
      width: wrapWidth > 0 ? wrapWidth : Math.max(1, maxLineWidth),
      height: Math.max(1, measuredLines.length * lineHeight),
      fontSize,
      font: fontStr,
      family,
      weight,
      style,
      lineHeight,
      letterSpacing,
      lines: measuredLines
    };
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

  drawStroke(ctx, text, x, y, strokeWidth, strokeColor, strokeCap, strokeJoin) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = strokeCap === 'square' ? 'square' : strokeCap === 'butt' ? 'butt' : 'round';
    ctx.lineJoin = strokeJoin === 'bevel' ? 'bevel' : strokeJoin === 'miter' ? 'miter' : 'round';
    ctx.strokeText(text, x, y);
    ctx.restore();
  }

  renderToContext(ctx, layer, width, height, scale = 1) {
    const metrics = this.measure(layer, { ctx, scale });
    const isJustify = layer.align === 'justify';
    const align = isJustify ? 'left' : (layer.align || 'center');
    const startY = -(metrics.lines.length * metrics.lineHeight) / 2 + metrics.lineHeight / 2;
    const alignX = (align === 'left' || isJustify) ? -width / 2 : (align === 'right' ? width / 2 : 0);

    ctx.save();
    ctx.font = metrics.font;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = formatColor(layer.fillColor || layer.color, 'rgba(255, 255, 255, 1)');

    if ('letterSpacing' in ctx && typeof ctx.letterSpacing === 'string' && metrics.letterSpacing > 0) {
      ctx.letterSpacing = `${metrics.letterSpacing}px`;
    }

    this.applyShadow(ctx, layer, scale);

    const isStrokeOn = layer.strokeEnabled !== undefined ? !!layer.strokeEnabled : !!(layer.border && layer.border.size > 0);
    const strokeWidth = (layer.strokeWidth !== undefined ? Number(layer.strokeWidth) : (layer.border ? Number(layer.border.size) : 0)) * scale;
    const strokeColor = formatColor(layer.strokeColor || (layer.border && layer.border.color), '#ffffff');

    for (let i = 0; i < metrics.lines.length; i++) {
      const lineItem = metrics.lines[i];
      const lineText = lineItem.text;
      if (!lineText) continue;

      const lineY = startY + (i * metrics.lineHeight);

      if (isJustify && i < metrics.lines.length - 1 && lineItem.words.length > 1 && width > 0) {
        let wordsWidth = 0;
        for (const w of lineItem.words) wordsWidth += ctx.measureText(w).width;
        const spaceWidth = (width - wordsWidth) / (lineItem.words.length - 1);
        let curX = -width / 2;

        for (const word of lineItem.words) {
          ctx.fillText(word, curX, lineY);
          if (isStrokeOn && strokeWidth > 0) {
            this.drawStroke(ctx, word, curX, lineY, strokeWidth, strokeColor, layer.strokeCap, layer.strokeJoin);
          }
          curX += ctx.measureText(word).width + spaceWidth;
        }
      } else {
        ctx.fillText(lineText, alignX, lineY);
        if (isStrokeOn && strokeWidth > 0) {
          this.drawStroke(ctx, lineText, alignX, lineY, strokeWidth, strokeColor, layer.strokeCap, layer.strokeJoin);
        }
      }
    }

    ctx.restore();
    return metrics;
  }

  rasterize(layer, options = {}) {
    const scale = options.scale || 1;
    const padding = options.padding !== undefined ? options.padding : 16;
    const metrics = this.measure(layer, { scale });
    const width = Math.ceil(metrics.width + (padding * 2));
    const height = Math.ceil(metrics.height + (padding * 2));

    const canvas = createOffscreenCanvas(width, height);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    this.renderToContext(ctx, layer, metrics.width, metrics.height, scale);
    ctx.restore();

    return { canvas, ctx, width, height, metrics };
  }

  clearCache() {
    this.measurementCanvas = null;
    this.measurementCtx = null;
  }
}

export const textRasterizer = new TextRasterizer();
export default TextRasterizer;
