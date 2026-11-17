import React from 'react';

export function EffectCard({ effect, index, onToggleVisibility, onDelete, onSelect }) {
  if (!effect) return null;
  const isHidden = !!(effect.disabled || effect.hidden === true || effect.hidden === 'true');
  const paramCount = Array.isArray(effect.params) ? effect.params.length : 0;
  const effectName = effect.name || effect.id || `Efek ${index + 1}`;

  return (
    <div
      className="am-fx-item"
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect && onSelect(effect)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
        <button
          type="button"
          className="am-fx-toggle"
          title={isHidden ? 'Tampilkan Efek' : 'Sembunyikan Efek'}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility && onToggleVisibility(index);
          }}
        >
          <img
            src="./icons/ic_visibility.svg"
            style={{ width: 18, height: 18, filter: `brightness(0) invert(${isHidden ? '0.4' : '1'})` }}
            alt="Visibility"
          />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
          <span className="am-fx-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {effectName}
          </span>
          <span style={{ fontSize: 10, color: '#8c93a7' }}>
            {paramCount} parameter
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          className="am-fx-del"
          title="Hapus Efek"
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(index);
          }}
        >
          <img src="./icons/ac_ic_delete.svg" alt="Hapus" />
        </button>
      </div>
    </div>
  );
}

export default EffectCard;
