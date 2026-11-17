import React, { useRef, useState, useCallback } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { AffineMatrix2D } from '../../engine/math/AffineMatrix2D';

export default function TransformGizmo({
  layer,
  scaleFactor = 1,
  onUpdateTransform
}) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const pushUndo = useEditorStore((state) => state.pushUndo);

  const [dragState, setDragState] = useState(null);
  const svgRef = useRef(null);

  const targetLayer =
    layer ||
    (selectedLayerIds.length === 1 && activeScene
      ? activeScene.layers.find((l) => l.id === selectedLayerIds[0])
      : null);

  const handleCommitTransform = useCallback(
    (prop, val) => {
      if (onUpdateTransform) {
        onUpdateTransform(prop, val);
        return;
      }
      if (!targetLayer) return;
      const tr = targetLayer.transform || {};
      const existing = tr[prop];
      const updatedTr = {
        ...tr,
        [prop]: existing ? { ...existing, value: val } : { value: val, kfs: [] }
      };
      updateLayer(targetLayer.id, { transform: updatedTr });
    },
    [onUpdateTransform, targetLayer, updateLayer]
  );

  if (!targetLayer || targetLayer.hidden) {
    return null;
  }

  const tr = targetLayer.transform || {};
  const locVal = tr.location?.value || [0, 0, 0];
  const loc = Array.isArray(locVal) ? locVal : [locVal.x || 0, locVal.y || 0, locVal.z || 0];

  const scaleVal = tr.scale?.value || [1, 1];
  const sc = Array.isArray(scaleVal) ? scaleVal : [scaleVal.x ?? 1, scaleVal.y ?? 1];

  const rotVal = tr.rotation?.value;
  const rot = typeof rotVal === 'number' ? rotVal : Array.isArray(rotVal) ? rotVal[0] || 0 : 0;

  const pivVal = tr.pivot?.value || [0, 0];
  const piv = Array.isArray(pivVal) ? pivVal : [pivVal.x || 0, pivVal.y || 0];

  const w = targetLayer.width || targetLayer.size?.[0] || 200;
  const h = targetLayer.height || targetLayer.size?.[1] || 200;

  const mat = AffineMatrix2D.fromTransform({
    location: loc,
    scale: sc,
    rotation: rot,
    pivot: piv
  });

  const nw = mat.transformPoint(-w / 2, -h / 2);
  const ne = mat.transformPoint(w / 2, -h / 2);
  const se = mat.transformPoint(w / 2, h / 2);
  const sw = mat.transformPoint(-w / 2, h / 2);
  const pivotPoint = mat.transformPoint(0, 0);
  const topMid = mat.transformPoint(0, -h / 2);

  const rotNormX = -mat.elements[2];
  const rotNormY = -mat.elements[3];
  const rotLen = Math.hypot(rotNormX, rotNormY) || 1;
  const rotKnobDist = 32 / (scaleFactor || 1);
  const rotKnob = {
    x: topMid.x + (rotNormX / rotLen) * rotKnobDist,
    y: topMid.y + (rotNormY / rotLen) * rotKnobDist
  };

  const handlePointerDown = (e, mode, handleCorner = null) => {
    e.stopPropagation();
    e.preventDefault();

    if (svgRef.current) {
      svgRef.current.setPointerCapture(e.pointerId);
    }

    setDragState({
      mode,
      handleCorner,
      startX: e.clientX,
      startY: e.clientY,
      initLoc: [...loc],
      initScale: [...sc],
      initRot: rot,
      initPivot: [...piv],
      pivotScreen: {
        x: pivotPoint.x * scaleFactor,
        y: pivotPoint.y * scaleFactor
      }
    });
  };

  const handlePointerMove = (e) => {
    if (!dragState) return;
    const sf = scaleFactor || 1;
    const dx = (e.clientX - dragState.startX) / sf;
    const dy = (e.clientY - dragState.startY) / sf;

    if (dragState.mode === 'pos') {
      const nx = Math.round(dragState.initLoc[0] + dx);
      const ny = Math.round(dragState.initLoc[1] + dy);
      handleCommitTransform('location', [nx, ny, dragState.initLoc[2] || 0]);
    } else if (dragState.mode === 'pivot') {
      const npx = Math.round(dragState.initPivot[0] + dx);
      const npy = Math.round(dragState.initPivot[1] + dy);
      handleCommitTransform('pivot', [npx, npy]);
    } else if (dragState.mode === 'rot') {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const curPx = e.clientX - rect.left;
      const curPy = e.clientY - rect.top;
      const angle =
        Math.atan2(curPy - dragState.pivotScreen.y, curPx - dragState.pivotScreen.x) *
          (180 / Math.PI) +
        90;
      handleCommitTransform('rotation', [Math.round(angle * 10) / 10]);
    } else if (dragState.mode === 'scale') {
      const factorX = 1 + dx / 150;
      const factorY = 1 + dy / 150;
      const factor = Math.max(0.05, (factorX + factorY) / 2);
      const nsx = Math.round(dragState.initScale[0] * factor * 100) / 100;
      const nsy = Math.round(dragState.initScale[1] * factor * 100) / 100;
      handleCommitTransform('scale', [nsx, nsy]);
    }
  };

  const handlePointerUp = (e) => {
    if (!dragState) return;
    if (svgRef.current) {
      try {
        svgRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
    setDragState(null);
  };

  const sceneW = activeScene?.width || 720;
  const sceneH = activeScene?.height || 1280;
  const polyPoints = `${nw.x},${nw.y} ${ne.x},${ne.y} ${se.x},${se.y} ${sw.x},${sw.y}`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${sceneW} ${sceneH}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 15,
        touchAction: 'none'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <polygon
        points={polyPoints}
        fill="rgba(0, 255, 168, 0.04)"
        stroke="#00ffa8"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
        style={{ cursor: 'move', pointerEvents: 'auto' }}
        onPointerDown={(e) => handlePointerDown(e, 'pos')}
      />

      <line
        x1={topMid.x}
        y1={topMid.y}
        x2={rotKnob.x}
        y2={rotKnob.y}
        stroke="rgba(0, 255, 168, 0.6)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx={rotKnob.x}
        cy={rotKnob.y}
        r={7 / (scaleFactor || 1)}
        fill="#00ffa8"
        stroke="#141620"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        style={{ cursor: 'grab', pointerEvents: 'auto' }}
        onPointerDown={(e) => handlePointerDown(e, 'rot')}
      />

      {[
        { pt: nw, corner: 'nw' },
        { pt: ne, corner: 'ne' },
        { pt: se, corner: 'se' },
        { pt: sw, corner: 'sw' }
      ].map(({ pt, corner }) => (
        <circle
          key={corner}
          cx={pt.x}
          cy={pt.y}
          r={5.5 / (scaleFactor || 1)}
          fill="#00ffa8"
          stroke="#141620"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ cursor: 'nwse-resize', pointerEvents: 'auto' }}
          onPointerDown={(e) => handlePointerDown(e, 'scale', corner)}
        />
      ))}

      <line
        x1={pivotPoint.x - 7 / (scaleFactor || 1)}
        y1={pivotPoint.y}
        x2={pivotPoint.x + 7 / (scaleFactor || 1)}
        y2={pivotPoint.y}
        stroke="#ffd600"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={pivotPoint.x}
        y1={pivotPoint.y - 7 / (scaleFactor || 1)}
        x2={pivotPoint.x}
        y2={pivotPoint.y + 7 / (scaleFactor || 1)}
        stroke="#ffd600"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={pivotPoint.x}
        cy={pivotPoint.y}
        r={4.5 / (scaleFactor || 1)}
        fill="#ffd600"
        stroke="#141620"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{ cursor: 'move', pointerEvents: 'auto' }}
        onPointerDown={(e) => handlePointerDown(e, 'pivot')}
      />
    </svg>
  );
}
