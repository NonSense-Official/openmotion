import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { formatAmTime } from './timecode';

export default function ScrubbingBadge({
  isScrubbing: propIsScrubbing,
  playheadMs: propPlayheadMs,
  scrubStartMs: propScrubStartMs,
  projectFps: propFps,
  onToggleBookmark
}) {
  const storeIsScrubbing = useEditorStore((state) => state.isScrubbing);
  const storePlayheadMs = useEditorStore((state) => state.playheadMs);
  const storeScrubStartMs = useEditorStore((state) => state.scrubStartMs);
  const storeFps = useEditorStore((state) => state.projectFps);
  const storeToggleBookmark = useEditorStore((state) => state.toggleBookmark);

  const isScrubbing = propIsScrubbing !== undefined ? propIsScrubbing : storeIsScrubbing;
  const playheadMs = propPlayheadMs !== undefined ? propPlayheadMs : storePlayheadMs;
  const scrubStartMs = propScrubStartMs !== undefined ? propScrubStartMs : storeScrubStartMs;
  const fps = propFps !== undefined ? propFps : storeFps;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isScrubbing) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [isScrubbing]);

  const handleTimeClick = (e) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark();
    } else if (storeToggleBookmark) {
      storeToggleBookmark(playheadMs);
    }
  };

  const formattedTime = formatAmTime(playheadMs, fps);
  const diffSec = ((playheadMs || 0) - (scrubStartMs || 0)) / 1000;
  const sign = diffSec >= 0 ? '+' : '';
  const offsetText = `${sign}${diffSec.toFixed(2)}s`;

  return (
    <div id="am-infobar-overlay" className={visible ? 'on' : ''}>
      <div
        className="am-info-pill"
        id="am-infobar-time-pill"
        title="Ketuk waktu untuk tambah/hapus penanda (bookmark)"
        onClick={handleTimeClick}
      >
        <img src="/icons/ic_keyframe_pos.svg" alt="Time" />
        <span id="am-info-time">{formattedTime}</span>
      </div>
      <div className="am-info-pill">
        <img src="/icons/ic_offset_amount.svg" alt="Offset" />
        <span id="am-info-offset">{offsetText}</span>
      </div>
    </div>
  );
}
