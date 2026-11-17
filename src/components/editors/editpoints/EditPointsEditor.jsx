import React, { useState } from 'react';
import VertexTrackpad from './VertexTrackpad';

const DEFAULT_POINTS = [
  { x: -50, y: -50, type: 'sharp' },
  { x: 50, y: -50, type: 'sharp' },
  { x: 50, y: 50, type: 'sharp' },
  { x: -50, y: 50, type: 'sharp' }
];

export function EditPointsEditor({ layer, onUpdateLayer, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isClosed, setIsClosed] = useState(true);

  if (!layer) return null;

  const points = (layer.path && Array.isArray(layer.path.points) && layer.path.points.length > 0)
    ? layer.path.points
    : DEFAULT_POINTS;

  const safeIdx = Math.min(activeIdx, Math.max(0, points.length - 1));
  const activePt = points[safeIdx] || { x: 0, y: 0, type: 'sharp' };

  const handleDelta = (dx, dy) => {
    const nextPoints = points.map((p, i) => {
      if (i !== safeIdx) return p;
      return {
        ...p,
        x: Math.round(p.x + dx),
        y: Math.round(p.y + dy)
      };
    });

    onUpdateLayer && onUpdateLayer({
      ...layer,
      path: {
        ...(layer.path || {}),
        points: nextPoints,
        isClosed
      }
    });
  };

  const handleToggleCurveType = () => {
    const nextType = activePt.type === 'curved' ? 'sharp' : 'curved';
    const nextPoints = points.map((p, i) => {
      if (i !== safeIdx) return p;
      return { ...p, type: nextType };
    });

    onUpdateLayer && onUpdateLayer({
      ...layer,
      path: {
        ...(layer.path || {}),
        points: nextPoints,
        isClosed
      }
    });
  };

  const handleToggleOpenClose = () => {
    const nextClosed = !isClosed;
    setIsClosed(nextClosed);
    onUpdateLayer && onUpdateLayer({
      ...layer,
      path: {
        ...(layer.path || {}),
        points,
        isClosed: nextClosed
      }
    });
  };

  const handleAddOrDeletePoint = () => {
    if (points.length > 3) {
      const nextPoints = points.filter((_, i) => i !== safeIdx);
      setActiveIdx(Math.max(0, safeIdx - 1));
      onUpdateLayer && onUpdateLayer({
        ...layer,
        path: {
          ...(layer.path || {}),
          points: nextPoints,
          isClosed
        }
      });
    } else {
      const prev = points[safeIdx];
      const newPt = { x: prev.x + 20, y: prev.y + 20, type: 'sharp' };
      const nextPoints = [...points];
      nextPoints.splice(safeIdx + 1, 0, newPt);
      setActiveIdx(safeIdx + 1);
      onUpdateLayer && onUpdateLayer({
        ...layer,
        path: {
          ...(layer.path || {}),
          points: nextPoints,
          isClosed
        }
      });
    }
  };

  const handlePrevContour = () => {
    setActiveIdx((safeIdx - 1 + points.length) % points.length);
  };

  const handleNextContour = () => {
    setActiveIdx((safeIdx + 1) % points.length);
  };

  return (
    <div
      id="am-editpoints-panel"
      className="am-ep-root open"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: 220,
        backgroundColor: '#191b27',
        color: '#fff',
        userSelect: 'none'
      }}
    >
      {/* Left Toolbar */}
      <div
        className="am-ep-toolbar-left"
        style={{
          width: 54,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          gap: 10,
          borderRight: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <button
          type="button"
          id="am-ep-btn-back"
          className="am-ep-tool-btn"
          title="Kembali / Selesai"
          onClick={onClose}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 20, height: 20 }} />
        </button>

        <button
          type="button"
          id="am-ep-btn-openclose"
          className="am-ep-tool-btn"
          title={isClosed ? 'Buka Garis Kontur' : 'Tutup Garis Kontur'}
          onClick={handleToggleOpenClose}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img
            id="am-ep-img-openclose"
            src={isClosed ? './icons/ac_ic_path_close.svg' : './icons/ac_ic_path_open.svg'}
            alt="Open/Close"
            style={{ width: 20, height: 20 }}
          />
        </button>

        <button
          type="button"
          id="am-ep-btn-curvetype"
          className="am-ep-tool-btn"
          title="Tipe Kelengkungan Titik"
          onClick={handleToggleCurveType}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img
            id="am-ep-img-curvetype"
            src={activePt.type === 'curved' ? './icons/ac_ic_vertex_curved.svg' : './icons/ac_ic_vertex_sharp.svg'}
            alt="Curve Type"
            style={{ width: 20, height: 20 }}
          />
        </button>

        <button
          type="button"
          id="am-ep-btn-adddelpoint"
          className="am-ep-tool-btn"
          title={points.length > 3 ? 'Hapus Titik' : 'Tambah Titik'}
          onClick={handleAddOrDeletePoint}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img
            id="am-ep-img-adddelpoint"
            src={points.length > 3 ? './icons/ac_ic_delete_point_filled.svg' : './icons/ac_ic_add_point_filled.svg'}
            alt="Add/Del Point"
            style={{ width: 20, height: 20 }}
          />
        </button>
      </div>

      {/* Center Trackpad */}
      <div
        className="am-ep-trackpad-col"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          gap: 10
        }}
      >
        <VertexTrackpad
          onDelta={handleDelta}
          activePointIndex={safeIdx}
          totalPoints={points.length}
        />

        {/* Bottom Contour Navigator */}
        <div
          className="am-ep-contour-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 6,
            padding: '4px 8px'
          }}
        >
          <button
            type="button"
            id="am-ep-btn-prev-contour"
            className="am-ep-contour-btn"
            title="Titik Sebelumnya"
            onClick={handlePrevContour}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          >
            <img src="./icons/ic_prev_element.svg" alt="Prev" style={{ width: 16, height: 16 }} />
          </button>
          <span id="am-ep-contour-info" className="am-ep-contour-info" style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
            Titik {safeIdx + 1} / {points.length}
          </span>
          <button
            type="button"
            id="am-ep-btn-next-contour"
            className="am-ep-contour-btn"
            title="Titik Berikutnya"
            onClick={handleNextContour}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          >
            <img src="./icons/ic_next_element.svg" alt="Next" style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Right Outline Scroller */}
      <div
        className="am-ep-scroller-col"
        style={{
          width: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          gap: 6,
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          overflowY: 'auto'
        }}
      >
        <div id="am-ep-outline-scroller" className="am-ep-scroller" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {points.map((_, i) => (
            <div
              key={i}
              className={`am-ep-point-node ${i === safeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                background: i === safeIdx ? '#00ffa8' : 'rgba(255,255,255,0.1)',
                color: i === safeIdx ? '#090a0e' : '#fff'
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditPointsEditor;
