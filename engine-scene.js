import { localList, localValue, map, projectScene } from './state.js';
import { applyHelper, computeHelper, handleHelperClamped, processHelperValue, renderHelper, resHelperRaw } from './engine-core.js';
import { omMeta, renderHelperScoped } from './timeline-playback.js';
import { applyHelperRaw } from './ui-shell.js';
import { omAddSimple } from './engine-transform.js';
import { getHelper } from './engine-layer.js';
function helperRaw(layerById) {
  let helperRawMap = new Map(),
    helperRawValue = getLayers => {
      for (let getId of getLayers.layers || []) getId.id && helperRawMap.set(getId.id, getId), helperRawValue(getId), getId.scene && helperRawValue(getId.scene);
    };
  helperRawValue(layerById);
  let getValueLocal = getArgRaw => {
    for (let getParentId of getArgRaw.layers || []) {
      if (getParentId.parentId) {
        let getLocal = helperRawMap.get(getParentId.parentId);
        getParentId.parentLayer = (getLocal && getLocal !== getParentId) ? getLocal : null;
      } else {
        getParentId.parentLayer = null;
      }
      getValueLocal(getParentId), getParentId.scene && getValueLocal(getParentId.scene);
    }
  };
  getValueLocal(layerById);
  let helperRawList = [...helperRawMap.values()];
  for (let parentLayer of helperRawList) {
    let helperRawNumber = 0,
      getParentLayer = parentLayer.parentLayer;
    for (; getParentLayer && helperRawNumber++ < 64;) {
      if (getParentLayer === parentLayer) {
        parentLayer.parentLayer = null;
        break;
      }
      getParentLayer = getParentLayer.parentLayer;
    }
  }
  return layerById.layerById = helperRawMap, helperRawMap;
}
function helperValue() {
  let helperValueMap = new Map();
  if (!projectScene) return helperValueMap;
  let helperValueRaw = getArg => {
      if (!getArg) return '';
      let getMin = map.get(getArg);
      if (getMin) return getMin;
      let getValueMax = processHelperValue(getArg);
      return getValueMax ? getValueMax.name : '';
    },
    getValueMin = getMedia => {
      for (let uriValue of getMedia.media || []) {
        if ((uriValue.type || '').toLowerCase().startsWith("audio")) continue;
        let getCallbackValue = helperValueRaw(uriValue.uri);
        getCallbackValue && helperValueMap.set(uriValue.uri, renderHelperScoped(getCallbackValue));
      }
      for (let getFillVideo of getMedia.layers || []) {
        for (let getClamped of [getFillVideo.fillVideo, getFillVideo.fillImage]) {
          if (!getClamped || helperValueMap.has(getClamped)) continue;
          let getMax = helperValueRaw(getClamped);
          getMax && helperValueMap.set(getClamped, renderHelperScoped(getMax));
        }
        getFillVideo.scene && getValueMin(getFillVideo.scene);
      }
    };
  return getValueMin(projectScene), helperValueMap;
}
function computeHelperParsed(computeScene) {
  !computeScene || !computeScene.scene || (computeScene.scene.Sn = computeScene.label || computeScene.id || "Scene", localList.push({
    layer: computeScene
  }), handleHelperClamped());
}
function refHelperClamped(refArgCount, refArgEnd) {
  for (let refEffects of refArgCount.layers || []) {
    for (let refValueDerived of refEffects.effects || []) refArgEnd.add(refValueDerived.id);
    refEffects.scene && refHelperClamped(refEffects.scene, refArgEnd);
  }
  return refArgEnd;
}
async function processMax() {
  let processMaxList = [],
    processMaxValue = processMedia => {
      for (let processUri of processMedia.media || []) {
        let toLowerCase = (processUri.type || '').toLowerCase();
        toLowerCase.startsWith("audio") || (toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || processUri.uri) && processMaxList.push(processUri);
      }
      for (let processScene of processMedia.layers || []) processScene.scene && processMaxValue(processScene.scene);
    };
  processMaxValue(projectScene), processMaxList.forEach((processArgClamped, processMaxArg) => {
    if (map.has(processArgClamped.uri)) return;
    let processRes = resHelperRaw(processArgClamped);
    map.set(processArgClamped.uri, processRes || localValue[processMaxArg % Math.max(1, localValue.length)]);
  });
  let processValueLocal = [...new Set(map.values())].filter(Boolean);
  computeHelper("media", "Memuat media preset…");
  try {
    let processMaxNumber = 0;
    for (let processValueOuter of processValueLocal) renderHelper("media", "Memuat media preset…", processMaxNumber + '/' + processValueLocal.length + '\x20' + processValueOuter), await applyHelperRaw(processValueOuter), processMaxNumber++;
  } finally {
    applyHelper("media");
  }
}
function omWalkScenes(omWalkScenesLayers, omwalkscenesCallback) {
  if (!omWalkScenesLayers) return;
  omwalkscenesCallback(omWalkScenesLayers);
  (omWalkScenesLayers.layers || []).forEach(omWalkScenesScene => {
    omWalkScenesScene.scene && omWalkScenes(omWalkScenesScene.scene, omwalkscenesCallback);
    (omWalkScenesScene.children || []).forEach(omWalkScenesArg => {
      omWalkScenesArg.scene && omWalkScenes(omWalkScenesArg.scene, omwalkscenesCallback);
    });
  });
}
function omAddGroup() {
  const omAddGroupOmMeta = omMeta();
  const inner = '<scene title="Grup" width="' + omAddGroupOmMeta.w + '" height="' + omAddGroupOmMeta.h + '" exportWidth="' + omAddGroupOmMeta.w + '" exportHeight="' + omAddGroupOmMeta.h + '" precompose="dynamicResolution" bgcolor="#ff000000" totalTime="' + omAddGroupOmMeta.total + '" fps="' + omAddGroupOmMeta.fps + '"></scene>';
  return omAddSimple("embedScene", "Grup", inner);
}
function omProjectXml(omProjectXmlW) {
  return '<?xml version=\'1.0\' encoding=\'UTF-8\' ?><scene title="' + omProjectXmlW.name + '" width="' + omProjectXmlW.w + '" height="' + omProjectXmlW.h + '" exportWidth="' + omProjectXmlW.w + '" exportHeight="' + omProjectXmlW.h + '" precompose="dynamicResolution" bgcolor="' + omProjectXmlW.bg + '" totalTime="10000" fps="' + omProjectXmlW.fps + '" modifiedTime="' + Date.now() + '" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false"></scene>';
}
function computeHelperMin(computeHelperMinArgValue, computeHelperMinArg, computeArgByKey, computeArgOuter) {
  for (let computeTag of computeHelperMinArgValue || []) {
    if (!computeTag) continue;
    if (String(computeTag.tag || '').toLowerCase() === "text") {
      let computeHelperMinValue = computeHelperMinArg + (computeTag.startTime || 0);
      computeArgByKey.push({
        layer: computeTag,
        start: computeHelperMinValue,
        end: computeHelperMinArg + (Number(computeTag.endTime) || (computeTag.startTime || 0) + 1000)
      });
    } else {
      if (getHelper(computeTag)) {
        if (computeArgOuter.has(computeTag.scene)) continue;
        computeArgOuter.add(computeTag.scene), computeHelperMin(computeTag.scene.layers, computeHelperMinArg + (computeTag.startTime || 0), computeArgByKey, computeArgOuter);
      }
    }
  }
}
export { computeHelperMin, computeHelperParsed, helperRaw, helperValue, omAddGroup, omProjectXml, omWalkScenes, processMax, refHelperClamped };
