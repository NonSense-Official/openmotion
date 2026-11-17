import React, { useRef, useEffect } from 'react';

export function BezierCanvas({
  p1 = { x: 0.42, y: 0.0 },
  p2 = { x: 0.58, y: 1.0 },
  onChangeHandles
}) {
  const canvasRef = useRef(null);
  const dragTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(10, Math.round((rect.width || 200) * dpr));
    const h = Math.max(10, Math.round((rect.height || 200) * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const padX = 36 * dpr;
    const padY = 36 * dpr;
    const boxW = canvas.width - 2 * padX;
    const boxH = canvas.height - 2 * padY;

    const toX = (u) => padX + u * boxW;
    const toY = (v) => padY + (1 - v) * boxH;

    ctx.fillStyle = '#1e2230';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) {
      const gx = toX(i / 4);
      const gy = toY(i / 4);
      ctx.moveTo(gx, toY(0));
      ctx.lineTo(gx, toY(1));
      ctx.moveTo(toX(0), gy);
      ctx.lineTo(toX(1), gy);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2 * dpr;
    ctx.strokeRect(toX(0), toY(1), boxW, boxH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4 * dpr, 4 * dpr]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(1), toY(1));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(p1.x), toY(p1.y));
    ctx.moveTo(toX(1), toY(1));
    ctx.lineTo(toX(p2.x), toY(p2.y));
    ctx.stroke();

    ctx.strokeStyle = '#00ffa8';
    ctx.lineWidth = 3.5 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.bezierCurveTo(toX(p1.x), toY(p1.y), toX(p2.x), toY(p2.y), toX(1), toY(1));
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(toX(0), toY(0), 3.5 * dpr, 0, Math.PI * 2);
    ctx.arc(toX(1), toY(1), 3.5 * dpr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5 * dpr;
    ctx.fillStyle = '#00ffa8';
    ctx.beginPath();
    ctx.arc(toX(p1.x), toY(p1.y), 7.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(toX(p2.x), toY(p2.y), 7.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [p1, p2]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { u: 0, v: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const padX = 36 * dpr;
    const padY = 36 * dpr;
    const boxW = canvas.width - 2 * padX;
    const boxH = canvas.height - 2 * padY;

    const px = (e.clientX - rect.left) * dpr;
    const py = (e.clientY - rect.top) * dpr;

    const u = (px - padX) / boxW;
    const v = 1 - (py - padY) / boxH;

    return {
      u: Math.max(0, Math.min(1, Math.round(u * 100) / 100)),
      v: Math.max(-0.5, Math.min(1.5, Math.round(v * 100) / 100))
    };
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const padX = 36 * dpr;
    const padY = 36 * dpr;
    const boxW = canvas.width - 2 * padX;
    const boxH = canvas.height - 2 * padY;

    const px = (e.clientX - rect.left) * dpr;
    const py = (e.clientY - rect.top) * dpr;

    const h1x = padX + p1.x * boxW;
    const h1y = padY + (1 - p1.y) * boxH;
    const h2x = padX + p2.x * boxW;
    const h2y = padY + (1 - p2.y) * boxH;

    const d1 = Math.hypot(px - h1x, py - h1y);
    const d2 = Math.hypot(px - h2x, py - h2y);

    if (d1 < 25 * dpr) {
      dragTargetRef.current = 1;
    } else if (d2 < 25 * dpr) {
      dragTargetRef.current = 2;
    } else {
      dragTargetRef.current = d1 < d2 ? 1 : 2;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!dragTargetRef.current) return;
    const { u, v } = getCanvasCoords(e);
    if (dragTargetRef.current === 1) {
      onChangeHandles && onChangeHandles({ x: u, y: v }, p2);
    } else if (dragTargetRef.current === 2) {
      onChangeHandles && onChangeHandles(p1, { x: u, y: v });
    }
  };

  const handlePointerUp = (e) => {
    dragTargetRef.current = 0;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      className="am-curve-canvas-wrap"
      style={{
        width: '100%',
        maxWidth: 240,
        height: 180,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
      }}
    >
      <canvas
        ref={canvasRef}
        id="am-curve-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
          cursor: 'pointer'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}

export default BezierCanvas;
