import { OM_RATIOS, amAudioEe, applySceneSnapshot, audioOffsetMs, bindFlag, byFileName, bytes, computeHelperByIndex, debugmodetogEl, freeze, getHelperStart, localByIndex, localClamped, localCurrent, localGroup, localList, localMap, localMax, localNodeDerived, localNodeFinal, localNodePending, localRaw, localRef, localSecondary, localSegment, localSet, localStage, localTotal, localUintArray, localValue, localValueCurrent, localValueGroup, localValueNext, localValueScoped, map, noiseDirections, omEnsureId, omMulti, omProjectId, omPropsLayerId, omScheduleSave, processHelperParsed, projectScene, redoStack, renderer, uint32Array2, uint32Array3, uint32Array4, uintArray, undoStack, updateHelperList, updateHelperLocal, valueBatch, valueGroup, valuePhase, valueRaw, valueRecord, valueSecondary, weakSet } from './state.js';
import { refHelper } from './timeline-keyframe.js';
import { applyHelperMin, renderHelperMax } from './parser-value.js';
import { maxHelperParsed, maxHelperValue, nHelper, omSceneXmlInner, renderHelperInner } from './timeline-playback.js';
import { appendLog } from './render-text.js';
import { getHelperEnd } from './parser-amfx.js';
import { computeElement } from './parser-effect-xml.js';
import { omAddSimple } from './engine-transform.js';
import { omProp } from './ui-properties.js';
import { getHelper, join, omResolveLayer } from './engine-layer.js';
import { applyHelperRaw, omMultiRefresh } from './ui-shell.js';
import { computeHelperParsed } from './engine-scene.js';
function renderHelperRaw(renderValue, renderArgByKey, renderArgOuter) {
  return renderValue * (1 - renderArgOuter) + renderArgByKey * renderArgOuter;
}
function applyHelperEnd(applyValue, applyArgInner, applyArgClamped) {
  let applyValueScoped = applyArgInner - applyValue;
  if (Math.abs(applyValueScoped) < 1e-12) return applyArgClamped < applyValue ? 0 : 1;
  let applyHelperEndApplyValue = (applyArgClamped - applyValue) / applyValueScoped;
  return applyHelperEndApplyValue = applyHelperEndApplyValue < 0 ? 0 : applyHelperEndApplyValue > 1 ? 1 : applyHelperEndApplyValue, applyHelperEndApplyValue * applyHelperEndApplyValue * (3 - 2 * applyHelperEndApplyValue);
}
function computeHelperOuter(computeText, computeArgLocal) {
  let computeValue = (computeText + computeArgLocal) * valuePhase,
    floor = Math.floor(computeText + computeValue),
    computeFloor = Math.floor(computeArgLocal + computeValue),
    computeEl = (floor + computeFloor) * localTotal,
    computeRaw = computeText - (floor - computeEl),
    computeValueParsed = computeArgLocal - (computeFloor - computeEl),
    computeNumber = 0,
    computeValueInner = 1;
  computeRaw > computeValueParsed && (computeNumber = 1, computeValueInner = 0);
  let computeInner = computeRaw - computeNumber + localTotal,
    computeValueStart = computeValueParsed - computeValueInner + localTotal,
    computeStart = computeRaw - 1 + 2 * localTotal,
    computeValueEnd = computeValueParsed - 1 + 2 * localTotal,
    computeEnd = floor & 255,
    computeValueMin = computeFloor & 255,
    computeValueList = localUintArray[computeEnd + bytes[computeValueMin]],
    computeList = localUintArray[computeNumber + computeEnd + bytes[computeValueInner + computeValueMin]],
    computeValueMap = localUintArray[computeEnd + 1 + bytes[computeValueMin + 1]],
    computeMap = 0,
    computeValueCount = 0,
    computeCount = 0,
    computeValueClamped = 0.5 - computeRaw * computeRaw - computeValueParsed * computeValueParsed;
  computeValueClamped >= 0 && (computeValueClamped *= computeValueClamped, computeMap = computeValueClamped * computeValueClamped * (noiseDirections[computeValueList][0] * computeRaw + noiseDirections[computeValueList][1] * computeValueParsed));
  let computeClamped = 0.5 - computeInner * computeInner - computeValueStart * computeValueStart;
  computeClamped >= 0 && (computeClamped *= computeClamped, computeValueCount = computeClamped * computeClamped * (noiseDirections[computeList][0] * computeInner + noiseDirections[computeList][1] * computeValueStart));
  let computeValueScoped = 0.5 - computeStart * computeStart - computeValueEnd * computeValueEnd;
  return computeValueScoped >= 0 && (computeValueScoped *= computeValueScoped, computeCount = computeValueScoped * computeValueScoped * (noiseDirections[computeValueMap][0] * computeStart + noiseDirections[computeValueMap][1] * computeValueEnd)), (computeMap + computeValueCount + computeCount) * 70;
}
function refHelperScoped(refArgList, refValue, refArgMax) {
  let refItems = [];
  for (let refNumber = 0; refNumber < refValue; refNumber++) {
    let refCount = refArgList[refNumber];
    refItems.push(refCount === void 0 ? refArgMax[refNumber] === void 0 ? 0 : refArgMax[refNumber] : refCount);
  }
  return refItems;
}
function updateHelper(updateChildren, updateArgOuter) {
  return !updateChildren || !updateChildren.children ? [] : Array.from(updateChildren.children).filter(tagName => !updateArgOuter || tagName.tagName === updateArgOuter);
}
function objHelperEnd(objArgTarget) {
  let objHelperEndValue = 1 / 0,
    objValueLocal = 1 / 0,
    objValueClamped = -1 / 0,
    objLocal = -1 / 0,
    objHelperEndValueRaw = (objArgRaw, objArgParsed) => {
      objArgRaw < objHelperEndValue && (objHelperEndValue = objArgRaw), objArgRaw > objValueClamped && (objValueClamped = objArgRaw), objArgParsed < objValueLocal && (objValueLocal = objArgParsed), objArgParsed > objLocal && (objLocal = objArgParsed);
    },
    objHelperEndNumber = 0,
    objStart = 0;
  for (let objHelperEndObjValue of objArgTarget) if (objHelperEndObjValue[0] === 'M' || objHelperEndObjValue[0] === 'L') objHelperEndValueRaw(objHelperEndObjValue[1], objHelperEndObjValue[2]), objHelperEndNumber = objHelperEndObjValue[1], objStart = objHelperEndObjValue[2];else {
    if (objHelperEndObjValue[0] === 'C') {
      let objTarget = objHelperEndObjValue[1],
        objValueInput = objHelperEndObjValue[2],
        objInput = objHelperEndObjValue[3],
        objValueOutput = objHelperEndObjValue[4],
        objValueMap = objHelperEndObjValue[5],
        objMap = objHelperEndObjValue[6];
      for (let objValueEnd = 0; objValueEnd <= 16; objValueEnd++) {
        let objValueRaw = objValueEnd / 16,
          objRaw = 1 - objValueRaw;
        objHelperEndValueRaw(objRaw * objRaw * objRaw * objHelperEndNumber + 3 * objRaw * objRaw * objValueRaw * objTarget + 3 * objRaw * objValueRaw * objValueRaw * objInput + objValueRaw * objValueRaw * objValueRaw * objValueMap, objRaw * objRaw * objRaw * objStart + 3 * objRaw * objRaw * objValueRaw * objValueInput + 3 * objRaw * objValueRaw * objValueRaw * objValueOutput + objValueRaw * objValueRaw * objValueRaw * objMap);
      }
      objHelperEndNumber = objValueMap, objStart = objMap;
    }
  }
  if (!(objHelperEndValue <= objValueClamped)) return {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    cx: 0,
    cy: 0,
    hx: 1,
    hy: 1,
    w: 2,
    h: 2
  };
  let objValueList = objValueClamped - objHelperEndValue,
    objList = objLocal - objValueLocal;
  return {
    minX: objHelperEndValue,
    minY: objValueLocal,
    maxX: objValueClamped,
    maxY: objLocal,
    cx: (objHelperEndValue + objValueClamped) / 2,
    cy: (objValueLocal + objLocal) / 2,
    hx: objValueList / 2,
    hy: objList / 2,
    w: objValueList,
    h: objList
  };
}
function resHelper(resValue, resArgValue) {
  return refHelper(resValue, resArgValue, []);
}
function buildHelper(buildValue, buildArgOuter) {
  return resHelper(buildValue, buildArgOuter)[0];
}
function helperByKey(strokes) {
  let helperByKeyValue = 1 / 0,
    objValueOuter = 1 / 0,
    objValueScoped = -1 / 0,
    objOuter = -1 / 0;
  for (let width of strokes.strokes || []) {
    let objValueParsed = Math.max(0, width.width || 0) / 2;
    for (let objParsed of width.points) objParsed[0] - objValueParsed < helperByKeyValue && (helperByKeyValue = objParsed[0] - objValueParsed), objParsed[0] + objValueParsed > objValueScoped && (objValueScoped = objParsed[0] + objValueParsed), objParsed[1] - objValueParsed < objValueOuter && (objValueOuter = objParsed[1] - objValueParsed), objParsed[1] + objValueParsed > objOuter && (objOuter = objParsed[1] + objValueParsed);
  }
  if (!(helperByKeyValue <= objValueScoped)) return {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    cx: 0,
    cy: 0,
    hx: 1,
    hy: 1,
    w: 2,
    h: 2
  };
  let objCount = objValueScoped - helperByKeyValue,
    objValueTotal = objOuter - objValueOuter;
  return {
    minX: helperByKeyValue,
    minY: objValueOuter,
    maxX: objValueScoped,
    maxY: objOuter,
    cx: (helperByKeyValue + objValueScoped) / 2,
    cy: (objValueOuter + objOuter) / 2,
    hx: objCount / 2,
    hy: objValueTotal / 2,
    w: objCount,
    h: objValueTotal
  };
}
function buildHelperMax(endTime, buildHelperMaxArg) {
  let buildValueMin = endTime.endTime - endTime.startTime;
  return buildValueMin <= 0 ? 0 : (buildHelperMaxArg - endTime.startTime) / buildValueMin;
}
function processClamped(processChildren, processArgScoped) {
  return !processChildren || !processChildren.children ? [] : Array.from(processChildren.children).filter(processTagName => !processArgScoped || processTagName.tagName === processArgScoped);
}
function fail(code) {
  if (!code || !code.code) throw new Error("Bentuk " + (code && code.id) + ": tidak punya script getPath.");
  let failValue = new Function(code.code + "\n;return typeof getPath === 'function' ? getPath : null;")();
  if (typeof failValue != "function") throw new Error("Bentuk " + code.id + ": script tidak mendefinisikan getPath(params).");
  return {
    definition: code,
    getPath: failValue
  };
}
function refHelperByIndex(definition, mt, refHelperByIndexArg) {
  let refParams = definition.definition,
    refObj = mt.mt || (mt.mt = {}),
    refClamped = refObj.obj || (refObj.obj = {}),
    refExtra = refObj.vec || (refObj.vec = [0, 0, 0, 0]);
  for (let refId of refParams.params) {
    let channel = mt.shapeProps && mt.shapeProps[refId.id];
    if (!channel) {
      refClamped[refId.id] === void 0 && (refClamped[refId.id] = renderHelperMax(refId));
      continue;
    }
    let refValueResolved = channel.channel ? refHelper(channel.channel, refHelperByIndexArg, refExtra) : refExtra;
    refClamped[refId.id] = applyHelperMin(refId, refValueResolved, refClamped[refId.id]);
  }
  return refClamped;
}
function handleHelperParsed(handleHelperParsedArg, handleArgOuter) {
  return (handleHelperParsedArg << handleArgOuter | handleHelperParsedArg >>> 32 - handleArgOuter) >>> 0;
}
function processHelperRaw(processArg, processHelperRawArg, processArgValue, processArgRaw, processRaw) {
  processArg[processHelperRawArg] = processArg[processHelperRawArg] + processArg[processArgValue] >>> 0, processArg[processRaw] = handleHelperParsed(processArg[processRaw] ^ processArg[processHelperRawArg], 16), processArg[processArgRaw] = processArg[processArgRaw] + processArg[processRaw] >>> 0, processArg[processArgValue] = handleHelperParsed(processArg[processArgValue] ^ processArg[processArgRaw], 12), processArg[processHelperRawArg] = processArg[processHelperRawArg] + processArg[processArgValue] >>> 0, processArg[processRaw] = handleHelperParsed(processArg[processRaw] ^ processArg[processHelperRawArg], 8), processArg[processArgRaw] = processArg[processArgRaw] + processArg[processRaw] >>> 0, processArg[processArgValue] = handleHelperParsed(processArg[processArgValue] ^ processArg[processArgRaw], 7);
}
function computeHelperMax(computeArgInner, computeArg) {
  for (let computeHelperMaxNumber = 0; computeHelperMaxNumber < 16; computeHelperMaxNumber++) computeArg[computeHelperMaxNumber] = computeArgInner[computeHelperMaxNumber];
  for (let computeValueCurrent = 0; computeValueCurrent < 10; computeValueCurrent++) processHelperRaw(computeArg, 0, 4, 8, 12), processHelperRaw(computeArg, 1, 5, 9, 13), processHelperRaw(computeArg, 2, 6, 10, 14), processHelperRaw(computeArg, 3, 7, 11, 15), processHelperRaw(computeArg, 0, 5, 10, 15), processHelperRaw(computeArg, 1, 6, 11, 12), processHelperRaw(computeArg, 2, 7, 8, 13), processHelperRaw(computeArg, 3, 4, 9, 14);
  for (let computeScoped = 0; computeScoped < 16; computeScoped++) computeArg[computeScoped] = computeArg[computeScoped] + computeArgInner[computeScoped] >>> 0;
}
function refHelperEl(refArgValue, refHelperElArg) {
  let refHelperElUintArray = new Uint8Array(refArgValue.length);
  uint32Array3[0] = localNodeDerived[0], uint32Array3[1] = localNodeDerived[1], uint32Array3[2] = localNodeDerived[2], uint32Array3[3] = localNodeDerived[3];
  for (let refHelperElNumber = 0; refHelperElNumber < 8; refHelperElNumber++) uint32Array3[4 + refHelperElNumber] = uint32Array2[refHelperElNumber];
  uint32Array3[12] = 0, uint32Array3[13] = refHelperElArg >>> 0, uint32Array3[14] = 0, uint32Array3[15] = 0;
  for (let refValueScoped = 0; refValueScoped < refArgValue.length; refValueScoped += 64) {
    computeHelperMax(uint32Array3, uint32Array4);
    for (let refParsed = 0; refParsed < 16; refParsed++) {
      let refMin = uint32Array4[refParsed];
      uintArray[refParsed * 4] = refMin & 255, uintArray[refParsed * 4 + 1] = refMin >>> 8 & 255, uintArray[refParsed * 4 + 2] = refMin >>> 16 & 255, uintArray[refParsed * 4 + 3] = refMin >>> 24 & 255;
    }
    let refResolved = Math.min(64, refArgValue.length - refValueScoped);
    for (let refScoped = 0; refScoped < refResolved; refScoped++) refHelperElUintArray[refValueScoped + refScoped] = refArgValue[refValueScoped + refScoped] ^ uintArray[refScoped];
  }
  return refHelperElUintArray;
}
function applyFail(applyFailArg) {
  throw new Error("bentuk: " + applyFailArg);
}
function refHelperLocal() {
  let refHelperLocalRecord = {
    ...freeze,
    categorySet: []
  };
  try {
    if (typeof localStorage > 'u') return refHelperLocalRecord;
    let getItem = localStorage.getItem(valueRecord);
    if (!getItem) return refHelperLocalRecord;
    let parse = JSON.parse(getItem);
    if (parse && typeof parse == "object") {
      for (let refValueList of Object.keys(freeze)) refValueList in parse && (refHelperLocalRecord[refValueList] = parse[refValueList]);
    }
  } catch {}
  return refHelperLocalRecord;
}
function buildHelperByKey(buildHelperByKeyArg) {
  try {
    localStorage.setItem(valueRecord, JSON.stringify(buildHelperByKeyArg));
  
  } catch {}
}
function processParsed(processParsedCategory, categoryMode) {
  if (categoryMode.categoryMode === "off") return true;
  let processParsedValue = processParsedCategory && processParsedCategory.category || "other";
  return categoryMode.categoryMode === "only" ? categoryMode.categorySet.has(processParsedValue) : !categoryMode.categorySet.has(processParsedValue);
}
function computeHelperInner(computeX, computeArgRaw, computeHelperInnerArg, computeArgClamped, computeArgByIndex, computeArgEl) {
  if (!computeArgRaw || computeX.empty) return computeX;
  let ceil = Math.ceil(computeHelperInnerArg + computeArgByIndex),
    computeCeil = Math.ceil(computeArgClamped + computeArgEl),
    computeHelperInnerValue = computeX.x + computeX.w,
    computeValueOutput = computeX.y + computeX.h,
    computeOutput = Math.max(computeHelperInnerValue, Math.min(computeX.x + Math.ceil(computeX.w / computeArgRaw) * computeArgRaw, ceil)),
    computeCurrent = Math.max(computeValueOutput, Math.min(computeX.y + Math.ceil(computeX.h / computeArgRaw) * computeArgRaw, computeCeil));
  return computeX.w = computeOutput - computeX.x, computeX.h = computeCurrent - computeX.y, computeX.origin[0] = computeX.x / computeHelperInnerArg, computeX.origin[1] = (computeArgClamped - computeCurrent) / computeArgClamped, computeX.size[0] = computeX.w / computeHelperInnerArg, computeX.size[1] = computeX.h / computeArgClamped, computeX;
}
function nHelperValue(nArgValue) {
  return 2;
}
function applyHelperLocal(applyArgParsed, applyArg, applyArgValue) {
  let applyHelperLocalValue = applyArg[0] * applyArgValue[0] + applyArg[2] * applyArgValue[1],
    applyValueInner = applyArg[1] * applyArgValue[0] + applyArg[3] * applyArgValue[1],
    applyValueStart = applyArg[0] * applyArgValue[2] + applyArg[2] * applyArgValue[3],
    applyValueEnd = applyArg[1] * applyArgValue[2] + applyArg[3] * applyArgValue[3],
    applyEnd = applyArg[0] * applyArgValue[4] + applyArg[2] * applyArgValue[5] + applyArg[4],
    applyValueMin = applyArg[1] * applyArgValue[4] + applyArg[3] * applyArgValue[5] + applyArg[5];
  applyArgParsed[0] = applyHelperLocalValue, applyArgParsed[1] = applyValueInner, applyArgParsed[2] = applyValueStart, applyArgParsed[3] = applyValueEnd, applyArgParsed[4] = applyEnd, applyArgParsed[5] = applyValueMin;
}
function buildHelperByIndex(toScreen, buildArg, buildHelperByIndexArg, buildArgValue, buildArgRaw, buildArgParsed) {
  let buildScoped = buildArg[0],
    buildValueLocal = buildArg[1],
    buildLocal = buildArg[2],
    buildValueOuter = buildArg[3],
    buildOuter = buildArg[4],
    buildValueInner = buildArg[5],
    buildValueParsed = buildScoped * buildHelperByIndexArg / buildArgRaw,
    buildParsed = -buildLocal * buildArgValue / buildArgRaw,
    buildInner = (-buildScoped * buildHelperByIndexArg / 2 + buildLocal * buildArgValue / 2 + buildOuter) / buildArgRaw,
    buildValueClamped = -buildValueLocal * buildHelperByIndexArg / buildArgParsed,
    buildClamped = buildValueOuter * buildArgValue / buildArgParsed,
    buildValueStart = 1 - (-buildValueLocal * buildHelperByIndexArg / 2 + buildValueOuter * buildArgValue / 2 + buildValueInner) / buildArgParsed,
    buildToScreen = toScreen.toScreen;
  buildToScreen[0] = buildValueParsed, buildToScreen[1] = buildParsed, buildToScreen[2] = 0, buildToScreen[3] = buildInner, buildToScreen[4] = buildValueClamped, buildToScreen[5] = buildClamped, buildToScreen[6] = 0, buildToScreen[7] = buildValueStart, buildToScreen[8] = 0, buildToScreen[9] = 0, buildToScreen[10] = 1, buildToScreen[11] = 0, buildToScreen[12] = 0, buildToScreen[13] = 0, buildToScreen[14] = 0, buildToScreen[15] = 1;
  let buildHelperByIndexBuildValue = buildValueParsed * buildClamped - buildParsed * buildValueClamped;
  Math.abs(buildHelperByIndexBuildValue) < 1e-12 && (buildHelperByIndexBuildValue = buildHelperByIndexBuildValue < 0 ? -1e-12 : 1e-12);
  let buildMin = buildClamped / buildHelperByIndexBuildValue,
    buildValueMax = -buildValueClamped / buildHelperByIndexBuildValue,
    buildValueByKey = -buildParsed / buildHelperByIndexBuildValue,
    buildByKey = buildValueParsed / buildHelperByIndexBuildValue,
    toLayer = toScreen.toLayer;
  toLayer[0] = buildMin, toLayer[1] = buildValueByKey, toLayer[2] = 0, toLayer[3] = -(buildMin * buildInner + buildValueByKey * buildValueStart), toLayer[4] = buildValueMax, toLayer[5] = buildByKey, toLayer[6] = 0, toLayer[7] = -(buildValueMax * buildInner + buildByKey * buildValueStart), toLayer[8] = 0, toLayer[9] = 0, toLayer[10] = 1, toLayer[11] = 0, toLayer[12] = 0, toLayer[13] = 0, toLayer[14] = 0, toLayer[15] = 1, toScreen.sizePx[0] = buildHelperByIndexArg * Math.hypot(buildScoped, buildValueLocal), toScreen.sizePx[1] = buildArgValue * Math.hypot(buildLocal, buildValueOuter), toScreen.sizeNorm[0] = Math.hypot(buildValueParsed, buildValueClamped), toScreen.sizeNorm[1] = Math.hypot(buildParsed, buildClamped), toScreen.centerPx[0] = buildOuter, toScreen.centerPx[1] = buildValueInner, toScreen.centerNorm[0] = buildOuter / buildArgRaw, toScreen.centerNorm[1] = 1 - buildValueInner / buildArgParsed, toScreen.valid = true;
}
function processHelperClamped(processArgParsed) {
  return typeof processArgParsed != "string" || !processArgParsed ? "normal" : processArgParsed.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/[\s_]+/g, '-');
}
function objHelperEl(objHelperElWidth) {
  let objHelperElValue = objArgMap => Number(objArgMap) > 0 ? Number(objArgMap) : 0,
    objHelperElValueRaw = objHelperElValue(objHelperElWidth && objHelperElWidth.width) || objHelperElValue(objHelperElWidth && objHelperElWidth.exportWidth) || 1080,
    objSecondary = objHelperElValue(objHelperElWidth && objHelperElWidth.height) || objHelperElValue(objHelperElWidth && objHelperElWidth.exportHeight) || 1920;
  return {
    w: objHelperElValueRaw,
    h: objSecondary
  };
}
function getHelperOuter(mediaOrientation) {
  let getHelperOuterValue = ((Number(mediaOrientation && mediaOrientation.mediaOrientation) || 0) % 360 + 360) % 360;
  return getHelperOuterValue === 90 || getHelperOuterValue === 180 || getHelperOuterValue === 270 ? getHelperOuterValue : 0;
}
function updateHelperInner(mediaNativeWidth, updateHelperInnerArg, updateArgMin) {
  let updateGet = getHelperOuter(mediaNativeWidth);
  if (!updateGet) return 0;
  let updateValueLocal = Number(mediaNativeWidth && mediaNativeWidth.mediaNativeWidth) || 0,
    updateLocal = Number(mediaNativeWidth && mediaNativeWidth.mediaNativeHeight) || 0;
  return (updateGet === 90 || updateGet === 270) && updateValueLocal > 0 && updateLocal > 0 && updateValueLocal !== updateLocal && updateHelperInnerArg === updateValueLocal && updateArgMin === updateLocal ? 0 : (360 - updateGet) % 360;
}
function objHelperScoped(objHelperScopedArg, objHelperScopedFlag, objArgCount, objArgOuter, objArgInner, fit) {
  let objFlag = objHelperScopedArg === 90 || objHelperScopedArg === 270,
    objValueMin = objFlag ? objArgCount : objHelperScopedFlag,
    objMin = objFlag ? objHelperScopedFlag : objArgCount,
    objValueMax = objArgOuter,
    objMax = objArgInner;
  if (fit !== "stretch") {
    let objValueByKey = fit === "fit" ? Math.min(objArgOuter / objValueMin, objArgInner / objMin) : Math.max(objArgOuter / objValueMin, objArgInner / objMin);
    objValueByKey > 0 && (objValueMax = objValueMin * objValueByKey, objMax = objMin * objValueByKey);
  }
  return {
    dw: objFlag ? objMax : objValueMax,
    dh: objFlag ? objValueMax : objMax
  };
}
function objHelperLocal(objHelperLocalFit, objArg, objArgValue, objArgStart, objArgEnd) {
  if (objHelperLocalFit === "stretch" || !(objArg > 0) || !(objArgValue > 0)) return {
    sx: 0,
    sy: 0,
    sw: objArg,
    sh: objArgValue
  };
  let objByKey = objHelperLocalFit === "fit" ? Math.min(objArgStart / objArg, objArgEnd / objArgValue) : Math.max(objArgStart / objArg, objArgEnd / objArgValue);
  if (!(objByKey > 0)) return {
    sx: 0,
    sy: 0,
    sw: objArg,
    sh: objArgValue
  };
  let objCurrent = Math.min(objArg, objArgStart / objByKey),
    objValueNext = Math.min(objArgValue, objArgEnd / objByKey);
  return {
    sx: (objArg - objCurrent) / 2,
    sy: (objArgValue - objValueNext) / 2,
    sw: objCurrent,
    sh: objValueNext
  };
}
function flagHelperValue(seekable, flagValue) {
  let flagSeekable = seekable.seekable;
  if (!flagSeekable || !flagSeekable.length) return true;
  for (let flagNumber = 0; flagNumber < flagSeekable.length; flagNumber++) if (flagValue >= flagSeekable.start(flagNumber) - 0.05 && flagValue <= flagSeekable.end(flagNumber) + 0.05) return true;
  return false;
}
function objHelperInner(objUrl, objOther, objArgAnother) {
  return {
    url: objUrl.url,
    tracks: objUrl.tracks || null,
    startMs: objOther,
    endMs: objArgAnother,
    rate: objUrl.rate,
    offsetMs: objUrl.offsetMs,
    inTimeMs: objUrl.inTimeMs || 0,
    sampleRate: objUrl.sampleRate || localMax,
    channels: 2
  };
}
function processHelperInner(processHelperInnerArg, processArgInner) {
  let toLowerCase = String(processHelperInnerArg || '').toLowerCase();
  if (toLowerCase.startsWith("video/")) return "video";
  if (toLowerCase.startsWith("image/")) return "image";
  if (toLowerCase.startsWith("audio/")) return "audio";
  if (toLowerCase && !toLowerCase.startsWith("application/octet-stream")) return '';
  let processHelperInnerString = String(processArgInner || '');
  return localValueGroup.test(processHelperInnerString) ? "video" : /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(processHelperInnerString) ? "image" : valueGroup.test(processHelperInnerString) ? "audio" : '';
}
function computeHelperStart(computeHelperStartArg) {
  let trim = String(computeHelperStartArg || '').trim();
  if (!trim) return [];
  let computeHelperStartSet = new Set(),
    computeHelperStartValue = computeArgStart => {
      if (!computeArgStart) return;
      let toLowerCase = String(computeArgStart).toLowerCase();
      computeHelperStartSet.add(toLowerCase);
      try {
        computeHelperStartSet.add(decodeURIComponent(toLowerCase));
      } catch {}
    };
  computeHelperStartValue(trim);
  let replace = trim.replace(localGroup, '');
  computeHelperStartValue(replace);
  let computeHelperStartValueRaw = replace.split(/[\\/]/).pop() || replace;
  return computeHelperStartValue(computeHelperStartValueRaw), computeHelperStartValue(computeHelperStartValueRaw.replace(/\.[^.]+$/, '')), [...computeHelperStartSet];
}
function arrHelper(arrCondition, arrArg) {
  let trim = String(arrArg ?? '').trim();
  if (!trim) return [];
  let arrItems = [];
  for (let arrUri of arrCondition || []) arrUri && (arrUri.uri !== trim && arrUri.filename !== trim || (arrUri.filename && arrItems.push(arrUri.filename), arrUri.uri && arrUri.uri !== trim && arrItems.push(arrUri.uri)));
  return [...new Set(arrItems)];
}
function applyHelperParsed(applyArgScoped, applyHelperParsedArg, applyArgEnd) {
  let find = applyArgScoped.find(applyHelperParsedArg);
  if (find) return find;
  for (let applyMin of arrHelper(applyArgEnd, applyHelperParsedArg)) {
    let applyScoped = applyArgScoped.find(applyMin);
    if (applyScoped) return applyScoped;
  }
  return null;
}
function getHelperMax(getCandidates, getUri, mediaEntries = {}) {
  if (!getUri) return '';
  let getHelperMaxValue = mediaEntries.mediaEntries || [],
    getValueCount = mediaEntries.used || new Set(),
    getEnd = applyHelperParsed(getCandidates, getUri.uri, getHelperMaxValue) || applyHelperParsed(getCandidates, getUri.filename, getHelperMaxValue);
  if (getEnd) return getEnd.name;
  let getProcess = processHelperInner(getUri.type, getUri.filename || getUri.uri);
  if (!getProcess || getProcess === "audio") return '';
  let candidates = getCandidates.candidates(getProcess, getValueCount);
  return candidates.length === 1 ? candidates[0].name : '';
}
function computeHelper(computeHelperArg, computeArgList) {
  localClamped.set(computeHelperArg, {
    label: computeArgList,
    detail: ''
  }), processHelperParsed();
}
function renderHelper(renderHelperArg, renderArgPrev, detail = '') {
  let labelValue = localClamped.get(renderHelperArg);
  labelValue && (labelValue.label = renderArgPrev, labelValue.detail = detail, localClamped.delete(renderHelperArg), localClamped.set(renderHelperArg, labelValue), processHelperParsed());
}
function applyHelper(applyHelperArg) {
  localClamped.delete(applyHelperArg) && processHelperParsed();
}
async function updateHelperRaw(updateHelperRawArg, updateArgList, updateHelperRawArgValue) {
  computeHelper(updateHelperRawArg, updateArgList);
  try {
    return await localCurrent(), await updateHelperRawArgValue();
  } finally {
    applyHelper(updateHelperRawArg);
  }
}
function buildHelperScoped() {
  let buildHelperScopedValue = projectScene && projectScene.audio && projectScene.audio[0];
  return buildHelperScopedValue && buildHelperScopedValue.inTime || 0;
}
function applyHelperMax(applyHelperMaxArg) {
  let applyStartTime = renderHelperInner();
  return applyStartTime ? Math.max(0, buildHelperScoped() + (applyHelperMaxArg - applyStartTime.startTime - audioOffsetMs) * maxHelperValue(applyStartTime)) : maxHelperParsed(applyHelperMaxArg);
}
function getHelperInner() {
  for (let elValue of amAudioEe) {
    try {
      elValue.el.pause();
    } catch {}
    try {
      elValue.el.removeAttribute("src"), elValue.el.load();
    } catch {}
  }
  amAudioEe.length = 0, localSegment.clear();
}
function updateHelperByKey() {
  if (!valueRaw.length) return null;
  let updateHelperByKeyValue = updateArgMap => String(updateArgMap.name || '').replace(/\.[^.]+$/, '').toLowerCase(),
    toLowerCase = String(projectScene && projectScene.filename || '').replace(/\.[^./\\]+$/, '').toLowerCase(),
    updateValueMax = String(projectScene && projectScene.title || '').toLowerCase();
  if (toLowerCase) {
    let find = valueRaw.find(findValue => updateHelperByKeyValue(findValue) === toLowerCase);
    if (find) return find;
    let updateValueByKey = valueRaw.find(updateHelperByKeyArg => updateHelperByKeyValue(updateHelperByKeyArg).length >= 3 && updateValueMax.includes(updateHelperByKeyValue(updateHelperByKeyArg)));
    if (updateValueByKey) return updateValueByKey;
  }
  return valueRaw.find(updateHelperByKeyArgValue => {
    let updateCallback = updateHelperByKeyValue(updateHelperByKeyArgValue);
    return updateCallback.length >= 3 && updateValueMax.includes(updateCallback);
  }) || null;
}
function handleHelperMin(handleHelperMinArg) {
  let handleEnd = map.get(handleHelperMinArg),
    handleProcess = processHelperValue(handleEnd || handleHelperMinArg);
  if (handleProcess) return {
    url: handleProcess.src || handleProcess.url,
    name: handleProcess.name || handleEnd || handleHelperMinArg
  };
  let handleHelperMinString = String(handleHelperMinArg || '');
  return handleHelperMinString ? /^[a-z][a-z0-9+.-]*:/i.test(handleHelperMinString) ? {
    url: '',
    name: handleHelperMinString
  } : {
    url: localValueCurrent + encodeURIComponent(handleHelperMinString),
    name: handleHelperMinString
  } : {
    url: '',
    name: ''
  };
}
function applyOuter(applyHidden) {
  return !!(!applyHidden || applyHidden.hidden === true || applyHidden.hidden === "true" || applyHidden.re || renderer && renderer.hiddenLayers && renderer.hiddenLayers.has(applyHidden.id));
}
function buildHelperList(buildArgClamped) {
  if (!Array.isArray(buildArgClamped) || !buildArgClamped.length) return 0;
  let buildHelperListNumber = 0;
  for (let buildValueMap of buildArgClamped) {
    let buildHelperListValue = buildValueMap || {};
    byFileName.add(buildHelperListValue) && buildHelperListNumber++;
    let buildFlag = buildHelperListValue.name || String(buildHelperListValue.url || '').split('/').pop(),
      isVideo = buildFlag ? byFileName.byFileName(buildFlag) : null;
    isVideo && (isVideo.isVideo || isVideo.isAudio) && !localMap.has(isVideo.name) && (valueRaw.push({
      name: isVideo.name,
      src: isVideo.url
    }), localMap.set(isVideo.name, isVideo.url));
  }
  return buildHelperListNumber && updateHelperLocal(), appendLog("[API] " + buildHelperListNumber + " media package didaftarkan (" + byFileName.list().length + " total)."), buildHelperListNumber;
}
function handleHelperMax() {
  for (let handleValueMin of byFileName.list()) {
    localMap.delete(handleValueMin.name);
    let findIndex = valueRaw.findIndex(handleArgByIndex => handleArgByIndex.name === handleValueMin.name);
    findIndex >= 0 && valueRaw.splice(findIndex, 1);
  }
  byFileName.clear(), updateHelperLocal();
}
function processHelperValue(processHelperValueFlag) {
  return processHelperValueFlag ? localRaw.get(processHelperValueFlag) || applyHelperParsed(byFileName, processHelperValueFlag, localSecondary) : null;
}
function buildHelperClamped(buildHelperClampedArg, buildIsVideo) {
  return !!(buildIsVideo && buildIsVideo.isVideo) || valueBatch.test(buildHelperClampedArg || '');
}
function updateHelperEl(updateArgValue) {
  let updateHelperElValue = updateArgTotal => Math.max(0, Math.min(255, Math.round((Number(updateArgTotal) || 0) * 255))).toString(16).padStart(2, '0');
  return '#' + updateHelperElValue(updateArgValue[0]) + updateHelperElValue(updateArgValue[1]) + updateHelperElValue(updateArgValue[2]) + (updateArgValue[3] === void 0 ? 'ff' : updateHelperElValue(updateArgValue[3]));
}
function computeHelperRaw() {
  return localNodeFinal / 100;
}
function applyHelperClamped(applyId) {
  return !!(renderer && renderer.hiddenLayers && renderer.hiddenLayers.has(applyId.id));
}
function buildHelperValue(buildHelperValueArg) {
  !projectScene || !renderer || !localValueNext && updateHelperList() || (bindFlag(), buildHelperValueArg && nHelper());
}
function buildRaw(buildRawArg) {
  let buildValueScoped = buildRawArg / 1000,
    floor = Math.floor(buildValueScoped / 60);
  return floor ? floor + ':' + String(Math.floor(buildValueScoped % 60)).padStart(2, '0') + '.' + String(Math.round(buildValueScoped % 1 * 100)).padStart(2, '0') : buildValueScoped.toFixed(2) + 's';
}
function handleHelperClamped() {
  bindFlag();
}
function onclick() {
  localList.length && (localList.pop(), handleHelperClamped());
}
function applyInner(applyInnerArg) {
  localSet.has(applyInnerArg) ? localSet.delete(applyInnerArg) : localSet.add(applyInnerArg), bindFlag();
}
function itemsHelper(itemsEffects) {
  return (itemsEffects.effects || []).map(itemsId => {
    let itemsValue = localByIndex.get(itemsId.id) || null;
    return {
      name: itemsValue && itemsValue.name || itemsId.shortId || String(itemsId.id).split('.').pop(),
      state: itemsId.hidden ? "mati" : renderer && renderer.failedEffects && renderer.failedEffects.has(itemsId.id) ? "dilewati" : '',
      definition: itemsValue,
      params: itemsId.params || []
    };
  });
}
async function resFail(resFailArg) {
  let resValueClamped = await computeHelperByIndex(),
    resFailValue = resValueClamped[resFailArg] || resValueClamped[resFailArg.replace(/^\./, '')];
  if (!resFailValue) throw new Error("file bentuk untuk " + resFailArg + " tidak ketemu");
  try {
    let resArrayBuffer = await fetch("/api/shape-bin?id=" + encodeURIComponent(resFailArg));
    if (resArrayBuffer.ok) return getHelperEnd(await resArrayBuffer.arrayBuffer());
  } catch {}
  try {
    let resClamped = await fetch("/api/shape-xml?id=" + encodeURIComponent(resFailArg));
    if (resClamped.ok) return computeElement(await resClamped.text(), resFailValue);
  } catch {}
  let resOk = await fetch("../shapes/" + resFailValue);
  if (!resOk.ok) throw new Error("HTTP " + resOk.status + " untuk " + resFailValue);
  return computeElement(await resOk.text(), resFailValue);
}
async function applyHelperByKey(applyCategory, applyHelperByKeyArg, applyArgMax) {
  let applyValueRaw = applyArgMax;
  if (applyValueRaw == null && localRef.enabled && localRef.categoryMode !== "off") try {
    let applyOk = await fetch("/api/effect-xml?id=" + encodeURIComponent(applyHelperByKeyArg));
    if (applyOk.ok) {
      let applyValueLocal = await applyOk.text();
      /^\s*<(!doctype\s+html|html)/i.test(applyValueLocal) || (applyValueRaw = applyValueLocal);
    }
  } catch {}
  if (!applyValueRaw) return;
  let exec = /<effect\b[^>]*\bcategory\s*=\s*"([^"]*)"/i.exec(applyValueRaw);
  applyCategory.category = exec ? exec[1].trim().toLowerCase() : "other";
}
async function itemsHelperValue() {
  try {
    let itemsOk = await fetch("/api/presets");
    if (itemsOk.ok) {
      let itemsHelperValueItemsValue = ((await itemsOk.json()).images || []).map(itemsArg => itemsArg.name);
      if (itemsHelperValueItemsValue.length) return itemsHelperValueItemsValue;
    }
  } catch {}
  return [...(await (await fetch(localValueCurrent)).text()).matchAll(/href="([^"]+\.(?:jpe?g|png|webp))"/gi)].map(itemsArgValue => decodeURIComponent(itemsArgValue[1])).filter(itemsHelperValueArg => !itemsHelperValueArg.includes('/') && !itemsHelperValueArg.startsWith('.'));
}
async function buildHelperEnd() {
  let buildMap = [...new Set(await itemsHelperValue())].sort();
  return getHelperStart(buildMap.map(buildArgScoped => ({
    name: buildArgScoped,
    src: localValueCurrent + encodeURIComponent(buildArgScoped)
  }))), localValue;
}
function resHelperRaw(resHelperRawArg) {
  return getHelperMax(byFileName, resHelperRawArg, {
    mediaEntries: localSecondary,
    used: new Set(map.values())
  });
}
function computeHelperLocal(computeArgScoped) {
  let computeMin = renderer && renderer.images ? renderer.images.get(computeArgScoped) : null;
  if (computeMin && computeMin.tagName === "VIDEO") return computeMin;
  let computeHelperLocalValue = processHelperValue(map.get(computeArgScoped) || computeArgScoped) || processHelperValue(computeArgScoped);
  if (!computeHelperLocalValue) return null;
  let href = new URL(computeHelperLocalValue.src || computeHelperLocalValue.url, location.href).href;
  for (let [, computeTagName] of localValueScoped) if (computeTagName && computeTagName.tagName === "VIDEO" && computeTagName.src === href) return computeTagName;
  return null;
}
function refHelperInner() {
  let refHelperInnerList = [];
  if (!renderer || !renderer.images) return refHelperInnerList;
  for (let refValueCount of renderer.images.values()) refValueCount && refValueCount.tagName === "VIDEO" && refHelperInnerList.push(refValueCount);
  return refHelperInnerList;
}
function applyClamped() {
  return valueSecondary ? [] : refHelperInner().filter(applyReadyState => applyReadyState.readyState < 2 && !weakSet.has(applyReadyState));
}
function computeHelperEnd(computeArgMin) {
  let computeHelperEndValue = map.get(computeArgMin) || computeArgMin,
    computeProcess = processHelperValue(computeHelperEndValue);
  return !!computeProcess && buildHelperClamped(computeProcess.name || computeHelperEndValue, computeProcess);
}
async function refFail(refFailArgValue, refFailArgRaw, refFailArg = null) {
  let params = new URLSearchParams(refFailArg || {});
  params.set("url", refFailArgRaw);
  let refJson = await fetch(refFailArgValue + '?' + params.toString()),
    refError = null;
  try {
    refError = await refJson.json();
  } catch {}
  if (!refJson.ok) throw new Error(refError && (refError.error || refError.message) || "HTTP " + refJson.status);
  if (!refError) throw new Error("Respons server kosong atau bukan JSON");
  return refError;
}
function updateHelperTotal(updateHelperTotalArg) {
  let updateHelperTotalString = String(updateHelperTotalArg || ''),
    match = updateHelperTotalString.match(/filename\*=UTF-8''([^;]+)/i),
    updateValueEl = updateHelperTotalString.match(/filename="?([^";]+)"?/i),
    updateOuter = match ? match[1] : updateValueEl ? updateValueEl[1] : '';
  if (!updateOuter) return '';
  try {
    return decodeURIComponent(updateOuter).trim();
  } catch {
    return updateOuter.trim();
  }
}
function processHelperByKey(processHelperByKeyArg) {
  let trim = String(processHelperByKeyArg || '').trim();
  if (!trim) return '';
  if (localMap.has(trim)) return localMap.get(trim);
  let processHelperByKeyProcess = processHelperValue(trim);
  if (processHelperByKeyProcess) {
    let processHelperByKeyValue = processHelperByKeyProcess.src || processHelperByKeyProcess.url;
    return localMap.has(processHelperByKeyProcess.name) || (valueRaw.push({
      name: processHelperByKeyProcess.name,
      src: processHelperByKeyValue
    }), localMap.set(processHelperByKeyProcess.name, processHelperByKeyValue)), processHelperByKeyValue;
  }
  if (/^(blob:|data:|https?:|\.\/|\/)/i.test(trim)) return trim;
  return /^[a-z][a-z0-9+.-]*:/i.test(trim) ? '' : localValueCurrent + encodeURIComponent(trim);
}
function computeHelperList(computeHelperListArg, computeHelperListArgValue) {
  for (let [computeValueSecondary, computeSecondary] of localMap) if (computeSecondary === computeHelperListArg) return computeValueSecondary;
  return computeHelperListArgValue || String(computeHelperListArg).split('/').pop();
}
function joinHelper(joinArg) {
  if (!joinArg.length) return '';
  let joinMax = Math.max(...joinArg),
    joinHelperMin = Math.min(...joinArg),
    joinValue = Math.max(1, joinMax - joinHelperMin);
  return joinArg.map(joinArgValue => localStage[Math.min(7, Math.round((joinArgValue - joinHelperMin) / joinValue * 7))]).join('');
}
function handleRaw(handleRawFlag) {
  return handleRawFlag ? handleRawFlag < 1048576 ? (handleRawFlag / 1024).toFixed(0) + " KB" : (handleRawFlag / 1048576).toFixed(1) + " MB" : "0 MB";
}
function helperEnd() {
  return !!(debugmodetogEl && debugmodetogEl.checked);
}
function renderHelperMap(store) {
  try {
    return localStorage.getItem(store.store);
  } catch {
    return null;
  }
}
function applyStart(applyStore, applyStartArg) {
  try {
    localStorage.setItem(applyStore.store, applyStartArg);
  } catch {}
}
function getHelperEl(getStore) {
  if (getStore.store) {
    let getRender = renderHelperMap(getStore);
    return getRender === null ? getStore.def : getStore.kind === "bool" ? getRender === '1' : getRender;
  }
  return renderer ? getStore.get(renderer) : getStore.def;
}
function refHelperList() {
  let refHelperListRecord = {};
  if (renderer && renderer.programs) for (let refDefinition of renderer.programs.values()) {
    let refHelperListValue = refDefinition.definition && refDefinition.definition.category || "other";
    refHelperListRecord[refHelperListValue] = (refHelperListRecord[refHelperListValue] || 0) + 1;
  }
  return refHelperListRecord;
}
function omId() {
  return "om" + Math.random().toString(36).slice(2, 9);
}
function omAddNull() {
  return omAddSimple("nullobj", "Objek Null");
}
function omEven(omevenCondition) {
  omevenCondition = Math.max(2, Math.round(omevenCondition));
  return omevenCondition % 2 ? omevenCondition + 1 : omevenCondition;
}
function omSizeFromRatio(ratioKey, resN) {
  const omsizefromraValue = OM_RATIOS[ratioKey] || [16, 9];
  return omsizefromraValue[0] >= omsizefromraValue[1] ? {
    w: omEven(resN * omsizefromraValue[0] / omsizefromraValue[1]),
    h: omEven(resN)
  } : {
    w: omEven(resN),
    h: omEven(resN * omsizefromraValue[1] / omsizefromraValue[0])
  };
}
function omNewId() {
  const omnewidText = "ABCDEFghijklmnopqrstuvwxyz0123456789";
  const omnewidBytes = new Uint8Array(22);
  crypto.getRandomValues(omnewidBytes);
  let omNewIdText = "";
  for (let omNewIdNumber = 0; omNewIdNumber < omnewidBytes.length; omNewIdNumber++) omNewIdText += omnewidText[omnewidBytes[omNewIdNumber] % omnewidText.length];
  return omNewIdText;
}
function omPass() {
  try {
    return sessionStorage.getItem("om_pass_" + omProjectId) || "";
  } catch (omPassValue) {
    return "";
  }
}
async function omUploadFile(file, customName) {
  if (!file) return null;
  try {
    const id = omEnsureId();
    const upName = customName || file.name;
    const omUploadFileOk = await fetch("/api/project/" + id + "/upload?name=" + encodeURIComponent(upName), {
      method: "POST",
      body: file
    });
    if (!omUploadFileOk.ok) return null;
    return await omUploadFileOk.json();
  } catch (omUploadFileValue) {
    return null;
  }
}
function eAHelper(eAHelperFlag) {
  return String(eAHelperFlag == null ? "" : eAHelperFlag).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function omHexFrom(omHexFromArg) {
  const omhexfromCallback = toCondition => Math.round(Math.max(0, Math.min(1, toCondition == null ? 1 : toCondition)) * 255).toString(16).padStart(2, "0");
  if (typeof omHexFromArg === "string") return omHexFromArg;
  if (!omHexFromArg) return "#ff000000";
  return "#" + omhexfromCallback(omHexFromArg[3]) + omhexfromCallback(omHexFromArg[0]) + omhexfromCallback(omHexFromArg[1]) + omhexfromCallback(omHexFromArg[2]);
}
function omEffectXml(omEffectXmlParams) {
  const props = (omEffectXmlParams.params || []).map(propsCondition => omProp(propsCondition.id, propsCondition.dataType, propsCondition.channel ? {
    dataType: propsCondition.dataType,
    channel: propsCondition.channel
  } : propsCondition)).join("");
  return `<effect id="${eAHelper(omEffectXmlParams.id)}" locallyApplied="${omEffectXmlParams.locallyApplied !== false}"${omEffectXmlParams.hidden ? ' hidden="true"' : ""}>${props}</effect>`;
}
function omSerializeScene() {
  return '<?xml version=\'1.0\' encoding=\'UTF-8\' ?>' + omSceneXmlInner(projectScene);
}
function omRestoreMediaUploads(omRestoreMediaUploadsArg) {
  (omRestoreMediaUploadsArg || []).forEach(omRestoreMediaUploadsUri => {
    if (omRestoreMediaUploadsUri.uri && omRestoreMediaUploadsUri.name && omRestoreMediaUploadsUri.url) {
      localRaw.set(omRestoreMediaUploadsUri.name, {
        name: omRestoreMediaUploadsUri.name,
        src: omRestoreMediaUploadsUri.url
      }), localNodePending.push(localRaw.get(omRestoreMediaUploadsUri.name)), localValue.includes(omRestoreMediaUploadsUri.name) || localValue.push(omRestoreMediaUploadsUri.name), map.set(omRestoreMediaUploadsUri.uri, omRestoreMediaUploadsUri.name);
    }
  });
}
function omLayerCur() {
  return omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null;
}
function omHasAudioLayer(omHasAudioLayerTag) {
  return !!omHasAudioLayerTag && (omHasAudioLayerTag.tag === "audio" || !!omHasAudioLayerTag.fillVideo || !!omHasAudioLayerTag.src);
}
function omFxParamDef(entry, omFxParamDefArg) {
  if (!entry || !entry.xml) return null;
  const omfxparamdefValue = new RegExp('<param\\s+[^>]*\\bid="' + omFxParamDefArg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"[^>]*>', 'i').exec(entry.xml) || new RegExp('<' + '[a-z]+[^>]*\\bid="' + omFxParamDefArg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"[^>]*/?>', 'i').exec(entry.xml);
  if (!omfxparamdefValue) return null;
  const matchAll = omfxparamdefValue[0];
  return {
    min: matchAll.match(/min="(-?[\d.]+)"/) ? Number(RegExp.$1) : 0,
    max: matchAll.match(/max="(-?[\d.]+)"/) ? Number(RegExp.$1) : 100,
    step: matchAll.match(/step="(-?[\d.]+)"/) ? Number(RegExp.$1) : 0.01,
    choices: [...(matchAll.matchAll(/<choice\s+value="([^"]*)"/g) || [])].map(omFxParamDefArgValue => omFxParamDefArgValue[1]),
    pc: /\btype="percent"/.test(matchAll),
    deg: /\btype="angle"/.test(matchAll)
  };
}
function sceneSnapshot() {
  if (!projectScene) return null;
  try {
    return structuredClone(projectScene);
  } catch (sceneSnapshotValue) {
    try {
      return JSON.parse(JSON.stringify(projectScene));
    } catch (sceneSnapshotResult) {
      return null;
    }
  }
}
function pushUndo(snap) {
  if (!snap) return;
  undoStack.push(snap), undoStack.length > 60 && undoStack.shift(), redoStack.length = 0, omScheduleSave();
}
function undoScene() {
  if (!undoStack.length) return appendLog("[UNDO] tidak ada langkah untuk dibatalkan");
  const undoSceneSnapshot = sceneSnapshot(), prev = undoStack.pop();
  undoSceneSnapshot && redoStack.push(undoSceneSnapshot), applySceneSnapshot(prev), appendLog("[UNDO] batalkan (" + undoStack.length + " tersisa)");
}
function redoScene() {
  if (!redoStack.length) return appendLog("[REDO] tidak ada langkah untuk diulang");
  const redoSceneSnapshot = sceneSnapshot(), next = redoStack.pop();
  redoSceneSnapshot && undoStack.push(redoSceneSnapshot), applySceneSnapshot(next), appendLog("[REDO] ulangi (" + redoStack.length + " tersisa)");
}
async function updateHelperMin(updateUri, updateHelperMinArg) {
  map.set(updateUri.uri, updateHelperMinArg), await applyHelperRaw(updateHelperMinArg);
}
function buildHelperMin(buildHelperMinFlag) {
  let buildHelperMinUrl = new URL(location.href);
  buildHelperMinFlag ? buildHelperMinUrl.searchParams.set("mode", "simple") : buildHelperMinUrl.searchParams.delete("mode"), location.href = buildHelperMinUrl.toString();
}
function omMultiToggle(id) {
  if (!id) return;
  omMulti.has(id) ? omMulti.delete(id) : omMulti.add(id);
  omMultiRefresh();
}
function omMultiClear() {
  omMulti.clear(), omMultiRefresh();
}
function omMultiIds() {
  return [...omMulti];
}
function omEnterGroup(groupLayer) {
  const omentergroupValue = groupLayer || omLayerCur();
  if (!omentergroupValue || !getHelper(omentergroupValue)) return;
  computeHelperParsed(omentergroupValue);
  if (typeof window.omOnGroupStateChanged === "function") window.omOnGroupStateChanged(localList.length, join());
}
function omExitGroup() {
  if (!localList.length) return;
  onclick();
  if (typeof window.omOnGroupStateChanged === "function") window.omOnGroupStateChanged(localList.length, join());
}
export { applyClamped, applyFail, applyHelper, applyHelperByKey, applyHelperClamped, applyHelperEnd, applyHelperLocal, applyHelperMax, applyHelperParsed, applyInner, applyOuter, applyStart, arrHelper, buildHelper, buildHelperByIndex, buildHelperByKey, buildHelperClamped, buildHelperEnd, buildHelperList, buildHelperMax, buildHelperMin, buildHelperScoped, buildHelperValue, buildRaw, computeHelper, computeHelperEnd, computeHelperInner, computeHelperList, computeHelperLocal, computeHelperMax, computeHelperOuter, computeHelperRaw, computeHelperStart, eAHelper, fail, flagHelperValue, getHelperEl, getHelperInner, getHelperMax, getHelperOuter, handleHelperClamped, handleHelperMax, handleHelperMin, handleHelperParsed, handleRaw, helperByKey, helperEnd, itemsHelper, itemsHelperValue, joinHelper, nHelperValue, objHelperEl, objHelperEnd, objHelperInner, objHelperLocal, objHelperScoped, omAddNull, omEffectXml, omEnterGroup, omEven, omExitGroup, omFxParamDef, omHasAudioLayer, omHexFrom, omId, omLayerCur, omMultiClear, omMultiIds, omMultiToggle, omNewId, omPass, omRestoreMediaUploads, omSerializeScene, omSizeFromRatio, omUploadFile, onclick, processClamped, processHelperByKey, processHelperClamped, processHelperInner, processHelperRaw, processHelperValue, processParsed, pushUndo, redoScene, refFail, refHelperByIndex, refHelperEl, refHelperInner, refHelperList, refHelperLocal, refHelperScoped, renderHelper, renderHelperMap, renderHelperRaw, resFail, resHelper, resHelperRaw, sceneSnapshot, undoScene, updateHelper, updateHelperByKey, updateHelperEl, updateHelperInner, updateHelperMin, updateHelperRaw, updateHelperTotal };
