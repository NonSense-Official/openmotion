function parseHexColor(parseHexColorArg) {
  if (!parseHexColorArg) return [0, 0, 0, 1];
  let replace = String(parseHexColorArg).trim().replace(/^#/, '');
  if (replace.length === 3 && (replace = replace.split('').map(parsehexcoloText => parsehexcoloText + parsehexcoloText).join('')), replace.length === 6 && (replace = 'ff' + replace), replace.length !== 8) return [0, 0, 0, 1];
  let parseHexColorValue = [0, 2, 4, 6].map(parseHexColorArgValue => parseInt(replace.substr(parseHexColorArgValue, 2), 16) / 255);
  return [parseHexColorValue[1], parseHexColorValue[2], parseHexColorValue[3], parseHexColorValue[0]];
}
function toCssColor(toCssColorArg) {
  if (typeof toCssColorArg === "string") return toCssColorArg;
  if (!toCssColorArg) return "rgba(0,0,0,1)";
  let round = Math.round(Math.max(0, Math.min(1, toCssColorArg[0] || 0)) * 255),
    toCssColorRound = Math.round(Math.max(0, Math.min(1, toCssColorArg[1] || 0)) * 255),
    toCssColorValue = Math.round(Math.max(0, Math.min(1, toCssColorArg[2] || 0)) * 255),
    toCssColorResult = toCssColorArg[3] === void 0 ? 1 : Math.max(0, Math.min(1, toCssColorArg[3]));
  return "rgba(" + round + ',' + toCssColorRound + ',' + toCssColorValue + ',' + toCssColorResult.toFixed(3) + ')';
}
function omColorToRgba(color, alpha = 1) {
  if (!color) return `rgba(0,0,0,${alpha})`;
  if (Array.isArray(color)) {
    let omcolortorgbValue = Math.round(Math.max(0, Math.min(1, color[0] || 0)) * 255);
    let omcolortorgbValue2 = Math.round(Math.max(0, Math.min(1, color[1] || 0)) * 255);
    let omcolortorgbValue3 = Math.round(Math.max(0, Math.min(1, color[2] || 0)) * 255);
    let omcolortorgbValue4 = (color[3] !== undefined ? color[3] : 1) * alpha;
    return `rgba(${omcolortorgbValue},${omcolortorgbValue2},${omcolortorgbValue3},${Math.max(0, Math.min(1, omcolortorgbValue4)).toFixed(3)})`;
  }
  if (typeof color === "string") {
    let omColorToRgbaValue = color.trim().replace(/^#/, "");
    if (omColorToRgbaValue.length === 3) omColorToRgbaValue = omColorToRgbaValue.split("").map(omcolortorgbText => omcolortorgbText + omcolortorgbText).join("") + "ff";
    else if (omColorToRgbaValue.length === 6) omColorToRgbaValue += "ff";
    if (omColorToRgbaValue.length === 8) {
      let omcolortorgbValue5 = parseInt(omColorToRgbaValue.slice(0, 2), 16) || 0;
      let omcolortorgbValue6 = parseInt(omColorToRgbaValue.slice(2, 4), 16) || 0;
      let omcolortorgbValue7 = parseInt(omColorToRgbaValue.slice(4, 6), 16) || 0;
      let omcolortorgbValue8 = ((parseInt(omColorToRgbaValue.slice(6, 8), 16) || 255) / 255) * alpha;
      return `rgba(${omcolortorgbValue5},${omcolortorgbValue6},${omcolortorgbValue7},${Math.max(0, Math.min(1, omcolortorgbValue8)).toFixed(3)})`;
    }
    if (color.startsWith("rgb")) return color;
  }
  return `rgba(0,0,0,${alpha})`;
}
export { omColorToRgba, parseHexColor, toCssColor };
