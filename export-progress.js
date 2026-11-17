import { objHelperByIndex } from './parser-value.js';
import { expstatsEl } from './state.js';
function maxHelper(freezeTime, maxHelperArg, maxArg) {
  if (!(Number.isFinite(maxArg) && maxArg > 0)) return null;
  let {
      startMs: maxObj,
      endMs: maxValueClamped,
      spanMs: maxRaw
    } = objHelperByIndex(freezeTime, maxArg),
    maxFlag = maxValueClamped - maxObj;
  if (!(maxFlag > 1)) return maxObj / 1000;
  if (freezeTime && freezeTime.freezeTime != null) {
    return Math.max(0, Math.min(maxArg - 0.001, (maxObj + freezeTime.freezeTime * maxFlag) / 1000));
  }
  let speed = (freezeTime && typeof freezeTime.speed === "number" && freezeTime.speed > 0) ? freezeTime.speed : ((freezeTime && typeof freezeTime.timeScale === "number" && freezeTime.timeScale > 0) ? freezeTime.timeScale : 1);
  let progress = maxRaw > 0 ? Math.max(0, Math.min(1, maxHelperArg / maxRaw)) : 0;
  if (freezeTime && freezeTime.speedCurve && typeof freezeTime.speedCurve.evaluate === "function") {
    progress = freezeTime.speedCurve.evaluate(progress);
  }
  if (freezeTime && freezeTime.reversed) {
    progress = 1 - progress;
  }
  let maxHelperMaxValue = (freezeTime && (freezeTime.speedCurve || freezeTime.reversed || freezeTime.timeStretchMode === "keep")) ? (progress * maxFlag) : (maxHelperArg * speed);
  maxHelperMaxValue >= maxFlag && (maxHelperMaxValue = maxRaw > maxFlag + 1 ? maxHelperMaxValue % maxFlag : maxFlag);
  let maxClamped = (maxObj + maxHelperMaxValue) / 1000;
  return Math.max(0, Math.min(maxArg - 0.001, maxClamped));
}
function setExportStatus(setExportStatusTextContent) {
  expstatsEl.textContent = setExportStatusTextContent;
}
export { maxHelper, setExportStatus };
