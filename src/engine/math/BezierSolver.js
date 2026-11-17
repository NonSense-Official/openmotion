const NEWTON_ITERATIONS = 8;
const NEWTON_MIN_SLOPE = 1e-6;
const SUBDIVISION_MAX_ITERATIONS = 24;
const SUBDIVISION_PRECISION = 1e-7;

const solverCache = new Map();

export function solveCubicBezier(x1, y1, x2, y2) {
  if (x1 === y1 && x2 === y2) {
    return (t) => t;
  }

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return function evaluate(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < NEWTON_ITERATIONS; i++) {
      const currentX = sampleCurveX(t) - x;
      if (Math.abs(currentX) < SUBDIVISION_PRECISION) {
        return sampleCurveY(t);
      }
      const slope = sampleCurveDerivativeX(t);
      if (Math.abs(slope) < NEWTON_MIN_SLOPE) {
        break;
      }
      t -= currentX / slope;
    }

    let t0 = 0;
    let t1 = 1;
    t = x;

    for (let i = 0; i < SUBDIVISION_MAX_ITERATIONS; i++) {
      const currentX = sampleCurveX(t) - x;
      if (Math.abs(currentX) < SUBDIVISION_PRECISION) {
        break;
      }
      if (currentX > 0) {
        t1 = t;
      } else {
        t0 = t;
      }
      t = (t0 + t1) * 0.5;
    }

    return sampleCurveY(t);
  };
}

export function getCachedBezierSolver(x1, y1, x2, y2) {
  const key = `${x1},${y1},${x2},${y2}`;
  let solver = solverCache.get(key);
  if (!solver) {
    solver = solveCubicBezier(x1, y1, x2, y2);
    solverCache.set(key, solver);
  }
  return solver;
}

export function parseBezierToken(token) {
  if (!token) {
    return {
      type: 'linear',
      p1: { x: 0, y: 0 },
      p2: { x: 1, y: 1 },
      values: [0, 0, 1, 1],
      isLinear: true
    };
  }

  if (Array.isArray(token)) {
    const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = token;
    return {
      type: 'cubicBezier',
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      values: [x1, y1, x2, y2],
      isLinear: x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1
    };
  }

  const str = String(token).trim();
  if (str === 'linear' || str === 'none') {
    return {
      type: 'linear',
      p1: { x: 0, y: 0 },
      p2: { x: 1, y: 1 },
      values: [0, 0, 1, 1],
      isLinear: true
    };
  }

  const cubicMatch = /(?:local\s+)?cubicBezier(?:\s*\(|\s+)([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)\)?/i.exec(str);
  if (cubicMatch) {
    const x1 = parseFloat(cubicMatch[1]) || 0;
    const y1 = parseFloat(cubicMatch[2]) || 0;
    const x2 = parseFloat(cubicMatch[3]) || 0;
    const y2 = parseFloat(cubicMatch[4]) || 0;
    return {
      type: 'cubicBezier',
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      values: [x1, y1, x2, y2],
      isLinear: x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1,
      raw: str
    };
  }

  const nums = str.split(/[,\s]+/).map(parseFloat).filter(Number.isFinite);
  if (nums.length >= 4) {
    const [x1, y1, x2, y2] = nums;
    return {
      type: 'cubicBezier',
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      values: [x1, y1, x2, y2],
      isLinear: x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1,
      raw: str
    };
  }

  return {
    type: 'unknown',
    p1: { x: 0, y: 0 },
    p2: { x: 1, y: 1 },
    values: [0, 0, 1, 1],
    isLinear: true,
    raw: str
  };
}

export function formatBezierToken(p1OrX1, p2OrY1, maybeX2, maybeY2) {
  let x1;
  let y1;
  let x2;
  let y2;

  if (typeof p1OrX1 === 'object' && p1OrX1 !== null) {
    x1 = p1OrX1.x ?? 0;
    y1 = p1OrX1.y ?? 0;
    x2 = p2OrY1?.x ?? 1;
    y2 = p2OrY1?.y ?? 1;
  } else {
    x1 = p1OrX1 ?? 0;
    y1 = p2OrY1 ?? 0;
    x2 = maybeX2 ?? 1;
    y2 = maybeY2 ?? 1;
  }

  const clean = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return '0';
    return Number(v.toFixed(4)).toString();
  };

  return `cubicBezier ${clean(x1)} ${clean(y1)} ${clean(x2)} ${clean(y2)}`;
}

export function createBezierEasing(tokenOrParams) {
  if (typeof tokenOrParams === 'string' || Array.isArray(tokenOrParams)) {
    const parsed = parseBezierToken(tokenOrParams);
    if (parsed.isLinear) {
      return (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t);
    }
    return getCachedBezierSolver(parsed.p1.x, parsed.p1.y, parsed.p2.x, parsed.p2.y);
  }
  return solveCubicBezier(0, 0, 1, 1);
}

export const cubicBezier = solveCubicBezier;

export default {
  solveCubicBezier,
  cubicBezier,
  getCachedBezierSolver,
  parseBezierToken,
  formatBezierToken,
  createBezierEasing
};
