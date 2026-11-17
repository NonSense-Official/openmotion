import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function ViewModeToolbar() {
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const showGrid = useEditorStore((state) => state.showGrid);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const pixelPreview = useEditorStore((state) => state.pixelPreview);
  const togglePixelPreview = useEditorStore((state) => state.togglePixelPreview);
  const isCameraViewActive = useEditorStore((state) => state.isCameraViewActive);
  const toggleCameraView = useEditorStore((state) => state.toggleCameraView);
  const isViewModeBarOpen = useEditorStore((state) => state.isViewModeBarOpen);
  const activeScene = useEditorStore((state) => state.activeScene);

  const hasCamera = Boolean(
    activeScene?.layers?.some((l) => l.tag === 'camera' || l.type === 'camera')
  );

  if (!isViewModeBarOpen) {
    return null;
  }

  const handleZoomIn = () => {
    setZoom(Math.min(400, zoom + 25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(25, zoom - 25));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  return (
    <aside id="am-viewmode-bar">
      <button
        id="am-btn-vm-pixel"
        type="button"
        className={`am-viewmode-btn ${pixelPreview ? 'active' : ''}`}
        title="Pratinjau Piksel"
        onClick={togglePixelPreview}
      >
        <img src="./icons/viewmode_pixel_selector.svg" alt="Pixel" />
      </button>

      <button
        id="am-btn-vm-grid"
        type="button"
        className={`am-viewmode-btn ${showGrid ? 'active' : ''}`}
        title="Kisi / Grid"
        onClick={toggleGrid}
      >
        <img
          src={
            showGrid
              ? './icons/ic_preview_mode_grid_on.svg'
              : './icons/ic_preview_mode_grid_off.svg'
          }
          alt="Grid"
        />
      </button>

      <button
        id="am-btn-vm-camera"
        type="button"
        className={`am-viewmode-btn ${isCameraViewActive && hasCamera ? 'active' : ''}`}
        title="Tampilan Kamera Aktif"
        disabled={!hasCamera}
        onClick={toggleCameraView}
      >
        <img
          src={
            isCameraViewActive && hasCamera
              ? './icons/ic_preview_mode_camera_on.svg'
              : './icons/ic_preview_mode_camera_off.svg'
          }
          alt="Camera View"
        />
      </button>

      <div id="am-canvas-zoom-holder">
        <button
          id="am-btn-vm-zoom-in"
          type="button"
          className="am-vm-zoom-btn"
          title="Perbesar Kanvas"
          onClick={handleZoomIn}
        >
          <img src="./icons/ic_viewmode_zoom_in.svg" alt="+" />
        </button>

        <span
          id="am-vm-zoom-text"
          title="Klik untuk reset zoom 100%"
          onClick={handleZoomReset}
        >
          {zoom}%
        </span>

        <button
          id="am-btn-vm-zoom-out"
          type="button"
          className="am-vm-zoom-btn"
          title="Perkecil Kanvas"
          onClick={handleZoomOut}
        >
          <img src="./icons/ic_viewmode_zoom_out.svg" alt="-" />
        </button>
      </div>
    </aside>
  );
}
