import React, { useState } from 'react';
import TouchPad2D from './TouchPad2D';
import RotationDial from './RotationDial';
import KeyframeRail from './KeyframeRail';

export function MoveTransformDock({
  layer,
  timeMs = 0,
  onUpdateTransform,
  onOpenCurveEditor,
  onClose
}) {
  const [curTab, setCurTab] = useState('pos');
  const [linkAspect, setLinkAspect] = useState(true);

  if (!layer) return null;

  const tr = layer.transform || {};
  const location = (tr.location && tr.location.value) || [0, 0, 0];
  const rotation = (tr.rotation && tr.rotation.value) || [0];
  const scale = (tr.scale && tr.scale.value) || [1, 1];
  const pivot = (tr.pivot && tr.pivot.value) || [0, 0];
  const skew = (tr.skew && tr.skew.value) || [0, 0];

  const timeSec = (timeMs || 0) / 1000;

  const getActivePropData = () => {
    if (curTab === 'rot') return tr.rotation;
    if (curTab === 'scale') return tr.scale;
    if (curTab === 'pivot') return tr.pivot;
    if (curTab === 'skew') return tr.skew;
    return tr.location;
  };

  const activeProp = getActivePropData();
  const hasKeyframeAtPlayhead = !!(
    activeProp &&
    Array.isArray(activeProp.kfs) &&
    activeProp.kfs.some((k) => Math.abs(Number(k.t) - timeSec) < 0.002)
  );

  const handleTabClick = (tab) => {
    if (tab === 'pos' && curTab === 'pos') {
      setCurTab('pivot');
    } else if (tab === 'pos' && curTab === 'pivot') {
      setCurTab('pos');
    } else {
      setCurTab(tab);
    }
  };

  const handleToggleKeyframe = () => {
    const propName = curTab === 'rot' ? 'rotation'
      : curTab === 'scale' ? 'scale'
      : curTab === 'pivot' ? 'pivot'
      : curTab === 'skew' ? 'skew'
      : 'location';

    const prop = tr[propName] ? { ...tr[propName] } : { value: [0, 0], kfs: [] };
    const kfs = [...(prop.kfs || [])];
    const kfIdx = kfs.findIndex((k) => Math.abs(Number(k.t) - timeSec) < 0.002);

    if (kfIdx >= 0) {
      kfs.splice(kfIdx, 1);
    } else {
      const curVal = prop.value ? (Array.isArray(prop.value) ? [...prop.value] : [prop.value]) : [0];
      kfs.push({ t: timeSec, v: curVal });
      kfs.sort((a, b) => Number(a.t) - Number(b.t));
    }
    prop.kfs = kfs;
    onUpdateTransform && onUpdateTransform(propName, prop.value);
  };

  const handleReset = () => {
    if (curTab === 'pos') {
      onUpdateTransform && onUpdateTransform('location', [0, 0, 0]);
    } else if (curTab === 'pivot') {
      onUpdateTransform && onUpdateTransform('pivot', [0, 0]);
    } else if (curTab === 'rot') {
      onUpdateTransform && onUpdateTransform('rotation', [0]);
    } else if (curTab === 'scale') {
      onUpdateTransform && onUpdateTransform('scale', [1, 1]);
    } else if (curTab === 'skew') {
      onUpdateTransform && onUpdateTransform('skew', [0, 0]);
    }
  };

  const handlePadDelta = (dx, dy) => {
    if (curTab === 'pos') {
      const nx = Math.round(location[0] + dx);
      const ny = Math.round(location[1] + dy);
      onUpdateTransform && onUpdateTransform('location', [nx, ny, location[2] || 0]);
    } else if (curTab === 'pivot') {
      const npx = Math.round(pivot[0] + dx);
      const npy = Math.round(pivot[1] + dy);
      onUpdateTransform && onUpdateTransform('pivot', [npx, npy]);
    } else if (curTab === 'scale') {
      const factor = (dx - dy) / 120;
      const nsx = Math.max(0.01, Math.round((scale[0] + factor) * 100) / 100);
      const nsy = Math.max(0.01, Math.round((scale[1] + (linkAspect ? factor : -dy / 120)) * 100) / 100);
      onUpdateTransform && onUpdateTransform('scale', [nsx, nsy]);
    } else if (curTab === 'skew') {
      const nskx = Math.round((skew[0] + dx / 5) * 10) / 10;
      const nsky = Math.round((skew[1] + dy / 5) * 10) / 10;
      onUpdateTransform && onUpdateTransform('skew', [nskx, nsky]);
    }
  };

  return (
    <div
      id="omMtPanel"
      className="am-mt-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 240,
        backgroundColor: '#191b27',
        color: '#fff',
        userSelect: 'none'
      }}
    >
      <div
        className="om-mt-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onClose && (
            <button
              type="button"
              className="om-mt-close"
              onClick={onClose}
              style={{ background: 'transparent', border: 0, color: '#00ffa8', cursor: 'pointer', padding: 2 }}
            >
              ✓
            </button>
          )}
          <span style={{ fontSize: 13, fontWeight: 700 }}>Move &amp; Transform</span>
          <span style={{ fontSize: 11, color: '#8c93a7' }}>{layer.name || 'Layer'}</span>
        </div>

        <div className="am-mt-top-readouts om-mt-readout" style={{ margin: 0, width: 'auto' }}>
          {curTab === 'pos' && (
            <div className="am-mt-pill-group">
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">X</span>
                <span className="am-mt-pill-val">{Math.round(location[0])}</span>
              </div>
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">Y</span>
                <span className="am-mt-pill-val">{Math.round(location[1])}</span>
              </div>
            </div>
          )}
          {curTab === 'pivot' && (
            <div className="am-mt-pill-group">
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">PX</span>
                <span className="am-mt-pill-val">{Math.round(pivot[0])}</span>
              </div>
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">PY</span>
                <span className="am-mt-pill-val">{Math.round(pivot[1])}</span>
              </div>
            </div>
          )}
          {curTab === 'rot' && (
            <div className="am-mt-pill">
              <span className="am-mt-pill-lbl">DEG</span>
              <span className="am-mt-pill-val">{(rotation[0] || 0).toFixed(1)}°</span>
            </div>
          )}
          {curTab === 'scale' && (
            <div className="am-mt-pill-group">
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">SX</span>
                <span className="am-mt-pill-val">{scale[0].toFixed(2)}</span>
              </div>
              <button
                type="button"
                className={`am-mt-link-btn ${linkAspect ? 'active' : ''}`}
                onClick={() => setLinkAspect(!linkAspect)}
                title="Kunci Rasio Skala"
              >
                🔗
              </button>
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">SY</span>
                <span className="am-mt-pill-val">{scale[1].toFixed(2)}</span>
              </div>
            </div>
          )}
          {curTab === 'skew' && (
            <div className="am-mt-pill-group">
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">KX</span>
                <span className="am-mt-pill-val">{skew[0]}</span>
              </div>
              <div className="am-mt-pill">
                <span className="am-mt-pill-lbl">KY</span>
                <span className="am-mt-pill-val">{skew[1]}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div
          className="am-mt-sidebar-left om-mt-left-rail"
          style={{
            width: 54,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 0',
            gap: 10,
            borderRight: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <button
            type="button"
            className={`am-mt-tab-btn om-mt-tab-btn ${curTab === 'pos' || curTab === 'pivot' ? 'active' : ''} ${curTab === 'pivot' ? 'pivot-mode' : ''}`}
            onClick={() => handleTabClick('pos')}
            title="Posisi (Klik lagi untuk Jangkar)"
          >
            <img
              src={curTab === 'pivot' ? './icons/ac_ic_move_pivot.svg' : './icons/ac_ic_move.svg'}
              alt="Posisi"
            />
          </button>

          <button
            type="button"
            className={`am-mt-tab-btn om-mt-tab-btn ${curTab === 'rot' ? 'active' : ''}`}
            onClick={() => handleTabClick('rot')}
            title="Rotasi"
          >
            <img src="./icons/ac_ic_rotate.svg" alt="Rotasi" />
          </button>

          <button
            type="button"
            className={`am-mt-tab-btn om-mt-tab-btn ${curTab === 'scale' ? 'active' : ''}`}
            onClick={() => handleTabClick('scale')}
            title="Skala"
          >
            <img src="./icons/ac_ic_scale.svg" alt="Skala" />
          </button>

          <button
            type="button"
            className={`am-mt-tab-btn om-mt-tab-btn ${curTab === 'skew' ? 'active' : ''}`}
            onClick={() => handleTabClick('skew')}
            title="Skew"
          >
            <img src="./icons/ac_ic_skew.svg" alt="Skew" />
          </button>
        </div>

        <div
          className="am-mt-center om-mt-center"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px'
          }}
        >
          {curTab === 'pos' && (
            <TouchPad2D
              icon="./icons/ac_ic_move.svg"
              guideText="Geser ke mana saja untuk memindahkan layer"
              onDelta={handlePadDelta}
            />
          )}

          {curTab === 'pivot' && (
            <TouchPad2D
              icon="./icons/ac_ic_move_pivot.svg"
              guideText="Geser untuk memindahkan titik jangkar (pivot)"
              onDelta={handlePadDelta}
            />
          )}

          {curTab === 'rot' && (
            <RotationDial
              angle={rotation[0] || 0}
              onChange={(newDeg) => onUpdateTransform && onUpdateTransform('rotation', [newDeg])}
            />
          )}

          {curTab === 'scale' && (
            <TouchPad2D
              icon="./icons/ac_ic_scale.svg"
              guideText="Geser ke atas/kanan memperbesar, bawah/kiri memperkecil"
              onDelta={handlePadDelta}
            />
          )}

          {curTab === 'skew' && (
            <TouchPad2D
              icon="./icons/ac_ic_skew.svg"
              guideText="Geser untuk mengubah distorsi kemiringan (skew)"
              onDelta={handlePadDelta}
            />
          )}
        </div>

        <KeyframeRail
          hasKeyframeAtPlayhead={hasKeyframeAtPlayhead}
          onToggleKeyframe={handleToggleKeyframe}
          onPrevKeyframe={() => {}}
          onNextKeyframe={() => {}}
          onOpenCurveEditor={() => onOpenCurveEditor?.({ layerId: layer.id, tab: curTab })}
          onResetTransform={handleReset}
        />
      </div>
    </div>
  );
}

export default MoveTransformDock;
