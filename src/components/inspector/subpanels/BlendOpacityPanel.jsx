import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';

const BLEND_CATEGORIES = [
  {
    id: 'normal',
    name: 'Normal',
    items: [{ id: 'normal', name: 'Normal', mode: 'normal' }]
  },
  {
    id: 'darken',
    name: 'Gelapkan',
    items: [
      { id: 'darken', name: 'Gelapkan', mode: 'darken' },
      { id: 'multiply', name: 'Gandakan', mode: 'multiply' },
      { id: 'color-burn', name: 'Terbakar Warna', mode: 'color-burn' },
      { id: 'linear-burn', name: 'Linear Burn', mode: 'multiply' },
      { id: 'darker-color', name: 'Warna Lebih Gelap', mode: 'darken' }
    ]
  },
  {
    id: 'lighten',
    name: 'Cerahkan',
    items: [
      { id: 'lighten', name: 'Cerahkan', mode: 'lighten' },
      { id: 'screen', name: 'Kasa', mode: 'screen' },
      { id: 'color-dodge', name: 'Cerahkan Warna', mode: 'color-dodge' },
      { id: 'linear-dodge', name: 'Linear Dodge', mode: 'color-dodge' },
      { id: 'lighter-color', name: 'Warna Lebih Terang', mode: 'lighten' }
    ]
  },
  {
    id: 'contrast',
    name: 'Kontras',
    items: [
      { id: 'overlay', name: 'Hamparan', mode: 'overlay' },
      { id: 'soft-light', name: 'Cahaya Lembut', mode: 'soft-light' },
      { id: 'hard-light', name: 'Cahaya Keras', mode: 'hard-light' },
      { id: 'soft-overlay', name: 'Soft Overlay', mode: 'overlay' },
      { id: 'vivid-light', name: 'Cahaya Terang', mode: 'hard-light' },
      { id: 'linear-light', name: 'Cahaya Linear', mode: 'hard-light' },
      { id: 'pin-light', name: 'Cahaya Pin', mode: 'hard-light' }
    ]
  },
  {
    id: 'difference',
    name: 'Perbedaan',
    items: [
      { id: 'difference', name: 'Perbedaan', mode: 'difference' },
      { id: 'exclusion', name: 'Pengecualian', mode: 'exclusion' },
      { id: 'subtract', name: 'Kurangi', mode: 'difference' },
      { id: 'divide', name: 'Bagi', mode: 'color-dodge' }
    ]
  },
  {
    id: 'color',
    name: 'Warna',
    items: [
      { id: 'hue', name: 'Rona', mode: 'hue' },
      { id: 'saturation', name: 'Kejenuhan', mode: 'saturation' },
      { id: 'color', name: 'Warna', mode: 'color' },
      { id: 'luminance', name: 'Pencahayaan', mode: 'luminosity' }
    ]
  },
  {
    id: 'mask',
    name: 'Topeng',
    items: [
      { id: 'mask', name: 'Masker', mode: 'mask' },
      { id: 'exclude', name: 'Kecualikan Masker', mode: 'exclude' }
    ]
  }
];

export default function BlendOpacityPanel({ layer, onBack, onOpenCurve }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const playheadMs = useEditorStore((state) => state.playheadMs);

  const getInitialOpacity = () => {
    const op = layer.transform?.opacity ?? layer.opacity;
    if (op && Array.isArray(op.value)) return Math.round(op.value[0] * 100);
    if (typeof op === 'number') return Math.round(op * 100);
    return 100;
  };

  const [opacityVal, setOpacityVal] = useState(getInitialOpacity);
  const [openCatId, setOpenCatId] = useState(() => {
    const cur = (layer.blendMode || 'normal').toLowerCase();
    const found = BLEND_CATEGORIES.find((c) => c.items.some((it) => it.id === cur));
    return found ? found.id : 'normal';
  });

  const activeBlendId = (layer.blendMode || 'normal').toLowerCase();
  const tSec = playheadMs / 1000;
  const opProp = layer.transform?.opacity;
  const hasKf = Boolean(opProp?.kfs?.some((k) => Math.abs(Number(k.t) - tSec) < 0.002));

  const handleOpacityChange = (val) => {
    const num = Math.max(0, Math.min(100, Number(val)));
    setOpacityVal(num);
    const norm = num / 100;

    const existingTransform = layer.transform || {};
    const existingOp = existingTransform.opacity || { value: [norm], kfs: [] };
    const nextKfs = existingOp.kfs ? [...existingOp.kfs] : [];

    const kfIdx = nextKfs.findIndex((k) => Math.abs(Number(k.t) - tSec) < 0.002);
    if (kfIdx >= 0) {
      nextKfs[kfIdx] = { ...nextKfs[kfIdx], v: [norm] };
    }

    updateLayer(layer.id, {
      opacity: norm,
      transform: {
        ...existingTransform,
        opacity: {
          value: [norm],
          kfs: nextKfs
        }
      }
    });
  };

  const handleToggleKeyframe = () => {
    const norm = opacityVal / 100;
    const existingTransform = layer.transform || {};
    const existingOp = existingTransform.opacity || { value: [norm], kfs: [] };
    let nextKfs = existingOp.kfs ? [...existingOp.kfs] : [];

    if (hasKf) {
      nextKfs = nextKfs.filter((k) => Math.abs(Number(k.t) - tSec) >= 0.002);
    } else {
      nextKfs.push({ t: tSec, v: [norm], e: null, easing: null });
      nextKfs.sort((a, b) => a.t - b.t);
    }

    updateLayer(layer.id, {
      transform: {
        ...existingTransform,
        opacity: {
          value: [norm],
          kfs: nextKfs
        }
      }
    });
  };

  const handleSelectBlend = (blendId) => {
    updateLayer(layer.id, { blendMode: blendId });
  };

  const toggleCategory = (catId) => {
    setOpenCatId((prev) => (prev === catId ? null : catId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="am-opacity-row">
        <img src="./icons/ac_ic_opacity.svg" className="am-opacity-icon" alt="Opacity" />
        <button
          type="button"
          id="am-opacity-kf-btn"
          className={`am-opacity-kf-btn ${hasKf ? 'active' : ''}`}
          title={hasKf ? 'Hapus Keyframe Opasitas' : 'Tambah Keyframe Opasitas'}
          onClick={handleToggleKeyframe}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={hasKf ? '#00ffa8' : 'none'} stroke={hasKf ? '#00ffa8' : '#fff'} strokeWidth="2">
            <path d="M12 2L4 12l8 10 8-10L12 2z" />
          </svg>
        </button>
        <button
          type="button"
          id="am-opacity-curve-btn"
          className="am-opacity-curve-btn"
          title="Kurva Easing Animasi Opasitas"
          onClick={onOpenCurve}
        >
          <img src="./icons/ac_ic_anim_curve.svg" alt="Easing" />
        </button>
        <input
          type="range"
          className="am-opacity-slider"
          id="am-opacity-slider"
          min="0"
          max="100"
          value={opacityVal}
          onChange={(e) => handleOpacityChange(e.target.value)}
        />
        <div className="am-opacity-box" id="am-opacity-val">
          {opacityVal}%
        </div>
      </div>

      <div className="am-blend-categories" id="am-blend-categories">
        {BLEND_CATEGORIES.map((cat) => {
          const matchedItem = cat.items.find((it) => it.id === activeBlendId);
          const isCatActive = Boolean(matchedItem);
          const isOpen = openCatId === cat.id;

          return (
            <div key={cat.id} className={`am-blend-cat-card ${isOpen ? 'open' : ''} ${isCatActive ? 'active-cat' : ''}`}>
              <div className="am-blend-cat-header" onClick={() => toggleCategory(cat.id)}>
                <span className="am-blend-expand-icon">
                  <svg viewBox="0 0 80 80" width="12" height="12" fill="#fff" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }}>
                    <path d="M56.63 42.79L26.71 64.45C25.31 65.46 23.42 65.04 22.5 63.49C22.17 62.95 22 62.31 22 61.66L22 18.34C22 16.5 23.36 15 25.04 15C25.63 15 26.21 15.19 26.71 15.55L56.63 37.21C58.03 38.22 58.42 40.29 57.5 41.84C57.27 42.22 56.98 42.54 56.63 42.79Z" />
                  </svg>
                </span>
                <span className="am-blend-cat-title">{cat.name}</span>
                <span className="am-blend-cat-selected">{isCatActive ? matchedItem.name : ''}</span>
                {isCatActive && (
                  <span className="am-blend-cat-check">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#00ffa8">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </span>
                )}
              </div>

              {isOpen && (
                <div className="am-blend-mode-list">
                  {cat.items.map((it) => {
                    const isItemActive = activeBlendId === it.id;
                    return (
                      <div
                        key={it.id}
                        className={`am-blend-mode-item ${isItemActive ? 'active' : ''}`}
                        onClick={() => handleSelectBlend(it.id)}
                      >
                        <div className="am-blend-mode-thumb">
                          {it.id === 'mask' ? (
                            <>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00b4d8', position: 'absolute', left: 7, top: 11, opacity: 0.4 }} />
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00ffa8', position: 'absolute', left: 14, top: 11 }} />
                            </>
                          ) : it.id === 'exclude' ? (
                            <>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00b4d8', position: 'absolute', left: 7, top: 11 }} />
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#181b28', position: 'absolute', left: 17, top: 13 }} />
                            </>
                          ) : (
                            <>
                              <div className="am-blend-prev-c1" />
                              <div className="am-blend-prev-c2" style={{ mixBlendMode: it.mode }} />
                            </>
                          )}
                        </div>
                        <div className="am-blend-mode-label">{it.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
