export function multiplyAffine(p, c) {
  return [
    p[0] * c[0] + p[2] * c[1],
    p[1] * c[0] + p[3] * c[1],
    p[0] * c[2] + p[2] * c[3],
    p[1] * c[2] + p[3] * c[3],
    p[0] * c[4] + p[2] * c[5] + p[4],
    p[1] * c[4] + p[3] * c[5] + p[5]
  ];
}

export function multiplyMat4(a, b) {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i];
    const ai1 = a[i + 4];
    const ai2 = a[i + 8];
    const ai3 = a[i + 12];
    out[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    out[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    out[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return out;
}

export class HierarchyResolver {
  static buildLayerMap(sceneOrLayers) {
    const map = new Map();
    const collect = (layers) => {
      if (!Array.isArray(layers)) return;
      for (const layer of layers) {
        if (layer && layer.id) {
          map.set(layer.id, layer);
          if (layer.scene && layer.scene.layers) {
            collect(layer.scene.layers);
          }
        }
      }
    };
    const layers = Array.isArray(sceneOrLayers) ? sceneOrLayers : (sceneOrLayers && sceneOrLayers.layers);
    collect(layers);
    return map;
  }

  static wouldCauseCycle(layer, candidateParent, layerById = null) {
    if (!layer || !candidateParent) return false;
    if (layer.id === candidateParent.id) return true;

    const visited = new Set([layer.id]);
    let current = candidateParent;
    let depth = 0;

    while (current && depth++ < 64) {
      if (visited.has(current.id)) return true;
      visited.add(current.id);
      if (!current.parentId) break;
      const next = current.parentLayer || (layerById && layerById.get(current.parentId));
      if (!next) break;
      current = next;
    }

    return false;
  }

  static resolveHierarchy(sceneOrLayers) {
    const layerById = HierarchyResolver.buildLayerMap(sceneOrLayers);
    const layers = Array.isArray(sceneOrLayers) ? sceneOrLayers : (sceneOrLayers && sceneOrLayers.layers) || [];

    for (const layer of layerById.values()) {
      layer.children = [];
      layer.parentLayer = null;
    }

    for (const layer of layerById.values()) {
      if (!layer.parentId) continue;

      const parent = layerById.get(layer.parentId);
      if (!parent || parent === layer || HierarchyResolver.wouldCauseCycle(layer, parent, layerById)) {
        layer.parentId = '';
        layer.parentLayer = null;
        continue;
      }

      layer.parentLayer = parent;
      parent.children.push(layer);
    }

    if (sceneOrLayers && !Array.isArray(sceneOrLayers)) {
      sceneOrLayers.layerById = layerById;
    }

    return layerById;
  }

  static getAncestors(layer) {
    const ancestors = [];
    let current = layer ? layer.parentLayer : null;
    const visited = new Set([layer ? layer.id : '']);
    let depth = 0;

    while (current && depth++ < 64) {
      if (visited.has(current.id)) break;
      visited.add(current.id);
      ancestors.push(current);
      current = current.parentLayer;
    }

    return ancestors;
  }

  static getParentChain(layer) {
    if (!layer) return [];
    const ancestors = HierarchyResolver.getAncestors(layer);
    ancestors.reverse();
    ancestors.push(layer);
    return ancestors;
  }

  static getDescendants(layer) {
    const descendants = [];
    const traverse = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        descendants.push(child);
        traverse(child);
      }
    };
    traverse(layer);
    return descendants;
  }

  static topologicalSort(layers) {
    if (!Array.isArray(layers)) return [];
    const layerById = HierarchyResolver.buildLayerMap(layers);
    const visited = new Set();
    const result = [];

    const visit = (layer) => {
      if (!layer || visited.has(layer.id)) return;
      if (layer.parentId) {
        const parent = layer.parentLayer || layerById.get(layer.parentId);
        if (parent && !visited.has(parent.id)) {
          visit(parent);
        }
      }
      visited.add(layer.id);
      result.push(layer);
    };

    for (const layer of layers) {
      visit(layer);
    }

    return result;
  }

  static computeWorldMatrix2D(layer, localMatrix, getLocalMatrixFn = null) {
    const chain = HierarchyResolver.getParentChain(layer);
    let world = [1, 0, 0, 1, 0, 0];

    for (const node of chain) {
      const mat = (node === layer || !getLocalMatrixFn)
        ? (node === layer ? localMatrix : [1, 0, 0, 1, 0, 0])
        : getLocalMatrixFn(node);
      world = multiplyAffine(world, mat);
    }

    return world;
  }

  static computeWorldMatrix4D(layer, localMatrix4, getLocalMatrix4Fn = null) {
    const chain = HierarchyResolver.getParentChain(layer);
    let world = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

    for (const node of chain) {
      const mat = (node === layer || !getLocalMatrix4Fn)
        ? (node === layer ? localMatrix4 : world)
        : getLocalMatrix4Fn(node);
      world = multiplyMat4(world, mat);
    }

    return world;
  }

  static computeWorldAlpha(layer, localAlpha = 1, getAlphaFn = null) {
    let alpha = Number.isFinite(localAlpha) ? localAlpha : 1;
    let current = layer ? layer.parentLayer : null;
    let depth = 0;

    while (current && depth++ < 32) {
      const parentAlpha = getAlphaFn ? getAlphaFn(current) : 1;
      alpha *= Number.isFinite(parentAlpha) ? parentAlpha : 1;
      current = current.parentLayer;
    }

    return Math.max(0, Math.min(1, alpha));
  }

  static setLayerParent(layer, parentId, sceneOrLayers) {
    if (!layer) return false;
    if (!parentId) {
      layer.parentId = '';
      layer.parentLayer = null;
      HierarchyResolver.resolveHierarchy(sceneOrLayers);
      return true;
    }

    const layerById = HierarchyResolver.buildLayerMap(sceneOrLayers);
    const candidateParent = layerById.get(parentId);
    if (!candidateParent || candidateParent === layer) return false;

    if (HierarchyResolver.wouldCauseCycle(layer, candidateParent, layerById)) {
      return false;
    }

    layer.parentId = parentId;
    HierarchyResolver.resolveHierarchy(sceneOrLayers);
    return true;
  }

  static removeLayerParent(layer, sceneOrLayers) {
    if (!layer) return false;
    layer.parentId = '';
    layer.parentLayer = null;
    HierarchyResolver.resolveHierarchy(sceneOrLayers);
    return true;
  }
}
