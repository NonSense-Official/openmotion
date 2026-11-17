import { solveCubicBezier, parseBezierToken } from './BezierSolver.js';

export { parseBezierToken };

const easingCache = new Map();

export function linear(t) {
  return t <= 0 ? 0 : t >= 1 ? 1 : t;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpVec2(a, b, t, out = [0, 0]) {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  return out;
}

export function lerpVec3(a, b, t, out = [0, 0, 0]) {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;
  return out;
}

export function lerpVec4(a, b, t, out = [0, 0, 0, 0]) {
  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;
  out[3] = a[3] + (b[3] - a[3]) * t;
  return out;
}

export function lerpArray(a, b, t, out = []) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const va = a[i] ?? 0;
    const vb = b[i] ?? va;
    out[i] = va + (vb - va) * t;
  }
  return out;
}

export function parseHexColor(colorStr) {
  if (!colorStr) return [0, 0, 0, 1];
  let hex = String(colorStr).trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 6) {
    hex = 'ff' + hex;
  }
  if (hex.length !== 8) {
    return [0, 0, 0, 1];
  }
  const a = parseInt(hex.substring(0, 2), 16) / 255;
  const r = parseInt(hex.substring(2, 4), 16) / 255;
  const g = parseInt(hex.substring(4, 6), 16) / 255;
  const b = parseInt(hex.substring(6, 8), 16) / 255;
  return [r, g, b, a];
}

export function lerpColor(c1, c2, t, out = [0, 0, 0, 1]) {
  const a = Array.isArray(c1) ? c1 : parseHexColor(c1);
  const b = Array.isArray(c2) ? c2 : parseHexColor(c2);

  out[0] = Math.max(0, Math.min(1, a[0] + (b[0] - a[0]) * t));
  out[1] = Math.max(0, Math.min(1, a[1] + (b[1] - a[1]) * t));
  out[2] = Math.max(0, Math.min(1, a[2] + (b[2] - a[2]) * t));
  out[3] = Math.max(0, Math.min(1, (a[3] ?? 1) + ((b[3] ?? 1) - (a[3] ?? 1)) * t));
  return out;
}

export function createElasticEasing(period = 0.5, decay = 0.5, amp = 0.5, phase = 0, reverse = false) {
  const p = Number.isFinite(period) && period > 0 ? period : 0.5;
  const d = Number.isFinite(amp) ? amp : 0.5;
  const ph = Number.isFinite(phase) ? phase : 0;
  const maxP = Math.max(p, 0.01);
  const decayPow = d * d * 15 + 1;

  const env = (t) => {
    const cos = Math.cos((Math.PI * t) / maxP);
    const base = 1 - Math.max(t, 0.005);
    return cos * Math.abs(Math.pow(base, decayPow));
  };

  const fn = (t) => {
    if (t >= p) return 1 - env(t) * ph;
    const head = ((1 - Math.cos((Math.PI * t) / maxP)) / 2) * (1 - env(p) * ph);
    const tail = 1 - env(t) * ph;
    const blend = Math.pow(t / maxP, 3);
    return head * (1 - blend) + tail * blend;
  };

  return reverse ? (t) => 1 - fn(1 - t) : fn;
}

export function createBounceEasing(period = 0.3, decay = 0.8, reverse = false) {
  const p = Number.isFinite(period) ? period : 0.3;
  const d = Number.isFinite(decay) ? decay : 0.8;

  const fn = (t) => {
    if (p === 0) return 1;
    let curP = p;
    let curT = t + p / 2;
    let base = 0;
    let amp = 1;

    while (true) {
      const nextBase = base + curP;
      if (curT <= nextBase) {
        if (curP / 3 + base > p / 2 + 1 || (curP < 0.1 && nextBase > p / 2 + 1)) return 1;
        const norm = ((curT - base) / curP - 0.5) * 2;
        return Math.pow(Math.abs(norm), 2) * amp + (1 - amp);
      }
      curP *= d;
      amp *= d;
      if (amp < 0.005) return 1;
      base = nextBase;
    }
  };

  return reverse ? (t) => 1 - fn(1 - t) : fn;
}

export function createCyclicEasing(period = 0.5, amp = 0, duty = 0.5, phase = 0, damping = 0) {
  const p = Number.isFinite(period) ? period : 0.5;
  const maxP = Math.max(p, 0.001);
  const a = Number.isFinite(amp) ? amp : 0;
  const d = Number.isFinite(duty) ? duty : 0.5;
  const ph = Number.isFinite(phase) ? phase : 0;
  const dmp = Number.isFinite(damping) ? damping : 0;

  const fMod = (t) => (t % maxP) / maxP;
  const fCos = (t) => 1 - (Math.cos((t / maxP) * Math.PI * 2) + 1) / 2;
  const fTri = (t) => 1 - Math.abs(fMod(t) - 0.5) * 2;

  const warp = (t) => {
    const m = fMod(t);
    let w = 0.5;
    if (m < d) {
      w = 0.5 * (m / (d || 0.000001));
    } else if (m > d) {
      w = 0.5 + ((m - d) / (1 - d || 0.000001)) / 2;
    }
    return t - m * maxP + maxP * w;
  };

  return (t) => {
    const wt = warp(t);
    let r = fCos(wt) * (1 - a) + fTri(wt) * a;
    const base = t - (t % maxP);
    if (maxP / 4 + base > 1) {
      r = 0;
    } else if (maxP / 2 + base < 1 && base + (maxP * 3) / 4 > 1 && fMod(t) > d) {
      r = 1;
    }
    return r * (1 - t * dmp) + t * dmp;
  };
}

function smoothstep(edge0, edge1, x) {
  const span = edge1 - edge0;
  if (Math.abs(span) < 1e-12) return x < edge0 ? 0 : 1;
  let t = (x - edge0) / span;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return t * t * (3 - 2 * t);
}

export function createStepEasing(interval = 0.25, phase = 0) {
  const iv = Number.isFinite(interval) && interval > 1e-6 ? interval : 0.25;
  const ph = Number.isFinite(phase) ? phase : 0;
  return (t) => {
    const mod = t % iv;
    return t - mod + smoothstep(iv - ph * iv, iv, mod) * iv;
  };
}

export function createElasticStepEasing(interval = 0.2, decay = 0.5) {
  const iv = Number.isFinite(interval) && interval > 1e-6 ? interval : 0.2;
  const d = Number.isFinite(decay) ? decay : 0.5;
  const elFn = createElasticEasing(0.5 - 0.45 * d, 1, 1 - d * 0.5, (1 - d) * 0.5 + 0.5, false);

  return (t) => {
    if (t < iv) return 0;
    const mod = t % iv;
    return t - mod + iv * (elFn(mod / iv) - 1);
  };
}

const PERM_TABLE = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  perm[i] = PERM_TABLE[i % 256];
  permMod12[i] = perm[i] % 12;
}

const GRAD2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [1, 0], [-1, 0],
  [0, 1], [0, -1], [0, 1], [0, -1]
];
const F2 = (Math.sqrt(3) - 1) * 0.5;
const G2 = (3 - Math.sqrt(3)) / 6;

function simplex2(x, y) {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t);
  const y0 = y - (j - t);

  let i1 = 0;
  let j1 = 1;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  const gi0 = permMod12[ii + perm[jj]];
  const gi1 = permMod12[ii + i1 + perm[jj + j1]];
  const gi2 = permMod12[ii + 1 + perm[jj + 1]];

  let n0 = 0;
  let n1 = 0;
  let n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * (GRAD2[gi0][0] * x0 + GRAD2[gi0][1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * (GRAD2[gi1][0] * x1 + GRAD2[gi1][1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * (GRAD2[gi2][0] * x2 + GRAD2[gi2][1] * y2);
  }

  return (n0 + n1 + n2) * 70;
}

export function createNoiseEasing(freq = 0.5, amp = 0.5, seed = 0.5, oct = 0.5, p1 = 0.5, p2 = 0.5) {
  const f = Number.isFinite(freq) ? freq : 0.5;
  const a = Number.isFinite(amp) ? amp : 0.5;
  const s = Number.isFinite(seed) ? seed : 0.5;
  const o = Number.isFinite(oct) ? oct : 0.5;
  const ph1 = Number.isFinite(p1) ? p1 : 0.5;
  const ph2 = Number.isFinite(p2) ? p2 : 0.5;

  const ampFactor = 1 - Math.abs(1 - a);
  const octFactor = Math.abs(o - 0.5) * 2;
  const phaseFactor = Math.abs(ph1 - 0.5) * 2;

  return (t) => {
    const tNorm = t * 2 - 1;
    const windowFactor = 1 - Math.pow(Math.abs(tNorm), 3);
    const n1 = simplex2(f * 30 * t, s * 10) * ampFactor;
    const n2 = simplex2(f * 60 * t, s * 10 + 23453.234534) * ampFactor * 0.5;
    const noiseVal = windowFactor * n1 + windowFactor * n2;
    const env = o > 0.5 ? lerp(1, 1 - t, octFactor) : (o < 0.5 ? lerp(1, t, octFactor) : 1);
    let curveT = t;
    if (ph1 < 0.5) {
      curveT = Math.pow(t, phaseFactor * 5 + 1);
    } else if (ph1 > 0.5) {
      curveT = 1 - Math.pow(1 - t, phaseFactor * 5 + 1);
    }
    return lerp(curveT, 1 - curveT, ph2) + noiseVal * env * env;
  };
}

export function parseEasingToken(rawToken) {
  if (!rawToken) return null;
  const str = String(rawToken).trim();
  if (!str) return null;

  const parts = str.split(/\s+/);
  let isLocal = false;
  let isReverse = false;
  let idx = 0;

  if (parts[idx] === 'local') {
    isLocal = true;
    idx++;
  }

  if (parts[idx] === 'reverse') {
    isReverse = true;
    idx++;
  }

  const type = parts[idx] || 'linear';
  idx++;

  const params = parts.slice(idx).map(parseFloat).filter(Number.isFinite);

  return {
    raw: str,
    type,
    params,
    reverse: isReverse,
    local: isLocal
  };
}

export function resolveEasing(token) {
  if (!token) return linear;
  if (typeof token === 'function') return token;

  let str = '';
  let parsed = null;

  if (typeof token === 'object') {
    if (token.type) {
      parsed = {
        type: token.type,
        params: Array.isArray(token.params) ? token.params : [],
        raw: token.raw || token.type,
        reverse: Boolean(token.reverse),
        local: Boolean(token.local)
      };
      str = token.raw || (token.type + ' ' + (token.params || []).join(' '));
    } else if (token.raw) {
      str = String(token.raw).trim();
      parsed = parseEasingToken(str);
    }
  } else {
    str = String(token).trim();
    parsed = parseEasingToken(str);
  }

  if (!parsed || !str) return linear;

  if (easingCache.has(str)) {
    return easingCache.get(str);
  }

  const { type, params, reverse } = parsed;
  let fn = linear;

  if (type === 'linear' || type === 'none') {
    fn = linear;
  } else if (type === 'cubicBezier' && params.length >= 4) {
    const solver = solveCubicBezier(params[0], params[1], params[2], params[3]);
    fn = reverse ? (t) => 1 - solver(1 - t) : solver;
  } else if (type === 'elastic') {
    fn = createElasticEasing(params[0], params[1], params[2], params[3] ?? 0, reverse);
  } else if (type === 'bounce') {
    fn = createBounceEasing(params[0] ?? 0.3, params[1] ?? 0.8, reverse);
  } else if (type === 'cyclic') {
    const cyc = createCyclicEasing(params[0], params[1], params[2], params[3], params[4] ?? 0);
    fn = reverse ? (t) => 1 - cyc(1 - t) : cyc;
  } else if (type === 'step') {
    const stp = createStepEasing(params[0] ?? 0.25, params[1] ?? 0);
    fn = reverse ? (t) => 1 - stp(1 - t) : stp;
  } else if (type === 'elasticStep') {
    const estp = createElasticStepEasing(params[0] ?? 0.2, params[1] ?? 0.5);
    fn = reverse ? (t) => 1 - estp(1 - t) : estp;
  } else if (type === 'random' || type === 'noise') {
    const rnd = createNoiseEasing(params[0], params[1], params[2], params[3], params[4], params[5]);
    fn = reverse ? (t) => 1 - rnd(1 - t) : rnd;
  }

  easingCache.set(str, fn);
  return fn;
}

export default {
  linear, lerp, lerpVec2, lerpVec3, lerpVec4, lerpArray, lerpColor,
  parseHexColor, parseBezierToken, parseEasingToken, resolveEasing,
  createElasticEasing, createBounceEasing, createCyclicEasing,
  createStepEasing, createElasticStepEasing, createNoiseEasing
};
