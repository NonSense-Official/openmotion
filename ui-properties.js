import { omMeta } from './timeline-playback.js';
import { OM_SHAPES, omAddLayer, omEnsureGoogleFont, omPropsLayerId } from './state.js';
import { eAHelper, omHexFrom, omId, processHelperClamped } from './engine-core.js';
import { omTransformXml } from './engine-transform.js';
import { omParseLayer } from './parser-effect-xml.js';
import { omKfRefresh, omKfs } from './timeline-keyframe.js';
import { omBarUpdate, omResolveLayer } from './engine-layer.js';
import { omGetFontList } from './preset-data.js';
function updateHelperValue(updateMin) {
  let updateHelperValueRaw = Number(updateMin.min) || 0,
    updateValueCurrent = Number(updateMin.max) || 100,
    updateCurrent = (Number(updateMin.value) - updateHelperValueRaw) / (updateValueCurrent - updateHelperValueRaw || 1) * 100;
  updateMin.style.setProperty("--pct", Math.max(0, Math.min(100, updateCurrent)) + '%');
}
function omAddShape(omAddShapeArg) {
  const omAddShapeOmMeta = omMeta(), omaddshapeValue = Math.round(Math.min(omAddShapeOmMeta.w, omAddShapeOmMeta.h) * 0.6), label = OM_SHAPES[omAddShapeArg] || omAddShapeArg;
  const omAddShapeValue = '<shape id="' + omId() + '" label="' + label + '" startTime="0" endTime="' + omAddShapeOmMeta.total + '" fillType="color" s="' + omAddShapeArg + '"><property name="size" type="vec2" value="' + omaddshapeValue + ',' + omaddshapeValue + '" /><fillColor value="#ff3366ff" />' + omTransformXml(Math.round(omAddShapeOmMeta.w / 2), Math.round(omAddShapeOmMeta.h / 2), 1) + '</shape>';
  return omAddLayer(omParseLayer(omAddShapeValue), label);
}
function omProp(name, dataType, omPropChannel) {
  const ompropValue = omPropChannel.channel || omPropChannel;
  let omPropValue;
  if (dataType === "color") omPropValue = omHexFrom(ompropValue.value);
  else if (dataType === "bool" || dataType === "switch") omPropValue = (ompropValue.value && ompropValue.value[0]) ? "true" : "false";
  else omPropValue = (ompropValue.value || []).join(",");
  const inner = omKfs(ompropValue);
  return inner ? `<property name="${eAHelper(name)}" type="${eAHelper(dataType || "float")}" value="${omPropValue}">${inner}</property>` : `<property name="${eAHelper(name)}" type="${eAHelper(dataType || "float")}" value="${omPropValue}" />`;
}
function omPropsRefresh() {
  const panel = document.getElementById("om-props");
  if (!panel) return;
  const layer = omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null;
  if (!layer) {
    panel.classList.remove("on");
    const omPropsRefreshOmElembarEl = document.getElementById("om-elembar");
    omPropsRefreshOmElembarEl && omPropsRefreshOmElembarEl.classList.remove("on");
    try {
      omBarUpdate(null);
    } catch (omPropsRefreshParsed) {}
    return;
  }
  panel.classList.add("on");
  const omElembarEl = document.getElementById("om-elembar");
  omElembarEl && omElembarEl.classList.add("on");
  try {
    omBarUpdate(layer);
  } catch (omPropsRefreshValueClamped) {}
  const ompropsrefreCallback = qValue => panel.querySelector(qValue);
  const ompropsrefreValue = layer.transform || {};
  const omPropsRefreshValue = (ompropsrefreValue.location && ompropsrefreValue.location.value) || [0, 0];
  const omPropsRefreshValueParsed = (ompropsrefreValue.rotation && ompropsrefreValue.rotation.value) || [0];
  const omPropsRefreshResult = (ompropsrefreValue.scale && ompropsrefreValue.scale.value) || [1, 1];
  ompropsrefreCallback("#om-propX").value = Math.round(Number(omPropsRefreshValue[0]) || 0);
  ompropsrefreCallback("#om-propY").value = Math.round(Number(omPropsRefreshValue[1]) || 0);
  ompropsrefreCallback("#om-propR").value = (Number(omPropsRefreshValueParsed[0]) || 0).toFixed(1);
  ompropsrefreCallback("#om-propSX").value = (Number(omPropsRefreshResult[0]) * 100).toFixed(1);
  ompropsrefreCallback("#om-propSY").value = (Number(omPropsRefreshResult[1]) * 100).toFixed(1);
  try { omKfRefresh(); } catch (omPropsRefreshClamped) {}
  const border = layer.border;
  ompropsrefreCallback("#om-propBord").checked = !!(border && border.size > 0);
  ompropsrefreCallback("#om-propBordRow").style.display = ompropsrefreCallback("#om-propBord").checked ? "" : "none";
  if (border) {
    ompropsrefreCallback("#om-propBordSize").value = border.size || 0;
    ompropsrefreCallback("#om-propBordDir").value = border.direction || "outside";
    const omHexFromValue = omHexFrom(border.color);
    ompropsrefreCallback("#om-propBordColor").value = /^#[0-9a-f]{9}$/i.test(omHexFromValue) ? "#" + omHexFromValue.slice(3) : omHexFromValue;
  }
  const shadow = layer.shadow;
  ompropsrefreCallback("#om-propShad").checked = !!(shadow && shadow.enabled !== false && (shadow.size > 0 || (shadow.offset && (shadow.offset[0] || shadow.offset[1]))));
  ompropsrefreCallback("#om-propShadRow").style.display = ompropsrefreCallback("#om-propShad").checked ? "" : "none";
  if (shadow) {
    ompropsrefreCallback("#om-propShadSize").value = shadow.size || 0;
    ompropsrefreCallback("#om-propShadX").value = (shadow.offset || [0, 0])[0];
    ompropsrefreCallback("#om-propShadY").value = (shadow.offset || [0, 0])[1];
    const omPropsRefreshFlag = omHexFrom(shadow.color);
    ompropsrefreCallback("#om-propShadColor").value = /^#[0-9a-f]{9}$/i.test(omPropsRefreshFlag) ? "#" + omPropsRefreshFlag.slice(3) : omPropsRefreshFlag;
  }
  panel.querySelector("#om-pname2").textContent = layer.label || layer.id || "Layer";
  panel.querySelector("#om-ptype2").textContent = (layer.tag || "") + (layer.shapeType ? " · " + layer.shapeType : "");
  const omPropsRefreshValueRaw = layer.transform && layer.transform.opacity && layer.transform.opacity.value ? Number(layer.transform.opacity.value[0]) : 1;
  panel.querySelector("#om-propOp").value = Math.round(omPropsRefreshValueRaw * 100);
  panel.querySelector("#om-propOpv").textContent = Math.round(omPropsRefreshValueRaw * 100) + "%";
  panel.querySelector("#om-propBlend").value = processHelperClamped(layer.blendMode);

  // Teks & Tipografi
  const isText = layer.tag === "text";
  const secText = panel.querySelector("#om-sec-text");
  const rowText = panel.querySelector("#om-propTextRow");
  if (secText) secText.style.display = isText ? "" : "none";
  if (rowText) rowText.style.display = isText ? "" : "none";
  if (isText) {
    const ompropsrefreOmProptextEl = panel.querySelector("#om-propText");
    if (ompropsrefreOmProptextEl) ompropsrefreOmProptextEl.value = layer.textContent || "";
    const ompropsrefreOmPropfontsiEl = panel.querySelector("#om-propFontSize");
    if (ompropsrefreOmPropfontsiEl) ompropsrefreOmPropfontsiEl.value = layer.fontSize || 28;
    const ompropsrefreOmProptextalEl = panel.querySelector("#om-propTextAlign");
    if (ompropsrefreOmProptextalEl) ompropsrefreOmProptextalEl.value = layer.align || "center";
    const ompropsrefreOmPropletterEl = panel.querySelector("#om-propLetterSpacing");
    if (ompropsrefreOmPropletterEl) ompropsrefreOmPropletterEl.value = layer.letterSpacing !== undefined ? layer.letterSpacing : 0;
    const ompropsrefreOmProplinespEl = panel.querySelector("#om-propLineSpacing");
    if (ompropsrefreOmProplinespEl) ompropsrefreOmProplinespEl.value = layer.lineSpacing !== undefined ? layer.lineSpacing : 1;

    let curFont = layer.font || "Roboto";
    if (curFont.includes("name=")) {
      const omPropsRefreshRaw = curFont.match(/name=([^&]+)/);
      if (omPropsRefreshRaw) curFont = decodeURIComponent(omPropsRefreshRaw[1]).replace(/\.[^/.]+$/, "");
    }
    const fontSel = panel.querySelector("#om-propFont");
    if (fontSel) {
      const fonts = omGetFontList();
      if (!fonts.includes(curFont)) fonts.unshift(curFont);
      fontSel.innerHTML = fonts.map(ompropsrefreText => '<option value="' + ompropsrefreText + '"' + (ompropsrefreText === curFont ? ' selected' : '') + '>' + ompropsrefreText + '</option>').join("");
    }
    omEnsureGoogleFont(curFont);
  }

  const noFill = layer.tag === "audio" || layer.fillType === "media";
  panel.querySelector("#om-propFillRow").style.display = noFill ? "none" : "";
  if (!noFill) {
    const omPropsRefreshOmHexFrom = omHexFrom(layer.fillColor);
    panel.querySelector("#om-propFill").value = omPropsRefreshOmHexFrom;
    const ompropsrefreOmPropcolorEl = panel.querySelector("#om-propColor");
    if (/^#[0-9a-f]{8}$/i.test(omPropsRefreshOmHexFrom)) ompropsrefreOmPropcolorEl.value = omPropsRefreshOmHexFrom.slice(0, 3) === "#ff" || omPropsRefreshOmHexFrom.length === 9 ? "#" + omPropsRefreshOmHexFrom.slice(3) : omPropsRefreshOmHexFrom;
  }
}
export { omAddShape, omProp, omPropsRefresh, updateHelperValue };
