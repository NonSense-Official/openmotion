import React, { useState } from 'react';
import ParamValueSpinner from './ParamValueSpinner';

const DEFAULT_SHAPE_PARAMS = [
  { id: 'size', tag: 'point', type: 'size', label: 'Ukuran', default: [200, 200] },
  { id: 'radius', tag: 'spinner', label: 'Radius Sudut', default: 0, min: 0, max: 200, step: 1 },
  { id: 'feather', tag: 'spinner', label: 'Feather', default: 0, min: 0, max: 100, step: 1 }
];

export function LiveShapeEditor({
  layer,
  timeMs = 0,
  onUpdateLayer,
  onOpenCurveEditor,
  onClose
}) {
  const [selectedParamId, setSelectedParamId] = useState('size');
  const [selectedSubAxis, setSelectedSubAxis] = useState('x');
  const [isAspectLocked, setIsAspectLocked] = useState(true);

  if (!layer) return null;

  const shapeParams = layer.shapeParams || layer.params || {};
  const sizeVal = shapeParams.size || [200, 200];
  const radiusVal = typeof shapeParams.radius === 'number' ? shapeParams.radius : 0;
  const featherVal = typeof shapeParams.feather === 'number' ? shapeParams.feather : 0;

  const timeSec = (timeMs || 0) / 1000;

  const handleUpdateSize = (axis, newVal) => {
    const curX = sizeVal[0] || 200;
    const curY = sizeVal[1] || 200;
    let nextX = curX;
    let nextY = curY;

    if (axis === 'x') {
      nextX = Math.max(1, newVal);
      if (isAspectLocked && curX > 0) {
        nextY = Math.max(1, Math.round((curY * nextX) / curX));
      }
    } else {
      nextY = Math.max(1, newVal);
      if (isAspectLocked && curY > 0) {
        nextX = Math.max(1, Math.round((curX * nextY) / curY));
      }
    }

    const nextParams = { ...shapeParams, size: [nextX, nextY] };
    onUpdateLayer && onUpdateLayer({ ...layer, shapeParams: nextParams });
  };

  const handleUpdateNumeric = (id, newVal) => {
    const nextParams = { ...shapeParams, [id]: newVal };
    onUpdateLayer && onUpdateLayer({ ...layer, shapeParams: nextParams });
  };

  return (
    <div
      id="am-liveshape-panel"
      className="am-ls-root open"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: 220,
        backgroundColor: '#191b27',
        color: '#fff',
        userSelect: 'none'
      }}
    >
      <div
        className="am-ls-sidebar-left"
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
          id="am-btn-liveshape-panel-back"
          className="am-ls-rail-btn"
          title="Kembali"
          onClick={onClose}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 20, height: 20 }} />
        </button>

        <button
          type="button"
          id="am-btn-liveshape-kf"
          className="am-ls-rail-btn"
          title="Tambah / Hapus Keyframe"
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img
            id="am-img-liveshape-kf"
            src="./icons/ac_ic_add_keyframe.svg"
            alt="Keyframe"
            style={{ width: 20, height: 20 }}
          />
        </button>

        <button
          type="button"
          id="am-btn-liveshape-curve"
          className="am-ls-rail-btn"
          title="Kurva Animasi"
          onClick={onOpenCurveEditor}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img src="./icons/ac_ic_anim_curve.svg" alt="Curve" style={{ width: 20, height: 20 }} />
        </button>

        <button
          type="button"
          id="am-btn-liveshape-overflow"
          className="am-ls-rail-btn"
          title="Kunci Rasio"
          onClick={() => setIsAspectLocked(!isAspectLocked)}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
        >
          <img
            src={isAspectLocked ? './icons/ic_shape_aspect_lock.svg' : './icons/ic_projectsetup_link.svg'}
            alt="Aspect"
            style={{ width: 20, height: 20, opacity: isAspectLocked ? 1 : 0.4 }}
          />
        </button>
      </div>

      <div
        className="am-ls-center"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 12px',
          overflowY: 'auto'
        }}
      >
        <div id="am-liveshape-list" className="am-liveshape-settings-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Size parameter */}
          <div
            className={`am-ls-row am-ls-row-pos ${selectedParamId === 'size' ? 'selected' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 8,
              background: selectedParamId === 'size' ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={() => setSelectedParamId('size')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className={`am-ls-prop-label ${selectedParamId === 'size' ? 'active' : ''}`}
                style={{ background: 'transparent', border: 0, color: selectedParamId === 'size' ? '#00ffa8' : '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>Ukuran</span>
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`am-pos-val-btn ${selectedSubAxis === 'x' ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedParamId('size'); setSelectedSubAxis('x'); }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: selectedSubAxis === 'x' && selectedParamId === 'size' ? '#00ffa8' : 'rgba(0,0,0,0.3)',
                    color: selectedSubAxis === 'x' && selectedParamId === 'size' ? '#090a0e' : '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  X: {Math.round(sizeVal[0])} px
                </button>
                <button
                  type="button"
                  className={`am-pos-val-btn ${selectedSubAxis === 'y' ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedParamId('size'); setSelectedSubAxis('y'); }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: selectedSubAxis === 'y' && selectedParamId === 'size' ? '#00ffa8' : 'rgba(0,0,0,0.3)',
                    color: selectedSubAxis === 'y' && selectedParamId === 'size' ? '#090a0e' : '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Y: {Math.round(sizeVal[1])} px
                </button>
              </div>
            </div>

            <ParamValueSpinner
              value={selectedSubAxis === 'x' ? sizeVal[0] : sizeVal[1]}
              min={1}
              max={4000}
              step={1}
              onChange={(v) => handleUpdateSize(selectedSubAxis, v)}
            />
          </div>

          {/* Radius parameter */}
          <div
            className={`am-ls-row am-ls-row-spinner ${selectedParamId === 'radius' ? 'selected' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 8,
              background: selectedParamId === 'radius' ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={() => setSelectedParamId('radius')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: selectedParamId === 'radius' ? '#00ffa8' : '#fff' }}>
                Radius Sudut
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00ffa8', fontFamily: 'monospace' }}>
                {Math.round(radiusVal)} px
              </span>
            </div>

            <ParamValueSpinner
              value={radiusVal}
              min={0}
              max={300}
              step={1}
              onChange={(v) => handleUpdateNumeric('radius', v)}
            />
          </div>

          {/* Feather parameter */}
          <div
            className={`am-ls-row am-ls-row-spinner ${selectedParamId === 'feather' ? 'selected' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 8,
              background: selectedParamId === 'feather' ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={() => setSelectedParamId('feather')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: selectedParamId === 'feather' ? '#00ffa8' : '#fff' }}>
                Feather
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00ffa8', fontFamily: 'monospace' }}>
                {Math.round(featherVal)} px
              </span>
            </div>

            <ParamValueSpinner
              value={featherVal}
              min={0}
              max={150}
              step={1}
              onChange={(v) => handleUpdateNumeric('feather', v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveShapeEditor;
