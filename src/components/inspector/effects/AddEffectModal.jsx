import React, { useState, useMemo } from 'react';
import catalogData from '../../../../effects-catalog.json';

const EFFECT_CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'drawing', label: 'Gambar & Tepi' },
  { id: 'color', label: 'Warna & Cahaya' },
  { id: 'blur', label: 'Buram' },
  { id: 'distort', label: 'Distorsi / Warp' },
  { id: 'procedural', label: 'Prosedural' },
  { id: '3d', label: '3D' },
  { id: 'text', label: 'Teks' },
  { id: 'opacity', label: 'Opasitas & Masker' },
  { id: 'repeat', label: 'Ulangi' },
  { id: 'transform', label: 'Transformasi' },
  { id: 'other', label: 'Lainnya' }
];

function hexToRgba(hex) {
  const clean = String(hex || '').replace('#', '').trim();
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return [r, g, b, 1];
  }
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    const a = parseInt(clean.slice(6, 8), 16) / 255;
    return [r, g, b, a];
  }
  return [1, 1, 1, 1];
}

export function AddEffectModal({ isOpen, onClose, onAddEffect }) {
  const [currentCat, setCurrentCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const catalog = useMemo(() => {
    return Array.isArray(catalogData) ? catalogData : Object.values(catalogData);
  }, []);

  const filtered = useMemo(() => {
    let list = catalog;
    if (currentCat !== 'all') {
      list = list.filter((fx) => fx.category === currentCat);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((fx) => {
        const nameMatch = fx.name && fx.name.toLowerCase().includes(q);
        const idMatch = fx.id && fx.id.toLowerCase().includes(q);
        const descMatch = fx.desc && fx.desc.toLowerCase().includes(q);
        const tagMatch = fx.tags && fx.tags.some((t) => t.toLowerCase().includes(q));
        return nameMatch || idMatch || descMatch || tagMatch;
      });
    }
    return list;
  }, [catalog, currentCat, searchQuery]);

  if (!isOpen) return null;

  const handleSelectEffect = (fxDef) => {
    const fxId = fxDef.id;
    const initialParams = (fxDef.params || [])
      .filter((p) => p.tag !== 'tip')
      .map((p) => {
        let val = p.default;
        if (p.dataType === 'color') {
          val = typeof val === 'string' ? hexToRgba(val) : (Array.isArray(val) ? val : [1, 1, 1, 1]);
        } else if (!Array.isArray(val)) {
          val = [Number(val) || 0];
        }
        return {
          id: p.id,
          dataType: p.dataType,
          channel: {
            value: val,
            kfs: []
          }
        };
      });

    const newFx = {
      id: fxId,
      name: fxDef.name || fxId.split('.').pop(),
      shortId: fxId.split('.').pop(),
      enabled: true,
      hidden: false,
      locallyApplied: true,
      params: initialParams,
      _meta: fxDef
    };

    onAddEffect && onAddEffect(newFx);
    onClose && onClose();
  };

  return (
    <div
      id="am-effect-picker-sheet"
      onClick={(e) => {
        if (e.target.id === 'am-effect-picker-sheet') onClose && onClose();
      }}
    >
      <div className="am-fx-picker-box">
        <div className="am-fx-picker-header">
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Tambah Efek</span>
          <button
            type="button"
            id="am-fx-picker-close"
            style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="am-fx-search-bar" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            id="am-fx-picker-search"
            placeholder="Cari efek..."
            className="am-import-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: '#090a0e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#fff',
              fontSize: 13,
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              id="am-fx-search-clear"
              style={{ background: 'transparent', border: 0, color: '#8c93a7', cursor: 'pointer', fontSize: 14, padding: 4 }}
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="am-fx-cats-bar">
          {EFFECT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`am-fx-cat-chip ${c.id === currentCat ? 'active' : ''}`}
              onClick={() => setCurrentCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div id="am-fx-grid" className="am-fx-picker-grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#8c93a7', padding: 30, fontSize: 12 }}>
              Tidak ada efek yang cocok
            </div>
          ) : (
            filtered.slice(0, 120).map((fx) => {
              const thumbUrl = fx.thumb || './icons/ac_ic_effects.svg';
              return (
                <div
                  key={fx.id}
                  className="am-fx-card"
                  onClick={() => handleSelectEffect(fx)}
                >
                  <div className="am-fx-card-thumb">
                    <img
                      src={thumbUrl}
                      onError={(e) => {
                        e.currentTarget.src = './icons/ac_ic_effects.svg';
                        e.currentTarget.style.width = '36px';
                        e.currentTarget.style.height = '36px';
                      }}
                      alt={fx.name}
                    />
                  </div>
                  <div className="am-fx-card-title">{fx.name}</div>
                  <div className="am-fx-card-tags">
                    <span className="am-fx-tag-badge cat">{fx.categoryLabel || fx.category || 'Efek'}</span>
                    {(fx.tags || []).slice(0, 2).map((t, i) => (
                      <span key={i} className="am-fx-tag-badge">{t}</span>
                    ))}
                  </div>
                  {fx.desc && <div className="am-fx-card-desc">{fx.desc}</div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AddEffectModal;
