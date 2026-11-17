import React, { useRef } from 'react';

export function RotationDial({ angle = 0, onChange }) {
  const wheelRef = useRef(null);
  const isDraggingRef = useRef(false);

  const computeAngle = (e) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    let deg = rad * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    deg = Math.round(deg * 10) / 10;
    onChange && onChange(deg);
  };

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    computeAngle(e);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    computeAngle(e);
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const normalizedAngle = typeof angle === 'number' ? angle : 0;

  return (
    <div className="om-mt-wheel-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="om-mt-wheel-val" style={{ fontSize: 13, fontWeight: 700, color: '#ffd600', fontFamily: 'monospace' }}>
        {normalizedAngle.toFixed(1)}°
      </div>

      <div
        ref={wheelRef}
        className="om-mt-wheel"
        style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          border: '2px solid #00ffa8',
          background: '#141620',
          position: 'relative',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(0,255,168,0.15)',
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="om-mt-needle"
          style={{
            position: 'absolute',
            top: 10,
            width: 3,
            height: 55,
            background: '#00ffa8',
            transformOrigin: 'bottom center',
            borderRadius: 2,
            pointerEvents: 'none',
            boxShadow: '0 0 6px rgba(0,255,168,0.6)',
            transform: `rotate(${normalizedAngle}deg)`
          }}
        />

        <div
          className="om-mt-wheel-center"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#ffd600',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
          <line x1="50" y1="4" x2="50" y2="10" stroke="#00ffa8" strokeWidth="2" />
          <line x1="96" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="50" y1="96" x2="50" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="4" y1="50" x2="10" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export default RotationDial;
