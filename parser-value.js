import { applyHelperEnd, buildHelper, computeHelperOuter, renderHelperRaw, resHelper } from './engine-core.js';
import { expfpsEl, expfpscustomEl, fpscustomEl, fpstargetEl, lastIndex, localMax, localNested } from './state.js';
import { failHelper } from './export-ffmpeg.js';
function parseNumberList(parsenumberlValue) {
  return parsenumberlValue == null ? [] : String(parsenumberlValue).trim().split(/[,\s]+/).map(parseNumberListArg => parseFloat(parseNumberListArg)).filter(parseNumberListArgValue => !Number.isNaN(parseNumberListArgValue));
}
function cyclicEase(cyclicEaseArgLocal, cyclicEaseFlag, cyclicEaseArg, cyclicEaseArgValue, cyclicEaseArgRaw = 0) {
  let cyclicEaseRaw = Number.isFinite(cyclicEaseArgLocal) ? cyclicEaseArgLocal : 0.5,
    cyclicEaseMax = Math.max(cyclicEaseRaw, 0.001),
    cyclicEaseValueParsed = Number.isFinite(cyclicEaseFlag) ? cyclicEaseFlag : 0,
    cyclicEaseValue = Number.isFinite(cyclicEaseArg) ? cyclicEaseArg : 0.5,
    cyclicEaseValueRaw = Number.isFinite(cyclicEaseArgValue) ? cyclicEaseArgValue : 0,
    cyclicEaseValueScoped = cyclicEaseArgParsed => cyclicEaseArgParsed % cyclicEaseMax / cyclicEaseMax,
    cyclicEaseParsed = cyclicEaseArgClamped => 1 - (Math.cos(cyclicEaseArgClamped / cyclicEaseMax * Math.PI * 2) + 1) / 2,
    cyclicEaseValueClamped = cyclicEaseArgScoped => 1 - Math.abs(cyclicEaseValueScoped(cyclicEaseArgScoped) - 0.5) * 2,
    cyclicEaseClamped = cyclicEaseLocal => {
      let fnCallback = cyclicEaseValueScoped(cyclicEaseLocal),
        cyclicEaseNumber = 0.5;
      return fnCallback < cyclicEaseValue ? cyclicEaseNumber = 0.5 * fnCallback / (cyclicEaseValue || 0.000001) : fnCallback > cyclicEaseValue && (cyclicEaseNumber = 0.5 + (fnCallback - cyclicEaseValue) / (1 - cyclicEaseValue || 0.000001) / 2), cyclicEaseLocal - fnCallback * cyclicEaseMax + cyclicEaseMax * cyclicEaseNumber;
    };
  return cyclicEaseScoped => {
    let cyclicEaseFnCallback = cyclicEaseClamped(cyclicEaseScoped),
      cyclicEaseRender = renderHelperRaw(cyclicEaseParsed(cyclicEaseFnCallback), cyclicEaseValueClamped(cyclicEaseFnCallback), cyclicEaseValueParsed),
      cyclicEaseResult = cyclicEaseScoped - cyclicEaseScoped % cyclicEaseMax;
    return cyclicEaseMax / 4 + cyclicEaseResult > 1 ? cyclicEaseRender = 0 : cyclicEaseMax / 2 + cyclicEaseResult < 1 && cyclicEaseResult + cyclicEaseMax * 3 / 4 > 1 && cyclicEaseValueScoped(cyclicEaseScoped) > cyclicEaseValue && (cyclicEaseRender = 1), cyclicEaseRender * (1 - cyclicEaseScoped * cyclicEaseValueRaw) + cyclicEaseScoped * cyclicEaseValueRaw;
  };
}
function stepEase(stepEaseArg, stepEaseFlag) {
  let stepEaseValue = Number.isFinite(stepEaseArg) && stepEaseArg > 0.000001 ? stepEaseArg : 0.25,
    stepEaseValueRaw = Number.isFinite(stepEaseFlag) ? stepEaseFlag : 0;
  return stepEaseArgValue => {
    let stepEaseResult = stepEaseArgValue % stepEaseValue;
    return stepEaseArgValue - stepEaseResult + applyHelperEnd(stepEaseValue - stepEaseValueRaw * stepEaseValue, stepEaseValue, stepEaseResult) * stepEaseValue;
  };
}
function randomEase(randomEaseArgScoped, randomEaseFlag, randomEaseArgValue, randomEaseArgRaw, randomEaseArgParsed, randomEaseArgClamped) {
  let randomEaseRaw = Number.isFinite(randomEaseArgScoped) ? randomEaseArgScoped : 0.5,
    randomEaseScoped = Number.isFinite(randomEaseFlag) ? randomEaseFlag : 0.5,
    randomEaseValueParsed = Number.isFinite(randomEaseArgValue) ? randomEaseArgValue : 0.5,
    randomEaseResult = Number.isFinite(randomEaseArgRaw) ? randomEaseArgRaw : 0.5,
    randomEaseValueRaw = Number.isFinite(randomEaseArgParsed) ? randomEaseArgParsed : 0.5,
    randomEaseValueLocal = Number.isFinite(randomEaseArgClamped) ? randomEaseArgClamped : 0.5,
    randomEaseOuter = 1 - Math.abs(1 - randomEaseScoped),
    randomEaseParsed = Math.abs(randomEaseResult - 0.5) * 2,
    randomEaseValueClamped = Math.abs(randomEaseValueRaw - 0.5) * 2;
  return randomEaseArg => {
    let randomEaseLocal = randomEaseArg * 2 - 1,
      randomEaseClamped = 1 - Math.pow(Math.abs(randomEaseLocal), 3),
      randomEaseValueOuter = randomEaseClamped * computeHelperOuter(randomEaseRaw * 30 * randomEaseArg, randomEaseValueParsed * 10) * randomEaseOuter + randomEaseClamped * computeHelperOuter(randomEaseRaw * 60 * randomEaseArg, randomEaseValueParsed * 10 + 23453.234534) * randomEaseOuter * 0.5,
      randomEaseValueScoped = randomEaseResult > 0.5 ? renderHelperRaw(1, 1 - randomEaseArg, randomEaseParsed) : randomEaseResult < 0.5 ? renderHelperRaw(1, randomEaseArg, randomEaseParsed) : 1,
      randomEaseValue = randomEaseArg;
    return randomEaseValueRaw < 0.5 ? randomEaseValue = Math.pow(randomEaseArg, randomEaseValueClamped * 5 + 1) : randomEaseValueRaw > 0.5 && (randomEaseValue = 1 - Math.pow(1 - randomEaseArg, randomEaseValueClamped * 5 + 1)), renderHelperRaw(randomEaseValue, 1 - randomEaseValue, randomEaseValueLocal) + randomEaseValueOuter * randomEaseValueScoped * randomEaseValueScoped;
  };
}
function refHelperStart(refArgByKey) {
  let refHelperStartList = [];
  if (!refArgByKey) return refHelperStartList;
  let pathTokens = [],
    refMax;
  for (lastIndex.lastIndex = 0; (refMax = lastIndex.exec(refArgByKey)) !== null;) pathTokens.push(refMax[1] ? refMax[1] : parseFloat(refMax[2]));
  let refHelperStartRecord = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      C: 6,
      S: 4,
      Q: 4,
      T: 2,
      A: 7
    },
    refHelperStartNumber = 0,
    refFlag = null,
    refHelperStartText = '',
    currentX = 0,
    currentY = 0,
    subpathStartX = 0,
    subpathStartY = 0,
    previousControlX = 0,
    previousControlY = 0,
    refHelperStartValueRaw = () => typeof pathTokens[refHelperStartNumber] == "number" ? pathTokens[refHelperStartNumber++] : 0;
  for (; refHelperStartNumber < pathTokens.length;) {
    if (typeof pathTokens[refHelperStartNumber] == "string") refFlag = pathTokens[refHelperStartNumber++];else {
      if (refFlag) refFlag === 'M' ? refFlag = 'L' : refFlag === 'm' && (refFlag = 'l');else {
        refHelperStartNumber++;
        continue;
      }
    }
    let toUpperCase = refFlag.toUpperCase(),
      refHelperStartValue = refFlag !== toUpperCase;
    if (toUpperCase === 'Z') {
      refHelperStartList.push(['Z']), currentX = subpathStartX, currentY = subpathStartY, refHelperStartText = 'Z';
      continue;
    }
    let refAnother = refHelperStartRecord[toUpperCase] || 0,
      commandArgs = [];
    for (let argIndex = 0; argIndex < refAnother; argIndex++) commandArgs.push(refHelperStartValueRaw());
    switch (toUpperCase) {
      case 'M':
        currentX = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0], currentY = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1], subpathStartX = currentX, subpathStartY = currentY, refHelperStartList.push(['M', currentX, currentY]);
        break;
      case 'L':
        currentX = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0], currentY = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1], refHelperStartList.push(['L', currentX, currentY]);
        break;
      case 'H':
        currentX = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0], refHelperStartList.push(['L', currentX, currentY]);
        break;
      case 'V':
        currentY = refHelperStartValue ? currentY + commandArgs[0] : commandArgs[0], refHelperStartList.push(['L', currentX, currentY]);
        break;
      case 'C':
        {
          let refValueFinal = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0],
            refFinal = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1],
            refValueTotal = refHelperStartValue ? currentX + commandArgs[2] : commandArgs[2],
            refTotal = refHelperStartValue ? currentY + commandArgs[3] : commandArgs[3],
            refValueCurrent = refHelperStartValue ? currentX + commandArgs[4] : commandArgs[4],
            refCurrent = refHelperStartValue ? currentY + commandArgs[5] : commandArgs[5];
          refHelperStartList.push(['C', refValueFinal, refFinal, refValueTotal, refTotal, refValueCurrent, refCurrent]), previousControlX = refValueTotal, previousControlY = refTotal, currentX = refValueCurrent, currentY = refCurrent;
          break;
        }
      case 'S':
        {
          let refValueInitial = refHelperStartText === 'C' || refHelperStartText === 'S' ? 2 * currentX - previousControlX : currentX,
            refInitial = refHelperStartText === 'C' || refHelperStartText === 'S' ? 2 * currentY - previousControlY : currentY,
            refValueNext = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0],
            refNext = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1],
            refValuePrev = refHelperStartValue ? currentX + commandArgs[2] : commandArgs[2],
            refPrev = refHelperStartValue ? currentY + commandArgs[3] : commandArgs[3];
          refHelperStartList.push(['C', refValueInitial, refInitial, refValueNext, refNext, refValuePrev, refPrev]), previousControlX = refValueNext, previousControlY = refNext, currentX = refValuePrev, currentY = refPrev;
          break;
        }
      case 'Q':
        {
          let refValueByKey = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0],
            refByKey = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1],
            refValueLocal = refHelperStartValue ? currentX + commandArgs[2] : commandArgs[2],
            refLocal = refHelperStartValue ? currentY + commandArgs[3] : commandArgs[3];
          refHelperStartList.push(['C', currentX + 2 / 3 * (refValueByKey - currentX), currentY + 2 / 3 * (refByKey - currentY), refValueLocal + 2 / 3 * (refValueByKey - refValueLocal), refLocal + 2 / 3 * (refByKey - refLocal), refValueLocal, refLocal]), previousControlX = refValueByKey, previousControlY = refByKey, currentX = refValueLocal, currentY = refLocal;
          break;
        }
      case 'T':
        {
          let refValueByIndex = refHelperStartText === 'Q' || refHelperStartText === 'T' ? 2 * currentX - previousControlX : currentX,
            refByIndex = refHelperStartText === 'Q' || refHelperStartText === 'T' ? 2 * currentY - previousControlY : currentY,
            refValueOuter = refHelperStartValue ? currentX + commandArgs[0] : commandArgs[0],
            refOuter = refHelperStartValue ? currentY + commandArgs[1] : commandArgs[1];
          refHelperStartList.push(['C', currentX + 2 / 3 * (refValueByIndex - currentX), currentY + 2 / 3 * (refByIndex - currentY), refValueOuter + 2 / 3 * (refValueByIndex - refValueOuter), refOuter + 2 / 3 * (refByIndex - refOuter), refValueOuter, refOuter]), previousControlX = refValueByIndex, previousControlY = refByIndex, currentX = refValueOuter, currentY = refOuter;
          break;
        }
      case 'A':
        {
          let refValueSource = refHelperStartValue ? currentX + commandArgs[5] : commandArgs[5],
            refSource = refHelperStartValue ? currentY + commandArgs[6] : commandArgs[6];
          refHelperStartList.push(['L', refValueSource, refSource]), currentX = refValueSource, currentY = refSource;
          break;
        }
      default:
        break;
    }
    refHelperStartText = toUpperCase, toUpperCase !== 'C' && toUpperCase !== 'S' && toUpperCase !== 'Q' && toUpperCase !== 'T' && (previousControlX = currentX, previousControlY = currentY);
  }
  return refHelperStartList;
}
function refHelperEnd(refArgByIndex) {
  let refHelperEndList = [];
  if (!refArgByIndex) return refHelperEndList;
  for (let refValuePending of String(refArgByIndex).split(';')) {
    let trim = refValuePending.trim();
    if (!trim) continue;
    let refRaw = trim.split(',').map(refArgMap => parseFloat(refArgMap));
    if (refRaw.length < 2 || !Number.isFinite(refRaw[0]) || !Number.isFinite(refRaw[1])) continue;
    let refPending = Number.isFinite(refRaw[2]) ? refRaw[2] : 1;
    refHelperEndList.push([refRaw[0], refRaw[1], refPending]);
  }
  return refHelperEndList;
}
function maxHelperRaw(maxTag, maxValue) {
  if (!maxTag || (maxTag.tag !== "audio" && maxTag.tag !== "video" && maxTag.fillType !== "media")) return 0;
  let maxValueRaw = Number(maxValue) || 0;
  if (maxValueRaw < maxTag.startTime || maxValueRaw >= maxTag.endTime) return 0;
  let maxValueParsed = maxTag.endTime - maxTag.startTime,
    maxParsed = maxValueParsed > 0 ? Math.max(0, Math.min(1, (maxValueRaw - maxTag.startTime) / maxValueParsed)) : 0,
    maxBuild = buildHelper(maxTag.gain, maxParsed);
  return Math.max(0, Math.min(5, Number.isFinite(maxBuild) ? maxBuild : 1));
}
function renderHelperMax(defaultValue) {
  let renderDefaultValue = defaultValue.defaultValue;
  if (defaultValue.type === "point" || defaultValue.type === "vec2" || defaultValue.type === "size" || defaultValue.type === "offset") {
    let renderValueClamped = String(renderDefaultValue || "0,0").split(',').map(renderArgByIndex => parseFloat(renderArgByIndex));
    return {
      x: Number.isFinite(renderValueClamped[0]) ? renderValueClamped[0] : 0,
      y: Number.isFinite(renderValueClamped[1]) ? renderValueClamped[1] : 0
    };
  }
  if (defaultValue.type === "switch" || defaultValue.type === "bool") return renderDefaultValue === "true" || renderDefaultValue === '1';
  if (defaultValue.type === "color") return {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
  let renderHelperMaxParseFloat = parseFloat(renderDefaultValue);
  return Number.isFinite(renderHelperMaxParseFloat) ? renderHelperMaxParseFloat : 0;
}
function applyHelperMin(applyArgStart, applyArgRaw, applyX) {
  let applyColor = applyArgStart.type;
  return applyColor === "point" || applyColor === "vec2" || applyColor === "size" || applyColor === "offset" ? ((!applyX || typeof applyX != "object" || applyX.x === void 0) && (applyX = {
    x: 0,
    y: 0
  }), applyX.x = applyArgRaw[0] || 0, applyX.y = applyArgRaw[1] || 0, applyX) : applyColor === "color" ? ((!applyX || typeof applyX != "object" || applyX.r === void 0) && (applyX = {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  }), applyX.r = applyArgRaw[0] || 0, applyX.g = applyArgRaw[1] || 0, applyX.b = applyArgRaw[2] || 0, applyX.a = applyArgRaw[3] === void 0 ? 1 : applyArgRaw[3], applyX) : applyColor === "switch" || applyColor === "bool" ? !!applyArgRaw[0] : Number.isFinite(applyArgRaw[0]) ? applyArgRaw[0] : 0;
}
function helperByIndex(refArgClamped) {
  let helperByIndexList = [];
  if (!refArgClamped || !refArgClamped.length) return helperByIndexList;
  let helperByIndexRefValue = null,
    refValueStart = null,
    refValueRaw = null,
    refValueEl = null,
    refStart = false;
  for (let closed of refArgClamped) {
    if (!closed) continue;
    if (closed.closed) {
      if (refStart && refValueRaw) {
        let helperByIndexValue = refValueStart || helperByIndexRefValue,
          refValueEnd = refValueEl || refValueRaw;
        (helperByIndexValue[0] !== helperByIndexRefValue[0] || helperByIndexValue[1] !== helperByIndexRefValue[1] || refValueEnd[0] !== refValueRaw[0] || refValueEnd[1] !== refValueRaw[1]) && helperByIndexList.push(['C', helperByIndexValue[0], helperByIndexValue[1], refValueEnd[0], refValueEnd[1], refValueRaw[0], refValueRaw[1]]), helperByIndexList.push(['Z']);
      }
      helperByIndexRefValue = null, refValueStart = null, refValueRaw = null, refValueEl = null, refStart = false;
      continue;
    }
    let refText = null,
      refEl = null,
      refValueAlternate = null;
    if (Array.isArray(closed) ? refText = [closed[0], closed[1]] : (closed.p ? refText = [closed.p[0], closed.p[1]] : closed.x !== void 0 && (refText = [closed.x, closed.y]), closed.in && (refEl = [closed.in[0], closed.in[1]]), closed.out && (refValueAlternate = [closed.out[0], closed.out[1]])), !(!refText || !Number.isFinite(refText[0]) || !Number.isFinite(refText[1]))) {
      if (!refStart) helperByIndexList.push(['M', refText[0], refText[1]]), refStart = true, refValueRaw = refText, refValueEl = refEl;else {
        let refEnd = refValueStart || helperByIndexRefValue,
          refValueMin = refEl || refText;
        refEnd[0] === helperByIndexRefValue[0] && refEnd[1] === helperByIndexRefValue[1] && refValueMin[0] === refText[0] && refValueMin[1] === refText[1] ? helperByIndexList.push(['L', refText[0], refText[1]]) : helperByIndexList.push(['C', refEnd[0], refEnd[1], refValueMin[0], refValueMin[1], refText[0], refText[1]]);
      }
      helperByIndexRefValue = refText, refValueStart = refValueAlternate;
    }
  }
  return helperByIndexList;
}
function handleHelperLocal(handleEnabled) {
  if (!handleEnabled || !handleEnabled.enabled) return null;
  let handleHelperLocalList = [],
    handleValueInner = !!handleEnabled.overdrawCapOn,
    handleValueRaw = handleValueInner ? Math.max(0, Math.min(0.5, Number(handleEnabled.overdrawCap))) : 1 / 0;
  handleValueInner && Number.isFinite(handleValueRaw) && handleHelperLocalList.push("overdraw<=" + handleValueRaw);
  let skip = handleEnabled.categoryMode === "only" || handleEnabled.categoryMode === "skip" ? handleEnabled.categoryMode : "off",
    handleHelperLocalSet = new Set(Array.isArray(handleEnabled.categorySet) ? handleEnabled.categorySet : []),
    handleHelperLocalValue = skip !== "off" && (skip === "skip" ? handleHelperLocalSet.size > 0 : true);
  handleHelperLocalValue && handleHelperLocalList.push("kategori " + skip + ':\x20' + ([...handleHelperLocalSet].join(',') || "(kosong)"));
  let handleValueParsed = Number(handleEnabled.domainBucket) || 0;
  handleValueParsed > 0 && handleHelperLocalList.push("bucket " + handleValueParsed + 'px'), handleEnabled.invalidateTargets && handleHelperLocalList.push("invalidate");
  let handleInner = handleEnabled.fragPrecision === "mediump" ? "mediump" : "highp";
  return handleInner === "mediump" && handleHelperLocalList.push("mediump"), handleEnabled.profiler && handleHelperLocalList.push("profiler"), handleHelperLocalList.length ? Object.freeze({
    profiler: !!handleEnabled.profiler,
    overdrawCap: handleValueRaw,
    categoryMode: handleHelperLocalValue ? skip : "off",
    categorySet: handleHelperLocalSet,
    invalidate: !!handleEnabled.invalidateTargets,
    bucket: handleValueParsed,
    fragPrecision: handleInner,
    active: handleHelperLocalList
  }) : null;
}
function getHelperMin() {
  let getHelperMinNumber = 192;
  try {
    let getNumber = Number(globalThis.navigator && globalThis.navigator.deviceMemory);
    Number.isFinite(getNumber) && getNumber > 0 && (getHelperMinNumber = getNumber <= 2 ? 128 : getNumber <= 4 ? 192 : 256);
  } catch {}
  return getHelperMinNumber * 1048576;
}
function updateHelperScoped(updateArg, updateHelperScopedArgValue, updateArgEnd, updateHelperScopedArg, updateArgRaw, updateHelperScopedFlag = 0, updateArgParsed = 0, updateArgClamped = 0) {
  let updateMax = Math.max(0, Number.isFinite(updateHelperScopedFlag) ? updateHelperScopedFlag : 0),
    updateValueInner = updateHelperScopedArgValue * (1 + updateMax * 2) / 2,
    updateInner = updateArgEnd * (1 + updateMax * 2) / 2,
    updateList = updateArg[0],
    updateValueMap = updateArg[1],
    updateMap = updateArg[2],
    updateValueCount = updateArg[3],
    updateCount = updateArg[4],
    updateValueTotal = updateArg[5],
    updateValue = 1 / 0,
    updateHelperScopedUpdateValue = 1 / 0,
    updateRaw = -1 / 0,
    updateValueRaw = -1 / 0;
  for (let updateHelperScopedNumber = 0; updateHelperScopedNumber < 4; updateHelperScopedNumber++) {
    let updateStart = updateHelperScopedNumber & 1 ? updateValueInner : -updateValueInner,
      updateValueEnd = updateHelperScopedNumber & 2 ? updateInner : -updateInner,
      updateParsed = updateList * updateStart + updateMap * updateValueEnd + updateCount,
      updateValueClamped = updateValueMap * updateStart + updateValueCount * updateValueEnd + updateValueTotal;
    updateParsed < updateValue && (updateValue = updateParsed), updateParsed > updateRaw && (updateRaw = updateParsed), updateValueClamped < updateHelperScopedUpdateValue && (updateHelperScopedUpdateValue = updateValueClamped), updateValueClamped > updateValueRaw && (updateValueRaw = updateValueClamped);
  }
  updateValue = Math.max(Math.floor(updateValue), Math.floor(-updateArgParsed)), updateHelperScopedUpdateValue = Math.max(Math.floor(updateHelperScopedUpdateValue), Math.floor(-updateArgClamped)), updateRaw = Math.min(Math.ceil(updateRaw), Math.ceil(updateHelperScopedArg + updateArgParsed)), updateValueRaw = Math.min(Math.ceil(updateValueRaw), Math.ceil(updateArgRaw + updateArgClamped));
  let updateValueStart = !(updateRaw > updateValue && updateValueRaw > updateHelperScopedUpdateValue);
  return updateValueStart && (updateRaw = updateValue + 1, updateValueRaw = updateHelperScopedUpdateValue + 1), {
    x: updateValue,
    y: updateHelperScopedUpdateValue,
    w: updateRaw - updateValue,
    h: updateValueRaw - updateHelperScopedUpdateValue,
    empty: updateValueStart,
    origin: [updateValue / updateHelperScopedArg, (updateArgRaw - updateValueRaw) / updateArgRaw],
    size: [(updateRaw - updateValue) / updateHelperScopedArg, (updateValueRaw - updateHelperScopedUpdateValue) / updateArgRaw]
  };
}
function objHelperByIndex(inTime, objHelperByIndexArg) {
  let objTotal = Math.max(0, Number(inTime.inTime) || 0),
    objValueCurrent = Number(inTime.outTime) || 0,
    objValuePrimary = objValueCurrent > objTotal,
    objPrimary = Number.isFinite(objHelperByIndexArg) && objHelperByIndexArg > 0,
    objValueSecondary = objValuePrimary ? objValueCurrent : objPrimary ? objHelperByIndexArg * 1000 : 1 / 0;
  return {
    startMs: objTotal,
    endMs: objValueSecondary,
    spanMs: Math.max(1, inTime.endTime - inTime.startTime)
  };
}
function renderHelperByKey(renderHelperByKeyFlag, renderCurrentTime, renderArgInner = 5000) {
  return renderHelperByKeyFlag ? new Promise((renderHelperByKeyArg, renderArgEl) => {
    let renderText = false,
      renderHelperByKeyNumber = 0,
      renderClamped = 0,
      renderByKey = 0,
      renderValueByIndex = () => {
        if (clearTimeout(renderHelperByKeyNumber), clearTimeout(renderByKey), renderHelperByKeyFlag.removeEventListener("seeked", renderValueEl), renderHelperByKeyFlag.removeEventListener("loadeddata", renderEl), renderClamped && typeof renderHelperByKeyFlag.cancelVideoFrameCallback == "function") try {
          renderHelperByKeyFlag.cancelVideoFrameCallback(renderClamped);
        } catch {}
        renderClamped = 0;
      },
      renderByIndex = renderArgList => {
        renderText || (renderText = true, renderValueByIndex(), renderArgEl(renderArgList));
      },
      renderLocal = (renderRe = null) => {
        renderText || (renderText = true, renderValueByIndex(), Number.isFinite(renderRe) && (renderHelperByKeyFlag.Re = renderRe), renderHelperByKeyArg());
      },
      renderValueScoped = () => {
        if (!renderText && !(renderHelperByKeyFlag.readyState < 2)) {
          if (typeof renderHelperByKeyFlag.requestVideoFrameCallback == "function") try {
            renderClamped = renderHelperByKeyFlag.requestVideoFrameCallback((renderArgSecondary, renderHelperByKeyMediaTime) => {
              if (renderText) return;
              let renderValueNext = renderHelperByKeyMediaTime && Number.isFinite(renderHelperByKeyMediaTime.mediaTime) ? renderHelperByKeyMediaTime.mediaTime : NaN;
              renderLocal(renderValueNext);
            }), renderByKey = setTimeout(() => {
              renderHelperByKeyFlag.readyState >= 2 && renderLocal();
            }, 100);
            return;
          } catch {}
          renderLocal();
        }
      },
      renderValueEl = () => {
        renderValueScoped();
      },
      renderEl = () => {
        Number.isFinite(renderHelperByKeyFlag.currentTime) && Math.abs(renderHelperByKeyFlag.currentTime - renderCurrentTime) < 0.002 && renderValueScoped();
      };
    if (renderHelperByKeyNumber = setTimeout(() => {
      renderByIndex(new Error("Timeout menunggu frame video pada " + renderCurrentTime.toFixed(3) + 's.'));
    }, renderArgInner), Number.isFinite(renderHelperByKeyFlag.currentTime) && Math.abs(renderHelperByKeyFlag.currentTime - renderCurrentTime) < 0.002 && renderHelperByKeyFlag.readyState >= 2) {
      renderValueScoped();
      return;
    }
    if (Number.isFinite(renderHelperByKeyFlag.currentTime) && Math.abs(renderHelperByKeyFlag.currentTime - renderCurrentTime) < 0.002) {
      renderHelperByKeyFlag.addEventListener("loadeddata", renderEl, {
        once: true
      }), renderHelperByKeyFlag.readyState >= 2 && renderValueScoped();
      return;
    }
    renderHelperByKeyFlag.addEventListener("seeked", renderValueEl, {
      once: true
    });
    try {
      renderHelperByKeyFlag.currentTime = renderCurrentTime;
    } catch (renderPrimary) {
      renderByIndex(renderPrimary);
    }
  }) : Promise.resolve();
}
async function smoothstep({
  url: smoothstepArgStart,
  tracks: smoothstepCondition = null,
  startMs: smoothstepFlag = 0,
  endMs: smoothstepArgRaw,
  rate: smoothstepArgParsed = 1,
  offsetMs: smoothstepArgClamped = 0,
  inTimeMs: smoothstepArgOuter = 0,
  sampleRate: smoothstepArgScoped = localMax,
  channels: smoothstepArgInner = 2,
  onProgress: smoothstepCallback = () => {}
}) {
  if (typeof globalThis.OfflineAudioContext != "function") throw new Error("OfflineAudioContext tidak ada di browser ini");
  let smoothstepEnd = Math.max(0, (smoothstepArgRaw - smoothstepFlag) / 1000),
    smoothstepMax = Math.max(1, Math.round(smoothstepEnd * smoothstepArgScoped)),
    offlineAudioContext = new OfflineAudioContext(smoothstepArgInner, smoothstepMax, smoothstepArgScoped),
    smoothstepValueMin = smoothstepArgEnd => Math.max(0.0625, Math.min(4, Number(smoothstepArgEnd) || 1)),
    smoothstepMap = new Map(),
    smoothstepValueMax = async smoothstepArgValue => {
      if (smoothstepMap.has(smoothstepArgValue)) return smoothstepMap.get(smoothstepArgValue);
      let smoothstepValueOuter = localNested.get(smoothstepArgValue) || (await failHelper(offlineAudioContext, smoothstepArgValue, smoothstepCallback));
      return smoothstepMap.set(smoothstepArgValue, smoothstepValueOuter), smoothstepValueOuter;
    },
    smoothstepLocal = (smoothstepArg, smoothstepArgLocal) => {
      if (!smoothstepArg || !smoothstepArg.length) return 1;
      if (smoothstepArgLocal <= smoothstepArg[0][0]) return smoothstepArg[0][1];
      for (let smoothstepEl = 1; smoothstepEl < smoothstepArg.length; smoothstepEl++) if (smoothstepArgLocal <= smoothstepArg[smoothstepEl][0]) {
        let [smoothstepValueClamped, smoothstepOuter] = smoothstepArg[smoothstepEl - 1],
          [fnNumber, smoothstepFnNumber] = smoothstepArg[smoothstepEl],
          smoothstepByKey = fnNumber === smoothstepValueClamped ? 0 : (smoothstepArgLocal - smoothstepValueClamped) / (fnNumber - smoothstepValueClamped);
        return smoothstepOuter + (smoothstepFnNumber - smoothstepOuter) * smoothstepByKey;
      }
      return smoothstepArg[smoothstepArg.length - 1][1];
    },
    smoothstepValueByKey = Array.isArray(smoothstepCondition) && smoothstepCondition.length ? smoothstepCondition : [{
      url: smoothstepArgStart,
      rate: smoothstepArgParsed,
      offsetMs: smoothstepArgClamped,
      inTimeMs: smoothstepArgOuter,
      layerStartMs: 0,
      layerEndMs: smoothstepArgRaw,
      speed: 1
    }],
    smoothstepNumber = 0,
    smoothstepItems = [];
  for (let smoothstepUrl of smoothstepValueByKey) {
    if (!smoothstepUrl || !smoothstepUrl.url) continue;
    let smoothstepBuffer;
    try {
      smoothstepBuffer = await smoothstepValueMax(smoothstepUrl.url);
    } catch (smoothstepMessage) {
      smoothstepItems.push(String(smoothstepMessage && smoothstepMessage.message || smoothstepMessage)), smoothstepCallback({
        phase: "audio",
        stage: "skip",
        url: smoothstepUrl.url,
        message: "track dilewati: " + String(smoothstepMessage && smoothstepMessage.message || smoothstepMessage)
      });
      continue;
    }
    let smoothstepCallbackValue = smoothstepValueMin((smoothstepUrl.speed || 1) * (smoothstepUrl.rate != null ? smoothstepUrl.rate : smoothstepArgParsed)),
      smoothstepValueRaw = Number.isFinite(smoothstepUrl.layerStartMs) ? smoothstepUrl.layerStartMs : smoothstepFlag,
      smoothstepValueParsed = Number.isFinite(smoothstepUrl.layerEndMs) ? smoothstepUrl.layerEndMs : smoothstepArgRaw,
      smoothstepValue = Number(smoothstepUrl.offsetMs != null ? smoothstepUrl.offsetMs : smoothstepArgClamped) || 0,
      smoothstepValueByIndex = Math.max(0, Number(smoothstepUrl.inTimeMs) || 0),
      smoothstepValueInner = Math.max(smoothstepFlag, smoothstepValueRaw),
      smoothstepMin = Math.min(smoothstepArgRaw, smoothstepValueParsed);
    if (smoothstepMin <= smoothstepValueInner) continue;
    let smoothstepValueEl = smoothstepValueInner,
      smoothstepRaw = smoothstepValueByIndex + (smoothstepValueEl - smoothstepValue - smoothstepValueRaw) * smoothstepCallbackValue;
    if (smoothstepRaw < 0 && (smoothstepValueEl += -smoothstepRaw / smoothstepCallbackValue, smoothstepRaw = 0), smoothstepValueEl >= smoothstepMin) continue;
    let smoothstepClamped = (smoothstepValueEl - smoothstepFlag) / 1000,
      createBufferSource = offlineAudioContext.createBufferSource();
    createBufferSource.buffer = smoothstepBuffer, createBufferSource.playbackRate.value = smoothstepCallbackValue;
    let createGain = offlineAudioContext.createGain();
    createBufferSource.connect(createGain), createGain.connect(offlineAudioContext.destination);
    let smoothstepInner = Array.isArray(smoothstepUrl.gainPoints) && smoothstepUrl.gainPoints.length ? smoothstepUrl.gainPoints : [[0, 1], [1, 1]],
      smoothstepValueStart = smoothstepValueParsed > smoothstepValueRaw ? smoothstepValueParsed - smoothstepValueRaw : 1,
      smoothstepStart = 32;
    for (let smoothstepValueScoped = 0; smoothstepValueScoped <= smoothstepStart; smoothstepValueScoped++) {
      let smoothstepValueEnd = smoothstepValueEl + (smoothstepMin - smoothstepValueEl) * (smoothstepValueScoped / smoothstepStart),
        smoothstepByIndex = Math.min(1, Math.max(0, (smoothstepValueEnd - smoothstepValueRaw) / smoothstepValueStart));
      createGain.gain.setValueAtTime(Math.max(0, Math.min(1, smoothstepLocal(smoothstepInner, smoothstepByIndex))), smoothstepClamped + (smoothstepValueEnd - smoothstepValueEl) / 1000);
    }
    createBufferSource.start(smoothstepClamped, smoothstepRaw / 1000), createBufferSource.stop(smoothstepClamped + (smoothstepMin - smoothstepValueEl) / 1000 + 0.001), smoothstepNumber++, smoothstepCallback({
      phase: "audio",
      stage: "info",
      message: "track " + String(smoothstepUrl.url).slice(-40) + ':\x20' + smoothstepBuffer.duration.toFixed(2) + "s, " + smoothstepBuffer.numberOfChannels + "ch, layer " + (smoothstepValueRaw / 1000).toFixed(1) + '-' + (smoothstepValueParsed / 1000).toFixed(1) + "s, mulai sumber " + (smoothstepRaw / 1000).toFixed(2) + "s, speed " + smoothstepCallbackValue + ", gain@mulai " + smoothstepLocal(smoothstepInner, Math.min(1, Math.max(0, (smoothstepValueEl - smoothstepValueRaw) / smoothstepValueStart))).toFixed(2)
    });
  }
  if (!smoothstepNumber) throw new Error("tidak ada audio yang bisa dicampur" + (smoothstepItems.length ? ':\x20' + smoothstepItems[0] : " (semua track di luar rentang ekspor)"));
  smoothstepCallback({
    phase: "audio",
    stage: "render",
    frames: smoothstepMax,
    decoded: smoothstepMap.size
  });
  let smoothstepNumberOfChannels = await offlineAudioContext.startRendering();
  {
    let smoothstepParsed = 0;
    for (let smoothstepScoped = 0; smoothstepScoped < smoothstepNumberOfChannels.numberOfChannels; smoothstepScoped++) {
      let getChannelData = smoothstepNumberOfChannels.getChannelData(smoothstepScoped);
      for (let smoothstepValueLocal = 0; smoothstepValueLocal < getChannelData.length; smoothstepValueLocal += 7) {
        let abs = Math.abs(getChannelData[smoothstepValueLocal]);
        abs > smoothstepParsed && (smoothstepParsed = abs);
      }
    }
    smoothstepCallback({
      phase: "audio",
      stage: "info",
      message: "hasil campuran: " + smoothstepNumber + " track, puncak amplitudo " + smoothstepParsed.toFixed(3) + (smoothstepParsed < 0.001 ? " (SENYAP)" : '')
    });
  }
  return smoothstepNumberOfChannels;
}
function applyRaw() {
  if (fpstargetEl.value !== "custom") return Number(fpstargetEl.value) || 30;
  let applyRawNumber = Number(fpscustomEl.value);
  return !Number.isFinite(applyRawNumber) || applyRawNumber <= 0 ? 30 : Math.min(120, Math.max(1, applyRawNumber));
}
function renderHelperByIndex(renderChannel, renderHelperByIndexParams, renderHelperByIndexArg) {
  if (!renderChannel || !renderChannel.channel) return '';
  let renderLabel = renderHelperByIndexParams && renderHelperByIndexParams.params.find(renderArgSource => renderArgSource.id === renderChannel.id),
    renderStart = resHelper(renderChannel.channel, renderHelperByIndexArg),
    renderBool = renderChannel.dataType || renderLabel && renderLabel.type || '',
    renderColor;
  return renderBool === "color" ? renderColor = '#' + renderStart.slice(0, 4).map(renderArgTarget => Math.round(Math.max(0, Math.min(255, renderArgTarget * 255))).toString(16).padStart(2, '0')).join('') : renderBool === "bool" ? renderColor = renderStart[0] >= 0.5 ? 'ya' : "tidak" : renderColor = renderStart.filter(renderArgInput => Number.isFinite(renderArgInput)).map(renderArgLocal => Math.abs(renderArgLocal) >= 100 ? renderArgLocal.toFixed(0) : renderArgLocal.toFixed(2)).join(',\x20'), (renderLabel && renderLabel.label ? renderLabel.label : renderChannel.id) + '\x20' + renderColor;
}
function renderHelperOuter(gain, renderHelperOuterArg) {
  if (!gain || gain.gain == null) return 1;
  let renderValueEnd;
  try {
    renderValueEnd = resHelper(gain.gain, renderHelperOuterArg);
  } catch {
    return 1;
  }
  let renderCurrent = Array.isArray(renderValueEnd) ? renderValueEnd[0] : renderValueEnd;
  return Number.isFinite(renderCurrent) ? Math.max(0, renderCurrent) : 1;
}
function applyHelperScoped() {
  if (expfpsEl.value !== "custom") return Number(expfpsEl.value) || 30;
  let applyHelperScopedNumber = Number(expfpscustomEl.value);
  return !Number.isFinite(applyHelperScopedNumber) || applyHelperScopedNumber <= 0 ? 30 : Math.min(120, Math.max(1, applyHelperScopedNumber));
}
function updateHelperClamped(updateHelperClampedArg) {
  if (!Number.isFinite(updateHelperClampedArg) || updateHelperClampedArg < 0) return '-';
  let round = Math.round(updateHelperClampedArg / 1000),
    floor = Math.floor(round / 60),
    updateEl = round % 60;
  return floor ? floor + 'm\x20' + String(updateEl).padStart(2, '0') + 's' : updateEl + 's';
}
export { applyHelperMin, applyHelperScoped, applyRaw, cyclicEase, getHelperMin, handleHelperLocal, helperByIndex, maxHelperRaw, objHelperByIndex, parseNumberList, randomEase, refHelperEnd, refHelperStart, renderHelperByIndex, renderHelperByKey, renderHelperMax, renderHelperOuter, smoothstep, stepEase, updateHelperClamped, updateHelperScoped };
