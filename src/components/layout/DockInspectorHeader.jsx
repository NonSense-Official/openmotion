import React from 'react';

export default function DockInspectorHeader({
  title = 'Inspector',
  badgeText = '',
  canGoBack = false,
  canClose = false,
  onBack,
  onClose
}) {
  return (
    <div className="am-dock-header">
      <div className="am-dock-tabs">
        <div id="am-dock-tab-inspector" className="am-dock-tab active">
          <img src="./icons/ac_ic_effects.svg" alt="Inspector" />
          <span id="am-dock-tab-title">{title}</span>
        </div>
        <div
          id="am-dock-subpanel-badge"
          className="am-dock-badge"
          style={{ display: badgeText ? 'inline-flex' : 'none' }}
        >
          {badgeText}
        </div>
      </div>
      <div className="am-dock-actions">
        <button
          type="button"
          id="am-dock-btn-back"
          className="am-dock-btn"
          title="Kembali ke menu utama"
          style={{ display: canGoBack ? 'flex' : 'none' }}
          onClick={onBack}
        >
          <img
            src="./icons/ac_ic_back.svg"
            alt="Back"
            style={{ width: '12px', height: '12px', filter: 'invert(1)' }}
          />
          <span>Kembali</span>
        </button>
        <button
          type="button"
          id="am-dock-btn-close"
          className="am-dock-btn"
          title="Tutup / Lepas Pilihan Layer"
          style={{ display: canClose ? 'flex' : 'none' }}
          onClick={onClose}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>&times;</span>
        </button>
      </div>
    </div>
  );
}
