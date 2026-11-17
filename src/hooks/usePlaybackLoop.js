import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { formatAmTime } from '../components/playbar/timecode';

function resolveAudioUrl(scene) {
  if (!scene) return '/preset/Beraksi.mp3';
  const audioLayer = (scene.layers || []).find((l) => l.tag === 'audio' && l.src);
  const src = audioLayer?.src || scene.audio?.[0]?.src;
  if (!src) return '/preset/Beraksi.mp3';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:') || src.startsWith('data:')) {
    return src;
  }
  let clean = src;
  if (clean.startsWith('amproj:')) clean = clean.slice(7);
  if (clean.startsWith('am:')) clean = clean.slice(3);
  clean = clean.replace(/^[./\\]+/, '');
  const pid = scene.packageId || scene.id;
  if (pid) {
    return `/api/media?pid=${encodeURIComponent(pid)}&name=${encodeURIComponent(clean)}`;
  }
  return `/preset/${encodeURIComponent(clean)}`;
}

export function usePlaybackLoop() {
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const activeScene = useEditorStore((state) => state.activeScene);
  const projectFps = useEditorStore((state) => state.projectFps);
  const renderer = useEditorStore((state) => state.renderer);
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const setPlayheadMs = useEditorStore((state) => state.setPlayheadMs);
  const setIsPlaying = useEditorStore((state) => state.setIsPlaying);
  const stepFrame = useEditorStore((state) => state.stepFrame);

  const reqIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const currentMsRef = useRef(playheadMs);
  const lastCommitTimeRef = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    currentMsRef.current = playheadMs;
    if (audioRef.current && !isPlaying) {
      try {
        const targetSec = playheadMs / 1000;
        if (Math.abs(audioRef.current.currentTime - targetSec) > 0.05) {
          audioRef.current.currentTime = targetSec;
        }
      } catch {}
    }
  }, [playheadMs, isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = resolveAudioUrl(activeScene);
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.src = url;

    const handleError = () => {
      if (!audio._didFallback) {
        audio._didFallback = true;
        audio.src = '/preset/Beraksi.mp3';
      }
    };
    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [activeScene?.id, activeScene?.audio, activeScene?.layers]);

  useEffect(() => {
    if (!renderer) return;
    if (isPlaying) {
      renderer.playMedia?.();
      if (audioRef.current) {
        audioRef.current.currentTime = currentMsRef.current / 1000;
        audioRef.current.play().catch(() => {});
      }
    } else {
      renderer.pauseMedia?.();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, renderer]);

  useEffect(() => {
    if (!isPlaying) {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = 0;
      }
      setPlayheadMs(currentMsRef.current);
      return;
    }

    lastTimeRef.current = performance.now();
    lastCommitTimeRef.current = performance.now();

    const loop = (now) => {
      const state = useEditorStore.getState();
      if (!state.isPlaying) return;

      const totalTime = state.activeScene?.totalTime || 5000;
      const fps = state.projectFps || state.activeScene?.fps || 30;
      const budgetMs = 1000 / fps;

      const elapsed = now - lastTimeRef.current;
      if (elapsed >= budgetMs - 2) {
        lastTimeRef.current = now;
        const deltaMs = Math.min(100, elapsed);

        let nextMs = currentMsRef.current + deltaMs;
        if (audioRef.current && !audioRef.current.paused && audioRef.current.readyState >= 2) {
          const audioMs = audioRef.current.currentTime * 1000;
          if (Math.abs(audioMs - nextMs) < 250) {
            nextMs = audioMs;
          }
        }

        if (nextMs >= totalTime) {
          nextMs = 0;
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }
        currentMsRef.current = nextMs;

        if (state.renderer) {
          state.renderer.renderAt(nextMs);
        }

        const tlBody = document.getElementById('timeline-body');
        const scale = tlBody?.dataset?.scale ? parseFloat(tlBody.dataset.scale) : 0.05;
        const playheadLeft = 112 + Math.round(nextMs * scale);

        const tlPlayhead = document.getElementById('tl-playhead');
        if (tlPlayhead) tlPlayhead.style.left = `${playheadLeft}px`;

        const tlCap = document.getElementById('tl-cap');
        if (tlCap) tlCap.style.left = `${playheadLeft}px`;

        const timeStr = formatAmTime(nextMs, fps);
        const navTime = document.getElementById('am-nav-time');
        if (navTime) navTime.textContent = timeStr;

        const capBadge = document.getElementById('tl-cap-badge');
        if (capBadge) capBadge.textContent = timeStr;

        if (tlBody) {
          const viewLeft = tlBody.scrollLeft;
          const viewRight = viewLeft + tlBody.clientWidth;
          if (playheadLeft > viewRight - 40 || playheadLeft < viewLeft + 112) {
            tlBody.scrollLeft = Math.max(0, playheadLeft - 112 - 60);
          }
        }

        if (now - lastCommitTimeRef.current >= 100) {
          lastCommitTimeRef.current = now;
          state.setPlayheadMs(nextMs);
        }
      }

      reqIdRef.current = requestAnimationFrame(loop);
    };

    reqIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = 0;
      }
    };
  }, [isPlaying, setPlayheadMs]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tgt = e.target;
      const tag = tgt && tgt.tagName;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag) || tgt?.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const state = useEditorStore.getState();
        state.togglePlay?.();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrame?.(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrame?.(1);
      } else if (e.code === 'KeyK') {
        setIsPlaying(false);
      } else if (e.code === 'KeyL') {
        setIsPlaying(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsPlaying, stepFrame]);
}
