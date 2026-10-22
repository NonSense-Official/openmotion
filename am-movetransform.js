(function initAmMoveTransform() {
  const I = window.__AM_INTERNAL || {};
  let curTab = "pos";
  let linkAspect = true;
  let activeGizmoDrag = null;

  const style = document.createElement("style");
  style.id = "om-mt-style";
  style.textContent = `
    #omMtPanel {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: min(100vw, 920px);
      height: 260px;
      background: #141620;
      border: 1px solid #2a2f36;
      border-bottom: 0;
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.65);
      z-index: 9998;
      display: none;
      flex-direction: column;
      user-select: none;
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      color: #fff;
    }
    #omMtPanel.on { display: flex; }

    .om-mt-header {
      padding: 6px 12px;
      background: #191b27;
      border-bottom: 1px solid #2a2f36;
      border-radius: 16px 16px 0 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .om-mt-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .om-mt-title {
      font-size: 13px;
      font-weight: 700;
      color: #00ffa8;
      letter-spacing: 0.02em;
    }
    .om-mt-layer-name {
      font-size: 11px;
      color: #848C98;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .om-mt-close {
      background: transparent;
      border: 0;
      color: #fff;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
    }
    .om-mt-close:hover { background: rgba(255,255,255,0.1); }

    .om-mt-readout {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .om-mt-pill {
      display: inline-flex;
      align-items: center;
      background: #202332;
      border: 1px solid #2a2f36;
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 11px;
      gap: 4px;
    }
    .om-mt-pill span { color: #848C98; font-weight: 600; font-size: 10px; }
    .om-mt-pill input {
      background: transparent;
      border: 0;
      color: #00ffa8;
      font-family: monospace;
      font-size: 11px;
      font-weight: 600;
      width: 58px;
      outline: none;
      padding: 0;
    }
    .om-mt-pill input:focus { color: #fff; }
    .om-mt-btn-toggle {
      background: #202332;
      border: 1px solid #2a2f36;
      border-radius: 6px;
      padding: 2px 8px;
      color: #848C98;
      font-size: 11px;
      cursor: pointer;
    }
    .om-mt-btn-toggle.active {
      background: rgba(0,255,168,0.15);
      border-color: #00ffa8;
      color: #00ffa8;
    }

    .om-mt-body {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .om-mt-left-rail {
      width: 62px;
      border-right: 1px solid #2a2f36;
      display: flex;
      flex-direction: column;
      padding: 6px 4px;
      gap: 6px;
    }
    .om-mt-tab-btn {
      flex: 1;
      border-radius: 8px;
      background: #202332;
      border: 1px solid transparent;
      color: #848C98;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .om-mt-tab-btn img {
      width: 22px;
      height: 22px;
      opacity: 0.7;
      transition: opacity 0.15s;
    }
    .om-mt-tab-btn:hover { background: #292d40; color: #fff; }
    .om-mt-tab-btn:hover img { opacity: 1; }
    .om-mt-tab-btn.active {
      background: rgba(0,255,168,0.12);
      border-color: #00ffa8;
      color: #00ffa8;
    }
    .om-mt-tab-btn.active img {
      opacity: 1;
      filter: drop-shadow(0 0 4px rgba(0,255,168,0.4));
    }
    .om-mt-tab-btn.pivot-mode {
      background: rgba(255,214,0,0.16);
      border-color: #ffd600;
      color: #ffd600;
    }
    .om-mt-tab-btn.pivot-mode img {
      opacity: 1;
      filter: drop-shadow(0 0 4px rgba(255,214,0,0.4));
    }

    .om-mt-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      position: relative;
      touch-action: none;
    }
    .om-mt-pad {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px) 0 0 / 18px 18px, #141620;
      border: 1px solid #2a2f36;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: crosshair;
      position: relative;
      overflow: hidden;
    }
    .om-mt-pad:active { border-color: #00ffa8; background-color: #11131b; }
    .om-mt-pad-guide {
      font-size: 11px;
      color: #848C98;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 2;
    }
    .om-mt-corner {
      position: absolute;
      width: 18px;
      height: 18px;
      pointer-events: none;
      opacity: 0.6;
      z-index: 2;
    }
    .om-mt-corner img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .om-mt-corner.nw { top: 8px; left: 8px; }
    .om-mt-corner.ne { top: 8px; right: 8px; }
    .om-mt-corner.sw { bottom: 8px; left: 8px; }
    .om-mt-corner.se { bottom: 8px; right: 8px; }

    .om-mt-axis-h {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255,255,255,0.08);
      pointer-events: none;
      z-index: 1;
    }
    .om-mt-axis-v {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(255,255,255,0.08);
      pointer-events: none;
      z-index: 1;
    }
    .om-mt-axis-tag-x {
      position: absolute;
      right: 12px;
      top: calc(50% + 4px);
      font-size: 9px;
      font-weight: 700;
      color: #848C98;
      pointer-events: none;
      z-index: 1;
    }
    .om-mt-axis-tag-y {
      position: absolute;
      bottom: 12px;
      left: calc(50% + 4px);
      font-size: 9px;
      font-weight: 700;
      color: #848C98;
      pointer-events: none;
      z-index: 1;
    }

    .om-mt-wheel-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .om-mt-wheel-val {
      font-size: 13px;
      font-weight: 700;
      color: #ffd600;
      font-family: monospace;
    }
    .om-mt-wheel {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 2px solid #00ffa8;
      background: #141620;
      position: relative;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(0,255,168,0.15);
    }
    .om-mt-wheel:active { cursor: grabbing; }
    .om-mt-needle {
      position: absolute;
      top: 10px;
      width: 3px;
      height: 55px;
      background: #00ffa8;
      transform-origin: bottom center;
      border-radius: 2px;
      pointer-events: none;
      box-shadow: 0 0 6px rgba(0,255,168,0.6);
    }
    .om-mt-wheel-center {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffd600;
      pointer-events: none;
      z-index: 2;
    }

    .om-mt-right-rail {
      width: 54px;
      border-left: 1px solid #2a2f36;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      gap: 8px;
    }
    .om-mt-rail-btn {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #202332;
      border: 1px solid #2a2f36;
      color: #848C98;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
      padding: 0;
    }
    .om-mt-rail-btn img {
      width: 20px;
      height: 20px;
      opacity: 0.75;
      display: block;
    }
    .om-mt-rail-btn:hover {
      background: #292d40;
      color: #fff;
    }
    .om-mt-rail-btn:hover img {
      opacity: 1;
    }
    .om-mt-rail-btn.active {
      color: #ffd600;
      border-color: #ffd600;
      background: rgba(255,214,0,0.12);
    }
    .om-mt-rail-btn.active img {
      opacity: 1;
      filter: drop-shadow(0 0 4px rgba(255,214,0,0.5));
    }

    #omGizmoCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 6;
      pointer-events: auto;
      touch-action: none;
    }

    #omMultiBar {
      position: fixed;
      top: 56px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffd600;
      border: 1px solid #ffe033;
      border-radius: 12px;
      padding: 6px 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6);
      color: #0D1016;
      font-family: 'Space Grotesk', sans-serif;
    }
    #omMultiCount {
      font-weight: 700;
      font-size: 13px;
      margin-right: 6px;
    }
    #omMultiBar button {
      background: #0D1016;
      border: 1px solid #222;
      color: #fff;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    #omMultiBar button:hover { background: #272D3D; }
    #omMultiBar button svg { stroke: currentColor; }
    #omMultiBar button.danger { background: #FF3D71; border-color: #FF3D71; color: #fff; }
    #omMultiBar button.danger:hover { background: #e0285c; }
    #omMultiBar button.ghost-cancel { background: transparent; border-color: transparent; color: #0D1016; padding: 4px; }
    #omMultiBar button.ghost-cancel:hover { background: rgba(0,0,0,0.1); }
  `;
  document.head.appendChild(style);

  const stageEl = document.getElementById("stage");
  let gizmoCanvas = document.getElementById("omGizmoCanvas");
  if (!gizmoCanvas && stageEl) {
    gizmoCanvas = document.createElement("canvas");
    gizmoCanvas.id = "omGizmoCanvas";
    stageEl.appendChild(gizmoCanvas);
  }

  let mtPanel = document.getElementById("omMtPanel");
  if (!mtPanel) {
    mtPanel = document.createElement("div");
    mtPanel.id = "omMtPanel";
    mtPanel.innerHTML = `
      <div class="om-mt-header">
        <div class="om-mt-title-row">
          <button type="button" class="om-mt-close" id="omMtClose" title="Selesai">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <span class="om-mt-title">Move &amp; Transform</span>
          <span class="om-mt-layer-name" id="omMtLayerName">-</span>
        </div>
        <div class="om-mt-readout" id="omMtReadout"></div>
      </div>
      <div class="om-mt-body">
        <div class="om-mt-left-rail" id="omMtTabs">
          <button type="button" class="om-mt-tab-btn active" data-tab="pos" title="Posisi / Lokasi (Klik lagi untuk Jangkar / Pivot)">
            <img id="omMtPosIcon" src="./icons/ac_ic_move.svg" alt="Posisi">
            <span id="omMtPosLabel">Posisi</span>
          </button>
          <button type="button" class="om-mt-tab-btn" data-tab="rot" title="Rotasi">
            <img src="./icons/ac_ic_rotate.svg" alt="Rotasi">
            <span>Rotasi</span>
          </button>
          <button type="button" class="om-mt-tab-btn" data-tab="scale" title="Skala">
            <img src="./icons/ac_ic_scale.svg" alt="Skala">
            <span>Skala</span>
          </button>
          <button type="button" class="om-mt-tab-btn" data-tab="skew" title="Skew">
            <img src="./icons/ac_ic_skew.svg" alt="Skew">
            <span>Skew</span>
          </button>
        </div>
        <div class="om-mt-center" id="omMtCenter"></div>
        <div class="om-mt-right-rail">
          <button type="button" class="om-mt-rail-btn" id="omMtKfBtn" title="Tambah / Hapus Keyframe">
            <img id="omMtKfIcon" src="./icons/ic_keyframe_add_big.svg" alt="Keyframe">
          </button>
          <button type="button" class="om-mt-rail-btn" id="omMtKfPrevBtn" title="Keyframe Sebelumnya">
            <img src="./icons/ic_prev_element.svg" alt="Prev">
          </button>
          <button type="button" class="om-mt-rail-btn" id="omMtKfNextBtn" title="Keyframe Berikutnya">
            <img src="./icons/ic_next_element.svg" alt="Next">
          </button>
          <button type="button" class="om-mt-rail-btn" id="omMtCurveBtn" title="Kurva Animasi (Easing)">
            <img src="./icons/ac_ic_anim_curve.svg" alt="Kurva">
          </button>
          <button type="button" class="om-mt-rail-btn" id="omMtResetBtn" title="Reset Transform">
            <img src="./icons/ic_reset_transform.svg" alt="Reset">
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(mtPanel);
  }

  function getCurLayer() {
    if (I.omLayerCur) return I.omLayerCur();
    if (typeof window.omPropsLayerId !== "undefined" && typeof window.omResolveLayer === "function") {
      return window.omResolveLayer(window.omPropsLayerId);
    }
    return null;
  }

  function ensureTransform(l) {
    if (!l) return null;
    l.transform = l.transform || {};
    if (!l.transform.location) l.transform.location = { value: [0, 0, 0], kfs: [] };
    if (!l.transform.scale) l.transform.scale = { value: [1, 1], kfs: [] };
    if (!l.transform.rotation) l.transform.rotation = { value: [0], kfs: [] };
    if (!l.transform.pivot) l.transform.pivot = { value: [0, 0], kfs: [] };
    if (!l.transform.skew) l.transform.skew = { value: [0, 0], kfs: [] };
    return l.transform;
  }

  function getActiveProp() {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return null;
    const tr = layer.transform;
    if (curTab === "rot") return tr.rotation;
    if (curTab === "scale") return tr.scale;
    if (curTab === "pivot") return tr.pivot;
    if (curTab === "skew") return tr.skew;
    return tr.location;
  }

  function getActivePropKey() {
    if (curTab === "rot") return "rot";
    if (curTab === "scale") return "sc";
    if (curTab === "pivot") return "pivot";
    if (curTab === "skew") return "skew";
    return "loc";
  }

  function setPropValue(layer, propName, valArr) {
    const tr = ensureTransform(layer);
    const prop = tr[propName];
    if (!prop) return;
    const tt = (I.H || 0) / 1000;
    if (prop.kfs && prop.kfs.length && I.omSetKeyable) {
      I.omSetKeyable(prop, valArr);
    } else if (prop.kfs && prop.kfs.length) {
      let kf = prop.kfs.find(k => Math.abs(Number(k.t) - tt) < 0.002);
      const arr = Array.isArray(valArr) ? [...valArr] : [valArr];
      if (kf) {
        kf.v = arr;
      } else {
        prop.kfs.push({ t: tt, v: arr, e: null, easing: null });
        prop.kfs.sort((a, b) => Number(a.t) - Number(b.t));
      }
      prop.value = valArr;
    } else {
      prop.value = valArr;
    }
  }

  function commitTransformChange(layer, snap) {
    if (!layer) return;
    layer.userTouched = true;
    if (snap && I.pushUndo) I.pushUndo(snap);
    if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H || 0);
    if (I.omScheduleSave) I.omScheduleSave();
    updateMtReadouts();
    drawGizmo();
  }

  function getLayerMatrix(layer) {
    const val2 = I.val2;
    if (!val2 || !val2.scene || !val2.canvas) return null;
    const viewRect = val2.canvas.getBoundingClientRect();
    if (!viewRect.width || !val2.scene.height) return null;
    const scaleFactor = viewRect.height / val2.scene.height;

    const tSec = (I.H || 0) / 1000;
    const localTime = Math.max(0, (I.H || 0) - (layer.startTime || 0)) / 1000;
    const xVal = val2.X ? val2.X(layer, (I.H || 0) - (layer.startTime || 0)) : 0;
    const te2 = val2.te ? val2.te(layer, xVal !== null ? xVal : 0, localTime) : null;
    if (!te2) return null;

    const dummyCtx = {
      matrix: [1, 0, 0, 1, 0, 0],
      translate(x, y) { applyMat(this.matrix, [1, 0, 0, 1, x, y]); },
      rotate(rad) {
        const c = Math.cos(rad), s = Math.sin(rad);
        applyMat(this.matrix, [c, s, -s, c, 0, 0]);
      },
      scale(sx, sy) { applyMat(this.matrix, [sx, 0, 0, sy, 0, 0]); },
      transform(a, b, c, d, e, f) { applyMat(this.matrix, [a, b, c, d, e, f]); }
    };

    function applyMat(m, n) {
      const a = m[0]*n[0] + m[2]*n[1];
      const b = m[1]*n[0] + m[3]*n[1];
      const c = m[0]*n[2] + m[2]*n[3];
      const d = m[1]*n[2] + m[3]*n[3];
      const e = m[0]*n[4] + m[2]*n[5] + m[4];
      const f = m[1]*n[4] + m[3]*n[5] + m[5];
      m[0]=a; m[1]=b; m[2]=c; m[3]=d; m[4]=e; m[5]=f;
    }

    val2.Ce(dummyCtx, layer, te2, scaleFactor, localTime);
    const size = val2.se ? val2.se(layer, val2.scene) : [100, 100];
    const w = size[0] * scaleFactor;
    const h = size[1] * scaleFactor;

    return { m: dummyCtx.matrix, w, h, viewRect, scaleFactor };
  }

  function transformPoint(m, x, y) {
    return {
      x: m[0] * x + m[2] * y + m[4],
      y: m[1] * x + m[3] * y + m[5]
    };
  }

  function drawGizmo() {
    if (!gizmoCanvas) return;
    const ctx = gizmoCanvas.getContext("2d");
    if (!ctx) return;

    const stageRect = stageEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const rw = Math.round(stageRect.width * dpr);
    const rh = Math.round(stageRect.height * dpr);
    if (gizmoCanvas.width !== rw || gizmoCanvas.height !== rh) {
      gizmoCanvas.width = rw;
      gizmoCanvas.height = rh;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, rw, rh);

    const layer = getCurLayer();
    if (!layer || layer.hidden) return;

    const geom = getLayerMatrix(layer);
    if (!geom) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    const { m, w, h, viewRect } = geom;
    const offsetX = viewRect.left - stageRect.left;
    const offsetY = viewRect.top - stageRect.top;
    ctx.translate(offsetX, offsetY);

    const nw = transformPoint(m, -w/2, -h/2);
    const ne = transformPoint(m, w/2, -h/2);
    const se = transformPoint(m, w/2, h/2);
    const sw = transformPoint(m, -w/2, h/2);
    const pivot = transformPoint(m, 0, 0);

    const topMid = transformPoint(m, 0, -h/2);
    const rotNorm = { x: -m[2], y: -m[3] };
    const rotLen = Math.hypot(rotNorm.x, rotNorm.y) || 1;
    const rotKnob = {
      x: topMid.x + (rotNorm.x / rotLen) * 24,
      y: topMid.y + (rotNorm.y / rotLen) * 24
    };

    layer.__gizmoBounds = { nw, ne, se, sw, pivot, rotKnob, offsetX, offsetY, geom };

    ctx.strokeStyle = "#00ffa8";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(nw.x, nw.y);
    ctx.lineTo(ne.x, ne.y);
    ctx.lineTo(se.x, se.y);
    ctx.lineTo(sw.x, sw.y);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(0, 255, 168, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(topMid.x, topMid.y);
    ctx.lineTo(rotKnob.x, rotKnob.y);
    ctx.stroke();

    ctx.fillStyle = "#00ffa8";
    ctx.strokeStyle = "#141620";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rotKnob.x, rotKnob.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const corners = [nw, ne, se, sw];
    ctx.fillStyle = "#00ffa8";
    corners.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#141620";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.fillStyle = "#ffd600";
    ctx.strokeStyle = "#141620";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pivot.x, pivot.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#ffd600";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pivot.x - 6, pivot.y);
    ctx.lineTo(pivot.x + 6, pivot.y);
    ctx.moveTo(pivot.x, pivot.y - 6);
    ctx.lineTo(pivot.x, pivot.y + 6);
    ctx.stroke();

    ctx.restore();
  }

  if (gizmoCanvas) {
    gizmoCanvas.addEventListener("pointerdown", e => {
      const layer = getCurLayer();
      if (!layer || !layer.__gizmoBounds) return;
      const b = layer.__gizmoBounds;
      const stageRect = stageEl.getBoundingClientRect();
      const px = e.clientX - stageRect.left - b.offsetX;
      const py = e.clientY - stageRect.top - b.offsetY;

      if (Math.hypot(px - b.rotKnob.x, py - b.rotKnob.y) < 14) {
        startGizmoDrag(e, "rot", layer);
        return;
      }
      if (Math.hypot(px - b.pivot.x, py - b.pivot.y) < 12) {
        startGizmoDrag(e, "pivot", layer);
        return;
      }
      if (Math.hypot(px - b.nw.x, py - b.nw.y) < 12 || Math.hypot(px - b.ne.x, py - b.ne.y) < 12 ||
          Math.hypot(px - b.se.x, py - b.se.y) < 12 || Math.hypot(px - b.sw.x, py - b.sw.y) < 12) {
        startGizmoDrag(e, "scale", layer);
        return;
      }
      if (pointInQuad(px, py, b.nw, b.ne, b.se, b.sw)) {
        startGizmoDrag(e, "pos", layer);
        return;
      }
    });
  }

  function pointInQuad(px, py, p1, p2, p3, p4) {
    function sign(x1, y1, x2, y2, x3, y3) {
      return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
    }
    const b1 = sign(px, py, p1.x, p1.y, p2.x, p2.y) < 0.0;
    const b2 = sign(px, py, p2.x, p2.y, p3.x, p3.y) < 0.0;
    const b3 = sign(px, py, p3.x, p3.y, p4.x, p4.y) < 0.0;
    const b4 = sign(px, py, p4.x, p4.y, p1.x, p1.y) < 0.0;
    return ((b1 === b2) && (b2 === b3) && (b3 === b4));
  }

  function startGizmoDrag(e, mode, layer) {
    e.stopPropagation();
    e.preventDefault();
    gizmoCanvas.setPointerCapture(e.pointerId);

    const tr = ensureTransform(layer);
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const scaleFactor = layer.__gizmoBounds.geom.scaleFactor || 1;

    activeGizmoDrag = {
      mode,
      layer,
      snap,
      startX: e.clientX,
      startY: e.clientY,
      initLoc: [...(tr.location.value || [0, 0, 0])],
      initScale: [...(tr.scale.value || [1, 1])],
      initRot: Number(tr.rotation.value ? tr.rotation.value[0] : 0),
      initPivot: [...(tr.pivot.value || [0, 0])],
      scaleFactor,
      pivotScreen: layer.__gizmoBounds.pivot
    };

    const onMove = ev => {
      if (!activeGizmoDrag) return;
      const d = activeGizmoDrag;
      const dx = (ev.clientX - d.startX) / d.scaleFactor;
      const dy = (ev.clientY - d.startY) / d.scaleFactor;

      if (d.mode === "pos") {
        const nx = Math.round(d.initLoc[0] + dx);
        const ny = Math.round(d.initLoc[1] + dy);
        setPropValue(d.layer, "location", [nx, ny, d.initLoc[2] || 0]);
      } else if (d.mode === "pivot") {
        const npx = Math.round(d.initPivot[0] + dx);
        const npy = Math.round(d.initPivot[1] + dy);
        setPropValue(d.layer, "pivot", [npx, npy]);
      } else if (d.mode === "rot") {
        const stageRect = stageEl.getBoundingClientRect();
        const b = d.layer.__gizmoBounds;
        const curPx = ev.clientX - stageRect.left - b.offsetX;
        const curPy = ev.clientY - stageRect.top - b.offsetY;
        const angle = Math.atan2(curPy - d.pivotScreen.y, curPx - d.pivotScreen.x) * (180 / Math.PI) + 90;
        setPropValue(d.layer, "rotation", [Math.round(angle * 10) / 10]);
      } else if (d.mode === "scale") {
        const factorX = 1 + dx / 150;
        const factorY = 1 + dy / 150;
        const factor = Math.max(0.05, linkAspect ? (factorX + factorY) / 2 : factorX);
        const nsx = Math.round(d.initScale[0] * factor * 100) / 100;
        const nsy = Math.round(d.initScale[1] * (linkAspect ? factor : factorY) * 100) / 100;
        setPropValue(d.layer, "scale", [nsx, nsy]);
      }

      if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H || 0);
      updateMtReadouts();
      drawGizmo();
    };

    const onUp = ev => {
      try { gizmoCanvas.releasePointerCapture(ev.pointerId); } catch {}
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (activeGizmoDrag && activeGizmoDrag.snap && I.pushUndo) {
        I.pushUndo(activeGizmoDrag.snap);
      }
      activeGizmoDrag = null;
      drawGizmo();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function openMoveTransform(layer) {
    let l = layer || getCurLayer();
    if (!l) {
      if (I.handle9) I.handle9("[EDIT] Pilih layer terlebih dahulu");
      return;
    }
    ensureTransform(l);
    mtPanel.classList.add("on");
    const propsPanel = document.getElementById("om-props");
    if (propsPanel) propsPanel.classList.remove("on");
    const elemBar = document.getElementById("om-elembar");
    if (elemBar) elemBar.classList.remove("on");
    const simpleHint = document.getElementById("simpleHint");
    if (simpleHint) simpleHint.remove();

    document.getElementById("omMtLayerName").textContent = l.label || l.id;
    updateMtCenter();
    updateMtReadouts();
    updateMtKfButton();
    drawGizmo();
  }

  function closeMoveTransform() {
    mtPanel.classList.remove("on");
    const elemBar = document.getElementById("om-elembar");
    if (elemBar && getCurLayer()) elemBar.classList.add("on");
    drawGizmo();
  }

  function updateMtCenter() {
    const center = document.getElementById("omMtCenter");
    if (!center) return;
    center.innerHTML = "";

    const layer = getCurLayer();
    if (!layer) return;
    const tr = ensureTransform(layer);

    if (curTab === "pos" || curTab === "pivot") {
      const isPivot = curTab === "pivot";
      const pad = document.createElement("div");
      pad.className = "om-mt-pad";
      pad.innerHTML = `
        <div class="om-mt-corner nw"><img src="./icons/ic_transform_guide_topleft.svg" alt=""></div>
        <div class="om-mt-corner ne"><img src="./icons/ic_transform_guide_topright.svg" alt=""></div>
        <div class="om-mt-corner sw"><img src="./icons/ic_transform_guide_bottomleft.svg" alt=""></div>
        <div class="om-mt-corner se"><img src="./icons/ic_transform_guide_bottomright.svg" alt=""></div>
        <div class="om-mt-axis-h"></div>
        <div class="om-mt-axis-v"></div>
        <span class="om-mt-axis-tag-x">X</span>
        <span class="om-mt-axis-tag-y">Y</span>
        <div class="om-mt-pad-guide">
          <img src="${isPivot ? "./icons/ac_ic_move_pivot.svg" : "./icons/ac_ic_move.svg"}" width="24" height="24" style="opacity:0.7">
          <span>${isPivot ? "Geser untuk memindahkan titik jangkar (pivot)" : "Geser ke mana saja untuk memindahkan layer"}</span>
        </div>
      `;
      setupPadDrag(pad, (dx, dy) => {
        const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
        if (isPivot) {
          const p = tr.pivot.value || [0, 0];
          setPropValue(layer, "pivot", [Math.round(p[0] + dx), Math.round(p[1] + dy)]);
        } else {
          const l = tr.location.value || [0, 0, 0];
          setPropValue(layer, "location", [Math.round(l[0] + dx), Math.round(l[1] + dy), l[2] || 0]);
        }
        commitTransformChange(layer, snap);
      });
      center.appendChild(pad);
    } else if (curTab === "rot") {
      const wrap = document.createElement("div");
      wrap.className = "om-mt-wheel-wrap";
      const deg = Number(tr.rotation.value ? tr.rotation.value[0] : 0);
      wrap.innerHTML = `
        <div class="om-mt-wheel-val" id="omMtWheelVal">${deg.toFixed(1)}°</div>
        <div class="om-mt-wheel" id="omMtWheel">
          <div class="om-mt-needle" id="omMtNeedle" style="transform: rotate(${deg}deg)"></div>
          <div class="om-mt-wheel-center"></div>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute;inset:0;pointer-events:none">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="2 6"/>
            <line x1="50" y1="4" x2="50" y2="10" stroke="#00ffa8" stroke-width="2"/>
            <line x1="96" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
            <line x1="50" y1="96" x2="50" y2="90" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
            <line x1="4" y1="50" x2="10" y2="50" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
          </svg>
        </div>
      `;
      const wheel = wrap.querySelector("#omMtWheel");
      setupWheelDrag(wheel, angle => {
        const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
        setPropValue(layer, "rotation", [Math.round(angle * 10) / 10]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(wrap);
    } else if (curTab === "scale") {
      const pad = document.createElement("div");
      pad.className = "om-mt-pad";
      pad.innerHTML = `
        <div class="om-mt-corner nw"><img src="./icons/ic_transform_guide_topleft.svg" alt=""></div>
        <div class="om-mt-corner ne"><img src="./icons/ic_transform_guide_topright.svg" alt=""></div>
        <div class="om-mt-corner sw"><img src="./icons/ic_transform_guide_bottomleft.svg" alt=""></div>
        <div class="om-mt-corner se"><img src="./icons/ic_transform_guide_bottomright.svg" alt=""></div>
        <div class="om-mt-axis-h"></div>
        <div class="om-mt-axis-v"></div>
        <span class="om-mt-axis-tag-x">X</span>
        <span class="om-mt-axis-tag-y">Y</span>
        <div class="om-mt-pad-guide">
          <img src="./icons/ac_ic_scale.svg" width="24" height="24" style="opacity:0.7">
          <span>Geser ke atas/kanan untuk memperbesar, ke bawah/kiri untuk memperkecil</span>
        </div>
      `;
      setupPadDrag(pad, (dx, dy) => {
        const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
        const cur = tr.scale.value || [1, 1];
        const factor = (dx - dy) / 120;
        const nsx = Math.max(0.01, Math.round((cur[0] + factor) * 100) / 100);
        const nsy = Math.max(0.01, Math.round((cur[1] + (linkAspect ? factor : -dy / 120)) * 100) / 100);
        setPropValue(layer, "scale", [nsx, nsy]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(pad);
    } else if (curTab === "skew") {
      const pad = document.createElement("div");
      pad.className = "om-mt-pad";
      pad.innerHTML = `
        <div class="om-mt-corner nw"><img src="./icons/ic_transform_guide_topleft.svg" alt=""></div>
        <div class="om-mt-corner ne"><img src="./icons/ic_transform_guide_topright.svg" alt=""></div>
        <div class="om-mt-corner sw"><img src="./icons/ic_transform_guide_bottomleft.svg" alt=""></div>
        <div class="om-mt-corner se"><img src="./icons/ic_transform_guide_bottomright.svg" alt=""></div>
        <div class="om-mt-axis-h"></div>
        <div class="om-mt-axis-v"></div>
        <span class="om-mt-axis-tag-x">X</span>
        <span class="om-mt-axis-tag-y">Y</span>
        <div class="om-mt-pad-guide">
          <img src="./icons/ac_ic_skew.svg" width="24" height="24" style="opacity:0.7">
          <span>Geser horizontal untuk Skew X, vertikal untuk Skew Y</span>
        </div>
      `;
      setupPadDrag(pad, (dx, dy) => {
        const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
        const cur = tr.skew.value || [0, 0];
        const nx = Math.round((cur[0] + dx * 0.2) * 10) / 10;
        const ny = Math.round((cur[1] + dy * 0.2) * 10) / 10;
        setPropValue(layer, "skew", [nx, ny]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(pad);
    }
  }

  function setupPadDrag(el, onDelta) {
    let lastX = 0, lastY = 0, isDragging = false;
    el.addEventListener("pointerdown", e => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", e => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      onDelta(dx, dy);
    });
    const end = e => {
      isDragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function setupWheelDrag(el, onAngle) {
    let isDragging = false;
    const compute = e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
      let deg = rad * (180 / Math.PI) + 90;
      if (deg < 0) deg += 360;
      onAngle(deg);
      const needle = el.querySelector("#omMtNeedle");
      if (needle) needle.style.transform = `rotate(${deg}deg)`;
      const valEl = document.getElementById("omMtWheelVal");
      if (valEl) valEl.textContent = `${deg.toFixed(1)}°`;
    };
    el.addEventListener("pointerdown", e => {
      isDragging = true;
      el.setPointerCapture(e.pointerId);
      compute(e);
    });
    el.addEventListener("pointermove", e => {
      if (!isDragging) return;
      compute(e);
    });
    const end = e => {
      isDragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function updateMtReadouts() {
    const r = document.getElementById("omMtReadout");
    if (!r) return;
    const layer = getCurLayer();
    if (!layer) return;
    const tr = ensureTransform(layer);

    if (curTab === "pos") {
      const loc = tr.location.value || [0, 0, 0];
      r.innerHTML = `
        <label class="om-mt-pill"><span>X</span><input type="number" id="omMtInpX" value="${Math.round(loc[0])}">px</label>
        <label class="om-mt-pill"><span>Y</span><input type="number" id="omMtInpY" value="${Math.round(loc[1])}">px</label>
        <label class="om-mt-pill"><span>Z</span><input type="number" id="omMtInpZ" value="${Math.round(loc[2] || 0)}"></label>
        <button type="button" class="om-mt-btn-toggle" id="omMtTogglePivotBtn">Titik Jangkar (Pivot)</button>
      `;
      bindPillInput("omMtInpX", v => setPropValue(layer, "location", [v, loc[1], loc[2] || 0]));
      bindPillInput("omMtInpY", v => setPropValue(layer, "location", [loc[0], v, loc[2] || 0]));
      bindPillInput("omMtInpZ", v => setPropValue(layer, "location", [loc[0], loc[1], v]));
      r.querySelector("#omMtTogglePivotBtn").addEventListener("click", () => switchTab("pivot"));
    } else if (curTab === "pivot") {
      const p = tr.pivot.value || [0, 0];
      r.innerHTML = `
        <label class="om-mt-pill"><span>Jangkar X</span><input type="number" id="omMtInpPX" value="${Math.round(p[0])}">px</label>
        <label class="om-mt-pill"><span>Jangkar Y</span><input type="number" id="omMtInpPY" value="${Math.round(p[1])}">px</label>
        <button type="button" class="om-mt-btn-toggle active" id="omMtBackPosBtn">Kembali ke Posisi</button>
      `;
      bindPillInput("omMtInpPX", v => setPropValue(layer, "pivot", [v, p[1]]));
      bindPillInput("omMtInpPY", v => setPropValue(layer, "pivot", [p[0], v]));
      r.querySelector("#omMtBackPosBtn").addEventListener("click", () => switchTab("pos"));
    } else if (curTab === "rot") {
      const deg = Number(tr.rotation.value ? tr.rotation.value[0] : 0);
      r.innerHTML = `
        <label class="om-mt-pill"><span>Sudut</span><input type="number" step="0.5" id="omMtInpRot" value="${deg}">°</label>
        <button type="button" class="om-mt-btn-toggle" id="omMtResetRot">Reset 0°</button>
      `;
      bindPillInput("omMtInpRot", v => setPropValue(layer, "rotation", [v]));
      r.querySelector("#omMtResetRot").addEventListener("click", () => {
        setPropValue(layer, "rotation", [0]);
        commitTransformChange(layer, I.sceneSnapshot ? I.sceneSnapshot() : null);
        updateMtCenter();
      });
    } else if (curTab === "scale") {
      const sc = tr.scale.value || [1, 1];
      r.innerHTML = `
        <label class="om-mt-pill"><span>Skala X</span><input type="number" step="0.1" id="omMtInpSX" value="${sc[0]}"></label>
        <button type="button" class="om-mt-btn-toggle ${linkAspect ? "active" : ""}" id="omMtLinkAspect" title="Kunci perbandingan aspek">
          ${linkAspect ? "🔗 Terkunci" : "🔓 Bebas"}
        </button>
        <label class="om-mt-pill"><span>Skala Y</span><input type="number" step="0.1" id="omMtInpSY" value="${sc[1]}"></label>
      `;
      bindPillInput("omMtInpSX", v => {
        const ny = linkAspect ? v : sc[1];
        setPropValue(layer, "scale", [v, ny]);
      });
      bindPillInput("omMtInpSY", v => {
        const nx = linkAspect ? v : sc[0];
        setPropValue(layer, "scale", [nx, v]);
      });
      r.querySelector("#omMtLinkAspect").addEventListener("click", () => {
        linkAspect = !linkAspect;
        updateMtReadouts();
      });
    } else if (curTab === "skew") {
      const sk = tr.skew.value || [0, 0];
      r.innerHTML = `
        <label class="om-mt-pill"><span>Skew X</span><input type="number" step="0.5" id="omMtInpSKX" value="${sk[0]}">°</label>
        <label class="om-mt-pill"><span>Skew Y</span><input type="number" step="0.5" id="omMtInpSKY" value="${sk[1]}">°</label>
        <button type="button" class="om-mt-btn-toggle" id="omMtResetSkew">Reset 0°</button>
      `;
      bindPillInput("omMtInpSKX", v => setPropValue(layer, "skew", [v, sk[1]]));
      bindPillInput("omMtInpSKY", v => setPropValue(layer, "skew", [sk[0], v]));
      r.querySelector("#omMtResetSkew").addEventListener("click", () => {
        setPropValue(layer, "skew", [0, 0]);
        commitTransformChange(layer, I.sceneSnapshot ? I.sceneSnapshot() : null);
        updateMtCenter();
      });
    }
  }

  function bindPillInput(id, onChange) {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("change", () => {
      const v = Number(inp.value) || 0;
      const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
      onChange(v);
      commitTransformChange(getCurLayer(), snap);
    });
  }

  function switchTab(tab) {
    if (tab === "pos" && curTab === "pos") curTab = "pivot";
    else if (tab === "pos" && curTab === "pivot") curTab = "pos";
    else curTab = tab;

    document.querySelectorAll("#omMtTabs .om-mt-tab-btn").forEach(btn => {
      const t = btn.dataset.tab;
      btn.classList.toggle("active", t === (curTab === "pivot" ? "pos" : curTab));
      btn.classList.toggle("pivot-mode", curTab === "pivot" && t === "pos");
    });
    const posLabel = document.getElementById("omMtPosLabel");
    if (posLabel) posLabel.textContent = curTab === "pivot" ? "Jangkar" : "Posisi";
    const posIcon = document.getElementById("omMtPosIcon");
    if (posIcon) posIcon.src = curTab === "pivot" ? "./icons/ac_ic_move_pivot.svg" : "./icons/ac_ic_move.svg";

    updateMtCenter();
    updateMtReadouts();
    updateMtKfButton();
  }

  function updateMtKfButton() {
    const kfBtn = document.getElementById("omMtKfBtn");
    if (!kfBtn) return;
    const prop = getActiveProp();
    const tt = (I.H || 0) / 1000;
    const hasKfAtPlayhead = prop && prop.kfs && prop.kfs.some(k => Math.abs(Number(k.t) - tt) < 0.002);
    kfBtn.classList.toggle("active", !!hasKfAtPlayhead);
    const img = kfBtn.querySelector("img");
    if (img) {
      img.src = hasKfAtPlayhead ? "./icons/ic_keyframe_delete_big.svg" : "./icons/ic_keyframe_add_big.svg";
    }
  }

  function stepToKeyframe(direction) {
    const prop = getActiveProp();
    if (!prop || !prop.kfs || !prop.kfs.length) {
      if (I.handle9) I.handle9("[KEYFRAME] Tidak ada keyframe pada properti aktif");
      return;
    }
    const curT = (I.H || 0) / 1000;
    let targetKf = null;
    if (direction < 0) {
      const prevs = prop.kfs.filter(k => Number(k.t) < curT - 0.005);
      if (!prevs.length) return;
      targetKf = prevs.reduce((p, c) => (Number(c.t) > Number(p.t) ? c : p));
    } else {
      const nexts = prop.kfs.filter(k => Number(k.t) > curT + 0.005);
      if (!nexts.length) return;
      targetKf = nexts.reduce((p, c) => (Number(c.t) < Number(p.t) ? c : p));
    }
    if (!targetKf) return;
    const targetMs = Math.round(Number(targetKf.t) * 1000);
    if (I.seek) {
      I.seek(targetMs);
    } else {
      I.H = targetMs;
      if (I.val2 && I.val2.renderAt) I.val2.renderAt(targetMs);
    }
    updateMtKfButton();
    updateMtReadouts();
    drawGizmo();
  }

  function resetCurrentTransform() {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return;
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;

    if (curTab === "pos") {
      setPropValue(layer, "location", [0, 0, 0]);
    } else if (curTab === "pivot") {
      setPropValue(layer, "pivot", [0, 0]);
    } else if (curTab === "rot") {
      setPropValue(layer, "rotation", [0]);
    } else if (curTab === "scale") {
      setPropValue(layer, "scale", [1, 1]);
    } else if (curTab === "skew") {
      setPropValue(layer, "skew", [0, 0]);
    }
    commitTransformChange(layer, snap);
    updateMtCenter();
    updateMtReadouts();
    updateMtKfButton();
    drawGizmo();
    if (I.handle9) I.handle9("[TRANSFORM] Properti di-reset");
  }

  function upgradeMultiSelectBar() {
    let bar = document.getElementById("omMultiBar");
    if (!I.omMulti || !I.omMulti.size) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "omMultiBar";
      document.body.appendChild(bar);
    }
    const count = I.omMulti.size;
    bar.innerHTML = `
      <span id="omMultiCount">${count} dipilih</span>
      <button type="button" id="omMGroup" title="Gabung jadi Grup biasa">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>
        <span>Grup</span>
      </button>
      <button type="button" id="omMMask" title="Grup Mask (layer atas memotong layer bawah)">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6" stroke-dasharray="2 2"/></svg>
        <span>Mask</span>
      </button>
      <button type="button" id="omMExclude" title="Grup Exclude">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="12" height="12"/><rect x="9" y="9" width="12" height="12"/></svg>
        <span>Exclude</span>
      </button>
      <button type="button" class="danger" id="omMDelete" title="Hapus layer terpilih">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/></svg>
        <span>Hapus</span>
      </button>
      <button type="button" class="ghost-cancel" id="omMClear" title="Batal">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    bar.querySelector("#omMGroup").addEventListener("click", () => executeGroup("group"));
    bar.querySelector("#omMMask").addEventListener("click", () => executeGroup("mask"));
    bar.querySelector("#omMExclude").addEventListener("click", () => executeGroup("exclude"));
    bar.querySelector("#omMDelete").addEventListener("click", () => {
      if (typeof window.omMultiDelete === "function") window.omMultiDelete();
    });
    bar.querySelector("#omMClear").addEventListener("click", () => {
      if (typeof window.omMultiClear === "function") window.omMultiClear();
    });
  }

  function executeGroup(type) {
    if (!I.val || !I.omMulti || !I.omMulti.size) return;
    const ids = [...I.omMulti];
    const layers = ids.map(id => typeof window.omResolveLayer === "function" ? window.omResolveLayer(id) : null).filter(Boolean);
    if (!layers.length) return;

    const m = I.omMeta ? I.omMeta() : { w: 720, h: 1280, total: 10000, fps: 30 };
    const parents = new Set(layers.map(l => I.findParentArray ? I.findParentArray(l) : null));
    if (parents.size > 1) {
      if (I.handle9) I.handle9("[GRUP] Pilih layer dari level grup yang sama");
      return;
    }
    const par = parents.values().next().value;
    if (!par) return;

    const xmls = layers.map(l => l.sourceXml || "").filter(Boolean);
    if (!xmls.length) return;

    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const title = type === "mask" ? "Grup Masker" : (type === "exclude" ? "Grup Exclude" : "Grup");
    const maskAttr = type === "mask" ? ' mask="alpha"' : (type === "exclude" ? ' blendMode="exclude"' : "");

    const inner = `<scene title="${title}" width="${m.w}" height="${m.h}" exportWidth="${m.w}" exportHeight="${m.h}" precompose="dynamicResolution" bgcolor="#ff000000" totalTime="${m.total}" fps="${m.fps}">${xmls.join('')}</scene>`;
    const gXml = `<embedScene id="${I.omId()}" label="${title}" startTime="0" endTime="${m.total}"${maskAttr}>${inner}${I.omTransformXml(Math.round(m.w / 2), Math.round(m.h / 2), 1)}</embedScene>`;

    const g = I.omParseLayer(gXml);
    if (!g) return;

    layers.forEach(l => {
      const p = I.findParentArray ? I.findParentArray(l) : null;
      if (p) p.splice(p.indexOf(l), 1);
    });
    par.push(g);

    if (I.pushUndo) I.pushUndo(snap);
    I.V = true;
    I.omMulti.clear();
    if (I.handle9) I.handle9(`[GRUP] ${xmls.length} layer digabung jadi "${title}"`);
    upgradeMultiSelectBar();

    if (I.omHandle21InContext) {
      I.omHandle21InContext().then(() => {
        upgradeMultiSelectBar();
        drawGizmo();
      });
    }
  }

  document.getElementById("omMtClose").addEventListener("click", closeMoveTransform);

  document.querySelectorAll("#omMtTabs .om-mt-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("omMtKfBtn").addEventListener("click", () => {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return;
    const propKey = getActivePropKey();
    const prop = getActiveProp();
    const tt = (I.H || 0) / 1000;
    const hasKfAtPlayhead = prop && prop.kfs && prop.kfs.some(k => Math.abs(Number(k.t) - tt) < 0.002);
    if (hasKfAtPlayhead) {
      if (I.omKfRemoveAt) I.omKfRemoveAt(propKey);
    } else {
      if (I.omKfInsert) I.omKfInsert(propKey);
    }
    updateMtKfButton();
    drawGizmo();
  });

  document.getElementById("omMtKfPrevBtn").addEventListener("click", () => stepToKeyframe(-1));
  document.getElementById("omMtKfNextBtn").addEventListener("click", () => stepToKeyframe(1));
  document.getElementById("omMtResetBtn").addEventListener("click", resetCurrentTransform);

  document.getElementById("omMtCurveBtn").addEventListener("click", () => {
    if (typeof window.omOpenCurveEditor === "function") {
      const curL = getCurLayer();
      const pKey = getActivePropKey();
      const pPanel = document.getElementById("omMtPanel");
      if (pPanel) pPanel.classList.remove("on");
      window.omOpenCurveEditor({
        prop: pKey,
        layer: curL,
        onBack: () => {
          if (pPanel) pPanel.classList.add("on");
        }
      });
    } else if (I.omOpenCurve) {
      I.omOpenCurve();
    }
  });

  window.omOpenMoveTransform = openMoveTransform;
  window.omCloseMoveTransform = closeMoveTransform;
  window.omDrawGizmo = drawGizmo;
  window.omUpgradeMultiSelectBar = upgradeMultiSelectBar;

  window.omOnLayerSelected = function(l) {
    if (mtPanel.classList.contains("on")) {
      if (!l) closeMoveTransform();
      else {
        document.getElementById("omMtLayerName").textContent = l.label || l.id;
        updateMtCenter();
        updateMtReadouts();
        updateMtKfButton();
      }
    }
    drawGizmo();
  };

  window.omOnRender = function() {
    drawGizmo();
    if (mtPanel.classList.contains("on")) {
      updateMtKfButton();
    }
  };

  setInterval(() => {
    if (I.omMulti) upgradeMultiSelectBar();
  }, 300);

  window.addEventListener("resize", drawGizmo);
})();
