import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function SettingNavbar({
  title: customTitle,
  onBack,
  onOverflow,
  showOverflow = false
}) {
  const activeSubpanel = useEditorStore((state) => state.activeSubpanel);
  const setActiveSubpanel = useEditorStore((state) => state.setActiveSubpanel);

  const title = customTitle || activeSubpanel?.title || 'Pengaturan';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveSubpanel(null);
    }
  };

  return (
    <div id="am-navbar-setting" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-setting-back"
        className="am-icon-btn"
        title="Kembali"
        onClick={handleBack}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <span id="am-setting-title" className="am-actionbar-title">
        {title}
      </span>

      <button
        type="button"
        id="am-btn-setting-overflow"
        className="am-icon-btn"
        title="Opsi"
        style={{ display: showOverflow || onOverflow ? 'flex' : 'none' }}
        onClick={onOverflow}
      >
        <img src="/icons/ic_more_vert_white_24dp.svg" alt="More" />
      </button>
    </div>
  );
}
