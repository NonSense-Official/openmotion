import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';

const SPEED_PRESETS = [
  { label: '1/4x', val: 0.25 },
  { label: '1/2x', val: 0.5 },
  { label: '1x', val: 1.0 },
  { label: '1.5x', val: 1.5 },
  { label: '2x', val: 2.0 },
  { label: '4x', val: 4.0 },
  { label: '8x', val: 8.0 }
];

const SPEED_CURVES = [
  { id: 'linear', label: 'Linier', d: 'M 4 28 L 36 4' },
  { id: 'ease_in', label: 'Ease In', d: 'M 4 28 Q 28 28 36 4' },
  { id: 'ease_out', label: 'Ease Out', d: 'M 4 28 Q 12 4 36 4' },
  { id: 'ease_in_out', label: 'Ease In Out', d: 'M 4 28 C 20 28 20 4 36 4' },
  { id: 'fast_start', label: 'Fast Start', d: 'M 4 28 C 4 8 20 4 36 4' },
  { id: 'slow_motion', label: 'Slow Motion', d: 'M 4 28 C 16 16 24 16 36 4' },
  { id: 'dramatic', label: 'Dramatic', d: 'M 4 28 C 28 28 32 16 36 4' }
];

export default function SpeedControlPanel({ layer, onBack }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const activeScene = useEditorStore((state) => state.activeScene);

  const initialSpeed = () => {
    if (typeof layer.speed === 'number' && layer.speed > 0) return layer.speed;
    if (typeof layer.timeScale === 'number' && layer.timeScale > 0) return layer.timeScale;
    return 1;
  };

  const [curSpeed, setCurSpeed] = useState(initialSpeed);
  const [stretchMode, setStretchMode] = useState(() => layer.timeStretchMode || 'stretch');
  const [isReversed, setIsReversed] = useState(() => Boolean(layer.reversed));
  const [isFrozen, setIsFrozen] = useState(() => Boolean(layer.freezeTime != null || layer.freezeFrame));
  const [curCurve, setCurCurve] = useState(() => layer.speedCurve?.type || 'linear');
  const [isCurveOpen, setIsCurveOpen] = useState(false);

  const totalTime = activeScene?.totalTime || 5000;
  const startMs = layer.startTime || 0;
  const endMs = layer.endTime != null ? layer.endTime : totalTime;
  const durMs = Math.max(0, endMs - startMs);
  const durSec = (durMs / 1000).toFixed(2);
  const origDurSec = layer._origDuration ? (layer._origDuration / 1000).toFixed(2) : durSec;

  const applySpeed = (newSpeed) => {
    const s = Math.max(0.1, Math.min(16, Number(newSpeed) || 1));
    setCurSpeed(s);

    const patch = {
      speed: s,
      timeScale: s,
      _origDuration: layer._origDuration || durMs
    };

    if (stretchMode === 'stretch') {
      const baseDur = layer._origDuration || durMs;
      const newDur = Math.round(baseDur / s);
      patch.endTime = startMs + newDur;
    }

    updateLayer(layer.id, patch);
  };

  const handleRetime = (type) => {
    if (type === 'extend_start') {
      if (playheadMs < endMs - 10) updateLayer(layer.id, { startTime: playheadMs });
    } else if (type === 'reduce_start') {
      if (playheadMs > startMs && playheadMs < endMs - 10) updateLayer(layer.id, { startTime: playheadMs });
    } else if (type === 'reduce_end') {
      if (playheadMs < endMs && playheadMs > startMs + 10) updateLayer(layer.id, { endTime: playheadMs });
    } else if (type === 'extend_end') {
      if (playheadMs > startMs + 10) updateLayer(layer.id, { endTime: playheadMs });
    }
  };

  const handleToggleFreeze = () => {
    const nextFreeze = !isFrozen;
    setIsFrozen(nextFreeze);
    updateLayer(layer.id, {
      freezeTime: nextFreeze ? Math.max(0, Math.min(1, (playheadMs - startMs) / Math.max(1, durMs))) : null,
      freezeFrame: nextFreeze
    });
  };

  const handleToggleReverse = () => {
    const nextRev = !isReversed;
    setIsReversed(nextRev);
    updateLayer(layer.id, { reversed: nextRev });
  };

  const handleSelectCurve = (curveId) => {
    setCurCurve(curveId);
    updateLayer(layer.id, { speedCurve: { type: curveId } });
  };

  return (
    <div className="am-speed-container">
      <div className="am-retime-section">
        <div className="am-retime-label-row">
          <span className="am-speed-sec-label">Retime ke Playhead</span>
          <span className="am-retime-ph-val">{(playheadMs / 1000).toFixed(2)}s</span>
        </div>
        <div className="am-retime-button-group">
          <button type="button" className="am-retime-btn left" title="Perpanjang Mulai ke Playhead" onClick={() => handleRetime('extend_start')}>
            <img src="./icons/ac_ic_retime_extend_start.svg" alt="Extend Start" />
            <span>Perpanjang Mulai</span>
          </button>
          <button type="button" className="am-retime-btn center" title="Perpendek Mulai ke Playhead" onClick={() => handleRetime('reduce_start')}>
            <img src="./icons/ac_ic_retime_reduce_start.svg" alt="Reduce Start" />
            <span>Perpendek Mulai</span>
          </button>
          <button type="button" className="am-retime-btn center" title="Perpendek Akhir ke Playhead" onClick={() => handleRetime('reduce_end')}>
            <img src="./icons/ic_ac_ic_retime_reduce_end.svg" alt="Reduce End" />
            <span>Perpendek Akhir</span>
          </button>
          <button type="button" className="am-retime-btn right" title="Perpanjang Akhir ke Playhead" onClick={() => handleRetime('extend_end')}>
            <img src="./icons/ic_ac_ic_retime_extend_end.svg" alt="Extend End" />
            <span>Perpanjang Akhir</span>
          </button>
        </div>
      </div>

      <div className="am-speed-badge-card">
        <div className="am-speed-badge-main">
          <span className="am-speed-sec-label">Kecepatan Pemutaran</span>
          <div className="am-speed-badge-val-row">
            <span id="am-speed-num" className="am-speed-number">{curSpeed.toFixed(2)}x</span>
            <button type="button" id="am-speed-reset-btn" className="am-speed-reset" title="Kembalikan ke 1.00x" onClick={() => applySpeed(1.0)}>Reset</button>
          </div>
        </div>
        <div className="am-speed-duration-info">
          <span>Durasi: <strong>{durSec}s</strong></span>
          {layer._origDuration && Math.abs(curSpeed - 1) > 0.01 && (
            <span className="am-speed-orig-dur">Asli: {origDurSec}s</span>
          )}
        </div>
      </div>

      <div className="am-speed-slider-card">
        <div className="am-speed-slider-row">
          <div className="am-speed-slider-icon" title="Lambat">
            <img src="./icons/ac_ic_speed_slow.svg" alt="Slow" />
          </div>
          <div className="am-speed-slider-wrap">
            <input
              type="range"
              id="am-speed-slider"
              min="10"
              max="1600"
              value={Math.round(curSpeed * 100)}
              className="am-speed-range-input"
              onChange={(e) => applySpeed(Number(e.target.value) / 100)}
            />
            <div className="am-speed-ticks">
              <span>0.25x</span>
              <span>0.5x</span>
              <span>1x</span>
              <span>2x</span>
              <span>4x</span>
              <span>8x</span>
              <span>16x</span>
            </div>
          </div>
          <div className="am-speed-slider-icon" title="Cepat">
            <img src="./icons/ac_ic_speed_fast.svg" alt="Fast" />
          </div>
        </div>
      </div>

      <div className="am-speed-presets-section">
        <div className="am-speed-sec-label">Preset Kecepatan Cepat</div>
        <div className="am-speed-presets-grid">
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.val}
              type="button"
              className={`am-speed-pbtn ${Math.abs(curSpeed - p.val) < 0.02 ? 'active' : ''}`}
              onClick={() => applySpeed(p.val)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="am-speed-mode-section">
        <div className="am-speed-sec-label">Mode Time-Stretch</div>
        <div className="am-speed-mode-tabs">
          <button
            type="button"
            className={`am-speed-mode-btn ${stretchMode === 'stretch' ? 'active' : ''}`}
            onClick={() => { setStretchMode('stretch'); updateLayer(layer.id, { timeStretchMode: 'stretch' }); }}
          >
            <span>Ubah Durasi Layer</span>
            <small>Layer memendek/memanjang di timeline</small>
          </button>
          <button
            type="button"
            className={`am-speed-mode-btn ${stretchMode === 'keep' ? 'active' : ''}`}
            onClick={() => { setStretchMode('keep'); updateLayer(layer.id, { timeStretchMode: 'keep' }); }}
          >
            <span>Pertahankan Durasi</span>
            <small>Panjang layer tetap di timeline</small>
          </button>
        </div>
      </div>

      <div className="am-speed-actions-section">
        <div className="am-speed-sec-label">Kontrol Retiming Khusus</div>
        <div className="am-speed-actions-grid">
          <button
            type="button"
            className={`am-speed-act-btn ${isFrozen ? 'active' : ''}`}
            onClick={handleToggleFreeze}
          >
            <div className="am-speed-act-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
              </svg>
            </div>
            <div className="am-speed-act-text">
              <span className="am-speed-act-title">Bekukan Frame (Freeze)</span>
              <span className="am-speed-act-status">{isFrozen ? 'Beku Aktif' : 'Nonaktif'}</span>
            </div>
          </button>

          <button
            type="button"
            className={`am-speed-act-btn ${isReversed ? 'active' : ''}`}
            onClick={handleToggleReverse}
          >
            <div className="am-speed-act-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M11 5V1L4 8L11 15V11C16.5 11 20 12.5 22 17C21 12 18 7 11 5Z" />
              </svg>
            </div>
            <div className="am-speed-act-text">
              <span className="am-speed-act-title">Putar Balik (Reverse)</span>
              <span className="am-speed-act-status">{isReversed ? 'Putar Balik Aktif' : 'Normal'}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="am-speed-curve-section">
        <div className="am-speed-curve-header" onClick={() => setIsCurveOpen(!isCurveOpen)}>
          <div className="am-speed-curve-header-left">
            <img src="./icons/ac_ic_anim_curve.svg" className="am-speed-curve-ic" alt="Curve" />
            <span className="am-speed-sec-label" style={{ margin: 0 }}>Kurva Kecepatan (Speed Curve)</span>
          </div>
          <div className="am-speed-curve-current-badge">{curCurve.replace('_', ' ').toUpperCase()}</div>
        </div>
        {isCurveOpen && (
          <div className="am-speed-curve-panel open">
            <div className="am-speed-curves-grid">
              {SPEED_CURVES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`am-speed-curve-item ${curCurve === c.id ? 'active' : ''}`}
                  onClick={() => handleSelectCurve(c.id)}
                >
                  <svg viewBox="0 0 40 32" className="am-speed-curve-thumb">
                    <path d={c.d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
