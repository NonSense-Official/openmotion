import React, { useRef, useEffect } from 'react';

export function ParamValueSpinner({
  value = 0,
  min,
  max,
  step = 1,
  isAngle = false,
  onChange
}) {
  const canvasRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startVal: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(10, Math.round((rect.width || 120) * dpr));
    const h = Math.max(10, Math.round((rect.height || 45) * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const tickSpacing = 5.5 * dpr;
    const tickWidth = 1 * dpr;
    const needleWidth = 1.5 * dpr;
    const curVal = typeof value === 'number' ? value : 0;
    const offset = (curVal / step) * tickSpacing;

    const halfTicks = Math.ceil(cx / tickSpacing) + 2;
    const centerIndex = Math.round(curVal / step);

    ctx.lineWidth = tickWidth;
    ctx.lineCap = 'round';

    for (let i = centerIndex - halfTicks; i <= centerIndex + halfTicks; i++) {
      const x = cx + (i * tickSpacing - offset);
      if (x < 0 || x > w) continue;

      const dist = Math.abs(x - cx);
      const alpha = Math.max(0, 1.0 - dist / cx);
      const isMajor = i % 10 === 0 || i === 0;

      ctx.beginPath();
      if (isMajor) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.moveTo(x, 6 * dpr);
        ctx.lineTo(x, h - 6 * dpr);
      } else {
        ctx.strokeStyle = `rgba(112, 121, 140, ${alpha * 0.65})`;
        ctx.moveTo(x, 14 * dpr);
        ctx.lineTo(x, h - 14 * dpr);
      }
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = needleWidth;
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
  }, [value, step]);

  const handlePointerDown = (e) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startVal: typeof value === 'number' ? value : 0
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const sensitivity = isAngle ? 0.5 : 0.8;
    const dVal = -dx * step * sensitivity;
    let newVal = dragRef.current.startVal + dVal;

    if (min !== undefined) newVal = Math.max(min, newVal);
    if (max !== undefined) newVal = Math.min(max, newVal);

    if (step >= 1) newVal = Math.round(newVal);
    else newVal = Math.round(newVal / step) * step;

    onChange && onChange(newVal);
  };

  const handlePointerUp = (e) => {
    dragRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      className="am-ls-spinner-wrap"
      style={{
        width: '100%',
        height: 44,
        background: 'rgba(0, 0, 0, 0.35)',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        className="am-ls-spinner-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'ew-resize',
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}

export default ParamValueSpinner;
