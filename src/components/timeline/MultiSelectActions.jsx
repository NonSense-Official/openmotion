import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function MultiSelectActions({ selectedLayerIds, playheadMs, totalTime }) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const updateActiveScene = useEditorStore((state) => state.updateActiveScene);

  const selectedSet = new Set(selectedLayerIds);

  const handleTrimLeft = () => {
    if (!activeScene || !selectedLayerIds.length) return;
    updateActiveScene((prev) => {
      const nextLayers = (prev.layers || []).map((layer) => {
        if (!selectedSet.has(layer.id)) return layer;
        const start = layer.startTime || 0;
        const end = layer.endTime != null ? layer.endTime : totalTime;
        if (playheadMs > start && playheadMs < end) {
          return { ...layer, startTime: playheadMs };
        }
        return layer;
      });
      return { ...prev, layers: nextLayers };
    });
  };

  const handleSplit = () => {
    if (!activeScene || !selectedLayerIds.length) return;
    updateActiveScene((prev) => {
      const nextLayers = [];
      const newSelectedIds = [...selectedLayerIds];

      (prev.layers || []).forEach((layer) => {
        if (!selectedSet.has(layer.id)) {
          nextLayers.push(layer);
          return;
        }

        const start = layer.startTime || 0;
        const end = layer.endTime != null ? layer.endTime : totalTime;

        if (playheadMs > start && playheadMs < end) {
          const splitLayerId = `${layer.id}_split_${Math.random().toString(36).substring(2, 7)}`;
          const part1 = { ...layer, endTime: playheadMs };
          const part2 = {
            ...layer,
            id: splitLayerId,
            startTime: playheadMs,
            label: `${layer.label || 'Layer'} (2)`
          };
          nextLayers.push(part1, part2);
          newSelectedIds.push(splitLayerId);
        } else {
          nextLayers.push(layer);
        }
      });

      return { ...prev, layers: nextLayers };
    });
  };

  const handleTrimRight = () => {
    if (!activeScene || !selectedLayerIds.length) return;
    updateActiveScene((prev) => {
      const nextLayers = (prev.layers || []).map((layer) => {
        if (!selectedSet.has(layer.id)) return layer;
        const start = layer.startTime || 0;
        const end = layer.endTime != null ? layer.endTime : totalTime;
        if (playheadMs > start && playheadMs < end) {
          return { ...layer, endTime: playheadMs };
        }
        return layer;
      });
      return { ...prev, layers: nextLayers };
    });
  };

  const handleAlignLeft = () => {
    if (!activeScene || !selectedLayerIds.length) return;
    const selectedLayers = (activeScene.layers || []).filter((l) => selectedSet.has(l.id));
    if (!selectedLayers.length) return;

    const minStart = Math.min(...selectedLayers.map((l) => l.startTime || 0));

    updateActiveScene((prev) => {
      const nextLayers = (prev.layers || []).map((layer) => {
        if (!selectedSet.has(layer.id)) return layer;
        const dur = (layer.endTime != null ? layer.endTime : totalTime) - (layer.startTime || 0);
        return {
          ...layer,
          startTime: minStart,
          endTime: minStart + dur
        };
      });
      return { ...prev, layers: nextLayers };
    });
  };

  const handleAlignRight = () => {
    if (!activeScene || !selectedLayerIds.length) return;
    const selectedLayers = (activeScene.layers || []).filter((l) => selectedSet.has(l.id));
    if (!selectedLayers.length) return;

    const maxEnd = Math.max(...selectedLayers.map((l) => (l.endTime != null ? l.endTime : totalTime)));

    updateActiveScene((prev) => {
      const nextLayers = (prev.layers || []).map((layer) => {
        if (!selectedSet.has(layer.id)) return layer;
        const dur = (layer.endTime != null ? layer.endTime : totalTime) - (layer.startTime || 0);
        return {
          ...layer,
          startTime: Math.max(0, maxEnd - dur),
          endTime: maxEnd
        };
      });
      return { ...prev, layers: nextLayers };
    });
  };

  const handleDistribute = () => {
    if (!activeScene || selectedLayerIds.length < 3) return;
    const selectedLayers = (activeScene.layers || []).filter((l) => selectedSet.has(l.id));
    if (selectedLayers.length < 3) return;

    const sorted = [...selectedLayers].sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
    const firstStart = sorted[0].startTime || 0;
    const lastStart = sorted[sorted.length - 1].startTime || 0;
    const step = (lastStart - firstStart) / (sorted.length - 1);

    const newStartMap = new Map();
    sorted.forEach((layer, idx) => {
      newStartMap.set(layer.id, Math.round(firstStart + idx * step));
    });

    updateActiveScene((prev) => {
      const nextLayers = (prev.layers || []).map((layer) => {
        if (!newStartMap.has(layer.id)) return layer;
        const newStart = newStartMap.get(layer.id);
        const dur = (layer.endTime != null ? layer.endTime : totalTime) - (layer.startTime || 0);
        return {
          ...layer,
          startTime: newStart,
          endTime: newStart + dur
        };
      });
      return { ...prev, layers: nextLayers };
    });
  };

  return (
    <div id="am-select-bottom-bar" className="am-select-bottom-bar" style={{ display: 'flex' }}>
      <div className="am-sel-bottom-left">
        <button
          id="am-btn-multi-trim-left"
          className="am-sel-bottom-btn"
          title="Potong Kiri (Multi)"
          onClick={handleTrimLeft}
        >
          <img src="./icons/ac_ic_trimleft.svg" alt="Trim Left" />
        </button>
        <button
          id="am-btn-multi-split"
          className="am-sel-bottom-btn"
          title="Bagi di Playhead (Multi)"
          onClick={handleSplit}
        >
          <img src="./icons/ac_ic_split.svg" alt="Split" />
        </button>
        <button
          id="am-btn-multi-trim-right"
          className="am-sel-bottom-btn"
          title="Potong Kanan (Multi)"
          onClick={handleTrimRight}
        >
          <img src="./icons/ac_ic_trimright.svg" alt="Trim Right" />
        </button>
      </div>

      <div className="am-sel-bottom-right">
        <button
          id="am-btn-align-left-tl"
          className="am-sel-bottom-btn"
          title="Rata Kiri Timeline"
          onClick={handleAlignLeft}
        >
          <img src="./icons/ic_align_left_timeline.svg" alt="Align Left Timeline" />
        </button>
        <button
          id="am-btn-align-distrib-tl"
          className="am-sel-bottom-btn"
          title="Distribusi Timeline"
          onClick={handleDistribute}
        >
          <img src="./icons/ic_align_distribute_timeline.svg" alt="Distribute Timeline" />
        </button>
        <button
          id="am-btn-align-right-tl"
          className="am-sel-bottom-btn"
          title="Rata Kanan Timeline"
          onClick={handleAlignRight}
        >
          <img src="./icons/ic_align_right_timeline.svg" alt="Align Right Timeline" />
        </button>
      </div>
    </div>
  );
}
