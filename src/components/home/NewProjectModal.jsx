import React, { useState } from 'react';

const ASPECT_OPTIONS = [
  { id: '16:9', label: '16:9', className: '16-9' },
  { id: '9:16', label: '9:16', className: '9-16' },
  { id: '4:5', label: '4:5', className: '4-5' },
  { id: '1:1', label: '1:1', className: '1-1' },
  { id: '4:3', label: '4:3', className: '4-3' }
];

const BG_SWATCHES = [
  { id: '#000000', title: 'Hitam', style: { background: '#000' } },
  { id: '#ffffff', title: 'Putih', style: { background: '#fff' } },
  { id: '#808080', title: 'Abu-abu', style: { background: '#808080' } },
  {
    id: 'transparent',
    title: 'Transparan',
    style: { background: 'repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50% / 10px 10px' }
  }
];

export function calcDimensions(aspect, res) {
  const r = parseInt(res, 10) || 720;
  switch (aspect) {
    case '16:9':
      return { w: Math.round((r * 16) / 9 / 2) * 2, h: r };
    case '9:16':
      return { w: r, h: Math.round((r * 16) / 9 / 2) * 2 };
    case '4:5':
      return { w: r, h: Math.round((r * 5) / 4 / 2) * 2 };
    case '1:1':
      return { w: r, h: r };
    case '4:3':
      return { w: Math.round((r * 4) / 3 / 2) * 2, h: r };
    default:
      return { w: 720, h: 1280 };
  }
}

function getBgHex(bgColor) {
  if (bgColor === 'transparent') return '00000000';
  if (bgColor === '#ffffff') return 'ffffffff';
  if (bgColor === '#808080') return 'ff808080';
  return 'ff000000';
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateEmptySceneXml({ title, width, height, fps, bgColor }) {
  const bgHex = getBgHex(bgColor);
  return `<?xml version="1.0" encoding="utf-8"?>
<scene title="${escapeXml(title)}" width="${width}" height="${height}" exportWidth="${width}" exportHeight="${height}" bgcolor="${bgHex}" totalTime="5000" fps="${fps}" modifiedTime="${Date.now()}" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false"></scene>`;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onCreateProject,
  onImportLink,
  onImportFile
}) {
  const [title, setTitle] = useState('Proyek Baru');
  const [aspect, setAspect] = useState('9:16');
  const [resolution, setResolution] = useState('720');
  const [fps, setFps] = useState(30);
  const [bgColor, setBgColor] = useState('#000000');
  const [modalLink, setModalLink] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [modalError, setModalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Proyek Baru';
    const dims = calcDimensions(aspect, resolution);
    const xml = generateEmptySceneXml({
      title: finalTitle,
      width: dims.w,
      height: dims.h,
      fps,
      bgColor
    });

    onCreateProject({
      name: finalTitle,
      width: dims.w,
      height: dims.h,
      fps,
      bgColor,
      xml,
      scene: {
        title: finalTitle,
        width: dims.w,
        height: dims.h,
        fps,
        totalTime: 5000,
        backgroundColor:
          bgColor === '#ffffff'
            ? [1, 1, 1, 1]
            : bgColor === '#808080'
            ? [0.5, 0.5, 0.5, 1]
            : bgColor === 'transparent'
            ? [0, 0, 0, 0]
            : [0, 0, 0, 1],
        layers: []
      }
    });
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!modalLink.trim() || isImporting) return;
    setModalError('');
    setIsImporting(true);
    try {
      if (onImportLink) {
        await onImportLink(modalLink.trim());
      }
    } catch (err) {
      setModalError(err.message || 'Gagal membuka link Alight Motion.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModalError('');
    try {
      if (onImportFile) {
        await onImportFile(file);
      }
    } catch (err) {
      setModalError(err.message || 'Gagal membaca berkas XML.');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="am-new-project-backdrop"
      className="open"
      onClick={handleBackdropClick}
    >
      <div id="am-new-project-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Buat Proyek</span>
          <button
            id="am-new-proj-close"
            className="am-sheet-close"
            type="button"
            onClick={onClose}
          >
            <img src="/icons/ac_ic_cancel.svg" alt="Close" />
          </button>
        </div>

        <input
          type="text"
          id="am-new-proj-title"
          className="am-new-proj-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nama Proyek"
        />

        <div className="am-aspect-holder">
          {ASPECT_OPTIONS.map((item) => (
            <div
              key={item.id}
              className={`am-aspect-card am-aspect-${item.className} ${aspect === item.id ? 'active' : ''}`}
              onClick={() => setAspect(item.id)}
            >
              <div className="am-aspect-box" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="am-settings-form" style={{ gap: '10px' }}>
          <div className="am-setting-row">
            <span className="am-setting-label">Resolusi</span>
            <select
              id="am-new-proj-res"
              className="am-setting-control"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            >
              <option value="1080">1080p FHD</option>
              <option value="720">720p HD</option>
              <option value="480">480p SD</option>
            </select>
          </div>

          <div className="am-setting-row">
            <span className="am-setting-label">Frame Rate</span>
            <select
              id="am-new-proj-fps"
              className="am-setting-control"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
            >
              <option value="30">30 fps</option>
              <option value="60">60 fps</option>
            </select>
          </div>

          <div className="am-setting-row">
            <span className="am-setting-label">Latar Belakang</span>
            <div className="am-color-swatches" id="am-new-proj-bg-holder">
              {BG_SWATCHES.map((swatch) => (
                <div
                  key={swatch.id}
                  className={`am-color-swatch ${bgColor === swatch.id ? 'active' : ''}`}
                  style={swatch.style}
                  title={swatch.title}
                  onClick={() => setBgColor(swatch.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          id="am-new-proj-btn-submit"
          className="am-new-proj-btn-create"
          type="button"
          onClick={handleSubmit}
        >
          BUAT PROYEK
        </button>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#8c93a7', textTransform: 'uppercase' }}>
            Atau Impor Preset / Link
          </span>
          <form onSubmit={handleImportSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="url"
              id="am-modal-alight-link"
              className="am-import-input"
              style={{
                background: '#0f1118',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0 10px',
                height: '36px',
                flex: 1
              }}
              placeholder="https://alight.link/..."
              value={modalLink}
              onChange={(e) => setModalLink(e.target.value)}
            />
            <button
              id="am-modal-btn-import"
              className="am-import-btn"
              style={{ height: '36px' }}
              type="submit"
              disabled={isImporting}
            >
              {isImporting ? 'Memuat...' : 'Buka'}
            </button>
          </form>

          {modalError && (
            <div
              id="am-modal-import-error"
              style={{
                color: '#ff6b6b',
                fontSize: '11px',
                lineHeight: 1.4,
                background: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.25)',
                borderRadius: '6px',
                padding: '8px 10px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {modalError}
            </div>
          )}

          <label
            id="am-modal-btn-file-xml"
            className="am-grid-btn"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '36px',
              fontSize: '11px',
              padding: '4px 8px',
              cursor: 'pointer',
              gap: '6px'
            }}
          >
            <img src="/icons/ic_export_xml.svg" style={{ width: '16px', height: '16px' }} alt="XML" />
            <span>Pilih File XML (.xml / .xml2)</span>
            <input
              type="file"
              accept=".xml,.xml2,text/xml,application/xml"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default NewProjectModal;
