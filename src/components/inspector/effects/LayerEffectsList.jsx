import React, { useState } from 'react';
import EffectCard from './EffectCard';
import AddEffectModal from './AddEffectModal';

export function LayerEffectsList({ layer, playheadMs = 0, onUpdateLayer }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEffectIndex, setSelectedEffectIndex] = useState(null);

  if (!layer) return null;
  const effects = Array.isArray(layer.effects) ? layer.effects : [];
  const selectedEffect = selectedEffectIndex !== null ? effects[selectedEffectIndex] : null;

  const handleToggleVisibility = (idx) => {
    const nextEffects = [...effects];
    const target = { ...nextEffects[idx] };
    const curHidden = target.disabled || target.hidden === true || target.hidden === 'true';
    target.disabled = !curHidden;
    target.hidden = !curHidden;
    nextEffects[idx] = target;
    onUpdateLayer && onUpdateLayer({ ...layer, effects: nextEffects });
  };

  const handleDelete = (idx) => {
    const nextEffects = effects.filter((_, i) => i !== idx);
    if (selectedEffectIndex === idx) {
      setSelectedEffectIndex(null);
    } else if (selectedEffectIndex !== null && selectedEffectIndex > idx) {
      setSelectedEffectIndex(selectedEffectIndex - 1);
    }
    onUpdateLayer && onUpdateLayer({ ...layer, effects: nextEffects });
  };

  const handleAddEffect = (newFx) => {
    const nextEffects = [...effects, newFx];
    onUpdateLayer && onUpdateLayer({ ...layer, effects: nextEffects });
    setSelectedEffectIndex(nextEffects.length - 1);
  };

  const handleUpdateParam = (paramIndex, newValue) => {
    if (!selectedEffect) return;
    const nextEffects = [...effects];
    const fx = { ...selectedEffect, params: [...(selectedEffect.params || [])] };
    const param = { ...fx.params[paramIndex] };
    if (!param.channel) param.channel = { value: [0], kfs: [] };
    param.channel.value = Array.isArray(newValue) ? newValue : [newValue];
    fx.params[paramIndex] = param;
    nextEffects[selectedEffectIndex] = fx;
    onUpdateLayer && onUpdateLayer({ ...layer, effects: nextEffects });
  };

  const handleToggleKf = () => {
    if (!selectedEffect) return;
    const playheadSec = (playheadMs || 0) / 1000;
    const nextEffects = [...effects];
    const fx = { ...selectedEffect, params: [...(selectedEffect.params || [])] };

    fx.params = fx.params.map((p) => {
      const param = { ...p, channel: { ...(p.channel || { value: [0], kfs: [] }) } };
      param.channel.kfs = [...(param.channel.kfs || [])];
      const existingKfIdx = param.channel.kfs.findIndex(
        (k) => Math.abs(Number(k.t) - playheadSec) < 0.002
      );
      if (existingKfIdx >= 0) {
        param.channel.kfs.splice(existingKfIdx, 1);
      } else {
        param.channel.kfs.push({
          t: playheadSec,
          v: param.channel.value || [0]
        });
        param.channel.kfs.sort((a, b) => Number(a.t) - Number(b.t));
      }
      return param;
    });

    nextEffects[selectedEffectIndex] = fx;
    onUpdateLayer && onUpdateLayer({ ...layer, effects: nextEffects });
  };

  const playheadSec = (playheadMs || 0) / 1000;
  let hasKfAtPlayhead = false;
  if (selectedEffect && Array.isArray(selectedEffect.params)) {
    for (const p of selectedEffect.params) {
      if (p.channel && Array.isArray(p.channel.kfs)) {
        if (p.channel.kfs.some((k) => Math.abs(Number(k.t) - playheadSec) < 0.002)) {
          hasKfAtPlayhead = true;
          break;
        }
      }
    }
  }

  if (selectedEffect) {
    const isHidden = !!(selectedEffect.disabled || selectedEffect.hidden === true || selectedEffect.hidden === 'true');
    return (
      <div className="am-fx-inspector">
        <div className="am-fx-inspector-header">
          <button
            type="button"
            id="am-fx-insp-back"
            className="am-fx-inspector-back"
            onClick={() => setSelectedEffectIndex(null)}
          >
            <span>←</span>
            <span>{selectedEffect.name || selectedEffect.id || 'Efek'}</span>
          </button>
          <div className="am-fx-inspector-actions">
            <button
              type="button"
              id="am-fx-insp-toggle"
              className="am-fx-inspector-btn"
              title="Toggle Efek"
              onClick={() => handleToggleVisibility(selectedEffectIndex)}
            >
              <img
                src="./icons/ic_visibility.svg"
                style={{ width: 18, height: 18, filter: `brightness(0) invert(${isHidden ? '0.4' : '1'})` }}
                alt="Visibility"
              />
            </button>
            <button
              type="button"
              id="am-fx-insp-delete"
              className="am-fx-inspector-btn"
              title="Hapus Efek"
              onClick={() => handleDelete(selectedEffectIndex)}
            >
              <img src="./icons/ac_ic_delete.svg" alt="Hapus" />
            </button>
          </div>
        </div>

        <div className="am-fx-kf-toolbar">
          <div style={{ fontSize: 11, fontWeight: 600, color: '#8c93a7' }}>
            Playhead: <span style={{ color: '#fff' }}>{playheadSec.toFixed(2)}s</span>
          </div>
          <button
            type="button"
            id="am-fx-insp-kf-btn"
            className={`am-fx-kf-btn ${hasKfAtPlayhead ? 'active' : ''}`}
            onClick={handleToggleKf}
          >
            <span>{hasKfAtPlayhead ? '◆− Hapus Keyframe' : '◆+ Tambah Keyframe'}</span>
          </button>
        </div>

        <div id="am-fx-params-box" className="am-fx-param-list">
          {(selectedEffect.params || []).map((p, pIdx) => {
            const val = p.channel && p.channel.value ? p.channel.value[0] : 0;
            return (
              <div
                key={p.id || pIdx}
                className="am-fx-param-item"
                style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c93a7' }}>
                  <span>{p.label || p.id}</span>
                  <span style={{ color: '#00ffa8', fontFamily: 'monospace' }}>
                    {typeof val === 'number' ? val.toFixed(2) : String(val)}
                  </span>
                </div>
                {p.dataType === 'float' || p.dataType === 'int' ? (
                  <input
                    type="range"
                    min={p.min !== undefined ? p.min : 0}
                    max={p.max !== undefined ? p.max : 1}
                    step={p.step || 0.01}
                    value={typeof val === 'number' ? val : 0}
                    onChange={(e) => handleUpdateParam(pIdx, parseFloat(e.target.value))}
                    style={{ accentColor: '#00ffa8' }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <button
        type="button"
        id="am-btn-add-fx"
        className="am-btn-add-fx"
        onClick={() => setIsAddModalOpen(true)}
      >
        <img
          src="./icons/ic_ac_add_mini.svg"
          style={{ width: 18, height: 18, filter: 'brightness(0) invert(1)' }}
          alt="+"
        />
        <span>TAMBAH EFEK</span>
      </button>

      <div id="am-fx-list-container" className="am-fx-list">
        {effects.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8c93a7', padding: '24px 16px', fontSize: 12 }}>
            Belum ada efek ditambahkan ke layer ini
          </div>
        ) : (
          effects.map((fx, i) => (
            <EffectCard
              key={fx.id ? `${fx.id}_${i}` : i}
              effect={fx}
              index={i}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDelete}
              onSelect={() => setSelectedEffectIndex(i)}
            />
          ))
        )}
      </div>

      <AddEffectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEffect={handleAddEffect}
      />
    </div>
  );
}

export default LayerEffectsList;
