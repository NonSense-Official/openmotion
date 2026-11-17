import React from 'react';
import { SWATCHES, colorToCss, colorToHexStr } from './colorUtils';

export default function GradientFillSection({
  activeTab,
  gradColor1,
  gradColor2,
  activeGradStop,
  onSelectGradStop,
  onSwapGradient,
  onSetDirection,
  onSelectSwatch,
  activeColorObj,
  activeHexStr
}) {
  const gradientCss = activeTab === 'linear'
    ? `linear-gradient(to right, ${colorToCss(gradColor1)}, ${colorToCss(gradColor2)})`
    : `radial-gradient(circle, ${colorToCss(gradColor1)} 0%, ${colorToCss(gradColor2)} 100%)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="am-cf-stops-container">
        <div
          className={`am-cf-stop-card ${activeGradStop === 1 ? 'active' : ''}`}
          onClick={() => onSelectGradStop(1)}
        >
          <div className="am-cf-stop-chip" style={{ background: colorToCss(gradColor1) }} />
          <div className="am-cf-stop-info">
            <span className="am-cf-stop-title">Titik 1 (Mulai)</span>
            <span className="am-cf-stop-hex">{colorToHexStr(gradColor1)}</span>
          </div>
        </div>

        <button
          type="button"
          className="am-cf-swap-btn"
          title="Tukar Warna"
          onClick={onSwapGradient}
        >
          ⇄
        </button>

        <div
          className={`am-cf-stop-card ${activeGradStop === 2 ? 'active' : ''}`}
          onClick={() => onSelectGradStop(2)}
        >
          <div className="am-cf-stop-chip" style={{ background: colorToCss(gradColor2) }} />
          <div className="am-cf-stop-info">
            <span className="am-cf-stop-title">Titik 2 (Akhir)</span>
            <span className="am-cf-stop-hex">{colorToHexStr(gradColor2)}</span>
          </div>
        </div>
      </div>

      <div className="am-cf-bar-preview" style={{ background: gradientCss }} />

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          type="button"
          className="am-crop-btn"
          style={{
            flex: 1,
            padding: 6,
            fontSize: 11,
            background: '#181b2a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => onSetDirection(0, 0.5, 1, 0.5)}
        >
          Horizontal →
        </button>
        <button
          type="button"
          className="am-crop-btn"
          style={{
            flex: 1,
            padding: 6,
            fontSize: 11,
            background: '#181b2a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => onSetDirection(0.5, 0, 0.5, 1)}
        >
          Vertikal ↓
        </button>
        <button
          type="button"
          className="am-crop-btn"
          style={{
            flex: 1,
            padding: 6,
            fontSize: 11,
            background: '#181b2a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => onSetDirection(0, 0, 1, 1)}
        >
          Diagonal ↘
        </button>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--am-p5)', textTransform: 'uppercase', marginTop: 4 }}>
        Warna Titik {activeGradStop}
      </div>

      <div className="am-cf-top-bar">
        <div className="am-cf-color-preview-wrap">
          <div className="am-cf-color-preview" style={{ background: colorToCss(activeColorObj) }} />
        </div>
        <input
          type="text"
          className="am-cf-hex-input"
          value={activeHexStr}
          onChange={(e) => onSelectSwatch(e.target.value)}
        />
      </div>

      <div className="am-palette-grid">
        {SWATCHES.map((hex) => (
          <div
            key={hex}
            className={`am-palette-chip ${hex.toLowerCase() === activeHexStr.slice(0, 7).toLowerCase() ? 'active' : ''}`}
            data-color={hex}
            style={{ background: hex }}
            onClick={() => onSelectSwatch(hex)}
          />
        ))}
      </div>
    </div>
  );
}
