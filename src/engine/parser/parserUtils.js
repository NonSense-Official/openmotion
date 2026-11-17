export function escapeXml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function parseHexColor(str) {
  if (!str) return [0, 0, 0, 1];
  let hex = String(str).trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 6) {
    hex = 'ff' + hex;
  }
  if (hex.length !== 8) return [0, 0, 0, 1];
  const a = parseInt(hex.slice(0, 2), 16) / 255;
  const r = parseInt(hex.slice(2, 4), 16) / 255;
  const g = parseInt(hex.slice(4, 6), 16) / 255;
  const b = parseInt(hex.slice(6, 8), 16) / 255;
  return [r, g, b, a];
}

export function formatHexColor(c) {
  if (typeof c === 'string') return c;
  if (!c) return '#ff000000';
  const toHex = (v) => Math.round(Math.max(0, Math.min(1, v == null ? 1 : v)) * 255).toString(16).padStart(2, '0');
  const a = toHex(c[3]);
  const r = toHex(c[0]);
  const g = toHex(c[1]);
  const b = toHex(c[2]);
  return `#${a}${r}${g}${b}`;
}

export function parseNumberList(str) {
  if (str == null) return [];
  return String(str)
    .trim()
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function padDimension(arr, dim, defaultArr = [0]) {
  const result = [];
  for (let i = 0; i < dim; i++) {
    const val = arr[i];
    result.push(val === undefined ? (defaultArr[i] === undefined ? 0 : defaultArr[i]) : val);
  }
  return result;
}

export function getChildren(el, tagName) {
  if (!el || !el.children) return [];
  return Array.from(el.children).filter((child) => !tagName || child.tagName === tagName);
}

export function elementToXml(node) {
  if (!node) return '';
  if (typeof node.outerHTML === 'string') return node.outerHTML;
  if (typeof XMLSerializer !== 'undefined') {
    return new XMLSerializer().serializeToString(node);
  }
  let attrs = '';
  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i] || (node.attributes.item && node.attributes.item(i));
      if (attr && attr.name) {
        attrs += ` ${attr.name}="${String(attr.value ?? '').replace(/"/g, '&quot;')}"`;
      }
    }
  }
  const tag = node.tagName || 'node';
  const childElements = node.children
    ? Array.from(node.children)
    : (node.childNodes ? Array.from(node.childNodes).filter((n) => n.nodeType === 1) : []);
  const children = childElements.map(elementToXml).join('');
  const text = node.textContent && !children ? node.textContent.trim() : '';
  return children || text ? `<${tag}${attrs}>${children}${text}</${tag}>` : `<${tag}${attrs} />`;
}

export function parseEasing(easingStr) {
  if (!easingStr) return null;
  const raw = String(easingStr).trim();
  if (!raw) return null;
  const parts = raw.split(/\s+/);
  const isLocal = parts[0] === 'local';
  const baseType = isLocal ? parts[1] : parts[0];
  const isReverseElastic = baseType === 'reverse' && parts[1] === 'elastic';
  const type = isReverseElastic ? 'elastic' : baseType;
  const params = parts.slice(isReverseElastic || isLocal ? 2 : 1).map(parseFloat);
  return {
    type,
    params,
    raw,
    reverse: isReverseElastic,
    local: isLocal
  };
}

export function parsePointsList(pointsStr) {
  const points = [];
  if (!pointsStr) return points;
  for (const part of String(pointsStr).split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const nums = trimmed.split(',').map(parseFloat);
    if (nums.length < 2 || !Number.isFinite(nums[0]) || !Number.isFinite(nums[1])) continue;
    const p = Number.isFinite(nums[2]) ? nums[2] : 1;
    points.push([nums[0], nums[1], p]);
  }
  return points;
}

const PATH_REGEX = /([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;
const PARAM_COUNTS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };

export function parseSvgPath(pathStr) {
  const commands = [];
  if (!pathStr) return { commands, bounds: computePathBounds(commands) };

  const tokens = [];
  let match;
  PATH_REGEX.lastIndex = 0;
  while ((match = PATH_REGEX.exec(pathStr)) !== null) {
    tokens.push(match[1] ? match[1] : parseFloat(match[2]));
  }

  let idx = 0;
  let currCmd = null;
  let cx = 0, cy = 0, sx = 0, sy = 0, lastCpX = 0, lastCpY = 0;
  const nextNum = () => (typeof tokens[idx] === 'number' ? tokens[idx++] : 0);

  while (idx < tokens.length) {
    if (typeof tokens[idx] === 'string') {
      currCmd = tokens[idx++];
    } else if (currCmd) {
      if (currCmd === 'M') currCmd = 'L';
      else if (currCmd === 'm') currCmd = 'l';
    } else {
      idx++;
      continue;
    }

    const upper = currCmd.toUpperCase();
    const isRel = currCmd !== upper;

    if (upper === 'Z') {
      commands.push(['Z']);
      cx = sx;
      cy = sy;
      continue;
    }

    const count = PARAM_COUNTS[upper] || 0;
    const args = [];
    for (let i = 0; i < count; i++) args.push(nextNum());

    switch (upper) {
      case 'M':
        cx = isRel ? cx + args[0] : args[0];
        cy = isRel ? cy + args[1] : args[1];
        sx = cx;
        sy = cy;
        commands.push(['M', cx, cy]);
        break;
      case 'L':
        cx = isRel ? cx + args[0] : args[0];
        cy = isRel ? cy + args[1] : args[1];
        commands.push(['L', cx, cy]);
        break;
      case 'H':
        cx = isRel ? cx + args[0] : args[0];
        commands.push(['L', cx, cy]);
        break;
      case 'V':
        cy = isRel ? cy + args[0] : args[0];
        commands.push(['L', cx, cy]);
        break;
      case 'C': {
        const x1 = isRel ? cx + args[0] : args[0];
        const y1 = isRel ? cy + args[1] : args[1];
        const x2 = isRel ? cx + args[2] : args[2];
        const y2 = isRel ? cy + args[3] : args[3];
        const ex = isRel ? cx + args[4] : args[4];
        const ey = isRel ? cy + args[5] : args[5];
        commands.push(['C', x1, y1, x2, y2, ex, ey]);
        lastCpX = x2;
        lastCpY = y2;
        cx = ex;
        cy = ey;
        break;
      }
      case 'S': {
        const x1 = (currCmd === 'C' || currCmd === 'S') ? 2 * cx - lastCpX : cx;
        const y1 = (currCmd === 'C' || currCmd === 'S') ? 2 * cy - lastCpY : cy;
        const x2 = isRel ? cx + args[0] : args[0];
        const y2 = isRel ? cy + args[1] : args[1];
        const ex = isRel ? cx + args[2] : args[2];
        const ey = isRel ? cy + args[3] : args[3];
        commands.push(['C', x1, y1, x2, y2, ex, ey]);
        lastCpX = x2;
        lastCpY = y2;
        cx = ex;
        cy = ey;
        break;
      }
      default:
        break;
    }
  }

  return { commands, bounds: computePathBounds(commands) };
}

export function computePathBounds(commands) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const update = (x, y) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  let lx = 0, ly = 0;
  for (const cmd of commands) {
    if (cmd[0] === 'M' || cmd[0] === 'L') {
      update(cmd[1], cmd[2]);
      lx = cmd[1];
      ly = cmd[2];
    } else if (cmd[0] === 'C') {
      const [, x1, y1, x2, y2, ex, ey] = cmd;
      for (let s = 0; s <= 8; s++) {
        const t = s / 8;
        const it = 1 - t;
        const px = it * it * it * lx + 3 * it * it * t * x1 + 3 * it * t * t * x2 + t * t * t * ex;
        const py = it * it * it * ly + 3 * it * it * t * y1 + 3 * it * t * t * y2 + t * t * t * ey;
        update(px, py);
      }
      lx = ex;
      ly = ey;
    }
  }

  if (minX > maxX) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, cx: 0, cy: 0, hx: 1, hy: 1, w: 2, h: 2 };
  }
  const w = maxX - minX;
  const h = maxY - minY;
  return {
    minX, minY, maxX, maxY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    hx: w / 2,
    hy: h / 2,
    w, h
  };
}
