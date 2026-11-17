import React, { useState, useEffect, useRef } from 'react';

export default function DockSplitter({
  containerRef,
  onResize,
  inspectorWidth,
  minWidth = 260,
  maxWidthRatio = 0.65
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({ startX: 0, startWidth: 0 });

  const handlePointerDown = (e) => {
    if (window.innerWidth < 768) return;
    const currentW = inspectorWidth || 380;
    dragInfoRef.current = {
      startX: e.clientX,
      startWidth: currentW
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const container = containerRef?.current;
    const containerWidth = container ? container.offsetWidth : window.innerWidth;
    const dx = dragInfoRef.current.startX - e.clientX;
    const maxW = Math.min(containerWidth - 300, Math.floor(containerWidth * maxWidthRatio));
    const nextWidth = Math.max(minWidth, Math.min(maxW, dragInfoRef.current.startWidth + dx));

    if (onResize) {
      onResize(nextWidth);
    }
  };

  const stopDragging = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already lost
    }
    if (inspectorWidth) {
      localStorage.setItem('om_dock_inspector_width', String(inspectorWidth));
    }
    window.dispatchEvent(new Event('resize'));
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  return (
    <div
      id="am-dock-splitter"
      className={`am-dock-splitter${isDragging ? ' dragging' : ''}`}
      title="Geser untuk mengubah ukuran panel"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div id="am-dock-splitter-handle" className="am-dock-splitter-handle" />
    </div>
  );
}
