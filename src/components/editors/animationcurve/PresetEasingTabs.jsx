import React from 'react';

export const CURVE_CATEGORIES = {
  bezier: {
    name: 'BEZIER',
    presets: [
      { name: 'LINEAR', token: 'linear', p1: [0, 0], p2: [1, 1], icon: './icons/ic_easing_linear.svg' },
      { name: 'MASUK MUDAH', token: 'cubicBezier 0.42 0.0 1.0 1.0', p1: [0.42, 0], p2: [1, 1], icon: './icons/ic_easing_bezier_easein.svg' },
      { name: 'KELUAR MUDAH', token: 'cubicBezier 0.0 0.0 0.58 1.0', p1: [0, 0], p2: [0.58, 1], icon: './icons/ic_easing_bezier_easeout.svg' },
      { name: 'MASUK-KELUAR MUDAH', token: 'cubicBezier 0.42 0.0 0.58 1.0', p1: [0.42, 0], p2: [0.58, 1], icon: './icons/ic_easing_bezier_easeinout.svg' }
    ]
  },
  bounce: {
    name: 'BOUNCE',
    presets: [
      { name: 'PANTULAN MASUK', token: 'bounce 0.3 0.8', p1: [0.3, 0], p2: [0.8, 1], icon: './icons/ic_easing_bouncein.svg' },
      { name: 'PANTULAN KELUAR', token: 'reverse bounce 0.3 0.8', p1: [0.2, 0], p2: [0.7, 1], icon: './icons/ic_easing_bouncein.svg' },
      { name: 'ELASTIS MASUK', token: 'elastic 0.5 0.5 0.5 0', p1: [0.5, 0], p2: [0.5, 1], icon: './icons/ic_easing_bouncein.svg' },
      { name: 'ELASTIS KELUAR', token: 'reverse elastic 0.5 0.5 0.5 0', p1: [0.5, 0], p2: [0.5, 1], icon: './icons/ic_easing_bouncein.svg' }
    ]
  },
  steps: {
    name: 'STEPS',
    presets: [
      { name: 'TANGGA 2', token: 'step 0.5 0', p1: [0, 0], p2: [1, 1], icon: './icons/ic_easing_stairstep.svg' },
      { name: 'TANGGA 4', token: 'step 0.25 0', p1: [0, 0], p2: [1, 1], icon: './icons/ic_easing_stairstep.svg' },
      { name: 'TANGGA 8', token: 'step 0.125 0', p1: [0, 0], p2: [1, 1], icon: './icons/ic_easing_stairstep.svg' },
      { name: 'TANGGA 16', token: 'step 0.0625 0', p1: [0, 0], p2: [1, 1], icon: './icons/ic_easing_stairstep.svg' }
    ]
  },
  custom: {
    name: 'CUSTOM',
    presets: [
      { name: 'SINE BERKALA', token: 'cyclic 0.5 0.5 0.5 0 0', p1: [0.5, 0], p2: [0.5, 1], icon: './icons/ic_easing_oscillate.svg' },
      { name: 'OSILASI CEPAT', token: 'cyclic 0.25 0.8 0.5 0 0', p1: [0.25, 0], p2: [0.8, 1], icon: './icons/ic_easing_oscillate.svg' },
      { name: 'TANGGA ELASTIS', token: 'elasticStep 0.25 0.5', p1: [0.25, 0], p2: [0.5, 1], icon: './icons/ic_easing_oscillate.svg' },
      { name: 'ACAK', token: 'random 0.2 0.8', p1: [0.2, 0], p2: [0.8, 1], icon: './icons/ic_easing_oscillate.svg' }
    ]
  }
};

export function PresetEasingTabs({
  activeCategory = 'bezier',
  onSelectCategory,
  activeToken = '',
  onSelectPreset
}) {
  const catData = CURVE_CATEGORIES[activeCategory] || CURVE_CATEGORIES.bezier;

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {/* Presets rail */}
      <div
        className="am-curve-rail-options"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '4px 0'
        }}
      >
        {catData.presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className={`am-curve-preset-btn ${preset.token === activeToken ? 'active' : ''}`}
            title={preset.name}
            onClick={() => onSelectPreset && onSelectPreset(preset)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: preset.token === activeToken ? 'rgba(0,255,168,0.2)' : 'rgba(255,255,255,0.06)',
              border: preset.token === activeToken ? '1px solid #00ffa8' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <img src={preset.icon} alt={preset.name} style={{ width: 20, height: 20 }} />
          </button>
        ))}
      </div>

      {/* Categories rail */}
      <div
        className="am-curve-rail-categories"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '4px 0',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          paddingLeft: 6
        }}
      >
        {[
          { id: 'bezier', icon: './icons/ic_easing_bezier_easeinout.svg', title: 'Bezier' },
          { id: 'bounce', icon: './icons/ic_easing_bouncein.svg', title: 'Bounce' },
          { id: 'steps', icon: './icons/ic_easing_stairstep.svg', title: 'Steps' },
          { id: 'custom', icon: './icons/ic_easing_oscillate.svg', title: 'Custom' }
        ].map((c) => {
          const isActive = c.id === activeCategory;
          return (
            <div key={c.id} className="am-curve-tab-holder" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <button
                type="button"
                className={`am-curve-cat-btn ${isActive ? 'active' : ''}`}
                title={c.title}
                onClick={() => onSelectCategory && onSelectCategory(c.id)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: isActive ? 'rgba(0,255,168,0.2)' : 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <img src={c.icon} alt={c.title} style={{ width: 20, height: 20, opacity: isActive ? 1 : 0.6 }} />
              </button>
              {isActive && (
                <div
                  className="am-curve-cat-cue active"
                  style={{
                    position: 'absolute',
                    right: -6,
                    width: 3,
                    height: 20,
                    background: '#00ffa8',
                    borderRadius: 2
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PresetEasingTabs;
