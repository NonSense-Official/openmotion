import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function DrawingNavbar({
  title = 'Gambar Bebas',
  canUndo: customCanUndo,
  canRedo: customCanRedo,
  onUndo,
  onRedo,
  onDone,
  onBack
}) {
  const undoStack = useEditorStore((state) => state.undoStack);
  const redoStack = useEditorStore((state) => state.redoStack);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);

  const canUndo = customCanUndo !== undefined ? customCanUndo : undoStack.length > 0;
  const canRedo = customCanRedo !== undefined ? customCanRedo : redoStack.length > 0;

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    } else {
      undo();
    }
  };

  const handleRedo = () => {
    if (onRedo) {
      onRedo();
    } else {
      redo();
    }
  };

  const handleDone = () => {
    if (onDone) {
      onDone();
    } else if (onBack) {
      onBack();
    } else {
      setActiveToolMode('select');
    }
  };

  return (
    <div id="am-navbar-drawing" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-drawing-back"
        className="am-icon-btn"
        title="Kembali / Selesai"
        onClick={handleDone}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <span id="am-drawing-title" className="am-actionbar-title">
        {title}
      </span>

      <div className="am-drawing-actionbar-tools">
        <button
          type="button"
          id="am-btn-draw-undo"
          className="am-icon-btn"
          title="Urungkan"
          disabled={!canUndo}
          onClick={handleUndo}
        >
          <img src="/icons/ic_edit_undo.svg" alt="Undo" />
        </button>

        <button
          type="button"
          id="am-btn-draw-redo"
          className="am-icon-btn"
          title="Ulangi"
          disabled={!canRedo}
          onClick={handleRedo}
        >
          <img src="/icons/ic_edit_redo.svg" alt="Redo" />
        </button>

        <button
          type="button"
          id="am-btn-draw-done"
          className="am-icon-btn active"
          title="Selesai"
          onClick={handleDone}
        >
          <img src="/icons/ic_selected_layer_checkmark.svg" alt="Done" />
        </button>
      </div>
    </div>
  );
}
