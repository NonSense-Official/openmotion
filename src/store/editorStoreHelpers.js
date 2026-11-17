export const DEFAULT_SCENE = {
  title: 'Proyek Baru',
  width: 720,
  height: 1280,
  fps: 30,
  totalTime: 5000,
  backgroundColor: [0.08, 0.09, 0.13, 1],
  layers: []
};

export const MAX_HISTORY = 50;

export function collectKeyframeTimes(activeScene, targetId) {
  const times = new Set([0, activeScene.totalTime || 5000]);
  (activeScene.bookmarks || []).forEach((b) => times.add(b));
  const layers = targetId
    ? (activeScene.layers || []).filter((l) => l.id === targetId)
    : (activeScene.layers || []);
  layers.forEach((l) => {
    if (l.startTime != null) times.add(l.startTime);
    if (l.endTime != null) times.add(l.endTime);
    if (l.transform) {
      Object.values(l.transform).forEach((p) => {
        (p?.kfs || []).forEach((kf) => times.add(kf.t ?? kf.time ?? 0));
      });
    }
  });
  return Array.from(times).sort((a, b) => a - b);
}

export function cloneScene(scene) {
  if (!scene) return null;
  try {
    return JSON.parse(JSON.stringify(scene, (key, val) => {
      if (key === 'parentLayer') return undefined;
      if (key === 'layerById' && val instanceof Map) return undefined;
      return val;
    }));
  } catch {
    return null;
  }
}
