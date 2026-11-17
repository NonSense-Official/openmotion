export function generateLayerId(prefix = 'layer') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function cloneLayer(layer) {
  if (!layer) return null;
  try {
    if (typeof structuredClone === 'function') {
      return structuredClone(layer);
    }
  } catch {}
  try {
    return JSON.parse(JSON.stringify(layer));
  } catch {
    return null;
  }
}

export function isGroupLayer(layer) {
  if (!layer || typeof layer !== 'object') return false;
  const tag = (layer.tag || '').toLowerCase();
  const hasScene = Boolean(layer.scene && Array.isArray(layer.scene.layers));
  return (tag === 'group' || tag === 'embedscene') && hasScene;
}

export function reassignLayerIds(layer) {
  if (!layer || typeof layer !== 'object') return layer;
  layer.id = generateLayerId(layer.tag === 'group' ? 'group' : 'layer');
  if (layer.scene && Array.isArray(layer.scene.layers)) {
    for (const child of layer.scene.layers) {
      reassignLayerIds(child);
    }
  }
  return layer;
}

export function findLayer(scene, targetLayerOrId) {
  if (!scene || !targetLayerOrId) return null;
  const id = typeof targetLayerOrId === 'string' ? targetLayerOrId : targetLayerOrId.id;

  const search = (container) => {
    if (!container || !Array.isArray(container.layers)) return null;
    for (const l of container.layers) {
      if (l.id === id || l === targetLayerOrId) return l;
      if (l.scene && Array.isArray(l.scene.layers)) {
        const found = search(l.scene);
        if (found) return found;
      }
    }
    return null;
  };

  return search(scene);
}

export function findParentArray(scene, targetLayerOrId) {
  if (!scene || !targetLayerOrId) return null;
  const id = typeof targetLayerOrId === 'string' ? targetLayerOrId : targetLayerOrId.id;

  const search = (container) => {
    if (!container || !Array.isArray(container.layers)) return null;
    for (const l of container.layers) {
      if (l.id === id || l === targetLayerOrId) {
        return container.layers;
      }
      if (l.scene && Array.isArray(l.scene.layers)) {
        const found = search(l.scene);
        if (found) return found;
      }
    }
    return null;
  };

  return search(scene);
}

export function duplicateLayer(scene, targetLayerOrId) {
  if (!scene || !targetLayerOrId) return null;

  if (Array.isArray(targetLayerOrId)) {
    const results = [];
    for (const target of targetLayerOrId) {
      const dup = duplicateLayer(scene, target);
      if (dup) results.push(dup);
    }
    return results;
  }

  const target = typeof targetLayerOrId === 'string' ? findLayer(scene, targetLayerOrId) : targetLayerOrId;
  if (!target) return null;

  const parentArr = findParentArray(scene, target);
  if (!parentArr) return null;

  const clone = cloneLayer(target);
  if (!clone) return null;

  reassignLayerIds(clone);

  const idx = parentArr.indexOf(target);
  if (idx >= 0) {
    parentArr.splice(idx + 1, 0, clone);
  } else {
    parentArr.push(clone);
  }

  return clone;
}

export function splitLayerAtTime(scene, targetLayerOrId, splitTimeMs, options = {}) {
  if (!scene || !targetLayerOrId || typeof splitTimeMs !== 'number') return null;

  if (Array.isArray(targetLayerOrId)) {
    const results = [];
    for (const target of targetLayerOrId) {
      const res = splitLayerAtTime(scene, target, splitTimeMs, options);
      if (res) results.push(res);
    }
    return results;
  }

  const layer = typeof targetLayerOrId === 'string' ? findLayer(scene, targetLayerOrId) : targetLayerOrId;
  if (!layer) return null;

  const parentArr = findParentArray(scene, layer);
  if (!parentArr) return null;

  const s = layer.startTime || 0;
  const e = layer.endTime != null ? layer.endTime : (scene.totalTime || 0);
  const minMargin = typeof options.minMargin === 'number' ? options.minMargin : 1;

  if (splitTimeMs <= s + minMargin || splitTimeMs >= e - minMargin) {
    return null;
  }

  const cutDuration = splitTimeMs - s;
  const origInTime = layer.inTime || 0;
  const origOutTime = layer.outTime != null ? layer.outTime : origInTime + (e - s);

  const rightSlice = cloneLayer(layer);
  if (!rightSlice) return null;

  reassignLayerIds(rightSlice);
  rightSlice.startTime = splitTimeMs;
  rightSlice.endTime = e;

  layer.endTime = splitTimeMs;

  const isMedia = Boolean(layer.inTime != null || layer.outTime != null || layer.src || layer.fillVideo);
  if (isMedia) {
    layer.outTime = origInTime + cutDuration;
    rightSlice.inTime = origInTime + cutDuration;
    rightSlice.outTime = origOutTime;
  }

  const idx = parentArr.indexOf(layer);
  if (idx >= 0) {
    parentArr.splice(idx + 1, 0, rightSlice);
  } else {
    parentArr.push(rightSlice);
  }

  return {
    left: layer,
    right: rightSlice,
    newLayer: rightSlice
  };
}

export function groupLayers(scene, layerIdsOrLayers, options = {}) {
  if (!scene || !Array.isArray(layerIdsOrLayers) || layerIdsOrLayers.length === 0) {
    return null;
  }

  const resolvedLayers = layerIdsOrLayers
    .map((item) => (typeof item === 'string' ? findLayer(scene, item) : item))
    .filter(Boolean);

  if (resolvedLayers.length === 0) return null;

  const parentArrays = new Set(resolvedLayers.map((l) => findParentArray(scene, l)));
  if (parentArrays.size > 1) {
    return null;
  }

  const par = parentArrays.values().next().value;
  if (!par) return null;

  const sceneTotalTime = scene.totalTime || 0;
  const minStart = Math.min(...resolvedLayers.map((l) => l.startTime || 0));
  const maxEnd = Math.max(...resolvedLayers.map((l) => (l.endTime != null ? l.endTime : sceneTotalTime)));
  const totalDuration = Math.max(1, maxEnd - minStart);

  const width = scene.width || 1080;
  const height = scene.height || 1920;
  const fps = scene.fps || 30;

  const clonedChildren = resolvedLayers.map((l) => {
    const cl = cloneLayer(l);
    cl.startTime = Math.max(0, (cl.startTime || 0) - minStart);
    if (cl.endTime != null) {
      cl.endTime = Math.max(0, cl.endTime - minStart);
    }
    return cl;
  });

  const mode = options.mode || 'normal';
  let defaultLabel = 'Grup';
  if (mode === 'mask' || options.mask) {
    defaultLabel = 'Masking Grup';
  } else if (mode === 'exclude') {
    defaultLabel = 'Exclude Grup';
  }

  const groupLayer = {
    id: generateLayerId('group'),
    tag: 'group',
    label: options.label || defaultLabel,
    startTime: minStart,
    endTime: maxEnd,
    inTime: 0,
    outTime: totalDuration,
    transform: {
      location: { value: [width / 2, height / 2, 0], kfs: [] },
      scale: { value: [1, 1], kfs: [] },
      rotation: { value: [0], kfs: [] },
      opacity: { value: [1], kfs: [] }
    },
    scene: {
      title: options.label || defaultLabel,
      width,
      height,
      totalTime: totalDuration,
      fps,
      layers: clonedChildren
    },
    effects: []
  };

  if (mode === 'mask' || options.mask) {
    groupLayer.mask = true;
    if (groupLayer.scene.layers.length > 0) {
      groupLayer.scene.layers[0].mask = true;
      groupLayer.scene.layers[0].maskType = 'alpha';
    }
  } else if (mode === 'exclude') {
    groupLayer.blendMode = 'exclude';
  }

  const firstIdx = par.indexOf(resolvedLayers[0]);

  for (const l of resolvedLayers) {
    const idx = par.indexOf(l);
    if (idx >= 0) {
      par.splice(idx, 1);
    }
  }

  if (firstIdx >= 0) {
    par.splice(firstIdx, 0, groupLayer);
  } else {
    par.push(groupLayer);
  }

  return groupLayer;
}

export function ungroupLayers(scene, groupLayerOrId) {
  if (!scene || !groupLayerOrId) return null;

  const group = typeof groupLayerOrId === 'string' ? findLayer(scene, groupLayerOrId) : groupLayerOrId;
  if (!group || !isGroupLayer(group)) return null;

  const par = findParentArray(scene, group);
  if (!par) return null;

  const idx = par.indexOf(group);
  if (idx < 0) return null;

  const children = group.scene.layers || [];
  const gStart = group.startTime || 0;

  par.splice(idx, 1);

  const restoredLayers = [];
  children.forEach((c, i) => {
    const cl = cloneLayer(c);
    cl.startTime = (cl.startTime || 0) + gStart;
    if (cl.endTime != null) {
      cl.endTime += gStart;
    }
    par.splice(idx + i, 0, cl);
    restoredLayers.push(cl);
  });

  return restoredLayers;
}
