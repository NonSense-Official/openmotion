export const SWATCHES = [
  '#ffffff', '#000000', '#808080', '#c0c0c0',
  '#ff3b30', '#ff9500', '#ffcc00', '#34c759',
  '#00ffa8', '#00c7be', '#30b0c7', '#007aff',
  '#5856d6', '#af52de', '#ff2d55', '#a2845e'
];

export function parseColor(c) {
  if (!c) return { r: 0, g: 255, b: 168, a: 1 };
  if (Array.isArray(c)) {
    return {
      r: Math.round(Math.max(0, Math.min(1, c[0] ?? 0)) * 255),
      g: Math.round(Math.max(0, Math.min(1, c[1] ?? 0)) * 255),
      b: Math.round(Math.max(0, Math.min(1, c[2] ?? 0)) * 255),
      a: c[3] === undefined ? 1 : Math.max(0, Math.min(1, c[3]))
    };
  }
  if (typeof c === 'string') {
    let hex = c.trim().replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map((x) => x + x).join('') + 'ff';
    else if (hex.length === 6) hex += 'ff';
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16) || 0,
        g: parseInt(hex.slice(2, 4), 16) || 0,
        b: parseInt(hex.slice(4, 6), 16) || 0,
        a: (parseInt(hex.slice(6, 8), 16) || 255) / 255
      };
    }
  }
  return { r: 0, g: 255, b: 168, a: 1 };
}

export function rgbaToHex(r, g, b, a = 1) {
  const hR = Math.round(r).toString(16).padStart(2, '0');
  const hG = Math.round(g).toString(16).padStart(2, '0');
  const hB = Math.round(b).toString(16).padStart(2, '0');
  if (a >= 0.999) return `#${hR}${hG}${hB}`;
  const hA = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
  return `#${hR}${hG}${hB}${hA}`;
}

export function colorToCss(c) {
  const p = parseColor(c);
  return `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a.toFixed(3)})`;
}

export function colorToHexStr(c) {
  const p = parseColor(c);
  return rgbaToHex(p.r, p.g, p.b, p.a);
}
