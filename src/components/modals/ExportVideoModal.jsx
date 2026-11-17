import React, { useState } from 'react';

const EXPORT_TYPES = [
  { id: 'video', name: 'Video', desc: 'MP4 · 720p · 30 fps', icon: './icons/ic_export_video.svg', hasArrow: true },
  { id: 'gif', name: 'GIF Animasi', desc: 'Animasi berulang tanpa suara', icon: './icons/ic_export_gif.svg' },
  { id: 'sequence', name: 'Urutan Gambar PNG', desc: 'Semua frame dalam paket ZIP', icon: './icons/ic_export_imagesequence.svg' },
  { id: 'currentframe', name: 'Frame Saat Ini sebagai PNG', desc: 'Gambar tunggal pada playhead', icon: './icons/ic_export_currentframe.svg' }
];

export function ExportVideoModal({
  isOpen,
  onClose,
  onStartExport,
  isExporting = false,
  progress = 0
}) {
  const [viewMode, setViewMode] = useState('list');
  const [exportType, setExportType] = useState('video');
  const [resolution, setResolution] = useState('720');
  const [fps, setFps] = useState('30');
  const [codec, setCodec] = useState('h264');
  const [quality, setQuality] = useState(0.5);

  if (!isOpen) return null;

  const handleExportClick = () => {
    let format = 'mp4';
    if (exportType === 'video') format = 'mp4';
    else if (exportType === 'gif') format = 'gif';
    else if (exportType === 'sequence') format = 'zip_sequence';
    else if (exportType === 'currentframe') format = 'png_frame';

    onStartExport && onStartExport({
      type: exportType,
      format,
      resolution: parseInt(resolution, 10),
      fps: parseInt(fps, 10),
      codec,
      quality
    });
  };

  const estimatedMbps = Math.max(1.0, Math.min(40.0, ((parseInt(resolution, 10) * 0.5625) * parseInt(resolution, 10) * parseInt(fps, 10) * quality * 0.08) / 1000000));
  const estimatedMB = Math.max(0.5, (estimatedMbps * 5) / 8);

  return (
    <div
      id="am-export-backdrop"
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
        if (e.target.id === 'am-export-backdrop' && !isExporting) onClose && onClose();
      }}
    >
      <div
        id="am-export-sheet"
        style={{
          width: 'min(100vw, 560px)',
          maxHeight: '90vh',
          backgroundColor: '#191b27',
          borderRadius: '16px 16px 0 0',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div
          className="am-sheet-header-export"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {viewMode === 'settings' ? (
            <button
              type="button"
              id="am-export-back"
              className="am-sheet-back visible"
              onClick={() => setViewMode('list')}
              style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
            >
              <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 18, height: 18 }} />
            </button>
          ) : <div style={{ width: 26 }} />}

          <div id="am-export-title" className="am-sheet-title" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
            {viewMode === 'settings' ? 'Pengaturan Ekspor' : 'Ekspor dan Bagikan'}
          </div>

          <button
            type="button"
            id="am-export-close"
            className="am-sheet-close"
            onClick={onClose}
            disabled={isExporting}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4, opacity: isExporting ? 0.4 : 1 }}
          >
            <img src="./icons/ac_ic_cancel.svg" alt="Cancel" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div
          className="am-export-estimates"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: 'rgba(0,0,0,0.25)',
            fontSize: 11,
            color: '#8c93a7'
          }}
        >
          <span>Ruang tersedia: <strong style={{ color: '#fff' }}>14.2 GB</strong></span>
          <span>Perkiraan ukuran: <strong id="am-exp-est-size" style={{ color: '#00ffa8' }}>~{estimatedMB.toFixed(1)} MB</strong></span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {viewMode === 'list' ? (
            <div id="am-export-list-view" className="am-export-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {EXPORT_TYPES.map((t) => {
                const isSel = exportType === t.id;
                return (
                  <div
                    key={t.id}
                    className={`am-export-item ${isSel ? 'active' : ''}`}
                    onClick={() => setExportType(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 10,
                      borderRadius: 8,
                      background: isSel ? 'rgba(0,255,168,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isSel ? '1px solid #00ffa8' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      className="am-export-radio"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: isSel ? '5px solid #00ffa8' : '2px solid rgba(255,255,255,0.4)',
                        boxSizing: 'border-box'
                      }}
                    />
                    <img className="am-export-icon" src={t.icon} alt={t.name} style={{ width: 28, height: 28 }} />
                    <div className="am-export-info" style={{ flex: 1 }}>
                      <div className="am-export-name" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div className="am-export-desc" style={{ fontSize: 11, color: '#8c93a7' }}>
                        {t.id === 'video' ? `MP4 · ${resolution}p · ${fps} fps` : t.desc}
                      </div>
                    </div>
                    {t.hasArrow && (
                      <button
                        type="button"
                        id="am-btn-to-settings"
                        className="am-export-arrow-btn"
                        onClick={(e) => { e.stopPropagation(); setViewMode('settings'); }}
                        style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
                      >
                        <img src="./icons/ic_export_arrow_right.svg" alt="Settings" style={{ width: 18, height: 18 }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div id="am-export-settings-view" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="am-settings-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#8c93a7' }}>Resolusi Ekspor</span>
                <select
                  id="am-settings-res"
                  className="am-settings-select"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  style={{ background: '#090a0e', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px' }}
                >
                  <option value="1080">1080p FHD</option>
                  <option value="720">720p HD</option>
                  <option value="540">540p</option>
                  <option value="480">480p</option>
                  <option value="360">360p</option>
                </select>
              </div>

              <div className="am-settings-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#8c93a7' }}>Codec</span>
                <div className="am-segmented-group" style={{ display: 'flex', gap: 8 }}>
                  {['h264', 'h265'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`am-segmented-btn ${codec === c ? 'active' : ''}`}
                      onClick={() => setCodec(c)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: codec === c ? '#00ffa8' : 'rgba(255,255,255,0.06)',
                        color: codec === c ? '#090a0e' : '#fff',
                        fontWeight: 700,
                        border: 0,
                        cursor: 'pointer'
                      }}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="am-settings-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8c93a7' }}>
                  <span>Kecepatan Frame</span>
                  <span style={{ color: '#00ffa8' }}>{fps} fps</span>
                </div>
                <div className="am-segmented-group" style={{ display: 'flex', gap: 8 }}>
                  {['24', '30', '60'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`am-segmented-btn ${fps === f ? 'active' : ''}`}
                      onClick={() => setFps(f)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: fps === f ? '#00ffa8' : 'rgba(255,255,255,0.06)',
                        color: fps === f ? '#090a0e' : '#fff',
                        fontWeight: 700,
                        border: 0,
                        cursor: 'pointer'
                      }}
                    >
                      {f} fps
                    </button>
                  ))}
                </div>
              </div>

              <div className="am-settings-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8c93a7' }}>
                  <span>Kualitas / Bitrate</span>
                  <span style={{ color: '#00ffa8' }}>{estimatedMbps.toFixed(2)} Mbps</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  style={{ accentColor: '#00ffa8' }}
                />
              </div>
            </div>
          )}
        </div>

        {isExporting && (
          <div style={{ padding: '0 16px 10px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c93a7', marginBottom: 4 }}>
              <span>Mengekspor...</span>
              <span>{Math.round((progress || 0) * 100)}%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((progress || 0) * 100)}%`, height: '100%', background: '#00ffa8', transition: 'width 0.15s ease' }} />
            </div>
          </div>
        )}

        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            id="am-btn-do-export"
            className="am-btn-apply"
            onClick={handleExportClick}
            disabled={isExporting}
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 8,
              background: '#00ffa8',
              color: '#090a0e',
              border: 0,
              fontSize: 14,
              fontWeight: 700,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              letterSpacing: 1
            }}
          >
            {isExporting ? 'SEDANG MENGEKSPOR...' : 'EKSPOR'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportVideoModal;
