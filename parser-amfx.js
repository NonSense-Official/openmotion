import { a as parseEffectXml, b as parseAmfxBinary, c as setDefaultPrecision, d as buildParamNameMap, e as buildFragmentShaderSource, f as buildVertexShaderSource, g as buildTransformVertexSource, h as buildBlitFragmentSource, i as compileScriptEffect, j as makeTextState, k as makeTimeEnv, l as buildParamValueMap } from "./chunk.js";
import { badEffects, localByIndex, localStepped, valueInner, valuePrimary } from './state.js';
import { applyFail, applyHelperByKey, refHelperEl } from './engine-core.js';
function getHelperEnd(getHelperEndFlag) {
  localStepped || applyFail("TextDecoder tidak tersedia");
  let buffer = getHelperEndFlag instanceof Uint8Array ? getHelperEndFlag : new Uint8Array(getHelperEndFlag);
  buffer.length < 8 && applyFail("data bentuk terlalu pendek"), (buffer[0] !== valuePrimary[0] || buffer[1] !== valuePrimary[1] || buffer[2] !== valuePrimary[2] || buffer[3] !== valuePrimary[3]) && applyFail("header bentuk tidak dikenal (bukan AMSH)");
  let dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength),
    getHelperEndNumber = 4,
    getUint16 = dataView.getUint16(getHelperEndNumber, true);
  getHelperEndNumber += 2, getUint16 !== 1 && applyFail("versi format bentuk " + getUint16 + " tidak didukung (butuh 1)"), getHelperEndNumber += 2;
  let getUint32 = dataView.getUint32(getHelperEndNumber, true);
  getHelperEndNumber += 4;
  let array = new Array(getUint32);
  for (let getValueOuter = 0; getValueOuter < getUint32; getValueOuter++) {
    let getUint322 = dataView.getUint32(getHelperEndNumber, true);
    getHelperEndNumber += 4, getHelperEndNumber + getUint322 > buffer.length && applyFail("tabel string bentuk terpotong"), array[getValueOuter] = localStepped.decode(buffer.subarray(getHelperEndNumber, getHelperEndNumber + getUint322)), getHelperEndNumber += getUint322;
  }
  let getHelperEndValue = getHelperEndArgValue => {
      getHelperEndNumber + getHelperEndArgValue > buffer.length && applyFail("data bentuk terpotong");
    },
    getParsed = getHelperEndArg => getHelperEndArg === 65535 ? null : array[getHelperEndArg],
    getValueRaw = () => {
      getHelperEndValue(2);
      let getUint162 = dataView.getUint16(getHelperEndNumber, true);
      return getHelperEndNumber += 2, getUint162;
    },
    getValueList = () => {
      getHelperEndValue(4);
      let getUint322 = dataView.getUint32(getHelperEndNumber, true);
      return getHelperEndNumber += 4, getUint322;
    },
    getValueMap = getParsed(getValueRaw()),
    getMap = getParsed(getValueRaw()),
    getHelperEndGetCallback = getValueRaw(),
    getArray = new Array(getHelperEndGetCallback);
  for (let getOuter = 0; getOuter < getHelperEndGetCallback; getOuter++) getArray[getOuter] = {
    id: getParsed(getValueRaw()),
    type: getParsed(getValueRaw()),
    defaultValue: getParsed(getValueRaw())
  };
  let getCallback = getValueList(),
    getHelperEndText = '';
  return getCallback !== 4294967295 && (getHelperEndValue(getCallback), getHelperEndText = localStepped.decode(refHelperEl(buffer.subarray(getHelperEndNumber, getHelperEndNumber + getCallback), 0)), getHelperEndNumber += getCallback), {
    id: getValueMap,
    filename: getMap,
    params: getArray,
    code: getHelperEndText
  };
}
async function getFail(getFailArg) {
  if (badEffects.has(getFailArg)) throw new Error("file efek untuk " + getFailArg + " tidak ketemu");
  if (localByIndex.has(getFailArg)) return localByIndex.get(getFailArg);
  let getFailString = String(getFailArg),
    getText = null,
    getInner = null;
  try {
    let getOk = await fetch("/api/effect-bin?id=" + encodeURIComponent(getFailArg));
    getOk.ok && (getFailString = getOk.headers.get("X-Effect-File") || getFailString, getText = parseAmfxBinary(await getOk.arrayBuffer()));
  } catch {}
  if (!getText) {
    let getValueScoped = null;
    try {
      let okValue = await fetch("/api/effect-xml?id=" + encodeURIComponent(getFailArg));
      if (okValue.ok) {
        getFailString = okValue.headers.get("X-Effect-File") || getFailString;
        let getByKey = await okValue.text();
        /^\s*<(!doctype\s+html|html)/i.test(getByKey) || (getValueScoped = getByKey);
      }
    } catch {}
    if (getValueScoped !== null) getText = parseEffectXml(getValueScoped, getFailString), getInner = getValueScoped;else {
      let getValueByIndex = await valueInner,
        getFailValue = getValueByIndex[getFailArg] || getValueByIndex[getFailArg.split('.').pop()];
      if (!getFailValue) {
        badEffects.add(getFailArg);
        throw new Error("file efek untuk " + getFailArg + " tidak ketemu");
      }
      getFailString = getFailValue;
      let getStatus = await fetch("../effects/" + getFailValue);
      if (!getStatus.ok) {
        badEffects.add(getFailArg);
        throw new Error("HTTP " + getStatus.status + " untuk " + getFailValue);
      }
      let getValueStart = await getStatus.text();
      if (/^\s*<(!doctype\s+html|html)/i.test(getValueStart)) {
        badEffects.add(getFailArg);
        throw new Error("server membalas HTML (bukan XML) untuk ../effects/" + getFailValue);
      }
      getText = parseEffectXml(getValueStart, getFailString), getInner = getValueStart;
    }
  }
  return getText && getText.category === void 0 && (await applyHelperByKey(getText, getFailArg, getInner)), localByIndex.set(getFailArg, getText), getText;
}
export { getFail, getHelperEnd };
