export const GL_BLEND_CONSTANTS = {
  ZERO: 0,
  ONE: 1,
  SRC_COLOR: 0x0300,
  ONE_MINUS_SRC_COLOR: 0x0301,
  SRC_ALPHA: 0x0302,
  ONE_MINUS_SRC_ALPHA: 0x0303,
  DST_ALPHA: 0x0304,
  ONE_MINUS_DST_ALPHA: 0x0305,
  DST_COLOR: 0x0306,
  ONE_MINUS_DST_COLOR: 0x0307,
  SRC_ALPHA_SATURATE: 0x0308,
  FUNC_ADD: 0x8006,
  MIN: 0x8007,
  MAX: 0x8008,
  FUNC_SUBTRACT: 0x800A,
  FUNC_REVERSE_SUBTRACT: 0x800B
};

export const RAW_BLEND_FACTORS = {
  normal: [1, 771],
  replace: [1, 0],
  multiply: [774, 771],
  screen: [1, 769],
  add: [1, 1],
  plus: [1, 1],
  'linear-dodge': [1, 1],
  mask: [0, 770],
  'clipping-mask': [0, 770],
  'mask-fill': [1, 771],
  'mask-exclude': [0, 771],
  exclude: [0, 771],
  'dst-in': [0, 770],
  'dst-out': [0, 771]
};

export const BLEND_PIPELINE_MAP = {
  normal: { srcRGB: 1, dstRGB: 771, srcAlpha: 1, dstAlpha: 771, equationRGB: 0x8006, equationAlpha: 0x8006 },
  replace: { srcRGB: 1, dstRGB: 0, srcAlpha: 1, dstAlpha: 0, equationRGB: 0x8006, equationAlpha: 0x8006 },
  multiply: { srcRGB: 774, dstRGB: 771, srcAlpha: 1, dstAlpha: 771, equationRGB: 0x8006, equationAlpha: 0x8006 },
  screen: { srcRGB: 1, dstRGB: 769, srcAlpha: 1, dstAlpha: 771, equationRGB: 0x8006, equationAlpha: 0x8006 },
  lighten: { srcRGB: 1, dstRGB: 1, srcAlpha: 1, dstAlpha: 1, equationRGB: 0x8008, equationAlpha: 0x8008 },
  darken: { srcRGB: 1, dstRGB: 1, srcAlpha: 1, dstAlpha: 1, equationRGB: 0x8007, equationAlpha: 0x8007 },
  add: { srcRGB: 1, dstRGB: 1, srcAlpha: 1, dstAlpha: 1, equationRGB: 0x8006, equationAlpha: 0x8006 },
  mask: { srcRGB: 0, dstRGB: 770, srcAlpha: 0, dstAlpha: 770, equationRGB: 0x8006, equationAlpha: 0x8006 },
  exclude: { srcRGB: 0, dstRGB: 771, srcAlpha: 0, dstAlpha: 771, equationRGB: 0x8006, equationAlpha: 0x8006 }
};

const HSV_HELPER = `
vec3 blendRgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 blendHsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
`;

export const SHADER_BLEND_SNIPPETS = {
  'soft-overlay': 'vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));',
  'soft-light': 'vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));',
  overlay: 'vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-2.*(bot-0.5)) * (1.-top)) + (1.-t) * ((2.*bot) * top);',
  'hard-light': 'vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-2.*(top-0.5))) + (1.-t) * (bot * (2.*top));',
  'linear-light': 'vec3 t = step(0.5, top); vec3 result = t * (bot + 2.*(top-0.5)) + (1.-t) * (bot + 2.*top - 1.);',
  'vivid-light': 'vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (2.*(top-0.5))) + (1.-t) * (bot * (1.-2.*top));',
  'pin-light': 'vec3 t = step(0.5, top); vec3 result = t * max(bot, 2.*(top-0.5)) + (1.-t) * min(bot, 2.*top);',
  darken: 'vec3 result = min(top, bot);',
  lighten: 'vec3 result = max(top, bot);',
  diff: 'vec3 result = abs(bot - top);',
  difference: 'vec3 result = abs(bot - top);',
  exclusion: 'vec3 result = 0.5 - 2.*(bot-0.5)*(top-0.5);',
  'color-dodge': 'vec3 result = bot / max(1. - top, 1e-4);',
  'color-burn': 'vec3 result = 1. - (1.-bot) / max(top, 1e-4);',
  'linear-burn': 'vec3 result = top + bot - 1.;',
  subtract: 'vec3 result = bot - top;',
  divide: 'vec3 result = bot / max(top, 1e-4);',
  'lighter-color': 'vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? top : bot;',
  'darker-color': 'vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? bot : top;',
  hue: {
    header: HSV_HELPER,
    body: 'vec3 result = blendHsv2rgb(vec3(blendRgb2hsv(top).r, blendRgb2hsv(bot).gb));'
  },
  saturation: {
    header: HSV_HELPER,
    body: 'vec3 botHsv = blendRgb2hsv(bot); vec3 result = blendHsv2rgb(vec3(botHsv.r, blendRgb2hsv(top).g, botHsv.b));'
  },
  color: 'mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((bot * rgb2yuv).r, (top * rgb2yuv).gb) * yuv2rgb;',
  luminance: 'mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((top * rgb2yuv).r, (bot * rgb2yuv).gb) * yuv2rgb;'
};

export const CANVAS_COMPOSITE_OPS = {
  normal: 'source-over',
  replace: 'copy',
  mask: 'destination-in',
  'clipping-mask': 'destination-in',
  'mask-fill': 'source-over',
  'mask-exclude': 'destination-out',
  exclude: 'destination-out',
  multiply: 'multiply',
  screen: 'screen',
  add: 'lighter',
  plus: 'lighter',
  'linear-dodge': 'lighter',
  overlay: 'overlay',
  'soft-overlay': 'overlay',
  'soft-light': 'soft-light',
  'hard-light': 'hard-light',
  'linear-light': 'hard-light',
  'vivid-light': 'hard-light',
  'pin-light': 'hard-light',
  darken: 'darken',
  lighten: 'lighten',
  'lighter-color': 'lighten',
  'darker-color': 'darken',
  'color-dodge': 'color-dodge',
  'color-burn': 'color-burn',
  'linear-burn': 'multiply',
  diff: 'difference',
  difference: 'difference',
  exclusion: 'exclusion',
  subtract: 'difference',
  divide: 'screen',
  hue: 'hue',
  saturation: 'saturation',
  color: 'color',
  luminance: 'luminosity'
};

export const BLEND_CATEGORIES = [
  {
    id: 'normal',
    name: 'Normal',
    items: [
      { id: 'normal', name: 'Normal', mode: 'normal' },
      { id: 'replace', name: 'Ganti', mode: 'replace' }
    ]
  },
  {
    id: 'darken',
    name: 'Gelapkan',
    items: [
      { id: 'darken', name: 'Gelapkan', mode: 'darken' },
      { id: 'multiply', name: 'Gandakan', mode: 'multiply' },
      { id: 'color-burn', name: 'Terbakar Warna', mode: 'color-burn' },
      { id: 'linear-burn', name: 'Linear Burn', mode: 'multiply' },
      { id: 'darker-color', name: 'Warna Lebih Gelap', mode: 'darken' }
    ]
  },
  {
    id: 'lighten',
    name: 'Cerahkan',
    items: [
      { id: 'lighten', name: 'Cerahkan', mode: 'lighten' },
      { id: 'screen', name: 'Kasa', mode: 'screen' },
      { id: 'color-dodge', name: 'Cerahkan Warna', mode: 'color-dodge' },
      { id: 'linear-dodge', name: 'Linear Dodge', mode: 'color-dodge' },
      { id: 'lighter-color', name: 'Warna Lebih Terang', mode: 'lighten' }
    ]
  },
  {
    id: 'contrast',
    name: 'Kontras',
    items: [
      { id: 'overlay', name: 'Hamparan', mode: 'overlay' },
      { id: 'soft-light', name: 'Cahaya Lembut', mode: 'soft-light' },
      { id: 'hard-light', name: 'Cahaya Keras', mode: 'hard-light' },
      { id: 'soft-overlay', name: 'Soft Overlay', mode: 'overlay' },
      { id: 'vivid-light', name: 'Cahaya Terang', mode: 'hard-light' },
      { id: 'linear-light', name: 'Cahaya Linear', mode: 'hard-light' },
      { id: 'pin-light', name: 'Cahaya Pin', mode: 'hard-light' }
    ]
  },
  {
    id: 'difference',
    name: 'Perbedaan',
    items: [
      { id: 'difference', name: 'Perbedaan', mode: 'difference' },
      { id: 'exclusion', name: 'Pengecualian', mode: 'exclusion' },
      { id: 'subtract', name: 'Kurangi', mode: 'difference' },
      { id: 'divide', name: 'Bagi', mode: 'color-dodge' }
    ]
  },
  {
    id: 'color',
    name: 'Warna',
    items: [
      { id: 'hue', name: 'Rona', mode: 'hue' },
      { id: 'saturation', name: 'Kejenuhan', mode: 'saturation' },
      { id: 'color', name: 'Warna', mode: 'color' },
      { id: 'luminance', name: 'Pencahayaan', mode: 'luminosity' }
    ]
  },
  {
    id: 'mask',
    name: 'Topeng',
    items: [
      { id: 'mask', name: 'Masker', mode: 'mask' },
      { id: 'exclude', name: 'Kecualikan Masker', mode: 'exclude' }
    ]
  }
];

export function normalizeBlendMode(mode) {
  if (typeof mode !== 'string' || !mode) return 'normal';
  const clean = mode.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]+/g, '-');
  if (clean === 'source-over') return 'normal';
  if (clean === 'copy') return 'replace';
  if (clean === 'diff') return 'difference';
  if (clean === 'plus' || clean === 'linear-dodge') return 'add';
  if (clean === 'clipping-mask' || clean === 'dst-in') return 'mask';
  if (clean === 'mask-exclude' || clean === 'dst-out') return 'exclude';
  return clean;
}

export function isHardwareBlendMode(mode) {
  const norm = normalizeBlendMode(mode);
  return Boolean(BLEND_PIPELINE_MAP[norm]);
}

export function getBlendFactors(gl, mode) {
  const norm = normalizeBlendMode(mode);
  const cfg = BLEND_PIPELINE_MAP[norm] || BLEND_PIPELINE_MAP.normal;
  return {
    srcRGB: cfg.srcRGB,
    dstRGB: cfg.dstRGB,
    srcAlpha: cfg.srcAlpha,
    dstAlpha: cfg.dstAlpha,
    equationRGB: cfg.equationRGB,
    equationAlpha: cfg.equationAlpha
  };
}

export function applyBlendMode(gl, mode, extMinMax = null) {
  const norm = normalizeBlendMode(mode);

  if (norm === 'replace') {
    gl.disable(gl.BLEND);
    return true;
  }

  gl.enable(gl.BLEND);

  if (norm === 'darken') {
    const minEq = gl.MIN !== undefined ? gl.MIN : (extMinMax ? extMinMax.MIN_EXT : null);
    if (minEq !== null) {
      gl.blendEquation(minEq);
      gl.blendFunc(gl.ONE, gl.ONE);
      return true;
    }
    return false;
  }

  if (norm === 'lighten') {
    const maxEq = gl.MAX !== undefined ? gl.MAX : (extMinMax ? extMinMax.MAX_EXT : null);
    if (maxEq !== null) {
      gl.blendEquation(maxEq);
      gl.blendFunc(gl.ONE, gl.ONE);
      return true;
    }
    return false;
  }

  const cfg = BLEND_PIPELINE_MAP[norm] || BLEND_PIPELINE_MAP.normal;
  gl.blendEquationSeparate(cfg.equationRGB, cfg.equationAlpha);
  gl.blendFuncSeparate(cfg.srcRGB, cfg.dstRGB, cfg.srcAlpha, cfg.dstAlpha);
  return true;
}

export function getShaderBlendSnippet(mode) {
  const norm = normalizeBlendMode(mode);
  return SHADER_BLEND_SNIPPETS[norm] || null;
}

export function getCompositeOperation(mode) {
  const norm = normalizeBlendMode(mode);
  return CANVAS_COMPOSITE_OPS[norm] || 'source-over';
}
