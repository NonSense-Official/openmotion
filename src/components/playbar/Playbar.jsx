import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { formatAmTime } from './timecode';
import TransportButtons from './TransportButtons';
import AudioLevelMeter from './AudioLevelMeter';
import ScrubbingBadge from './ScrubbingBadge';

export default function Playbar({
  audioGraph,
  onCopyPaste,
  onTogglePreviewMode,
  className = ''
}) {
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const projectFps = useEditorStore((state) => state.projectFps);
  const activeScene = useEditorStore((state) => state.activeScene);
  const toggleBookmark = useEditorStore((state) => state.toggleBookmark);

  const fps = projectFps || activeScene?.fps || 30;
  const tol = Math.max(25, 1000 / fps / 2);
  const isBookmarkActive = (activeScene?.bookmarks || []).some(
    (b) => Math.abs(b - playheadMs) <= tol
  );

  const formattedTime = formatAmTime(playheadMs, fps);

  const handleBookmarkToggle = () => {
    toggleBookmark?.(playheadMs);
  };

  return (
    <nav
      id="am-playbar-container"
      className={`am-playbar ${className}`.trim()}
    >
      <div
        id="am-nav-timecode"
        className={`am-nav-time-chip ${isBookmarkActive ? 'bookmark-active' : ''}`}
        title="Ketuk untuk tambah/hapus penanda (bookmark)"
        onClick={handleBookmarkToggle}
      >
        <span id="am-nav-time">{formattedTime}</span>
        <span id="am-nav-fps">{fps} FPS</span>
      </div>

      <TransportButtons
        onCopyPaste={onCopyPaste}
        onTogglePreviewMode={onTogglePreviewMode}
      />

      <AudioLevelMeter audioGraph={audioGraph} />

      <ScrubbingBadge />
    </nav>
  );
}
