import { create } from 'zustand';
import { parseAlightXml } from '../engine/parser/XmlSceneParser';
import { DEFAULT_SCENE, MAX_HISTORY, collectKeyframeTimes, cloneScene } from './editorStoreHelpers';

export const useEditorStore = create((set, get) => ({
  activeScene: null,
  projectName: 'Proyek Baru',
  projectFps: 30,
  playheadMs: 0,
  isPlaying: false,
  selectedLayerIds: [],
  activeToolMode: 'select',
  activeSubpanel: null,
  dockWidth: 360,
  undoTrigger: 0,
  redoTrigger: 0,
  undoStack: [],
  redoStack: [],
  zoom: 100,
  showGrid: false,
  pixelPreview: false,
  isCameraViewActive: true,
  cameraMode: 'perspective',
  isViewModeBarOpen: true,
  renderer: null,
  isScrubbing: false,
  scrubStartMs: 0,

  setProject: (project) => {
    if (!project) {
      set({
        activeScene: null,
        projectName: 'Proyek Baru',
        projectFps: 30,
        playheadMs: 0,
        isPlaying: false,
        selectedLayerIds: [],
        undoStack: [],
        redoStack: []
      });
      return;
    }

    let scene = project.scene;
    if (!scene && project.xml) {
      try {
        scene = parseAlightXml(project.xml, project.name);
      } catch (err) {
        console.error('Error parsing project XML in editorStore:', err);
      }
    }

    if (!scene) {
      scene = {
        ...DEFAULT_SCENE,
        title: project.name || DEFAULT_SCENE.title,
        width: project.width || DEFAULT_SCENE.width,
        height: project.height || DEFAULT_SCENE.height,
        fps: project.fps || DEFAULT_SCENE.fps,
        totalTime: project.totalTime || DEFAULT_SCENE.totalTime,
        layers: Array.isArray(project.layers) ? project.layers : []
      };
    }

    scene = {
      ...scene,
      id: project.id || scene.id,
      packageId: project.packageId || scene.packageId || null
    };

    const renderer = get().renderer;
    if (renderer) {
      renderer.setScene(scene);
      renderer.renderAt(0);
    }

    set({
      activeScene: scene,
      projectName: project.name || scene.title || 'Proyek Baru',
      projectFps: project.fps || scene.fps || 30,
      playheadMs: 0,
      isPlaying: false,
      selectedLayerIds: scene.layers?.length ? [scene.layers[0].id] : [],
      undoStack: [cloneScene(scene)],
      redoStack: []
    });
  },

  setActiveScene: (scene) => {
    const prev = get().activeScene;
    if (prev) {
      get().pushUndo(cloneScene(prev));
    }
    set({
      activeScene: scene,
      projectName: scene?.title || get().projectName,
      projectFps: scene?.fps || get().projectFps
    });
  },

  updateActiveScene: (updater) => {
    const current = get().activeScene;
    if (!current) return;
    const snap = cloneScene(current);
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    get().pushUndo(snap);
    set({
      activeScene: updated,
      projectName: updated.title || get().projectName,
      projectFps: updated.fps || get().projectFps
    });
  },

  setPlayheadMs: (ms) => {
    const scene = get().activeScene;
    const maxDur = scene?.totalTime || 3600000;
    const clamped = Math.max(0, Math.min(ms, maxDur));
    set({ playheadMs: clamped });
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying: Boolean(isPlaying) });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setIsScrubbing: (isScrubbing, startMs) => {
    set((state) => ({
      isScrubbing: Boolean(isScrubbing),
      scrubStartMs: startMs !== undefined ? Number(startMs) : state.playheadMs
    }));
  },

  stepFrame: (frames = 1) => {
    const { playheadMs, projectFps, activeScene } = get();
    const fps = projectFps || activeScene?.fps || 30;
    const frameMs = 1000 / fps;
    const target = playheadMs + frames * frameMs;
    get().setPlayheadMs(Math.round(target / frameMs) * frameMs);
  },

  toggleBookmark: (timeMs) => {
    const { activeScene, playheadMs, projectFps } = get();
    if (!activeScene) return;
    const target = timeMs !== undefined ? timeMs : playheadMs;
    const fps = projectFps || activeScene.fps || 30;
    const tol = 1000 / fps / 2;
    const bookmarks = Array.isArray(activeScene.bookmarks) ? [...activeScene.bookmarks] : [];
    const idx = bookmarks.findIndex((b) => Math.abs(b - target) <= Math.max(25, tol));
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(Math.round(target));
      bookmarks.sort((a, b) => a - b);
    }
    get().updateActiveScene({ bookmarks });
  },

  jumpPrevKeyframeOrBookmark: (layerId) => {
    const { activeScene, playheadMs, selectedLayerIds } = get();
    if (!activeScene) return;
    const sorted = collectKeyframeTimes(activeScene, layerId || (selectedLayerIds.length === 1 ? selectedLayerIds[0] : null));
    let prev = 0;
    for (const t of sorted) {
      if (t < playheadMs - 1) prev = t;
      else break;
    }
    get().setPlayheadMs(prev);
  },

  jumpNextKeyframeOrBookmark: (layerId) => {
    const { activeScene, playheadMs, selectedLayerIds } = get();
    if (!activeScene) return;
    const sorted = collectKeyframeTimes(activeScene, layerId || (selectedLayerIds.length === 1 ? selectedLayerIds[0] : null));
    for (const t of sorted) {
      if (t > playheadMs + 1) {
        get().setPlayheadMs(t);
        return;
      }
    }
    get().setPlayheadMs(activeScene.totalTime || 5000);
  },

  setSelectedLayerIds: (ids) => {
    set({ selectedLayerIds: Array.isArray(ids) ? ids : [] });
  },

  selectLayer: (id, multi = false) => {
    set((state) => {
      if (multi) {
        if (state.selectedLayerIds.includes(id)) return state;
        return { selectedLayerIds: [...state.selectedLayerIds, id] };
      }
      return { selectedLayerIds: [id] };
    });
  },

  deselectLayer: (id) => {
    set((state) => ({
      selectedLayerIds: state.selectedLayerIds.filter((item) => item !== id)
    }));
  },

  clearSelection: () => {
    set({ selectedLayerIds: [] });
  },

  setActiveToolMode: (mode) => {
    set({ activeToolMode: mode });
  },

  setActiveSubpanel: (subpanel) => {
    set({ activeSubpanel: subpanel });
  },

  setDockWidth: (width) => {
    const clamped = Math.max(240, Math.min(width, 800));
    set({ dockWidth: clamped });
  },

  setZoom: (zoom) => {
    const clamped = Math.max(25, Math.min(zoom, 400));
    set({ zoom: clamped });
  },

  setShowGrid: (showGrid) => {
    set({ showGrid: Boolean(showGrid) });
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  setPixelPreview: (pixelPreview) => {
    set({ pixelPreview: Boolean(pixelPreview) });
  },

  togglePixelPreview: () => {
    set((state) => ({ pixelPreview: !state.pixelPreview }));
  },

  setIsCameraViewActive: (isActive) => {
    set({ isCameraViewActive: Boolean(isActive) });
  },

  toggleCameraView: () => {
    set((state) => ({ isCameraViewActive: !state.isCameraViewActive }));
  },

  setCameraMode: (mode) => {
    set({ cameraMode: mode });
  },

  setIsViewModeBarOpen: (isOpen) => {
    set({ isViewModeBarOpen: Boolean(isOpen) });
  },

  toggleViewModeBar: () => {
    set((state) => ({ isViewModeBarOpen: !state.isViewModeBarOpen }));
  },

  setRenderer: (renderer) => {
    set({ renderer });
  },

  addLayer: (layer) => {
    const scene = get().activeScene;
    if (!scene) return;
    const snap = cloneScene(scene);
    const newLayers = [...(scene.layers || []), layer];
    get().pushUndo(snap);
    set({
      activeScene: { ...scene, layers: newLayers },
      selectedLayerIds: [layer.id]
    });
  },

  removeLayer: (id) => {
    const scene = get().activeScene;
    if (!scene) return;
    const snap = cloneScene(scene);
    const newLayers = (scene.layers || []).filter((l) => l.id !== id);
    get().pushUndo(snap);
    set((state) => ({
      activeScene: { ...scene, layers: newLayers },
      selectedLayerIds: state.selectedLayerIds.filter((layerId) => layerId !== id)
    }));
  },

  updateLayer: (id, patch) => {
    const scene = get().activeScene;
    if (!scene) return;
    const snap = cloneScene(scene);
    const newLayers = (scene.layers || []).map((l) => {
      if (l.id !== id) return l;
      return typeof patch === 'function' ? patch(l) : { ...l, ...patch };
    });
    get().pushUndo(snap);
    set({ activeScene: { ...scene, layers: newLayers } });
  },

  pushUndo: (snapshot) => {
    if (!snapshot) return;
    set((state) => {
      const nextUndo = [...state.undoStack, snapshot];
      if (nextUndo.length > MAX_HISTORY) nextUndo.shift();
      return {
        undoStack: nextUndo,
        redoStack: []
      };
    });
  },

  undo: () => {
    const { undoStack, activeScene, redoStack } = get();
    if (!undoStack.length || !activeScene) return;

    const previousSnapshot = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const currentSnapshot = cloneScene(activeScene);

    set((state) => ({
      activeScene: previousSnapshot,
      projectName: previousSnapshot.title || state.projectName,
      projectFps: previousSnapshot.fps || state.projectFps,
      undoStack: newUndoStack,
      redoStack: [...redoStack, currentSnapshot],
      undoTrigger: state.undoTrigger + 1
    }));
  },

  redo: () => {
    const { redoStack, activeScene, undoStack } = get();
    if (!redoStack.length || !activeScene) return;

    const nextSnapshot = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const currentSnapshot = cloneScene(activeScene);

    set((state) => ({
      activeScene: nextSnapshot,
      projectName: nextSnapshot.title || state.projectName,
      projectFps: nextSnapshot.fps || state.projectFps,
      redoStack: newRedoStack,
      undoStack: [...undoStack, currentSnapshot],
      redoTrigger: state.redoTrigger + 1
    }));
  },

  triggerUndo: () => get().undo(),
  triggerRedo: () => get().redo(),

  resetEditor: () => {
    set({
      activeScene: null,
      projectName: 'Proyek Baru',
      projectFps: 30,
      playheadMs: 0,
      isPlaying: false,
      selectedLayerIds: [],
      activeToolMode: 'select',
      activeSubpanel: null,
      dockWidth: 360,
      undoTrigger: 0,
      redoTrigger: 0,
      undoStack: [],
      redoStack: []
    });
  }
}));
