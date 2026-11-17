import React, { useState } from 'react';
import BezierCanvas from './BezierCanvas';
import PresetEasingTabs from './PresetEasingTabs';

export function CurveEditorModal({
  isOpen,
  onClose,
  onApplyCurve
}) {
  const [activeCategory, setActiveCategory] = useState('bezier');
  const [activeToken, setActiveToken] = useState('cubicBezier 0.42 0.0 0.58 1.0');
  const [p1, setP1] = useState({ x: 0.42, y: 0.0 });
  const [p2, setP2] = useState({ x: 0.58, y: 1.0 });

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setActiveToken(preset.token);
    if (preset.p1 && preset.p2) {
      setP1({ x: preset.p1[0], y: preset.p1[1] });
      setP2({ x: preset.p2[0], y: preset.p2[1] });
    }
    onApplyCurve && onApplyCurve(preset.token);
  };

  const handleChangeHandles = (newP1, newP2) => {
    setP1(newP1);
    setP2(newP2);
    const token = `cubicBezier ${newP1.x.toFixed(2)} ${newP1.y.toFixed(2)} ${newP2.x.toFixed(2)} ${newP2.y.toFixed(2)}`;
    setActiveToken(token);
    onApplyCurve && onApplyCurve(token);
  };

  const handleReverseCurve = () => {
    const revP1 = { x: 1 - p2.x, y: 1 - p2.y };
    const revP2 = { x: 1 - p1.x, y: 1 - p1.y };
    handleChangeHandles(revP1, revP2);
  };

  const getCurveLabel = () => {
    if (activeToken.startsWith('step')) return 'TANGGA (STEPS)';
    if (activeToken.includes('bounce')) return 'PANTULAN (BOUNCE)';
    if (activeToken.includes('elastic')) return 'ELASTIS (ELASTIC)';
    if (activeToken.includes('cyclic')) return 'BERKALA (CYCLIC)';
    if (activeToken === 'linear' || activeToken === 'none') return 'LINEAR';
    return 'KUSTOM (BEZIER)';
  };

  return (
    <div
      id="am-animcurve-panel"
      className="am-curve-root open am-curve-floating"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 12,
        transform: 'translateX(-50%)',
        width: 'min(96vw, 440px)',
        zIndex: 9995,
        backgroundColor: '#191b27',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', padding: 8, gap: 8 }}>
        {/* Left rail */}
        <div
          className="am-curve-rail-left"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            borderRight: '1px solid rgba(255,255,255,0.08)',
            paddingRight: 6
          }}
        >
          <button
            type="button"
            id="am-curve-btn-back"
            className="am-curve-rail-btn"
            title="Kembali"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 18, height: 18 }} />
          </button>

          <button
            type="button"
            id="am-curve-btn-kf"
            className="am-curve-rail-btn"
            title="Keyframe"
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              id="am-curve-img-kf"
              src="./icons/ac_ic_add_keyframe.svg"
              alt="Keyframe"
              style={{ width: 18, height: 18 }}
            />
          </button>

          <button
            type="button"
            id="am-curve-btn-reverse"
            className="am-curve-rail-btn"
            title="Balikkan Kurva"
            onClick={handleReverseCurve}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src="./icons/ic_curve_reverse.svg" alt="Reverse" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Center Canvas Area */}
        <div
          className="am-curve-center-area"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <BezierCanvas
            p1={p1}
            p2={p2}
            onChangeHandles={handleChangeHandles}
          />

          <div
            className="am-curve-nav-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 240,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 6,
              padding: '2px 6px'
            }}
          >
            <button
              type="button"
              id="am-curve-btn-prev"
              className="am-curve-nav-btn"
              title="Keyframe Sebelumnya"
              style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
            >
              <img src="./icons/ic_prev_element.svg" alt="Prev" style={{ width: 14, height: 14 }} />
            </button>

            <span
              id="am-curve-label"
              className="am-curve-label"
              style={{ fontSize: 11, fontWeight: 700, color: '#00ffa8' }}
            >
              {getCurveLabel()}
            </span>

            <button
              type="button"
              id="am-curve-btn-next"
              className="am-curve-nav-btn"
              title="Keyframe Berikutnya"
              style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
            >
              <img src="./icons/ic_next_element.svg" alt="Next" style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* Right Presets & Categories */}
        <PresetEasingTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activeToken={activeToken}
          onSelectPreset={handleSelectPreset}
        />
      </div>
    </div>
  );
}

export default CurveEditorModal;
