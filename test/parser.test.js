import assert from 'node:assert';
import { DOMParser } from '@xmldom/xmldom';
globalThis.DOMParser = DOMParser;

import { parseAlightXml, parseSceneXml } from '../src/engine/parser/XmlSceneParser.js';
import { serializeScene, serializeLayer, serializeTransform } from '../src/engine/parser/SceneSerializer.js';
import { parseKeyableChannel, parseTransform, parseEffectElement } from '../src/engine/parser/XmlLayerParser.js';
import { parseHexColor, formatHexColor } from '../src/engine/parser/parserUtils.js';

console.log('--- TEST 1: Color conversions ---');
{
  const rgba = parseHexColor('#ffff0000');
  assert.strictEqual(rgba[0], 1, 'Red channel');
  assert.strictEqual(rgba[1], 0, 'Green channel');
  assert.strictEqual(rgba[2], 0, 'Blue channel');
  assert.strictEqual(rgba[3], 1, 'Alpha channel');
  const hex = formatHexColor(rgba);
  assert.strictEqual(hex.toLowerCase(), '#ffff0000', 'Hex output formatting');
  console.log('✓ Color conversion passed');
}

console.log('--- TEST 2: Parsing authentic XML scene ---');
const sampleXml = `<?xml version='1.0' encoding='UTF-8' ?>
<scene title="Sample Project" width="1080" height="1920" exportWidth="1080" exportHeight="1920" bgcolor="#ff121212" totalTime="5000" fps="30" amver="1028425" ffver="106">
  <media uri="media://img1.png" type="image/png" filename="img1.png" title="Background" duration="0" width="1920" height="1080" orientation="0" />
  <bookmark t="1000" />
  <bookmark t="2500" />
  <audio id="audio_1" label="Background Music" src="blob:audio1" startTime="0" endTime="5000" inTime="0" outTime="5000">
    <gain value="1">
      <kf t="0" v="0" e="linear" />
      <kf t="1" v="1" e="linear" />
    </gain>
  </audio>
  <shape id="shape_bg" label="BG Rect" s=".rect" fillType="color" startTime="0" endTime="5000">
    <transform>
      <location value="0,0,0">
        <kf t="0" v="0,0,0" e="linear" />
        <kf t="1" v="100,50,0" e="cubicBezier 0.25 0.1 0.25 1" />
      </location>
      <scale value="1,1" />
      <rotation value="0" />
      <opacity value="1" />
    </transform>
    <fillColor value="#ffffffff" />
    <property name="size" type="vec2" value="1080,1920" />
  </shape>
  <text id="text_title" label="Title Text" font="Roboto-Bold" size="48" align="center" startTime="500" endTime="4500" parent="shape_bg">
    <transform>
      <location value="0,-200,0" />
      <scale value="1,1" />
      <rotation value="15" />
      <opacity value="0.8" />
    </transform>
    <fillColor value="#ffffcc00" />
    <content>Hello OpenMotion</content>
    <effect id="am.blur.gaussian" locallyApplied="true">
      <property name="strength" type="float" value="0.35">
        <kf t="0" v="0" />
        <kf t="1" v="0.35" />
      </property>
    </effect>
  </text>
  <camera id="cam_main" label="Camera 1" type="perspective" startTime="0" endTime="5000">
    <transform>
      <location value="0,0,-1000" />
      <scale value="1,1" />
      <rotation value="0" />
      <opacity value="1" />
    </transform>
    <fov value="60" />
    <focus-blur enabled="true">
      <distance value="600" />
      <depth-of-field value="150" />
      <strength value="0.8" />
    </focus-blur>
  </camera>
</scene>`;

{
  const scene = parseAlightXml(sampleXml, 'test.xml');
  assert.strictEqual(scene.title, 'Sample Project');
  assert.strictEqual(scene.width, 1080);
  assert.strictEqual(scene.height, 1920);
  assert.strictEqual(scene.fps, 30);
  assert.strictEqual(scene.totalTime, 5000);
  assert.strictEqual(scene.bookmarks.length, 2);
  assert.strictEqual(scene.bookmarks[0], 1000);
  assert.strictEqual(scene.bookmarks[1], 2500);
  assert.strictEqual(scene.media.length, 1);
  assert.strictEqual(scene.media[0].filename, 'img1.png');

  // Layers
  assert.strictEqual(scene.layers.length, 4, 'Should have 4 layers (audio, shape, text, camera)');
  
  const audioLayer = scene.layers.find((l) => l.tag === 'audio');
  assert(audioLayer, 'audio layer exists');
  assert.strictEqual(audioLayer.gain.kfs.length, 2);

  const shapeLayer = scene.layers.find((l) => l.id === 'shape_bg');
  assert(shapeLayer, 'shape layer exists');
  assert.strictEqual(shapeLayer.transform.location.kfs.length, 2);
  assert.strictEqual(shapeLayer.transform.location.kfs[1].v[0], 100);

  const textLayer = scene.layers.find((l) => l.id === 'text_title');
  assert(textLayer, 'text layer exists');
  assert.strictEqual(textLayer.textContent, 'Hello OpenMotion');
  assert.strictEqual(textLayer.fontSize, 48);
  assert.strictEqual(textLayer.parentId, 'shape_bg');
  assert.strictEqual(textLayer.parentLayer, shapeLayer, 'Parent layer should be linked');
  assert.strictEqual(textLayer.effects.length, 1);
  assert.strictEqual(textLayer.effects[0].id, 'am.blur.gaussian');
  assert.strictEqual(textLayer.effects[0].params[0].id, 'strength');

  const camLayer = scene.layers.find((l) => l.tag === 'camera');
  assert(camLayer, 'camera layer exists');
  assert.strictEqual(camLayer.fov, 60);
  assert.strictEqual(camLayer.focusBlur.enabled, true);
  assert.strictEqual(camLayer.focusBlur.distance, 600);

  console.log('✓ Scene parsing verified successfully');
}

console.log('--- TEST 3: Serialization and round-trip ---');
{
  const scene = parseAlightXml(sampleXml, 'test.xml');
  const serialized = serializeScene(scene);
  assert(serialized.startsWith("<?xml version='1.0' encoding='UTF-8' ?>"));
  assert(serialized.includes('<scene title="Sample Project"'));
  assert(serialized.includes('<media uri="media://img1.png"'));
  assert(serialized.includes('<bookmark t="1000" />'));
  assert(serialized.includes('<content>Hello OpenMotion</content>'));
  assert(serialized.includes('<effect id="am.blur.gaussian"'));

  // Parse serialized back
  const scene2 = parseSceneXml(serialized);
  assert.strictEqual(scene2.title, scene.title);
  assert.strictEqual(scene2.width, scene.width);
  assert.strictEqual(scene2.height, scene.height);
  assert.strictEqual(scene2.fps, scene.fps);
  assert.strictEqual(scene2.totalTime, scene.totalTime);
  assert.strictEqual(scene2.layers.length, scene.layers.length);

  const text2 = scene2.layers.find((l) => l.id === 'text_title');
  assert.strictEqual(text2.textContent, 'Hello OpenMotion');
  assert.strictEqual(text2.fontSize, 48);
  assert.strictEqual(text2.parentLayer.id, 'shape_bg');

  console.log('✓ Scene serialization & round-trip verified successfully');
}

console.log('--- TEST 4: Error handling and cycle detection ---');
{
  assert.throws(() => parseSceneXml(''), /empty or invalid/);
  assert.throws(() => parseSceneXml('<root><notscene /></root>'), /Missing <scene>/);

  // Cycle detection
  const cyclicXml = `<?xml version='1.0' encoding='UTF-8' ?>
  <scene width="1080" height="1920">
    <shape id="l1" parent="l2" />
    <shape id="l2" parent="l1" />
  </scene>`;
  const cyclicScene = parseSceneXml(cyclicXml);
  assert.strictEqual(cyclicScene.layers[0].parentLayer, null, 'Cycle in l1 should be broken');
  assert.strictEqual(cyclicScene.layers[1].parentLayer.id, 'l1', 'l2 points to l1 whose cycle was broken');

  console.log('✓ Error handling & cycle detection verified');
}

console.log('\nALL PARSER AND SERIALIZER TESTS PASSED!');
