import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';

function formatAmTime(ms, fps = 30) {
  if (isNaN(ms) || ms < 0) ms = 0;
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const hundredths = Math.floor((totalSec % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

export default function DefaultNavbar({
  onExit,
  onGroupUp,
  isInsideGroup = false,
  projectName: customProjectName,
  onProjectNameChange,
  playheadMs: customPlayheadMs,
  projectFps: customProjectFps,
  isBookmarkActive: customBookmarkActive,
  onToggleBookmark,
  onOpenSettings,
  onOpenExport
}) {
  const storeProjectName = useEditorStore((state) => state.projectName);
  const storeFps = useEditorStore((state) => state.projectFps);
  const storePlayheadMs = useEditorStore((state) => state.playheadMs);
  const activeScene = useEditorStore((state) => state.activeScene);
  const updateActiveScene = useEditorStore((state) => state.updateActiveScene);

  const projectName = customProjectName !== undefined ? customProjectName : storeProjectName;
  const projectFps = customProjectFps !== undefined ? customProjectFps : storeFps;
  const playheadMs = customPlayheadMs !== undefined ? customPlayheadMs : storePlayheadMs;

  const [titleValue, setTitleValue] = useState(projectName || 'Proyek Baru');

  useEffect(() => {
    setTitleValue(projectName || 'Proyek Baru');
  }, [projectName]);

  const bookmarks = activeScene?.bookmarks || [];
  const isNearBookmark = bookmarks.some((b) => Math.abs(b - playheadMs) < 60);
  const isBookmarkActive = customBookmarkActive !== undefined ? customBookmarkActive : isNearBookmark;

  const handleTitleSubmit = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setTitleValue(projectName || 'Proyek Baru');
      return;
    }
    if (onProjectNameChange) {
      onProjectNameChange(trimmed);
    } else {
      useEditorStore.setState({ projectName: trimmed });
      updateActiveScene((s) => ({ ...s, title: trimmed }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleToggleBookmark = () => {
    if (onToggleBookmark) {
      onToggleBookmark(playheadMs);
      return;
    }
    const currentBookmarks = activeScene?.bookmarks ? [...activeScene.bookmarks] : [];
    const existingIndex = currentBookmarks.findIndex((b) => Math.abs(b - playheadMs) < 60);
    if (existingIndex >= 0) {
      currentBookmarks.splice(existingIndex, 1);
    } else {
      currentBookmarks.push(playheadMs);
      currentBookmarks.sort((a, b) => a - b);
    }
    updateActiveScene((s) => ({ ...s, bookmarks: currentBookmarks }));
  };

  const timeStr = formatAmTime(playheadMs, projectFps);

  return (
    <div id="am-navbar-default">
      <button
        type="button"
        id="am-btn-exit"
        className="am-icon-btn"
        title="Keluar ke Proyek"
        onClick={onExit}
      >
        <img src="/icons/ic_exitproject.svg" alt="Exit" />
      </button>

      <button
        type="button"
        id="am-btn-group-up"
        className="am-icon-btn"
        style={{ display: isInsideGroup ? 'flex' : 'none' }}
        title="Keluar dari Grup"
        onClick={onGroupUp}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <input
        type="text"
        id="am-project-title"
        className="am-project-title-input"
        value={titleValue}
        onChange={(e) => setTitleValue(e.target.value)}
        onBlur={() => handleTitleSubmit(titleValue)}
        onKeyDown={handleKeyDown}
        placeholder="Nama Proyek"
      />

      <div
        id="am-nav-timecode"
        className={`am-nav-time-chip ${isBookmarkActive ? 'bookmark-active' : ''}`}
        title="Ketuk untuk tambah/hapus penanda (bookmark)"
        onClick={handleToggleBookmark}
      >
        <span id="am-nav-time">{timeStr}</span>
        <span id="am-nav-fps">{projectFps} FPS</span>
      </div>

      <button
        type="button"
        id="am-btn-settings"
        className="am-icon-btn"
        title="Setelan Proyek"
        onClick={onOpenSettings}
      >
        <img src="/icons/ac_ic_settings.svg" alt="Settings" />
      </button>

      <button
        type="button"
        id="am-btn-share"
        className="am-icon-btn"
        title="Ekspor Video"
        onClick={onOpenExport}
      >
        <img src="/icons/ac_ic_share.svg" alt="Share" />
      </button>
    </div>
  );
}
