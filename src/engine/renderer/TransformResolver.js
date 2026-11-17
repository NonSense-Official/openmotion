import { evaluateKeyframeChannel, evaluateNumberChannel } from '../math/KeyframeEvaluator.js';
import { AffineMatrix2D } from '../math/AffineMatrix2D.js';

export class TransformResolver {
  static getNormalizedTime(layer, timeMs) {
    const start = layer.startTime ?? 0;
    const end = layer.endTime ?? (start + 5000);
    const dur = Math.max(1, end - start);
    let x = (timeMs - start) / dur;
    if (layer.speedCurve && typeof layer.speedCurve.evaluate === 'function') {
      try { x = layer.speedCurve.evaluate(x); } catch {}
    }
    if (layer.reversed) {
      x = 1 - x;
    }
    return Math.max(0, Math.min(1, x));
  }

  static evalChannel(channel, timeMs, normTime) {
    if (!channel) return null;
    const kfs = channel.kfs;
    if (kfs && kfs.length > 0) {
      const isNorm = kfs[kfs.length - 1].t <= 1.001;
      return evaluateKeyframeChannel(channel, isNorm ? normTime : timeMs);
    }
    return evaluateKeyframeChannel(channel, timeMs);
  }

  static evalNumber(channel, timeMs, normTime, defaultVal = 0) {
    if (!channel) return defaultVal;
    const kfs = channel.kfs;
    if (kfs && kfs.length > 0) {
      const isNorm = kfs[kfs.length - 1].t <= 1.001;
      return evaluateNumberChannel(channel, isNorm ? normTime : timeMs, defaultVal);
    }
    return evaluateNumberChannel(channel, timeMs, defaultVal);
  }

  static evaluateLayerProperties(layer, timeMs, sceneW, sceneH) {
    const t = layer.transform || {};
    const normTime = TransformResolver.getNormalizedTime(layer, timeMs);

    let loc = layer.parentId ? [0, 0] : [sceneW * 0.5, sceneH * 0.5];
    if (t.location !== undefined) {
      const res = TransformResolver.evalChannel(t.location, timeMs, normTime);
      if (Array.isArray(res) && res.length >= 2) {
        loc = [res[0], res[1]];
      } else if (Array.isArray(res) && res.length === 1) {
        loc = [res[0], res[0]];
      }
    }

    let scale = [1, 1];
    if (t.scale !== undefined) {
      const res = TransformResolver.evalChannel(t.scale, timeMs, normTime);
      if (Array.isArray(res) && res.length >= 2) {
        scale = [res[0], res[1]];
      } else if (Array.isArray(res) && res.length === 1) {
        scale = [res[0], res[0]];
      } else if (typeof res === 'number') {
        scale = [res, res];
      }
    }

    let rot = 0;
    if (t.rotation !== undefined) {
      rot = TransformResolver.evalNumber(t.rotation, timeMs, normTime, 0);
    }

    let piv = [0, 0];
    if (t.pivot !== undefined) {
      const res = TransformResolver.evalChannel(t.pivot, timeMs, normTime);
      if (Array.isArray(res) && res.length >= 2) {
        piv = [res[0], res[1]];
      }
    }

    let sk = [0, 0];
    if (t.skew !== undefined) {
      const res = TransformResolver.evalChannel(t.skew, timeMs, normTime);
      if (Array.isArray(res) && res.length >= 2) {
        sk = [res[0], res[1]];
      }
    }

    let op = 1.0;
    if (layer.opacity !== undefined) {
      op = TransformResolver.evalNumber(layer.opacity, timeMs, normTime, 1.0);
    } else if (t.opacity !== undefined) {
      op = TransformResolver.evalNumber(t.opacity, timeMs, normTime, 1.0);
    }
    if (op > 1.0 && op <= 100.0) {
      op = op / 100.0;
    }
    op = Math.max(0, Math.min(1, op));

    return { location: loc, scale, rotation: rot, pivot: piv, skew: sk, opacity: op, normTime };
  }

  static computeLocalMatrix(props) {
    return AffineMatrix2D.fromTransform({
      location: props.location,
      scale: props.scale,
      rotation: props.rotation,
      pivot: props.pivot,
      skew: props.skew
    });
  }

  static computeWorldMatrix(layer, timeMs, sceneW, sceneH, layerById = null, visited = new Set()) {
    if (!layer || visited.has(layer.id)) {
      return { matrix: AffineMatrix2D.identity(), opacity: 1.0, normTime: 0 };
    }
    visited.add(layer.id);

    const props = TransformResolver.evaluateLayerProperties(layer, timeMs, sceneW, sceneH);
    const localMatrix = TransformResolver.computeLocalMatrix(props);
    let worldMatrix = localMatrix;
    let worldOpacity = props.opacity;

    const parentId = layer.parentId;
    if (parentId && layerById) {
      const parent = layerById.get(parentId);
      if (parent && parent !== layer) {
        const parentRes = TransformResolver.computeWorldMatrix(
          parent,
          timeMs,
          sceneW,
          sceneH,
          layerById,
          visited
        );
        worldMatrix = parentRes.matrix.clone().multiply(localMatrix);
        worldOpacity = worldOpacity * parentRes.opacity;
      }
    }

    return { matrix: worldMatrix, opacity: worldOpacity, normTime: props.normTime };
  }

  static computeShaderTransform(worldMatrix, layerW, layerH, sceneW, sceneH) {
    const hw = layerW * 0.5;
    const hh = layerH * 0.5;
    const invSw2 = 2.0 / sceneW;
    const invSh2 = 2.0 / sceneH;

    const m = worldMatrix.elements;
    const c0x = m[0] * hw * invSw2;
    const c0y = -m[1] * hw * invSh2;
    const c1x = m[2] * hh * invSw2;
    const c1y = -m[3] * hh * invSh2;
    const c2x = m[4] * invSw2 - 1.0;
    const c2y = 1.0 - m[5] * invSh2;

    return new Float32Array([
      c0x, c0y, 0,
      c1x, c1y, 0,
      c2x, c2y, 1
    ]);
  }
}
