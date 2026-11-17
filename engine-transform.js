import { omId, omLayerCur } from './engine-core.js';
import { cloneLayerSafe, omResolveLayer } from './engine-layer.js';
import { appendLog } from './render-text.js';
import { omMeta } from './timeline-playback.js';
import { omAddLayer, omPropsLayerId } from './state.js';
import { omParseLayer } from './parser-effect-xml.js';
import { omKeyable } from './timeline-keyframe.js';
function sort(sortTransform, sortText, sortValue) {
  let sortMax = Math.max(1, sortValue - sortText),
    sortSet = new Set(),
    sortCallback = sortKfs => {
      if (!(!sortKfs || !Array.isArray(sortKfs.kfs))) {
        for (let sortT of sortKfs.kfs) Number.isFinite(sortT.t) && sortSet.add(Math.round(sortText + sortT.t * sortMax));
      }
    },
    location = sortTransform.transform || {};
  sortCallback(location.location), sortCallback(location.scale), sortCallback(location.rotation), sortCallback(location.opacity), sortCallback(sortTransform.size), sortCallback(sortTransform.startAngle), sortCallback(sortTransform.endAngle);
  for (let sortParams of sortTransform.effects || []) for (let sortChannel of sortParams.params || []) sortCallback(sortChannel.channel);
  return [...sortSet].sort((sortArg, sortArgValue) => sortArg - sortArgValue);
}
function omCopyStyle(layer) {
  const target = layer || omLayerCur();
  if (!target) return;
  window.__omClipboardStyle = {
    sourceId: target.id,
    sourceLabel: target.label || target.id,
    colorFill: {
      fillColor: target.fillColor,
      fillType: target.fillType,
      fillImage: target.fillImage,
      fillVideo: target.fillVideo,
      gradient: target.gradient ? cloneLayerSafe(target.gradient) : null,
      src: target.src
    },
    borderShadow: {
      strokeEnabled: target.strokeEnabled,
      strokeColor: target.strokeColor,
      strokeWidth: target.strokeWidth,
      strokeCap: target.strokeCap,
      strokeJoin: target.strokeJoin,
      strokePosition: target.strokePosition,
      strokeAlign: target.strokeAlign,
      strokeDash: target.strokeDash,
      shadowEnabled: target.shadowEnabled,
      shadowColor: target.shadowColor,
      shadowRadius: target.shadowRadius,
      shadowX: target.shadowX,
      shadowY: target.shadowY,
      shadowAlpha: target.shadowAlpha,
      border: target.border ? cloneLayerSafe(target.border) : null,
      shadow: target.shadow ? cloneLayerSafe(target.shadow) : null
    },
    blendingOpacity: {
      opacity: target.opacity != null ? target.opacity : 1,
      blendMode: target.blendMode || "normal",
      maskType: target.maskType
    },
    moveTransform: {
      transform: target.transform ? cloneLayerSafe(target.transform) : null,
      location: target.location ? cloneLayerSafe(target.location) : null,
      scale: target.scale ? cloneLayerSafe(target.scale) : null,
      rotation: target.rotation != null ? target.rotation : null,
      skew: target.skew != null ? target.skew : null,
      pivot: target.pivot ? cloneLayerSafe(target.pivot) : null
    },
    text: target.text != null ? {
      text: target.text,
      fontFamily: target.fontFamily,
      fontSize: target.fontSize,
      textAlign: target.textAlign,
      textColor: target.textColor,
      lineHeight: target.lineHeight,
      letterSpacing: target.letterSpacing
    } : null,
    effects: Array.isArray(target.effects) ? cloneLayerSafe(target.effects) : (target.visualEffects ? cloneLayerSafe(target.visualEffects) : []),
    speed: target.speed != null ? target.speed : (target.timeScale != null ? target.timeScale : 1.0)
  };
  appendLog("Gaya lapisan disalin");
  return window.__omClipboardStyle;
}
function omTransformXml(omtransformxText, omTransformXmlArg, scale) {
  return '<transform><location value="' + omtransformxText + ',' + omTransformXmlArg + ',0" /><scale value="' + scale + ',' + scale + '" /><rotation value="0" /><opacity value="1" /></transform>';
}
function omAddText() {
  const omAddTextOmMeta = omMeta();
  const omaddtextValue = '<text id="' + omId() + '" label="Teks" startTime="0" endTime="' + omAddTextOmMeta.total + '" size="' + Math.round(Math.min(omAddTextOmMeta.w, omAddTextOmMeta.h) * 0.12) + '" align="center"><content>Teks</content><fillColor value="#ffffffff" />' + omTransformXml(Math.round(omAddTextOmMeta.w / 2), Math.round(omAddTextOmMeta.h / 2), 1) + '</text>';
  return omAddLayer(omParseLayer(omaddtextValue), "Teks");
}
function omAddSimple(omaddsimpleText, label, child) {
  const omAddSimpleOmMeta = omMeta();
  const omaddsimpleValue = '<' + omaddsimpleText + ' id="' + omId() + '" label="' + label + '" startTime="0" endTime="' + omAddSimpleOmMeta.total + '">' + (child || '') + omTransformXml(Math.round(omAddSimpleOmMeta.w / 2), Math.round(omAddSimpleOmMeta.h / 2), 1) + '</' + omaddsimpleText + '>';
  return omAddLayer(omParseLayer(omaddsimpleValue), label);
}
function omTransformXmlObj(omTransformXmlObjLocation) {
  if (!omTransformXmlObjLocation) return "";
  let omTransformXmlObjText = "<transform>";
  omTransformXmlObjText += omKeyable("location", omTransformXmlObjLocation.location), omTransformXmlObjText += omKeyable("scale", omTransformXmlObjLocation.scale), omTransformXmlObjText += omKeyable("rotation", omTransformXmlObjLocation.rotation), omTransformXmlObjText += omKeyable("opacity", omTransformXmlObjLocation.opacity);
  if (omTransformXmlObjLocation.pivot && (omTransformXmlObjLocation.pivot.value && (omTransformXmlObjLocation.pivot.value[0] || omTransformXmlObjLocation.pivot.value[1]) || (omTransformXmlObjLocation.pivot.kfs || []).length)) omTransformXmlObjText += omKeyable("pivot", omTransformXmlObjLocation.pivot);
  if (omTransformXmlObjLocation.skew && (omTransformXmlObjLocation.skew.value && (omTransformXmlObjLocation.skew.value[0] || omTransformXmlObjLocation.skew.value[1]) || (omTransformXmlObjLocation.skew.kfs || []).length)) omTransformXmlObjText += omKeyable("skew", omTransformXmlObjLocation.skew);
  return omTransformXmlObjText + "</transform>";
}
function omKeyableOf(omKeyableOfLocation, omkeyableofValue) {
  if (omkeyableofValue === "gain") {
    const omKeyableOfFlag = omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null;
    return omKeyableOfFlag ? omKeyableOfFlag.gain : null;
  }
  return omkeyableofValue === "loc" ? omKeyableOfLocation.location : omkeyableofValue === "rot" ? omKeyableOfLocation.rotation : omkeyableofValue === "sc" ? omKeyableOfLocation.scale : omkeyableofValue === "op" ? omKeyableOfLocation.opacity : omkeyableofValue === "skew" ? omKeyableOfLocation.skew : omkeyableofValue === "pivot" ? omKeyableOfLocation.pivot : null;
}
function readGlobalT() {
  const readGlobalTTransform = omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null;
  return readGlobalTTransform && readGlobalTTransform.transform ? readGlobalTTransform.transform : null;
}
export { omAddSimple, omAddText, omCopyStyle, omKeyableOf, omTransformXml, omTransformXmlObj, readGlobalT, sort };
