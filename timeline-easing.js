import { renderHelperRaw } from './engine-core.js';
import { easingFunctions, valueStepped } from './state.js';
import { cyclicEase, randomEase, stepEase } from './parser-value.js';
function cubicBezierEase(cubicBezierEaseArgLocal, cubicBezierEaseArgValue, cubicBezierEaseArgRaw, cubicBezierEaseArgParsed) {
  let cubicBezierEaseResult = 3 * cubicBezierEaseArgLocal,
    cubicBezierEaseValueRaw = 3 * (cubicBezierEaseArgRaw - cubicBezierEaseArgLocal) - cubicBezierEaseResult,
    cubicBezierEaseValueParsed = 1 - cubicBezierEaseResult - cubicBezierEaseValueRaw,
    cubicBezierEaseRaw = 3 * cubicBezierEaseArgValue,
    cubicBezierEaseParsed = 3 * (cubicBezierEaseArgParsed - cubicBezierEaseArgValue) - cubicBezierEaseRaw,
    cubicBezierEaseLocal = 1 - cubicBezierEaseRaw - cubicBezierEaseParsed,
    cubicBezierEaseOuter = cubicBezierEaseArgClamped => ((cubicBezierEaseValueParsed * cubicBezierEaseArgClamped + cubicBezierEaseValueRaw) * cubicBezierEaseArgClamped + cubicBezierEaseResult) * cubicBezierEaseArgClamped,
    cubicBezierEaseValueClamped = cubicBezierEaseArgScoped => ((cubicBezierEaseLocal * cubicBezierEaseArgScoped + cubicBezierEaseParsed) * cubicBezierEaseArgScoped + cubicBezierEaseRaw) * cubicBezierEaseArgScoped,
    cubicBezierEaseValueOuter = cubicBezierEaseArgOuter => (3 * cubicBezierEaseValueParsed * cubicBezierEaseArgOuter + 2 * cubicBezierEaseValueRaw) * cubicBezierEaseArgOuter + cubicBezierEaseResult;
  return cubicBezierEaseArg => {
    if (cubicBezierEaseArg <= 0) return 0;
    if (cubicBezierEaseArg >= 1) return 1;
    let cubicBezierEaseValue = cubicBezierEaseArg;
    for (let cubicBezierEaseClamped = 0; cubicBezierEaseClamped < 8; cubicBezierEaseClamped++) {
      let cubicBezierEaseValueScoped = cubicBezierEaseOuter(cubicBezierEaseValue) - cubicBezierEaseArg;
      if (Math.abs(cubicBezierEaseValueScoped) < 0.00001) return cubicBezierEaseValueClamped(cubicBezierEaseValue);
      let cubicBezierEaseFnCallback = cubicBezierEaseValueOuter(cubicBezierEaseValue);
      if (Math.abs(cubicBezierEaseFnCallback) < 0.000001) break;
      cubicBezierEaseValue -= cubicBezierEaseValueScoped / cubicBezierEaseFnCallback;
    }
    let cubicBezierEaseValueInner = 0,
      cubicBezierEaseNumber = 1;
    cubicBezierEaseValue = cubicBezierEaseArg;
    for (let cubicBezierEaseScoped = 0; cubicBezierEaseScoped < 24; cubicBezierEaseScoped++) {
      let cubicBezierEaseValueLocal = cubicBezierEaseOuter(cubicBezierEaseValue) - cubicBezierEaseArg;
      if (Math.abs(cubicBezierEaseValueLocal) < 0.00001) break;
      cubicBezierEaseValueLocal > 0 ? cubicBezierEaseNumber = cubicBezierEaseValue : cubicBezierEaseValueInner = cubicBezierEaseValue, cubicBezierEaseValue = (cubicBezierEaseValueInner + cubicBezierEaseNumber) / 2;
    }
    return cubicBezierEaseValueClamped(cubicBezierEaseValue);
  };
}
function elasticEase(getCondition, elasticEaseParsed, elasticEaseArgValue, elasticEaseArgRaw, elasticEaseArgParsed) {
  let elasticEaseValue = Number.isFinite(getCondition) && getCondition > 0 ? getCondition : 0.5,
    elasticEaseValueRaw = Number.isFinite(elasticEaseArgValue) ? elasticEaseArgValue : 0.5,
    elasticEaseResult = Number.isFinite(elasticEaseArgRaw) ? elasticEaseArgRaw : 0,
    getPredicate = elasticEaseRaw => {
      let elasticEaseCos = Math.cos(Math.PI * elasticEaseRaw / Math.max(elasticEaseValue, 0.01)),
        elasticEaseValueParsed = 1 - Math.max(elasticEaseRaw, 0.005);
      return elasticEaseCos * Math.abs(Math.pow(elasticEaseValueParsed, elasticEaseValueRaw * elasticEaseValueRaw * 15 + 1));
    },
    elasticEaseFlag = elasticEaseArg => {
      if (elasticEaseArg >= elasticEaseValue) return 1 - getPredicate(elasticEaseArg) * elasticEaseResult;
      let elasticEaseMax = Math.max(elasticEaseValue, 0.01);
      return renderHelperRaw((1 - Math.cos(Math.PI * elasticEaseArg / elasticEaseMax)) / 2 * (1 - getPredicate(elasticEaseValue) * elasticEaseResult), 1 - getPredicate(elasticEaseArg) * elasticEaseResult, Math.pow(elasticEaseArg / elasticEaseMax, 3));
    };
  return elasticEaseArgParsed ? getValue => 1 - elasticEaseFlag(1 - getValue) : elasticEaseFlag;
}
function bounceEase(bounceEaseArg, bounceEaseFlag) {
  let bounceEaseValue = Number.isFinite(bounceEaseArg) ? bounceEaseArg : 0.3,
    bounceEaseRaw = Number.isFinite(bounceEaseFlag) ? bounceEaseFlag : 0.8;
  return bounceEaseArgValue => {
    let bounceEaseResult = bounceEaseValue,
      bounceEaseParsed = bounceEaseArgValue + bounceEaseValue / 2,
      bounceEaseValueParsed = 0;
    if (bounceEaseValue === 0) return 1;
    let bounceEaseNumber = 1;
    for (;;) {
      let bounceEaseValueRaw = bounceEaseValueParsed + bounceEaseResult;
      if (bounceEaseParsed <= bounceEaseValueRaw) return bounceEaseResult / 3 + bounceEaseValueParsed > bounceEaseValue / 2 + 1 || bounceEaseResult < 0.1 && bounceEaseValueRaw > bounceEaseValue / 2 + 1 ? 1 : Math.pow(Math.abs(((bounceEaseParsed - bounceEaseValueParsed) / bounceEaseResult - 0.5) * 2), 2) * bounceEaseNumber + (1 - bounceEaseNumber);
      if (bounceEaseResult *= bounceEaseRaw, bounceEaseNumber *= bounceEaseRaw, bounceEaseNumber < 0.005) return 1;
      bounceEaseValueParsed = bounceEaseValueRaw;
    }
  };
}
function fnHelper(fnHelperFlag, fnFlag) {
  let fnValue = Number.isFinite(fnHelperFlag) && fnHelperFlag > 0.000001 ? fnHelperFlag : 0.2,
    fnHelperFnValue = Number.isFinite(fnFlag) ? fnFlag : 0.5,
    fnElasticEase = elasticEase(0.5 - 0.45 * fnHelperFnValue, 1, 1 - fnHelperFnValue * 0.5, (1 - fnHelperFnValue) * 0.5 + 0.5, false);
  return fnHelperArg => {
    if (fnHelperArg < fnValue) return 0;
    let fnValueRaw = fnHelperArg % fnValue;
    return fnHelperArg - fnValueRaw + fnValue * (fnElasticEase(fnValueRaw / fnValue) - 1);
  };
}
function objHelperValue(objArgList) {
  if (!objArgList) return null;
  let trim = String(objArgList).trim();
  if (!trim) return null;
  let parts = trim.split(/\s+/),
    objValue = parts[0] === "local",
    objEl = objValue ? parts[1] : parts[0],
    objValueStart = objEl === "reverse" && parts[1] === "elastic",
    objSource = objValueStart ? "elastic" : objEl,
    objValueTarget = parts.slice(objValueStart || objValue ? 2 : 1).map(parseFloat);
  return {
    type: objSource,
    params: objValueTarget,
    raw: trim,
    reverse: objValueStart,
    local: objValue
  };
}
function rHelper(rValue) {
  let rObj = objHelperValue(rValue);
  if (!rObj) return null;
  let rHelperRValue = rObj.raw;
  if (valueStepped.has(rHelperRValue)) return valueStepped.get(rHelperRValue);
  let rParams = rObj.params,
    rCallback = rArg => rParams.length >= rArg && rParams.slice(0, rArg).every(rArgValue => Number.isFinite(rArgValue)),
    bounce = rObj.type,
    cubicBezier = null;
  return bounce === "cubicBezier" && rCallback(4) ? cubicBezier = cubicBezierEase(rParams[0], rParams[1], rParams[2], rParams[3]) : bounce === "elastic" && rCallback(3) ? cubicBezier = elasticEase(rParams[0], rParams[1], rParams[2], rParams[3], rObj.reverse) : bounce === "cyclic" && rCallback(5) ? cubicBezier = cyclicEase(rParams[0], rParams[1], rParams[2], rParams[3], rParams[4]) : bounce === "bounce" ? cubicBezier = bounceEase(rParams[0], rParams[1]) : bounce === "step" ? cubicBezier = stepEase(rParams[0], rParams[1]) : bounce === "elasticStep" ? cubicBezier = fnHelper(rParams[0], rParams[1]) : bounce === "random" && rCallback(2) ? cubicBezier = randomEase(rParams[0], rParams[1], rParams[2], rParams[3], rParams[4], rParams[5]) : easingFunctions[bounce] && (cubicBezier = easingFunctions[bounce]), valueStepped.set(rHelperRValue, cubicBezier), cubicBezier;
}
export { bounceEase, cubicBezierEase, elasticEase, fnHelper, objHelperValue, rHelper };
