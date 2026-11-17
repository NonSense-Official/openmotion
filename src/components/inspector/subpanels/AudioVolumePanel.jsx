import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';

export default function AudioVolumePanel({ layer, onBack, onOpenCurve }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const playheadMs = useEditorStore((state) => state.playheadMs);

  const hasAudio = Boolean(
    layer.tag === 'audio' ||
    layer.tag === 'video' ||
    layer.fillType === 'media' ||
    layer.src ||
    layer.gain != null
  );

  const getInitialGainPct = () => {
    let g = 1;
    if (layer.gain != null) {
      if (typeof layer.gain === 'number') g = layer.gain;
      else if (Array.isArray(layer.gain.value) && Number.isFinite(Number(layer.gain.value[0]))) {
        g = Number(layer.gain.value[0]);
      }
    }
    return Math.max(0, Math.min(500, Math.round(g * 100)));
  };

  const [gainPct, setGainPct] = useState(getInitialGainPct);
  const [prevGain, setPrevGain] = useState(() => (gainPct > 0 ? gainPct : 100));

  if (!hasAudio) {
    return (
      <div className="am-vol-no-audio-container">
        <div className="am-vol-no-audio-text">Layer ini tidak memiliki audio</div>
      </div>
    );
  }

  const isMuted = gainPct === 0;
  const tSec = playheadMs / 1000;
  const gProp = layer.gain;
  const hasKf = Boolean(gProp?.kfs?.some((k) => Math.abs(Number(k.t) - tSec) < 0.002));

  const calcDb = (p) => {
    if (p <= 0) return '-∞ dB';
    const db = 20 * Math.log10(p / 100);
    return `${db >= 0 ? '+' : ''}${db.toFixed(1)} dB`;
  };

  const applyGain = (newPct) => {
    const clamped = Math.max(0, Math.min(500, Math.round(Number(newPct) || 0)));
    setGainPct(clamped);
    if (clamped > 0) setPrevGain(clamped);

    const norm = clamped / 100;
    const existingKfs = layer.gain?.kfs ? [...layer.gain.kfs] : [];
    const kfIdx = existingKfs.findIndex((k) => Math.abs(Number(k.t) - tSec) < 0.002);
    if (kfIdx >= 0) {
      existingKfs[kfIdx] = { ...existingKfs[kfIdx], v: [norm] };
    }

    updateLayer(layer.id, {
      gain: {
        value: [norm],
        kfs: existingKfs
      }
    });
  };

  const handleToggleMute = () => {
    if (gainPct > 0) {
      applyGain(0);
    } else {
      applyGain(prevGain || 100);
    }
  };

  const handleToggleKeyframe = () => {
    const norm = gainPct / 100;
    let nextKfs = layer.gain?.kfs ? [...layer.gain.kfs] : [];

    if (hasKf) {
      nextKfs = nextKfs.filter((k) => Math.abs(Number(k.t) - tSec) >= 0.002);
    } else {
      nextKfs.push({ t: tSec, v: [norm], e: null, easing: null });
      nextKfs.sort((a, b) => a.t - b.t);
    }

    updateLayer(layer.id, {
      gain: {
        value: [norm],
        kfs: nextKfs
      }
    });
  };

  return (
    <div className="am-vol-custom-base">
      <div className="am-vol-sidebar">
        <button type="button" id="am-vol-btn-back" className="am-vol-side-btn" title="Kembali" onClick={onBack}>
          <img src="./icons/ac_ic_back.svg" alt="Back" />
        </button>
        <button
          type="button"
          id="am-vol-btn-kf"
          className={`am-vol-side-btn ${hasKf ? 'active' : ''}`}
          title={hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}
          onClick={handleToggleKeyframe}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={hasKf ? '#00ffa8' : 'none'} stroke={hasKf ? '#00ffa8' : '#fff'} strokeWidth="2">
            <path d="M12 2L4 12l8 10 8-10L12 2z" />
          </svg>
        </button>
        <button type="button" id="am-vol-btn-curve" className="am-vol-side-btn" title="Kurva Easing" onClick={onOpenCurve}>
          <img src="./icons/ac_ic_anim_curve.svg" alt="Curve" />
        </button>
        <button
          type="button"
          id="am-vol-btn-mute"
          className={`am-vol-side-btn ${isMuted ? 'active' : ''}`}
          title={isMuted ? 'Bunyikan' : 'Bisukan'}
          onClick={handleToggleMute}
        >
          <img src={`./icons/${isMuted ? 'ac_ic_audio_mute.svg' : 'ac_ic_audio.svg'}`} alt="Mute" />
        </button>
      </div>

      <div className="am-vol-body">
        <div className="am-vol-top-bar">
          <div className="am-vol-top-tab" id="am-vol-tab-audio">
            <img src="./icons/ac_ic_audio.svg" alt="Audio" />
            <div className="am-vol-tab-indicator" />
          </div>
        </div>

        <div className="am-vol-main-row">
          <img src="./icons/ac_ic_audiolevel.svg" className="am-vol-level-icon" alt="Audio Level" />
          <input
            type="range"
            id="am-gain-slider"
            min="0"
            max="500"
            value={gainPct}
            className="am-vol-slider"
            title="Geser Gain (0% - 500%)"
            onChange={(e) => applyGain(e.target.value)}
          />
          <div id="am-gain-value-box" className="am-gain-value-box" title={calcDb(gainPct)}>
            <span className="am-gain-value-pct" id="am-gain-pct-text">{gainPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
