import React, { useRef, useState, useMemo } from 'react';
import { useEditorStore } from '../../store/editorStore';

const TYPE_COLORS = {
  image: { bg: '#1f6f9f', text: '#d6f0ff' },
  video: { bg: '#2d5fb0', text: '#e0ecff' },
  audio: { bg: '#2a7a4b', text: '#daf5e4' },
  text: { bg: '#7245a3', text: '#f3e8ff' },
  shape: { bg: '#3d4f9a', text: '#e6ebff' },
  group: { bg: '#8a6a1f', text: '#fff6db' },
  scene: { bg: '#8a6a1f', text: '#fff6db' },
  embedScene: { bg: '#8a6a1f', text: '#fff6db' }
};

function getLayerColor(layer) {
  if (layer.tag === 'audio') return TYPE_COLORS.audio;
  if (layer.tag === 'text') return TYPE_COLORS.text;
  if (layer.fillType === 'media') {
    return layer.fillVideo ? TYPE_COLORS.video : TYPE_COLORS.image;
  }
  if (layer.tag === 'group' || layer.tag === 'scene' || layer.tag === 'embedScene') {
    return TYPE_COLORS.group;
  }
  if (layer.shapeType || layer.points || layer.tag === 'shape') {
    return TYPE_COLORS.shape;
  }
  return { bg: '#242a3a', text: '#d9e0f0' };
}

function extractKeyframeTimes(layer) {
  const times = new Set();
  const start = layer.startTime || 0;
  const end = layer.endTime != null ? layer.endTime : start + 5000;
  const dur = Math.max(1, end - start);

  const checkProp = (prop) => {
    if (prop && Array.isArray(prop.kfs)) {
      prop.kfs.forEach((kf) => {
        if (typeof kf.t === 'number') {
          const tMs = kf.t <= 1.001 ? Math.round(start + kf.t * dur) : Math.round(kf.t);
          times.add(tMs);
        } else if (typeof kf.time === 'number') {
          times.add(Math.round(kf.time));
        }
      });
    }
  };

  if (layer.transform) {
    Object.values(layer.transform).forEach(checkProp);
  }

  if (Array.isArray(layer.effects)) {
    layer.effects.forEach((fx) => {
      if (Array.isArray(fx.params)) {
        fx.params.forEach(checkProp);
      }
    });
  }

  return [...times].sort((a, b) => a - b);
}

export default function TimelineBlock({
  layer,
  scale,
  totalTime,
  isSelected,
  isMulti,
  isHidden
}) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const selectLayer = useEditorStore((state) => state.selectLayer);

  const blockRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  const startTime = layer.startTime || 0;
  const endTime = layer.endTime != null ? layer.endTime : totalTime;
  const duration = Math.max(0, endTime - startTime);

  const left = Math.round(startTime * scale);
  const width = Math.max(4, Math.round(duration * scale));

  const colors = getLayerColor(layer);
  const keyframes = useMemo(() => extractKeyframeTimes(layer), [layer]);

  const handlePointerDownBody = (e) => {
    if (e.target.closest('.tl-edge')) return;
    if (e.button != null && e.button !== 0) return;

    selectLayer(layer.id, e.shiftKey || isMulti);
    e.currentTarget.setPointerCapture(e.pointerId);

    setDragState({
      mode: 'move',
      startX: e.clientX,
      origStart: startTime,
      origEnd: endTime
    });
  };

  const handlePointerDownTrimLeft = (e) => {
    e.stopPropagation();
    if (e.button != null && e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState({
      mode: 'trimLeft',
      startX: e.clientX,
      origStart: startTime,
      origEnd: endTime
    });
  };

  const handlePointerDownTrimRight = (e) => {
    e.stopPropagation();
    if (e.button != null && e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState({
      mode: 'trimRight',
      startX: e.clientX,
      origStart: startTime,
      origEnd: endTime
    });
  };

  const handlePointerMove = (e) => {
    if (!dragState) return;

    const dx = (e.clientX - dragState.startX) / scale;

    if (dragState.mode === 'move') {
      const dur = dragState.origEnd - dragState.origStart;
      const newStart = Math.max(0, Math.round(dragState.origStart + dx));
      const newEnd = newStart + dur;

      updateLayer(layer.id, { startTime: newStart, endTime: newEnd });
    } else if (dragState.mode === 'trimLeft') {
      const newStart = Math.max(0, Math.min(dragState.origEnd - 50, Math.round(dragState.origStart + dx)));
      updateLayer(layer.id, { startTime: newStart });
    } else if (dragState.mode === 'trimRight') {
      const newEnd = Math.max(dragState.origStart + 50, Math.min(totalTime, Math.round(dragState.origEnd + dx)));
      updateLayer(layer.id, { endTime: newEnd });
    }
  };

  const handlePointerUp = (e) => {
    if (dragState) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setDragState(null);
    }
  };

  const isAudio = layer.tag === 'audio';
  const durationSec = Math.max(0, duration / 1000);
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.floor(durationSec % 60);
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const classes = [
    'tl-block',
    isSelected ? 'tl-selected' : '',
    isHidden ? 'tl-hidden-block' : '',
    isAudio ? 'tl-audio-block' : '',
    isMulti ? 'om-multi' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={blockRef}
      className={classes}
      data-key={layer.id}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        background: colors.bg,
        color: colors.text
      }}
      onPointerDown={handlePointerDownBody}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <i
        className="tl-edge tl-edge-l"
        title="Geser awal layer"
        onPointerDown={handlePointerDownTrimLeft}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {isAudio ? (
        <>
          <div className="tl-audio-header">
            <span className="tl-audio-title">{layer.label || layer.id || 'Audio'}</span>
            <span className="tl-audio-dur">[{timeStr}]</span>
          </div>
          <svg
            className="tl-audio-waveform-svg"
            viewBox={`0 0 ${Math.max(50, width)} 28`}
            preserveAspectRatio="none"
          >
            <path
              d={`M0 14 Q ${Math.max(25, width / 4)} 4, ${Math.max(50, width / 2)} 14 T ${Math.max(50, width)} 14`}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </>
      ) : (
        width > 28 && <span>{layer.label || layer.id}</span>
      )}

      {keyframes.map((kfTime) => {
        if (kfTime < startTime || kfTime > endTime) return null;
        const kfX = Math.round((kfTime - startTime) * scale);
        const isEdge = kfTime <= startTime || kfTime >= endTime;
        return (
          <i
            key={kfTime}
            className={`tl-kf ${isEdge ? 'tl-kf-edge' : ''}`}
            style={{ left: `${kfX}px` }}
          />
        );
      })}

      <i
        className="tl-edge tl-edge-r"
        title="Geser akhir layer"
        onPointerDown={handlePointerDownTrimRight}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}
