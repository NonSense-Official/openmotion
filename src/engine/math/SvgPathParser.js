export class SvgPathParser {
  static tokenize(d) {
    const tokens = [];
    const regex = /([a-df-z])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/gi;
    let match;
    while ((match = regex.exec(d)) !== null) {
      if (match[1]) {
        tokens.push({ type: 'cmd', value: match[1] });
      } else if (match[2]) {
        tokens.push({ type: 'num', value: parseFloat(match[2]) });
      }
    }
    return tokens;
  }

  static parseCommands(d) {
    if (!d || typeof d !== 'string') return [];
    const tokens = SvgPathParser.tokenize(d);
    const commands = [];

    let i = 0;
    let curCmd = '';
    let cx = 0, cy = 0;
    let startX = 0, startY = 0;
    let lastCpX = null, lastCpY = null;

    function nextNum() {
      if (i < tokens.length && tokens[i].type === 'num') {
        return tokens[i++].value;
      }
      return 0;
    }

    function hasNum() {
      return i < tokens.length && tokens[i].type === 'num';
    }

    while (i < tokens.length) {
      if (tokens[i].type === 'cmd') {
        curCmd = tokens[i++].value;
      }

      const isRelative = curCmd === curCmd.toLowerCase() && curCmd !== 'z';
      const cmd = curCmd.toUpperCase();

      if (cmd === 'M') {
        let x = nextNum();
        let y = nextNum();
        if (isRelative) { x += cx; y += cy; }
        cx = x; cy = y;
        startX = x; startY = y;
        commands.push(['M', cx, cy]);
        lastCpX = null; lastCpY = null;
        curCmd = isRelative ? 'l' : 'L';
      } else if (cmd === 'L') {
        let x = nextNum();
        let y = nextNum();
        if (isRelative) { x += cx; y += cy; }
        cx = x; cy = y;
        commands.push(['L', cx, cy]);
        lastCpX = null; lastCpY = null;
      } else if (cmd === 'H') {
        let x = nextNum();
        if (isRelative) x += cx;
        cx = x;
        commands.push(['L', cx, cy]);
        lastCpX = null; lastCpY = null;
      } else if (cmd === 'V') {
        let y = nextNum();
        if (isRelative) y += cy;
        cy = y;
        commands.push(['L', cx, cy]);
        lastCpX = null; lastCpY = null;
      } else if (cmd === 'C') {
        let cp1x = nextNum(), cp1y = nextNum();
        let cp2x = nextNum(), cp2y = nextNum();
        let x = nextNum(), y = nextNum();
        if (isRelative) {
          cp1x += cx; cp1y += cy;
          cp2x += cx; cp2y += cy;
          x += cx; y += cy;
        }
        commands.push(['C', cp1x, cp1y, cp2x, cp2y, x, y]);
        lastCpX = cp2x; lastCpY = cp2y;
        cx = x; cy = y;
      } else if (cmd === 'S') {
        let cp1x = cx, cp1y = cy;
        if (lastCpX !== null && lastCpY !== null) {
          cp1x = 2 * cx - lastCpX;
          cp1y = 2 * cy - lastCpY;
        }
        let cp2x = nextNum(), cp2y = nextNum();
        let x = nextNum(), y = nextNum();
        if (isRelative) {
          cp2x += cx; cp2y += cy;
          x += cx; y += cy;
        }
        commands.push(['C', cp1x, cp1y, cp2x, cp2y, x, y]);
        lastCpX = cp2x; lastCpY = cp2y;
        cx = x; cy = y;
      } else if (cmd === 'Q') {
        let qx = nextNum(), qy = nextNum();
        let x = nextNum(), y = nextNum();
        if (isRelative) {
          qx += cx; qy += cy;
          x += cx; y += cy;
        }
        const cp1x = cx + (2 / 3) * (qx - cx);
        const cp1y = cy + (2 / 3) * (qy - cy);
        const cp2x = x + (2 / 3) * (qx - x);
        const cp2y = y + (2 / 3) * (qy - y);
        commands.push(['C', cp1x, cp1y, cp2x, cp2y, x, y]);
        lastCpX = qx; lastCpY = qy;
        cx = x; cy = y;
      } else if (cmd === 'Z') {
        commands.push(['Z']);
        cx = startX; cy = startY;
        lastCpX = null; lastCpY = null;
      } else {
        while (hasNum()) nextNum();
      }
    }

    return commands;
  }

  static commandsToPoints(commands) {
    const points = [];
    let isClosed = false;
    let prevPt = null;

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      const type = cmd[0];

      if (type === 'M' || type === 'L') {
        const pt = {
          x: cmd[1],
          y: cmd[2],
          type: 'corner',
          in: [cmd[1], cmd[2]],
          out: [cmd[1], cmd[2]]
        };
        points.push(pt);
        prevPt = pt;
      } else if (type === 'C') {
        const cp1x = cmd[1], cp1y = cmd[2];
        const cp2x = cmd[3], cp2y = cmd[4];
        const x = cmd[5], y = cmd[6];

        if (prevPt) {
          prevPt.type = 'curved';
          prevPt.out = [cp1x, cp1y];
        }

        const pt = {
          x,
          y,
          type: 'curved',
          in: [cp2x, cp2y],
          out: [x + (x - cp2x), y + (y - cp2y)]
        };
        points.push(pt);
        prevPt = pt;
      } else if (type === 'Z') {
        isClosed = true;
      }
    }

    return { points, isClosed };
  }

  static pointsToCommands(points, isClosed = false) {
    if (!points || !points.length) return [];
    const cmds = [];
    cmds.push(['M', points[0].x, points[0].y]);

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      if (prev.type === 'curved' || curr.type === 'curved') {
        const cp1x = prev.out ? prev.out[0] : prev.x;
        const cp1y = prev.out ? prev.out[1] : prev.y;
        const cp2x = curr.in ? curr.in[0] : curr.x;
        const cp2y = curr.in ? curr.in[1] : curr.y;
        cmds.push(['C', cp1x, cp1y, cp2x, cp2y, curr.x, curr.y]);
      } else {
        cmds.push(['L', curr.x, curr.y]);
      }
    }

    if (isClosed && points.length > 2) {
      const last = points[points.length - 1];
      const first = points[0];

      if (last.type === 'curved' || first.type === 'curved') {
        const cp1x = last.out ? last.out[0] : last.x;
        const cp1y = last.out ? last.out[1] : last.y;
        const cp2x = first.in ? first.in[0] : first.x;
        const cp2y = first.in ? first.in[1] : first.y;
        cmds.push(['C', cp1x, cp1y, cp2x, cp2y, first.x, first.y]);
      }
      cmds.push(['Z']);
    }

    return cmds;
  }

  static sampleBezier(p0x, p0y, cp1x, cp1y, cp2x, cp2y, p1x, p1y, t) {
    const it = 1 - t;
    const it2 = it * it;
    const it3 = it2 * it;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: it3 * p0x + 3 * it2 * t * cp1x + 3 * it * t2 * cp2x + t3 * p1x,
      y: it3 * p0y + 3 * it2 * t * cp1y + 3 * it * t2 * cp2y + t3 * p1y
    };
  }

  static computeBounds(commands) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    function addPt(x, y) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    let curX = 0, curY = 0;

    for (const cmd of commands) {
      const type = cmd[0];
      if (type === 'M' || type === 'L') {
        curX = cmd[1]; curY = cmd[2];
        addPt(curX, curY);
      } else if (type === 'C') {
        const cp1x = cmd[1], cp1y = cmd[2];
        const cp2x = cmd[3], cp2y = cmd[4];
        const endX = cmd[5], endY = cmd[6];

        for (let s = 0; s <= 16; s++) {
          const t = s / 16;
          const pt = SvgPathParser.sampleBezier(curX, curY, cp1x, cp1y, cp2x, cp2y, endX, endY, t);
          addPt(pt.x, pt.y);
        }
        curX = endX; curY = endY;
      }
    }

    if (!isFinite(minX) || !isFinite(maxX)) {
      return { minX: -50, minY: -50, maxX: 50, maxY: 50, cx: 0, cy: 0, hx: 50, hy: 50, w: 100, h: 100 };
    }

    const w = Math.max(1, maxX - minX);
    const h = Math.max(1, maxY - minY);

    return {
      minX, minY, maxX, maxY,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      hx: w / 2,
      hy: h / 2,
      w, h
    };
  }

  static commandsToSvg(commands) {
    if (!commands || !commands.length) return '';
    return commands.map(cmd => {
      const type = cmd[0];
      if (type === 'Z') return 'Z';
      if (type === 'M' || type === 'L') return `${type} ${cmd[1]} ${cmd[2]}`;
      if (type === 'C') return `C ${cmd[1]} ${cmd[2]}, ${cmd[3]} ${cmd[4]}, ${cmd[5]} ${cmd[6]}`;
      return '';
    }).filter(Boolean).join(' ');
  }

  static pointsToSvg(points, isClosed = false) {
    const cmds = SvgPathParser.pointsToCommands(points, isClosed);
    return SvgPathParser.commandsToSvg(cmds);
  }

  static parse(d) {
    const commands = SvgPathParser.parseCommands(d);
    const { points, isClosed } = SvgPathParser.commandsToPoints(commands);
    const bounds = SvgPathParser.computeBounds(commands);

    return {
      commands,
      points,
      isClosed,
      bounds
    };
  }
}
