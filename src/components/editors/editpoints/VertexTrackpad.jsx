import React, { useRef } from 'react';

export function VertexTrackpad({ onDelta, activePointIndex = 0, totalPoints = 0 }) {
  const padRef = useRef(null);
  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 });

  const handlePointerDown = (e) => {
    dragRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    onDelta && onDelta(dx, dy);
  };

  const handlePointerUp = (e) => {
    dragRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      ref={padRef}
      id="am-ep-trackpad"
      className="am-ep-trackpad"
      style={{
        flex: 1,
        width: '100%',
        maxWidth: 240,
        height: 140,
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 8,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair',
        touchAction: 'none',
        userSelect: 'none',
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.4)'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="am-trackpad-guide am-corner-nw" style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: '2px solid rgba(255,255,255,0.2)', borderLeft: '2px solid rgba(255,255,255,0.2)' }} />
      <div className="am-trackpad-guide am-corner-ne" style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: '2px solid rgba(255,255,255,0.2)', borderRight: '2px solid rgba(255,255,255,0.2)' }} />
      <div className="am-trackpad-guide am-corner-sw" style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: '2px solid rgba(255,255,255,0.2)', borderLeft: '2px solid rgba(255,255,255,0.2)' }} />
      <div className="am-trackpad-guide am-corner-se" style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: '2px solid rgba(255,255,255,0.2)', borderRight: '2px solid rgba(255,255,255,0.2)' }} />

      <div
        id="am-ep-trackpad-hint"
        className="am-ep-trackpad-hint"
        style={{
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.45)',
          textAlign: 'center',
          pointerEvents: 'none',
          padding: '0 16px'
        }}
      >
        Geser di sini untuk memindahkan titik {totalPoints > 0 ? `#${activePointIndex + 1}` : ''}
      </div>
    </div>
  );
}

export default VertexTrackpad;
