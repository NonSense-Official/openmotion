import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function AudioLevelMeter({ audioGraph = null }) {
  const canvasRef = useRef(null);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const activeScene = useEditorStore((state) => state.activeScene);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let smoothedLevel = 0;
    let peakLevel = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.max(10, Math.round(rect.width || 600));
      const targetH = Math.max(2, Math.round(rect.height || 4));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      let targetLevel = 0;

      const graph = audioGraph || (typeof window !== 'undefined' ? window.__audioGraph : null);
      if (graph && typeof graph.getMasterLevel === 'function') {
        const { rms, peak } = graph.getMasterLevel();
        targetLevel = Math.max(rms, peak);
      } else if (isPlaying) {
        const layers = activeScene?.layers || [];
        const hasAudio = layers.some(
          (l) => l.tag === 'audio' || l.tag === 'video' || l.src || l.gain
        );
        if (hasAudio) {
          const t = Date.now() / 120;
          targetLevel =
            0.35 +
            0.35 * Math.abs(Math.sin(t * 1.7) * Math.cos(t * 2.3)) +
            0.2 * (Math.random() - 0.5);
          targetLevel = Math.max(0.1, Math.min(1.0, targetLevel));
        }
      }

      if (targetLevel > smoothedLevel) {
        smoothedLevel += (targetLevel - smoothedLevel) * 0.4;
      } else {
        smoothedLevel += (targetLevel - smoothedLevel) * 0.1;
      }

      if (smoothedLevel > peakLevel) {
        peakLevel = smoothedLevel;
      } else {
        peakLevel = Math.max(0, peakLevel - 0.01);
      }

      if (smoothedLevel > 0.01 || isPlaying) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0.0, '#FF0000');
        grad.addColorStop(0.2, '#F3C507');
        grad.addColorStop(0.4, '#00FF36');
        grad.addColorStop(0.6, '#00FF36');
        grad.addColorStop(0.8, '#F3C507');
        grad.addColorStop(1.0, '#FF0000');

        ctx.globalAlpha = 0.25;
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        if (smoothedLevel > 0.01) {
          const half = w / 2;
          const span = half * Math.min(1, smoothedLevel);
          const left = half - span;
          const right = half + span;

          ctx.globalAlpha = 1.0;
          ctx.fillStyle = grad;
          ctx.fillRect(left, 0, right - left, h);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, activeScene, audioGraph]);

  return (
    <canvas
      ref={canvasRef}
      id="am-level-meter-view"
      className="am-level-meter-canvas"
      width={600}
      height={4}
    />
  );
}
