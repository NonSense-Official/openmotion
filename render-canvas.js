import { localValueSecondary, projectScene } from './state.js';
import { computeHelperRaw } from './engine-core.js';
import { objHelper } from './engine-layer.js';
function updateHelperStart(updateWidth, updateHeight, updateArgInner) {
  if (typeof document > 'u' || !document.createElement) return {
    canvas: updateArgInner,
    ctx: null
  };
  let canvasEl = document.createElement("canvas");
  canvasEl.width = updateWidth, canvasEl.height = updateHeight;
  let ctx = canvasEl.getContext('2d');
  return !ctx || typeof ctx.drawImage != "function" ? {
    canvas: updateArgInner,
    ctx: null
  } : {
    canvas: canvasEl,
    ctx: ctx
  };
}
function buildHelperInner(buildCtx, buildHelperInnerArg, buildArgInner, buildArgStart) {
  return buildCtx.ctx && buildCtx.ctx.drawImage(buildHelperInnerArg, 0, 0, buildArgInner, buildArgStart), buildCtx.canvas;
}
async function handleFail({
  canvas: handleFailFlag,
  snapshot: handleCanvas,
  renderFrame: handleFailArgValue,
  startMs: handleFailArgRaw,
  intervalMs: handleFailArg,
  totalFrames: handleArgMin,
  fps: handleArgMax,
  report: handleArgInner,
  isCancelled: handleArgStart
}) {
  let handleCaptureStream = handleCanvas && handleCanvas.canvas && typeof handleCanvas.canvas.captureStream == "function" ? handleCanvas.canvas : handleFailFlag;
  if (typeof handleCaptureStream.captureStream != "function") throw new Error("Browser ini tidak mendukung WebCodecs maupun captureStream.");
  let captureStream = handleCaptureStream.captureStream(0),
    requestFrame = captureStream.getVideoTracks()[0],
    handleValueStart = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(handleFailRaw => MediaRecorder.isTypeSupported(handleFailRaw)) || "video/webm",
    handleFailList = [],
    mediaRecorder = new MediaRecorder(captureStream, {
      mimeType: handleValueStart,
      videoBitsPerSecond: 6000000
    });
  mediaRecorder.ondataavailable = handleData => {
    handleData.data.size && handleFailList.push(handleData.data);
  };
  let promise = new Promise(onstop => {
    mediaRecorder.onstop = onstop;
  });
  mediaRecorder.start();
  let handleValueCurrent = performance.now(),
    handleList = [],
    handleFailNumber = 0;
  for (let handleValue = 0; handleValue < handleArgMin && !handleArgStart(); handleValue++) {
    let handleNow = performance.now();
    handleFailArgValue(handleFailArgRaw + handleValue * handleFailArg), buildHelperInner(handleCanvas, handleFailFlag, handleFailFlag.width, handleFailFlag.height), requestFrame.requestFrame(), handleFailNumber++;
    let handleStart = performance.now() - handleNow;
    handleList.push(handleStart), handleList.length > 60 && handleList.shift();
    let handleValueEnd = handleList.reduce((handleFailArgParsed, handleArgByKey) => handleFailArgParsed + handleArgByKey, 0) / handleList.length;
    handleArgInner({
      phase: "render",
      frame: handleValue + 1,
      msPerFrame: handleStart,
      avgMs: handleValueEnd,
      minMs: Math.min(...handleList),
      maxMs: Math.max(...handleList),
      renderFps: 1000 / handleValueEnd,
      etaMs: 0,
      encodedBytes: 0,
      realtime: true
    });
    let handleCurrent = handleFailArg - (performance.now() - handleNow);
    await localValueSecondary(Math.max(0, handleCurrent));
  }
  mediaRecorder.stop(), await promise;
  let handleCallback = handleArgStart();
  if (handleCallback) try {
    requestFrame.stop();
  } catch {}
  let blob = new Blob(handleFailList, {
      type: "video/webm"
    }),
    handleFailRecord = {
      status: handleCallback ? "cancelled" : "success",
      blob: blob,
      codec: handleValueStart,
      width: handleFailFlag.width,
      height: handleFailFlag.height,
      fps: handleArgMax,
      frames: handleFailNumber,
      mode: "mediarecorder",
      realtime: true,
      cancelled: handleCallback,
      elapsedMs: performance.now() - handleValueCurrent
    };
  return handleArgInner({
    phase: "selesai",
    ...handleFailRecord,
    bytes: blob.size
  }), handleFailRecord;
}
function helperStart(getContext, handleFillStyle) {
  let helperStartValue = getContext.getContext && getContext.getContext('2d');
  if (!helperStartValue) return;
  let handleWidth = getContext.width,
    handleHeight = getContext.height;
  if (helperStartValue.clearRect(0, 0, handleWidth, handleHeight), typeof handleFillStyle == "string" && handleFillStyle !== "text" && handleFillStyle !== "group" && handleFillStyle !== "camera" && handleFillStyle.charAt(0) === '#') {
    helperStartValue.fillStyle = handleFillStyle, helperStartValue.fillRect(0, 0, handleWidth, handleHeight), helperStartValue.strokeStyle = "rgba(255,255,255,.2)", helperStartValue.strokeRect(2.5, 2.5, handleWidth - 5, handleHeight - 5);
    return;
  }
  if (handleFillStyle === "camera") {
    helperStartValue.fillStyle = "#2d1607", helperStartValue.fillRect(0, 0, handleWidth, handleHeight);
    helperStartValue.fillStyle = "#ff9a3c", helperStartValue.beginPath();
    helperStartValue.roundRect ? helperStartValue.roundRect(4, 7, 11, 10, 2) : helperStartValue.rect(4, 7, 11, 10);
    helperStartValue.fill();
    helperStartValue.beginPath(), helperStartValue.moveTo(16, 9.5), helperStartValue.lineTo(21, 7), helperStartValue.lineTo(21, 17), helperStartValue.lineTo(16, 14.5), helperStartValue.closePath(), helperStartValue.fill();
    return;
  }
  if (handleFillStyle === "text" || handleFillStyle === "group") {
    helperStartValue.fillStyle = "#1a1f2c", helperStartValue.fillRect(0, 0, handleWidth, handleHeight), helperStartValue.fillStyle = "#c8d0e8", helperStartValue.font = "bold 12px ui-sans-serif, system-ui", helperStartValue.textBaseline = "middle", helperStartValue.fillText(handleFillStyle === "text" ? 'T' : 'es', handleFillStyle === "text" ? 9 : 6, handleHeight / 2 + 1);
    return;
  }
  if (!handleFillStyle || typeof handleFillStyle != "object") {
    helperStartValue.fillStyle = "#12151d", helperStartValue.fillRect(0, 0, handleWidth, handleHeight);
    return;
  }
  let handleValueClamped = handleFillStyle.videoWidth || handleFillStyle.naturalWidth || handleFillStyle.width || 0,
    handleClamped = handleFillStyle.videoHeight || handleFillStyle.naturalHeight || handleFillStyle.height || 0;
  if (!handleValueClamped || !handleClamped) {
    helperStartValue.fillStyle = "#12151d", helperStartValue.fillRect(0, 0, handleWidth, handleHeight);
    return;
  }
  let handleValueMax = Math.max(handleWidth / handleValueClamped, handleHeight / handleClamped),
    handleValueByKey = handleValueClamped * handleValueMax,
    handleByKey = handleClamped * handleValueMax;
  try {
    helperStartValue.drawImage(handleFillStyle, (handleWidth - handleValueByKey) / 2, (handleHeight - handleByKey) / 2, handleValueByKey, handleByKey);
  } catch {
    helperStartValue.fillStyle = "#12151d", helperStartValue.fillRect(0, 0, handleWidth, handleHeight);
  }
}
function handleHelperByIndex() {
  let timelineRulerCanvas = document.getElementById("timeline-ruler-canvas");
  if (!timelineRulerCanvas || !projectScene) return;
  let handleHelperByIndexValue = projectScene.totalTime || 1,
    handleCompute = computeHelperRaw(),
    handleMax = Math.max(160, Math.round(handleHelperByIndexValue * handleCompute)),
    handleMin = Math.min(2, window.devicePixelRatio || 1);
  timelineRulerCanvas.width = Math.round(handleMax * handleMin), timelineRulerCanvas.height = Math.round(26 * handleMin), timelineRulerCanvas.style.width = handleMax + 'px';
  let ctx = timelineRulerCanvas.getContext('2d');
  ctx.setTransform(handleMin, 0, 0, handleMin, 0, 0), ctx.fillStyle = "#0f1117", ctx.fillRect(0, 0, handleMax, 26);
  let handleHelperByIndexNumber = 30000;
  for (let handleByIndex of [100, 200, 500, 1000, 2000, 5000, 10000, 30000]) if (handleByIndex * handleCompute >= 48) {
    handleHelperByIndexNumber = handleByIndex;
    break;
  }
  ctx.font = "10px ui-monospace, Menlo, monospace", ctx.textBaseline = "top";
  for (let handleNumber = 0; handleNumber <= handleHelperByIndexValue; handleNumber += handleHelperByIndexNumber) {
    let round = Math.round(handleNumber * handleCompute);
    ctx.fillStyle = "#343b4d", ctx.fillRect(round, 16, 1, 10), ctx.fillStyle = "#8c93a7";
    let handleNext = handleNumber >= 60000 ? Math.floor(handleNumber / 60000) + 'm' + String(Math.round(handleNumber % 60000 / 1000)).padStart(2, '0') + 's' : (handleNumber / 1000).toFixed(handleHelperByIndexNumber < 1000 ? 1 : 0) + 's';
    ctx.fillText(handleNext, round + 3, 4);
  }
}
function omCurrentLayers() {
  const ctx = typeof objHelper === "function" ? objHelper() : null;
  if (ctx && ctx.scene && Array.isArray(ctx.scene.layers)) return ctx.scene.layers;
  return projectScene ? projectScene.layers : [];
}
function omCurrentScene() {
  const ctx = typeof objHelper === "function" ? objHelper() : null;
  return ctx && ctx.scene && Array.isArray(ctx.scene.layers) ? ctx.scene : projectScene;
}
export { buildHelperInner, handleFail, handleHelperByIndex, helperStart, omCurrentLayers, omCurrentScene, updateHelperStart };
