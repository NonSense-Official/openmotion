import { parseNumberList, refHelperEnd, refHelperStart } from './parser-value.js';
import { objHelperEnd, omId, processClamped, refHelperScoped, updateHelper } from './engine-core.js';
import { parseHexColor } from './color.js';
import { objHelperValue } from './timeline-easing.js';
import { localMode, omAddLayer, recordValue, setValue } from './state.js';
import { handleHelperEnd } from './engine-layer.js';
import { appendLog, process } from './render-text.js';
import { refHelperMax } from './timeline-keyframe.js';
import { helperRaw } from './engine-scene.js';
import { omMeta } from './timeline-playback.js';
import { omTransformXml } from './engine-transform.js';
function objElement(objElementGetAttribute) {
  let objRef = refHelperStart(objElementGetAttribute.getAttribute('d'));
  return {
    commands: objRef,
    bounds: objHelperEnd(objRef)
  };
}
function objHelperMin(objHelperMinGetAttribute) {
  let getAttribute = updateHelper(objHelperMinGetAttribute, "color")[0],
    objValueCount = updateHelper(objHelperMinGetAttribute, "size")[0];
  return {
    enabled: objHelperMinGetAttribute.getAttribute("enabled") !== "false",
    direction: objHelperMinGetAttribute.getAttribute("direction") || "centered",
    cap: objHelperMinGetAttribute.getAttribute("cap") || "round",
    endSize: parseFloat(objHelperMinGetAttribute.getAttribute("end-size")) || 1,
    color: parseHexColor(getAttribute ? getAttribute.getAttribute("value") : null),
    size: parseFloat(objValueCount ? objValueCount.getAttribute("value") : '') || 0
  };
}
function helperMin(helperMinGetAttribute) {
  let renderGetAttribute = updateHelper(helperMinGetAttribute, "color")[0],
    renderValueMin = updateHelper(helperMinGetAttribute, "size")[0],
    renderMin = updateHelper(helperMinGetAttribute, "offset")[0],
    renderParseNumberList = parseNumberList(renderMin ? renderMin.getAttribute("value") : ''),
    renderValueMax = updateHelper(helperMinGetAttribute, "opacity")[0],
    renderValueByKey = renderValueMax ? parseFloat(renderValueMax.getAttribute("value")) : NaN,
    renderValueLocal = renderGetAttribute ? parseHexColor(renderGetAttribute.getAttribute("value")) : [0, 0, 0, 1];
  return Number.isFinite(renderValueByKey) ? renderValueLocal[3] *= renderValueByKey : renderGetAttribute || (renderValueLocal[3] = 0.5), {
    enabled: helperMinGetAttribute.getAttribute("enabled") !== "false",
    direction: helperMinGetAttribute.getAttribute("direction") || "outside",
    color: renderValueLocal,
    size: parseFloat(renderValueMin ? renderValueMin.getAttribute("value") : '') || 0,
    offset: [renderParseNumberList[0] || 0, renderParseNumberList[1] || 0]
  };
}
function helperCurrent(getAttributeArg, objArgScoped = 1, objArgLocal = [0]) {
  let keyframeList = [];
  for (let getAttributeValue of updateHelper(getAttributeArg, 'kf')) {
    let parseFloatValue = parseFloat(getAttributeValue.getAttribute('t'));
    if (Number.isNaN(parseFloatValue)) continue;
    let parseNumberListValue = parseNumberList(getAttributeValue.getAttribute('v')),
      easingAttr = getAttributeValue.getAttribute('e') || null;
    keyframeList.push({
      t: parseFloatValue,
      v: parseNumberListValue.length ? parseNumberListValue : [0],
      e: easingAttr,
      easing: objHelperValue(easingAttr)
    });
  }
  keyframeList.sort((objT, objArgInput) => objT.t - objArgInput.t);
  let objParseNumberList = parseNumberList(getAttributeArg.getAttribute("value")),
    objClamped;
  objParseNumberList.length ? objClamped = objParseNumberList : keyframeList.length ? objClamped = keyframeList[0].v.slice() : objClamped = objArgLocal.slice(), objClamped = refHelperScoped(objClamped, objArgScoped, objArgLocal);
  let objOutput = keyframeList.map(objV => ({
    ...objV,
    v: refHelperScoped(objV.v, objArgScoped, objClamped)
  }));
  return {
    value: objClamped,
    kfs: objOutput
  };
}
function objHelperMax(objHelperMaxGetAttribute) {
  let objHelperMaxList = [];
  for (let objGetAttribute of updateHelper(objHelperMaxGetAttribute, "property")) {
    let attr = objGetAttribute.getAttribute("type"),
      objEnd = objGetAttribute.getAttribute("value"),
      objColor;
    attr === "color" ? objColor = {
      value: parseHexColor(objEnd),
      kfs: []
    } : attr === "bool" ? objColor = {
      value: [objEnd === "true" || objEnd === '1' ? 1 : 0],
      kfs: []
    } : objColor = helperCurrent(objGetAttribute, recordValue[attr] || 1, [0]), objHelperMaxList.push({
      id: objGetAttribute.getAttribute("name"),
      dataType: attr,
      channel: objColor
    });
  }
  return {
    id: objHelperMaxGetAttribute.getAttribute('id') || '',
    shortId: (objHelperMaxGetAttribute.getAttribute('id') || '').split('.').pop(),
    locallyApplied: objHelperMaxGetAttribute.getAttribute("locallyApplied") !== "false",
    hidden: objHelperMaxGetAttribute.getAttribute("hidden") === "true",
    params: objHelperMaxList
  };
}
function helperMax(helperMaxGetAttribute) {
  let helperMaxValue = helperMaxGetAttribute.getAttribute("type") || "float";
  if (helperMaxValue === "color") return {
    dataType: helperMaxValue,
    channel: {
      value: parseHexColor(helperMaxGetAttribute.getAttribute("value")),
      kfs: []
    }
  };
  if (helperMaxValue === "bool" || helperMaxValue === "switch") {
    let attr = helperMaxGetAttribute.getAttribute("value");
    return {
      dataType: helperMaxValue,
      channel: {
        value: [attr === "true" || attr === '1' ? 1 : 0],
        kfs: []
      }
    };
  }
  return {
    dataType: helperMaxValue,
    channel: helperCurrent(helperMaxGetAttribute, localMode[helperMaxValue] || 1, [0])
  };
}
function objHelperByKey(objHelperByKeyGetAttribute) {
  return {
    color: parseHexColor(objHelperByKeyGetAttribute.getAttribute("color")),
    width: parseFloat(objHelperByKeyGetAttribute.getAttribute("width")) || 0,
    type: objHelperByKeyGetAttribute.getAttribute("type") || "pen",
    points: refHelperEnd(objHelperByKeyGetAttribute.getAttribute("points"))
  };
}
function buildElement(buildElementFlag) {
  return buildElementFlag ? {
    type: buildElementFlag.getAttribute("type") || "linear",
    startColor: parseHexColor(buildElementFlag.getAttribute("startColor")),
    endColor: parseHexColor(buildElementFlag.getAttribute("endColor")),
    start: parseNumberList(buildElementFlag.getAttribute("start")),
    end: parseNumberList(buildElementFlag.getAttribute("end")),
    radius: parseNumberList(buildElementFlag.getAttribute("radius")),
    stops: updateHelper(buildElementFlag, "stop").map(buildGetAttribute => ({
      t: parseFloat(buildGetAttribute.getAttribute('t')) || 0,
      color: parseHexColor(buildGetAttribute.getAttribute("color") || buildGetAttribute.getAttribute("value"))
    }))
  } : null;
}
function handleHelperScoped(handleElement) {
  let handleResult = {
    title: handleElement.getAttribute("title") || '',
    width: parseFloat(handleElement.getAttribute("width")) || 1080,
    height: parseFloat(handleElement.getAttribute("height")) || 1920,
    totalTime: parseFloat(handleElement.getAttribute("totalTime")) || 0,
    fps: parseFloat(handleElement.getAttribute("fps")) || 30,
    bgcolor: parseHexColor(handleElement.getAttribute("bgcolor")),
    exportWidth: parseFloat(handleElement.getAttribute("exportWidth")) || 0,
    exportHeight: parseFloat(handleElement.getAttribute("exportHeight")) || 0,
    precompose: handleElement.getAttribute("precompose") || '',
    media: [],
    audio: [],
    bookmarks: [],
    layers: []
  };
  for (let handleTagName of updateHelper(handleElement)) handleTagName.tagName === "media" ? handleResult.media.push({
    uri: handleTagName.getAttribute("uri") || '',
    type: handleTagName.getAttribute("type") || '',
    filename: handleTagName.getAttribute("filename") || '',
    title: handleTagName.getAttribute("title") || '',
    duration: parseFloat(handleTagName.getAttribute("duration")) || 0,
    width: parseFloat(handleTagName.getAttribute("width")) || 0,
    height: parseFloat(handleTagName.getAttribute("height")) || 0,
    orientation: parseFloat(handleTagName.getAttribute("orientation")) || 0
  }) : handleTagName.tagName === "audio" ? (handleResult.audio.push({
    id: handleTagName.getAttribute('id') || '',
    label: handleTagName.getAttribute("label") || '',
    src: handleTagName.getAttribute("src") || '',
    startTime: parseFloat(handleTagName.getAttribute("startTime")) || 0,
    endTime: parseFloat(handleTagName.getAttribute("endTime")) || 0,
    inTime: parseFloat(handleTagName.getAttribute("inTime")) || 0,
    outTime: parseFloat(handleTagName.getAttribute("outTime")) || 0
  }), handleResult.layers.push(refElement(handleTagName))) : handleTagName.tagName === "bookmark" ? handleResult.bookmarks.push(parseFloat(handleTagName.getAttribute('t')) || 0) : setValue.has(handleTagName.tagName) && handleResult.layers.push(refElement(handleTagName));
  return handleHelperEnd(handleResult), handleResult;
}
function refElement(refElementTagName) {
  let refElementRecord = {
    tag: refElementTagName.tagName,
    id: refElementTagName.getAttribute('id') || '',
    label: refElementTagName.getAttribute("label") || '',
    startTime: parseFloat(refElementTagName.getAttribute("startTime")) || 0,
    endTime: parseFloat(refElementTagName.getAttribute("endTime")) || 0,
    inTime: parseFloat(refElementTagName.getAttribute("inTime")) || 0,
    outTime: parseFloat(refElementTagName.getAttribute("outTime")) || 0,
    src: refElementTagName.getAttribute("src") || '',
    fillType: refElementTagName.getAttribute("fillType") || '',
    fillImage: refElementTagName.getAttribute("fillImage") || '',
    fillVideo: refElementTagName.getAttribute("fillVideo") || '',
    mediaFillMode: refElementTagName.getAttribute("mediaFillMode") || "fill",
    hidden: refElementTagName.getAttribute("hidden") === "true",
    shapeType: (refElementTagName.getAttribute('s') || '').trim(),
    cornerRadius: 0,
    shapeProps: {},
    strokes: [],
    cameraType: refElementTagName.getAttribute("type") || "perspective",
    fov: refElementTagName.tagName === "camera" ? 60 : 0,
    parentId: refElementTagName.getAttribute("parent") || '',
    parentLayer: null,
    blendMode: refElementTagName.getAttribute("blending") || refElementTagName.getAttribute("blendMode") || "normal",
    speed: parseFloat(refElementTagName.getAttribute("speed")) || 1,
    gain: {
      value: [1],
      kfs: []
    },
    sourceXml: process(refElementTagName),
    link: refElementTagName.getAttribute("link") || '',
    fontSize: parseFloat(refElementTagName.getAttribute("size")) || 18,
    font: refElementTagName.getAttribute("font") || '',
    wrapWidth: parseFloat(refElementTagName.getAttribute("wrapWidth")) || 0,
    align: refElementTagName.getAttribute("align") || "center",
    letterSpacing: parseFloat(refElementTagName.getAttribute("letterSpacing")) || 0,
    lineSpacing: parseFloat(refElementTagName.getAttribute("lineSpacing")) || 1,
    textContent: '',
    transform: {
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
      }
    },
    fillColor: [1, 1, 1, 1],
    gradient: null,
    path: null,
    pathStroke: null,
    shadow: null,
    size: {
      value: [100, 100],
      kfs: []
    },
    effects: [],
    children: [],
    scene: null
  };
  refElementRecord.endTime <= refElementRecord.startTime && (refElementRecord.endTime = refElementRecord.startTime + 1);
  for (let refTagName of updateHelper(refElementTagName)) switch (refTagName.tagName) {
    case "content":
      refElementRecord.textContent = refTagName.textContent || '';
      break;
    case "transform":
      refElementRecord.transform = refHelperMax(refTagName);
      break;
    case "fillType":
      {
        let attr = refTagName.getAttribute("value");
        attr && (refElementRecord.fillType = attr);
        let refGetAttribute = updateHelper(refTagName, "fillColor")[0];
        refGetAttribute && (refElementRecord.fillColor = parseHexColor(refGetAttribute.getAttribute("value")));
        break;
      }
    case "fillColor":
      refElementRecord.fillColor = parseHexColor(refTagName.getAttribute("value"));
      break;
    case "gradient":
      refElementRecord.gradient = buildElement(refTagName);
      break;
    case "path":
      refElementRecord.path = objElement(refTagName);
      break;
    case "path-stroke":
      refElementRecord.pathStroke = objHelperMin(refTagName);
      break;
    case "shadow":
      refElementRecord.shadow = helperMin(refTagName);
      break;
    case "border":
      {
        let refValuePrimary = updateHelper(refTagName, "color")[0],
          refPrimary = updateHelper(refTagName, "size")[0];
        refElementRecord.border = {
          direction: refTagName.getAttribute("direction") || "outside",
          color: refValuePrimary ? parseHexColor(refValuePrimary.getAttribute("value")) : [1, 1, 1, 1],
          size: parseFloat(refPrimary ? refPrimary.getAttribute("value") : '') || 0
        };
        break;
      }
    case "effect":
      refElementRecord.effects.push(objHelperMax(refTagName));
      break;
    case "stroke":
      refElementRecord.tag === "drawing" && refElementRecord.strokes.push(objHelperByKey(refTagName));
      break;
    case "gain":
      refElementRecord.gain = helperCurrent(refTagName, 1, [1]);
      break;
    case "fov":
      {
        let refElementParseFloat = parseFloat(refTagName.getAttribute("value"));
        Number.isFinite(refElementParseFloat) && refElementParseFloat > 0 && (refElementRecord.fov = refElementParseFloat);
        break;
      }
    case "focus-blur":
      {
        let dist = updateHelper(refTagName, "distance")[0];
        let refValueSecondary = updateHelper(refTagName, "depth-of-field")[0];
        let refSecondary = updateHelper(refTagName, "strength")[0];
        refElementRecord.focusBlur = {
          enabled: refTagName.getAttribute("enabled") !== "false",
          distance: dist ? (parseFloat(dist.getAttribute("value")) || 500) : 500,
          depthOfField: refValueSecondary ? (parseFloat(refValueSecondary.getAttribute("value")) || 100) : 100,
          strength: refSecondary ? (parseFloat(refSecondary.getAttribute("value")) || 0.5) : 0.5
        };
        break;
      }
    case "fog":
      {
        let refValueTertiary = updateHelper(refTagName, "color")[0];
        let refTertiary = updateHelper(refTagName, "near-z")[0];
        let refValueExtra = updateHelper(refTagName, "far-z")[0];
        refElementRecord.fog = {
          enabled: refTagName.getAttribute("enabled") !== "false",
          color: refValueTertiary ? parseHexColor(refValueTertiary.getAttribute("value")) : [1, 1, 1, 1],
          nearZ: refTertiary ? (parseFloat(refTertiary.getAttribute("value")) || 0) : 0,
          farZ: refValueExtra ? (parseFloat(refValueExtra.getAttribute("value")) || 500) : 500
        };
        break;
      }
    case "property":
      {
        let attr = refTagName.getAttribute("name");
        if (attr === "size") refElementRecord.size = helperCurrent(refTagName, 2, [0, 0]);else {
          if (attr === "cornerRadius") refElementRecord.cornerRadius = parseFloat(refTagName.getAttribute("value")) || 0;else {
            if (attr === "startAngle") refElementRecord.startAngle = helperCurrent(refTagName, 1, [0]);else {
              if (attr === "endAngle") refElementRecord.endAngle = helperCurrent(refTagName, 1, [360]);else {
                if (attr === "blendMode" || attr === "blending" || attr === "blend") {
                  let refBlendMode = refTagName.getAttribute("value");
                  refBlendMode && (refElementRecord.blendMode = refBlendMode);
                }
              }
            }
          }
        }
        attr && (refElementRecord.shapeProps[attr] = helperMax(refTagName));
        break;
      }
    case "scene":
      refElementRecord.scene = handleHelperScoped(refTagName);
      break;
    default:
      refElementRecord.tag === "group" && setValue.has(refTagName.tagName) && refElementRecord.children.push(refElement(refTagName));
      break;
  }
  return refElementRecord;
}
function updateFail(updateFailArg, updateFailFilename = '') {
  let parseFromString = new DOMParser().parseFromString(updateFailArg, "text/xml");
  if (parseFromString.getElementsByTagName("parsererror").length) throw new Error(updateFailFilename + ": XML tidak valid.");
  let updateDocumentElement = parseFromString.documentElement;
  if ((!updateDocumentElement || updateDocumentElement.tagName !== "scene") && (updateDocumentElement = parseFromString.getElementsByTagName("scene")[0]), !updateDocumentElement) throw new Error(updateFailFilename + ": tidak menemukan elemen <scene>.");
  let filename = handleHelperScoped(updateDocumentElement);
  return helperRaw(filename), filename.filename = updateFailFilename, filename;
}
function computeElement(computeElementArgValue, computeElementArg = '') {
  let parseFromString = new DOMParser().parseFromString(computeElementArgValue, "text/xml");
  if (parseFromString.getElementsByTagName("parsererror").length) throw new Error(computeElementArg + ": XML bentuk tidak valid.");
  let documentElement = parseFromString.documentElement;
  if ((!documentElement || documentElement.tagName !== "shape") && (documentElement = parseFromString.getElementsByTagName("shape")[0]), !documentElement) throw new Error(computeElementArg + ": tidak menemukan elemen <shape>.");
  let computeElementList = [],
    computeValueTotal = processClamped(documentElement, "params")[0];
  if (computeValueTotal) for (let computeGetAttribute of processClamped(computeValueTotal)) {
    let attr = computeGetAttribute.getAttribute('id');
    attr && computeElementList.push({
      id: attr,
      type: computeGetAttribute.tagName,
      defaultValue: computeGetAttribute.getAttribute("default")
    });
  }
  let textContent = processClamped(documentElement, "script")[0],
    computeTotal = '';
  return textContent && (computeTotal = (textContent.textContent || '').replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '')), {
    id: documentElement.getAttribute('id') || '',
    filename: computeElementArg,
    params: computeElementList,
    code: computeTotal
  };
}
function renderHelperList(renderHelperListGetAttribute, renderArgPrimary) {
  if (!renderHelperListGetAttribute) return;
  let renderHelperListValue = renderHelperListGetAttribute.getAttribute("data-default") ?? renderArgPrimary;
  renderHelperListGetAttribute.value = String(renderHelperListValue ?? renderHelperListGetAttribute.min), renderHelperListGetAttribute.dispatchEvent(new Event("input", {
    bubbles: true
  }));
}
function omParseLayer(omparselayerValue) {
  try {
    const omParseLayerParseFromString = new DOMParser().parseFromString(omparselayerValue, "text/xml");
    if (!omParseLayerParseFromString.documentElement || omParseLayerParseFromString.querySelector("parsererror")) return null;
    return refElement(omParseLayerParseFromString.documentElement);
  } catch (omParseLayerValue) {
    return null;
  }
}
async function omAddElementFile(file) {
  try {
    const omAddElementFileValue = await file.text();
    const omAddElementFileParseFromString = new DOMParser().parseFromString(omAddElementFileValue, "text/xml");
    if (!omAddElementFileParseFromString.documentElement || omAddElementFileParseFromString.querySelector("parsererror")) throw new Error("XML tidak valid");
    const omAddElementFileTitle = handleHelperScoped(omAddElementFileParseFromString.documentElement);
    const omAddElementFileOmMeta = omMeta();
    const wrapper = omParseLayer('<embedScene id="' + omId() + '" label="' + (omAddElementFileTitle.title || file.name) + '" startTime="0" endTime="' + omAddElementFileOmMeta.total + '">' + omTransformXml(Math.round(omAddElementFileOmMeta.w / 2), Math.round(omAddElementFileOmMeta.h / 2), 1) + '</embedScene>');
    if (!wrapper) throw new Error("gagal memuat elemen");
    wrapper.scene = omAddElementFileTitle, await omAddLayer(wrapper, omAddElementFileTitle.title || file.name);
  } catch (omAddElementFileMessage) {
    appendLog("[EDIT] Elemen gagal: " + omAddElementFileMessage.message);
  }
}
function omEffectObjFromXml(omeffectobjfValue, id) {
  try {
    const omEffectObjFromXmlParseFromString = new DOMParser().parseFromString(omeffectobjfValue, "text/xml");
    const el = omEffectObjFromXmlParseFromString.querySelector("effect");
    if (!el) return null;
    const params = [];
    el.querySelectorAll("params > *").forEach(omeffectobjfElement => {
      const idAttr = omeffectobjfElement.getAttribute("id");
      if (!idAttr) return;
      const omEffectObjFromXmlTagName = omeffectobjfElement.tagName,
        defaultAttr = omeffectobjfElement.getAttribute("default"),
        valueList = (defaultAttr || "").split(",").map(Number);
      let omEffectObjFromXmlResult, omEffectObjFromXmlValue;
      if (omEffectObjFromXmlTagName === "spinner" || omEffectObjFromXmlTagName === "slider") {
        omEffectObjFromXmlResult = "float", omEffectObjFromXmlValue = [Number(defaultAttr) || 0];
      } else if (omEffectObjFromXmlTagName === "switch") {
        omEffectObjFromXmlResult = "bool", omEffectObjFromXmlValue = [(defaultAttr === "true" || defaultAttr === "1") ? 1 : 0];
      } else if (omEffectObjFromXmlTagName === "color") {
        omEffectObjFromXmlResult = "color", omEffectObjFromXmlValue = parseHexColor(defaultAttr || "#ffffffff");
      } else if (omEffectObjFromXmlTagName === "point") {
        omEffectObjFromXmlResult = "vec2", omEffectObjFromXmlValue = valueList;
      } else if (omEffectObjFromXmlTagName === "xyz" || omEffectObjFromXmlTagName === "hue-disc") {
        omEffectObjFromXmlResult = "vec3", omEffectObjFromXmlValue = valueList;
      } else if (omEffectObjFromXmlTagName === "selector") {
        omEffectObjFromXmlResult = "int", omEffectObjFromXmlValue = [parseInt(defaultAttr) || 0];
      } else return;
      if (!Array.isArray(omEffectObjFromXmlValue)) omEffectObjFromXmlValue = [Number(omEffectObjFromXmlValue) || 0];
      while (omEffectObjFromXmlResult === "vec2" && omEffectObjFromXmlValue.length < 2) omEffectObjFromXmlValue.push(0);
      while (omEffectObjFromXmlResult === "vec3" && omEffectObjFromXmlValue.length < 3) omEffectObjFromXmlValue.push(0);
      params.push({
        id: idAttr,
        dataType: omEffectObjFromXmlResult,
        channel: {
          value: omEffectObjFromXmlValue,
          kfs: []
        }
      });
    });
    return {
      id,
      shortId: String(id).split(".").pop(),
      locallyApplied: true,
      hidden: false,
      params
    };
  } catch (omEffectObjFromXmlValueRaw) {
    return null;
  }
}
export { buildElement, computeElement, handleHelperScoped, helperCurrent, helperMax, helperMin, objElement, objHelperByKey, objHelperMax, objHelperMin, omAddElementFile, omEffectObjFromXml, omParseLayer, refElement, renderHelperList, updateFail };
