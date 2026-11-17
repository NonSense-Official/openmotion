import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function EditPointsNavbar({
  title = 'Edit Poin',
  mode: customMode,
  onModeChange,
  hasMultipleContours = false,
  onPrevContour,
  onNextContour,
  onDone,
  onBack
}) {
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);

  const [localMode, setLocalMode] = useState('points');
  const currentMode = customMode !== undefined ? customMode : localMode;

  const handleSelectMode = (newMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setLocalMode(newMode);
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
    <div id="am-navbar-editpoints" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-editpoints-back"
        className="am-icon-btn"
        title="Kembali / Selesai"
        onClick={handleBack}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <span id="am-editpoints-title" className="am-actionbar-title">
        {title}
      </span>

      <button
        type="button"
        id="am-btn-editpoints-prev"
        className="am-icon-btn"
        title="Kontur Sebelumnya"
        style={{ display: hasMultipleContours ? 'flex' : 'none' }}
        onClick={onPrevContour}
      >
        <img src="/icons/ic_prev_element.svg" alt="Prev" />
      </button>

      <button
        type="button"
        id="am-btn-editpoints-next"
        className="am-icon-btn"
        title="Kontur Berikutnya"
        style={{ display: hasMultipleContours ? 'flex' : 'none' }}
        onClick={onNextContour}
      >
        <img src="/icons/ic_next_element.svg" alt="Next" />
      </button>

      <div className="am-actionbar-segmented">
        <button
          type="button"
          id="am-btn-mode-keyframes"
          className={`am-seg-btn ${currentMode === 'keyframes' ? 'active' : ''}`}
          title="Animasi Titik"
          onClick={() => handleSelectMode('keyframes')}
        >
          <img src="/icons/ic_keyframe_add_hollow.svg" alt="Keyframe Mode" />
        </button>

        <button
          type="button"
          id="am-btn-mode-points"
          className={`am-seg-btn ${currentMode === 'points' ? 'active' : ''}`}
          title="Edit Titik"
          onClick={() => handleSelectMode('points')}
        >
          <img src="/icons/ic_point_add.svg" alt="Point Mode" />
        </button>
      </div>
    </div>
  );
}
