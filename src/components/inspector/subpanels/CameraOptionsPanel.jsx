import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { SWATCHES } from './colorUtils';

export default function CameraOptionsPanel({ layer, onBack }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);

  const [activeTab, setActiveTab] = useState('view');

  const isPersp = layer.cameraType !== 'orthographic';
  const curFov = Math.round(layer.fov || 60);
  const curZoom = Math.round(layer.cameraZoom || 500);

  const fb = layer.focusBlur || { enabled: false, distance: 500, depthOfField: 100, strength: 0.5 };
  const fg = layer.fog || { enabled: false, color: '#ffffff', nearZ: 0, farZ: 1500 };
  const fgColor = typeof fg.color === 'string' ? fg.color : '#ffffff';

  const updateCameraParam = (patch) => {
    updateLayer(layer.id, patch);
  };

  const toggleCameraType = () => {
    const nextType = isPersp ? 'orthographic' : 'perspective';
    updateCameraParam({ cameraType: nextType });
  };

  const updateFocusBlur = (patch) => {
    const nextFb = { ...fb, ...patch };
    updateCameraParam({ focusBlur: nextFb });
  };

  const updateFog = (patch) => {
    const nextFg = { ...fg, ...patch };
    updateCameraParam({ fog: nextFg });
  };

  return (
    <div className="am-camera-options-container">
      <div className="am-camera-tabs">
        <button
          type="button"
          className={`am-camera-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
          title="Tampilan Kamera"
        >
          <img src="./icons/ic_camera.svg" alt="View" />
          <span>Tampilan</span>
        </button>
        <button
          type="button"
          className={`am-camera-tab-btn ${activeTab === 'focus_blur' ? 'active' : ''}`}
          onClick={() => setActiveTab('focus_blur')}
          title="Fokus Buram"
        >
          <img src="./icons/ic_cameraoption_focusblur.svg" alt="Focus Blur" />
          <span>Fokus Buram</span>
        </button>
        <button
          type="button"
          className={`am-camera-tab-btn ${activeTab === 'fog' ? 'active' : ''}`}
          onClick={() => setActiveTab('fog')}
          title="Kabut"
        >
          <img src="./icons/ic_cameraoption_fog.svg" alt="Fog" />
          <span>Kabut</span>
        </button>
      </div>

      <div id="am-camera-tab-content">
        {activeTab === 'view' && (
          <div className="am-camera-mode-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <button
                type="button"
                id="perspectiveButton"
                className="am-perspective-btn"
                title="Ganti Tipe Kamera (Perspektif / Paralel)"
                onClick={toggleCameraType}
              >
                <img
                  src={isPersp ? './icons/ic_camera_perspective.svg' : './icons/ic_camera_parallel.svg'}
                  alt="Perspective"
                />
              </button>
              <span
                className="am-badge-mode"
                style={isPersp ? {} : { background: 'rgba(140,147,167,0.2)', color: '#8c93a7' }}
              >
                {isPersp ? 'PERSPEKTIF' : 'PARALEL'}
              </span>
            </div>

            <div className="am-frustum-preview-box">
              <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                <path
                  d={isPersp ? 'M 30 50 L 170 15 L 170 85 Z' : 'M 30 25 L 170 25 L 170 75 L 30 75 Z'}
                  fill="rgba(0,255,168,0.12)"
                  stroke="#00ffa8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="30" cy="50" r="4" fill="#00ffa8" />
              </svg>
            </div>

            {isPersp && (
              <div className="am-camera-param-block" style={{ marginTop: 12 }}>
                <div className="am-param-header">
                  <span className="am-param-label">Sudut Pandang (FOV)</span>
                  <span className="am-val-readout" id="am-cam-fov-text">{curFov}°</span>
                </div>
                <div className="am-val-stepper">
                  <button type="button" className="am-cam-step-btn" onClick={() => updateCameraParam({ fov: Math.max(10, curFov - 5) })}>-</button>
                  <input
                    type="range"
                    className="am-vol-slider"
                    min="10"
                    max="120"
                    step="1"
                    value={curFov}
                    onChange={(e) => updateCameraParam({ fov: Number(e.target.value) })}
                  />
                  <button type="button" className="am-cam-step-btn" onClick={() => updateCameraParam({ fov: Math.min(120, curFov + 5) })}>+</button>
                </div>
              </div>
            )}

            <div className="am-camera-param-block" style={{ marginTop: 12 }}>
              <div className="am-param-header">
                <span className="am-param-label">Panjang Fokus (Zoom)</span>
                <span className="am-val-readout" id="am-cam-zoom-text">{curZoom} px</span>
              </div>
              <div className="am-val-stepper">
                <button type="button" className="am-cam-step-btn" onClick={() => updateCameraParam({ cameraZoom: Math.max(100, curZoom - 50) })}>-</button>
                <input
                  type="range"
                  className="am-vol-slider"
                  min="100"
                  max="3000"
                  step="10"
                  value={curZoom}
                  onChange={(e) => updateCameraParam({ cameraZoom: Number(e.target.value) })}
                />
                <button type="button" className="am-cam-step-btn" onClick={() => updateCameraParam({ cameraZoom: Math.min(3000, curZoom + 50) })}>+</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus_blur' && (
          <div className="am-camera-section-card">
            <div className="am-switch-header">
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Fokus Buram (Depth of Field)</div>
                <div style={{ fontSize: 10, color: '#8c93a7', marginTop: 2 }}>Mengaburkan objek di luar bidang fokus</div>
              </div>
              <input
                type="checkbox"
                className="am-cam-switch"
                checked={fb.enabled}
                onChange={(e) => updateFocusBlur({ enabled: e.target.checked })}
              />
            </div>

            {fb.enabled && (
              <div className="am-cam-controls-group">
                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Jarak Fokus</span>
                    <span className="am-val-readout">{Math.round(fb.distance || 500)} px</span>
                  </div>
                  <div className="am-val-stepper">
                    <input
                      type="range"
                      className="am-vol-slider"
                      min="50"
                      max="3000"
                      step="10"
                      value={Math.round(fb.distance || 500)}
                      onChange={(e) => updateFocusBlur({ distance: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Kedalaman Bidang (DoF)</span>
                    <span className="am-val-readout">{Math.round(fb.depthOfField || 100)} px</span>
                  </div>
                  <div className="am-val-stepper">
                    <input
                      type="range"
                      className="am-vol-slider"
                      min="10"
                      max="1000"
                      step="10"
                      value={Math.round(fb.depthOfField || 100)}
                      onChange={(e) => updateFocusBlur({ depthOfField: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Kekuatan Buram</span>
                    <span className="am-val-readout">{Number(fb.strength || 0.5).toFixed(2)}x</span>
                  </div>
                  <div className="am-val-stepper">
                    <input
                      type="range"
                      className="am-vol-slider"
                      min="0"
                      max="2"
                      step="0.05"
                      value={Number(fb.strength || 0.5)}
                      onChange={(e) => updateFocusBlur({ strength: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fog' && (
          <div className="am-camera-section-card">
            <div className="am-switch-header">
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Kabut Atmosferik (Atmospheric Fog)</div>
                <div style={{ fontSize: 10, color: '#8c93a7', marginTop: 2 }}>Menambahkan kabut kedalaman berdasarkan jarak Z</div>
              </div>
              <input
                type="checkbox"
                className="am-cam-switch"
                checked={fg.enabled}
                onChange={(e) => updateFog({ enabled: e.target.checked })}
              />
            </div>

            {fg.enabled && (
              <div className="am-cam-controls-group">
                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Warna Kabut</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={fgColor}
                        style={{ width: 28, height: 24, border: 0, background: 'transparent', cursor: 'pointer' }}
                        onChange={(e) => updateFog({ color: e.target.value })}
                      />
                      <span className="am-val-readout">{fgColor.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="am-palette-grid">
                    {SWATCHES.slice(0, 8).map((c) => (
                      <div
                        key={c}
                        className={`am-palette-chip ${c.toLowerCase() === fgColor.toLowerCase() ? 'active' : ''}`}
                        style={{ background: c }}
                        onClick={() => updateFog({ color: c })}
                      />
                    ))}
                  </div>
                </div>

                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Jarak Awal Z (Near Z)</span>
                    <span className="am-val-readout">{Math.round(fg.nearZ || 0)} px</span>
                  </div>
                  <div className="am-val-stepper">
                    <input
                      type="range"
                      className="am-vol-slider"
                      min="0"
                      max="2000"
                      step="25"
                      value={Math.round(fg.nearZ || 0)}
                      onChange={(e) => updateFog({ nearZ: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="am-camera-param-block">
                  <div className="am-param-header">
                    <span className="am-param-label">Jarak Akhir Z (Far Z)</span>
                    <span className="am-val-readout">{Math.round(fg.farZ || 1500)} px</span>
                  </div>
                  <div className="am-val-stepper">
                    <input
                      type="range"
                      className="am-vol-slider"
                      min="100"
                      max="5000"
                      step="50"
                      value={Math.round(fg.farZ || 1500)}
                      onChange={(e) => updateFog({ farZ: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
