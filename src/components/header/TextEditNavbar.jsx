import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';

const ALIGN_CYCLE = ['left', 'center', 'right', 'justify'];

export default function TextEditNavbar({
  layer: customLayer,
  textAlign: customTextAlign,
  onTextAlignChange,
  fontFamily: customFontFamily,
  onFontClick,
  fontSize: customFontSize,
  onSizeClick,
  onSpacingClick,
  color: customColor,
  onColorClick,
  onDone,
  onOk
}) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const setActiveToolMode = useEditorStore((state) => state.setActiveToolMode);

  const selectedLayer = customLayer || (
    selectedLayerIds.length === 1 && activeScene?.layers
      ? activeScene.layers.find((l) => l.id === selectedLayerIds[0])
      : null
  );

  const [localAlign, setLocalAlign] = useState(selectedLayer?.align || 'center');
  const [localFont] = useState(selectedLayer?.fontFamily || 'Roboto');
  const [localSize] = useState(selectedLayer?.fontSize || 28);
  const [localColor] = useState(selectedLayer?.color || '#ffffff');

  const textAlign = customTextAlign !== undefined ? customTextAlign : localAlign;
  const fontFamily = customFontFamily !== undefined ? customFontFamily : (selectedLayer?.fontFamily || localFont);
  const fontSize = customFontSize !== undefined ? customFontSize : (selectedLayer?.fontSize || localSize);
  const color = customColor !== undefined ? customColor : (selectedLayer?.color || localColor);

  const handleCycleAlign = () => {
    const currentIndex = ALIGN_CYCLE.indexOf(textAlign);
    const nextAlign = ALIGN_CYCLE[(currentIndex + 1) % ALIGN_CYCLE.length];
    if (onTextAlignChange) {
      onTextAlignChange(nextAlign);
    } else {
      setLocalAlign(nextAlign);
      if (selectedLayer) {
        updateLayer(selectedLayer.id, { align: nextAlign });
      }
    }
  };

  const handleDone = () => {
    if (onOk) {
      onOk();
    } else if (onDone) {
      onDone();
    } else {
      setActiveToolMode('select');
    }
  };

  return (
    <div id="am-navbar-textedit" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-text-align"
        className="am-textstyle-btn am-textstyle-btn-icon"
        title="Perataan Teks"
        onClick={handleCycleAlign}
      >
        <img
          id="am-img-text-align"
          src={`/icons/ac_ic_textalign_${textAlign}.svg`}
          alt="Align"
        />
      </button>

      <button
        type="button"
        id="am-btn-text-font"
        className="am-textstyle-btn am-textstyle-btn-spinner"
        title="Pilihan Fon"
        onClick={onFontClick}
      >
        <span id="am-text-font-label">{fontFamily}</span>
        <img
          src="/icons/ac_dropdown_indicator_solid.svg"
          className="am-text-dropdown-arrow"
          alt="▼"
        />
      </button>

      <button
        type="button"
        id="am-btn-text-size"
        className="am-textstyle-btn am-textstyle-btn-spinner am-textstyle-btn-size"
        title="Ukuran Fon"
        onClick={onSizeClick}
      >
        <span id="am-text-size-label">{fontSize} pt</span>
        <img
          src="/icons/ac_dropdown_indicator_solid.svg"
          className="am-text-dropdown-arrow"
          alt="▼"
        />
      </button>

      <button
        type="button"
        id="am-btn-text-spacing"
        className="am-textstyle-btn am-textstyle-btn-icon"
        title="Spasi Huruf & Baris"
        onClick={onSpacingClick}
      >
        <img src="/icons/ac_ic_text_spacing.svg" alt="Spacing" />
      </button>

      <button
        type="button"
        id="am-btn-text-color"
        className="am-textstyle-btn am-textstyle-btn-color"
        title="Warna Teks"
        onClick={onColorClick}
      >
        <span
          id="am-text-color-swatch"
          className="am-text-color-swatch-circle"
          style={{ backgroundColor: color }}
        />
      </button>

      <button
        type="button"
        id="am-btn-text-ok"
        className="am-icon-btn am-text-ok-btn"
        title="Selesai"
        onClick={handleDone}
      >
        <img src="/icons/ac_ic_ok_accept_checkmark.svg" alt="OK" />
      </button>
    </div>
  );
}
