import { aHelper, audioOffsetMs, bindFlag, fromEntries, getPos, impstateEl, isPlaying, localList, localMap, localNext, localNodePending, localPrev, localRaw, localScoped, localSet, localValue, localValueExtra, localValueTracked, map, mapValue, matchMedia, omAddLayer, omMulti, omScheduleSave, omUploads, panesEl, playheadMs, projectScene, renderer, seekEl, subtitleEl, timelinedockEl, videoAudioSlots } from './state.js';
import { applyOuter, buildHelperValue, computeHelperEnd, computeHelperList, computeHelperLocal, eAHelper, handleHelperMin, omEffectXml, omHasAudioLayer, omHexFrom, omId, omLayerCur, omMultiIds, omUploadFile, processHelperByKey, updateHelperByKey } from './engine-core.js';
import { appendLog } from './render-text.js';
import { maxHelperValue, objHelperStart, omMeta, omSceneXmlInner } from './timeline-playback.js';
import { renderHelperOuter } from './parser-value.js';
import { maxHelper } from './export-progress.js';
import { applyHelperRaw, omMultiRefresh } from './ui-shell.js';
import { omParseLayer } from './parser-effect-xml.js';
import { omTransformXml, omTransformXmlObj } from './engine-transform.js';
import { omProp } from './ui-properties.js';
import { omKeyable } from './timeline-keyframe.js';
import { omWalkScenes } from './engine-scene.js';
function refHelperByKey(refLayers, refHelperByKeyArg) {
  let refHelperByKeyList = [];
  if (!refLayers || !refLayers.layers) return refHelperByKeyList;
  for (let refEndTime of refLayers.layers) {
    if (refEndTime.tag !== "audio") continue;
    let refOutput = Number(refHelperByKeyArg) || 0;
    refOutput < refEndTime.startTime || refOutput >= refEndTime.endTime || refHelperByKeyList.push(refEndTime);
  }
  return refHelperByKeyList;
}
function handleHelperEnd(media) {
  if (!media || !Array.isArray(media.media)) return media;
  let handleHelperEndMap = new Map();
  for (let uri of media.media) for (let handleValueLocal of [uri.uri, uri.filename, uri.title]) handleValueLocal && handleHelperEndMap.set(handleValueLocal, uri);
  let handleHelperEndValue = handleLayers => {
    if (!(!handleLayers || !Array.isArray(handleLayers.layers))) for (let fillVideo of handleLayers.layers) {
      let handleValueOuter = fillVideo.fillVideo || fillVideo.fillImage || '',
        widthValue = handleValueOuter ? handleHelperEndMap.get(handleValueOuter) : null;
      widthValue && (fillVideo.mediaNativeWidth = widthValue.width || 0, fillVideo.mediaNativeHeight = widthValue.height || 0, fillVideo.mediaOrientation = ((Number(widthValue.orientation) || 0) % 360 + 360) % 360), fillVideo.scene && handleHelperEndValue(fillVideo.scene);
    }
  };
  return handleHelperEndValue(media), media;
}
function buildHelperStart() {
  let buildLayer = fromEntries.layer;
  matchMedia.matches ? (buildLayer.parentElement !== timelinedockEl && timelinedockEl.appendChild(buildLayer), buildLayer.classList.add("active"), localValueTracked === "layer" && aHelper("proyek")) : (buildLayer.parentElement !== panesEl && panesEl.appendChild(buildLayer), buildLayer.classList.toggle("active", localValueTracked === "layer")), getPos(), requestAnimationFrame(() => {
    projectScene && buildHelperValue();
  });
}
function objHelperRaw(objId) {
  let objValueEl = mapValue.get(objId.id),
    objHelperRawValue = (objValueEl ? localMap.get(objValueEl) : '') || processHelperByKey(objId.src);
  if (!objHelperRawValue) {
    let objUpdate = updateHelperByKey();
    objUpdate && (objHelperRawValue = objUpdate.src, appendLog("[AUDIO] Sumber \"" + (objId.src || "(kosong)") + "\" tidak ada di package; layer \"" + (objId.label || objId.id) + "\" memakai \"" + objUpdate.name + '\x22.'));
  }
  let objTertiary = objValueEl || computeHelperList(objHelperRawValue, objId.src);
  return {
    url: objHelperRawValue,
    name: objTertiary
  };
}
function refHelperParsed(refArgInner, refHelperParsedArg, refArgRaw) {
  if (!refArgInner || !refArgInner.layers) return refArgRaw;
  for (let refScene of refArgInner.layers) {
    if (refScene.scene) {
      refHelperParsed(refScene.scene, refHelperParsedArg + (refScene.startTime || 0), refArgRaw);
      continue;
    }
    if (refScene.tag === "audio" || refScene.fillType !== "media") continue;
    let refHelperParsedValue = refScene.fillVideo || refScene.fillImage;
    refHelperParsedValue && refArgRaw.push({
      layer: refScene,
      offsetMs: refHelperParsedArg,
      key: refHelperParsedValue
    });
  }
  return refArgRaw;
}
function refHelperValue(refArgStart, refHelperValueArg, refArgParsed) {
  if (!refArgStart || !refArgStart.layers) return refArgParsed;
  for (let refTag of refArgStart.layers) {
    if (refTag.tag === "embedScene" && refTag.scene) {
      refHelperValue(refTag.scene, refHelperValueArg + (refTag.startTime || 0), refArgParsed);
      continue;
    }
    refTag.tag === "audio" && refArgParsed.push({
      layer: refTag,
      offsetMs: refHelperValueArg
    });
  }
  return refArgParsed;
}
function objHelperParsed(offsetMs) {
  return {
    start: offsetMs.offsetMs + (offsetMs.layer.startTime || 0),
    end: offsetMs.offsetMs + (offsetMs.layer.endTime || 0)
  };
}
function updateHelperByIndex(updateLayer, updateHelperByIndexArg) {
  let {
      start: updateValueNext
    } = objHelperParsed(updateLayer),
    updateNext = maxHelperValue(updateLayer.layer);
  return (updateLayer.layer.inTime || 0) + (updateHelperByIndexArg - audioOffsetMs - updateValueNext) * updateNext;
}
function handleHelperByKey() {
  let handleValueScoped = objHelper().layers.map((handleArgEnd, handleArgEl) => ({
    layer: handleArgEnd,
    key: localNext(handleArgEnd, handleArgEl)
  })).filter(handleArgList => getHelper(handleArgList.layer)).map(handleHelperByKeyResult => handleHelperByKeyResult.key);
  if (!handleValueScoped.length) return false;
  let handleValueByIndex = handleValueScoped.some(handleHelperByKeyArgValue => !localSet.has(handleHelperByKeyArgValue));
  return handleValueScoped.forEach(handleHelperByKeyArg => {
    handleValueByIndex ? localSet.add(handleHelperByKeyArg) : localSet.delete(handleHelperByKeyArg);
  }), bindFlag(), handleValueByIndex;
}
function renderWaveformSvgBars(layer, renderWaveformSvgBarsArgValue, renderWaveformSvgBarsArg) {
  let bars = [];
  const barSpacing = 4;
  const barWidth = 2.5;
  const count = Math.max(1, Math.floor(renderWaveformSvgBarsArgValue / barSpacing));
  const midY = renderWaveformSvgBarsArg / 2;
  let renderwavefoValue = (layer.id || "") + (layer.label || "") + (layer.src || "");
  let hash = 0;
  for (let renderWaveformSvgBarsValue = 0; renderWaveformSvgBarsValue < renderwavefoValue.length; renderWaveformSvgBarsValue++) {
    hash = ((hash << 5) - hash) + renderwavefoValue.charCodeAt(renderWaveformSvgBarsValue);
    hash |= 0;
  }
  for (let renderWaveformSvgBarsNumber = 0; renderWaveformSvgBarsNumber < count; renderWaveformSvgBarsNumber++) {
    let renderWaveformSvgBarsResult = renderWaveformSvgBarsNumber * barSpacing + 1;
    let norm = (renderWaveformSvgBarsNumber / Math.max(1, count));
    let amplitude = 0.4;
    if (layer.peaks && layer.peaks.length > 0) {
      let pIdx = Math.floor(norm * layer.peaks.length);
      amplitude = Math.max(0.12, Math.min(1, layer.peaks[pIdx] || 0.12));
    } else {
      let renderWaveformSvgBarsSin = Math.sin(norm * 18.0 + hash * 0.1);
      let renderWaveformSvgBarsCos = Math.cos(norm * 42.0 + hash * 0.05);
      let sinValue = Math.sin(norm * 90.0 + (renderWaveformSvgBarsNumber % 7));
      amplitude = Math.abs(renderWaveformSvgBarsSin * 0.45 + renderWaveformSvgBarsCos * 0.35 + sinValue * 0.2);
      let renderWaveformSvgBarsValueRaw = Math.sin(Math.min(1, Math.max(0, norm)) * Math.PI);
      amplitude = Math.min(1, Math.max(0.12, amplitude * (0.4 + 0.6 * renderWaveformSvgBarsValueRaw)));
    }
    let barH = Math.max(3, Math.round(amplitude * (renderWaveformSvgBarsArg - 6)));
    let renderWaveformSvgBarsRound = Math.round(midY - barH / 2);
    bars.push(`<rect x="${renderWaveformSvgBarsResult}" y="${renderWaveformSvgBarsRound}" width="${barWidth}" height="${barH}" rx="1.2" fill="#00ffa8" opacity="0.85" />`);
  }
  return bars.join("");
}
function decodeAudioPeaks(layer, decodeAudioPeaksArg) {
  if (!decodeAudioPeaksArg || layer.peaks) return;
  try {
    if (!window.__AM_AUDIO_CTX) {
      const ACtx = window.AudioContext || window.webkitAudioContext;
      if (ACtx) window.__AM_AUDIO_CTX = new ACtx();
    }
    const actx = window.__AM_AUDIO_CTX;
    if (!actx) return;
    fetch(decodeAudioPeaksArg)
      .then(arrayBuffer => arrayBuffer.arrayBuffer())
      .then(decodeaudiopValue => actx.decodeAudioData(decodeaudiopValue))
      .then(audioBuf => {
        const rawData = audioBuf.getChannelData(0);
        const samples = 120;
        const blockSize = Math.floor(rawData.length / samples);
        const peaks = [];
        for (let decodeAudioPeaksNumber = 0; decodeAudioPeaksNumber < samples; decodeAudioPeaksNumber++) {
          let decodeaudiopNumber = 0;
          for (let decodeAudioPeaksValue = 0; decodeAudioPeaksValue < blockSize; decodeAudioPeaksValue++) {
            decodeaudiopNumber += Math.abs(rawData[decodeAudioPeaksNumber * blockSize + decodeAudioPeaksValue]);
          }
          peaks.push(Math.min(1, (decodeaudiopNumber / blockSize) * 2.8));
        }
        layer.peaks = peaks;
        if (bindFlag) bindFlag();
      })
      .catch(() => {});
  } catch (decodeAudioPeaksResult) {}
}
function objHelper() {
  if (!projectScene) return {
    scene: null,
    layers: [],
    offsetMs: 0
  };
  let objHelperNumber = 0,
    objLayers = projectScene;
  for (let objLayer of localList) if (objHelperNumber += objLayer.layer.startTime || 0, objLayers = objLayer.layer.scene, !objLayers) break;
  return {
    scene: objLayers,
    layers: objLayers && objLayers.layers || [],
    offsetMs: objHelperNumber
  };
}
function join() {
  let joinItems = [projectScene && projectScene.title || "Proyek"];
  for (let joinLayer of localList) joinItems.push(joinLayer.layer.label || joinLayer.layer.id || "Scene");
  return joinItems.join(" › ");
}
function getHelper(getHelperScene) {
  let getHelperLayers = getHelperScene && getHelperScene.scene;
  const getValueByKey = (getHelperScene && getHelperScene.tag || '').toLowerCase();
  return (getValueByKey === "embedscene" || getValueByKey === "group") && !!getHelperLayers && Array.isArray(getHelperLayers.layers);
}
function handleHelperEl(handleHelperElArg, handleHelperElArgValue = false) {
  if (!videoAudioSlots.length) return;
  let videoAudioMute = document.getElementById("videoAudioMute"),
    handleValuePrev = videoAudioMute ? videoAudioMute.checked : true,
    handlePrev = (renderer && renderer.videoDriftMs || 300) / 1000,
    handleHelperElMap = new Map();
  for (let handleEl of videoAudioSlots) {
    let handleHelperElHandleValue = handleEl.el || (handleEl.el = computeHelperLocal(handleEl.key));
    if (!handleHelperElHandleValue || handleHelperElHandleValue.tagName !== "VIDEO") continue;
    let {
        start: handleObj,
        end: handleValueEl
      } = objHelperParsed(handleEl),
      handleValueSource = handleValuePrev && handleHelperElArg >= handleObj && handleHelperElArg < handleValueEl,
      handleActive = handleHelperElMap.get(handleHelperElHandleValue);
    if (handleActive || (handleActive = {
      active: false,
      vol: 0,
      driver: null
    }, handleHelperElMap.set(handleHelperElHandleValue, handleActive)), !handleValueSource) continue;
    let handleValueList = handleValueEl - handleObj,
      handleSource = handleValueList > 0 ? Math.max(0, Math.min(1, (handleHelperElArg - handleObj) / handleValueList)) : 0,
      vol = Math.max(0, Math.min(1, renderHelperOuter(handleEl.layer, handleSource)));
    (!handleActive.active || vol > handleActive.vol) && (handleActive.vol = vol), handleActive.driver || (handleActive.driver = {
      entry: handleEl,
      start: handleObj
    }), handleActive.active = true;
  }
  for (let [handleMuted, activeValue] of handleHelperElMap) {
    let mutedValue = !activeValue.active || activeValue.vol <= 0;
    if (handleMuted.muted !== mutedValue && (handleMuted.muted = mutedValue), Math.abs(handleMuted.volume - activeValue.vol) > 0.001 && (handleMuted.volume = activeValue.vol), !activeValue.active) {
      handleMuted.volume !== 0 && (handleMuted.volume = 0);
      continue;
    }
    if (handleMuted.readyState >= 2 && Number.isFinite(handleMuted.duration)) {
      let {
          entry: driver,
          start: handleDriver
        } = activeValue.driver,
        handleCurrentTime = maxHelper(driver.layer, Math.max(0, handleHelperElArg - handleDriver), handleMuted.duration);
      if (handleCurrentTime !== null && (handleHelperElArgValue || Math.abs(handleMuted.currentTime - handleCurrentTime) > handlePrev)) try {
        handleMuted.currentTime = handleCurrentTime;
      } catch {}
      if (isPlaying && handleMuted.paused) try {
        handleMuted.play().catch(() => {});
      } catch {}
    }
  }
}
function processInner(processInnerArg = "diag") {
  if (!videoAudioSlots.length) {
    appendLog("[AUDIO][" + processInnerArg + "] tidak ada layer video sumber suara");
    return;
  }
  let videoAudioMute = document.getElementById("videoAudioMute");
  appendLog("[AUDIO][" + processInnerArg + "] t=" + (playheadMs / 1000).toFixed(2) + "s, opsi \"Putar suara dari layer video\"=" + (videoAudioMute ? videoAudioMute.checked : "n/a"));
  for (let processEl of videoAudioSlots) {
    let processInnerValue = processEl.el || computeHelperLocal(processEl.key),
      {
        start: processObj,
        end: processValueEnd
      } = objHelperParsed(processEl),
      processRender = renderHelperOuter(processEl.layer, 0.5);
    if (!processInnerValue) {
      appendLog("[AUDIO][" + processInnerArg + "] \"" + (processEl.layer.label || processEl.layer.id) + "\": ELEMEN VIDEO TIDAK KETEMU (key " + processEl.key + ')');
      continue;
    }
    if (processInnerValue.tagName !== "VIDEO") {
      appendLog("[AUDIO][" + processInnerArg + "] \"" + (processEl.layer.label || processEl.layer.id) + "\": slot \"" + processEl.key + "\" berisi " + processInnerValue.tagName + " (gambar), bukan video -> tidak ada suara");
      continue;
    }
    appendLog("[AUDIO][" + processInnerArg + "] \"" + (processEl.layer.label || processEl.layer.id) + "\" win " + (processObj / 1000).toFixed(1) + '-' + (processValueEnd / 1000).toFixed(1) + "s, gain@0.5=" + processRender.toFixed(2) + ", ready=" + processInnerValue.readyState + ", paused=" + processInnerValue.paused + ", muted=" + processInnerValue.muted + ", vol=" + processInnerValue.volume.toFixed(2) + ", t=" + processInnerValue.currentTime.toFixed(2) + ", dur=" + (Number.isFinite(processInnerValue.duration) ? processInnerValue.duration.toFixed(1) : '?'));
  }
}
function updateHelperCount() {
  if (!projectScene) return null;
  let updateFlag = refHelperValue(projectScene, 0, []).map(({
      layer: updateArgScoped,
      offsetMs: updateArgPrev
    }) => {
      if (applyOuter(updateArgScoped)) return null;
      let {
        url: updateByIndex
      } = objHelperRaw(updateArgScoped);
      return updateByIndex ? objHelperStart(updateArgScoped, updateArgPrev, updateByIndex) : null;
    }).filter(Boolean),
    videoAudioMute = document.getElementById("videoAudioMute");
  if (videoAudioMute ? videoAudioMute.checked : true) for (let {
    layer: updateLabel,
    offsetMs: updatePrev,
    key: updateValueScoped
  } of refHelperParsed(projectScene, 0, [])) {
    if (!computeHelperEnd(updateValueScoped)) {
      appendLog("[EXPORT][AUDIO] Lewati \"" + (updateLabel.label || updateLabel.id) + "\": slot media \"" + updateValueScoped + "\" belum berisi file video (terpasang: " + (map.get(updateValueScoped) || '-') + ').');
      continue;
    }
    let {
      url: updateHandle
    } = handleHelperMin(updateValueScoped);
    updateHandle && updateFlag.push(objHelperStart(updateLabel, updatePrev, updateHandle));
  }
  return updateFlag.length ? updateFlag : null;
}
function processHelper(processHelperArg) {
  let processHelperList = [];
  localValueExtra && processHelperList.push("preset: " + localValueExtra), localScoped && processHelperList.push("audio: " + localScoped), localPrev && processHelperList.push("foto: " + localPrev), projectScene && processHelperList.push(projectScene.layers.length + " layer, " + (projectScene.totalTime / 1000).toFixed(1) + "s, " + projectScene.width + 'x' + projectScene.height), processHelperArg && processHelperList.push(processHelperArg), impstateEl.textContent = processHelperList.join('\x0a') || "pilih file .xml (boleh 2: preset + grup), audio (mp4 boleh), dan foto sendiri";
}
function cloneLayerSafe(layer) {
  try {
    return structuredClone(layer);
  } catch (cloneLayerSafeValue) {
    return JSON.parse(JSON.stringify(layer));
  }
}
function omCopyLayers(layers) {
  const omCopyLayersValue = omMulti.size ? omMultiIds() : [];
  const targets = (layers && layers.length) ? layers : (omCopyLayersValue.length ? omCopyLayersValue.map(id => omResolveLayer(id)).filter(Boolean) : [omLayerCur()].filter(Boolean));
  if (!targets.length) return [];
  window.__omClipboardLayers = targets.map(omCopyLayersArg => cloneLayerSafe(omCopyLayersArg));
  const count = window.__omClipboardLayers.length;
  appendLog(count === 1 ? "1 Lapisan disalin ke papan klip" : `${count} Lapisan disalin ke papan klip`);
  return window.__omClipboardLayers;
}
function omMultiSelectAll() {
  const currentLayers = (projectScene && projectScene.layers) || [];
  omMulti.clear();
  currentLayers.forEach(omMultiSelectAllId => {
    if (omMultiSelectAllId && omMultiSelectAllId.id) omMulti.add(omMultiSelectAllId.id);
  });
  omMultiRefresh();
}
function omAddCamera() {
  const omAddCameraOmMeta = omMeta();
  const omaddcameraNumber = 60;
  const omAddCameraResult = renderer && renderer.workHeight ? renderer.workHeight : omAddCameraOmMeta.h;
  const omaddcameraValue = omAddCameraResult / omAddCameraOmMeta.h;
  const omAddCameraValue = +(omAddCameraResult / (2 * Math.tan(omaddcameraNumber * Math.PI / 360))).toFixed(2);
  const omAddCameraValueRaw = +(omAddCameraOmMeta.w / 2 * omaddcameraValue).toFixed(2);
  const omAddCameraRaw = +(omAddCameraOmMeta.h / 2 * omaddcameraValue).toFixed(2);
  const omAddCameraValueParsed = '<camera id="' + omId() + '" label="Kamera" type="perspective" startTime="0" endTime="' + omAddCameraOmMeta.total + '"><fov value="' + omaddcameraNumber + '" /><transform><location value="' + omAddCameraValueRaw + ',' + omAddCameraRaw + ',' + omAddCameraValue + '" /><scale value="1,1" /><rotation value="0" /></transform><focus-blur enabled="false"><distance value="' + omAddCameraValue + '" /><depth-of-field value="100" /><strength value="0.5" /></focus-blur><fog enabled="false"><color value="#ffffffff" /><near-z value="0" /><far-z value="' + Math.round(omAddCameraValue * 1.5) + '" /></fog></camera>';
  const layer = omParseLayer(omAddCameraValueParsed);
  if (!layer) return omAddLayer(layer, "Kamera");
  layer.fillType = "none";
  layer.opaque = false;
  layer.cameraType = "perspective";
  layer.fov = 60;
  layer.cameraZoom = parseFloat(omAddCameraValue) || 500;
  layer.focusBlur = { enabled: false, distance: parseFloat(omAddCameraValue) || 500, depthOfField: 100, strength: 0.5 };
  layer.fog = { enabled: false, color: [1, 1, 1, 1], nearZ: 0, farZ: Math.round((parseFloat(omAddCameraValue) || 500) * 1.5) };
  return omAddLayer(layer, "Kamera");
}
async function omAddMediaFile(file) {
  if (!projectScene) return;
  const omAddMediaFileOmMeta = omMeta(), isVid = /^video\//.test(file.type || '');
  const omaddmediafiValue = "am:user:" + Date.now() + ":" + Math.floor(Math.random() * 1e5);
  const omAddMediaFileFlag = await omUploadFile(file);
  const srcUrl = omAddMediaFileFlag ? omAddMediaFileFlag.url : URL.createObjectURL(file);
  if (omAddMediaFileFlag) omUploads.push({
    uri: omaddmediafiValue,
    name: file.name,
    file: omAddMediaFileFlag.name,
    url: omAddMediaFileFlag.url
  });
  localRaw.set(file.name, {
    name: file.name,
    src: srcUrl
  }), localNodePending.push(localRaw.get(file.name)), localValue.includes(file.name) || localValue.push(file.name), map.set(omaddmediafiValue, file.name), projectScene.media.push({
    uri: omaddmediafiValue,
    type: file.type || "image/png",
    filename: file.name,
    title: file.name,
    duration: 0,
    width: 0,
    height: 0,
    orientation: 0
  });
  const omAddMediaFileRound = Math.round(Math.min(omAddMediaFileOmMeta.w, omAddMediaFileOmMeta.h) * 0.7);
  const omAddMediaFileValue = '<shape id="' + omId() + '" label="' + file.name + '" startTime="0" endTime="' + omAddMediaFileOmMeta.total + '" fillType="media" fillImage="' + omaddmediafiValue + '" mediaFillMode="' + (isVid ? "fit" : "fill") + '" s=".rect"><property name="size" type="vec2" value="' + omAddMediaFileRound + ',' + omAddMediaFileRound + '" />' + omTransformXml(Math.round(omAddMediaFileOmMeta.w / 2), Math.round(omAddMediaFileOmMeta.h / 2), 1) + '</shape>';
  const layer = omParseLayer(omAddMediaFileValue);
  if (!layer) return appendLog("[EDIT] gagal membuat layer media");
  try {
    await applyHelperRaw(file.name);
  } catch {}
  await omAddLayer(layer, file.name);
}
function omExtendTotal(omextendtotaValue) {
  if (!projectScene || !(omextendtotaValue > 0)) return;
  const omExtendTotalResult = projectScene.totalTime || 0;
  if (omextendtotaValue <= omExtendTotalResult) return;
  const omExtendTotalValue = Math.ceil(omextendtotaValue / 1000) * 1000;
  projectScene.totalTime = omExtendTotalValue;
  try {
    seekEl.max = String(omExtendTotalValue);
  } catch (omExtendTotalValueRaw) {}
  try {
    subtitleEl && (subtitleEl.textContent = projectScene.title + " - " + (projectScene.layers ? projectScene.layers.length : 0) + " layer - " + (omExtendTotalValue / 1000).toFixed(1) + "s");
  } catch (omExtendTotalRaw) {}
  appendLog("[PROYEK] Durasi timeline diperpanjang → " + (omExtendTotalValue / 1000).toFixed(1) + "s");
  omScheduleSave();
}
function omPatchSourceXml(layer) {
  let ompatchsourcValue = layer.sourceXml || "";
  if (!ompatchsourcValue) return "";
  ompatchsourcValue = ompatchsourcValue.replace(/\sstartTime="[^"]*"/, ` startTime="${layer.startTime || 0}"`);
  ompatchsourcValue = ompatchsourcValue.replace(/\sendTime="[^"]*"/, ` endTime="${layer.endTime || 0}"`);
  if (layer.label != null && /\slabel="[^"]*"/.test(ompatchsourcValue)) ompatchsourcValue = ompatchsourcValue.replace(/\slabel="[^"]*"/, ` label="${eAHelper(layer.label)}"`);
  if (layer.fillType) {
    if (/\sfillType="[^"]*"/.test(ompatchsourcValue)) ompatchsourcValue = ompatchsourcValue.replace(/\sfillType="[^"]*"/, ` fillType="${eAHelper(layer.fillType)}"`);
  }
  if (layer.fillImage) {
    if (/\sfillImage="[^"]*"/.test(ompatchsourcValue)) ompatchsourcValue = ompatchsourcValue.replace(/\sfillImage="[^"]*"/, ` fillImage="${eAHelper(layer.fillImage)}"`);
    else ompatchsourcValue = ompatchsourcValue.replace(/^<([a-zA-Z]+)/, `<$1 fillImage="${eAHelper(layer.fillImage)}"`);
  }
  if (layer.fillVideo) {
    if (/\sfillVideo="[^"]*"/.test(ompatchsourcValue)) ompatchsourcValue = ompatchsourcValue.replace(/\sfillVideo="[^"]*"/, ` fillVideo="${eAHelper(layer.fillVideo)}"`);
    else ompatchsourcValue = ompatchsourcValue.replace(/^<([a-zA-Z]+)/, `<$1 fillVideo="${eAHelper(layer.fillVideo)}"`);
  }
  if (layer.hidden) ompatchsourcValue = /\shidden=/.test(ompatchsourcValue) ? ompatchsourcValue.replace(/\shidden="[^"]*"/, ' hidden="true"') : ompatchsourcValue.replace(/^<([a-zA-Z]+)/, `<$1 hidden="true"`);
  if (layer.parentId) {
    if (/\sparent="[^"]*"/.test(ompatchsourcValue)) ompatchsourcValue = ompatchsourcValue.replace(/\sparent="[^"]*"/, ` parent="${eAHelper(layer.parentId)}"`);
    else ompatchsourcValue = ompatchsourcValue.replace(/^<([a-zA-Z]+)/, `<$1 parent="${eAHelper(layer.parentId)}"`);
  } else {
    ompatchsourcValue = ompatchsourcValue.replace(/\sparent="[^"]*"/, '');
  }
  return ompatchsourcValue;
}
function omLayerXml(layer) {
  if (!layer) return "";
  if ((layer.path || layer.pathStroke || (layer.strokes && layer.strokes.length)) && layer.sourceXml) return omPatchSourceXml(layer);
  const omlayerxmlValue = layer.tag || "shape";
  let attrs = ` id="${eAHelper(layer.id || omId())}" label="${eAHelper(layer.label || '')}" startTime="${layer.startTime || 0}" endTime="${layer.endTime || 0}"`;
  if (layer.inTime) attrs += ` inTime="${layer.inTime}"`;
  if (layer.outTime) attrs += ` outTime="${layer.outTime}"`;
  if (layer.hidden) attrs += ' hidden="true"';
  if (layer.blendMode && layer.blendMode !== "normal") attrs += ` blending="${eAHelper(layer.blendMode)}"`;
  if (layer.speed && layer.speed !== 1) attrs += ` speed="${layer.speed}"`;
  if (layer.parentId) attrs += ` parent="${eAHelper(layer.parentId)}"`;
  if (omlayerxmlValue === "shape") {
    if (layer.shapeType) attrs += ` s="${eAHelper(layer.shapeType)}"`;
    if (layer.fillType) attrs += ` fillType="${eAHelper(layer.fillType)}"`;
    if (layer.mediaFillMode && layer.fillType === "media") attrs += ` mediaFillMode="${eAHelper(layer.mediaFillMode)}"`;
    if (layer.fillType === "media") {
      if (layer.fillImage) attrs += ` fillImage="${eAHelper(layer.fillImage)}"`;
      if (layer.fillVideo) attrs += ` fillVideo="${eAHelper(layer.fillVideo)}"`;
    }
  }
  if (omlayerxmlValue === "text") {
    if (layer.font) attrs += ` font="${eAHelper(layer.font)}"`;
    if (layer.fontSize) attrs += ` size="${layer.fontSize}"`;
    if (layer.align && layer.align !== "center") attrs += ` align="${eAHelper(layer.align)}"`;
    if (layer.wrapWidth) attrs += ` wrapWidth="${layer.wrapWidth}"`;
    if (layer.letterSpacing) attrs += ` letterSpacing="${layer.letterSpacing}"`;
    if (layer.lineSpacing && layer.lineSpacing !== 1) attrs += ` lineSpacing="${layer.lineSpacing}"`;
  }
  if (omlayerxmlValue === "audio" && layer.src) attrs += ` src="${eAHelper(layer.src)}"`;
  if (omlayerxmlValue === "camera") {
    attrs += ` type="${eAHelper(layer.cameraType || 'perspective')}"`;
  }
  let kids = omTransformXmlObj(layer.transform);
  if ((omlayerxmlValue === "shape" || omlayerxmlValue === "text") && layer.fillType !== "media" && layer.fillColor) kids += `<fillColor value="${omHexFrom(layer.fillColor)}" />`;
  if (omlayerxmlValue === "shape" && layer.fillType === "gradient" && layer.gradient) {
    const omLayerXmlGradient = layer.gradient;
    const sStr = (omLayerXmlGradient.start || [0, 0]).join(",");
    const eStr = (omLayerXmlGradient.end || [1, 0]).join(",");
    kids += `<gradient type="${eAHelper(omLayerXmlGradient.type || 'linear')}" start="${sStr}" end="${eStr}" startColor="${omHexFrom(omLayerXmlGradient.startColor)}" endColor="${omHexFrom(omLayerXmlGradient.endColor)}">`;
    if (omLayerXmlGradient.stops && omLayerXmlGradient.stops.length) {
      for (const omLayerXmlT of omLayerXmlGradient.stops) {
        kids += `<stop t="${omLayerXmlT.t}" color="${omHexFrom(omLayerXmlT.color)}" />`;
      }
    }
    kids += `</gradient>`;
  }
  if (omlayerxmlValue === "shape" && layer.size) kids += omProp("size", "vec2", {
    dataType: "vec2",
    channel: layer.size
  });
  if (layer.shapeProps) {
    for (const [name, omLayerXmlDataType] of Object.entries(layer.shapeProps)) {
      if (name === "size" || name === "blendMode" || name === "blending" || !omLayerXmlDataType) continue;
      const omLayerXmlValue = omLayerXmlDataType.dataType || (name === "cornerRadius" || name === "startAngle" || name === "endAngle" ? "float" : "float");
      kids += omProp(name, omLayerXmlValue, omLayerXmlDataType);
    }
  }
  if (omlayerxmlValue === "text" || layer.textContent) kids += `<content>${eAHelper(layer.textContent || '')}</content>`;
  if (layer.gain && (layer.gain.value && layer.gain.value[0] !== 1 || (layer.gain.kfs || []).length)) kids += omKeyable("gain", layer.gain);
  if (omlayerxmlValue === "camera") {
    if (layer.fov > 0) kids += `<fov value="${layer.fov}" />`;
    if (layer.focusBlur) {
      const omLayerXmlFocusBlur = layer.focusBlur;
      kids += `<focus-blur enabled="${omLayerXmlFocusBlur.enabled ? 'true' : 'false'}"><distance value="${omLayerXmlFocusBlur.distance != null ? omLayerXmlFocusBlur.distance : 500}" /><depth-of-field value="${omLayerXmlFocusBlur.depthOfField != null ? omLayerXmlFocusBlur.depthOfField : 100}" /><strength value="${omLayerXmlFocusBlur.strength != null ? omLayerXmlFocusBlur.strength : 0.5}" /></focus-blur>`;
    }
    if (layer.fog) {
      const omLayerXmlFog = layer.fog;
      const cHex = omLayerXmlFog.color ? omHexFrom(omLayerXmlFog.color) : "#ffffffff";
      kids += `<fog enabled="${omLayerXmlFog.enabled ? 'true' : 'false'}"><color value="${cHex}" /><near-z value="${omLayerXmlFog.nearZ != null ? omLayerXmlFog.nearZ : 0}" /><far-z value="${omLayerXmlFog.farZ != null ? omLayerXmlFog.farZ : 500}" /></fog>`;
    }
  } else if (layer.fov > 0) kids += `<fov value="${layer.fov}" />`;
  if (layer.border) kids += `<border direction="${eAHelper(layer.border.direction || 'outside')}"><color value="${omHexFrom(layer.border.color)}"/><size value="${layer.border.size || 0}" /></border>`;
  if (layer.shadow) kids += `<shadow ${layer.shadow.enabled === false ? 'enabled="false"' : ""} direction="${eAHelper(layer.shadow.direction || 'outside')}"><color value="${omHexFrom(layer.shadow.color)}"/><size value="${layer.shadow.size || 0}"/><offset value="${(layer.shadow.offset || [0, 0]).join(",")}" /></shadow>`;
  if (layer.path && layer.path.commands) {
    const dStr = layer.path.commands.map(omLayerXmlArgValue => omLayerXmlArgValue.join(' ')).join(' ');
    kids += `<path d="${eAHelper(dStr)}" />`;
  }
  if (layer.pathStroke) {
    kids += `<path-stroke enabled="${layer.pathStroke.enabled !== false}" direction="${eAHelper(layer.pathStroke.direction || 'centered')}" cap="${eAHelper(layer.pathStroke.cap || 'round')}"><color value="${omHexFrom(layer.pathStroke.color)}"/><size value="${layer.pathStroke.size || 0}"/></path-stroke>`;
  }
  if (layer.strokes && layer.strokes.length) {
    for (const omLayerXmlPoints of layer.strokes) {
      const omLayerXmlResult = (omLayerXmlPoints.points || []).map(omLayerXmlArg => `${omLayerXmlArg[0].toFixed(2)},${omLayerXmlArg[1].toFixed(2)},${(omLayerXmlArg[2] != null ? omLayerXmlArg[2] : 1).toFixed(2)}`).join(';');
      kids += `<stroke color="${omHexFrom(omLayerXmlPoints.color)}" width="${omLayerXmlPoints.width || 0}" type="${eAHelper(omLayerXmlPoints.type || 'pen')}" points="${omLayerXmlResult}" />`;
    }
  }
  (layer.effects || []).forEach(omLayerXmlArgRaw => {
    kids += omEffectXml(omLayerXmlArgRaw);
  });
  if (layer.scene) kids += omSceneXmlInner(layer.scene);
  (layer.children || []).forEach(omLayerXmlRaw => {
    kids += omLayerXml(omLayerXmlRaw);
  });
  const voidTags = ["nullobj", "camera", "audio"];
  if (!kids) return `<${omlayerxmlValue}${attrs} />`;
  return `<${omlayerxmlValue}${attrs}>${kids}</${omlayerxmlValue}>`;
}
function omRewriteAudioSrcs(omRewriteAudioSrcsArg) {
  const omRewriteAudioSrcsValue = (omRewriteAudioSrcsArg || []).filter(omRewriteAudioSrcsKind => omRewriteAudioSrcsKind.kind === "audio" && omRewriteAudioSrcsKind.url);
  if (!omRewriteAudioSrcsValue.length || !projectScene) return false;
  omWalkScenes(projectScene, omRewriteAudioSrcsLayers => {
    (omRewriteAudioSrcsLayers.layers || []).forEach(omRewriteAudioSrcsId => {
      const omRewriteAudioSrcsUrl = omRewriteAudioSrcsValue.find(layerId => layerId.layerId === omRewriteAudioSrcsId.id);
      omRewriteAudioSrcsUrl && (omRewriteAudioSrcsId.src = omRewriteAudioSrcsUrl.url);
    });
    (omRewriteAudioSrcsLayers.audio || []).forEach(omRewriteAudioSrcsSrc => {
      const urlValue = omRewriteAudioSrcsValue.find(omRewriteAudioSrcsLayerId => omRewriteAudioSrcsLayerId.layerId === omRewriteAudioSrcsSrc.id);
      urlValue && (omRewriteAudioSrcsSrc.src = urlValue.url);
    });
  });
  return true;
}
function omResolveLayer(id) {
  let omResolveLayerText = null;
  if (!projectScene) return null;
  omWalkScenes(projectScene, omResolveLayerLayers => {
    (omResolveLayerLayers.layers || []).forEach(omResolveLayerId => {
      if (!omResolveLayerText && String(omResolveLayerId.id) === String(id)) omResolveLayerText = omResolveLayerId;
    });
  });
  return omResolveLayerText;
}
function omBarUpdate(layer) {
  const ombarupdateOmElembarEl = document.getElementById("om-elembar");
  if (!ombarupdateOmElembarEl) return;
  const ombarupdateResult = {
    "Trim kiri": !!layer,
    "Split": !!layer,
    "Trim kanan": !!layer,
    "Mute": !!(layer && omHasAudioLayer(layer)),
    "Teks": !!(layer && layer.tag === "text"),
    "Color & Fill": !!layer,
    "Border & Shadow": !!layer,
    "Blending & Opacity": !!layer,
    "Move & Transform": !!layer
  };
  ombarupdateOmElembarEl.querySelectorAll("button").forEach(omBarUpdateDataset => {
    const role = omBarUpdateDataset.dataset.role;
    if (role && role in ombarupdateResult) omBarUpdateDataset.disabled = !ombarupdateResult[role];
  });
}
function findParentArray(layer) {
  if (!layer || !projectScene) return null;
  if (projectScene.layers && projectScene.layers.indexOf(layer) >= 0) return projectScene.layers;
  let found = null;
  const walk = scene => {
    if (found || !scene || !scene.layers) return;
    if (scene.layers.indexOf(layer) >= 0) {
      found = scene.layers;
      return;
    }
    for (const findParentArrayScene of scene.layers) if (findParentArrayScene.scene) walk(findParentArrayScene.scene);
  };
  return walk(projectScene), found;
}
export { buildHelperStart, cloneLayerSafe, decodeAudioPeaks, findParentArray, getHelper, handleHelperByKey, handleHelperEl, handleHelperEnd, join, objHelper, objHelperParsed, objHelperRaw, omAddCamera, omAddMediaFile, omBarUpdate, omCopyLayers, omExtendTotal, omLayerXml, omMultiSelectAll, omPatchSourceXml, omResolveLayer, omRewriteAudioSrcs, processHelper, processInner, refHelperByKey, refHelperParsed, refHelperValue, renderWaveformSvgBars, updateHelperByIndex, updateHelperCount };
