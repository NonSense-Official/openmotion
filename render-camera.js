import { camera, renderer } from './state.js';
import { getHelper } from './engine-layer.js';
import { updateHelperEl } from './engine-core.js';
function refHelperMin(refHelperMinLayers, refHelperMinArg) {
  let refValueInput = refHelperMinLayers && refHelperMinLayers.layers || [],
    refValueOutput = null;
  for (let refHelperMinNumber = 0; refHelperMinNumber < refValueInput.length; refHelperMinNumber++) {
    let refStartTime = refValueInput[refHelperMinNumber];
    refStartTime.tag === "camera" && (refHelperMinArg < refStartTime.startTime || refHelperMinArg > refStartTime.endTime || (refValueOutput = {
      camera: refStartTime,
      index: refHelperMinNumber
    }));
  }
  return refValueOutput;
}
function helperList(buildFillVideo) {
  let helperListValue = buildFillVideo.fillVideo || buildFillVideo.fillImage || buildFillVideo.src || '';
  if (helperListValue && renderer && renderer.images && renderer.images.get) {
    let buildByIndex = renderer.images.get(helperListValue);
    if (buildByIndex) return buildByIndex;
  }
  return helperListValue ? '' : buildFillVideo.tag === "camera" ? "camera" : buildFillVideo.tag === "text" ? "text" : getHelper(buildFillVideo) ? "group" : buildFillVideo.fillColor && buildFillVideo.fillColor.length >= 3 ? updateHelperEl(buildFillVideo.fillColor) : '';
}
function processHelperScoped(fillType) {
  let toLowerCase = (fillType.fillType || '').toLowerCase(),
    processCamera = (fillType.tag || '').toLowerCase();
  return processCamera === "camera" ? camera.camera : processCamera === "audio" || toLowerCase === "audio" ? camera.audio : toLowerCase === "image" || toLowerCase === "photo" ? camera.image : toLowerCase === "video" ? camera.video : processCamera === "text" ? camera.text : processCamera === "embedscene" ? camera.embedScene : processCamera === "shape" ? camera.shape : camera.default;
}
export { helperList, processHelperScoped, refHelperMin };
