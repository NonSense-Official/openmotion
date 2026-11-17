import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import InspectorEmptyState from './InspectorEmptyState';
import ElementEditGrid from './ElementEditGrid';
import ColorFillPanel from './subpanels/ColorFillPanel';
import BorderShadowPanel from './subpanels/BorderShadowPanel';
import BlendOpacityPanel from './subpanels/BlendOpacityPanel';
import AudioVolumePanel from './subpanels/AudioVolumePanel';
import SpeedControlPanel from './subpanels/SpeedControlPanel';
import CameraOptionsPanel from './subpanels/CameraOptionsPanel';

const SUBPANEL_TITLES = {
  colorfill: 'Warna & Isi',
  bordershadow: 'Batas & Bayangan',
  blendopacity: 'Blending & Opasitas',
  audio: 'Volume & Audio',
  speed: 'Kecepatan & Retiming',
  camera: 'Opsi Kamera',
  effects: 'Efek',
  textedit: 'Edit Teks',
  editshape: 'Edit Objek'
};

export default function InspectorDock({ onOpenAddModal, onOpenCurveEditor }) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const activeSubpanel = useEditorStore((state) => state.activeSubpanel);
  const setActiveSubpanel = useEditorStore((state) => state.setActiveSubpanel);

  const selectedLayer = selectedLayerIds.length === 1 && activeScene
    ? activeScene.layers?.find((l) => l.id === selectedLayerIds[0])
    : null;

  const handleCloseSelection = () => {
    setActiveSubpanel(null);
    clearSelection();
  };

  const handleBackToGrid = () => {
    setActiveSubpanel(null);
  };

  const handleOpenSubpanel = (subpanelKey) => {
    setActiveSubpanel(subpanelKey);
  };

  const tabTitle = selectedLayer
    ? selectedLayer.label || selectedLayer.id || 'Layer'
    : 'Inspector';

  const subpanelTitle = activeSubpanel ? SUBPANEL_TITLES[activeSubpanel] : null;

  const renderActiveSubpanel = () => {
    if (!selectedLayer || !activeSubpanel) return null;

    switch (activeSubpanel) {
      case 'colorfill':
        return (
          <ColorFillPanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
            onOpenCurve={onOpenCurveEditor}
          />
        );
      case 'bordershadow':
        return (
          <BorderShadowPanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
            onOpenCurve={onOpenCurveEditor}
          />
        );
      case 'blendopacity':
        return (
          <BlendOpacityPanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
            onOpenCurve={onOpenCurveEditor}
          />
        );
      case 'audio':
        return (
          <AudioVolumePanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
            onOpenCurve={onOpenCurveEditor}
          />
        );
      case 'speed':
        return (
          <SpeedControlPanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
          />
        );
      case 'camera':
        return (
          <CameraOptionsPanel
            layer={selectedLayer}
            onBack={handleBackToGrid}
          />
        );
      default:
        return (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#8c93a7', fontSize: '13px' }}>
            Panel {subpanelTitle || activeSubpanel} sedang dibuka
          </div>
        );
    }
  };

  return (
    <div id="am-dock-inspector" className="am-dock-inspector">
      <div className="am-dock-header">
        <div className="am-dock-tabs">
          <div id="am-dock-tab-inspector" className="am-dock-tab active">
            <img src="./icons/ac_ic_effects.svg" alt="Inspector" />
            <span id="am-dock-tab-title">{tabTitle}</span>
          </div>
          {subpanelTitle && (
            <div id="am-dock-subpanel-badge" className="am-dock-badge">
              {` › ${subpanelTitle}`}
            </div>
          )}
        </div>

        <div className="am-dock-actions">
          {activeSubpanel && (
            <button
              type="button"
              id="am-dock-btn-back"
              className="am-dock-btn"
              title="Kembali ke menu utama"
              onClick={handleBackToGrid}
            >
              <img
                src="./icons/ac_ic_back.svg"
                alt="Back"
                style={{ width: '12px', height: '12px', filter: 'invert(1)' }}
              />
              <span>Kembali</span>
            </button>
          )}

          {selectedLayer && (
            <button
              type="button"
              id="am-dock-btn-close"
              className="am-dock-btn"
              title="Tutup / Lepas Pilihan Layer"
              onClick={handleCloseSelection}
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>&times;</span>
            </button>
          )}
        </div>
      </div>

      <div className="am-dock-body">
        {!selectedLayer ? (
          <InspectorEmptyState />
        ) : activeSubpanel ? (
          <div id="am-subpanel-container" className="open">
            <div id="am-subpanel-content" className="am-subpanel-body">
              {renderActiveSubpanel()}
            </div>
          </div>
        ) : (
          <ElementEditGrid
            layer={selectedLayer}
            onOpenSubpanel={handleOpenSubpanel}
            onOpenAddModal={onOpenAddModal}
          />
        )}
      </div>
    </div>
  );
}
