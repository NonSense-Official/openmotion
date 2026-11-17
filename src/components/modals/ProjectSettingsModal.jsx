import React, { useState, useEffect } from 'react';

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', w: 1920, h: 1080 },
  { id: '9:16', label: '9:16', w: 1080, h: 1920 },
  { id: '4:5', label: '4:5', w: 1080, h: 1350 },
  { id: '1:1', label: '1:1', w: 1080, h: 1080 },
  { id: '4:3', label: '4:3', w: 1440, h: 1080 },
  { id: 'custom', label: 'Kustom', w: 1080, h: 1920 }
];

export function ProjectSettingsModal({
  isOpen,
  onClose,
  currentSettings = {},
  onSaveSettings
}) {
  const [aspect, setAspect] = useState('9:16');
  const [resolution, setResolution] = useState('1080');
  const [fps, setFps] = useState(30);
  const [background, setBackground] = useState('black');
  const [name, setName] = useState('Proyek Baru');
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1920);
  const [isSizeLinked, setIsSizeLinked] = useState(true);

  useEffect(() => {
    if (currentSettings) {
      if (currentSettings.name) setName(currentSettings.name);
      if (currentSettings.fps) setFps(currentSettings.fps);
      if (currentSettings.background) setBackground(currentSettings.background);
      if (currentSettings.width && currentSettings.height) {
        setCustomW(currentSettings.width);
        setCustomH(currentSettings.height);
      }
    }
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSelectAspect = (item) => {
    setAspect(item.id);
    if (item.id !== 'custom') {
      const baseRes = parseInt(resolution, 10) || 1080;
      if (item.id === '9:16') {
        setCustomW(baseRes);
        setCustomH(Math.round(baseRes * (16 / 9)));
      } else if (item.id === '16:9') {
        setCustomW(Math.round(baseRes * (16 / 9)));
        setCustomH(baseRes);
      } else if (item.id === '1:1') {
        setCustomW(baseRes);
        setCustomH(baseRes);
      } else if (item.id === '4:5') {
        setCustomW(baseRes);
        setCustomH(Math.round(baseRes * (5 / 4)));
      } else if (item.id === '4:3') {
        setCustomW(Math.round(baseRes * (4 / 3)));
        setCustomH(baseRes);
      }
    }
  };

  const handleResolutionChange = (resStr) => {
    setResolution(resStr);
    const r = parseInt(resStr, 10);
    if (aspect === '9:16') {
      setCustomW(r);
      setCustomH(Math.round(r * (16 / 9)));
    } else if (aspect === '16:9') {
      setCustomW(Math.round(r * (16 / 9)));
      setCustomH(r);
    } else if (aspect === '1:1') {
      setCustomW(r);
      setCustomH(r);
    }
  };

  const handleSave = () => {
    onSaveSettings && onSaveSettings({
      name,
      fps: parseInt(fps, 10),
      width: customW,
      height: customH,
      background,
      aspect
    });
    onClose && onClose();
  };

  return (
    <div
      id="am-project-settings-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => {
        if (e.target.id === 'am-project-settings-backdrop') onClose && onClose();
      }}
    >
      <div
        id="am-project-settings-sheet"
        style={{
          width: 'min(100vw, 520px)',
          backgroundColor: '#191b27',
          borderRadius: '16px 16px 0 0',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          className="am-settings-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <button
            type="button"
            id="am-settings-close"
            className="am-settings-cancel-btn"
            onClick={onClose}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          >
            <img src="./icons/ac_ic_cancel.svg" alt="Cancel" style={{ width: 18, height: 18 }} />
          </button>
          <div className="am-settings-title" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
            Pengaturan Proyek
          </div>
          <button
            type="button"
            onClick={handleSave}
            style={{ background: 'transparent', border: 0, color: '#00ffa8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Simpan
          </button>
        </div>

        {/* Aspect Ratio Cards */}
        <div
          className="am-aspect-holder"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '16px 12px',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {ASPECT_RATIOS.map((item) => {
            const isSel = aspect === item.id;
            return (
              <div
                key={item.id}
                className={`am-aspect-card am-aspect-${item.id.replace(':', '-')} ${isSel ? 'active' : ''}`}
                onClick={() => handleSelectAspect(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 8px',
                  borderRadius: 8,
                  minWidth: 54,
                  background: isSel ? 'rgba(0,255,168,0.15)' : 'rgba(255,255,255,0.04)',
                  border: isSel ? '1px solid #00ffa8' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="am-aspect-box"
                  style={{
                    width: item.id === '16:9' ? 28 : (item.id === '9:16' ? 16 : 22),
                    height: item.id === '16:9' ? 16 : (item.id === '9:16' ? 28 : 22),
                    border: '1.5px solid #fff',
                    borderRadius: 2
                  }}
                />
                <span style={{ fontSize: 11, color: isSel ? '#00ffa8' : '#8c93a7', fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Settings Form */}
        <div className="am-settings-form" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Resolution */}
          <div className="am-setting-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="am-setting-label-col">
              <span className="am-setting-label" style={{ fontSize: 13, color: '#fff' }}>Resolusi</span>
              <div id="am-settings-size-info" className="am-setting-sublabel" style={{ fontSize: 11, color: '#8c93a7' }}>
                {customW} × {customH}
              </div>
            </div>
            <select
              id="am-set-res"
              className="am-setting-select"
              value={resolution}
              onChange={(e) => handleResolutionChange(e.target.value)}
              style={{ background: '#090a0e', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px' }}
            >
              <option value="1080">1080p FHD</option>
              <option value="720">720p HD</option>
              <option value="540">540p</option>
              <option value="480">480p</option>
            </select>
          </div>

          {/* Frame Rate */}
          <div className="am-setting-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="am-setting-label" style={{ fontSize: 13, color: '#fff' }}>Frame Rate</span>
            <select
              id="am-set-fps"
              className="am-setting-select"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value, 10))}
              style={{ background: '#090a0e', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px' }}
            >
              <option value="12">12 fps</option>
              <option value="15">15 fps</option>
              <option value="24">24 fps</option>
              <option value="30">30 fps</option>
              <option value="60">60 fps</option>
            </select>
          </div>

          {/* Background */}
          <div className="am-setting-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="am-setting-label" style={{ fontSize: 13, color: '#fff' }}>Latar Belakang</span>
            <div className="am-bg-container" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="am-color-swatches" id="am-set-bgs" style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'black', color: '#000000', title: 'Hitam' },
                  { id: 'white', color: '#ffffff', title: 'Putih' },
                  { id: 'grey', color: '#b3b3b3', title: 'Abu-abu' },
                  { id: 'transparent', color: 'transparent', title: 'Transparan' }
                ].map((bg) => (
                  <div
                    key={bg.id}
                    className={`am-color-swatch ${background === bg.id ? 'active' : ''}`}
                    onClick={() => setBackground(bg.id)}
                    title={bg.title}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: bg.color,
                      border: background === bg.id ? '2px solid #00ffa8' : '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Project Name */}
          <div className="am-setting-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="am-setting-label" style={{ fontSize: 13, color: '#fff' }}>Nama Proyek</span>
            <input
              type="text"
              id="am-set-title"
              className="am-custom-res-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: 160,
                textAlign: 'right',
                padding: '6px 10px',
                background: '#090a0e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 6
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSettingsModal;
