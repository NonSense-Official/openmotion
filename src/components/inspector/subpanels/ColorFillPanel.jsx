import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { SWATCHES, parseColor, rgbaToHex, colorToCss, colorToHexStr } from './colorUtils';
import MediaFillSection from './MediaFillSection';
import GradientFillSection from './GradientFillSection';

export default function ColorFillPanel({ layer, onBack, onOpenCurve }) {
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const playheadMs = useEditorStore((state) => state.playheadMs);

  const initialTab = () => {
    if (layer.fillType === 'none') return 'none';
    if (layer.fillType === 'media') return 'media';
    if (layer.fillType === 'gradient') {
      return layer.gradient?.type === 'radial' ? 'radial' : 'linear';
    }
    if (layer.fillType === 'intrinsic') return 'intrinsic';
    return 'solid';
  };

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentColor, setCurrentColor] = useState(() => parseColor(layer.color || layer.fillColor || '#00ffa8'));
  const [activeGradStop, setActiveGradStop] = useState(1);
  const [gradColor1, setGradColor1] = useState(() => (layer.gradient?.startColor ? parseColor(layer.gradient.startColor) : parseColor(layer.color || '#00ffa8')));
  const [gradColor2, setGradColor2] = useState(() => (layer.gradient?.endColor ? parseColor(layer.gradient.endColor) : { r: 0, g: 85, b: 255, a: 1 }));
  const [gradStart, setGradStart] = useState(() => (layer.gradient?.start ? [...layer.gradient.start] : [0, 0.5]));
  const [gradEnd, setGradEnd] = useState(() => (layer.gradient?.end ? [...layer.gradient.end] : [1, 0.5]));
  const [mediaScaleMode, setMediaScaleMode] = useState(() => layer.mediaFillMode || 'fill');

  const activeColorObj = activeTab === 'solid' ? currentColor : activeGradStop === 1 ? gradColor1 : gradColor2;
  const activeHexStr = colorToHexStr(activeColorObj);

  const keyable = layer.fillColorKeyable || layer.transform?.fillColor;
  const tSec = playheadMs / 1000;
  const hasKf = Boolean(keyable?.kfs?.some((k) => Math.abs(Number(k.t) - tSec) < 0.002));

  const commitSolid = (colorObj) => {
    const hex = rgbaToHex(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
    const norm = [colorObj.r / 255, colorObj.g / 255, colorObj.b / 255, colorObj.a];
    updateLayer(layer.id, {
      fillType: 'color',
      color: hex,
      fillColor: norm
    });
  };

  const commitGradient = (c1, c2, start, end, type) => {
    const c1Arr = [c1.r / 255, c1.g / 255, c1.b / 255, c1.a];
    const c2Arr = [c2.r / 255, c2.g / 255, c2.b / 255, c2.a];
    updateLayer(layer.id, {
      fillType: 'gradient',
      gradient: {
        type: type || (activeTab === 'radial' ? 'radial' : 'linear'),
        start: [...start],
        end: [...end],
        startColor: c1Arr,
        endColor: c2Arr,
        stops: [
          { t: 0, color: c1Arr },
          { t: 1, color: c2Arr }
        ]
      }
    });
  };

  const handleUpdateRgba = (key, val) => {
    const num = Math.max(0, Math.min(key === 'a' ? 1 : 255, Number(val)));
    const updated = { ...activeColorObj, [key]: num };
    if (activeTab === 'solid') {
      setCurrentColor(updated);
      commitSolid(updated);
    } else if (activeGradStop === 1) {
      setGradColor1(updated);
      commitGradient(updated, gradColor2, gradStart, gradEnd);
    } else {
      setGradColor2(updated);
      commitGradient(gradColor1, updated, gradStart, gradEnd);
    }
  };

  const handleSelectSwatch = (hex) => {
    const parsed = parseColor(hex);
    if (activeTab === 'solid') {
      setCurrentColor(parsed);
      commitSolid(parsed);
    } else if (activeGradStop === 1) {
      setGradColor1(parsed);
      commitGradient(parsed, gradColor2, gradStart, gradEnd);
    } else {
      setGradColor2(parsed);
      commitGradient(gradColor1, parsed, gradStart, gradEnd);
    }
  };

  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const ed = new window.EyeDropper();
        const res = await ed.open();
        if (res?.sRGBHex) {
          handleSelectSwatch(res.sRGBHex);
        }
      } catch {}
    }
  };

  const handleSwapGradient = () => {
    const next1 = { ...gradColor2 };
    const next2 = { ...gradColor1 };
    setGradColor1(next1);
    setGradColor2(next2);
    commitGradient(next1, next2, gradStart, gradEnd);
  };

  const handleSetDirection = (sx, sy, ex, ey) => {
    const nStart = [sx, sy];
    const nEnd = [ex, ey];
    setGradStart(nStart);
    setGradEnd(nEnd);
    commitGradient(gradColor1, gradColor2, nStart, nEnd);
  };

  const handleMediaUpload = (file) => {
    const url = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video');
    updateLayer(layer.id, {
      fillType: 'media',
      mediaUrl: url,
      fillVideo: isVid ? file.name : null,
      fillImage: !isVid ? file.name : null,
      mediaFillMode: mediaScaleMode
    });
  };

  const handleScaleMode = (mode) => {
    setMediaScaleMode(mode);
    updateLayer(layer.id, { mediaFillMode: mode });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'none') {
      updateLayer(layer.id, { fillType: 'none' });
    } else if (tab === 'solid') {
      commitSolid(currentColor);
    } else if (tab === 'linear' || tab === 'radial') {
      commitGradient(gradColor1, gradColor2, gradStart, gradEnd, tab);
    } else if (tab === 'media') {
      updateLayer(layer.id, { fillType: 'media', mediaFillMode: mediaScaleMode });
    } else if (tab === 'intrinsic') {
      updateLayer(layer.id, { fillType: 'intrinsic' });
    }
  };

  return (
    <div className="am-cf-root">
      <div className="am-cf-sidebar-left">
        <button type="button" id="am-cf-btn-back" className="am-vol-side-btn" title="Kembali" onClick={onBack}>
          <img src="./icons/ac_ic_back.svg" alt="Back" />
        </button>
        <button
          type="button"
          id="am-cf-btn-kf"
          className={`am-vol-side-btn ${hasKf ? 'active' : ''}`}
          title={hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={hasKf ? '#00ffa8' : 'none'} stroke={hasKf ? '#00ffa8' : '#fff'} strokeWidth="2">
            <path d="M12 2L4 12l8 10 8-10L12 2z" />
          </svg>
        </button>
        <button type="button" id="am-cf-btn-curve" className="am-vol-side-btn" title="Kurva Easing" onClick={onOpenCurve}>
          <img src="./icons/ac_ic_anim_curve.svg" alt="Curve" />
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div className="am-cf-center">
        <div className="am-cf-tab-holder" id="tab_holder">
          <button type="button" className={`am-cf-tab-btn ${activeTab === 'none' ? 'active' : ''}`} onClick={() => handleTabChange('none')} title="Tanpa Isi">
            <img src="./icons/ic_none.svg" alt="None" />
          </button>
          <button type="button" className={`am-cf-tab-btn ${activeTab === 'solid' ? 'active' : ''}`} onClick={() => handleTabChange('solid')} title="Warna Solid">
            <img src="./icons/ic_tab_fill.svg" alt="Solid" />
          </button>
          <button type="button" className={`am-cf-tab-btn ${activeTab === 'linear' || activeTab === 'radial' ? 'active' : ''}`} onClick={() => handleTabChange('linear')} title="Gradien">
            <img src="./icons/ic_tab_gradation.svg" alt="Gradien" />
          </button>
          <button type="button" className={`am-cf-tab-btn ${activeTab === 'media' ? 'active' : ''}`} onClick={() => handleTabChange('media')} title="Media / Gambar / Video">
            <img src="./icons/ic_tab_media.svg" alt="Media" />
          </button>
          <button type="button" className={`am-cf-tab-btn ${activeTab === 'intrinsic' ? 'active' : ''}`} onClick={() => handleTabChange('intrinsic')} title="Warna Asli">
            <img src="./icons/ac_ic_groupelements.svg" alt="Intrinsic" />
          </button>
        </div>

        {activeTab === 'none' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '36px 16px', color: '#8c93a7' }}>
            <img src="./icons/ic_none.svg" alt="None" style={{ width: 48, height: 48, opacity: 0.35 }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Tanpa Isi (Transparan)</span>
          </div>
        )}

        {activeTab === 'intrinsic' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '36px 16px', color: '#8c93a7' }}>
            <img src="./icons/ac_ic_groupelements.svg" alt="Intrinsic" style={{ width: 48, height: 48, opacity: 0.4 }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Warna Asli Elemen</span>
          </div>
        )}

        {activeTab === 'solid' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="am-cf-top-bar">
              <div className="am-cf-color-preview-wrap">
                <div className="am-cf-color-preview" style={{ background: colorToCss(activeColorObj) }} />
              </div>
              <input type="text" className="am-cf-hex-input" value={activeHexStr} onChange={(e) => handleSelectSwatch(e.target.value)} />
              <button type="button" className="am-cf-icon-btn" title="Pipet Warna (EyeDropper)" onClick={handleEyeDropper}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m14 7 3 3m-9.5 7.5L3 21l3.5-4.5M14 7l-9 9 2 2 9-9-2-2Zm0 0 2.5-2.5a2.121 2.121 0 0 1 3 3L17 10" />
                </svg>
              </button>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--am-p5)', textTransform: 'uppercase' }}>Palet Warna</div>
            <div className="am-palette-grid">
              {SWATCHES.map((hex) => (
                <div
                  key={hex}
                  className={`am-palette-chip ${hex.toLowerCase() === activeHexStr.slice(0, 7).toLowerCase() ? 'active' : ''}`}
                  data-color={hex}
                  style={{ background: hex }}
                  onClick={() => handleSelectSwatch(hex)}
                />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {[
                { label: 'Merah (R)', key: 'r', max: 255, val: activeColorObj.r, cls: 'am-cf-range-r' },
                { label: 'Hijau (G)', key: 'g', max: 255, val: activeColorObj.g, cls: 'am-cf-range-g' },
                { label: 'Biru (B)', key: 'b', max: 255, val: activeColorObj.b, cls: 'am-cf-range-b' },
                { label: 'Opasitas (Alpha)', key: 'a', max: 1, step: 0.01, val: activeColorObj.a, displayVal: `${Math.round(activeColorObj.a * 100)}%`, cls: 'am-cf-range-a' }
              ].map((s) => (
                <div key={s.key} className="am-cf-slider-row">
                  <div className="am-cf-slider-header">
                    <span>{s.label}</span>
                    <span className="am-cf-slider-val">{s.displayVal ?? s.val}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={s.max}
                    step={s.step ?? 1}
                    value={s.val}
                    className={`am-cf-range ${s.cls}`}
                    onChange={(e) => handleUpdateRgba(s.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'linear' || activeTab === 'radial') && (
          <GradientFillSection
            activeTab={activeTab}
            gradColor1={gradColor1}
            gradColor2={gradColor2}
            activeGradStop={activeGradStop}
            onSelectGradStop={setActiveGradStop}
            onSwapGradient={handleSwapGradient}
            onSetDirection={handleSetDirection}
            onSelectSwatch={handleSelectSwatch}
            activeColorObj={activeColorObj}
            activeHexStr={activeHexStr}
          />
        )}

        {activeTab === 'media' && (
          <MediaFillSection
            layer={layer}
            mediaScaleMode={mediaScaleMode}
            onScaleModeChange={handleScaleMode}
            onMediaUpload={handleMediaUpload}
          />
        )}
      </div>
    </div>
  );
}
