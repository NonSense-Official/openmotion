import React, { useState, useRef, useEffect } from 'react';
import BrushControls from './BrushControls';

export function FreehandDrawing({ isOpen, existingLayer, onFinish, onClose }) {
  const [tool, setTool] = useState('pen');
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [smoothing, setSmoothing] = useState(35);
  const [color, setColor] = useState('#00ffa8');
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef([]);

  useEffect(() => {
    if (existingLayer && Array.isArray(existingLayer.strokes)) {
      setStrokes(existingLayer.strokes);
    }
  }, [existingLayer]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of strokes) {
      if (!s.points || s.points.length === 0) continue;
      ctx.save();
      ctx.strokeStyle = s.tool === 'eraser' ? '#141620' : s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      if (s.tool === 'fill') {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentPointsRef.current = [{ x, y }];

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentPointsRef.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pts = currentPointsRef.current;
    if (pts.length > 1) {
      ctx.save();
      ctx.strokeStyle = tool === 'eraser' ? '#141620' : color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (currentPointsRef.current.length > 0) {
      const newStroke = {
        tool,
        color,
        width: strokeWidth,
        smoothing,
        points: [...currentPointsRef.current]
      };
      setStrokes((prev) => [...prev, newStroke]);
      setRedoStack([]);
      currentPointsRef.current = [];
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setStrokes((prev) => [...prev, last]);
  };

  const handleDone = () => {
    if (strokes.length === 0) {
      onClose && onClose();
      return;
    }

    const newLayer = {
      id: existingLayer ? existingLayer.id : `drawing_${Date.now()}`,
      name: 'Gambar Bebas',
      tag: 'drawing',
      type: 'drawing',
      strokes: [...strokes],
      transform: existingLayer ? existingLayer.transform : {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [1, 1], kfs: [] },
        rotation: { value: [0], kfs: [] }
      }
    };

    onFinish && onFinish(newLayer);
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="am-drawing-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(9, 10, 14, 0.85)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Top Navbar */}
      <header
        id="am-navbar-drawing"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#191b27',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <button
          type="button"
          className="am-icon-btn"
          title="Batal"
          onClick={onClose}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 20, height: 20 }} />
        </button>

        <span id="am-drawing-title" className="am-actionbar-title" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
          Gambar Bebas
        </span>

        <div className="am-drawing-actionbar-tools" style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            id="am-btn-draw-undo"
            className="am-icon-btn"
            title="Urungkan"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', opacity: strokes.length ? 1 : 0.4 }}
          >
            <img src="./icons/ic_edit_undo.svg" alt="Undo" style={{ width: 20, height: 20 }} />
          </button>

          <button
            type="button"
            id="am-btn-draw-redo"
            className="am-icon-btn"
            title="Ulangi"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', opacity: redoStack.length ? 1 : 0.4 }}
          >
            <img src="./icons/ic_edit_redo.svg" alt="Redo" style={{ width: 20, height: 20 }} />
          </button>

          <button
            type="button"
            id="am-btn-draw-done"
            className="am-icon-btn active"
            title="Selesai"
            onClick={handleDone}
            style={{ background: '#00ffa8', border: 0, borderRadius: 6, cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
          >
            <img src="./icons/ic_selected_layer_checkmark.svg" alt="Done" style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </header>

      {/* Main Drawing Stage Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth || 800}
          height={window.innerHeight ? window.innerHeight - 200 : 500}
          style={{
            touchAction: 'none',
            cursor: 'crosshair',
            width: '100%',
            height: '100%'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      {/* Bottom Brush Controls */}
      <BrushControls
        currentTool={tool}
        onSelectTool={setTool}
        strokeWidth={strokeWidth}
        onChangeStrokeWidth={setStrokeWidth}
        smoothing={smoothing}
        onChangeSmoothing={setSmoothing}
        color={color}
        onChangeColor={setColor}
      />
    </div>
  );
}

export default FreehandDrawing;
