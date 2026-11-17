import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import ViewportCanvas from './ViewportCanvas';
import TransformGizmo from './TransformGizmo';
import ViewModeToolbar from './ViewModeToolbar';
import CameraIndicator from './CameraIndicator';

export default function PreviewStage() {
  const stageRef = useRef(null);
  const containerRef = useRef(null);

  const activeScene = useEditorStore((state) => state.activeScene);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const togglePlay = useEditorStore((state) => state.togglePlay);
  const zoom = useEditorStore((state) => state.zoom);
  const showGrid = useEditorStore((state) => state.showGrid);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const activeToolMode = useEditorStore((state) => state.activeToolMode);
  const clearSelection = useEditorStore((state) => state.clearSelection);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const sceneW = activeScene?.width || 720;
  const sceneH = activeScene?.height || 1280;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const padding = 24;
  const availW = Math.max(0, containerSize.width - padding);
  const availH = Math.max(0, containerSize.height - padding);

  let scaleFactor = 1;
  let canvasW = sceneW;
  let canvasH = sceneH;

  if (availW > 0 && availH > 0) {
    const scale = Math.min(availW / sceneW, availH / sceneH);
    scaleFactor = scale;
    canvasW = Math.round(sceneW * scale);
    canvasH = Math.round(sceneH * scale);
  }

  const handleStageClick = (e) => {
    if (e.target.id === 'am-preview-stage' || e.target.id === 'am-stage-container') {
      clearSelection();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const selectedLayer =
    selectedLayerIds.length === 1 && activeScene
      ? activeScene.layers.find((l) => l.id === selectedLayerIds[0])
      : null;

  const showGizmo = Boolean(selectedLayer);

  const gridStyle = showGrid
    ? {
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }
    : {};

  return (
    <main
      id="am-preview-stage"
      ref={stageRef}
      onClick={handleStageClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        id="am-stage-container"
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <div
          id="am-canvas-wrapper"
          style={{
            position: 'relative',
            width: canvasW,
            height: canvasH,
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...gridStyle
          }}
        >
          <ViewportCanvas />

          {showGizmo && (
            <TransformGizmo
              layer={selectedLayer}
              scaleFactor={scaleFactor}
            />
          )}

          {!isPlaying && selectedLayerIds.length === 0 && (
            <div
              className="stage-hint"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: 0.85
              }}
            >
              <span
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(6px)',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
                onClick={togglePlay}
                title="Putar preview"
              >
                <img
                  src="./icons/ac_ic_play.svg"
                  alt="Play"
                  style={{ width: 22, height: 22, marginLeft: 2 }}
                />
              </span>
            </div>
          )}
        </div>

        {isDragOver && (
          <div
            id="dropHint"
            style={{
              position: 'absolute',
              inset: 12,
              zIndex: 35,
              background: 'rgba(15, 18, 28, 0.88)',
              border: '2px dashed var(--am-y1, #00ffa8)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              pointerEvents: 'none'
            }}
          >
            Lepas file di sini (XML, foto, video, audio)
          </div>
        )}

        <CameraIndicator />
        <ViewModeToolbar />
      </div>
    </main>
  );
}
