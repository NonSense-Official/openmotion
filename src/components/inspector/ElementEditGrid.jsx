import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { splitLayerAtTime } from '../../engine/scene/LayerActions';

export default function ElementEditGrid({ layer, onOpenSubpanel }) {
  const playheadMs = useEditorStore((state) => state.playheadMs);
  const activeScene = useEditorStore((state) => state.activeScene);
  const updateActiveScene = useEditorStore((state) => state.updateActiveScene);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);

  if (!layer) return null;

  const isCamera = layer.tag === 'camera' || layer.type === 'camera';
  const isText = layer.tag === 'text' || layer.type === 'text';

  const handleTrimLeft = () => {
    const end = layer.endTime != null ? layer.endTime : (activeScene?.totalTime || 5000);
    if (playheadMs < end - 10) {
      updateLayer(layer.id, { startTime: playheadMs });
    }
  };

  const handleTrimRight = () => {
    const start = layer.startTime || 0;
    if (playheadMs > start + 10) {
      updateLayer(layer.id, { endTime: playheadMs });
    }
  };

  const handleSplit = () => {
    if (!activeScene) return;
    const result = splitLayerAtTime(activeScene, layer.id, playheadMs);
    if (result) {
      updateActiveScene({ ...activeScene });
    }
  };

  const handleMoveTransform = () => {
    setActiveToolMode('movetransform');
  };

  const handleContextEdit = () => {
    if (isText) {
      onOpenSubpanel('textedit');
    } else {
      onOpenSubpanel('editshape');
    }
  };

  return (
    <div id="am-element-edit-panel">
      <div className="am-panel-row1">
        <div
          id="am-btn-speed"
          className="am-pbtn-standalone"
          title="Kecepatan"
          onClick={() => onOpenSubpanel('speed')}
        >
          <img src="./icons/ac_ic_speed.svg" alt="Speed" />
        </div>

        <div className="am-pbtn-group">
          <button
            type="button"
            id="am-btn-trim-left"
            className="am-pbtn-sub"
            title="Potong Kiri"
            onClick={handleTrimLeft}
          >
            <img src="./icons/ac_ic_trimleft.svg" alt="Trim Left" />
          </button>
          <button
            type="button"
            id="am-btn-split"
            className="am-pbtn-sub"
            title="Bagi di Playhead"
            onClick={handleSplit}
          >
            <img src="./icons/ac_ic_split.svg" alt="Split" />
          </button>
          <button
            type="button"
            id="am-btn-trim-right"
            className="am-pbtn-sub"
            title="Potong Kanan"
            onClick={handleTrimRight}
          >
            <img src="./icons/ac_ic_trimright.svg" alt="Trim Right" />
          </button>
        </div>

        <div
          id="am-btn-audio"
          className="am-pbtn-standalone"
          title="Audio"
          onClick={() => onOpenSubpanel('audio')}
        >
          <img src="./icons/ac_ic_audio.svg" alt="Audio" />
        </div>
      </div>

      <div className="am-panel-grid">
        <button
          type="button"
          id="am-btn-colorfill"
          className="am-grid-btn"
          onClick={() => onOpenSubpanel('colorfill')}
        >
          <img src="./icons/ac_ic_colorfill.svg" alt="Color & Fill" />
          <span>Warna & Isi</span>
        </button>

        <button
          type="button"
          id="am-btn-bordershadow"
          className="am-grid-btn"
          onClick={() => onOpenSubpanel('bordershadow')}
        >
          <img src="./icons/ac_ic_bordersh.svg" alt="Border & Shadow" />
          <span>Batas & Bayangan</span>
        </button>

        <button
          type="button"
          id="am-btn-blendopacity"
          className="am-grid-btn"
          onClick={() => onOpenSubpanel('blendopacity')}
        >
          <img src="./icons/ac_ic_blendop.svg" alt="Blending & Opacity" />
          <span>Blending & Opasitas</span>
        </button>

        <button
          type="button"
          id="am-btn-movetransform"
          className="am-grid-btn"
          onClick={handleMoveTransform}
        >
          <img src="./icons/ac_ic_movetransform.svg" alt="Move & Transform" />
          <span>Move & Transform</span>
        </button>

        <button
          type="button"
          id="am-btn-editcontext"
          className="am-grid-btn"
          onClick={handleContextEdit}
        >
          <img
            id="am-context-icon"
            src={isText ? './icons/ic_edit_text.svg' : './icons/ac_add_shape.svg'}
            alt="Edit"
          />
          <span id="am-context-text">{isText ? 'Edit Teks' : 'Edit Objek'}</span>
        </button>

        {isCamera && (
          <button
            type="button"
            id="am-btn-camera"
            className="am-grid-btn"
            title="Opsi Kamera"
            onClick={() => onOpenSubpanel('camera')}
          >
            <img src="./icons/ic_camera_options.svg" alt="Opsi Kamera" />
            <span>Opsi Kamera</span>
          </button>
        )}

        <button
          type="button"
          id="am-btn-effects"
          className="am-grid-btn"
          onClick={() => onOpenSubpanel('effects')}
        >
          <img src="./icons/ac_ic_effects.svg" alt="Effects" />
          <span>Efek</span>
        </button>
      </div>
    </div>
  );
}
