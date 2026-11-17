import React from 'react';

const PRESET_COLORS = [
  '#ffffff',
  '#00ffa8',
  '#00c2ff',
  '#ffcc00',
  '#ff3b30',
  '#af52de',
  '#5856d6',
  '#191a1c'
];

export function BrushControls({
  currentTool = 'pen',
  onSelectTool,
  strokeWidth = 12,
  onChangeStrokeWidth,
  smoothing = 35,
  onChangeSmoothing,
  color = '#00ffa8',
  onChangeColor
}) {
  return (
    <div
      id="am-drawing-panel"
      className="am-drawing-controls open"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '10px 16px',
        backgroundColor: '#191b27',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Tool selector */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[
          { id: 'pen', label: 'Pena' },
          { id: 'brush', label: 'Kuas' },
          { id: 'fill', label: 'Isi' },
          { id: 'eraser', label: 'Penghapus' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`am-draw-tool-btn ${currentTool === t.id ? 'active' : ''}`}
            onClick={() => onSelectTool && onSelectTool(t.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: currentTool === t.id ? '#00ffa8' : 'rgba(255,255,255,0.08)',
              color: currentTool === t.id ? '#090a0e' : '#fff',
              border: 0,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Width row */}
      <div className="am-draw-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="./icons/ic_handdrawing_size.svg" className="am-draw-icon" alt="Size" style={{ width: 18, height: 18 }} />
        <input
          type="range"
          id="am-draw-size-slider"
          min="1"
          max="100"
          value={strokeWidth}
          onChange={(e) => onChangeStrokeWidth && onChangeStrokeWidth(parseInt(e.target.value, 10))}
          style={{ flex: 1, accentColor: '#00ffa8' }}
        />
        <span id="am-draw-size-badge" className="am-draw-badge" style={{ fontSize: 11, color: '#00ffa8', minWidth: 44, textAlign: 'right' }}>
          {strokeWidth} px
        </span>
      </div>

      {/* Smoothing row */}
      <div className="am-draw-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="am-draw-label" style={{ fontSize: 11, color: '#8c93a7', minWidth: 60 }}>Kehalusan</span>
        <input
          type="range"
          id="am-draw-smooth-slider"
          min="0"
          max="100"
          value={smoothing}
          onChange={(e) => onChangeSmoothing && onChangeSmoothing(parseInt(e.target.value, 10))}
          style={{ flex: 1, accentColor: '#00ffa8' }}
        />
        <span id="am-draw-smooth-badge" className="am-draw-badge" style={{ fontSize: 11, color: '#00ffa8', minWidth: 44, textAlign: 'right' }}>
          {smoothing}%
        </span>
      </div>

      {/* Swatches row */}
      <div className="am-draw-row am-draw-color-row" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <div id="am-draw-swatches" className="am-draw-swatches" style={{ display: 'flex', gap: 8 }}>
          {PRESET_COLORS.map((c) => (
            <div
              key={c}
              className={`am-draw-swatch ${c === color ? 'active' : ''}`}
              onClick={() => onChangeColor && onChangeColor(c)}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: c,
                cursor: 'pointer',
                boxShadow: c === color ? '0 0 0 2px #fff, 0 0 0 4px #00ffa8' : 'none'
              }}
            />
          ))}
        </div>

        <label
          className="am-draw-picker-label"
          title="Pilih Warna Kustom"
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
        >
          <input
            type="color"
            id="am-draw-color-picker"
            value={color}
            onChange={(e) => onChangeColor && onChangeColor(e.target.value)}
            style={{ opacity: 0, width: 24, height: 24, position: 'absolute', cursor: 'pointer' }}
          />
          <div
            className="am-draw-picker-btn"
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              border: '1px solid rgba(255,255,255,0.4)'
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default BrushControls;
