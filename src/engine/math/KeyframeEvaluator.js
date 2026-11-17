import { resolveEasing, lerp, lerpArray, lerpColor } from './EasingCurves.js';

export function findKeyframeBracket(kfs, time) {
  if (!kfs || kfs.length === 0) {
    return null;
  }

  const count = kfs.length;
  if (count === 1) {
    return { kfA: kfs[0], kfB: null, progress: 0, index: 0 };
  }

  if (time <= kfs[0].t) {
    return { kfA: kfs[0], kfB: null, progress: 0, index: 0 };
  }

  if (time >= kfs[count - 1].t) {
    return { kfA: kfs[count - 1], kfB: null, progress: 0, index: count - 1 };
  }

  let low = 0;
  let high = count - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const tMid = kfs[mid].t;

    if (tMid <= time) {
      if (mid === count - 1 || kfs[mid + 1].t > time) {
        const kfA = kfs[mid];
        const kfB = kfs[mid + 1] || null;
        if (!kfB) {
          return { kfA, kfB: null, progress: 0, index: mid };
        }
        const span = kfB.t - kfA.t;
        const u = span > 1e-9 ? Math.min(1, Math.max(0, (time - kfA.t) / span)) : 1;
        return { kfA, kfB, progress: u, index: mid };
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return { kfA: kfs[count - 1], kfB: null, progress: 0, index: count - 1 };
}

export function applyKeyframeEasing(kfA, kfB, progress) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  const easingCandidate = kfB?.e ?? kfB?.easing ?? kfA?.e ?? kfA?.easing;
  if (!easingCandidate) {
    return progress;
  }

  if (typeof easingCandidate === 'function') {
    return easingCandidate(progress);
  }

  if (typeof easingCandidate === 'object' && typeof easingCandidate.eval === 'function') {
    return easingCandidate.eval(progress);
  }

  const solver = resolveEasing(easingCandidate);
  return solver(progress);
}

export function interpolateChannelValues(kfA, kfB, progress, out = null, dataType = null) {
  const valA = kfA?.v;
  const valB = kfB?.v;

  if (!valB || progress <= 0) {
    if (Array.isArray(valA)) {
      if (out) {
        for (let i = 0; i < valA.length; i++) out[i] = valA[i];
        return out;
      }
      return valA.slice();
    }
    return valA;
  }

  if (progress >= 1) {
    if (Array.isArray(valB)) {
      if (out) {
        for (let i = 0; i < valB.length; i++) out[i] = valB[i];
        return out;
      }
      return valB.slice();
    }
    return valB;
  }

  if (Array.isArray(valA) && Array.isArray(valB)) {
    if (dataType === 'color') {
      return lerpColor(valA, valB, progress, out || [0, 0, 0, 1]);
    }
    const len = Math.max(valA.length, valB.length);
    const target = out || new Array(len);
    for (let i = 0; i < len; i++) {
      const a = valA[i] ?? 0;
      const b = valB[i] ?? a;
      target[i] = a + (b - a) * progress;
    }
    return target;
  }

  const numA = typeof valA === 'number' ? valA : Array.isArray(valA) ? (valA[0] ?? 0) : 0;
  const numB = typeof valB === 'number' ? valB : Array.isArray(valB) ? (valB[0] ?? numA) : numA;
  const result = lerp(numA, numB, progress);

  if (out && Array.isArray(out)) {
    out[0] = result;
    return out;
  }

  return result;
}

export function evaluateKeyframeChannel(channel, time, out = null, dataType = null) {
  if (!channel) {
    if (out) {
      out[0] = 0;
      return out;
    }
    return [0];
  }

  const kfs = channel.kfs;
  if (!kfs || kfs.length === 0) {
    const rawVal = channel.value !== undefined ? channel.value : channel;
    if (Array.isArray(rawVal)) {
      if (out) {
        for (let i = 0; i < rawVal.length; i++) out[i] = rawVal[i];
        return out;
      }
      return rawVal.slice();
    }
    if (typeof rawVal === 'number') {
      if (out) {
        out[0] = rawVal;
        return out;
      }
      return [rawVal];
    }
    return out || [0];
  }

  const bracket = findKeyframeBracket(kfs, time);
  if (!bracket || !bracket.kfA) {
    return channel.value ? (out ? lerpArray(channel.value, channel.value, 0, out) : channel.value.slice()) : (out || [0]);
  }

  if (!bracket.kfB) {
    const val = bracket.kfA.v;
    if (Array.isArray(val)) {
      if (out) {
        for (let i = 0; i < val.length; i++) out[i] = val[i];
        return out;
      }
      return val.slice();
    }
    if (typeof val === 'number') {
      if (out) {
        out[0] = val;
        return out;
      }
      return [val];
    }
    return out || [0];
  }

  const effectiveDataType = dataType || channel.dataType;
  const eased = applyKeyframeEasing(bracket.kfA, bracket.kfB, bracket.progress);
  return interpolateChannelValues(bracket.kfA, bracket.kfB, eased, out, effectiveDataType);
}

export const evaluateChannel = evaluateKeyframeChannel;

export function evaluateNumberChannel(channel, time, defaultValue = 0) {
  const result = evaluateKeyframeChannel(channel, time);
  if (Array.isArray(result)) {
    return result[0] !== undefined ? result[0] : defaultValue;
  }
  return typeof result === 'number' ? result : defaultValue;
}

export default {
  findKeyframeBracket,
  applyKeyframeEasing,
  interpolateChannelValues,
  evaluateKeyframeChannel,
  evaluateChannel,
  evaluateNumberChannel
};
