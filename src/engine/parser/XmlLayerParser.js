import {
  parseHexColor,
  parseNumberList,
  padDimension,
  getChildren,
  elementToXml,
  parseSvgPath,
  parsePointsList,
  parseEasing
} from './parserUtils.js';

export const LAYER_TAG_NAMES = new Set([
  'shape',
  'embedScene',
  'group',
  'text',
  'nullobj',
  'camera',
  'audio',
  'drawing'
]);

const TYPE_DIMENSIONS = {
  vec2: 2,
  vec3: 3,
  vec4: 4,
  point: 2,
  size: 2,
  offset: 2,
  float: 1
};

export function parseKeyableChannel(el, dim = 1, defaultVal = [0]) {
  if (!el) {
    return { value: padDimension([], dim, defaultVal), kfs: [] };
  }

  const kfs = [];
  for (const kf of getChildren(el, 'kf')) {
    const t = parseFloat(kf.getAttribute('t'));
    if (Number.isNaN(t)) continue;
    const v = parseNumberList(kf.getAttribute('v'));
    const e = kf.getAttribute('e') || null;
    kfs.push({
      t,
      v: v.length ? v : [0],
      e,
      easing: parseEasing(e)
    });
  }
  kfs.sort((a, b) => a.t - b.t);

  const parsedVal = parseNumberList(el.getAttribute('value'));
  let baseVal;
  if (parsedVal.length) {
    baseVal = parsedVal;
  } else if (kfs.length) {
    baseVal = kfs[0].v.slice();
  } else {
    baseVal = defaultVal.slice();
  }
  baseVal = padDimension(baseVal, dim, defaultVal);

  const normalizedKfs = kfs.map((kf) => ({
    ...kf,
    v: padDimension(kf.v, dim, baseVal)
  }));

  return { value: baseVal, kfs: normalizedKfs };
}

export function parseTransform(el) {
  const transform = {
    location: { value: [0, 0, 0], kfs: [] },
    scale: { value: [1, 1], kfs: [] },
    rotation: { value: [0], kfs: [] },
    opacity: { value: [1], kfs: [] },
    pivot: { value: [0, 0], kfs: [] },
    skew: { value: [0, 0], kfs: [] }
  };
  if (!el) return transform;

  for (const child of getChildren(el)) {
    switch (child.tagName) {
      case 'location':
        transform.location = parseKeyableChannel(child, 3, [0, 0, 0]);
        break;
      case 'scale':
        transform.scale = parseKeyableChannel(child, 2, [1, 1]);
        break;
      case 'rotation':
        transform.rotation = parseKeyableChannel(child, 1, [0]);
        break;
      case 'opacity':
        transform.opacity = parseKeyableChannel(child, 1, [1]);
        break;
      case 'pivot':
        transform.pivot = parseKeyableChannel(child, 2, [0, 0]);
        break;
      case 'skew':
        transform.skew = parseKeyableChannel(child, 2, [0, 0]);
        break;
      default:
        break;
    }
  }
  return transform;
}

export function parseGradient(el) {
  if (!el) return null;
  return {
    type: el.getAttribute('type') || 'linear',
    startColor: parseHexColor(el.getAttribute('startColor')),
    endColor: parseHexColor(el.getAttribute('endColor')),
    start: parseNumberList(el.getAttribute('start')),
    end: parseNumberList(el.getAttribute('end')),
    radius: parseNumberList(el.getAttribute('radius')),
    stops: getChildren(el, 'stop').map((stop) => ({
      t: parseFloat(stop.getAttribute('t')) || 0,
      color: parseHexColor(stop.getAttribute('color') || stop.getAttribute('value'))
    }))
  };
}

export function parsePathStroke(el) {
  if (!el) return null;
  const colEl = getChildren(el, 'color')[0];
  const sizeEl = getChildren(el, 'size')[0];
  return {
    enabled: el.getAttribute('enabled') !== 'false',
    direction: el.getAttribute('direction') || 'centered',
    cap: el.getAttribute('cap') || 'round',
    endSize: parseFloat(el.getAttribute('end-size')) || 1,
    color: parseHexColor(colEl ? colEl.getAttribute('value') : null),
    size: parseFloat(sizeEl ? sizeEl.getAttribute('value') : '') || 0
  };
}

export function parseShadow(el) {
  if (!el) return null;
  const colEl = getChildren(el, 'color')[0];
  const sizeEl = getChildren(el, 'size')[0];
  const offsetEl = getChildren(el, 'offset')[0];
  const opacityEl = getChildren(el, 'opacity')[0];
  const offset = parseNumberList(offsetEl ? offsetEl.getAttribute('value') : '');
  const color = colEl ? parseHexColor(colEl.getAttribute('value')) : [0, 0, 0, 1];
  const op = opacityEl ? parseFloat(opacityEl.getAttribute('value')) : NaN;
  if (Number.isFinite(op)) {
    color[3] *= op;
  } else if (!colEl) {
    color[3] = 0.5;
  }
  return {
    enabled: el.getAttribute('enabled') !== 'false',
    direction: el.getAttribute('direction') || 'outside',
    color,
    size: parseFloat(sizeEl ? sizeEl.getAttribute('value') : '') || 0,
    offset: [offset[0] || 0, offset[1] || 0]
  };
}

export function parseBorder(el) {
  if (!el) return null;
  const colEl = getChildren(el, 'color')[0];
  const sizeEl = getChildren(el, 'size')[0];
  return {
    direction: el.getAttribute('direction') || 'outside',
    color: colEl ? parseHexColor(colEl.getAttribute('value')) : [1, 1, 1, 1],
    size: parseFloat(sizeEl ? sizeEl.getAttribute('value') : '') || 0
  };
}

export function parseEffectElement(el) {
  const params = [];
  for (const prop of getChildren(el, 'property')) {
    const type = prop.getAttribute('type') || 'float';
    const valAttr = prop.getAttribute('value');
    let channel;
    if (type === 'color') {
      channel = { value: parseHexColor(valAttr), kfs: [] };
    } else if (type === 'bool' || type === 'switch') {
      channel = { value: [valAttr === 'true' || valAttr === '1' ? 1 : 0], kfs: [] };
    } else {
      channel = parseKeyableChannel(prop, TYPE_DIMENSIONS[type] || 1, [0]);
    }
    params.push({
      id: prop.getAttribute('name'),
      dataType: type,
      channel
    });
  }
  const id = el.getAttribute('id') || '';
  return {
    id,
    shortId: id.split('.').pop(),
    locallyApplied: el.getAttribute('locallyApplied') !== 'false',
    hidden: el.getAttribute('hidden') === 'true',
    params
  };
}

export function parsePropertyElement(el) {
  const type = el.getAttribute('type') || 'float';
  if (type === 'color') {
    return {
      dataType: type,
      channel: { value: parseHexColor(el.getAttribute('value')), kfs: [] }
    };
  }
  if (type === 'bool' || type === 'switch') {
    const v = el.getAttribute('value');
    return {
      dataType: type,
      channel: { value: [v === 'true' || v === '1' ? 1 : 0], kfs: [] }
    };
  }
  return {
    dataType: type,
    channel: parseKeyableChannel(el, TYPE_DIMENSIONS[type] || 1, [0])
  };
}

export function parseLayerElement(el, parseSceneFn = null) {
  const tag = el.tagName;
  const layer = {
    tag,
    id: el.getAttribute('id') || '',
    label: el.getAttribute('label') || '',
    startTime: parseFloat(el.getAttribute('startTime')) || 0,
    endTime: parseFloat(el.getAttribute('endTime')) || 0,
    inTime: parseFloat(el.getAttribute('inTime')) || 0,
    outTime: parseFloat(el.getAttribute('outTime')) || 0,
    src: el.getAttribute('src') || '',
    fillType: el.getAttribute('fillType') || '',
    fillImage: el.getAttribute('fillImage') || '',
    fillVideo: el.getAttribute('fillVideo') || '',
    mediaFillMode: el.getAttribute('mediaFillMode') || 'fill',
    hidden: el.getAttribute('hidden') === 'true',
    shapeType: (el.getAttribute('s') || '').trim(),
    cornerRadius: 0,
    shapeProps: {},
    strokes: [],
    cameraType: el.getAttribute('type') || 'perspective',
    fov: tag === 'camera' ? 60 : 0,
    parentId: el.getAttribute('parent') || '',
    parentLayer: null,
    blendMode: el.getAttribute('blending') || el.getAttribute('blendMode') || 'normal',
    speed: parseFloat(el.getAttribute('speed')) || 1,
    gain: { value: [1], kfs: [] },
    sourceXml: elementToXml(el),
    link: el.getAttribute('link') || '',
    fontSize: parseFloat(el.getAttribute('size')) || 18,
    font: el.getAttribute('font') || '',
    wrapWidth: parseFloat(el.getAttribute('wrapWidth')) || 0,
    align: el.getAttribute('align') || 'center',
    letterSpacing: parseFloat(el.getAttribute('letterSpacing')) || 0,
    lineSpacing: parseFloat(el.getAttribute('lineSpacing')) || 1,
    textContent: '',
    transform: {
      location: { value: [0, 0, 0], kfs: [] },
      scale: { value: [1, 1], kfs: [] },
      rotation: { value: [0], kfs: [] },
      opacity: { value: [1], kfs: [] },
      pivot: { value: [0, 0], kfs: [] },
      skew: { value: [0, 0], kfs: [] }
    },
    fillColor: [1, 1, 1, 1],
    gradient: null,
    path: null,
    pathStroke: null,
    shadow: null,
    border: null,
    size: { value: [100, 100], kfs: [] },
    effects: [],
    children: [],
    scene: null,
    focusBlur: null,
    fog: null
  };

  if (layer.endTime <= layer.startTime) {
    layer.endTime = layer.startTime + 1;
  }

  for (const child of getChildren(el)) {
    switch (child.tagName) {
      case 'content':
        layer.textContent = child.textContent || '';
        break;
      case 'transform':
        layer.transform = parseTransform(child);
        break;
      case 'fillType': {
        const valAttr = child.getAttribute('value');
        if (valAttr) layer.fillType = valAttr;
        const fc = getChildren(child, 'fillColor')[0];
        if (fc) layer.fillColor = parseHexColor(fc.getAttribute('value'));
        break;
      }
      case 'fillColor':
        layer.fillColor = parseHexColor(child.getAttribute('value'));
        break;
      case 'gradient':
        layer.gradient = parseGradient(child);
        break;
      case 'path':
        layer.path = parseSvgPath(child.getAttribute('d'));
        break;
      case 'path-stroke':
        layer.pathStroke = parsePathStroke(child);
        break;
      case 'shadow':
        layer.shadow = parseShadow(child);
        break;
      case 'border':
        layer.border = parseBorder(child);
        break;
      case 'effect':
        layer.effects.push(parseEffectElement(child));
        break;
      case 'stroke':
        if (tag === 'drawing') {
          layer.strokes.push({
            color: parseHexColor(child.getAttribute('color')),
            width: parseFloat(child.getAttribute('width')) || 0,
            type: child.getAttribute('type') || 'pen',
            points: parsePointsList(child.getAttribute('points'))
          });
        }
        break;
      case 'gain':
        layer.gain = parseKeyableChannel(child, 1, [1]);
        break;
      case 'fov': {
        const fovVal = parseFloat(child.getAttribute('value'));
        if (Number.isFinite(fovVal) && fovVal > 0) layer.fov = fovVal;
        break;
      }
      case 'focus-blur': {
        const dist = getChildren(child, 'distance')[0];
        const dof = getChildren(child, 'depth-of-field')[0];
        const str = getChildren(child, 'strength')[0];
        layer.focusBlur = {
          enabled: child.getAttribute('enabled') !== 'false',
          distance: dist ? parseFloat(dist.getAttribute('value')) || 500 : 500,
          depthOfField: dof ? parseFloat(dof.getAttribute('value')) || 100 : 100,
          strength: str ? parseFloat(str.getAttribute('value')) || 0.5 : 0.5
        };
        break;
      }
      case 'fog': {
        const col = getChildren(child, 'color')[0];
        const nz = getChildren(child, 'near-z')[0];
        const fz = getChildren(child, 'far-z')[0];
        layer.fog = {
          enabled: child.getAttribute('enabled') !== 'false',
          color: col ? parseHexColor(col.getAttribute('value')) : [1, 1, 1, 1],
          nearZ: nz ? parseFloat(nz.getAttribute('value')) || 0 : 0,
          farZ: fz ? parseFloat(fz.getAttribute('value')) || 500 : 500
        };
        break;
      }
      case 'property': {
        const name = child.getAttribute('name');
        if (name === 'size') {
          layer.size = parseKeyableChannel(child, 2, [0, 0]);
        } else if (name === 'cornerRadius') {
          layer.cornerRadius = parseFloat(child.getAttribute('value')) || 0;
        } else if (name === 'startAngle') {
          layer.startAngle = parseKeyableChannel(child, 1, [0]);
        } else if (name === 'endAngle') {
          layer.endAngle = parseKeyableChannel(child, 1, [360]);
        } else if (name === 'blendMode' || name === 'blending' || name === 'blend') {
          const bVal = child.getAttribute('value');
          if (bVal) layer.blendMode = bVal;
        }
        if (name) {
          layer.shapeProps[name] = parsePropertyElement(child);
        }
        break;
      }
      case 'scene':
        if (parseSceneFn) {
          layer.scene = parseSceneFn(child);
        }
        break;
      default:
        if (tag === 'group' && LAYER_TAG_NAMES.has(child.tagName)) {
          layer.children.push(parseLayerElement(child, parseSceneFn));
        }
        break;
    }
  }

  return layer;
}
