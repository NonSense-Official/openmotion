import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
global.DOMParser = DOMParser;

import { parseAlightXml } from '../src/engine/parser/XmlSceneParser.js';

const xml = fs.readFileSync('storage/projects/i7oE822sn7F2nBAwploDBk/scene.xml', 'utf8');
const scene = parseAlightXml(xml, 'test');
console.log('Parsed scene:', {
  title: scene.title,
  width: scene.width,
  height: scene.height,
  layersCount: scene.layers.length,
  mediaCount: scene.media.length,
  audioCount: scene.audio.length,
  totalTime: scene.totalTime
});
console.log('Sample layers:', scene.layers.slice(0, 5).map(l => ({
  id: l.id,
  tag: l.tag,
  label: l.label,
  shapeType: l.shapeType,
  start: l.startTime,
  end: l.endTime,
  parent: l.parentId
})));
