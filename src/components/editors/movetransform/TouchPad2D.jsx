import React, { useRef } from 'react';

export function TouchPad2D({ icon, guideText, onDelta }) {
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
      className="am-mt-pad om-mt-pad"
      style={{
        width: '100%',
        maxWidth: 240,
        height: 140,
        position: 'relative',
        cursor: 'crosshair',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="om-mt-corner nw" style={{ position: 'absolute', top: 8, left: 8, width: 16, height: 16, pointerEvents: 'none' }}>
        <img src="./icons/ic_transform_guide_topleft.svg" alt="" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="om-mt-corner ne" style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, pointerEvents: 'none' }}>
        <img src="./icons/ic_transform_guide_topright.svg" alt="" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="om-mt-corner sw" style={{ position: 'absolute', bottom: 8, left: 8, width: 16, height: 16, pointerEvents: 'none' }}>
        <img src="./icons/ic_transform_guide_bottomleft.svg" alt="" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="om-mt-corner se" style={{ position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, pointerEvents: 'none' }}>
        <img src="./icons/ic_transform_guide_bottomright.svg" alt="" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="om-mt-axis-h" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div className="om-mt-axis-v" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <span className="om-mt-axis-tag-x" style={{ position: 'absolute', right: 10, top: 'calc(50% + 4px)', fontSize: 9, fontWeight: 700, color: '#848C98', pointerEvents: 'none' }}>X</span>
      <span className="om-mt-axis-tag-y" style={{ position: 'absolute', bottom: 8, left: 'calc(50% + 4px)', fontSize: 9, fontWeight: 700, color: '#848C98', pointerEvents: 'none' }}>Y</span>

      <div className="om-mt-pad-guide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none', padding: '0 16px', textAlign: 'center' }}>
        {icon && <img src={icon} width="24" height="24" style={{ opacity: 0.7 }} alt="" />}
        {guideText && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{guideText}</span>}
      </div>
    </div>
  );
}

export default TouchPad2D;
