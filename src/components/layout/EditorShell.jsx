import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useProjectStore } from '../../store/projectStore';
import { convertAlightLink } from '../../converter/alinkconv';
import { parseAlightXml } from '../../engine/parser/XmlSceneParser';
import TopHeaderBar from '../header/TopHeaderBar';
import PreviewStage from '../stage/PreviewStage';
import Playbar from '../playbar/Playbar';
import TimelineDock from '../timeline/TimelineDock';
import InspectorDock from '../inspector/InspectorDock';
import DockSplitter from './DockSplitter';
import AddLayerModal from '../modals/AddLayerModal';
import ProjectSettingsModal from '../modals/ProjectSettingsModal';
import ExportVideoModal from '../modals/ExportVideoModal';
import CurveEditorModal from '../editors/animationcurve/CurveEditorModal';
import MoveTransformDock from '../editors/movetransform/MoveTransformDock';
import LiveShapeEditor from '../editors/liveshape/LiveShapeEditor';
import EditPointsEditor from '../editors/editpoints/EditPointsEditor';
import FreehandDrawing from '../editors/drawing/FreehandDrawing';
import { usePlaybackLoop } from '../../hooks/usePlaybackLoop';

export default function EditorShell({ onExit }) {
  usePlaybackLoop();
  const bottomContainerRef = useRef(null);

  const activeScene = useEditorStore((state) => state.activeScene);
  const activeToolMode = useEditorStore((state) => state.activeToolMode);
  const activeSubpanel = useEditorStore((state) => state.activeSubpanel);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const dockWidth = useEditorStore((state) => state.dockWidth);
  const setDockWidth = useEditorStore((state) => state.setDockWidth);
  const setProject = useEditorStore((state) => state.setProject);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);
  const setActiveSubpanel = useEditorStore((state) => state.setActiveSubpanel);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const [currentDockWidth, setCurrentDockWidth] = useState(() => {
    const saved = localStorage.getItem('om_dock_inspector_width');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 260 && parsed <= 850) return parsed;
    }
    return dockWidth || 380;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [curveEditorTarget, setCurveEditorTarget] = useState(null);

  useEffect(() => {
    fetchProjects().catch(() => {});

    const params = new URLSearchParams(window.location.search);
    const linkParam = params.get('alight') || params.get('url') || params.get('preset') || params.get('drive');

    if (linkParam) {
      const fullUrl = /^https?:\/\//i.test(linkParam) || (linkParam.length >= 25 && !linkParam.includes('.'))
        ? linkParam
        : `https://alight.link/${linkParam}`;

      convertAlightLink(fullUrl)
        .then((result) => {
          if (result && result.xml) {
            const scene = parseAlightXml(result.xml, result.xmlName);
            const newId = `proj_${Math.random().toString(36).substring(2, 9)}`;
            setProject({
              id: newId,
              name: scene.title || result.xmlName || 'Preset Alight',
              packageId: result.packageId || null,
              width: scene.width,
              height: scene.height,
              fps: scene.fps,
              xml: result.xml,
              scene: { ...scene, id: newId, packageId: result.packageId || null }
            });
            window.history.replaceState({ projectId: newId }, '', `/proyek/${newId}`);
          }
        })
        .catch(() => {});
    }
  }, [fetchProjects, setProject]);

  const handleDockResize = (newWidth) => {
    setCurrentDockWidth(newWidth);
    setDockWidth(newWidth);
    try {
      localStorage.setItem('om_dock_inspector_width', String(newWidth));
    } catch {}
  };

  const handleHeaderBack = () => {
    if (activeToolMode) {
      setActiveToolMode(null);
    } else if (activeSubpanel) {
      setActiveSubpanel(null);
    }
  };

  const handleApplyCurve = (token) => {
    if (!token) return;
    const layerId = curveEditorTarget?.layerId || selectedLayerIds[0];
    if (!layerId) return;

    const scene = useEditorStore.getState().activeScene;
    if (!scene) return;

    const layer = (scene.layers || []).find((l) => l.id === layerId);
    if (!layer) return;

    const tab = curveEditorTarget?.tab || 'pos';
    const propKey = tab === 'rot' ? 'rotation'
      : tab === 'scale' ? 'scale'
      : tab === 'skew' ? 'skew'
      : tab === 'pivot' ? 'pivot'
      : 'location';

    const tr = layer.transform || {};
    const prop = tr[propKey];
    if (prop && Array.isArray(prop.kfs) && prop.kfs.length > 0) {
      const playheadSec = (useEditorStore.getState().playheadMs || 0) / 1000;
      let targetKf = prop.kfs.find((k) => Number(k.t) >= playheadSec - 0.05);
      if (!targetKf) targetKf = prop.kfs[prop.kfs.length - 1];
      if (targetKf) {
        targetKf.e = token;
        targetKf.easing = token;
        updateLayer(layerId, {
          transform: {
            ...tr,
            [propKey]: {
              ...prop,
              kfs: [...prop.kfs]
            }
          }
        });
      }
    }
  };

  return (
    <div id="am-mobile-root" className="am-mobile-root am-layout-dock">
      <TopHeaderBar
        onExit={onExit}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onBack={handleHeaderBack}
        onDone={handleHeaderBack}
      />

      <PreviewStage />

      <Playbar />

      <section
        id="am-bottom-container"
        className="am-bottom-container am-dock-active"
        ref={bottomContainerRef}
        style={{ '--am-dock-width': `${currentDockWidth}px` }}
      >
        <TimelineDock onOpenAddModal={() => setIsAddModalOpen(true)} />

        <DockSplitter
          containerRef={bottomContainerRef}
          inspectorWidth={currentDockWidth}
          onResize={handleDockResize}
        />

        <aside id="am-dock-inspector" className="am-dock-inspector" style={{ width: `${currentDockWidth}px` }}>
          <InspectorDock
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenCurveEditor={(target) => setCurveEditorTarget(target)}
          />
        </aside>
      </section>

      {activeToolMode === 'movetransform' && (
        <MoveTransformDock
          isOpen={true}
          onClose={() => setActiveToolMode(null)}
          onOpenCurveEditor={(target) => setCurveEditorTarget(target)}
        />
      )}

      {activeToolMode === 'liveshape' && (
        <LiveShapeEditor
          isOpen={true}
          onClose={() => setActiveToolMode(null)}
        />
      )}

      {activeToolMode === 'editpoints' && (
        <EditPointsEditor
          isOpen={true}
          onClose={() => setActiveToolMode(null)}
          onOpenCurveEditor={(target) => setCurveEditorTarget(target)}
        />
      )}

      {activeToolMode === 'drawing' && (
        <FreehandDrawing
          isOpen={true}
          onClose={() => setActiveToolMode(null)}
        />
      )}

      {isAddModalOpen && (
        <AddLayerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <ProjectSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isExportOpen && (
        <ExportVideoModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {curveEditorTarget && (
        <CurveEditorModal
          isOpen={Boolean(curveEditorTarget)}
          target={curveEditorTarget}
          onClose={() => setCurveEditorTarget(null)}
          onApplyCurve={handleApplyCurve}
        />
      )}
    </div>
  );
}
