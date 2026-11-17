import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { SWATCHES } from './colorUtils';

export default function BorderShadowPanel({ layer, onBack, onOpenCurve }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const playheadMs = useEditorStore((state) => state.playheadMs);

  const [activeTab, setActiveTab] = useState('border');

  const strokeEnabled = Boolean(layer.strokeEnabled ?? (layer.border?.enabled && (layer.border?.size > 0)));
  const strokeWidth = layer.strokeWidth ?? (layer.border?.size ?? 10);
  const strokeColor = layer.strokeColor ?? '#ffffff';
  const strokeCap = layer.strokeCap ?? 'round';
  const strokeJoin = layer.strokeJoin ?? 'round';
  const strokePosition = layer.strokePosition ?? 'outside';

  const shadowEnabled = Boolean(layer.shadowEnabled ?? (layer.shadow?.enabled && layer.shadow?.size > 0));
  const shadowRadius = layer.shadowRadius ?? (layer.shadow?.size ?? 25);
  const shadowAlpha = layer.shadowAlpha ?? 60;
  const shadowX = layer.shadowX ?? (layer.shadow?.offset?.[0] ?? 0);
  const shadowY = layer.shadowY ?? (layer.shadow?.offset?.[1] ?? 10);
  const shadowColor = layer.shadowColor ?? '#000000';

  const tSec = playheadMs / 1000;
  const keyable = activeTab === 'border' ? layer.strokeKeyable : layer.shadowKeyable;
  const hasKf = Boolean(keyable?.kfs?.some((k) => Math.abs(Number(k.t) - tSec) < 0.002));

  const syncStroke = (patch) => {
    const nextEnabled = patch.strokeEnabled !== undefined ? patch.strokeEnabled : strokeEnabled;
    const nextWidth = patch.strokeWidth !== undefined ? patch.strokeWidth : strokeWidth;
    const nextColor = patch.strokeColor !== undefined ? patch.strokeColor : strokeColor;
    const nextCap = patch.strokeCap !== undefined ? patch.strokeCap : strokeCap;
    const nextJoin = patch.strokeJoin !== undefined ? patch.strokeJoin : strokeJoin;
    const nextPos = patch.strokePosition !== undefined ? patch.strokePosition : strokePosition;

    updateLayer(layer.id, {
      ...patch,
      border: nextEnabled
        ? {
            enabled: true,
            size: Number(nextWidth),
            color: nextColor,
            cap: nextCap,
            join: nextJoin,
            direction: nextPos
          }
        : null
    });
  };

  const syncShadow = (patch) => {
    const nextEnabled = patch.shadowEnabled !== undefined ? patch.shadowEnabled : shadowEnabled;
    const nextRadius = patch.shadowRadius !== undefined ? patch.shadowRadius : shadowRadius;
    const nextAlpha = patch.shadowAlpha !== undefined ? patch.shadowAlpha : shadowAlpha;
    const nextX = patch.shadowX !== undefined ? patch.shadowX : shadowX;
    const nextY = patch.shadowY !== undefined ? patch.shadowY : shadowY;
    const nextColor = patch.shadowColor !== undefined ? patch.shadowColor : shadowColor;

    updateLayer(layer.id, {
      ...patch,
      shadow: nextEnabled
        ? {
            enabled: true,
            size: Number(nextRadius),
            color: nextColor,
            alpha: Number(nextAlpha) / 100,
            offset: [Number(nextX), Number(nextY)]
          }
        : null
    });
  };

  return (
    <div className="am-bs-root">
      <div className="am-bs-sidebar-left">
        <button type="button" id="am-bs-btn-back" className="am-vol-side-btn" title="Kembali" onClick={onBack}>
          <img src="./icons/ac_ic_back.svg" alt="Back" />
        </button>
        <button
          type="button"
          id="am-bs-btn-kf"
          className={`am-vol-side-btn ${hasKf ? 'active' : ''}`}
          title={hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={hasKf ? '#00ffa8' : 'none'} stroke={hasKf ? '#00ffa8' : '#fff'} strokeWidth="2">
            <path d="M12 2L4 12l8 10 8-10L12 2z" />
          </svg>
        </button>
        <button type="button" id="am-bs-btn-curve" className="am-vol-side-btn" title="Kurva Easing" onClick={onOpenCurve}>
          <img src="./icons/ac_ic_anim_curve.svg" alt="Curve" />
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div className="am-bs-center">
        {activeTab === 'border' ? (
          <>
            <div id="color_switch_holder" className="am-color-switch-holder">
              <div className="am-color-switch-left">
                <div className="am-color-view-wrap">
                  <div id="color_view" className="am-color-view" style={{ background: strokeColor }} />
                  <input
                    type="color"
                    className="am-color-view-input"
                    value={strokeColor}
                    onChange={(e) => syncStroke({ strokeColor: e.target.value })}
                  />
                </div>
                <span id="feature_title" className="am-feature-title">Garis Batas</span>
              </div>
              <label className="am-switch-toggle">
                <input
                  type="checkbox"
                  checked={strokeEnabled}
                  onChange={(e) => syncStroke({ strokeEnabled: e.target.checked })}
                />
                <span className="am-switch-slider" />
              </label>
            </div>

            {strokeEnabled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                <div className="am-cf-slider-row">
                  <div className="am-cf-slider-header">
                    <span>Ukuran (Tebal Garis)</span>
                    <span className="am-cf-slider-val">{strokeWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={strokeWidth}
                    className="am-bs-slider"
                    onChange={(e) => syncStroke({ strokeWidth: Number(e.target.value) })}
                  />
                </div>

                <div className="am-bs-section">
                  <span className="am-bs-control-label">Ujung Garis (Cap)</span>
                  <div className="am-bs-segmented">
                    {['butt', 'round', 'square'].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        className={`am-bs-seg-btn ${strokeCap === cap ? 'active' : ''}`}
                        onClick={() => syncStroke({ strokeCap: cap })}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{cap}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="am-bs-section">
                  <span className="am-bs-control-label">Sudut Sambungan (Join)</span>
                  <div className="am-bs-segmented">
                    {['bevel', 'round', 'miter'].map((j) => (
                      <button
                        key={j}
                        type="button"
                        className={`am-bs-seg-btn ${strokeJoin === j ? 'active' : ''}`}
                        onClick={() => syncStroke({ strokeJoin: j })}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{j}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="am-bs-section">
                  <span className="am-bs-control-label">Posisi Batas</span>
                  <div className="am-bs-segmented">
                    {[
                      { id: 'outside', label: 'Luar' },
                      { id: 'center', label: 'Tengah' },
                      { id: 'inside', label: 'Dalam' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`am-bs-seg-btn ${strokePosition === p.id ? 'active' : ''}`}
                        onClick={() => syncStroke({ strokePosition: p.id })}
                      >
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="am-bs-section">
                  <div className="am-bs-label-row">
                    <span className="am-bs-control-label">Warna Batas</span>
                    <input
                      type="color"
                      value={strokeColor}
                      style={{ width: 28, height: 24, border: 0, background: 'transparent', cursor: 'pointer' }}
                      onChange={(e) => syncStroke({ strokeColor: e.target.value })}
                    />
                  </div>
                  <div className="am-bs-palette-grid">
                    {SWATCHES.map((c) => (
                      <div
                        key={c}
                        className={`am-bs-palette-chip ${c.toLowerCase() === strokeColor.toLowerCase() ? 'active' : ''}`}
                        style={{ background: c }}
                        onClick={() => syncStroke({ strokeColor: c })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#8c93a7', padding: '26px 16px', fontSize: 12, background: '#181b2a', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.08)', marginTop: 8 }}>
                Aktifkan switch di atas untuk menambahkan garis batas (stroke) pada layer ini.
              </div>
            )}
          </>
        ) : (
          <>
            <div id="color_switch_holder" className="am-color-switch-holder">
              <div className="am-color-switch-left">
                <div className="am-color-view-wrap">
                  <div id="color_view" className="am-color-view" style={{ background: shadowColor }} />
                  <input
                    type="color"
                    className="am-color-view-input"
                    value={shadowColor}
                    onChange={(e) => syncShadow({ shadowColor: e.target.value })}
                  />
                </div>
                <span id="feature_title" className="am-feature-title">Bayangan</span>
              </div>
              <label className="am-switch-toggle">
                <input
                  type="checkbox"
                  checked={shadowEnabled}
                  onChange={(e) => syncShadow({ shadowEnabled: e.target.checked })}
                />
                <span className="am-switch-slider" />
              </label>
            </div>

            {shadowEnabled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                <div className="am-cf-slider-row">
                  <div className="am-cf-slider-header">
                    <span>Radius Bayangan (Blur)</span>
                    <span className="am-cf-slider-val">{shadowRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowRadius}
                    className="am-bs-slider"
                    onChange={(e) => syncShadow({ shadowRadius: Number(e.target.value) })}
                  />
                </div>

                <div className="am-cf-slider-row">
                  <div className="am-cf-slider-header">
                    <span>Opasitas (Alpha)</span>
                    <span className="am-cf-slider-val">{shadowAlpha}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowAlpha}
                    className="am-bs-slider"
                    onChange={(e) => syncShadow({ shadowAlpha: Number(e.target.value) })}
                  />
                </div>

                <div className="am-bs-offset-row">
                  <div className="am-bs-offset-col">
                    <div className="am-bs-label-row">
                      <span className="am-bs-control-label">Posisi X</span>
                      <span className="am-bs-val-box">{shadowX} px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={shadowX}
                      className="am-bs-slider"
                      onChange={(e) => syncShadow({ shadowX: Number(e.target.value) })}
                    />
                  </div>
                  <div className="am-bs-offset-col">
                    <div className="am-bs-label-row">
                      <span className="am-bs-control-label">Posisi Y</span>
                      <span className="am-bs-val-box">{shadowY} px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={shadowY}
                      className="am-bs-slider"
                      onChange={(e) => syncShadow({ shadowY: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="am-bs-section">
                  <div className="am-bs-label-row">
                    <span className="am-bs-control-label">Warna Bayangan</span>
                    <input
                      type="color"
                      value={shadowColor}
                      style={{ width: 28, height: 24, border: 0, background: 'transparent', cursor: 'pointer' }}
                      onChange={(e) => syncShadow({ shadowColor: e.target.value })}
                    />
                  </div>
                  <div className="am-bs-palette-grid">
                    {SWATCHES.map((c) => (
                      <div
                        key={c}
                        className={`am-bs-palette-chip ${c.toLowerCase() === shadowColor.toLowerCase() ? 'active' : ''}`}
                        style={{ background: c }}
                        onClick={() => syncShadow({ shadowColor: c })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#8c93a7', padding: '26px 16px', fontSize: 12, background: '#181b2a', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.08)', marginTop: 8 }}>
                Aktifkan switch di atas untuk menambahkan efek bayangan (drop shadow) pada layer ini.
              </div>
            )}
          </>
        )}
      </div>

      <div className="am-bs-sidebar-right">
        <button
          type="button"
          id="am-bs-tab-border"
          className={`am-bs-tab-btn ${activeTab === 'border' ? 'active' : ''}`}
          title="Garis Batas (Stroke)"
          onClick={() => setActiveTab('border')}
        >
          <svg viewBox="0 0 95 95" width="22" height="22" fill="none">
            <path d="M16.5,4.5 L78.5,4.5 A12,12 0 0 1 90.5,16.5 L90.5,78.5 A12,12 0 0 1 78.5,90.5 L16.5,90.5 A12,12 0 0 1 4.5,78.5 L4.5,16.5 A12,12 0 0 1 16.5,4.5 Z" stroke="currentColor" strokeWidth="9" />
            <path d="M22,15 L73,15 A7,7 0 0 1 80,22 L80,73 A7,7 0 0 1 73,80 L22,80 A7,7 0 0 1 15,73 L15,22 A7,7 0 0 1 22,15 Z" stroke="currentColor" strokeWidth="4" strokeOpacity="0.35" />
          </svg>
        </button>
        <button
          type="button"
          id="am-bs-tab-shadow"
          className={`am-bs-tab-btn ${activeTab === 'shadow' ? 'active' : ''}`}
          title="Bayangan (Shadow)"
          onClick={() => setActiveTab('shadow')}
        >
          <svg viewBox="0 0 95 95" width="22" height="22" fill="none">
            <path d="M94.16,15.88 C94.16,7.11 87.05,0 78.28,0 L15.88,0 C7.11,0 0,7.11 0,15.88 L0,76.45 C0,85.22 7.11,92.33 15.88,92.33 L38.37,94.33 L18.25,73.94 C16.99,72.66 18.1,70.07 18.1,68.14 L18.1,24.2 C18.1,20.32 21.24,17.18 25.11,17.18 L69.05,17.18 C71.17,17.18 73.75,18.26 75.07,17.39 L94.16,36.42 Z" fill="currentColor" fillOpacity="0.35" />
            <path d="M25,17 L69,17 A7,7 0 0 1 76,24 L76,68 A7,7 0 0 1 69,75 L25,75 A7,7 0 0 1 18,68 L18,24 A7,7 0 0 1 25,17 Z" stroke="currentColor" strokeWidth="4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
