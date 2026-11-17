import { amAudioEe, applyHelperInner, audioLoadFailed, audioOffsetMs, elementHelper, expendsecEl, expstartsecEl, getHelperParsed, handleHelperValue, hasMediaItems, isPlaying, listValue, localNumber, localValueCurrent, localValuePrev, localValueScoped, mediaKeys, omUploads, pitchkeepEl, playbackRate, playheadMs, projectScene, seekToTime, syncStateEl, valueNext, valueSegment, volume } from './state.js';
import { applyHelperMax, applyOuter, buildHelperScoped, buildRaw, computeHelperRaw, eAHelper, omHexFrom, omLayerCur, processHelperValue, pushUndo, sceneSnapshot } from './engine-core.js';
import { handleHelperEl, objHelper, objHelperParsed, omLayerXml, refHelperByKey, updateHelperByIndex } from './engine-layer.js';
import { maxHelperRaw, renderHelperOuter } from './parser-value.js';
import { buildHelperLocal, getEl } from './ui-shell.js';
import { appendLog, updateHelperParsed } from './render-text.js';
import { sort } from './engine-transform.js';
import { parseHexColor } from './color.js';
function handleHelperStart() {
  let handleHelperStartValue = projectScene && projectScene.audio && projectScene.audio[0];
  return handleHelperStartValue && handleHelperStartValue.endTime > handleHelperStartValue.startTime ? handleHelperStartValue.endTime - handleHelperStartValue.startTime : projectScene ? projectScene.totalTime : 0;
}
function maxHelperParsed(maxHelperParsedArg) {
  let maxValueScoped = buildHelperScoped();
  return Math.max(0, maxValueScoped + (maxHelperParsedArg - audioOffsetMs) * (playbackRate || 1));
}
function maxHelperValue(maxHelperValueSpeed) {
  let maxScoped = maxHelperValueSpeed && Number.isFinite(maxHelperValueSpeed.speed) && maxHelperValueSpeed.speed > 0 ? maxHelperValueSpeed.speed : 1;
  return Math.max(0.0625, Math.min(4, maxScoped * (playbackRate || 1)));
}
function renderHelperInner() {
  if (!projectScene) return null;
  let renderTotal = refHelperByKey(projectScene, playheadMs);
  return renderTotal.length ? renderTotal[0] : null;
}
function buildHelperEl(elArg, buildHelperElArg, buildHelperElArgValue) {
  let buildEl = elArg.el;
  if (elArg.broken) return;
  let buildApply = applyOuter(elArg.layer);
  if (buildEl.muted !== buildApply && (buildEl.muted = buildApply), buildApply) {
    buildEl.paused || buildEl.pause(), buildEl.volume !== 0 && (buildEl.volume = 0), elArg.D = false;
    return;
  }
  let {
    start: buildObj,
    end: buildList
  } = objHelperParsed(elArg);
  if (!(buildHelperElArg >= buildObj && buildHelperElArg < buildList)) {
    buildEl.paused || buildEl.pause(), elArg.D = false;
    return;
  }
  let buildPlaybackRate = maxHelperValue(elArg.layer);
  Math.abs(buildEl.playbackRate - buildPlaybackRate) > 0.0001 && (buildEl.playbackRate = buildPlaybackRate), buildEl.preservesPitch !== void 0 && (buildEl.preservesPitch = pitchkeepEl ? pitchkeepEl.checked : true), "mozPreservesPitch" in buildEl && (buildEl.mozPreservesPitch = buildEl.preservesPitch), "webkitPreservesPitch" in buildEl && (buildEl.webkitPreservesPitch = buildEl.preservesPitch);
  let buildUpdate = updateHelperByIndex(elArg, buildHelperElArg),
    buildValueByIndex = elArg.durationMs || (Number.isFinite(buildEl.duration) ? buildEl.duration * 1000 : 0);
  if (buildUpdate < 0 || buildValueByIndex > 0 && buildUpdate >= buildValueByIndex) {
    buildEl.volume !== 0 && (buildEl.volume = 0), buildEl.paused || buildEl.pause(), elArg.D = false;
    return;
  }
  let buildMax = Math.max(0, maxHelperRaw(elArg.layer, buildHelperElArg - elArg.offsetMs));
  if (elArg.gainNode) {
    try {
      if (window.__AM_AUDIO_CTX && window.__AM_AUDIO_CTX.state === "suspended" && isPlaying) {
        window.__AM_AUDIO_CTX.resume();
      }
      elArg.gainNode.gain.value = buildMax;
      buildEl.volume = 1;
    } catch(buildValueCurrent) {
      buildEl.volume = Math.max(0, Math.min(1, buildMax));
    }
  } else {
    let volClamp = Math.max(0, Math.min(1, buildMax));
    Math.abs(buildEl.volume - volClamp) > 0.001 && (buildEl.volume = volClamp);
  }
  let currentTime = buildUpdate / 1000;
  if (isPlaying) {
    if (buildEl.paused && !elArg.D) {
      elArg.D = true;
      try {
        buildEl.currentTime = currentTime;
      } catch {}
      buildEl.play().then(() => {
        elArg.D = false;
      }).catch(() => {
        elArg.D = false;
      });
    } else {
      if ((buildHelperElArgValue || Math.abs(buildEl.currentTime - currentTime) > 0.12) && !elArg.D) try {
        buildEl.currentTime = currentTime;
      } catch {}
    }
  } else {
    if (elArg.D = false, buildHelperElArgValue || Math.abs(buildEl.currentTime - currentTime) * 1000 > 10) try {
      buildEl.currentTime = currentTime;
    } catch {}
  }
}
function handleHelper({
  force: handleArgValue = false
} = {}) {
  if (!projectScene) return;
  for (let handleValueNext of amAudioEe) buildHelperEl(handleValueNext, playheadMs, handleArgValue);
  if (handleHelperEl(playheadMs, handleArgValue), amAudioEe.length || !volume || audioLoadFailed) return;
  if (!valueSegment) {
    volume.volume = 1;
    return;
  }
  let handleRender = renderHelperInner();
  if (handleRender) {
    let handleVolume = maxHelperRaw(handleRender, playheadMs);
    Math.abs(volume.volume - handleVolume) > 0.001 && (volume.volume = handleVolume);
    let handlePlaybackRate = maxHelperValue(handleRender);
    Math.abs(volume.playbackRate - handlePlaybackRate) > 0.0001 && (volume.playbackRate = handlePlaybackRate), isPlaying && volume.paused && !audioLoadFailed && volume.readyState >= 2 && (helperParsed(), volume.play().catch(() => {}));
  } else isPlaying && !volume.paused && volume.pause();
}
function helperParsed() {
  if (amAudioEe.length) {
    handleHelper({
      force: true
    });
    return;
  }
  !volume || audioLoadFailed || (volume.currentTime = applyHelperMax(playheadMs) / 1000);
}
function renderHelperParsed() {
  if (!projectScene) return;
  let totalTime = projectScene.totalTime;
  if (amAudioEe.length) {
    let renderValueOutput = amAudioEe.map(durationMs => (durationMs.durationMs / 1000).toFixed(2) + 's').join(',\x20');
    syncStateEl.textContent = "sync: project " + (totalTime / 1000).toFixed(2) + "s, " + amAudioEe.length + " layer audio (" + (renderValueOutput || "memuat") + ')', syncStateEl.style.color = "#8fd8a0";
    return;
  }
  let renderFlag = volume && Number.isFinite(volume.duration) ? volume.duration * 1000 : 0,
    renderInput = renderFlag ? renderFlag / totalTime : 0;
  if (!renderFlag) {
    syncStateEl.textContent = "sync: project " + (totalTime / 1000).toFixed(2) + "s, durasi file belum terbaca";
    return;
  }
  let renderHelperParsedValue = renderFlag / playbackRate,
    renderValueCurrent = Math.abs(renderHelperParsedValue - totalTime) < 100;
  syncStateEl.textContent = renderValueCurrent ? "sync: COCOK - file " + (renderFlag / 1000).toFixed(2) + "s @" + playbackRate.toFixed(3) + "x = project " + (totalTime / 1000).toFixed(2) + 's' : "sync: BEDA - file " + (renderFlag / 1000).toFixed(2) + "s vs project " + (totalTime / 1000).toFixed(2) + "s, butuh " + renderInput.toFixed(3) + 'x', syncStateEl.style.color = renderValueCurrent ? "#8fd8a0" : "#e8b96a";
}
function renderHelperScoped(renderHelperScopedArg) {
  let renderProcess = processHelperValue(renderHelperScopedArg),
    renderSrc = renderProcess ? renderProcess.src || renderProcess.url : localValueCurrent + encodeURIComponent(renderHelperScopedArg);
  if (localValueScoped.has(renderSrc)) return localValueScoped.get(renderSrc);
  if (/\.(mp4|webm|ogv|mov|m4v)$/i.test(renderHelperScopedArg) || renderProcess && renderProcess.isVideo) {
    let videoEl = document.createElement("video");
    return videoEl.src = renderSrc, videoEl.muted = true, videoEl.loop = true, videoEl.playsInline = true, videoEl.preload = "auto", localValueScoped.set(renderSrc, videoEl), buildHelperLocal(), videoEl;
  }
  let image = new Image();
  return image.src = renderSrc, localValueScoped.set(renderSrc, image), image;
}
function nHelper() {
  let nGetEl = getEl();
  if (!nGetEl || nGetEl.clientWidth < 40) return;
  let nValue = localNumber + Math.round(playheadMs * computeHelperRaw());
  (nValue < nGetEl.scrollLeft + localNumber || nValue > nGetEl.scrollLeft + nGetEl.clientWidth - 16) && (nGetEl.scrollLeft = Math.max(0, nValue - localNumber - 32));
}
function handleLocal() {
  if (!projectScene) return false;
  let round = Math.round(playheadMs),
    findIndex = listValue.findIndex(findindexValue => Math.abs(findindexValue - round) < 60);
  if (findIndex >= 0) listValue.splice(findIndex, 1);
  else listValue.push(round);
  getHelperParsed();
  if (projectScene) projectScene.bookmarks = listValue.slice();
  elementHelper();
  appendLog(findIndex >= 0 ? "[BOOKMARK] Penanda " + buildRaw(round) + " dihapus (" + listValue.length + " tersisa)." : "[BOOKMARK] Penanda " + buildRaw(round) + " dibuat (" + listValue.length + " total).");
  return true;
}
function jumpPrevKeyframeOrBookmark(layer) {
  if (!projectScene) return false;
  const points = new Set([0]);
  for (const jumpPrevKeyframeOrBookmarkResult of listValue) points.add(jumpPrevKeyframeOrBookmarkResult);
  const jumpPrevKeyframeOrBookmarkValue = layer || (typeof omLayerCur === "function" ? omLayerCur() : null);
  if (jumpPrevKeyframeOrBookmarkValue) {
    points.add(jumpPrevKeyframeOrBookmarkValue.startTime || 0);
    if (jumpPrevKeyframeOrBookmarkValue.endTime != null) points.add(jumpPrevKeyframeOrBookmarkValue.endTime);
    const jumpPrevKeyframeOrBookmarkSort = sort(jumpPrevKeyframeOrBookmarkValue, jumpPrevKeyframeOrBookmarkValue.startTime || 0, jumpPrevKeyframeOrBookmarkValue.endTime != null ? jumpPrevKeyframeOrBookmarkValue.endTime : projectScene.totalTime);
    for (const jumpPrevKeyframeOrBookmarkValueRaw of jumpPrevKeyframeOrBookmarkSort) points.add(jumpPrevKeyframeOrBookmarkValueRaw);
  } else if (projectScene.layers) {
    for (const jumpPrevKeyframeOrBookmarkStartTime of projectScene.layers) {
      points.add(jumpPrevKeyframeOrBookmarkStartTime.startTime || 0);
      if (jumpPrevKeyframeOrBookmarkStartTime.endTime != null) points.add(jumpPrevKeyframeOrBookmarkStartTime.endTime);
    }
  }
  const sorted = [...points].filter(sortedValue => sortedValue < playheadMs - 20).sort((jumpPrevKeyframeOrBookmarkArg, jumpPrevKeyframeOrBookmarkArgValue) => jumpPrevKeyframeOrBookmarkArgValue - jumpPrevKeyframeOrBookmarkArg);
  const target = sorted.length ? sorted[0] : 0;
  seekToTime(target);
  nHelper();
  return true;
}
function jumpNextKeyframeOrBookmark(layer) {
  if (!projectScene) return false;
  const points = new Set([projectScene.totalTime || 0]);
  for (const jumpNextKeyframeOrBookmarkResult of listValue) points.add(jumpNextKeyframeOrBookmarkResult);
  const jumpNextKeyframeOrBookmarkValue = layer || (typeof omLayerCur === "function" ? omLayerCur() : null);
  if (jumpNextKeyframeOrBookmarkValue) {
    points.add(jumpNextKeyframeOrBookmarkValue.startTime || 0);
    if (jumpNextKeyframeOrBookmarkValue.endTime != null) points.add(jumpNextKeyframeOrBookmarkValue.endTime);
    const jumpNextKeyframeOrBookmarkSort = sort(jumpNextKeyframeOrBookmarkValue, jumpNextKeyframeOrBookmarkValue.startTime || 0, jumpNextKeyframeOrBookmarkValue.endTime != null ? jumpNextKeyframeOrBookmarkValue.endTime : projectScene.totalTime);
    for (const jumpNextKeyframeOrBookmarkValueRaw of jumpNextKeyframeOrBookmarkSort) points.add(jumpNextKeyframeOrBookmarkValueRaw);
  } else if (projectScene.layers) {
    for (const jumpNextKeyframeOrBookmarkStartTime of projectScene.layers) {
      points.add(jumpNextKeyframeOrBookmarkStartTime.startTime || 0);
      if (jumpNextKeyframeOrBookmarkStartTime.endTime != null) points.add(jumpNextKeyframeOrBookmarkStartTime.endTime);
    }
  }
  const sorted = [...points].filter(jumpNextKeyframeOrBookmarkArg => jumpNextKeyframeOrBookmarkArg > playheadMs + 20).sort((jumpNextKeyframeOrBookmarkArgValue, jumpNextKeyframeOrBookmarkArgRaw) => jumpNextKeyframeOrBookmarkArgValue - jumpNextKeyframeOrBookmarkArgRaw);
  const target = sorted.length ? sorted[0] : (projectScene.totalTime || 0);
  seekToTime(target);
  nHelper();
  return true;
}
function renderElement() {
  let hasNear = false;
  for (let renderElementNumber = 0; renderElementNumber < localValuePrev.length; renderElementNumber++) {
    let renderNumberValue = listValue[renderElementNumber];
    let isAct = renderNumberValue !== void 0 && Math.abs(renderNumberValue - playheadMs) < 60;
    localValuePrev[renderElementNumber].classList.toggle("active", isAct);
    if (isAct) hasNear = true;
  }
  let timelineTracks = document.getElementById("timeline-tracks");
  if (timelineTracks) {
    timelineTracks.querySelectorAll(".tl-bm-line").forEach(line => {
      let renderOutput = Number(line.dataset.ms);
      line.classList.toggle("active", Math.abs(renderOutput - playheadMs) < 60);
    });
  }
  if (typeof window.omOnPlayheadBookmarkState === "function") window.omOnPlayheadBookmarkState(hasNear, playheadMs);
}
function processHelperLocal() {
  if (!projectScene) return;
  let tlPlayhead = document.getElementById("tl-playhead"),
    tlCap = document.getElementById("tl-cap"),
    processValueStart = getEl();
  if (!tlPlayhead || !tlCap || !processValueStart) return;
  renderElement(), applyHelperInner();
  let processHelperLocalValue = localNumber + Math.round(playheadMs * computeHelperRaw());
  tlPlayhead.style.left = processHelperLocalValue + 'px', tlCap.style.left = processHelperLocalValue + 'px', isPlaying && !valueNext && nHelper();
}
function objHelperStart(objLabel, objHelperStartArg, objAnother) {
  let objHelperStartList = [];
  for (let objHelperStartNumber = 0; objHelperStartNumber <= 16; objHelperStartNumber++) {
    let objHelperStartValue = objHelperStartNumber / 16;
    objHelperStartList.push([objHelperStartValue, renderHelperOuter(objLabel, objHelperStartValue)]);
  }
  return {
    url: objAnother,
    label: objLabel.label || objLabel.id || "layer audio",
    kind: "video",
    speed: objLabel.speed || 1,
    inTimeMs: objLabel.inTime || 0,
    layerStartMs: objHelperStartArg + objLabel.startTime,
    layerEndMs: objHelperStartArg + objLabel.endTime,
    offsetMs: audioOffsetMs,
    rate: playbackRate,
    gainPoints: objHelperStartList
  };
}
function computeHelperEl(computeHelperElArg, computeHelperElArgValue, computeWidth) {
  let replace = String(computeHelperElArgValue).replace(/["<>]/g, '');
  return "<scene " + ("width=\"" + computeWidth.width + "\" height=\"" + computeWidth.height + "\" totalTime=\"" + computeWidth.totalTime + "\" fps=\"" + computeWidth.fps + "\" bgcolor=\"#00000000\" title=\"" + replace + '\x22') + '>' + computeHelperElArg + "</scene>";
}
function handleHelperList() {
  if (hasMediaItems) {
    let handleCount = mediaKeys.join(',\x20');
    return "audio: dari layer video" + (handleCount ? '\x20(' + handleCount + ')' : '') + " - Putar";
  }
  if (amAudioEe.length) {
    let handleHelperListValue = amAudioEe.filter(broken => !broken.broken && !broken.el.paused).length,
      handleValueTotal = amAudioEe.filter(handleBroken => handleBroken.broken).length,
      handleInput = playbackRate === 1 ? '' : " @ " + playbackRate.toFixed(3) + 'x';
    return "audio: " + amAudioEe.length + " layer (" + handleHelperListValue + " main" + (handleValueTotal ? ',\x20' + handleValueTotal + " gagal" : '') + ')' + handleInput + (isPlaying ? " - " + (playheadMs / 1000).toFixed(2) + 's' : " - siap");
  }
  if (!volume) return "audio: belum dibuat";
  if (audioLoadFailed) return "audio: GAGAL dimuat" + (volume.error ? " (kode " + volume.error.code + ')' : '') + " - timeline jalan tanpa suara";
  let handleMap = playbackRate === 1 ? '' : " @ " + playbackRate.toFixed(3) + 'x',
    handleValueCount = Number.isFinite(volume.duration) ? " / " + volume.duration.toFixed(2) + 's' : '';
  return volume.paused ? "audio: siap" + handleValueCount + " (readyState " + volume.readyState + ')' + handleMap + " - tekan Putar" : "audio: main @ " + volume.currentTime.toFixed(2) + 's' + handleValueCount + " (readyState " + volume.readyState + ')' + handleMap;
}
function getHelperScoped() {
  if (!projectScene) return;
  let getHelperScopedValue = projectScene.totalTime / 1000;
  expstartsecEl && (expstartsecEl.max = getHelperScopedValue, expstartsecEl.step = Math.max(0.01, getHelperScopedValue / 1000).toFixed(3)), expendsecEl && (expendsecEl.max = getHelperScopedValue, expendsecEl.step = Math.max(0.01, getHelperScopedValue / 1000).toFixed(3), expendsecEl.value = getHelperScopedValue), updateHelperParsed();
}
function buildHelperOuter(buildHelperOuterArg) {
  projectScene && seekToTime(Math.max(0, Math.min(projectScene.totalTime, playheadMs + buildHelperOuterArg)));
}
function omMeta() {
  const ctx = typeof objHelper === "function" ? objHelper() : null;
  const ommetaValue = ctx && ctx.scene || null;
  return {
    w: Math.round(ommetaValue && ommetaValue.width || projectScene && projectScene.width || 1080),
    h: Math.round(ommetaValue && ommetaValue.height || projectScene && projectScene.height || 1920),
    total: Math.round(ommetaValue && ommetaValue.totalTime || projectScene && projectScene.totalTime || 10000),
    fps: Math.round(ommetaValue && ommetaValue.fps || projectScene && projectScene.fps || 30)
  };
}
function omSceneXmlInner(omSceneXmlInnerBgcolor) {
  const omSceneXmlInnerOmHexFrom = omHexFrom(omSceneXmlInnerBgcolor.bgcolor);
  let omSceneXmlInnerText = `<scene title="${eAHelper(omSceneXmlInnerBgcolor.title || '')}" width="${omSceneXmlInnerBgcolor.width || 1080}" height="${omSceneXmlInnerBgcolor.height || 1920}" exportWidth="${omSceneXmlInnerBgcolor.exportWidth || omSceneXmlInnerBgcolor.width || 1080}" exportHeight="${omSceneXmlInnerBgcolor.exportHeight || omSceneXmlInnerBgcolor.height || 1920}"${omSceneXmlInnerBgcolor.precompose ? ` precompose="${eAHelper(omSceneXmlInnerBgcolor.precompose)}"` : ""} bgcolor="${omSceneXmlInnerOmHexFrom}" totalTime="${omSceneXmlInnerBgcolor.totalTime || 10000}" fps="${omSceneXmlInnerBgcolor.fps || 30}" modifiedTime="${Date.now()}" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false">`;
  const mediaMap = new Map();
  (omSceneXmlInnerBgcolor.media || []).forEach(omSceneXmlInnerArg => omSceneXmlInnerArg.uri && mediaMap.set(omSceneXmlInnerArg.uri, omSceneXmlInnerArg));
  (typeof omUploads !== "undefined" && omUploads || []).forEach(uriArg => {
    if (uriArg.uri && !mediaMap.has(uriArg.uri)) {
      mediaMap.set(uriArg.uri, { uri: uriArg.uri, filename: uriArg.name, title: uriArg.name, type: "image/png" });
    }
  });
  for (const omSceneXmlInnerUri of mediaMap.values()) {
    omSceneXmlInnerText += `<media uri="${eAHelper(omSceneXmlInnerUri.uri)}" type="${eAHelper(omSceneXmlInnerUri.type || '')}" filename="${eAHelper(omSceneXmlInnerUri.filename || '')}" title="${eAHelper(omSceneXmlInnerUri.title || '')}" duration="${omSceneXmlInnerUri.duration || 0}" width="${omSceneXmlInnerUri.width || 0}" height="${omSceneXmlInnerUri.height || 0}" orientation="${omSceneXmlInnerUri.orientation || 0}" />`;
  }
  (omSceneXmlInnerBgcolor.bookmarks || []).forEach(omSceneXmlInnerArgValue => {
    omSceneXmlInnerText += `<bookmark t="${omSceneXmlInnerArgValue}" />`;
  });
  (omSceneXmlInnerBgcolor.layers || []).forEach(omSceneXmlInnerArgRaw => {
    omSceneXmlInnerText += omLayerXml(omSceneXmlInnerArgRaw);
  });
  return omSceneXmlInnerText + "</scene>";
}
function omApplyProjectSettings() {
  if (!projectScene) return;
  const omapplyprojeCallback = id => document.getElementById(id);
  const snap = sceneSnapshot();
  const omApplyProjectSettingsMax = Math.max(16, Math.round(Number(omapplyprojeCallback("om-pw").value) || projectScene.width));
  const omApplyProjectSettingsHeight = Math.max(16, Math.round(Number(omapplyprojeCallback("om-ph").value) || projectScene.height));
  const omapplyprojeValue = Math.max(1, Math.min(120, Math.round(Number(omapplyprojeCallback("om-pfps").value) || projectScene.fps)));
  const omApplyProjectSettingsValue = Math.max(1, Number(omapplyprojeCallback("om-pdur").value) || 10);
  const omApplyProjectSettingsResult = String(omapplyprojeCallback("om-pbghex").value || "").trim();
  const name = String(omapplyprojeCallback("om-pname").value || "").trim() || projectScene.title;
  projectScene.title = name, projectScene.width = omApplyProjectSettingsMax, projectScene.height = omApplyProjectSettingsHeight, projectScene.exportWidth = omApplyProjectSettingsMax, projectScene.exportHeight = omApplyProjectSettingsHeight, projectScene.fps = omapplyprojeValue, projectScene.totalTime = Math.round(omApplyProjectSettingsValue * 1000);
  if (/^#[0-9a-f]{8}$/i.test(omApplyProjectSettingsResult)) projectScene.bgcolor = parseHexColor(omApplyProjectSettingsResult);
  pushUndo(snap);
  appendLog("[PROYEK] Setelan: " + name + " · " + omApplyProjectSettingsMax + "×" + omApplyProjectSettingsHeight + " @ " + omapplyprojeValue + "fps · " + omApplyProjectSettingsValue + "s");
  try {
    handleHelperValue();
  } catch (omApplyProjectSettingsValueRaw) {}
}
export { buildHelperEl, buildHelperOuter, computeHelperEl, getHelperScoped, handleHelper, handleHelperList, handleHelperStart, handleLocal, helperParsed, jumpNextKeyframeOrBookmark, jumpPrevKeyframeOrBookmark, maxHelperParsed, maxHelperValue, nHelper, objHelperStart, omApplyProjectSettings, omMeta, omSceneXmlInner, processHelperLocal, renderElement, renderHelperInner, renderHelperParsed, renderHelperScoped };
