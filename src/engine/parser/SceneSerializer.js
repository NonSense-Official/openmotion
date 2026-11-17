import { escapeXml, formatHexColor } from './parserUtils.js';

export function serializeScene(scene) {
  if (!scene) return '';
  return "<?xml version='1.0' encoding='UTF-8' ?>" + serializeSceneInner(scene);
}

function serializeSceneInner(sc) {
  const bg = formatHexColor(sc.bgcolor);
  const w = sc.width || 1080;
  const h = sc.height || 1920;
  const ew = sc.exportWidth || w;
  const eh = sc.exportHeight || h;
  const total = sc.totalTime || 10000;
  const fps = sc.fps || 30;
  const pre = sc.precompose ? ` precompose="${escapeXml(sc.precompose)}"` : '';

  let xml = `<scene title="${escapeXml(sc.title || '')}" width="${w}" height="${h}" exportWidth="${ew}" exportHeight="${eh}"${pre} bgcolor="${bg}" totalTime="${total}" fps="${fps}" modifiedTime="${Date.now()}" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false">`;

  const mediaMap = new Map();
  (sc.media || []).forEach((m) => {
    if (m.uri && !mediaMap.has(m.uri)) mediaMap.set(m.uri, m);
  });
  for (const m of mediaMap.values()) {
    xml += `<media uri="${escapeXml(m.uri)}" type="${escapeXml(m.type || '')}" filename="${escapeXml(m.filename || '')}" title="${escapeXml(m.title || '')}" duration="${m.duration || 0}" width="${m.width || 0}" height="${m.height || 0}" orientation="${m.orientation || 0}" />`;
  }

  (sc.bookmarks || []).forEach((t) => {
    xml += `<bookmark t="${t}" />`;
  });

  (sc.layers || []).forEach((l) => {
    xml += serializeLayer(l);
  });

  xml += '</scene>';
  return xml;
}

export function serializeLayer(layer) {
  if (!layer) return '';

  if ((layer.path || layer.pathStroke || (layer.strokes && layer.strokes.length)) && layer.sourceXml) {
    return patchSourceXml(layer);
  }

  const tag = layer.tag || 'shape';
  const id = layer.id || `layer_${Date.now().toString(36)}`;
  let attrs = ` id="${escapeXml(id)}" label="${escapeXml(layer.label || '')}" startTime="${layer.startTime || 0}" endTime="${layer.endTime || 0}"`;

  if (layer.inTime) attrs += ` inTime="${layer.inTime}"`;
  if (layer.outTime) attrs += ` outTime="${layer.outTime}"`;
  if (layer.hidden) attrs += ' hidden="true"';
  if (layer.blendMode && layer.blendMode !== 'normal') attrs += ` blending="${escapeXml(layer.blendMode)}"`;
  if (layer.speed && layer.speed !== 1) attrs += ` speed="${layer.speed}"`;
  if (layer.parentId) attrs += ` parent="${escapeXml(layer.parentId)}"`;

  if (tag === 'shape') {
    if (layer.shapeType) attrs += ` s="${escapeXml(layer.shapeType)}"`;
    if (layer.fillType) attrs += ` fillType="${escapeXml(layer.fillType)}"`;
    if (layer.mediaFillMode && layer.fillType === 'media') attrs += ` mediaFillMode="${escapeXml(layer.mediaFillMode)}"`;
    if (layer.fillType === 'media') {
      if (layer.fillImage) attrs += ` fillImage="${escapeXml(layer.fillImage)}"`;
      if (layer.fillVideo) attrs += ` fillVideo="${escapeXml(layer.fillVideo)}"`;
    }
  } else if (tag === 'text') {
    if (layer.font) attrs += ` font="${escapeXml(layer.font)}"`;
    if (layer.fontSize) attrs += ` size="${layer.fontSize}"`;
    if (layer.align && layer.align !== 'center') attrs += ` align="${escapeXml(layer.align)}"`;
    if (layer.wrapWidth) attrs += ` wrapWidth="${layer.wrapWidth}"`;
    if (layer.letterSpacing) attrs += ` letterSpacing="${layer.letterSpacing}"`;
    if (layer.lineSpacing && layer.lineSpacing !== 1) attrs += ` lineSpacing="${layer.lineSpacing}"`;
  } else if (tag === 'audio' && layer.src) {
    attrs += ` src="${escapeXml(layer.src)}"`;
  } else if (tag === 'camera') {
    attrs += ` type="${escapeXml(layer.cameraType || 'perspective')}"`;
  }

  let children = serializeTransform(layer.transform);

  if ((tag === 'shape' || tag === 'text') && layer.fillType !== 'media' && layer.fillColor) {
    children += `<fillColor value="${formatHexColor(layer.fillColor)}" />`;
  }

  if (tag === 'shape' && layer.fillType === 'gradient' && layer.gradient) {
    const g = layer.gradient;
    const sStr = (g.start || [0, 0]).join(',');
    const eStr = (g.end || [1, 0]).join(',');
    children += `<gradient type="${escapeXml(g.type || 'linear')}" start="${sStr}" end="${eStr}" startColor="${formatHexColor(g.startColor)}" endColor="${formatHexColor(g.endColor)}">`;
    for (const st of g.stops || []) {
      children += `<stop t="${st.t}" color="${formatHexColor(st.color)}" />`;
    }
    children += '</gradient>';
  }

  if (tag === 'shape' && layer.size) {
    children += serializeProperty('size', 'vec2', { dataType: 'vec2', channel: layer.size });
  }

  if (layer.shapeProps) {
    for (const [name, data] of Object.entries(layer.shapeProps)) {
      if (name === 'size' || name === 'blendMode' || name === 'blending' || !data) continue;
      const dt = data.dataType || (name === 'cornerRadius' || name === 'startAngle' || name === 'endAngle' ? 'float' : 'float');
      children += serializeProperty(name, dt, data);
    }
  }

  if (tag === 'text' || layer.textContent) {
    children += `<content>${escapeXml(layer.textContent || '')}</content>`;
  }

  if (layer.gain && (layer.gain.value && layer.gain.value[0] !== 1 || (layer.gain.kfs || []).length)) {
    children += serializeKeyable('gain', layer.gain);
  }

  if (tag === 'camera') {
    if (layer.fov > 0) children += `<fov value="${layer.fov}" />`;
    if (layer.focusBlur) {
      const fb = layer.focusBlur;
      children += `<focus-blur enabled="${fb.enabled ? 'true' : 'false'}"><distance value="${fb.distance != null ? fb.distance : 500}" /><depth-of-field value="${fb.depthOfField != null ? fb.depthOfField : 100}" /><strength value="${fb.strength != null ? fb.strength : 0.5}" /></focus-blur>`;
    }
    if (layer.fog) {
      const fg = layer.fog;
      const cHex = fg.color ? formatHexColor(fg.color) : '#ffffffff';
      children += `<fog enabled="${fg.enabled ? 'true' : 'false'}"><color value="${cHex}" /><near-z value="${fg.nearZ != null ? fg.nearZ : 0}" /><far-z value="${fg.farZ != null ? fg.farZ : 500}" /></fog>`;
    }
  } else if (layer.fov > 0) {
    children += `<fov value="${layer.fov}" />`;
  }

  if (layer.border) {
    children += `<border direction="${escapeXml(layer.border.direction || 'outside')}"><color value="${formatHexColor(layer.border.color)}"/><size value="${layer.border.size || 0}" /></border>`;
  }

  if (layer.shadow) {
    const dis = layer.shadow.enabled === false ? ' enabled="false"' : '';
    children += `<shadow${dis} direction="${escapeXml(layer.shadow.direction || 'outside')}"><color value="${formatHexColor(layer.shadow.color)}"/><size value="${layer.shadow.size || 0}"/><offset value="${(layer.shadow.offset || [0, 0]).join(',')}" /></shadow>`;
  }

  if (layer.path && layer.path.commands) {
    const dStr = layer.path.commands.map((c) => c.join(' ')).join(' ');
    children += `<path d="${escapeXml(dStr)}" />`;
  }

  if (layer.pathStroke) {
    const en = layer.pathStroke.enabled !== false ? 'true' : 'false';
    children += `<path-stroke enabled="${en}" direction="${escapeXml(layer.pathStroke.direction || 'centered')}" cap="${escapeXml(layer.pathStroke.cap || 'round')}"><color value="${formatHexColor(layer.pathStroke.color)}"/><size value="${layer.pathStroke.size || 0}"/></path-stroke>`;
  }

  if (layer.strokes && layer.strokes.length) {
    for (const s of layer.strokes) {
      const pts = (s.points || []).map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)},${(p[2] != null ? p[2] : 1).toFixed(2)}`).join(';');
      children += `<stroke color="${formatHexColor(s.color)}" width="${s.width || 0}" type="${escapeXml(s.type || 'pen')}" points="${pts}" />`;
    }
  }

  (layer.effects || []).forEach((e) => {
    children += serializeEffect(e);
  });

  if (layer.scene) {
    children += serializeSceneInner(layer.scene);
  }

  (layer.children || []).forEach((c) => {
    children += serializeLayer(c);
  });

  if (!children) return `<${tag}${attrs} />`;
  return `<${tag}${attrs}>${children}</${tag}>`;
}

export function serializeTransform(tr) {
  if (!tr) return '';
  let out = '<transform>';
  out += serializeKeyable('location', tr.location);
  out += serializeKeyable('scale', tr.scale);
  out += serializeKeyable('rotation', tr.rotation);
  out += serializeKeyable('opacity', tr.opacity);

  if (tr.pivot && ((tr.pivot.value && (tr.pivot.value[0] || tr.pivot.value[1])) || (tr.pivot.kfs || []).length)) {
    out += serializeKeyable('pivot', tr.pivot);
  }
  if (tr.skew && ((tr.skew.value && (tr.skew.value[0] || tr.skew.value[1])) || (tr.skew.kfs || []).length)) {
    out += serializeKeyable('skew', tr.skew);
  }
  return out + '</transform>';
}

function serializeKeyable(tag, key) {
  if (!key || (!key.value && !(key.kfs || []).length)) return '';
  const inner = (key.kfs || []).map((f) => `<kf t="${f.t}" v="${(f.v || []).join(',')}"${f.e ? ` e="${escapeXml(f.e)}"` : ''}/>`).join('');
  const val = (key.value || []).join(',');
  return inner ? `<${tag} value="${val}">${inner}</${tag}>` : `<${tag} value="${val}" />`;
}

function serializeProperty(name, dataType, data) {
  const ch = data.channel || data;
  let val;
  if (dataType === 'color') val = formatHexColor(ch.value);
  else if (dataType === 'bool' || dataType === 'switch') val = (ch.value && ch.value[0]) ? 'true' : 'false';
  else val = (ch.value || []).join(',');

  const inner = (ch.kfs || []).map((f) => `<kf t="${f.t}" v="${(f.v || []).join(',')}"${f.e ? ` e="${escapeXml(f.e)}"` : ''}/>`).join('');
  return inner
    ? `<property name="${escapeXml(name)}" type="${escapeXml(dataType || 'float')}" value="${val}">${inner}</property>`
    : `<property name="${escapeXml(name)}" type="${escapeXml(dataType || 'float')}" value="${val}" />`;
}

function serializeEffect(e) {
  const props = (e.params || []).map((p) => {
    const ch = p.channel ? { dataType: p.dataType, channel: p.channel } : p;
    return serializeProperty(p.id, p.dataType, ch);
  }).join('');
  return `<effect id="${escapeXml(e.id)}" locallyApplied="${e.locallyApplied !== false}"${e.hidden ? ' hidden="true"' : ''}>${props}</effect>`;
}

function patchSourceXml(layer) {
  let xml = layer.sourceXml || '';
  if (!xml) return '';
  xml = xml.replace(/\sstartTime="[^"]*"/, ` startTime="${layer.startTime || 0}"`);
  xml = xml.replace(/\sendTime="[^"]*"/, ` endTime="${layer.endTime || 0}"`);
  if (layer.label != null && /\slabel="[^"]*"/.test(xml)) {
    xml = xml.replace(/\slabel="[^"]*"/, ` label="${escapeXml(layer.label)}"`);
  }
  if (layer.fillType) {
    if (/\sfillType="[^"]*"/.test(xml)) {
      xml = xml.replace(/\sfillType="[^"]*"/, ` fillType="${escapeXml(layer.fillType)}"`);
    }
  }
  if (layer.fillImage) {
    if (/\sfillImage="[^"]*"/.test(xml)) {
      xml = xml.replace(/\sfillImage="[^"]*"/, ` fillImage="${escapeXml(layer.fillImage)}"`);
    } else {
      xml = xml.replace(/^<([a-zA-Z]+)/, `<$1 fillImage="${escapeXml(layer.fillImage)}"`);
    }
  }
  if (layer.fillVideo) {
    if (/\sfillVideo="[^"]*"/.test(xml)) {
      xml = xml.replace(/\sfillVideo="[^"]*"/, ` fillVideo="${escapeXml(layer.fillVideo)}"`);
    } else {
      xml = xml.replace(/^<([a-zA-Z]+)/, `<$1 fillVideo="${escapeXml(layer.fillVideo)}"`);
    }
  }
  if (layer.hidden) {
    xml = /\shidden=/.test(xml)
      ? xml.replace(/\shidden="[^"]*"/, ' hidden="true"')
      : xml.replace(/^<([a-zA-Z]+)/, `<$1 hidden="true"`);
  }
  if (layer.parentId) {
    if (/\sparent="[^"]*"/.test(xml)) {
      xml = xml.replace(/\sparent="[^"]*"/, ` parent="${escapeXml(layer.parentId)}"`);
    } else {
      xml = xml.replace(/^<([a-zA-Z]+)/, `<$1 parent="${escapeXml(layer.parentId)}"`);
    }
  } else {
    xml = xml.replace(/\sparent="[^"]*"/, '');
  }
  return xml;
}
