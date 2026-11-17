import { handleHelper, omApplyProjectSettings, renderHelperScoped } from './timeline-playback.js';
import { appendLog, flagHelper, getFlag, helperOuter, omMultiRefreshStyles, refHelperMap, renderHelperMin } from './render-text.js';
import { applyHelperClamped, applyInner, buildHelperClamped, buildHelperMin, computeHelperLocal, eAHelper, getHelperEl, omHexFrom, omLayerCur, omMultiClear, omPass, omSerializeScene, onclick, processHelperValue, redoScene, refHelperList, undoScene } from './engine-core.js';
import { OM_BGS, applyFlag, applyHelperValue, buildHelperCount, byFileName, computeHelperScoped, contains, enginerowsEl, expEnabledEl, expcatsEl, exprowsEl, eyeOff, freeze, handleHelperOuter, helperCount, localList, localNext, localNodePending, localNodeResolved, localOuter, localRef, localSet, localValueBuffer, localValueMode, localValueScoped, map, mapValue, omActProp, omEnsureId, omFxDialogLayer, omFxIndex, omFxIndexCache, omKfRemoveAt, omKfSetEasing, omMulti, omMultiDelete, omMultiGroup, omMuteToggle, omOpenTextDlg, omProjectId, omPropsLayerId, omScheduleSave, omTrimSide, omUploads, photogalleryEl, playheadMs, processLocal, projectScene, renderHelperLocal, renderHelperValue, renderer, seekToTime, splitLayerAt, textValue, urlamEl, urldriveEl, valueRaw, valueSorted, valueStage, videoAudioSlots } from './state.js';
import { getHelper, join, objHelper, objHelperRaw, omBarUpdate, omResolveLayer, refHelperValue } from './engine-layer.js';
import { processHelperScoped } from './render-camera.js';
import { computeHelperParsed } from './engine-scene.js';
import { omPropsRefresh } from './ui-properties.js';
import { omFxWidget } from './timeline-keyframe.js';
import { omKeyableOf, readGlobalT } from './engine-transform.js';
function processHelperEnd(readyState, processArgLocal = 1500) {
  return !readyState || readyState.readyState >= 2 ? Promise.resolve() : new Promise(processHelperEndArg => {
    let processHelperEndProcessValue = () => {
        clearTimeout(processHelperEndBoundary), readyState.removeEventListener("loadedmetadata", processHelperEndProcessValue), readyState.removeEventListener("loadeddata", processHelperEndProcessValue), readyState.removeEventListener("canplay", processHelperEndProcessValue), readyState.removeEventListener("error", processHelperEndProcessValue), processHelperEndArg();
      },
      processHelperEndBoundary = setTimeout(processHelperEndProcessValue, processArgLocal);
    readyState.addEventListener("loadedmetadata", processHelperEndProcessValue, {
      once: true
    }), readyState.addEventListener("loadeddata", processHelperEndProcessValue, {
      once: true
    }), readyState.addEventListener("canplay", processHelperEndProcessValue, {
      once: true
    }), readyState.addEventListener("error", processHelperEndProcessValue, {
      once: true
    });
  });
}
function applyHelperRaw(applyHelperRawArg) {
  let applyRender = renderHelperScoped(applyHelperRawArg);
  return applyRender.tagName === "VIDEO" ? applyRender.readyState >= 1 ? Promise.resolve(applyRender) : new Promise(applyHelperRawArgValue => {
    applyRender.addEventListener("loadedmetadata", () => applyHelperRawArgValue(applyRender), {
      once: true
    }), applyRender.addEventListener("error", () => applyHelperRawArgValue(applyRender), {
      once: true
    });
  }) : applyRender.complete && applyRender.naturalWidth ? Promise.resolve(applyRender) : new Promise(applyArgLocal => {
    applyRender.addEventListener("load", () => applyArgLocal(applyRender), {
      once: true
    }), applyRender.addEventListener("error", () => {
      appendLog("[MEDIA] Gagal memuat " + applyHelperRawArg), applyArgLocal(applyRender);
    }, {
      once: true
    });
  });
}
function handleHelperRaw(handleHelperRawFlag, handleHelperRawClassName = "thumb", {
  preview: handleArgLocal = true
} = {}) {
  let handleSrc = handleHelperRawFlag ? processHelperValue(handleHelperRawFlag) : null,
    handleFlag = handleSrc ? handleSrc.src || handleSrc.url : '';
  if (!handleFlag) {
    let divEl = document.createElement("div");
    return divEl.className = handleHelperRawClassName + " thumb-empty", divEl.textContent = '?', divEl;
  }
  let muted;
  return buildHelperClamped(handleHelperRawFlag, handleSrc) ? (muted = document.createElement("video"), muted.muted = true, muted.playsInline = true, muted.preload = "metadata", muted.src = handleFlag.includes('#') ? handleFlag : handleFlag + "#t=0.1") : (muted = document.createElement("img"), muted.alt = handleHelperRawFlag, muted.loading = "lazy", muted.src = handleFlag), muted.className = handleHelperRawClassName, muted.title = handleHelperRawFlag, handleArgLocal && muted.addEventListener("click", stopPropagation => {
    stopPropagation.stopPropagation(), processMin(handleHelperRawFlag);
  }), muted;
}
function processMin(alt) {
  let processSrc = processHelperValue(alt);
  if (!processSrc) return;
  let processMinValue = processSrc.src || processSrc.url,
    lightboxBody = document.getElementById("lightboxBody");
  lightboxBody.innerHTML = '';
  let controls;
  buildHelperClamped(alt, processSrc) ? (controls = document.createElement("video"), controls.controls = true, controls.loop = true, controls.muted = true, controls.playsInline = true, controls.autoplay = true) : (controls = document.createElement("img"), controls.alt = alt), controls.src = processMinValue, lightboxBody.appendChild(controls), document.getElementById("lightboxTitle").textContent = alt, document.getElementById("lightbox").showModal();
}
function bindHelperRaw() {
  let audioRows = document.getElementById("audioRows");
  if (!audioRows) return;
  audioRows.innerHTML = '';
  let bindHelperRawList = [];
  projectScene && projectScene.audio && projectScene.audio.length ? projectScene.audio.forEach((idArg, bindHelperRawArg) => {
    bindHelperRawList.push({
      id: idArg.id || "audio-" + bindHelperRawArg,
      label: idArg.label || "Track Audio " + (bindHelperRawArg + 1),
      src: idArg.src,
      startTime: idArg.startTime,
      endTime: idArg.endTime,
      inTime: idArg.inTime || 0
    });
  }) : bindHelperRawList.push({
    id: "main-audio",
    label: "Audio utama",
    src: localOuter,
    startTime: 0,
    endTime: projectScene ? projectScene.totalTime : 0
  }), bindHelperRawList.forEach((bindId, bindArgClamped) => {
    let {
      url: bindValueDerived,
      name: bindValueEl
    } = objHelperRaw(bindId);
    !mapValue.has(bindId.id) && bindValueEl && mapValue.set(bindId.id, bindValueEl);
    let divEl = document.createElement("div");
    divEl.className = "track";
    let bindValueClamped = document.createElement("div");
    bindValueClamped.className = "track-head";
    let spanEl = document.createElement("span");
    spanEl.className = "badge audio", spanEl.textContent = "Audio " + (bindArgClamped + 1);
    let strongEl = document.createElement("strong");
    strongEl.textContent = bindId.label, strongEl.title = bindId.label;
    let bindSpanEl = document.createElement("span");
    bindSpanEl.className = "track-time", bindSpanEl.textContent = (bindId.startTime / 1000).toFixed(1) + "s - " + (bindId.endTime / 1000).toFixed(1) + 's', bindValueClamped.appendChild(spanEl), bindValueClamped.appendChild(strongEl), bindValueClamped.appendChild(bindSpanEl);
    let selectEl = document.createElement("select");
    selectEl.setAttribute("aria-label", "File audio untuk track " + (bindArgClamped + 1));
    for (let bindEl of valueRaw) {
      let optionEl = document.createElement("option");
      optionEl.value = bindEl.name, optionEl.textContent = bindEl.name, selectEl.appendChild(optionEl);
    }
    selectEl.value = mapValue.get(bindId.id) || valueRaw[0]?.["name"] || '', selectEl.addEventListener("change", () => {
      let bindValueList = selectEl.value;
      mapValue.set(bindId.id, bindValueList), renderHelperValue(), handleHelper({
        force: true
      }), appendLog("[AUDIO] Layer Audio " + (bindArgClamped + 1) + " (\"" + bindId.label + "\") menggunakan: " + bindValueList);
    });
    let labelEl = document.createElement("label");
    labelEl.className = "btn sm", labelEl.innerHTML = eyeOff.upload + "<span>Unggah audio baru</span>";
    let inputEl = document.createElement("input");
    inputEl.type = "file", inputEl.accept = "audio/*,video/*", inputEl.hidden = true, inputEl.addEventListener("change", bindArgMin => {
      let bindClamped = bindArgMin.target.files[0];
      bindArgMin.target.value = '', bindClamped && (mapValue.set(bindId.id, bindClamped.name), handleHelperOuter(bindClamped), appendLog("[AUDIO] Layer Audio " + (bindArgClamped + 1) + " (\"" + bindId.label + "\") diganti file: " + bindClamped.name));
    }), labelEl.appendChild(inputEl), divEl.appendChild(bindValueClamped), divEl.appendChild(selectEl), divEl.appendChild(labelEl), audioRows.appendChild(divEl);
  }), contains && bindHelperMax(bindHelperRawList);
}
function getEl() {
  return document.getElementById("timeline-body");
}
function processHelperMax(processHelperMaxArg) {
  let tlGroups = document.getElementById("tl-groups");
  if (!tlGroups) return;
  let processValueRaw = (processHelperMaxArg || []).filter(getHelper);
  if (tlGroups.hidden = processValueRaw.length === 0, !processValueRaw.length) return;
  let every = processValueRaw.every((everyValue, processArgMin) => localSet.has(localNext(everyValue, (processHelperMaxArg || []).indexOf(everyValue))));
  tlGroups.textContent = every ? "Tutup Semua Grup" : "Buka Semua Grup", tlGroups.title = every ? "Kembali " + processValueRaw.length + " grup ke tampilan ringkas" : "Tampilkan isi " + processValueRaw.length + " grup sekaligus", tlGroups.classList.toggle('on', every);
}
function helperLocal() {
  let layerInfo = document.getElementById("layer-info");
  layerInfo && (layerInfo.innerHTML = "<div class=\"empty\">Ketuk blok layer untuk melihat detail dan preview medianya.</div>");
}
function helperMap() {
  let sceneTreeList = document.getElementById("scene-tree-list"),
    sceneTreeBreadcrumb = document.getElementById("scene-tree-breadcrumb"),
    sceneTreeUp = document.getElementById("scene-tree-up");
  if (!sceneTreeList || !sceneTreeBreadcrumb || !sceneTreeUp) return;
  sceneTreeBreadcrumb.textContent = join(), sceneTreeBreadcrumb.title = sceneTreeBreadcrumb.textContent, sceneTreeUp.style.display = localList.length ? '' : "none", sceneTreeUp.onclick = onclick;
  let sceneTreePanel = document.getElementById("scene-tree-panel"),
    updateObj = objHelper(),
    helperMapValue = localList.length > 0 || updateObj.layers.some(getHelper);
  if (sceneTreePanel && (sceneTreePanel.style.display = helperMapValue ? '' : "none"), processHelperMax(updateObj.layers), sceneTreeList.innerHTML = '', !projectScene) {
    sceneTreeList.innerHTML = "<div class=\"st-empty\">Belum ada scene.</div>";
    return;
  }
  if (!updateObj.layers.length) {
    sceneTreeList.innerHTML = "<div class=\"st-empty\">Scene ini tidak punya layer.</div>";
    return;
  }
  let updateLayers = updateObj.layers;
  [...updateLayers].reverse().forEach((updateArgCurrent, updateArgNext) => bindHelperParsed(sceneTreeList, updateArgCurrent, updateObj.offsetMs, 0, updateLayers.length - 1 - updateArgNext));
}
function bindHelperParsed(appendChild, startTimeArg, bindArgByKey, bindArgOuter, bindArgInner) {
  let bindKey = localNext(startTimeArg, bindArgInner),
    bindTotal = bindArgByKey + (startTimeArg.startTime || 0);
  startTimeArg.ce = bindArgByKey;
  let bindGet = getHelper(startTimeArg),
    bindValueEnd = applyHelperClamped(startTimeArg),
    bindEnd = localSet.has(bindKey),
    divEl = document.createElement("div");
  divEl.className = "st-row" + (bindArgOuter > 0 ? " st-sub-row" : '') + (bindKey === textValue ? " st-sel" : ''), divEl.dataset.key = bindKey;
  for (let bindHelperParsedNumber = 0; bindHelperParsedNumber < bindArgOuter; bindHelperParsedNumber++) {
    let bindValueCurrent = document.createElement("div");
    bindValueCurrent.className = "st-indent-line", divEl.appendChild(bindValueCurrent);
  }
  let buttonEl = document.createElement("button");
  buttonEl.type = "button", buttonEl.className = "st-chevron" + (bindGet ? bindEnd ? " open" : '' : " leaf"), buttonEl.textContent = '▶', bindGet && (buttonEl.title = bindEnd ? "Tutup isi scene" : "Lihat isi scene", buttonEl.addEventListener("click", bindArgTertiary => {
    bindArgTertiary.stopPropagation(), applyInner(bindKey);
  })), divEl.appendChild(buttonEl);
  let bindValueMin = document.createElement("div");
  bindValueMin.className = "st-icon", bindValueMin.style.background = processHelperScoped(startTimeArg).bg, divEl.appendChild(bindValueMin);
  let spanEl = document.createElement("span");
  spanEl.className = "st-name", spanEl.textContent = startTimeArg.label || startTimeArg.id || "Layer " + (bindArgInner + 1), spanEl.title = spanEl.textContent, divEl.appendChild(spanEl);
  let spanElValue = document.createElement("span");
  if (spanElValue.className = "st-tag", spanElValue.textContent = bindGet ? "Scene " + startTimeArg.scene.layers.length : startTimeArg.tag || startTimeArg.fillType || '?', divEl.appendChild(spanElValue), bindGet) {
    let className = document.createElement("button");
    className.type = "button", className.className = "st-open-btn", className.textContent = "Buka", className.title = "Masuk ke scene ini", className.addEventListener("click", bindArgExtra => {
      bindArgExtra.stopPropagation(), computeHelperParsed(startTimeArg);
    }), divEl.appendChild(className);
  }
  let buttonElValue = document.createElement("button");
  if (buttonElValue.type = "button", buttonElValue.className = "st-eye" + (bindValueEnd ? '' : " on"), buttonElValue.title = bindValueEnd ? "Tampilkan layer" : "Sembunyikan layer", buttonElValue.innerHTML = bindValueEnd ? eyeOff.eyeOff : eyeOff.eye, buttonElValue.addEventListener("click", bindArgAlternate => {
    bindArgAlternate.stopPropagation(), renderHelperLocal(startTimeArg);
  }), divEl.appendChild(buttonElValue), divEl.addEventListener("click", () => {
    applyFlag(startTimeArg, bindArgInner), seekToTime(bindTotal);
  }), appendChild.appendChild(divEl), bindGet && bindEnd) {
    let bindCurrent = startTimeArg.scene.layers;
    [...bindCurrent].reverse().forEach((bindArgOther, bindArgAnother) => bindHelperParsed(appendChild, bindArgOther, bindTotal, bindArgOuter + 1, bindCurrent.length - 1 - bindArgAnother));
  }
}
function buildHelperLocal() {
  let videoAudioMute = document.getElementById("videoAudioMute"),
    buildValueCount = videoAudioMute ? videoAudioMute.checked : true,
    buildHelperLocalSet = new Set(videoAudioSlots.map(keyArg => computeHelperLocal(keyArg.key)).filter(Boolean));
  for (let [, buildTagName] of localValueScoped) !buildTagName || buildTagName.tagName !== "VIDEO" || (buildTagName.muted = !(buildHelperLocalSet.has(buildTagName) && buildValueCount));
}
function getHelperLocal({
  intro: getHelperLocalTextContent,
  lines: getArgValue,
  canPartial: getArgStart
}) {
  let audioProblemDlg = document.getElementById("audioProblemDlg");
  if (!audioProblemDlg || typeof audioProblemDlg.showModal != "function") {
    let getStart = true;
    try {
      getStart = typeof confirm == "function" ? confirm(getHelperLocalTextContent + '\x0a\x0a' + getArgValue.join('\x0a') + "\n\nLanjutkan ekspor TANPA audio?") : true;
    } catch {
      getStart = true;
    }
    return Promise.resolve(getStart ? "noaudio" : "cancel");
  }
  document.getElementById("audioProblemIntro").textContent = getHelperLocalTextContent, document.getElementById("audioProblemList").textContent = getArgValue.join('\x0a');
  let audioProblemPartial = document.getElementById("audioProblemPartial");
  return audioProblemPartial.hidden = !getArgStart, new Promise(getHelperLocalArg => {
    let getByIndex = false,
      getScoped = getArgEnd => {
        getByIndex || (getByIndex = true, audioProblemDlg.removeEventListener("close", getValueEl), audioProblemDlg.open && audioProblemDlg.close(), getHelperLocalArg(getArgEnd));
      },
      getValueEl = () => getScoped("cancel");
    audioProblemDlg.addEventListener("close", getValueEl), audioProblemPartial.onclick = () => getScoped("partial"), document.getElementById("audioProblemNoAudio").onclick = () => getScoped("noaudio"), document.getElementById("audioProblemCancel").onclick = () => getScoped("cancel"), audioProblemDlg.showModal();
  });
}
function bindHelper() {
  if (!photogalleryEl) return;
  photogalleryEl.innerHTML = '';
  let galleryCount = document.getElementById("galleryCount"),
    bindInitial = byFileName.list().filter(kindArg => kindArg.kind && !kindArg.isAudio && !localNodePending.some(bindArgConverted => bindArgConverted.name === kindArg.name)),
    bindHelperList = [...localNodePending.map(bindArgDerived => ({
      ref: bindArgDerived,
      local: true
    })), ...bindInitial.map(bindDerived => ({
      ref: bindDerived,
      local: false
    }))];
  if (galleryCount && (galleryCount.textContent = bindHelperList.length ? bindHelperList.length + " file" : ''), !bindHelperList.length) {
    photogalleryEl.innerHTML = "<div class=\"empty\" style=\"grid-column:1/-1\">Belum ada media. Ketuk tombol di atas untuk menambah foto atau video.</div>";
    return;
  }
  let bindHelperSet = new Set(map.values());
  for (let {
    ref: bindParsed,
    local: bindValueSource
  } of bindHelperList) {
    let divEl = document.createElement("div");
    divEl.className = "g-item";
    let bindValuePending = buildHelperClamped(bindParsed.name, bindParsed);
    divEl.appendChild(handleHelperRaw(bindParsed.name, "g-thumb"));
    let bindClassName = document.createElement("div");
    bindClassName.className = "g-badges", bindValuePending && (bindClassName.innerHTML += "<span class=\"badge video\">Video</span>"), bindValueSource || (bindClassName.innerHTML += "<span class=\"badge\">Link</span>"), bindHelperSet.has(bindParsed.name) && (bindClassName.innerHTML += "<span class=\"badge used\">Dipakai</span>"), bindClassName.children.length && divEl.appendChild(bindClassName);
    let bindTitle = document.createElement("div");
    if (bindTitle.className = "g-meta", bindTitle.textContent = bindParsed.name, bindTitle.title = bindParsed.name, divEl.appendChild(bindTitle), bindValueSource) {
      let bindByKey = document.createElement("div");
      bindByKey.className = "g-actions";
      let labelEl = document.createElement("label");
      labelEl.className = "btn sm", labelEl.innerHTML = eyeOff.upload + "<span>Perbarui file</span>";
      let inputEl = document.createElement("input");
      inputEl.type = "file", inputEl.accept = "image/*,video/*", inputEl.hidden = true, inputEl.addEventListener("change", async bindArgList => {
        let bindSource = bindArgList.target.files[0];
        bindArgList.target.value = '', bindSource && (await helperCount(bindParsed, bindSource).catch(bindArgComputed => appendLog("[IMPORT] Gagal ganti media: " + bindArgComputed.message)));
      }), labelEl.appendChild(inputEl), bindByKey.appendChild(labelEl), divEl.appendChild(bindByKey);
    }
    photogalleryEl.appendChild(divEl);
  }
}
function bindHelperOuter() {
  if (enginerowsEl) {
    enginerowsEl.innerHTML = '';
    for (let kindValue of valueSorted) {
      let labelEl = document.createElement("label");
      labelEl.className = kindValue.kind === "bool" ? "check" : "field";
      let appendChildValue;
      if (kindValue.kind === "select") {
        appendChildValue = document.createElement("select");
        for (let bindValueTarget of kindValue.options) {
          let optionEl = document.createElement("option");
          optionEl.value = bindValueTarget, optionEl.textContent = bindValueTarget, appendChildValue.appendChild(optionEl);
        }
      } else appendChildValue = document.createElement("input"), appendChildValue.type = kindValue.kind === "bool" ? "checkbox" : "number", kindValue.kind === "num" && (appendChildValue.inputMode = "numeric", appendChildValue.min = String(kindValue.min), appendChildValue.max = String(kindValue.max), appendChildValue.step = String(kindValue.step));
      appendChildValue.id = "eng-" + kindValue.key;
      let spanEl = document.createElement("span");
      spanEl.innerHTML = "<b>" + localNodeResolved(kindValue.label) + (kindValue.reload ? " <small>(perlu muat ulang)</small>" : '') + "</b>" + (kindValue.hint ? "<small>" + localNodeResolved(kindValue.hint) + "</small>" : ''), kindValue.kind === "bool" && labelEl.appendChild(appendChildValue), labelEl.appendChild(spanEl), kindValue.kind !== "bool" && labelEl.appendChild(appendChildValue), appendChildValue.addEventListener("change", () => buildHelperCount(kindValue, appendChildValue)), enginerowsEl.appendChild(labelEl);
    }
  }
}
function processHelperOuter() {
  for (let processKey of valueSorted) {
    let getElementById = document.getElementById("eng-" + processKey.key);
    if (!getElementById) continue;
    let processGet = getHelperEl(processKey);
    processKey.kind === "bool" ? getElementById.checked = !!processGet : getElementById.value = String(processGet);
  }
  helperOuter(), typeof buildHelperParsed == "function" && buildHelperParsed();
}
function bindHelperInner() {
  if (exprowsEl) {
    exprowsEl.innerHTML = '';
    for (let bindKind of localValueBuffer) {
      let labelEl = document.createElement("label");
      labelEl.className = bindKind.kind === "bool" ? "check" : "field";
      let bindAppendChild;
      if (bindKind.kind === "select") {
        bindAppendChild = document.createElement("select");
        for (let bindValueInput of bindKind.options) {
          let optionEl = document.createElement("option");
          optionEl.value = bindValueInput, optionEl.textContent = bindValueInput, bindAppendChild.appendChild(optionEl);
        }
      } else bindAppendChild = document.createElement("input"), bindAppendChild.type = bindKind.kind === "bool" ? "checkbox" : "number", bindKind.kind === "num" && (bindAppendChild.inputMode = "decimal", bindAppendChild.min = String(bindKind.min), bindAppendChild.max = String(bindKind.max), bindAppendChild.step = String(bindKind.step));
      bindAppendChild.id = "exp-" + bindKind.key;
      let spanEl = document.createElement("span");
      spanEl.innerHTML = "<b>" + localNodeResolved(bindKind.label) + " <small>[" + localNodeResolved(valueStage[bindKind.fidelity] || bindKind.fidelity) + "]</small></b>" + (bindKind.hint ? "<small>" + localNodeResolved(bindKind.hint) + "</small>" : ''), bindKind.kind === "bool" && labelEl.appendChild(bindAppendChild), labelEl.appendChild(spanEl), bindKind.kind !== "bool" && labelEl.appendChild(bindAppendChild), bindAppendChild.addEventListener("change", () => {
        if (bindKind.kind === "bool") localRef[bindKind.key] = bindAppendChild.checked;else {
          if (bindKind.kind === "num") {
            let bindHelperInnerNumber = Number(bindAppendChild.value);
            Number.isFinite(bindHelperInnerNumber) || (bindHelperInnerNumber = freeze[bindKind.key]), bindHelperInnerNumber = Math.max(bindKind.min, Math.min(bindKind.max, bindHelperInnerNumber)), bindAppendChild.value = String(bindHelperInnerNumber), localRef[bindKind.key] = bindHelperInnerNumber;
          } else localRef[bindKind.key] = bindAppendChild.value;
        }
        computeHelperScoped();
      }), exprowsEl.appendChild(labelEl);
    }
  }
}
function bindHelperStart() {
  if (!expcatsEl) return;
  let bindResolved = refHelperList();
  expcatsEl.innerHTML = '';
  for (let bindValueParsed of localValueMode) {
    let labelEl = document.createElement("label");
    labelEl.className = "check";
    let inputEl = document.createElement("input");
    inputEl.type = "checkbox", inputEl.id = "exp-cat-" + bindValueParsed, inputEl.checked = localRef.categorySet.includes(bindValueParsed), inputEl.addEventListener("change", () => {
      let bindHelperStartSet = new Set(localRef.categorySet);
      inputEl.checked ? bindHelperStartSet.add(bindValueParsed) : bindHelperStartSet.delete(bindValueParsed), localRef.categorySet = [...bindHelperStartSet], computeHelperScoped();
    });
    let spanEl = document.createElement("span"),
      bindValueConverted = bindValueParsed === "matte" || bindValueParsed === "opacity" ? " <small>(ubah komposisi)</small>" : '';
    spanEl.innerHTML = "<b>" + localNodeResolved(bindValueParsed) + '\x20(' + (bindResolved[bindValueParsed] || 0) + ")</b>" + bindValueConverted, labelEl.appendChild(inputEl), labelEl.appendChild(spanEl), expcatsEl.appendChild(labelEl);
  }
}
function buildHelperParsed() {
  expEnabledEl && (expEnabledEl.checked = !!localRef.enabled);
  for (let buildKey of localValueBuffer) {
    let buildHelperParsedGetElementById = document.getElementById("exp-" + buildKey.key);
    buildHelperParsedGetElementById && (buildKey.kind === "bool" ? buildHelperParsedGetElementById.checked = !!localRef[buildKey.key] : buildHelperParsedGetElementById.value = String(localRef[buildKey.key]));
  }
  bindHelperStart(), renderHelperMin();
}
function some(someText) {
  return document.cookie.split(';\x20').some(someArg => someArg.startsWith(someText + '='));
}
function processByKey(processByKeyArg, processArgEnd, processByKeyArgValue) {
  document.cookie = encodeURIComponent(processByKeyArg) + '=' + encodeURIComponent(processArgEnd) + "; Max-Age=" + processByKeyArgValue + "; Path=/; SameSite=Lax";
}
function bindHelperEnd() {
  let modeToggleBtn = document.getElementById("modeToggleBtn"),
    simpleHint = document.getElementById("simpleHint"),
    simpleHintClose = document.getElementById("simpleHintClose");
  if (!modeToggleBtn || !simpleHint || document.documentElement.classList.contains("simple")) return;
  let bindHelperEndText = "am_simple_hint_seen",
    bindHelperEndValue = () => {
      simpleHint.hidden = true, processByKey(bindHelperEndText, '1', 3600 * 24 * 365);
    };
  some(bindHelperEndText) || (simpleHint.hidden = false), simpleHintClose?.["addEventListener"]("click", bindComputed => {
    bindComputed.stopPropagation(), bindHelperEndValue();
  }), modeToggleBtn.addEventListener("click", () => {
    bindHelperEndValue(), buildHelperMin(true);
  });
}
function omPickInput(ompickinputText, accept, ompickinputCallback) {
  let ompickinputElement = document.querySelector("input.om-" + ompickinputText);
  if (!ompickinputElement) {
    ompickinputElement = document.createElement("input");
    ompickinputElement.type = "file", ompickinputElement.accept = accept, ompickinputElement.className = "om-" + ompickinputText, ompickinputElement.style.display = "none";
    document.body.appendChild(ompickinputElement);
    ompickinputElement.addEventListener("change", () => {
      const ompickinputValue = ompickinputElement.files && ompickinputElement.files[0];
      ompickinputElement.value = "";
      if (ompickinputValue) ompickinputCallback(ompickinputValue);
    });
  }
  ompickinputElement.click();
}
function showOmLanding() {
  const home = document.getElementById("am-home-screen");
  const root = document.getElementById("am-mobile-root");
  if (home) {
    if (root) root.style.display = "none";
    home.classList.remove("hidden");
    if (history.replaceState && location.pathname !== "/") {
      history.replaceState({}, "", "/");
    }
    return;
  }
}
async function omFillRecent(wrap) {
  try {
    const omFillRecentOk = await fetch("/api/projects");
    if (!omFillRecentOk.ok) return;
    const projects = await omFillRecentOk.json(), omFillRecentValue = projects.projects || [];
    if (!omFillRecentValue.length) return;
    const omfillrecentDivEl = document.createElement("div");
    omfillrecentDivEl.className = "om-recent";
    omfillrecentDivEl.innerHTML = "<h4>Proyek terakhir (" + omFillRecentValue.length + ")</h4>";
    omFillRecentValue.slice(0, 8).forEach(hasPassword => {
      const omfillrecentButtonEl = document.createElement("button");
      omfillrecentButtonEl.type = "button", omfillrecentButtonEl.className = "btn sm", omfillrecentButtonEl.textContent = (hasPassword.hasPassword ? "🔒 " : "") + (hasPassword.name || hasPassword.id);
      omfillrecentButtonEl.addEventListener("click", () => {
        location.href = "/proyek/" + hasPassword.id;
      });
      omfillrecentDivEl.appendChild(omfillrecentButtonEl);
    });
    const card = wrap.querySelector(".om-card");
    card && card.appendChild(omfillrecentDivEl);
  } catch (omFillRecentResult) {}
}
async function omSaveProject() {
  if (!projectScene) return;
  omEnsureId();
  try {
    const omSaveProjectOmSerializeScene = omSerializeScene();
    const headers = {
      "content-type": "application/json"
    };
    if (omPass()) headers["x-om-pass"] = omPass();
    const view = document.getElementById("view");
    let thumb = null;
    if (view && typeof view.toDataURL === "function") {
      try {
        thumb = view.toDataURL("image/webp", 0.5);
      } catch (omSaveProjectValue) {}
    }
    const omSaveProjectOk = await fetch("/api/project/" + omProjectId, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: projectScene.title || "Proyek Baru",
        xml: omSaveProjectOmSerializeScene,
        width: projectScene.width || 720,
        height: projectScene.height || 1280,
        fps: projectScene.fps || 30,
        thumb,
        uploads: omUploads
      })
    });
    if (omSaveProjectOk.ok) appendLog("[SIMPAN] proyek tersimpan (" + new Date().toLocaleTimeString() + ")");
    else appendLog("[SIMPAN] gagal HTTP " + omSaveProjectOk.status);
  } catch (omSaveProjectMessage) {
    appendLog("[SIMPAN] " + omSaveProjectMessage.message);
  }
}
function showOmPassword(meta, onOk) {
  if (document.getElementById("om-pass-back")) return;
  const back = document.createElement("div");
  back.id = "om-pass-back";
  back.style.cssText = "position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:16px";
  back.innerHTML = `<div class="om-dialog" style="max-width:360px"><h2>Proyek terkunci</h2><div class="om-field"><label>Password untuk "${eAHelper(meta && meta.name || omProjectId)}"</label><div class="om-row"><input type="password" id="om-pass-input" placeholder="Password" /></div></div><button class="om-btn primary" type="button" id="om-pass-ok">Buka</button></div>`;
  document.body.appendChild(back);
  const input = back.querySelector("#om-pass-input");
  const submit = async () => {
    const showOmPasswordValue = input.value;
    if (!showOmPasswordValue) return;
    try {
      const showOmPasswordOk = await fetch("/api/project/" + omProjectId + "/unlock", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          password: showOmPasswordValue
        })
      });
      if (showOmPasswordOk.ok) {
        sessionStorage.setItem("om_pass_" + omProjectId, showOmPasswordValue);
        onOk();
      } else {
        input.value = "", input.placeholder = "Password salah";
      }
    } catch (showOmPasswordMessage) {
      appendLog("[AKUN] " + showOmPasswordMessage.message);
    }
  };
  back.querySelector("#om-pass-ok").addEventListener("click", submit);
  input.addEventListener("keydown", showOmPasswordKey => {
    if (showOmPasswordKey.key === "Enter") submit();
  });
  setTimeout(() => input.focus(), 60);
}
function omFillProjectSettings() {
  if (!projectScene) return;
  const omfillprojecCallback = id => document.getElementById(id);
  if (!omfillprojecCallback("om-pname")) return;
  omfillprojecCallback("om-pname").value = projectScene.title || "";
  omfillprojecCallback("om-pw").value = Math.round(projectScene.width || 0);
  omfillprojecCallback("om-ph").value = Math.round(projectScene.height || 0);
  omfillprojecCallback("om-pfps").value = String(Math.round(projectScene.fps || 30));
  omfillprojecCallback("om-pdur").value = ((projectScene.totalTime || 0) / 1000).toFixed(1);
  const omFillProjectSettingsValue = omHexFrom(projectScene.bgcolor).toLowerCase();
  omfillprojecCallback("om-pbg").querySelectorAll(".om-sw").forEach(omFillProjectSettingsClassList => omFillProjectSettingsClassList.classList.toggle("on", String(omFillProjectSettingsClassList.dataset.hex).toLowerCase() === omFillProjectSettingsValue));
  const hexIn = omfillprojecCallback("om-pbghex");
  hexIn && (hexIn.value = omFillProjectSettingsValue);
  const omFillProjectSettingsOmfillprojecCallback = omfillprojecCallback("om-projid");
  omFillProjectSettingsOmfillprojecCallback && (omFillProjectSettingsOmfillprojecCallback.textContent = omProjectId || "proyek lokal");
}
function omInitProjectSettingsCard() {
  const body = document.querySelector("#settingsDlg .dlg-body");
  if (!body || document.getElementById("om-projcard")) return;
  const fpsOpts = [12, 15, 18, 20, 24, 25, 30, 48, 60, 90, 120].map(fpsoptsText => '<option value="' + fpsoptsText + '">' + fpsoptsText + ' fps</option>').join("");
  const omInitProjectSettingsCardValue = OM_BGS.map(([bgsText, hexA, omInitProjectSettingsCardArg]) => '<button type="button" class="om-sw" data-hex="' + hexA + '" style="background:' + omInitProjectSettingsCardArg + '" title="' + bgsText + '"></button>').join("");
  const card = document.createElement("div");
  card.className = "card", card.id = "om-projcard";
  card.innerHTML = '<div class="card-head"><h2>Proyek</h2><span class="hint" id="om-projid"></span></div>' + '<label class="field">Nama proyek <input type="text" id="om-pname" /></label>' + '<div class="row"><label class="field">Lebar <input type="number" id="om-pw" min="16" max="7680" step="2" /></label><label class="field">Tinggi <input type="number" id="om-ph" min="16" max="7680" step="2" /></label></div>' + '<label class="field">Frame rate <select id="om-pfps">' + fpsOpts + '</select></label>' + '<label class="field">Durasi (detik) <input type="number" id="om-pdur" min="1" max="3600" step="0.1" /></label>' + '<div class="field">Latar belakang<div class="row" id="om-pbg">' + omInitProjectSettingsCardValue + '</div></div>' + '<label class="field">Warna latar (AARRGGBB) <input type="text" id="om-pbghex" /></label>' + '<button class="btn primary" type="button" id="om-papply">Terapkan setelan proyek</button>';
  body.insertBefore(card, body.firstChild);
  card.querySelectorAll(".om-sw").forEach(omInitProjectSettingsCardAddEventListener => omInitProjectSettingsCardAddEventListener.addEventListener("click", () => {
    card.querySelectorAll(".om-sw").forEach(omInitProjectSettingsCardClassList => omInitProjectSettingsCardClassList.classList.remove("on"));
    omInitProjectSettingsCardAddEventListener.classList.add("on");
    const hexIn = card.querySelector("#om-pbghex");
    hexIn && (hexIn.value = omInitProjectSettingsCardAddEventListener.dataset.hex);
  }));
  card.querySelector("#om-papply").addEventListener("click", () => omApplyProjectSettings());
  ["openSettings", "sSettingsBtn"].forEach(id => {
    const ominitprojecElement = document.getElementById(id);
    ominitprojecElement && ominitprojecElement.addEventListener("click", () => setTimeout(omFillProjectSettings, 60));
  });
}
function omFocusSec(omfocussecValue) {
  omPropsRefresh();
  const el = document.getElementById(omfocussecValue);
  if (el) {
    el.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
    const omfocussecOmPropsEl = document.getElementById("om-props");
    omfocussecOmPropsEl && (omfocussecOmPropsEl.scrollTop = Math.max(0, el.offsetTop - 60));
  }
}
function omInitElemBar() {
  if (document.getElementById("om-elembar")) return;
  const ominitelembaStyleEl = document.createElement("style");
  ominitelembaStyleEl.textContent = "#om-elembar{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;z-index:9997;display:none;gap:6px;padding:6px 8px;background:var(--panel);border:1px solid var(--line2);border-radius:14px;box-shadow:0 8px 26px rgba(0,0,0,.45);max-width:min(96vw,900px);overflow-x:auto}#om-elembar.on{display:flex}#om-elembar button{font-size:.72rem;padding:7px 9px;white-space:nowrap}#om-elembar button:disabled{opacity:.42;cursor:not-allowed}";
  document.head.appendChild(ominitelembaStyleEl);
  const ominitelembaDivEl = document.createElement("div");
  ominitelembaDivEl.id = "om-elembar";
  const ominitelembaCallback = (label, omInitElemBarArg, mkCondition, title) => {
    const mkButtonEl = document.createElement("button");
    mkButtonEl.type = "button", mkButtonEl.className = "btn sm", mkButtonEl.textContent = label, mkButtonEl.dataset.role = label;
    if (mkCondition) mkButtonEl.disabled = true;
    if (title) mkButtonEl.title = title;
    mkButtonEl.addEventListener("click", () => {
      try {
        omInitElemBarArg();
      } catch (omInitElemBarMessage) {
        appendLog("[EDIT] " + omInitElemBarMessage.message);
      }
    });
    ominitelembaDivEl.appendChild(mkButtonEl);
    return mkButtonEl;
  };
  ominitelembaCallback("Speed", () => {}, true, "Speed control menyusul");
  ominitelembaCallback("Trim kiri", () => omTrimSide("l"), true);
  ominitelembaCallback("Split", () => {
    const omInitElemBarOmLayerCur = omLayerCur();
    omInitElemBarOmLayerCur && splitLayerAt(omInitElemBarOmLayerCur);
  }, true);
  ominitelembaCallback("Trim kanan", () => omTrimSide("r"), true);
  ominitelembaCallback("Mute", () => omMuteToggle(), true, "Layer ini gak punya audio");
  ominitelembaCallback("Teks", () => omOpenTextDlg(), true);
  ominitelembaCallback("Color & Fill", () => omFocusSec("om-sec-fill"), true);
  ominitelembaCallback("Border & Shadow", () => omFocusSec("om-sec-bord"), true);
  ominitelembaCallback("Blending & Opacity", () => omFocusSec("om-sec-blend"), true);
  ominitelembaCallback("Move & Transform", () => {
    if (typeof window.omOpenMoveTransform === "function") window.omOpenMoveTransform();
    else omFocusSec("om-sec-xf");
  }, true);
  ominitelembaCallback("Edit Points", () => {}, true, "Editor titik vektor menyusul");
  ominitelembaCallback("Efek", () => {}, true, "Browser efek menyusul");
  ominitelembaCallback("Preset", () => {}, true, "Preset layer menyusul");
  document.body.appendChild(ominitelembaDivEl);
  omBarUpdate(omLayerCur());
}
function omFxOpenBrowse() {
  const omFxListEl = document.getElementById("om-fx-list");
  if (!omFxListEl) return;
  omFxListEl.innerHTML = '<div class="hint">Menyiapkan katalog efek…</div>';
  omFxIndex().then(omFxOpenBrowseList => {
    const catsEl = document.getElementById("om-fx-cats");
    const cats = [...new Set(omFxOpenBrowseList.list.map(omFxOpenBrowseCat => omFxOpenBrowseCat.cat))].sort();
    const omfxopenbrowButtonEl = document.createElement("button");
    omfxopenbrowButtonEl.type = "button", omfxopenbrowButtonEl.className = "om-chip on", omfxopenbrowButtonEl.textContent = "Semua (" + omFxOpenBrowseList.list.length + ")";
    omfxopenbrowButtonEl.addEventListener("click", () => {
      catsEl.querySelectorAll("button").forEach(omFxOpenBrowseClassList => omFxOpenBrowseClassList.classList.toggle("on", omFxOpenBrowseClassList === omfxopenbrowButtonEl));
      omFxRenderBrowse("");
    });
    catsEl.appendChild(omfxopenbrowButtonEl);
    cats.forEach(omfxopenbrowText => {
      const omfxopenbrowLength = omFxOpenBrowseList.list.filter(catArg => catArg.cat === omfxopenbrowText).length;
      const omFxOpenBrowseButtonEl = document.createElement("button");
      omFxOpenBrowseButtonEl.type = "button", omFxOpenBrowseButtonEl.className = "om-chip", omFxOpenBrowseButtonEl.dataset.cat = omfxopenbrowText, omFxOpenBrowseButtonEl.textContent = omfxopenbrowText + " (" + omfxopenbrowLength + ")";
      omFxOpenBrowseButtonEl.addEventListener("click", () => {
        catsEl.querySelectorAll("button").forEach(omFxOpenBrowseArg => omFxOpenBrowseArg.classList.toggle("on", omFxOpenBrowseArg === omFxOpenBrowseButtonEl));
        omFxRenderBrowse(document.getElementById("om-fx-q").value);
      });
      catsEl.appendChild(omFxOpenBrowseButtonEl);
    });
    omFxRenderBrowse("");
  }).catch(omFxOpenBrowseMessage => {
    omFxListEl.innerHTML = '<div class="hint">Katalog gagal dimuat: ' + omFxOpenBrowseMessage.message + '</div>';
  });
}
function omFxRenderBrowse(qstr) {
  const omFxRenderBrowseOmFxListEl = document.getElementById("om-fx-list");
  if (!omFxRenderBrowseOmFxListEl || !omFxIndexCache) return;
  const activeCat = document.querySelector("#om-fx-cats .om-chip.on");
  const omfxrenderbrValue = activeCat && activeCat.dataset.cat;
  const omFxRenderBrowseValue = (qstr || "").toLowerCase().trim();
  const omFxRenderBrowseResult = omFxIndexCache.list.filter(omFxRenderBrowseCat => (!omfxrenderbrValue || omFxRenderBrowseCat.cat === omfxrenderbrValue) && (!omFxRenderBrowseValue || omFxRenderBrowseCat.name.toLowerCase().includes(omFxRenderBrowseValue) || omFxRenderBrowseCat.id.toLowerCase().includes(omFxRenderBrowseValue)));
  omFxRenderBrowseOmFxListEl.innerHTML = omFxRenderBrowseResult.length ? omFxRenderBrowseResult.map(omFxRenderBrowseId => '<button type="button" class="btn sm" data-fx="' + omFxRenderBrowseId.id + '" style="width:100%;text-align:left;margin-bottom:5px">' + omFxRenderBrowseId.name + ' <span style="opacity:.6;font-size:.68rem">' + omFxRenderBrowseId.cat + '</span></button>').join("") : '<div class="hint">Efek tidak ditemukan</div>';
}
function omFxRenderSet() {
  const omfxrenderseOmFxSetEl = document.getElementById("om-fx-set");
  const omFxRenderSetEffects = omFxDialogLayer;
  if (!omfxrenderseOmFxSetEl || !omFxRenderSetEffects) return;
  omfxrenderseOmFxSetEl.innerHTML = "";
  (omFxRenderSetEffects.effects || []).forEach((omFxRenderSetId, omfxrenderseText) => {
    const entry = omFxIndexCache && omFxIndexCache.byId.get(omFxRenderSetId.id);
    const omfxrenderseDivEl = document.createElement("div");
    omfxrenderseDivEl.style.cssText = "border:1px solid var(--line2);border-radius:10px;padding:8px;margin-bottom:8px";
    omfxrenderseDivEl.innerHTML = '<div class="om-props-row" style="justify-content:space-between"><span style="font-weight:600;font-size:.82rem">' + (entry ? entry.name : omFxRenderSetId.shortId || omFxRenderSetId.id) + '</span><span class="om-props-row"><label class="check"><input type="checkbox" data-fxtg="' + omfxrenderseText + '"' + ((omFxRenderSetId.hidden === true || omFxRenderSetId.hidden === "true") ? "" : " checked") + '><span>on</span></label><button type="button" class="btn sm" data-fxrm="' + omfxrenderseText + '">✕ hapus</button></span></div>';
    (omFxRenderSetId.params || []).forEach((omFxRenderSetDataType, omFxRenderSetArg) => {
      if (omFxRenderSetDataType.dataType === "texture") return;
      const omFxRenderSetDivEl = document.createElement("div");
      omFxRenderSetDivEl.className = "om-props-row";
      omFxRenderSetDivEl.style.cssText = "margin-top:6px;gap:6px";
      const hasKfs = omFxRenderSetDataType.channel && omFxRenderSetDataType.channel.kfs && omFxRenderSetDataType.channel.kfs.length >= 2;
      omFxRenderSetDivEl.innerHTML = '<span style="font-size:.72rem;min-width:80px;color:var(--muted)">' + omFxRenderSetDataType.id + '</span>' + omFxWidget(omFxRenderSetDataType.dataType, omFxRenderSetDataType, entry, omfxrenderseText, omFxRenderSetArg) + '<button type="button" class="btn sm icon" style="height:26px;padding:0 6px" data-fxkf="' + omfxrenderseText + ':' + omFxRenderSetArg + '" title="Tambah keyframe" ' + (omFxRenderSetDataType.channel.kfs && omFxRenderSetDataType.channel.kfs.length ? 'style="height:26px;border-color:var(--accent)"' : "") + '>◇</button>' + (hasKfs ? '<button type="button" class="btn sm icon" style="height:26px;padding:0 6px;margin-left:2px" data-fxcurve="' + omfxrenderseText + ':' + omFxRenderSetArg + '" title="Kurva Easing Animasi"><img src="./icons/ac_ic_anim_curve.svg" style="width:14px;height:14px;filter:brightness(0) invert(1);"></button>' : '');
      omFxRenderSetDivEl.querySelector("[data-v]") || omFxRenderSetDivEl.addEventListener("input", omFxRenderSetTarget => {
        const omfxrenderseElement = omFxRenderSetDivEl.querySelector('[data-v="' + omfxrenderseText + ":" + omFxRenderSetArg + '"]');
        if (omfxrenderseElement) omfxrenderseElement.textContent = Number(omFxRenderSetTarget.target.value).toFixed(2);
      });
      omfxrenderseDivEl.appendChild(omFxRenderSetDivEl);
    });
    omfxrenderseOmFxSetEl.appendChild(omfxrenderseDivEl);
  });
  if (!omFxRenderSetEffects.effects || !omFxRenderSetEffects.effects.length) omfxrenderseOmFxSetEl.innerHTML = '<div class="hint">Belum ada efek. Buka tab Tambah Efek.</div>';
}
function omOpenCurve(opts) {
  if (typeof window.omOpenCurveEditor === "function") {
    window.omOpenCurveEditor(opts);
    return;
  }
  const omOpenCurveTransform = omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null;
  if (!omOpenCurveTransform || !omOpenCurveTransform.transform || document.getElementById("om-curve-back")) return;
  const props = [["loc", "Posisi"], ["rot", "Rotasi"], ["sc", "Skala"], ["op", "Opacity"]];
  const omOpenCurveRaw = props.filter(([avValue]) => {
    const omOpenCurveOmKeyableOf = omKeyableOf(omOpenCurveTransform.transform, avValue);
    return omOpenCurveOmKeyableOf && omOpenCurveOmKeyableOf.kfs && omOpenCurveOmKeyableOf.kfs.length >= 2;
  });
  if (!omOpenCurveRaw.length) return appendLog("[EDIT] tambah keyframe dulu (tombol ◇ di panel transform)");
  const curProp = omActProp && omOpenCurveRaw.some(omOpenCurveArgValue => omOpenCurveArgValue[0] === omActProp) ? omActProp : omOpenCurveRaw[0][0];
  const back = document.createElement("div");
  back.id = "om-curve-back";
  back.style.cssText = "position:fixed;inset:0;z-index:100005;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";
  back.innerHTML = '<div class="om-dialog" style="max-width:460px"><h2>Curve Editor</h2>' + '<label class="field">Properti<select id="om-curve-prop">' + omOpenCurveRaw.map(([omopencurveText, omOpenCurveArgRaw]) => '<option value="' + omopencurveText + '">' + omOpenCurveArgRaw + "</option>").join("") + '</select></label>' + '<canvas id="om-curve-canvas" width="420" height="150" style="width:100%;background:#0c0e14;border:1px solid var(--line2);border-radius:8px"></canvas>' + '<div class="om-props-sec">Easing preset</div><div class="om-chips" id="om-curve-presets" style="margin-bottom:8px"><button type="button" class="om-chip" data-e="linear">Linear</button><button type="button" class="om-chip" data-e="cubicBezier 0.42 0.0 1.0 1.0">Ease In</button><button type="button" class="om-chip" data-e="cubicBezier 0.0 0.0 0.58 1.0">Ease Out</button><button type="button" class="om-chip" data-e="cubicBezier 0.42 0.0 0.58 1.0">Ease In-Out</button></div>' + '<button class="btn sm" type="button" id="om-curve-delkf" style="margin-right:6px">✕ Hapus KF di playhead</button><button class="btn sm primary" type="button" id="om-curve-close">Tutup</button></div>';
  document.body.appendChild(back);
  const omopencurveOmCurvePropEl = back.querySelector("#om-curve-prop");
  omopencurveOmCurvePropEl.value = curProp;
  const omopencurveOmCurveCanvaEl = back.querySelector("#om-curve-canvas"), omopencurveCtx = omopencurveOmCurveCanvaEl.getContext("2d");
  const omopencurveCallback = () => projectScene && projectScene.totalTime || 10000;
  const draw = () => {
    const omOpenCurveReadGlobalT = readGlobalT(), omOpenCurveKfs = omOpenCurveReadGlobalT && omKeyableOf(omOpenCurveReadGlobalT, omopencurveOmCurvePropEl.value);
    omopencurveCtx.clearRect(0, 0, omopencurveOmCurveCanvaEl.width, omopencurveOmCurveCanvaEl.height);
    if (!omOpenCurveKfs || !omOpenCurveKfs.kfs || omOpenCurveKfs.kfs.length < 2) return;
    const omOpenCurveValue = [...omOpenCurveKfs.kfs].sort((omOpenCurveArgParsed, omOpenCurveArgClamped) => omOpenCurveArgParsed.t - omOpenCurveArgClamped.t);
    const omOpenCurveT = omOpenCurveValue[0].t, omOpenCurveParsed = omOpenCurveValue[omOpenCurveValue.length - 1].t, span = Math.max(0.001, omOpenCurveParsed - omOpenCurveT);
    let omOpenCurveResult = Infinity, omOpenCurveValueRaw = -Infinity;
    omOpenCurveValue.forEach(vArg => vArg.v.forEach(omOpenCurveArg => { omOpenCurveResult = Math.min(omOpenCurveResult, omOpenCurveArg), omOpenCurveValueRaw = Math.max(omOpenCurveValueRaw, omOpenCurveArg); }));
    if (omOpenCurveValueRaw === omOpenCurveResult) omOpenCurveValueRaw = omOpenCurveResult + 1;
    const drawCallback = xValue => (xValue - omOpenCurveT) / span * omopencurveOmCurveCanvaEl.width;
    const omOpenCurveValueParsed = yValue => omopencurveOmCurveCanvaEl.height - (yValue - omOpenCurveResult) / (omOpenCurveValueRaw - omOpenCurveResult) * (omopencurveOmCurveCanvaEl.height - 12) - 6;
    // grid
    omopencurveCtx.strokeStyle = "rgba(255,255,255,.06)", omopencurveCtx.beginPath();
    for (let omOpenCurveNumber = 0; omOpenCurveNumber <= 4; omOpenCurveNumber++) { const omOpenCurveCoord = omOpenCurveNumber / 4 * omopencurveOmCurveCanvaEl.width; omopencurveCtx.moveTo(omOpenCurveCoord, 0), omopencurveCtx.lineTo(omOpenCurveCoord, omopencurveOmCurveCanvaEl.height); }
    omopencurveCtx.stroke();
    omopencurveCtx.strokeStyle = "#1fc8ee", omopencurveCtx.beginPath();
    omOpenCurveValue.forEach((tArg, omOpenCurveFlag) => omOpenCurveFlag ? omopencurveCtx.lineTo(drawCallback(tArg.t), omOpenCurveValueParsed(tArg.v[0])) : omopencurveCtx.moveTo(drawCallback(tArg.t), omOpenCurveValueParsed(tArg.v[0])));
    omopencurveCtx.stroke();
    // playhead
    const drawValue = (playheadMs / 1000 - omOpenCurveT) / span * omopencurveOmCurveCanvaEl.width;
    omopencurveCtx.strokeStyle = "rgba(255,150,80,.9)", omopencurveCtx.beginPath(), omopencurveCtx.moveTo(drawValue, 0), omopencurveCtx.lineTo(drawValue, omopencurveOmCurveCanvaEl.height), omopencurveCtx.stroke();
    // kf points
    omOpenCurveValue.forEach(omOpenCurveV => {
      omopencurveCtx.beginPath(), omopencurveCtx.arc(drawCallback(omOpenCurveV.t), omOpenCurveValueParsed(omOpenCurveV.v[0]), 4, 0, 7), omopencurveCtx.fillStyle = "#fff", omopencurveCtx.fill();
    });
  };
  omopencurveOmCurvePropEl.addEventListener("change", draw);
  back.querySelector("#om-curve-presets").addEventListener("click", omOpenCurveTarget => {
    const omOpenCurveClosest = omOpenCurveTarget.target.closest("button[data-e]");
    if (!omOpenCurveClosest) return;
    omKfSetEasing(omopencurveOmCurvePropEl.value, omOpenCurveClosest.dataset.e), draw();
  });
  back.querySelector("#om-curve-delkf").addEventListener("click", () => {
    omKfRemoveAt(omopencurveOmCurvePropEl.value), draw();
  });
  back.querySelector("#om-curve-close").addEventListener("click", () => back.remove());
  back.addEventListener("pointerdown", omOpenCurveClamped => {
    if (omOpenCurveClamped.target === back) back.remove();
  });
  draw();
}
function getElHelper(getElHelperArg) {
  return document.getElementById(getElHelperArg);
}
function iHelper(iAccept, iArg, iCallback) {
  let inputEl = document.createElement("input");
  inputEl.type = "file", inputEl.accept = iAccept, inputEl.multiple = !!iArg, inputEl.onchange = () => {
    let iItems = [...inputEl.files];
    iItems.length && iCallback(iItems);
  }, inputEl.click();
}
function applyElement(applyElementArg) {
  document.querySelectorAll("#sTabs .s-tab").forEach(applyDataset => applyDataset.classList.toggle("active", applyDataset.dataset.s === applyElementArg));
  for (let applyValueOuter of ["media", "audio", "text"]) getElHelper("sp-" + applyValueOuter).hidden = applyValueOuter !== applyElementArg;
}
function bindHelperMax(bindArgStart) {
  let getElValue = getElHelper("sAudioList");
  if (getElValue) {
    if (getElValue.innerHTML = '', !bindArgStart.length) {
      getElValue.innerHTML = "<div class=\"s-empty\" style=\"padding-left:14px\">Preset ini tidak punya audio.</div>";
      return;
    }
    bindArgStart.forEach((bindLabel, bindHelperMaxArg) => {
      let divEl = document.createElement("div");
      divEl.className = "s-row";
      let bindHelperMaxValue = mapValue.get(bindLabel.id) || '';
      divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-music\"/></svg>\n            <div class=\"s-row-body\">\n                <div class=\"s-row-title\"></div>\n                <div class=\"s-row-sub\"></div>\n            </div>", divEl.querySelector(".s-row-title").textContent = bindArgStart.length > 1 ? "Audio " + (bindHelperMaxArg + 1) : "Audio", divEl.querySelector(".s-row-sub").textContent = bindHelperMaxValue || bindLabel.label || '-';
      let buttonEl = document.createElement("button");
      buttonEl.type = "button", buttonEl.className = "btn sm", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>Ganti", buttonEl.addEventListener("click", () => {
        iHelper("audio/*,video/*", false, ([bindArgEnd]) => {
          let bindInput = projectScene ? refHelperValue(projectScene, 0, [])[0] : null,
            bindValueLocal = bindInput ? bindInput.layer.id || "audio-0" : "main-audio",
            bindValueOutput = mapValue.get(bindValueLocal);
          mapValue.set(bindLabel.id, bindArgEnd.name), handleHelperOuter(bindArgEnd), bindLabel.id !== bindValueLocal && (bindValueOutput ? mapValue.set(bindValueLocal, bindValueOutput) : mapValue.delete(bindValueLocal), renderHelperValue(), handleHelper({
            force: true
          }), bindHelperRaw()), appendLog("[SIMPLE] Audio " + (bindHelperMaxArg + 1) + " diganti: " + bindArgEnd.name);
        });
      }), divEl.appendChild(buttonEl), getElValue.appendChild(divEl);
    });
  }
}
function bindHelperClamped() {
  let bindInnerHtml = getElHelper("sFontBox");
  if (!bindInnerHtml) return;
  bindInnerHtml.innerHTML = '';
  let bindRef = refHelperMap(),
    bindHelperClampedValue = (bindCached, bindArgBorder) => !!(renderer && renderer.customFonts && (renderer.customFonts.has(bindCached) || renderer.customFonts.has(bindArgBorder))),
    bindOutput = bindBorder => iHelper(".ttf,.otf,.woff,.woff2", false, async ([bindArgMap]) => {
      try {
        await window.AM.loadFont(bindBorder || bindArgMap.name, bindArgMap);
      } catch (bindValueComputed) {
        alert("Gagal memuat font: " + bindValueComputed.message);
      }
      bindHelperClamped();
    });
  if (!bindRef.size) {
    let divEl = document.createElement("div");
    divEl.className = "s-row", divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-type\"/></svg><div class=\"s-row-body\"><div class=\"s-row-title\">Font kustom</div><div class=\"s-row-sub\">Preset ini tidak meminta font impor</div></div>";
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn sm", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>Import font", buttonEl.addEventListener("click", () => bindOutput(null)), divEl.appendChild(buttonEl), bindInnerHtml.appendChild(divEl);
    return;
  }
  for (let [bindByIndex, bindConverted] of bindRef) {
    let bindHelperClampedBindCallback = bindHelperClampedValue(bindByIndex, bindConverted),
      divEl = document.createElement("div");
    divEl.className = "s-row", divEl.innerHTML = "<svg class=\"i\"><use href=\"#i-type\"/></svg><div class=\"s-row-body\"><div class=\"s-row-title\"></div><div class=\"s-row-sub\"></div></div>", divEl.querySelector(".s-row-title").textContent = bindByIndex, divEl.querySelector(".s-row-sub").textContent = bindHelperClampedBindCallback ? "Font aktif" : "Belum diimport";
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn sm" + (bindHelperClampedBindCallback ? '' : " primary"), buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-upload\"/></svg>" + (bindHelperClampedBindCallback ? "Ganti font" : "Import font"), buttonEl.addEventListener("click", () => bindOutput(bindByIndex)), divEl.appendChild(buttonEl), bindInnerHtml.appendChild(divEl);
  }
}
function omInitTopbar() {
  const style = document.getElementById("om-am-style") || document.getElementById("om-feature-style") || document.createElement("style");
  if (!style.parentNode) document.head.appendChild(style);
  style.textContent += `
#om-top {position:relative}
#omTopUndo,#omTopRedo{border-radius:6px;padding:5px 7px}
#omTopMore{border-radius:6px;padding:5px 10px}
#omTopMenu{position:fixed;z-index:901;min-width:210px;background:var(--panel);border:1px solid var(--line2);border-radius:10px;padding:6px;display:none;flex-direction:column;gap:2px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
#omTopMenu.on{display:flex}
#omTopMenu button{display:flex;align-items:center;gap:8px;background:none;border:none;color:var(--text);padding:8px 10px;border-radius:6px;text-align:left;font-size:13px;cursor:pointer}
#omTopMenu button:hover{background:var(--card)}
#omTopMenu .om-top-sep{height:1px;background:var(--line2);margin:4px 4px}
#omTopMenu .om-mn-chk{width:16px;text-align:center;color:var(--accent)}
#om-add{position:fixed;right:18px;bottom:26px;z-index:900;padding:12px 20px;border-radius:14px;background:var(--accent);color:#03231A!important;border:none;font-weight:700;font-size:14px;box-shadow:0 6px 18px rgba(0,255,169,.25);transition:transform .1s}
#om-add:hover{transform:translateY(-1px)}
#omGridOverlay{position:absolute;inset:0;z-index:4;pointer-events:none;display:none;background-image:linear-gradient(rgba(0,255,169,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,169,.14) 1px,transparent 1px);background-size:18px 18px}
#omGridOverlay.on{display:block}
#omGuideOverlay{position:absolute;inset:0;z-index:4;pointer-events:none;display:none}
#omGuideOverlay.on{display:block}
#omGuideOverlay i{position:absolute;background:var(--accent-blue);opacity:.7}
#omTopTitleBtn{background:none;border:none;color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;padding:4px 8px;border-radius:6px}
#omTopTitleBtn:hover{background:var(--card)}
#omTopTitleInput{background:var(--card);border:1px solid var(--accent);color:var(--text);border-radius:6px;padding:4px 8px;font-size:14px}
`;
  const actions = document.querySelector(".top-actions");
  if (!actions || document.getElementById("omTopUndo")) return;
  const ominittopbarCallback = (id, html, title, omInitTopbarArg) => {
    const omInitTopbarButtonEl = document.createElement("button");
    omInitTopbarButtonEl.id = id, omInitTopbarButtonEl.type = "button", omInitTopbarButtonEl.className = "btn ghost icon", omInitTopbarButtonEl.title = title, omInitTopbarButtonEl.innerHTML = html;
    omInitTopbarButtonEl.addEventListener("click", omInitTopbarArg);
    return omInitTopbarButtonEl;
  };
  const undo = ominittopbarCallback("omTopUndo", '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2-9.5L1 10"/></svg>', "Batalkan (Ctrl+Z)", () => undoScene());
  const redo = ominittopbarCallback("omTopRedo", '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2-9.5L23 10"/></svg>', "Ulangi (Ctrl+Y)", () => redoScene());
  const more = ominittopbarCallback("omTopMore", "⋯", "Lainnya", omInitTopbarStopPropagation => {
    omInitTopbarStopPropagation.stopPropagation();
    const moreOmtopmenuEl = document.getElementById("omTopMenu");
    if (!moreOmtopmenuEl) return;
    moreOmtopmenuEl.classList.toggle("on");
    const omInitTopbarGetBoundingClientRect = more.getBoundingClientRect();
    moreOmtopmenuEl.style.top = omInitTopbarGetBoundingClientRect.bottom + 8 + "px";
    moreOmtopmenuEl.style.left = Math.max(8, omInitTopbarGetBoundingClientRect.right - 210) + "px";
  });
  actions.insertBefore(more, actions.querySelector("#openSettings"));
  actions.insertBefore(redo, more);
  actions.insertBefore(undo, redo);
  // judul proyek: tap = rename
  const sTitle = document.getElementById("sTitle");
  if (sTitle && !document.getElementById("omTopTitleBtn")) {
    const ominittopbarButtonEl = document.createElement("button");
    ominittopbarButtonEl.id = "omTopTitleBtn", ominittopbarButtonEl.type = "button", ominittopbarButtonEl.textContent = sTitle.textContent || "Proyek Baru";
    sTitle.replaceWith(ominittopbarButtonEl);
    const commit = () => {
      const commitOmtoptitleinEl = document.getElementById("omTopTitleInput");
      const commitValue = (commitOmtoptitleinEl && commitOmtoptitleinEl.value.trim()) || projectScene && projectScene.title || "Proyek Baru";
      if (projectScene) projectScene.title = commitValue;
      document.getElementById("omTopTitleBtn").textContent = commitValue;
      document.getElementById("omTopTitleBtn").style.display = "";
      window.__omTitleBtn = commitValue;
      omScheduleSave();
      appendLog("[PROYEK] judul: " + commitValue);
    };
    ominittopbarButtonEl.addEventListener("click", () => {
      const omInitTopbarTextContent = ominittopbarButtonEl.textContent;
      ominittopbarButtonEl.style.display = "none";
      const ominittopbarInputEl = document.createElement("input");
      ominittopbarInputEl.id = "omTopTitleInput", ominittopbarInputEl.type = "text", ominittopbarInputEl.value = omInitTopbarTextContent, ominittopbarInputEl.maxLength = 60;
      ominittopbarButtonEl.parentNode.insertBefore(ominittopbarInputEl, ominittopbarButtonEl);
      ominittopbarInputEl.focus();
      ominittopbarInputEl.select();
      const done = () => {
        commit();
        ominittopbarInputEl.remove();
      };
      ominittopbarInputEl.addEventListener("keydown", ev => {
        if (ev.key === "Enter") done();
        if (ev.key === "Escape") {
          ominittopbarButtonEl.style.display = "";
          ominittopbarInputEl.remove();
        }
      });
      ominittopbarInputEl.addEventListener("blur", done);
    });
  }
  // menu dropdown
  const menu = document.createElement("div");
  menu.id = "omTopMenu";
  menu.innerHTML =
    '<button data-act="import"><span>Impor…</span></button>' +
    '<button data-act="grid"><span class="om-mn-chk">ᗄ</span>Grid</button>' +
    '<button data-act="guide"><span class="om-mn-chk">ᗄ</span>Panduan</button>' +
    '<div class="om-top-sep"></div>' +
    '<button data-act="save">Simpan sekarang</button>' +
    '<button data-act="settings">Setelan</button>' +
    '<button data-act="home">Ke beranda</button>';
  document.body.appendChild(menu);
  menu.querySelectorAll("button[data-act]").forEach(omInitTopbarAddEventListener => omInitTopbarAddEventListener.addEventListener("click", () => {
    menu.classList.remove("on");
    const omInitTopbarAct = omInitTopbarAddEventListener.dataset.act;
    if (omInitTopbarAct === "import") return omOpenImportDlg();
    if (omInitTopbarAct === "grid") return omToggleStageOverlay("omGridOverlay");
    if (omInitTopbarAct === "guide") return omToggleStageOverlay("omGuideOverlay");
    if (omInitTopbarAct === "save") return omSaveProject();
    if (omInitTopbarAct === "settings") return document.getElementById("openSettings").click();
    if (omInitTopbarAct === "home") location.href = "/";
  }));
  // chek nonaktif awal
  menu.querySelector('[data-act="grid"] .om-mn-chk').style.opacity = "0";
  menu.querySelector('[data-act="guide"] .om-mn-chk').style.opacity = "0";
  document.addEventListener("click", omInitTopbarTarget => {
    const ominittopbarOmtopmenuEl = document.getElementById("omTopMenu");
    if (ominittopbarOmtopmenuEl && ominittopbarOmtopmenuEl.classList.contains("on") && !omInitTopbarTarget.target.closest("#omTopMenu") && !omInitTopbarTarget.target.closest("#omTopMore")) ominittopbarOmtopmenuEl.classList.remove("on");
  });
  window.addEventListener("keydown", omInitTopbarKey => {
    const omTopMenuEl = document.getElementById("omTopMenu");
    if (omTopMenuEl && omInitTopbarKey.key === "Escape") omTopMenuEl.classList.remove("on");
  });
  // FAB add menu: pasang overlay grid/guides di stage
  const ominittopbarStageEl = document.getElementById("stage");
  if (ominittopbarStageEl && !document.getElementById("omGridOverlay")) {
    const ominittopbarDivEl = document.createElement("div"), omInitTopbarDivEl = document.createElement("div");
    ominittopbarDivEl.id = "omGridOverlay", omInitTopbarDivEl.id = "omGuideOverlay";
    omInitTopbarDivEl.innerHTML = '<i style="left:33.33%;top:0;bottom:0;width:1px"></i><i style="left:66.66%;top:0;bottom:0;width:1px"></i><i style="top:33.33%;left:0;right:0;height:1px"></i><i style="top:66.66%;left:0;right:0;height:1px"></i>';
    ominittopbarStageEl.appendChild(ominittopbarDivEl), ominittopbarStageEl.appendChild(omInitTopbarDivEl);
  }
  // label total layer sudah ada; perbarui judul kalau setting panel ganti nama
  const stObs = new MutationObserver(() => {
    if (!projectScene || !document.getElementById("omTopTitleBtn")) return;
    const stobsValue = projectScene.title || "Proyek Baru";
    const stobsOmtoptitlebtEl = document.getElementById("omTopTitleBtn");
    if (stobsOmtoptitlebtEl.textContent !== stobsValue && !window.__omTitleEdit) stobsOmtoptitlebtEl.textContent = stobsValue;
  });
  stObs.observe(document.querySelector("#sTop") || document.body, { subtree: true, childList: true, characterData: true });
}
function omToggleStageOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const omToggleStageOverlayFlag = !el.classList.contains("on");
  el.classList.toggle("on", omToggleStageOverlayFlag);
  const term = id === "omGridOverlay" ? "Grid" : "Panduan";
  appendLog("[VIEW] " + term + (omToggleStageOverlayFlag ? " tampil" : " sembunyi"));
  const omtogglestagElement = document.querySelector('#omTopMenu button[data-act="' + (id === "omGridOverlay" ? "grid" : "guide") + '"] .om-mn-chk');
  omtogglestagElement && (omtogglestagElement.style.opacity = omToggleStageOverlayFlag ? "1" : "0");
}
function omOpenImportDlg() {
  if (document.getElementById("om-import-back")) return;
  const back = document.createElement("div");
  back.id = "om-import-back";
  back.style.cssText = "position:fixed;inset:0;z-index:100006;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";
  back.innerHTML = '<div class="om-dialog" style="max-width:440px;width:100%"><h2>Impor</h2>' +
    '<div class="om-props-sec">Dari file</div>' +
    '<button class="btn" type="button" id="om-imp-file" style="width:100%;justify-content:center">Pilih file XML (.xml / .xml2)</button>' +
    '<div class="om-props-sec">Link Alight Motion</div>' +
    '<div style="display:flex;gap:6px"><input id="om-imp-am" type="url" placeholder="https://alight.link/..." style="flex:1"><button class="btn" type="button" id="om-imp-am-go">Buka</button></div>' +
    '<div class="om-props-sec">Link Google Drive</div>' +
    '<div style="display:flex;gap:6px"><input id="om-imp-drive" type="url" placeholder="link berbagi Drive (file XML)" style="flex:1"><button class="btn" type="button" id="om-imp-drive-go">Ambil</button></div>' +
    '<div class="om-props-sec">Mulai ulang</div>' +
    '<button class="btn" type="button" id="om-imp-reset" style="width:100%;justify-content:center">Kembali ke preset contoh</button>' +
    '<div style="margin-top:14px;text-align:right"><button class="btn primary" type="button" id="om-imp-close">Tutup</button></div></div>';
  document.body.appendChild(back);
  back.addEventListener("click", omOpenImportDlgTarget => { if (omOpenImportDlgTarget.target === back) back.remove(); });
  back.querySelector("#om-imp-close").addEventListener("click", () => back.remove());
  const omopenimportInputEl = document.createElement("input");
  omopenimportInputEl.type = "file", omopenimportInputEl.accept = ".xml,.xml2,text/xml,application/xml", omopenimportInputEl.style.display = "none";
  document.body.appendChild(omopenimportInputEl);
  back.querySelector("#om-imp-file").addEventListener("click", () => omopenimportInputEl.click());
  omopenimportInputEl.addEventListener("change", () => {
    const omopenimportItems = [...omopenimportInputEl.files];
    if (omopenimportItems.length && applyHelperValue) applyHelperValue(omopenimportItems).catch(omOpenImportDlgMessage => appendLog("[IMPORT] " + omOpenImportDlgMessage.message)).then(() => {
      if (document.getElementById("om-import-back")) document.getElementById("om-import-back").remove();
    });
    omopenimportInputEl.remove();
  });
  back.querySelector("#om-imp-am-go").addEventListener("click", () => {
    const omOpenImportDlgValue = back.querySelector("#om-imp-am").value.trim();
    if (!omOpenImportDlgValue) return;
    if (urlamEl) urlamEl.value = omOpenImportDlgValue;
    (flagHelper ? flagHelper() : null);
  });
  back.querySelector("#om-imp-drive-go").addEventListener("click", () => {
    const omOpenImportDlgResult = back.querySelector("#om-imp-drive").value.trim();
    if (!omOpenImportDlgResult) return;
    if (urldriveEl) urldriveEl.value = omOpenImportDlgResult;
    (getFlag ? getFlag() : null);
  });
  back.querySelector("#om-imp-reset").addEventListener("click", () => {
    if (typeof processLocal == "function") processLocal();
  });
}
function omMultiTc(id) {
  const rows = [...document.querySelectorAll(".tl-label")].concat([...document.querySelectorAll(".tl-block")]);
  rows.forEach(omMultiTcDataset => {
    if (omMultiTcDataset.dataset && omMultiTcDataset.dataset.key === id) omMultiTcDataset.classList.toggle("om-multi", omMulti.has(id));
  });
  const eyes = [...document.querySelectorAll(".tl-eye")].forEach(closest => {
    const omMultiTcClosest = closest.closest(".tl-label");
    if (omMultiTcClosest && omMultiTcClosest.dataset && omMultiTcClosest.dataset.key === id) closest.classList.toggle("om-multi", omMulti.has(id));
  });
}
function omMultiRefresh() {
  omMultiRefreshStyles();
  let ommultirefreOmmultibarEl = document.getElementById("omMultiBar");
  const isMobileUi = !!document.getElementById("am-mobile-root");
  if (omMulti.size && !isMobileUi) {
    if (!ommultirefreOmmultibarEl) {
      ommultirefreOmmultibarEl = document.createElement("div");
      ommultirefreOmmultibarEl.id = "omMultiBar";
      ommultirefreOmmultibarEl.innerHTML = '<button type="button" class="primary" id="omMGroup">Grup</button><button type="button" id="omMDelete">Hapus</button><button type="button" id="omMClear">Batal</button>';
      document.body.appendChild(ommultirefreOmmultibarEl);
      ommultirefreOmmultibarEl.querySelector("#omMGroup").addEventListener("click", omMultiGroup);
      ommultirefreOmmultibarEl.querySelector("#omMDelete").addEventListener("click", omMultiDelete);
      ommultirefreOmmultibarEl.querySelector("#omMClear").addEventListener("click", () => omMultiClear());
    }
  } else if (ommultirefreOmmultibarEl) {
    ommultirefreOmmultibarEl.remove();
    ommultirefreOmmultibarEl = null;
  }
  document.body.classList.toggle("om-in-multiselect", omMulti.size > 0);
  document.querySelectorAll(".tl-label, .tl-block, .tl-eye").forEach(el => {
    const id = el.closest && el.closest(".tl-label") ? (el.closest(".tl-label").dataset && el.closest(".tl-label").dataset.key) : (el.dataset && el.dataset.key);
    if (el.classList.contains("tl-label") || el.classList.contains("tl-block")) el.classList.toggle("om-multi", !!(id && omMulti.has(id)));
    else if (el.classList.contains("tl-eye") && id) el.classList.toggle("om-multi", omMulti.has(id));
  });
  if (typeof window.omOnMultiSelectChanged === "function") window.omOnMultiSelectChanged([...omMulti]);
}
export { applyElement, applyHelperRaw, bindHelper, bindHelperClamped, bindHelperEnd, bindHelperInner, bindHelperMax, bindHelperOuter, bindHelperParsed, bindHelperRaw, bindHelperStart, buildHelperLocal, buildHelperParsed, getEl, getElHelper, getHelperLocal, handleHelperRaw, helperLocal, helperMap, iHelper, omFillProjectSettings, omFillRecent, omFocusSec, omFxOpenBrowse, omFxRenderBrowse, omFxRenderSet, omInitElemBar, omInitProjectSettingsCard, omInitTopbar, omMultiRefresh, omMultiTc, omOpenCurve, omOpenImportDlg, omPickInput, omSaveProject, omToggleStageOverlay, processByKey, processHelperEnd, processHelperMax, processHelperOuter, processMin, showOmLanding, showOmPassword, some };
