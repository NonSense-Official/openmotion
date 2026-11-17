var IDENTITY_MAT4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function parseNumberList(parseNumberListArg, count) {
  let numbers = String(parseNumberListArg).split(',').map(part => parseFloat(part.trim())),
    parseNumberListResult = [];
  for (let parseNumberListNumber = 0; parseNumberListNumber < count; parseNumberListNumber++) parseNumberListResult.push(Number.isFinite(numbers[parseNumberListNumber]) ? numbers[parseNumberListNumber] : 0);
  return parseNumberListResult;
}
function resolveDefaultValue(rawValue, paramType) {
  if (rawValue == null) return paramType === "switch" ? false : paramType === "selector" ? 0 : paramType === "point" ? [0, 0] : paramType === "xyz" ? [0, 0, 0] : paramType === "hue-disc" ? [0, 1, 0] : paramType === "color" ? [1, 1, 1, 1] : paramType === "orient" ? IDENTITY_MAT4.slice() : 0;
  if (paramType === "switch") return String(rawValue).toLowerCase() === "true";
  if (paramType === "selector") {
    let parsedInt = parseInt(rawValue, 10);
    return Number.isFinite(parsedInt) ? parsedInt : 0;
  }
  if (paramType === "point") return parseNumberList(rawValue, 2);
  if (paramType === "xyz" || paramType === "hue-disc") return parseNumberList(rawValue, 3);
  if (paramType === "orient") return IDENTITY_MAT4.slice();
  if (paramType === "color") {
    let hexText = String(rawValue).replace('#', '');
    if (hexText.length === 8) {
      let rByte = parseInt(hexText.substring(0, 2), 16) / 255,
        gByte = parseInt(hexText.substring(2, 4), 16) / 255,
        bByte = parseInt(hexText.substring(4, 6), 16) / 255,
        aByte = parseInt(hexText.substring(6, 8), 16) / 255;
      return [gByte, bByte, aByte, rByte];
    } else {
      if (hexText.length === 6) {
        let resolveDefaultValueResult = parseInt(hexText.substring(0, 2), 16) / 255,
          resolveDefaultValueRaw = parseInt(hexText.substring(2, 4), 16) / 255,
          resolveDefaultValueArg = parseInt(hexText.substring(4, 6), 16) / 255;
        return [resolveDefaultValueResult, resolveDefaultValueRaw, resolveDefaultValueArg, 1];
      }
    }
    return [1, 1, 1, 1];
  }
  return parseFloat(rawValue);
}
export { IDENTITY_MAT4, parseNumberList, resolveDefaultValue };
