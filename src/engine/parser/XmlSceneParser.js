import { parseHexColor, getChildren } from './parserUtils.js';
import { parseLayerElement, LAYER_TAG_NAMES } from './XmlLayerParser.js';

export function parseAlightXml(xmlText, filename = '') {
  return parseSceneXml(xmlText, filename);
}

export function parseSceneXml(xmlText, filename = '') {
  if (typeof xmlText !== 'string' || !xmlText.trim()) {
    throw new Error('Scene XML is empty or invalid.');
  }

  const ParserClass = typeof DOMParser !== 'undefined' ? DOMParser : globalThis.DOMParser;
  if (!ParserClass) {
    throw new Error('No DOMParser available in current runtime environment.');
  }
  const parser = new ParserClass();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const errorNode = doc.getElementsByTagName('parsererror')[0];
  if (errorNode) {
    throw new Error(`${filename || 'XML'}: XML parse error: ${errorNode.textContent || 'invalid XML'}`);
  }

  let sceneEl = doc.documentElement;
  if (!sceneEl || sceneEl.tagName !== 'scene') {
    sceneEl = doc.getElementsByTagName('scene')[0];
  }
  if (!sceneEl) {
    throw new Error(`${filename || 'XML'}: Missing <scene> root element.`);
  }

  const scene = parseSceneElement(sceneEl, filename);
  scene.filename = filename;
  return scene;
}

export function parseSceneElement(sceneEl, filename = '') {
  const width = parseFloat(sceneEl.getAttribute('width')) || 1080;
  const height = parseFloat(sceneEl.getAttribute('height')) || 1920;

  const scene = {
    title: sceneEl.getAttribute('title') || '',
    width,
    height,
    totalTime: parseFloat(sceneEl.getAttribute('totalTime')) || 0,
    fps: parseFloat(sceneEl.getAttribute('fps')) || 30,
    bgcolor: parseHexColor(sceneEl.getAttribute('bgcolor')),
    exportWidth: parseFloat(sceneEl.getAttribute('exportWidth')) || width,
    exportHeight: parseFloat(sceneEl.getAttribute('exportHeight')) || height,
    precompose: sceneEl.getAttribute('precompose') || '',
    media: [],
    audio: [],
    bookmarks: [],
    layers: [],
    filename: filename || '',
    layerById: new Map()
  };

  for (const child of getChildren(sceneEl)) {
    const tag = child.tagName;
    if (tag === 'media') {
      scene.media.push({
        uri: child.getAttribute('uri') || '',
        type: child.getAttribute('type') || '',
        filename: child.getAttribute('filename') || '',
        title: child.getAttribute('title') || '',
        duration: parseFloat(child.getAttribute('duration')) || 0,
        width: parseFloat(child.getAttribute('width')) || 0,
        height: parseFloat(child.getAttribute('height')) || 0,
        orientation: parseFloat(child.getAttribute('orientation')) || 0
      });
    } else if (tag === 'audio') {
      const audioLayer = parseLayerElement(child, (el) => parseSceneElement(el));
      scene.audio.push({
        id: child.getAttribute('id') || '',
        label: child.getAttribute('label') || '',
        src: child.getAttribute('src') || '',
        startTime: parseFloat(child.getAttribute('startTime')) || 0,
        endTime: parseFloat(child.getAttribute('endTime')) || 0,
        inTime: parseFloat(child.getAttribute('inTime')) || 0,
        outTime: parseFloat(child.getAttribute('outTime')) || 0
      });
      scene.layers.push(audioLayer);
    } else if (tag === 'bookmark') {
      scene.bookmarks.push(parseFloat(child.getAttribute('t')) || 0);
    } else if (LAYER_TAG_NAMES.has(tag)) {
      scene.layers.push(parseLayerElement(child, (el) => parseSceneElement(el)));
    }
  }

  resolveMediaMetadata(scene);
  resolveLayerHierarchy(scene);

  return scene;
}

function resolveMediaMetadata(scene) {
  if (!scene || !Array.isArray(scene.media) || !scene.media.length) return;

  const mediaMap = new Map();
  for (const m of scene.media) {
    if (m.uri) mediaMap.set(m.uri, m);
    if (m.filename) mediaMap.set(m.filename, m);
    if (m.title) mediaMap.set(m.title, m);
  }

  const walkLayers = (layers) => {
    if (!layers || !Array.isArray(layers)) return;
    for (const l of layers) {
      const target = l.fillVideo || l.fillImage || l.src || '';
      const matched = target ? mediaMap.get(target) : null;
      if (matched) {
        l.mediaNativeWidth = matched.width || 0;
        l.mediaNativeHeight = matched.height || 0;
        l.mediaOrientation = ((Number(matched.orientation) || 0) % 360 + 360) % 360;
        l.mediaName = matched.filename || matched.title || matched.name || '';
      }
      if (l.children && l.children.length) walkLayers(l.children);
      if (l.scene) walkLayers(l.scene.layers);
    }
  };

  walkLayers(scene.layers);
}

function resolveLayerHierarchy(scene) {
  const map = new Map();

  const registerLayers = (layers) => {
    if (!layers || !Array.isArray(layers)) return;
    for (const l of layers) {
      if (l.id) map.set(l.id, l);
      if (l.children && l.children.length) registerLayers(l.children);
      if (l.scene && l.scene.layers) registerLayers(l.scene.layers);
    }
  };
  registerLayers(scene.layers);

  const linkParents = (layers) => {
    if (!layers || !Array.isArray(layers)) return;
    for (const l of layers) {
      if (l.parentId) {
        const parent = map.get(l.parentId);
        l.parentLayer = parent && parent !== l ? parent : null;
      } else {
        l.parentLayer = null;
      }
      if (l.children && l.children.length) linkParents(l.children);
      if (l.scene && l.scene.layers) linkParents(l.scene.layers);
    }
  };
  linkParents(scene.layers);

  for (const layer of map.values()) {
    let depth = 0;
    let curr = layer.parentLayer;
    while (curr && depth++ < 64) {
      if (curr === layer) {
        layer.parentLayer = null;
        break;
      }
      curr = curr.parentLayer;
    }
  }

  scene.layerById = map;
}
