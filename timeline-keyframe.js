import { rHelper } from './timeline-easing.js';
import { eAHelper, omFxParamDef, omHexFrom, updateHelper } from './engine-core.js';
import { helperCurrent } from './parser-effect-xml.js';
import { jumpNextKeyframeOrBookmark, jumpPrevKeyframeOrBookmark } from './timeline-playback.js';
import { playheadMs } from './state.js';
import { omKeyableOf, readGlobalT } from './engine-transform.js';
function refHelper(kfsArg, refHelperArg, refArg = [0, 0, 0, 0]) {
  if (!kfsArg) return refArg[0] = 0, refArg;
  let refKfs = kfsArg.kfs;
  if (!refKfs || !refKfs.length) {
    let refValueTarget = kfsArg.value;
    for (let refValueInner = 0; refValueInner < refValueTarget.length; refValueInner++) refArg[refValueInner] = refValueTarget[refValueInner];
    return refArg;
  }
  let refV = refKfs[0],
    vValue = null,
    refHelperNumber = 0;
  if (refHelperArg <= refKfs[0].t) refV = refKfs[0];else {
    if (refHelperArg >= refKfs[refKfs.length - 1].t) refV = refKfs[refKfs.length - 1];else for (let refInner = 0; refInner < refKfs.length - 1; refInner++) {
      let refHelperRefNumber = refKfs[refInner],
        refT = refKfs[refInner + 1];
      if (refHelperArg < refHelperRefNumber.t || refHelperArg > refT.t) continue;
      refV = refHelperRefNumber, vValue = refT;
      let refTarget = refT.t - refHelperRefNumber.t;
      refHelperNumber = refTarget > 1e-9 ? (refHelperArg - refHelperRefNumber.t) / refTarget : 1;
      let refR = rHelper(refT.e);
      refR && (refHelperNumber = refR(refHelperNumber));
      break;
    }
  }
  for (let refValueClamped = 0; refValueClamped < refV.v.length; refValueClamped++) {
    let refNumberValue = refV.v[refValueClamped];
    refArg[refValueClamped] = vValue ? refNumberValue + ((vValue.v[refValueClamped] ?? refNumberValue) - refNumberValue) * refHelperNumber : refNumberValue;
  }
  return refArg;
}
function refHelperMax(refArgEl) {
  let refHelperMaxRecord = {
    location: {
      value: [0, 0, 0],
      kfs: []
    },
    scale: {
      value: [1, 1],
      kfs: []
    },
    rotation: {
      value: [0],
      kfs: []
    },
    opacity: {
      value: [1],
      kfs: []
    },
    pivot: {
      value: [0, 0],
      kfs: []
    },
    skew: {
      value: [0, 0],
      kfs: []
    }
  };
  if (!refArgEl) return refHelperMaxRecord;
  for (let refValueParsed of updateHelper(refArgEl)) switch (refValueParsed.tagName) {
    case "location":
      refHelperMaxRecord.location = helperCurrent(refValueParsed, 3, [0, 0, 0]);
      break;
    case "scale":
      refHelperMaxRecord.scale = helperCurrent(refValueParsed, 2, [1, 1]);
      break;
    case "rotation":
      refHelperMaxRecord.rotation = helperCurrent(refValueParsed, 1, [0]);
      break;
    case "opacity":
      refHelperMaxRecord.opacity = helperCurrent(refValueParsed, 1, [1]);
      break;
    case "pivot":
      refHelperMaxRecord.pivot = helperCurrent(refValueParsed, 2, [0, 0]);
      break;
    case "skew":
      refHelperMaxRecord.skew = helperCurrent(refValueParsed, 2, [0, 0]);
      break;
    default:
      break;
  }
  return refHelperMaxRecord;
}
function processScoped(processScopedArg) {
  return processScopedArg > 0 ? jumpNextKeyframeOrBookmark() : jumpPrevKeyframeOrBookmark();
}
function omKfs(omKfsResult) {
  return (omKfsResult && omKfsResult.kfs || []).map(omKfsT => `<kf t="${omKfsT.t}" v="${(omKfsT.v || []).join(',')}"${omKfsT.e ? ` e="${eAHelper(omKfsT.e)}"` : ""}/>`).join("");
}
function omKeyable(omKeyableArg, omKeyableValue) {
  if (!omKeyableValue || !omKeyableValue.value && !(omKeyableValue.kfs || []).length) return "";
  const inner = omKfs(omKeyableValue);
  const omKeyableResult = (omKeyableValue.value || []).join(",");
  return inner ? `<${omKeyableArg} value="${omKeyableResult}">${inner}</${omKeyableArg}>` : `<${omKeyableArg} value="${omKeyableResult}" />`;
}
function omSetKeyable(prop, omsetkeyableCondition) {
  if (!prop) return;
  prop.kfs = prop.kfs || [];
  const omSetKeyableValue = Array.isArray(omsetkeyableCondition) ? omsetkeyableCondition : [omsetkeyableCondition];
  prop.value = omSetKeyableValue;
  if (prop.kfs.length) {
    const omsetkeyableValue = playheadMs / 1000;
    const omSetKeyableResult = prop.kfs.findIndex(omSetKeyableT => Math.abs(Number(omSetKeyableT.t) - omsetkeyableValue) < 0.001);
    if (omSetKeyableResult >= 0) prop.kfs[omSetKeyableResult].v = omSetKeyableValue;
    else prop.kfs.push({
      t: omsetkeyableValue,
      v: omSetKeyableValue,
      e: null,
      easing: null
    });
    prop.kfs.sort((omSetKeyableArg, omSetKeyableArgValue) => omSetKeyableArg.t - omSetKeyableArgValue.t);
  }
}
function omFxWriteChannel(omFxWriteChannelValue, omfxwritechaCondition, animate) {
  omFxWriteChannelValue.value = Array.isArray(omfxwritechaCondition) ? omfxwritechaCondition : [omfxwritechaCondition];
  if (animate || (omFxWriteChannelValue.kfs && omFxWriteChannelValue.kfs.length)) {
    omFxWriteChannelValue.kfs = omFxWriteChannelValue.kfs || [];
    const omfxwritechaValue = playheadMs / 1000,
      omFxWriteChannelResult = omFxWriteChannelValue.kfs.findIndex(omFxWriteChannelT => Math.abs(Number(omFxWriteChannelT.t) - omfxwritechaValue) < 0.001);
    const omFxWriteChannelValueRaw = omFxWriteChannelValue.value;
    if (omFxWriteChannelResult >= 0) omFxWriteChannelValue.kfs[omFxWriteChannelResult] = { t: omfxwritechaValue, v: omFxWriteChannelValueRaw, e: null, easing: null };
    else omFxWriteChannelValue.kfs.push({ t: omfxwritechaValue, v: omFxWriteChannelValueRaw, e: null, easing: null });
    omFxWriteChannelValue.kfs.sort((omFxWriteChannelArg, omFxWriteChannelArgValue) => omFxWriteChannelArg.t - omFxWriteChannelArgValue.t);
  }
}
function omFxWidget(omfxwidgetValue, omFxWidgetChannel, entry, omfxwidgetText, omFxWidgetArgValue) {
  const omFxWidgetValue = omFxWidgetChannel.channel || { value: [0], kfs: [] };
  omFxWidgetChannel.channel = omFxWidgetValue;
  const omFxWidgetFlag = omFxWidgetValue.value[0];
  const idSafe = omfxwidgetText + ":" + omFxWidgetArgValue;
  if (omfxwidgetValue === "bool") return '<label class="check"><input type="checkbox" data-pi="' + idSafe + '"' + (omFxWidgetFlag ? " checked" : "") + '><span>aktif</span></label>';
  if (omfxwidgetValue === "color") {
    const omFxWidgetOmHexFrom = omHexFrom(omFxWidgetValue.value);
    return '<div class="om-props-row"><input type="color" data-pi="' + idSafe + '" value="' + omFxWidgetOmHexFrom + '" title="warna"></div>';
  }
  if (omfxwidgetValue === "int") {
    const omFxWidgetOmFxParamDef = omFxParamDef(entry, omFxWidgetChannel.id);
    if (omFxWidgetOmFxParamDef && omFxWidgetOmFxParamDef.choices && omFxWidgetOmFxParamDef.choices.length) return '<select data-pi="' + idSafe + '">' + omFxWidgetOmFxParamDef.choices.map((omFxWidgetArgRaw, omFxWidgetArg) => '<option value="' + omFxWidgetArg + '"' + (Math.round(Number(omFxWidgetValue.value[0])) === omFxWidgetArg ? " selected" : "") + ">" + omFxWidgetArgRaw + "</option>").join("") + '</select>';
    return '<input type="number" data-pi="' + idSafe + '" step="1" value="' + Number(omFxWidgetValue.value[0]) + '">';
  }
  const omFxWidgetStep = omFxParamDef(entry, omFxWidgetChannel.id) || {};
  const step = omFxWidgetStep.step || 0.01;
  const omFxWidgetMin = omFxWidgetStep.min;
  const omFxWidgetMax = omFxWidgetStep.max;
  const omfxwidgetNumber = Number(omFxWidgetValue.value[0]);
  return '<input type="range" data-pi="' + idSafe + '" min="' + omFxWidgetMin + '" max="' + omFxWidgetMax + '" step="' + step + '" value="' + omfxwidgetNumber + '"> <b data-v="' + idSafe + '">' + omfxwidgetNumber.toFixed(2) + '</b>';
}
function omKfRefresh() {
  const panel = document.getElementById("om-props");
  if (!panel) return;
  const omkfrefreshValue = readGlobalT && readGlobalT() || null;
  panel.querySelectorAll("button[data-kfp]").forEach(omKfRefreshDataset => {
    const omKfRefreshKfs = omkfrefreshValue && omKeyableOf(omkfrefreshValue, omKfRefreshDataset.dataset.kfp);
    omKfRefreshDataset.classList.toggle("on", !!(omKfRefreshKfs && omKfRefreshKfs.kfs && omKfRefreshKfs.kfs.length));
  });
  const omkfrefreshOmOpenCurveEl = panel.querySelector("#om-open-curve");
  const omKfRefreshResult = omkfrefreshValue && (["loc", "rot", "sc", "op"].some(anyValue => {
    const omKfRefreshOmKeyableOf = omKeyableOf(omkfrefreshValue, anyValue);
    return omKfRefreshOmKeyableOf && omKfRefreshOmKeyableOf.kfs && omKfRefreshOmKeyableOf.kfs.length >= 2;
  }));
  omkfrefreshOmOpenCurveEl && (omkfrefreshOmOpenCurveEl.disabled = !omKfRefreshResult);
  panel.querySelectorAll("button[data-kfp]").forEach(datasetArg => {
    const omKfRefreshValue = omkfrefreshValue && omKeyableOf(omkfrefreshValue, datasetArg.dataset.kfp);
    datasetArg.title = (omKfRefreshValue && omKfRefreshValue.kfs && omKfRefreshValue.kfs.length) ? "KF aktif (" + omKfRefreshValue.kfs.length + ")" : "Tambah keyframe";
  });
}
export { omFxWidget, omFxWriteChannel, omKeyable, omKfRefresh, omKfs, omSetKeyable, processScoped, refHelper, refHelperMax };
