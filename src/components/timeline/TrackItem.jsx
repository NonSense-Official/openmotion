import React, { useState, memo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import TimelineBlock from './TimelineBlock';

function TrackItem({
  layer,
  index,
  scale,
  totalTime
}) {
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const selectLayer = useEditorStore((state) => state.selectLayer);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const setPlayheadMs = useEditorStore((state) => state.setPlayheadMs);

  const [isGroupOpen, setIsGroupOpen] = useState(false);

  const isSelected = selectedLayerIds.includes(layer.id);
  const isMulti = selectedLayerIds.length > 1 && isSelected;
  const isHidden = Boolean(layer.hidden);
  const isSubTrack = Boolean(layer.isSubTrack);
  const isGroup = layer.tag === 'group' || layer.tag === 'scene' || layer.tag === 'embedScene';

  const canvasWidth = Math.max(160, Math.round(totalTime * scale));

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    updateLayer(layer.id, { hidden: !isHidden });
  };

  const handleSelectTrack = (e) => {
    selectLayer(layer.id, e.shiftKey);
  };

  const handleToggleGroup = (e) => {
    e.stopPropagation();
    setIsGroupOpen((prev) => !prev);
  };

  const handleCanvasPointerDown = (e) => {
    if (e.target.closest('.tl-block') || e.target.closest('.tl-edge')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const targetTime = Math.max(0, Math.min(totalTime, Math.round(x / scale)));
    setPlayheadMs(targetTime);
  };

  const renderThumbnail = () => {
    if (layer.tag === 'audio') {
      return (
        <img
          src="./icons/ac_ic_audio.svg"
          alt="Audio"
          style={{ width: 18, height: 18, filter: 'brightness(0) invert(1) drop-shadow(0 0 2px #00ffa8)' }}
        />
      );
    }

    if (layer.fillType === 'media' && (layer.fillImage || layer.fillVideo)) {
      const src = layer.fillImage || layer.fillVideo;
      if (src && !src.startsWith('am:')) {
        return <img src={src} alt="Thumb" />;
      }
    }

    return <div className="tl-thumb-empty" style={{ width: '100%', height: '100%' }} />;
  };

  const labelClasses = [
    'tl-label',
    isHidden ? 'tl-hidden' : '',
    isSelected ? 'sel' : '',
    isSubTrack ? 'tl-sub-label' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`tl-track ${isSubTrack ? 'tl-sub-track' : ''}`}>
      <div
        className={labelClasses}
        data-key={layer.id}
        title={layer.label || layer.id || `Layer ${index + 1}`}
        onClick={handleSelectTrack}
      >
        <button
          type="button"
          className={`tl-eye ${isHidden ? 'off' : ''}`}
          aria-label={isHidden ? 'Tampilkan layer' : 'Sembunyikan layer'}
          onClick={handleToggleVisibility}
        >
          {isHidden ? (
            <svg className="i sm" viewBox="0 0 24 24">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg className="i sm" viewBox="0 0 24 24">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>

        {isGroup && (
          <button
            type="button"
            className={`tl-chev ${isGroupOpen ? '' : 'closed'}`}
            title={isGroupOpen ? 'Tutup isi grup' : 'Lihat isi grup'}
            aria-label={isGroupOpen ? 'Tutup isi grup' : 'Lihat isi grup'}
            onClick={handleToggleGroup}
          >
            {isGroupOpen ? '▾' : '▸'}
          </button>
        )}

        <span className="tl-thumb" title="Lihat isi layer di posisi ini">
          {renderThumbnail()}
        </span>

        <span>{layer.label || layer.id || `L${index + 1}`}</span>
      </div>

      <div
        className="tl-canvas-area"
        style={{ width: `${canvasWidth}px` }}
        onPointerDown={handleCanvasPointerDown}
      >
        <TimelineBlock
          layer={layer}
          scale={scale}
          totalTime={totalTime}
          isSelected={isSelected}
          isMulti={isMulti}
          isHidden={isHidden}
        />
      </div>
    </div>
  );
}

export default memo(TrackItem);
