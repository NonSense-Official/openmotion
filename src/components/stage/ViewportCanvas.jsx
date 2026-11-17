import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { WebGLRenderer } from '../../engine/renderer/WebGLRenderer';

export default function ViewportCanvas({ onRendererReady }) {
  const canvasRef = useRef(null);
  const debugCanvasRef = useRef(null);
  const rendererRef = useRef(null);

  const activeScene = useEditorStore((state) => state.activeScene);
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const pixelPreview = useEditorStore((state) => state.pixelPreview);
  const setRenderer = useEditorStore((state) => state.setRenderer);

  const sceneWidth = activeScene?.width || 720;
  const sceneHeight = activeScene?.height || 1280;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rendererInstance = null;
    try {
      rendererInstance = new WebGLRenderer(canvas, {
        alpha: true,
        antialias: false,
        preserveDrawingBuffer: true
      });
      rendererRef.current = rendererInstance;
      setRenderer(rendererInstance);

      if (activeScene) {
        rendererInstance.setScene(activeScene);
        rendererInstance.renderAt(playheadMs);
      }

      if (typeof onRendererReady === 'function') {
        onRendererReady(rendererInstance);
      }
    } catch (err) {
      console.error('Failed to initialize WebGLRenderer:', err);
    }

    return () => {
      if (rendererInstance) {
        rendererInstance.dispose();
      }
      rendererRef.current = null;
      setRenderer(null);
    };
  }, [setRenderer, onRendererReady]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (activeScene) {
      renderer.setScene(activeScene);
      renderer.renderAt(playheadMs);
    }
  }, [activeScene]);
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || isPlaying) return;
    renderer.renderAt(playheadMs);
  }, [playheadMs, isPlaying]);

  return (
    <>
      <canvas
        id="view"
        ref={canvasRef}
        width={sceneWidth}
        height={sceneHeight}
        style={{
          imageRendering: pixelPreview ? 'pixelated' : 'auto',
          aspectRatio: `${sceneWidth} / ${sceneHeight}`
        }}
      />
      <canvas
        id="debugCanvas"
        ref={debugCanvasRef}
        width={sceneWidth}
        height={sceneHeight}
        style={{
          aspectRatio: `${sceneWidth} / ${sceneHeight}`
        }}
      />
    </>
  );
}
