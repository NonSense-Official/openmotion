import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function CameraIndicator() {
  const activeScene = useEditorStore((state) => state.activeScene);
  const isCameraViewActive = useEditorStore((state) => state.isCameraViewActive);
  const toggleCameraView = useEditorStore((state) => state.toggleCameraView);
  const setCameraMode = useEditorStore((state) => state.setCameraMode);
  const updateLayer = useEditorStore((state) => state.updateLayer);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const cameraLayer = activeScene?.layers?.find(
    (l) => l.tag === 'camera' || l.type === 'camera'
  );
  const hasCamera = Boolean(cameraLayer);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!hasCamera || !isCameraViewActive) {
    return null;
  }

  const currentType = cameraLayer.cameraType === 'orthographic' ? 'orthographic' : 'perspective';
  const isPersp = currentType === 'perspective';

  const handleSelectMode = (mode) => {
    if (cameraLayer) {
      updateLayer(cameraLayer.id, { cameraType: mode });
    }
    setCameraMode(mode);
    setIsDropdownOpen(false);
  };

  const handleToggleMode = (e) => {
    e.stopPropagation();
    const nextMode = isPersp ? 'orthographic' : 'perspective';
    handleSelectMode(nextMode);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', top: 10, left: 12, zIndex: 25 }}
    >
      <div
        id="am-canvas-camera-pill"
        className="am-canvas-camera-pill"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        title="Tampilan Kamera Aktif (Klik untuk ubah perspektif)"
      >
        <img src="./icons/ic_camera_outline.svg" alt="Camera" />
        <span>{isPersp ? 'Kamera (Perspektif)' : 'Kamera (Paralel)'}</span>
        <button
          type="button"
          className="am-perspective-btn"
          style={{ width: 22, height: 20, padding: 0, border: 'none', background: 'transparent' }}
          onClick={handleToggleMode}
          title={isPersp ? 'Ubah ke Paralel' : 'Ubah ke Perspektif'}
        >
          <img
            src={isPersp ? './icons/ic_camera_perspective.svg' : './icons/ic_camera_parallel.svg'}
            alt="Mode"
            style={{ width: 14, height: 14 }}
          />
        </button>
      </div>

      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            background: 'rgba(20, 24, 34, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: 160,
            backdropFilter: 'blur(8px)',
            zIndex: 30
          }}
        >
          <button
            type="button"
            className="am-viewmode-btn"
            style={{
              width: '100%',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              padding: '0 8px',
              borderRadius: 6,
              background: isPersp ? 'rgba(0, 255, 168, 0.15)' : 'transparent',
              color: isPersp ? 'var(--am-y1, #00ffa8)' : '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => handleSelectMode('perspective')}
          >
            <img
              src="./icons/ic_camera_perspective.svg"
              alt="Perspective"
              style={{ width: 16, height: 16 }}
            />
            <span style={{ flex: 1, textAlign: 'left' }}>Perspektif</span>
            {isPersp && <span className="am-badge-mode">AKTIF</span>}
          </button>

          <button
            type="button"
            className="am-viewmode-btn"
            style={{
              width: '100%',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              padding: '0 8px',
              borderRadius: 6,
              background: !isPersp ? 'rgba(0, 255, 168, 0.15)' : 'transparent',
              color: !isPersp ? 'var(--am-y1, #00ffa8)' : '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => handleSelectMode('orthographic')}
          >
            <img
              src="./icons/ic_camera_parallel.svg"
              alt="Parallel"
              style={{ width: 16, height: 16 }}
            />
            <span style={{ flex: 1, textAlign: 'left' }}>Paralel</span>
            {!isPersp && <span className="am-badge-mode">AKTIF</span>}
          </button>
        </div>
      )}
    </div>
  );
}
