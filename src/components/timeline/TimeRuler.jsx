import React, { useRef, useEffect, useState, useCallback } from 'react';

const STEP_INTERVALS = [100, 200, 500, 1000, 2000, 5000, 10000, 30000];
const LABEL_WIDTH = 112;

export default function TimeRuler({ scale, totalTime, playheadMs, bookmarks = [], onSeek }) {
  const rulerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const renderRulerCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = Math.max(160, Math.round(totalTime * scale));
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(26 * dpr);
    canvas.style.width = `${width}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, width, 26);

    let step = 30000;
    for (const interval of STEP_INTERVALS) {
      if (interval * scale >= 48) {
        step = interval;
        break;
      }
    }

    ctx.font = '10px ui-monospace, Menlo, monospace';
    ctx.textBaseline = 'top';

    for (let t = 0; t <= totalTime; t += step) {
      const x = Math.round(t * scale);
      ctx.fillStyle = '#343b4d';
      ctx.fillRect(x, 16, 1, 10);

      ctx.fillStyle = '#8c93a7';
      const label = t >= 60000
        ? `${Math.floor(t / 60000)}m${String(Math.round((t % 60000) / 1000)).padStart(2, '0')}s`
        : `${(t / 1000).toFixed(step < 1000 ? 1 : 0)}s`;

      ctx.fillText(label, x + 3, 4);
    }
  }, [scale, totalTime]);

  useEffect(() => {
    renderRulerCanvas();
  }, [renderRulerCanvas]);

  const getTimeFromEvent = (e) => {
    if (!rulerRef.current) return 0;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - LABEL_WIDTH;
    const time = x / scale;
    return Math.max(0, Math.min(totalTime, Math.round(time)));
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('.tl-corner')) return;
    setIsScrubbing(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const targetTime = getTimeFromEvent(e);
    if (onSeek) onSeek(targetTime);
  };

  const handlePointerMove = (e) => {
    if (!isScrubbing) return;
    const targetTime = getTimeFromEvent(e);
    if (onSeek) onSeek(targetTime);
  };

  const handlePointerUp = (e) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const playheadX = LABEL_WIDTH + Math.round(playheadMs * scale);

  return (
    <div
      id="timeline-ruler"
      ref={rulerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="tl-corner">Layer</div>

      <canvas id="timeline-ruler-canvas" ref={canvasRef} height={26} />

      {bookmarks.map((bm) => {
        const bmX = LABEL_WIDTH + Math.round(bm * scale);
        const sec = (bm / 1000).toFixed(2);
        return (
          <React.Fragment key={bm}>
            <div className="tl-bookmark" style={{ left: `${bmX}px` }} />
            <button
              type="button"
              className="tl-bm-flag"
              data-time={`${sec}s`}
              style={{ left: `${bmX}px` }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSeek) onSeek(bm);
              }}
            />
          </React.Fragment>
        );
      })}

      <div id="tl-cap" style={{ left: `${playheadX}px` }} />
    </div>
  );
}
