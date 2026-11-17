import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import TimeRuler from './TimeRuler';
import TrackList from './TrackList';
import MultiSelectActions from './MultiSelectActions';
import AddLayerFab from './AddLayerFab';

const LABEL_WIDTH = 112;
const BASE_PX_PER_MS = 0.05;

export default function TimelineDock({ onOpenAddModal }) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const setPlayheadMs = useEditorStore((state) => state.setPlayheadMs);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);

  const [zoomFactor, setZoomFactor] = useState(1.0);
  const bodyRef = useRef(null);

  const totalTime = activeScene?.totalTime || 5000;
  const layers = activeScene?.layers || [];
  const bookmarks = activeScene?.bookmarks || [];

  const scale = BASE_PX_PER_MS * zoomFactor;
  const tracksWidth = Math.max(160, Math.round(totalTime * scale));
  const totalWidth = LABEL_WIDTH + tracksWidth;
  const playheadLeft = LABEL_WIDTH + Math.round(playheadMs * scale);

  const isMultiSelect = selectedLayerIds.length > 1;

  useEffect(() => {
    if (!isPlaying || !bodyRef.current) return;

    const body = bodyRef.current;
    const viewLeft = body.scrollLeft;
    const viewRight = viewLeft + body.clientWidth;

    if (playheadLeft > viewRight - 40 || playheadLeft < viewLeft + LABEL_WIDTH) {
      body.scrollLeft = Math.max(0, playheadLeft - LABEL_WIDTH - 60);
    }
  }, [isPlaying, playheadLeft]);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoomFactor((prev) => Math.max(0.2, Math.min(10.0, prev * delta)));
    }
  };

  return (
    <div id="am-timeline-view" className="am-timeline-view">
      <div id="am-timeline-mount">
        <div id="timeline-wrap">
          <div id="timeline-body" ref={bodyRef} data-scale={scale} onWheel={handleWheel}>
            <div id="timeline-inner" style={{ width: `${totalWidth}px` }}>
              <TimeRuler
                scale={scale}
                totalTime={totalTime}
                playheadMs={playheadMs}
                bookmarks={bookmarks}
                onSeek={setPlayheadMs}
              />

              <TrackList
                layers={layers}
                scale={scale}
                totalTime={totalTime}
              />

              <div id="tl-playhead" style={{ left: `${playheadLeft}px` }} />
            </div>
          </div>
        </div>
      </div>

      <button
        id="am-timeline-overflow-btn"
        title="Menu Timeline"
        type="button"
      >
        <img src="./icons/ic_more_vert_white_24dp.svg" alt="Menu" />
      </button>

      {isMultiSelect ? (
        <MultiSelectActions
          selectedLayerIds={selectedLayerIds}
          playheadMs={playheadMs}
          totalTime={totalTime}
        />
      ) : (
        <AddLayerFab onClick={onOpenAddModal} />
      )}
    </div>
  );
}
