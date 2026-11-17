function makeTextState(makeTextStateArg = '') {
  return {
    alpha: 1,
    text: makeTextStateArg,
    transform: {
      angle: 0,
      location: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1
      }
    }
  };
}
function makeTimeEnv(timeMs) {
  return {
    time: timeMs % 5 / 5,
    duration: 5,
    frame: Math.round(timeMs * 30),
    fps: 30,
    absTime: timeMs,
    inTime: 0,
    velocity: {
      x: 0,
      y: 0
    }
  };
}
function buildParamValueMap(buildParamValueMapParams, buildParamValueMapArg) {
  let paramValues = {};
  for (let id of buildParamValueMapParams.params || []) {
    let color = buildParamValueMapArg[id.id];
    id.type === "point" ? paramValues[id.id] = {
      x: color[0],
      y: color[1]
    } : id.type === "xyz" ? paramValues[id.id] = {
      x: color[0],
      y: color[1],
      z: color[2]
    } : id.type === "color" ? paramValues[id.id] = {
      r: color[0],
      g: color[1],
      b: color[2],
      a: color[3]
    } : paramValues[id.id] = color;
  }
  return paramValues;
}
export { buildParamValueMap, makeTextState, makeTimeEnv };
