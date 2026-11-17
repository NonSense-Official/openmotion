import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function TransportButtons({
  onCopyPaste,
  onTogglePreviewMode
}) {
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const togglePlay = useEditorStore((state) => state.togglePlay);
  const stepFrame = useEditorStore((state) => state.stepFrame);
  const toggleBookmark = useEditorStore((state) => state.toggleBookmark);
  const jumpPrev = useEditorStore((state) => state.jumpPrevKeyframeOrBookmark);
  const jumpNext = useEditorStore((state) => state.jumpNextKeyframeOrBookmark);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const undoStack = useEditorStore((state) => state.undoStack);
  const redoStack = useEditorStore((state) => state.redoStack);
  const activeScene = useEditorStore((state) => state.activeScene);
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const projectFps = useEditorStore((state) => state.projectFps);
  const isViewModeBarOpen = useEditorStore((state) => state.isViewModeBarOpen);
  const toggleViewModeBar = useEditorStore((state) => state.toggleViewModeBar);

  const fps = projectFps || activeScene?.fps || 30;
  const tol = Math.max(25, 1000 / fps / 2);
  const isBookmarkActive = (activeScene?.bookmarks || []).some(
    (b) => Math.abs(b - playheadMs) <= tol
  );

  const handlePrevFrame = (e) => {
    if (e.shiftKey || e.altKey) {
      stepFrame?.(-1);
    } else if (jumpPrev) {
      jumpPrev();
    } else {
      stepFrame?.(-1);
    }
  };

  const handleNextFrame = (e) => {
    if (e.shiftKey || e.altKey) {
      stepFrame?.(1);
    } else if (jumpNext) {
      jumpNext();
    } else {
      stepFrame?.(1);
    }
  };

  const handleBookmarkToggle = () => {
    toggleBookmark?.();
  };

  const handlePreviewModeClick = () => {
    if (onTogglePreviewMode) {
      onTogglePreviewMode();
    } else if (toggleViewModeBar) {
      toggleViewModeBar();
    }
  };

  return (
    <>
      <button
        type="button"
        id="am-btn-undo"
        className="am-playbar-btn"
        title="Urungkan"
        onClick={() => undo?.()}
        disabled={!undoStack?.length}
      >
        <img src="/icons/ic_edit_undo.svg" alt="Undo" />
      </button>

      <button
        type="button"
        id="am-btn-redo"
        className="am-playbar-btn"
        title="Ulangi"
        onClick={() => redo?.()}
        disabled={!redoStack?.length}
      >
        <img src="/icons/ic_edit_redo.svg" alt="Redo" />
      </button>

      <button
        type="button"
        id="am-btn-prevframe"
        className="am-playbar-btn"
        title="Lompat Keyframe / Bookmark Sebelumnya"
        onClick={handlePrevFrame}
      >
        <img src="/icons/ic_edit_prevframe.svg" alt="Prev Frame" />
      </button>

      <button
        type="button"
        id="am-btn-play"
        className="am-playbar-btn"
        title={isPlaying ? 'Jeda' : 'Putar'}
        onClick={() => togglePlay?.()}
      >
        <img
          id="am-play-icon"
          src={isPlaying ? '/icons/ac_ic_pause.svg' : '/icons/ac_ic_play.svg'}
          alt={isPlaying ? 'Pause' : 'Play'}
        />
      </button>

      <button
        type="button"
        id="am-btn-nextframe"
        className="am-playbar-btn"
        title="Lompat Keyframe / Bookmark Berikutnya"
        onClick={handleNextFrame}
      >
        <img src="/icons/ic_edit_nextframe.svg" alt="Next Frame" />
      </button>

      <button
        type="button"
        id="am-btn-copypaste"
        className="am-playbar-btn"
        title="Salin / Tempel Layer"
        onClick={onCopyPaste}
      >
        <img src="/icons/ic_layer_copy_paste_menu.svg" alt="Copy Paste" />
      </button>

      <button
        type="button"
        id="am-btn-bookmark"
        className={`am-playbar-btn ${isBookmarkActive ? 'active' : ''}`}
        title="Tandai Waktu (Bookmark)"
        onClick={handleBookmarkToggle}
      >
        <img src="/icons/ic_bookmark_add.svg" alt="Bookmark" />
      </button>

      <button
        type="button"
        id="am-btn-previewmode"
        className={`am-playbar-btn ${isViewModeBarOpen ? 'active' : ''}`}
        title="Panel Tampilan Pratinjau (ViewMode)"
        onClick={handlePreviewModeClick}
      >
        <img
          id="am-previewmode-icon"
          src={
            isViewModeBarOpen
              ? '/icons/ic_viewmode_panel_close.svg'
              : '/icons/ic_viewmode_panel_open.svg'
          }
          alt="ViewMode"
        />
      </button>
    </>
  );
}
