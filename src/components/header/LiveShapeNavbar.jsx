import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function LiveShapeNavbar({
  title = 'Edit Bentuk',
  isRatioLocked: customRatioLocked,
  isFromCenter: customFromCenter,
  hasSizeParam = true,
  onToggleRatioLock,
  onToggleFromCenter,
  onDone,
  onBack
}) {
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);

  const [localRatioLocked, setLocalRatioLocked] = useState(true);
  const [localFromCenter, setLocalFromCenter] = useState(true);

  const isRatioLocked = customRatioLocked !== undefined ? customRatioLocked : localRatioLocked;
  const isFromCenter = customFromCenter !== undefined ? customFromCenter : localFromCenter;

  const handleRatioToggle = () => {
    if (onToggleRatioLock) {
      onToggleRatioLock(!isRatioLocked);
    } else {
      setLocalRatioLocked(!isRatioLocked);
    }
  };

  const handleCenterToggle = () => {
    if (onToggleFromCenter) {
      onToggleFromCenter(!isFromCenter);
    } else {
      setLocalFromCenter(!isFromCenter);
    }
  };

  const handleBack = () => {
    if (onDone) {
      onDone();
    } else if (onBack) {
      onBack();
    } else {
      setActiveToolMode('select');
    }
  };

  return (
    <div id="am-navbar-liveshape" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-liveshape-back"
        className="am-icon-btn"
        title="Kembali"
        onClick={handleBack}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <span id="am-liveshape-title" className="am-actionbar-title">
        {title}
      </span>

      <button
        type="button"
        id="am-btn-liveshape-aspect"
        className={`am-icon-btn ${isRatioLocked ? 'active' : ''}`}
        title="Kunci Rasio Aspek"
        style={{ display: hasSizeParam ? 'flex' : 'none' }}
        onClick={handleRatioToggle}
      >
        <img
          id="am-img-liveshape-aspect"
          src={isRatioLocked ? '/icons/ic_shape_aspect_lock.svg' : '/icons/ic_shape_aspect_unlock.svg'}
          alt="Aspect Ratio"
        />
      </button>

      <button
        type="button"
        id="am-btn-liveshape-center"
        className={`am-icon-btn ${isFromCenter ? 'active' : ''}`}
        title="Ubah Ukuran dari Tengah"
        style={{ display: hasSizeParam ? 'flex' : 'none' }}
        onClick={handleCenterToggle}
      >
        <img
          id="am-img-liveshape-center"
          src="/icons/ic_shape_size_from_center.svg"
          alt="From Center"
        />
      </button>
    </div>
  );
}
