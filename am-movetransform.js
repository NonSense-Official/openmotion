(function initAmMoveTransform() {
  const initAmMoveTransfValue = window.__AM_INTERNAL || {};
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
    if (initAmMoveTransfValue.omLayerCur) return initAmMoveTransfValue.omLayerCur();
    if (typeof window.omPropsLayerId !== "undefined" && typeof window.omResolveLayer === "function") {
      return window.omResolveLayer(window.omPropsLayerId);
    }
    return null;
  }

  function ensureTransform(ensureTransformResult) {
    if (!ensureTransformResult) return null;
    ensureTransformResult.transform = ensureTransformResult.transform || {};
    if (!ensureTransformResult.transform.location) ensureTransformResult.transform.location = { value: [0, 0, 0], kfs: [] };
    if (!ensureTransformResult.transform.scale) ensureTransformResult.transform.scale = { value: [1, 1], kfs: [] };
    if (!ensureTransformResult.transform.rotation) ensureTransformResult.transform.rotation = { value: [0], kfs: [] };
    if (!ensureTransformResult.transform.pivot) ensureTransformResult.transform.pivot = { value: [0, 0], kfs: [] };
    if (!ensureTransformResult.transform.skew) ensureTransformResult.transform.skew = { value: [0, 0], kfs: [] };
    return ensureTransformResult.transform;
  }

  function getActiveProp() {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return null;
    const transform = layer.transform;
    if (curTab === "rot") return transform.rotation;
    if (curTab === "scale") return transform.scale;
    if (curTab === "pivot") return transform.pivot;
    if (curTab === "skew") return transform.skew;
    return transform.location;
  }

  function getActivePropKey() {
    if (curTab === "rot") return "rot";
    if (curTab === "scale") return "sc";
    if (curTab === "pivot") return "pivot";
    if (curTab === "skew") return "skew";
    return "loc";
  }

  function setPropValue(layer, propName, valArr) {
    const setPropValueEnsureTransform = ensureTransform(layer);
    const prop = setPropValueEnsureTransform[propName];
    if (!prop) return;
    const setPropValueResult = (initAmMoveTransfValue.H || 0) / 1000;
    if (prop.kfs && prop.kfs.length && initAmMoveTransfValue.omSetKeyable) {
      initAmMoveTransfValue.omSetKeyable(prop, valArr);
    } else if (prop.kfs && prop.kfs.length) {
      let setPropValueFlag = prop.kfs.find(setPropValueT => Math.abs(Number(setPropValueT.t) - setPropValueResult) < 0.002);
      const setPropValueV = Array.isArray(valArr) ? [...valArr] : [valArr];
      if (setPropValueFlag) {
        setPropValueFlag.v = setPropValueV;
      } else {
        prop.kfs.push({ t: setPropValueResult, v: setPropValueV, e: null, easing: null });
        prop.kfs.sort((setPropValueArg, setPropValueArgValue) => Number(setPropValueArg.t) - Number(setPropValueArgValue.t));
      }
      prop.value = valArr;
    } else {
      prop.value = valArr;
    }
  }

  function commitTransformChange(layer, snap) {
    if (!layer) return;
    layer.userTouched = true;
    if (snap && initAmMoveTransfValue.pushUndo) initAmMoveTransfValue.pushUndo(snap);
    if (initAmMoveTransfValue.val2 && initAmMoveTransfValue.val2.renderAt) initAmMoveTransfValue.val2.renderAt(initAmMoveTransfValue.H || 0);
    if (initAmMoveTransfValue.omScheduleSave) initAmMoveTransfValue.omScheduleSave();
    updateMtReadouts();
    drawGizmo();
  }

  function getLayerMatrix(layer) {
    const getLayerMatrixVal = initAmMoveTransfValue.val2;
    if (!getLayerMatrixVal || !getLayerMatrixVal.scene || !getLayerMatrixVal.canvas) return null;
    const viewRect = getLayerMatrixVal.canvas.getBoundingClientRect();
    if (!viewRect.width || !getLayerMatrixVal.scene.height) return null;
    const scaleFactor = viewRect.height / getLayerMatrixVal.scene.height;

    const tSec = (initAmMoveTransfValue.H || 0) / 1000;
    const localTime = Math.max(0, (initAmMoveTransfValue.H || 0) - (layer.startTime || 0)) / 1000;
    const xVal = getLayerMatrixVal.X ? getLayerMatrixVal.X(layer, (initAmMoveTransfValue.H || 0) - (layer.startTime || 0)) : 0;
    const getLayerMatrixValue = getLayerMatrixVal.te ? getLayerMatrixVal.te(layer, xVal !== null ? xVal : 0, localTime) : null;
    if (!getLayerMatrixValue) return null;

    const dummyCtx = {
      matrix: [1, 0, 0, 1, 0, 0],
      translate(getLayerMatrixArg, getLayerMatrixArgValue) { applyMat(this.matrix, [1, 0, 0, 1, getLayerMatrixArg, getLayerMatrixArgValue]); },
      rotate(dummyCtxValue) {
        const getLayerMatrixCos = Math.cos(dummyCtxValue), getLayerMatrixSin = Math.sin(dummyCtxValue);
        applyMat(this.matrix, [getLayerMatrixCos, getLayerMatrixSin, -getLayerMatrixSin, getLayerMatrixCos, 0, 0]);
      },
      scale(getLayerMatrixArgRaw, argRaw) { applyMat(this.matrix, [getLayerMatrixArgRaw, 0, 0, argRaw, 0, 0]); },
      transform(getLayerMatrixRaw, getLayerMatrixArgParsed, argParsed, getLayerMatrixParsed, getLayerMatrixArgClamped, argClamped) { applyMat(this.matrix, [getLayerMatrixRaw, getLayerMatrixArgParsed, argParsed, getLayerMatrixParsed, getLayerMatrixArgClamped, argClamped]); }
    };

    function applyMat(applyMatArg, applyMatArgValue) {
      const applyMatValue = applyMatArg[0]*applyMatArgValue[0] + applyMatArg[2]*applyMatArgValue[1];
      const applyMatResult = applyMatArg[1]*applyMatArgValue[0] + applyMatArg[3]*applyMatArgValue[1];
      const applyMatValueRaw = applyMatArg[0]*applyMatArgValue[2] + applyMatArg[2]*applyMatArgValue[3];
      const applyMatRaw = applyMatArg[1]*applyMatArgValue[2] + applyMatArg[3]*applyMatArgValue[3];
      const applyMatValueParsed = applyMatArg[0]*applyMatArgValue[4] + applyMatArg[2]*applyMatArgValue[5] + applyMatArg[4];
      const valueParsed = applyMatArg[1]*applyMatArgValue[4] + applyMatArg[3]*applyMatArgValue[5] + applyMatArg[5];
      applyMatArg[0]=applyMatValue; applyMatArg[1]=applyMatResult; applyMatArg[2]=applyMatValueRaw; applyMatArg[3]=applyMatRaw; applyMatArg[4]=applyMatValueParsed; applyMatArg[5]=valueParsed;
    }

    getLayerMatrixVal.Ce(dummyCtx, layer, getLayerMatrixValue, scaleFactor, localTime);
    const size = getLayerMatrixVal.se ? getLayerMatrixVal.se(layer, getLayerMatrixVal.scene) : [100, 100];
    const getLayerMatrixResult = size[0] * scaleFactor;
    const getLayerMatrixValueRaw = size[1] * scaleFactor;

    return { m: dummyCtx.matrix, w: getLayerMatrixResult, h: getLayerMatrixValueRaw, viewRect, scaleFactor };
  }

  function transformPoint(transformPointArg, transformPointArgValue, argValue) {
    return {
      x: transformPointArg[0] * transformPointArgValue + transformPointArg[2] * argValue + transformPointArg[4],
      y: transformPointArg[1] * transformPointArgValue + transformPointArg[3] * argValue + transformPointArg[5]
    };
  }

  function drawGizmo() {
    if (!gizmoCanvas) return;
    const ctx = gizmoCanvas.getContext("2d");
    if (!ctx) return;

    const stageRect = stageEl.getBoundingClientRect();
    const drawGizmoValue = window.devicePixelRatio || 1;
    const round = Math.round(stageRect.width * drawGizmoValue);
    const drawGizmoRound = Math.round(stageRect.height * drawGizmoValue);
    if (gizmoCanvas.width !== round || gizmoCanvas.height !== drawGizmoRound) {
      gizmoCanvas.width = round;
      gizmoCanvas.height = drawGizmoRound;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, round, drawGizmoRound);

    const layer = getCurLayer();
    if (!layer || layer.hidden) return;

    const geom = getLayerMatrix(layer);
    if (!geom) return;

    ctx.save();
    ctx.scale(drawGizmoValue, drawGizmoValue);

    const { m: drawGizmoResult, w: valueRaw, h: drawGizmoValueRaw, viewRect } = geom;
    const offsetX = viewRect.left - stageRect.left;
    const offsetY = viewRect.top - stageRect.top;
    ctx.translate(offsetX, offsetY);

    const drawGizmoTransformPoint = transformPoint(drawGizmoResult, -valueRaw/2, -drawGizmoValueRaw/2);
    const transformPointValue = transformPoint(drawGizmoResult, valueRaw/2, -drawGizmoValueRaw/2);
    const drawGizmoX = transformPoint(drawGizmoResult, valueRaw/2, drawGizmoValueRaw/2);
    const xValue = transformPoint(drawGizmoResult, -valueRaw/2, drawGizmoValueRaw/2);
    const pivot = transformPoint(drawGizmoResult, 0, 0);

    const topMid = transformPoint(drawGizmoResult, 0, -drawGizmoValueRaw/2);
    const rotNorm = { x: -drawGizmoResult[2], y: -drawGizmoResult[3] };
    const rotLen = Math.hypot(rotNorm.x, rotNorm.y) || 1;
    const rotKnob = {
      x: topMid.x + (rotNorm.x / rotLen) * 24,
      y: topMid.y + (rotNorm.y / rotLen) * 24
    };

    layer.__gizmoBounds = { nw: drawGizmoTransformPoint, ne: transformPointValue, se: drawGizmoX, sw: xValue, pivot, rotKnob, offsetX, offsetY, geom };

    ctx.strokeStyle = "#00ffa8";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(drawGizmoTransformPoint.x, drawGizmoTransformPoint.y);
    ctx.lineTo(transformPointValue.x, transformPointValue.y);
    ctx.lineTo(drawGizmoX.x, drawGizmoX.y);
    ctx.lineTo(xValue.x, xValue.y);
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

    const corners = [drawGizmoTransformPoint, transformPointValue, drawGizmoX, xValue];
    ctx.fillStyle = "#00ffa8";
    corners.forEach(drawGizmoY => {
      ctx.beginPath();
      ctx.arc(drawGizmoY.x, drawGizmoY.y, 4.5, 0, Math.PI * 2);
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
    gizmoCanvas.addEventListener("pointerdown", clientX => {
      const layer = getCurLayer();
      if (!layer || !layer.__gizmoBounds) return;
      const gizmoBounds = layer.__gizmoBounds;
      const stageRect = stageEl.getBoundingClientRect();
      const initAmMoveTransformValue = clientX.clientX - stageRect.left - gizmoBounds.offsetX;
      const initAmMoveTransformValueRaw = clientX.clientY - stageRect.top - gizmoBounds.offsetY;

      if (Math.hypot(initAmMoveTransformValue - gizmoBounds.rotKnob.x, initAmMoveTransformValueRaw - gizmoBounds.rotKnob.y) < 14) {
        startGizmoDrag(clientX, "rot", layer);
        return;
      }
      if (Math.hypot(initAmMoveTransformValue - gizmoBounds.pivot.x, initAmMoveTransformValueRaw - gizmoBounds.pivot.y) < 12) {
        startGizmoDrag(clientX, "pivot", layer);
        return;
      }
      if (Math.hypot(initAmMoveTransformValue - gizmoBounds.nw.x, initAmMoveTransformValueRaw - gizmoBounds.nw.y) < 12 || Math.hypot(initAmMoveTransformValue - gizmoBounds.ne.x, initAmMoveTransformValueRaw - gizmoBounds.ne.y) < 12 ||
          Math.hypot(initAmMoveTransformValue - gizmoBounds.se.x, initAmMoveTransformValueRaw - gizmoBounds.se.y) < 12 || Math.hypot(initAmMoveTransformValue - gizmoBounds.sw.x, initAmMoveTransformValueRaw - gizmoBounds.sw.y) < 12) {
        startGizmoDrag(clientX, "scale", layer);
        return;
      }
      if (pointInQuad(initAmMoveTransformValue, initAmMoveTransformValueRaw, gizmoBounds.nw, gizmoBounds.ne, gizmoBounds.se, gizmoBounds.sw)) {
        startGizmoDrag(clientX, "pos", layer);
        return;
      }
    });
  }

  function pointInQuad(pointInQuadValue, pointInQuadArg, pointInQuadX, xArg, pointInQuadY, yArg) {
    function sign(signValue, signArgRaw, signRaw, signArgParsed, signArg, signArgValue) {
      return (signValue - signArg) * (signArgParsed - signArgValue) - (signRaw - signArg) * (signArgRaw - signArgValue);
    }
    const pointInQuadRaw = sign(pointInQuadValue, pointInQuadArg, pointInQuadX.x, pointInQuadX.y, xArg.x, xArg.y) < 0.0;
    const pointInQuadResult = sign(pointInQuadValue, pointInQuadArg, xArg.x, xArg.y, pointInQuadY.x, pointInQuadY.y) < 0.0;
    const pointInQuadValueRaw = sign(pointInQuadValue, pointInQuadArg, pointInQuadY.x, pointInQuadY.y, yArg.x, yArg.y) < 0.0;
    const pointInQuadValueParsed = sign(pointInQuadValue, pointInQuadArg, yArg.x, yArg.y, pointInQuadX.x, pointInQuadX.y) < 0.0;
    return ((pointInQuadRaw === pointInQuadResult) && (pointInQuadResult === pointInQuadValueRaw) && (pointInQuadValueRaw === pointInQuadValueParsed));
  }

  function startGizmoDrag(stopPropagation, mode, layer) {
    stopPropagation.stopPropagation();
    stopPropagation.preventDefault();
    gizmoCanvas.setPointerCapture(stopPropagation.pointerId);

    const startGizmoDragEnsureTransform = ensureTransform(layer);
    const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
    const scaleFactor = layer.__gizmoBounds.geom.scaleFactor || 1;

    activeGizmoDrag = {
      mode,
      layer,
      snap,
      startX: stopPropagation.clientX,
      startY: stopPropagation.clientY,
      initLoc: [...(startGizmoDragEnsureTransform.location.value || [0, 0, 0])],
      initScale: [...(startGizmoDragEnsureTransform.scale.value || [1, 1])],
      initRot: Number(startGizmoDragEnsureTransform.rotation.value ? startGizmoDragEnsureTransform.rotation.value[0] : 0),
      initPivot: [...(startGizmoDragEnsureTransform.pivot.value || [0, 0])],
      scaleFactor,
      pivotScreen: layer.__gizmoBounds.pivot
    };

    const onMove = ev => {
      if (!activeGizmoDrag) return;
      const startX = activeGizmoDrag;
      const onMoveValue = (ev.clientX - startX.startX) / startX.scaleFactor;
      const startGizmoDragValue = (ev.clientY - startX.startY) / startX.scaleFactor;

      if (startX.mode === "pos") {
        const startGizmoDragRound = Math.round(startX.initLoc[0] + onMoveValue);
        const roundValue = Math.round(startX.initLoc[1] + startGizmoDragValue);
        setPropValue(startX.layer, "location", [startGizmoDragRound, roundValue, startX.initLoc[2] || 0]);
      } else if (startX.mode === "pivot") {
        const startGizmoDragResult = Math.round(startX.initPivot[0] + onMoveValue);
        const startGizmoDragValueRaw = Math.round(startX.initPivot[1] + startGizmoDragValue);
        setPropValue(startX.layer, "pivot", [startGizmoDragResult, startGizmoDragValueRaw]);
      } else if (startX.mode === "rot") {
        const stageRect = stageEl.getBoundingClientRect();
        const startGizmoDragGizmoBounds = startX.layer.__gizmoBounds;
        const curPx = ev.clientX - stageRect.left - startGizmoDragGizmoBounds.offsetX;
        const curPy = ev.clientY - stageRect.top - startGizmoDragGizmoBounds.offsetY;
        const angle = Math.atan2(curPy - startX.pivotScreen.y, curPx - startX.pivotScreen.x) * (180 / Math.PI) + 90;
        setPropValue(startX.layer, "rotation", [Math.round(angle * 10) / 10]);
      } else if (startX.mode === "scale") {
        const factorX = 1 + onMoveValue / 150;
        const factorY = 1 + startGizmoDragValue / 150;
        const factor = Math.max(0.05, linkAspect ? (factorX + factorY) / 2 : factorX);
        const startGizmoDragRaw = Math.round(startX.initScale[0] * factor * 100) / 100;
        const startGizmoDragValueParsed = Math.round(startX.initScale[1] * (linkAspect ? factor : factorY) * 100) / 100;
        setPropValue(startX.layer, "scale", [startGizmoDragRaw, startGizmoDragValueParsed]);
      }

      if (initAmMoveTransfValue.val2 && initAmMoveTransfValue.val2.renderAt) initAmMoveTransfValue.val2.renderAt(initAmMoveTransfValue.H || 0);
      updateMtReadouts();
      drawGizmo();
    };

    const onUp = ev => {
      try { gizmoCanvas.releasePointerCapture(ev.pointerId); } catch {}
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (activeGizmoDrag && activeGizmoDrag.snap && initAmMoveTransfValue.pushUndo) {
        initAmMoveTransfValue.pushUndo(activeGizmoDrag.snap);
      }
      activeGizmoDrag = null;
      drawGizmo();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function openMoveTransform(layer) {
    let openMoveTransformValue = layer || getCurLayer();
    if (!openMoveTransformValue) {
      if (initAmMoveTransfValue.handle9) initAmMoveTransfValue.handle9("[EDIT] Pilih layer terlebih dahulu");
      return;
    }
    ensureTransform(openMoveTransformValue);
    mtPanel.classList.add("on");
    const propsPanel = document.getElementById("om-props");
    if (propsPanel) propsPanel.classList.remove("on");
    const elemBar = document.getElementById("om-elembar");
    if (elemBar) elemBar.classList.remove("on");
    const simpleHint = document.getElementById("simpleHint");
    if (simpleHint) simpleHint.remove();

    document.getElementById("omMtLayerName").textContent = openMoveTransformValue.label || openMoveTransformValue.id;
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
    const updateMtCenterEnsureTransform = ensureTransform(layer);

    if (curTab === "pos" || curTab === "pivot") {
      const isPivot = curTab === "pivot";
      const updateMtCenterDivEl = document.createElement("div");
      updateMtCenterDivEl.className = "om-mt-pad";
      updateMtCenterDivEl.innerHTML = `
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
      setupPadDrag(updateMtCenterDivEl, (updateMtCenterText, updateMtCenterArg) => {
        const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
        if (isPivot) {
          const updateMtCenterValue = updateMtCenterEnsureTransform.pivot.value || [0, 0];
          setPropValue(layer, "pivot", [Math.round(updateMtCenterValue[0] + updateMtCenterText), Math.round(updateMtCenterValue[1] + updateMtCenterArg)]);
        } else {
          const updateMtCenterResult = updateMtCenterEnsureTransform.location.value || [0, 0, 0];
          setPropValue(layer, "location", [Math.round(updateMtCenterResult[0] + updateMtCenterText), Math.round(updateMtCenterResult[1] + updateMtCenterArg), updateMtCenterResult[2] || 0]);
        }
        commitTransformChange(layer, snap);
      });
      center.appendChild(updateMtCenterDivEl);
    } else if (curTab === "rot") {
      const wrap = document.createElement("div");
      wrap.className = "om-mt-wheel-wrap";
      const updateMtCenterNumber = Number(updateMtCenterEnsureTransform.rotation.value ? updateMtCenterEnsureTransform.rotation.value[0] : 0);
      wrap.innerHTML = `
        <div class="om-mt-wheel-val" id="omMtWheelVal">${updateMtCenterNumber.toFixed(1)}°</div>
        <div class="om-mt-wheel" id="omMtWheel">
          <div class="om-mt-needle" id="omMtNeedle" style="transform: rotate(${updateMtCenterNumber}deg)"></div>
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
        const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
        setPropValue(layer, "rotation", [Math.round(angle * 10) / 10]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(wrap);
    } else if (curTab === "scale") {
      const divEl = document.createElement("div");
      divEl.className = "om-mt-pad";
      divEl.innerHTML = `
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
      setupPadDrag(divEl, (updateMtCenterArgRaw, updateMtCenterArgValue) => {
        const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
        const updateMtCenterValueRaw = updateMtCenterEnsureTransform.scale.value || [1, 1];
        const factor = (updateMtCenterArgRaw - updateMtCenterArgValue) / 120;
        const maxValue = Math.max(0.01, Math.round((updateMtCenterValueRaw[0] + factor) * 100) / 100);
        const updateMtCenterMax = Math.max(0.01, Math.round((updateMtCenterValueRaw[1] + (linkAspect ? factor : -updateMtCenterArgValue / 120)) * 100) / 100);
        setPropValue(layer, "scale", [maxValue, updateMtCenterMax]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(divEl);
    } else if (curTab === "skew") {
      const divElValue = document.createElement("div");
      divElValue.className = "om-mt-pad";
      divElValue.innerHTML = `
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
      setupPadDrag(divElValue, (updateMtCenterArgParsed, updateMtCenterArgClamped) => {
        const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
        const updateMtCenterRaw = updateMtCenterEnsureTransform.skew.value || [0, 0];
        const updateMtCenterValueParsed = Math.round((updateMtCenterRaw[0] + updateMtCenterArgParsed * 0.2) * 10) / 10;
        const updateMtCenterParsed = Math.round((updateMtCenterRaw[1] + updateMtCenterArgClamped * 0.2) * 10) / 10;
        setPropValue(layer, "skew", [updateMtCenterValueParsed, updateMtCenterParsed]);
        commitTransformChange(layer, snap);
      });
      center.appendChild(divElValue);
    }
  }

  function setupPadDrag(el, onDelta) {
    let lastX = 0, lastY = 0, isDragging = false;
    el.addEventListener("pointerdown", clientXArg => {
      isDragging = true;
      lastX = clientXArg.clientX;
      lastY = clientXArg.clientY;
      el.setPointerCapture(clientXArg.pointerId);
    });
    el.addEventListener("pointermove", setupPadDragClientX => {
      if (!isDragging) return;
      const setupPadDragValue = setupPadDragClientX.clientX - lastX;
      const setupPadDragResult = setupPadDragClientX.clientY - lastY;
      lastX = setupPadDragClientX.clientX;
      lastY = setupPadDragClientX.clientY;
      onDelta(setupPadDragValue, setupPadDragResult);
    });
    const setupPadDragCallback = pointerId => {
      isDragging = false;
      try { el.releasePointerCapture(pointerId.pointerId); } catch {}
    };
    el.addEventListener("pointerup", setupPadDragCallback);
    el.addEventListener("pointercancel", setupPadDragCallback);
  }

  function setupWheelDrag(el, onAngle) {
    let isDragging = false;
    const setupWheelDragValueRaw = clientY => {
      const rect = el.getBoundingClientRect();
      const computeValue = rect.left + rect.width / 2;
      const setupWheelDragRaw = rect.top + rect.height / 2;
      const atan = Math.atan2(clientY.clientY - setupWheelDragRaw, clientY.clientX - computeValue);
      let setupWheelDragResult = atan * (180 / Math.PI) + 90;
      if (setupWheelDragResult < 0) setupWheelDragResult += 360;
      onAngle(setupWheelDragResult);
      const needle = el.querySelector("#omMtNeedle");
      if (needle) needle.style.transform = `rotate(${setupWheelDragResult}deg)`;
      const valEl = document.getElementById("omMtWheelVal");
      if (valEl) valEl.textContent = `${setupWheelDragResult.toFixed(1)}°`;
    };
    el.addEventListener("pointerdown", setupWheelDragPointerId => {
      isDragging = true;
      el.setPointerCapture(setupWheelDragPointerId.pointerId);
      setupWheelDragValueRaw(setupWheelDragPointerId);
    });
    el.addEventListener("pointermove", setupWheelDragValue => {
      if (!isDragging) return;
      setupWheelDragValueRaw(setupWheelDragValue);
    });
    const setupWheelDragCallback = pointerIdArg => {
      isDragging = false;
      try { el.releasePointerCapture(pointerIdArg.pointerId); } catch {}
    };
    el.addEventListener("pointerup", setupWheelDragCallback);
    el.addEventListener("pointercancel", setupWheelDragCallback);
  }

  function updateMtReadouts() {
    const updateMtReadoutsOmMtReadoutEl = document.getElementById("omMtReadout");
    if (!updateMtReadoutsOmMtReadoutEl) return;
    const layer = getCurLayer();
    if (!layer) return;
    const updateMtReadoutsEnsureTransform = ensureTransform(layer);

    if (curTab === "pos") {
      const updateMtReadoutsValue = updateMtReadoutsEnsureTransform.location.value || [0, 0, 0];
      updateMtReadoutsOmMtReadoutEl.innerHTML = `
        <label class="om-mt-pill"><span>X</span><input type="number" id="omMtInpX" value="${Math.round(updateMtReadoutsValue[0])}">px</label>
        <label class="om-mt-pill"><span>Y</span><input type="number" id="omMtInpY" value="${Math.round(updateMtReadoutsValue[1])}">px</label>
        <label class="om-mt-pill"><span>Z</span><input type="number" id="omMtInpZ" value="${Math.round(updateMtReadoutsValue[2] || 0)}"></label>
        <button type="button" class="om-mt-btn-toggle" id="omMtTogglePivotBtn">Titik Jangkar (Pivot)</button>
      `;
      bindPillInput("omMtInpX", updateMtReadoutsArg => setPropValue(layer, "location", [updateMtReadoutsArg, updateMtReadoutsValue[1], updateMtReadoutsValue[2] || 0]));
      bindPillInput("omMtInpY", updateMtReadoutsArgValue => setPropValue(layer, "location", [updateMtReadoutsValue[0], updateMtReadoutsArgValue, updateMtReadoutsValue[2] || 0]));
      bindPillInput("omMtInpZ", updateMtReadoutsArgRaw => setPropValue(layer, "location", [updateMtReadoutsValue[0], updateMtReadoutsValue[1], updateMtReadoutsArgRaw]));
      updateMtReadoutsOmMtReadoutEl.querySelector("#omMtTogglePivotBtn").addEventListener("click", () => switchTab("pivot"));
    } else if (curTab === "pivot") {
      const updateMtReadoutsResult = updateMtReadoutsEnsureTransform.pivot.value || [0, 0];
      updateMtReadoutsOmMtReadoutEl.innerHTML = `
        <label class="om-mt-pill"><span>Jangkar X</span><input type="number" id="omMtInpPX" value="${Math.round(updateMtReadoutsResult[0])}">px</label>
        <label class="om-mt-pill"><span>Jangkar Y</span><input type="number" id="omMtInpPY" value="${Math.round(updateMtReadoutsResult[1])}">px</label>
        <button type="button" class="om-mt-btn-toggle active" id="omMtBackPosBtn">Kembali ke Posisi</button>
      `;
      bindPillInput("omMtInpPX", updateMtReadoutsArgParsed => setPropValue(layer, "pivot", [updateMtReadoutsArgParsed, updateMtReadoutsResult[1]]));
      bindPillInput("omMtInpPY", updateMtReadoutsArgClamped => setPropValue(layer, "pivot", [updateMtReadoutsResult[0], updateMtReadoutsArgClamped]));
      updateMtReadoutsOmMtReadoutEl.querySelector("#omMtBackPosBtn").addEventListener("click", () => switchTab("pos"));
    } else if (curTab === "rot") {
      const updateMtReadoutsNumber = Number(updateMtReadoutsEnsureTransform.rotation.value ? updateMtReadoutsEnsureTransform.rotation.value[0] : 0);
      updateMtReadoutsOmMtReadoutEl.innerHTML = `
        <label class="om-mt-pill"><span>Sudut</span><input type="number" step="0.5" id="omMtInpRot" value="${updateMtReadoutsNumber}">°</label>
        <button type="button" class="om-mt-btn-toggle" id="omMtResetRot">Reset 0°</button>
      `;
      bindPillInput("omMtInpRot", updateMtReadoutsClamped => setPropValue(layer, "rotation", [updateMtReadoutsClamped]));
      updateMtReadoutsOmMtReadoutEl.querySelector("#omMtResetRot").addEventListener("click", () => {
        setPropValue(layer, "rotation", [0]);
        commitTransformChange(layer, initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null);
        updateMtCenter();
      });
    } else if (curTab === "scale") {
      const updateMtReadoutsValueRaw = updateMtReadoutsEnsureTransform.scale.value || [1, 1];
      updateMtReadoutsOmMtReadoutEl.innerHTML = `
        <label class="om-mt-pill"><span>Skala X</span><input type="number" step="0.1" id="omMtInpSX" value="${updateMtReadoutsValueRaw[0]}"></label>
        <button type="button" class="om-mt-btn-toggle ${linkAspect ? "active" : ""}" id="omMtLinkAspect" title="Kunci perbandingan aspek">
          ${linkAspect ? "🔗 Terkunci" : "🔓 Bebas"}
        </button>
        <label class="om-mt-pill"><span>Skala Y</span><input type="number" step="0.1" id="omMtInpSY" value="${updateMtReadoutsValueRaw[1]}"></label>
      `;
      bindPillInput("omMtInpSX", updateMtReadoutsCondition => {
        const updateMtReadoutsValueParsed = linkAspect ? updateMtReadoutsCondition : updateMtReadoutsValueRaw[1];
        setPropValue(layer, "scale", [updateMtReadoutsCondition, updateMtReadoutsValueParsed]);
      });
      bindPillInput("omMtInpSY", updateMtReadoutsFlag => {
        const updateMtReadoutsParsed = linkAspect ? updateMtReadoutsFlag : updateMtReadoutsValueRaw[0];
        setPropValue(layer, "scale", [updateMtReadoutsParsed, updateMtReadoutsFlag]);
      });
      updateMtReadoutsOmMtReadoutEl.querySelector("#omMtLinkAspect").addEventListener("click", () => {
        linkAspect = !linkAspect;
        updateMtReadouts();
      });
    } else if (curTab === "skew") {
      const updateMtReadoutsRaw = updateMtReadoutsEnsureTransform.skew.value || [0, 0];
      updateMtReadoutsOmMtReadoutEl.innerHTML = `
        <label class="om-mt-pill"><span>Skew X</span><input type="number" step="0.5" id="omMtInpSKX" value="${updateMtReadoutsRaw[0]}">°</label>
        <label class="om-mt-pill"><span>Skew Y</span><input type="number" step="0.5" id="omMtInpSKY" value="${updateMtReadoutsRaw[1]}">°</label>
        <button type="button" class="om-mt-btn-toggle" id="omMtResetSkew">Reset 0°</button>
      `;
      bindPillInput("omMtInpSKX", updateMtReadoutsArgScoped => setPropValue(layer, "skew", [updateMtReadoutsArgScoped, updateMtReadoutsRaw[1]]));
      bindPillInput("omMtInpSKY", argScoped => setPropValue(layer, "skew", [updateMtReadoutsRaw[0], argScoped]));
      updateMtReadoutsOmMtReadoutEl.querySelector("#omMtResetSkew").addEventListener("click", () => {
        setPropValue(layer, "skew", [0, 0]);
        commitTransformChange(layer, initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null);
        updateMtCenter();
      });
    }
  }

  function bindPillInput(id, onChange) {
    const bindPillInputElement = document.getElementById(id);
    if (!bindPillInputElement) return;
    bindPillInputElement.addEventListener("change", () => {
      const bindPillInputValue = Number(bindPillInputElement.value) || 0;
      const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
      onChange(bindPillInputValue);
      commitTransformChange(getCurLayer(), snap);
    });
  }

  function switchTab(switchTabArg) {
    if (switchTabArg === "pos" && curTab === "pos") curTab = "pivot";
    else if (switchTabArg === "pos" && curTab === "pivot") curTab = "pos";
    else curTab = switchTabArg;

    document.querySelectorAll("#omMtTabs .om-mt-tab-btn").forEach(dataset => {
      const switchTabResult = dataset.dataset.tab;
      dataset.classList.toggle("active", switchTabResult === (curTab === "pivot" ? "pos" : curTab));
      dataset.classList.toggle("pivot-mode", curTab === "pivot" && switchTabResult === "pos");
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
    const updateMtKfButtonValue = (initAmMoveTransfValue.H || 0) / 1000;
    const hasKfAtPlayhead = prop && prop.kfs && prop.kfs.some(updateMtKfButtonT => Math.abs(Number(updateMtKfButtonT.t) - updateMtKfButtonValue) < 0.002);
    kfBtn.classList.toggle("active", !!hasKfAtPlayhead);
    const updateMtKfButtonImgEl = kfBtn.querySelector("img");
    if (updateMtKfButtonImgEl) {
      updateMtKfButtonImgEl.src = hasKfAtPlayhead ? "./icons/ic_keyframe_delete_big.svg" : "./icons/ic_keyframe_add_big.svg";
    }
  }

  function stepToKeyframe(direction) {
    const prop = getActiveProp();
    if (!prop || !prop.kfs || !prop.kfs.length) {
      if (initAmMoveTransfValue.handle9) initAmMoveTransfValue.handle9("[KEYFRAME] Tidak ada keyframe pada properti aktif");
      return;
    }
    const curT = (initAmMoveTransfValue.H || 0) / 1000;
    let targetKf = null;
    if (direction < 0) {
      const prevs = prop.kfs.filter(stepToKeyframeArg => Number(stepToKeyframeArg.t) < curT - 0.005);
      if (!prevs.length) return;
      targetKf = prevs.reduce((stepToKeyframeCondition, stepToKeyframeT) => (Number(stepToKeyframeT.t) > Number(stepToKeyframeCondition.t) ? stepToKeyframeT : stepToKeyframeCondition));
    } else {
      const nexts = prop.kfs.filter(stepToKeyframeArgValue => Number(stepToKeyframeArgValue.t) > curT + 0.005);
      if (!nexts.length) return;
      targetKf = nexts.reduce((tArg, stepToKeyframeFlag) => (Number(stepToKeyframeFlag.t) < Number(tArg.t) ? stepToKeyframeFlag : tArg));
    }
    if (!targetKf) return;
    const targetMs = Math.round(Number(targetKf.t) * 1000);
    if (initAmMoveTransfValue.seek) {
      initAmMoveTransfValue.seek(targetMs);
    } else {
      initAmMoveTransfValue.H = targetMs;
      if (initAmMoveTransfValue.val2 && initAmMoveTransfValue.val2.renderAt) initAmMoveTransfValue.val2.renderAt(targetMs);
    }
    updateMtKfButton();
    updateMtReadouts();
    drawGizmo();
  }

  function resetCurrentTransform() {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return;
    const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;

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
    if (initAmMoveTransfValue.handle9) initAmMoveTransfValue.handle9("[TRANSFORM] Properti di-reset");
  }

  function upgradeMultiSelectBar() {
    let upgradeMultiSeleOmMultiBarEl = document.getElementById("omMultiBar");
    if (!initAmMoveTransfValue.omMulti || !initAmMoveTransfValue.omMulti.size) {
      if (upgradeMultiSeleOmMultiBarEl) upgradeMultiSeleOmMultiBarEl.remove();
      return;
    }
    if (!upgradeMultiSeleOmMultiBarEl) {
      upgradeMultiSeleOmMultiBarEl = document.createElement("div");
      upgradeMultiSeleOmMultiBarEl.id = "omMultiBar";
      document.body.appendChild(upgradeMultiSeleOmMultiBarEl);
    }
    const count = initAmMoveTransfValue.omMulti.size;
    upgradeMultiSeleOmMultiBarEl.innerHTML = `
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

    upgradeMultiSeleOmMultiBarEl.querySelector("#omMGroup").addEventListener("click", () => executeGroup("group"));
    upgradeMultiSeleOmMultiBarEl.querySelector("#omMMask").addEventListener("click", () => executeGroup("mask"));
    upgradeMultiSeleOmMultiBarEl.querySelector("#omMExclude").addEventListener("click", () => executeGroup("exclude"));
    upgradeMultiSeleOmMultiBarEl.querySelector("#omMDelete").addEventListener("click", () => {
      if (typeof window.omMultiDelete === "function") window.omMultiDelete();
    });
    upgradeMultiSeleOmMultiBarEl.querySelector("#omMClear").addEventListener("click", () => {
      if (typeof window.omMultiClear === "function") window.omMultiClear();
    });
  }

  function executeGroup(type) {
    if (!initAmMoveTransfValue.val || !initAmMoveTransfValue.omMulti || !initAmMoveTransfValue.omMulti.size) return;
    const executeGroupItems = [...initAmMoveTransfValue.omMulti];
    const layers = executeGroupItems.map(id => typeof window.omResolveLayer === "function" ? window.omResolveLayer(id) : null).filter(Boolean);
    if (!layers.length) return;

    const executeGroupW = initAmMoveTransfValue.omMeta ? initAmMoveTransfValue.omMeta() : { w: 720, h: 1280, total: 10000, fps: 30 };
    const parents = new Set(layers.map(executeGroupArgValue => initAmMoveTransfValue.findParentArray ? initAmMoveTransfValue.findParentArray(executeGroupArgValue) : null));
    if (parents.size > 1) {
      if (initAmMoveTransfValue.handle9) initAmMoveTransfValue.handle9("[GRUP] Pilih layer dari level grup yang sama");
      return;
    }
    const executeGroupValue = parents.values().next().value;
    if (!executeGroupValue) return;

    const xmls = layers.map(sourceXml => sourceXml.sourceXml || "").filter(Boolean);
    if (!xmls.length) return;

    const snap = initAmMoveTransfValue.sceneSnapshot ? initAmMoveTransfValue.sceneSnapshot() : null;
    const title = type === "mask" ? "Grup Masker" : (type === "exclude" ? "Grup Exclude" : "Grup");
    const maskAttr = type === "mask" ? ' mask="alpha"' : (type === "exclude" ? ' blendMode="exclude"' : "");

    const inner = `<scene title="${title}" width="${executeGroupW.w}" height="${executeGroupW.h}" exportWidth="${executeGroupW.w}" exportHeight="${executeGroupW.h}" precompose="dynamicResolution" bgcolor="#ff000000" totalTime="${executeGroupW.total}" fps="${executeGroupW.fps}">${xmls.join('')}</scene>`;
    const gXml = `<embedScene id="${initAmMoveTransfValue.omId()}" label="${title}" startTime="0" endTime="${executeGroupW.total}"${maskAttr}>${inner}${initAmMoveTransfValue.omTransformXml(Math.round(executeGroupW.w / 2), Math.round(executeGroupW.h / 2), 1)}</embedScene>`;

    const omParseLayer = initAmMoveTransfValue.omParseLayer(gXml);
    if (!omParseLayer) return;

    layers.forEach(executeGroupArg => {
      const executeGroupFlag = initAmMoveTransfValue.findParentArray ? initAmMoveTransfValue.findParentArray(executeGroupArg) : null;
      if (executeGroupFlag) executeGroupFlag.splice(executeGroupFlag.indexOf(executeGroupArg), 1);
    });
    executeGroupValue.push(omParseLayer);

    if (initAmMoveTransfValue.pushUndo) initAmMoveTransfValue.pushUndo(snap);
    initAmMoveTransfValue.V = true;
    initAmMoveTransfValue.omMulti.clear();
    if (initAmMoveTransfValue.handle9) initAmMoveTransfValue.handle9(`[GRUP] ${xmls.length} layer digabung jadi "${title}"`);
    upgradeMultiSelectBar();

    if (initAmMoveTransfValue.omHandle21InContext) {
      initAmMoveTransfValue.omHandle21InContext().then(() => {
        upgradeMultiSelectBar();
        drawGizmo();
      });
    }
  }

  document.getElementById("omMtClose").addEventListener("click", closeMoveTransform);

  document.querySelectorAll("#omMtTabs .om-mt-tab-btn").forEach(addEventListener => {
    addEventListener.addEventListener("click", () => switchTab(addEventListener.dataset.tab));
  });

  document.getElementById("omMtKfBtn").addEventListener("click", () => {
    const layer = getCurLayer();
    if (!layer || !layer.transform) return;
    const propKey = getActivePropKey();
    const prop = getActiveProp();
    const initAmMoveTransformResult = (initAmMoveTransfValue.H || 0) / 1000;
    const hasKfAtPlayhead = prop && prop.kfs && prop.kfs.some(initAmMoveTransformT => Math.abs(Number(initAmMoveTransformT.t) - initAmMoveTransformResult) < 0.002);
    if (hasKfAtPlayhead) {
      if (initAmMoveTransfValue.omKfRemoveAt) initAmMoveTransfValue.omKfRemoveAt(propKey);
    } else {
      if (initAmMoveTransfValue.omKfInsert) initAmMoveTransfValue.omKfInsert(propKey);
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
    } else if (initAmMoveTransfValue.omOpenCurve) {
      initAmMoveTransfValue.omOpenCurve();
    }
  });

  window.omOpenMoveTransform = openMoveTransform;
  window.omCloseMoveTransform = closeMoveTransform;
  window.omDrawGizmo = drawGizmo;
  window.omUpgradeMultiSelectBar = upgradeMultiSelectBar;

  window.omOnLayerSelected = function(label) {
    if (mtPanel.classList.contains("on")) {
      if (!label) closeMoveTransform();
      else {
        document.getElementById("omMtLayerName").textContent = label.label || label.id;
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
    if (initAmMoveTransfValue.omMulti) upgradeMultiSelectBar();
  }, 300);

  window.addEventListener("resize", drawGizmo);
})();
