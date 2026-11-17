import React from 'react';

export function KeyframeRail({
  hasKeyframeAtPlayhead = false,
  onToggleKeyframe,
  onPrevKeyframe,
  onNextKeyframe,
  onOpenCurveEditor,
  onResetTransform
}) {
  return (
    <div
      className="am-mt-sidebar-right om-mt-right-rail"
      style={{
        width: 54,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0',
        gap: 8,
        borderLeft: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <button
        type="button"
        className={`am-mt-rail-btn om-mt-rail-btn ${hasKeyframeAtPlayhead ? 'active' : ''}`}
        id="omMtKfBtn"
        title={hasKeyframeAtPlayhead ? 'Hapus Keyframe' : 'Tambah Keyframe'}
        onClick={onToggleKeyframe}
      >
        <img
          id="omMtKfIcon"
          src={hasKeyframeAtPlayhead ? './icons/ic_keyframe_delete_big.svg' : './icons/ic_keyframe_add_big.svg'}
          alt="Keyframe"
        />
      </button>

      <button
        type="button"
        className="am-mt-rail-btn om-mt-rail-btn"
        id="omMtKfPrevBtn"
        title="Keyframe Sebelumnya"
        onClick={onPrevKeyframe}
      >
        <img src="./icons/ic_prev_element.svg" alt="Prev" />
      </button>

      <button
        type="button"
        className="am-mt-rail-btn om-mt-rail-btn"
        id="omMtKfNextBtn"
        title="Keyframe Berikutnya"
        onClick={onNextKeyframe}
      >
        <img src="./icons/ic_next_element.svg" alt="Next" />
      </button>

      <button
        type="button"
        className="am-mt-rail-btn om-mt-rail-btn"
        id="omMtCurveBtn"
        title="Kurva Animasi (Easing)"
        onClick={onOpenCurveEditor}
      >
        <img src="./icons/ac_ic_anim_curve.svg" alt="Kurva" />
      </button>

      <button
        type="button"
        className="am-mt-rail-btn om-mt-rail-btn"
        id="omMtResetBtn"
        title="Reset Transform"
        onClick={onResetTransform}
      >
        <img src="./icons/ic_reset_transform.svg" alt="Reset" />
      </button>
    </div>
  );
}

export default KeyframeRail;
