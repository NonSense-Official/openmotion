import React from 'react';

export default function InspectorEmptyState() {
  return (
    <div id="am-dock-empty-state" className="am-dock-empty">
      <div className="am-dock-empty-icon">
        <img
          src="./icons/open_motion_logo.svg"
          alt="OpenMotion"
          style={{ width: '36px', height: '36px', opacity: 0.4 }}
        />
      </div>
      <div className="am-dock-empty-title">Tidak ada layer terpilih</div>
      <div className="am-dock-empty-desc">
        Pilih layer di timeline untuk melihat dan mengedit properti objek.
      </div>
    </div>
  );
}
