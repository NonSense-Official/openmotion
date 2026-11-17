import assert from 'node:assert/strict';
import { AffineMatrix2D } from '../src/engine/math/AffineMatrix2D.js';
import { PerspectiveMatrix4 } from '../src/engine/math/PerspectiveMatrix4.js';
import { SvgPathParser } from '../src/engine/math/SvgPathParser.js';

function approxEq(a, b, eps = 1e-4) {
  return Math.abs(a - b) <= eps;
}

function approxArray(arr1, arr2, eps = 1e-4) {
  assert.equal(arr1.length, arr2.length, 'Array lengths must match');
  for (let i = 0; i < arr1.length; i++) {
    assert.ok(
      approxEq(arr1[i], arr2[i], eps),
      `Element at [${i}] expected ${arr2[i]}, got ${arr1[i]}`
    );
  }
}

console.log('--- Testing AffineMatrix2D ---');
{
  const id = AffineMatrix2D.identity();
  approxArray(id.toArray(), [1, 0, 0, 1, 0, 0]);

  const t = AffineMatrix2D.fromTranslation(100, -50);
  const pt = t.transformPoint(10, 20);
  assert.equal(pt.x, 110);
  assert.equal(pt.y, -30);

  const s = AffineMatrix2D.fromScale(2, 3);
  const spt = s.transformPoint(5, 5);
  assert.equal(spt.x, 10);
  assert.equal(spt.y, 15);

  const r = AffineMatrix2D.fromRotationDeg(90);
  const rpt = r.transformPoint(10, 0);
  assert.ok(approxEq(rpt.x, 0));
  assert.ok(approxEq(rpt.y, 10));

  const comp = AffineMatrix2D.identity();
  comp.translate(50, 50).rotate(Math.PI / 4).scale(2, 2);
  const inv = comp.getInverse();
  assert.ok(inv !== null);

  const prod = comp.clone().multiply(inv);
  approxArray(prod.toArray(), [1, 0, 0, 1, 0, 0]);

  const pOrigin = { x: 23, y: 47 };
  const pScreen = comp.toScreenPoint(pOrigin.x, pOrigin.y);
  const pLayer = comp.toLayerPoint(pScreen.x, pScreen.y);
  assert.ok(approxEq(pLayer.x, pOrigin.x));
  assert.ok(approxEq(pLayer.y, pOrigin.y));

  const composed = AffineMatrix2D.fromTransform({
    location: [100, 200],
    scale: [2, 2],
    rotation: 45,
    pivot: [50, 50]
  });
  assert.ok(composed.determinant() > 0);

  const mapping = composed.computeLayerScreenMapping(200, 200, 1920, 1080);
  assert.ok(mapping.valid);
  assert.equal(mapping.toScreen.length, 16);
  assert.equal(mapping.toLayer.length, 16);
  assert.equal(mapping.centerPx[0], composed.e);
  assert.equal(mapping.centerPx[1], composed.f);

  const singular = new AffineMatrix2D(0, 0, 0, 0, 10, 10);
  assert.equal(singular.invert(), null);
  assert.equal(singular.toLayerPoint(10, 10), null);
}
console.log('✓ AffineMatrix2D passed all tests.');

console.log('--- Testing PerspectiveMatrix4 ---');
{
  const id4 = PerspectiveMatrix4.identity();
  approxArray(id4.toArray(), [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  const m4 = new PerspectiveMatrix4();
  m4.translate(10, 20, 30);
  m4.scale(2, 3, 4);
  m4.rotateX(0.5);
  m4.rotateY(0.3);
  m4.rotateZ(0.7);

  const inv4 = m4.getInverse();
  assert.ok(inv4 !== null);
  const prod4 = m4.clone().multiply(inv4);
  approxArray(prod4.toArray(), id4.toArray(), 1e-3);

  const orient = PerspectiveMatrix4.fromEuler(30, 45, 60);
  const euler = orient.toEuler();
  assert.ok(approxEq(euler.pitchDeg, 30, 0.1));
  assert.ok(approxEq(euler.yawDeg, 45, 0.1));
  assert.ok(approxEq(euler.rollDeg, 60, 0.1));

  const prs = PerspectiveMatrix4.fromPositionRotationScale(
    [100, 200, 300],
    [0, 90, 0],
    [2, 2, 2]
  );
  assert.ok(prs.elements[12] === 100);
  assert.ok(prs.elements[13] === 200);
  assert.ok(prs.elements[14] === 300);

  const proj = PerspectiveMatrix4.perspectiveFromFov(60, 1920, 1080, 1, 1000);
  assert.ok(proj.elements[0] > 0);
  assert.ok(proj.elements[5] > 0);
  assert.ok(proj.elements[11] === -1);

  const ortho = PerspectiveMatrix4.orthographic(-960, 960, -540, 540, -100, 100);
  assert.ok(ortho.elements[0] > 0);
  assert.ok(ortho.elements[5] > 0);
  assert.ok(ortho.elements[15] === 1);

  const camPersp = PerspectiveMatrix4.createCameraMatrix({
    cameraType: 'perspective',
    fov: 60,
    sceneWidth: 1920,
    sceneHeight: 1080
  });
  assert.ok(camPersp.elements[11] === -1);

  const camOrtho = PerspectiveMatrix4.createCameraMatrix({
    cameraType: 'orthographic',
    cameraZoom: 2,
    sceneWidth: 1920,
    sceneHeight: 1080
  });
  assert.ok(camOrtho.elements[15] === 1);

  const look = PerspectiveMatrix4.lookAt([0, 0, 500], [0, 0, 0], [0, 1, 0]);
  assert.ok(approxEq(look.elements[14], -500));

  const pt4 = proj.project(0, 0, -10, 1920, 1080);
  assert.ok(approxEq(pt4.x, 960, 1));
  assert.ok(approxEq(pt4.y, 540, 1));
}
console.log('✓ PerspectiveMatrix4 passed all tests.');

console.log('--- Testing SvgPathParser ---');
{
  const d1 = 'M 10 20 L 30 40 L 50 60 Z';
  const cmds1 = SvgPathParser.parseCommands(d1);
  assert.equal(cmds1.length, 4);
  assert.deepEqual(cmds1[0], ['M', 10, 20]);
  assert.deepEqual(cmds1[1], ['L', 30, 40]);
  assert.deepEqual(cmds1[2], ['L', 50, 60]);
  assert.deepEqual(cmds1[3], ['Z']);

  const { points, isClosed } = SvgPathParser.commandsToPoints(cmds1);
  assert.equal(isClosed, true);
  assert.equal(points.length, 3);
  assert.equal(points[0].x, 10);
  assert.equal(points[0].y, 20);
  assert.equal(points[0].type, 'corner');

  const backCmds = SvgPathParser.pointsToCommands(points, isClosed);
  assert.equal(backCmds.length, 4);
  assert.deepEqual(backCmds[0], ['M', 10, 20]);
  assert.deepEqual(backCmds[1], ['L', 30, 40]);
  assert.deepEqual(backCmds[2], ['L', 50, 60]);
  assert.deepEqual(backCmds[3], ['Z']);

  const dCubic = 'M 0 0 C 10 20, 30 40, 50 60 Z';
  const cubicParsed = SvgPathParser.parse(dCubic);
  assert.equal(cubicParsed.commands.length, 3);
  assert.equal(cubicParsed.points[1].type, 'curved');
  assert.deepEqual(cubicParsed.points[0].out, [10, 20]);
  assert.deepEqual(cubicParsed.points[1].in, [30, 40]);
  assert.equal(cubicParsed.points[1].x, 50);
  assert.equal(cubicParsed.points[1].y, 60);

  const dRel = 'm 10 10 h 20 v 20 c 5 5 10 10 15 15 s 10 10 20 20 z';
  const relCmds = SvgPathParser.parseCommands(dRel);
  assert.ok(relCmds.length >= 6);
  assert.deepEqual(relCmds[0], ['M', 10, 10]);
  assert.deepEqual(relCmds[1], ['L', 30, 10]);
  assert.deepEqual(relCmds[2], ['L', 30, 30]);

  const dQuad = 'M 0 0 Q 50 100 100 0 Z';
  const quadCmds = SvgPathParser.parseCommands(dQuad);
  assert.equal(quadCmds[1][0], 'C');
  assert.equal(quadCmds[1][5], 100);
  assert.equal(quadCmds[1][6], 0);

  const bounds = SvgPathParser.computeBounds(cmds1);
  assert.equal(bounds.minX, 10);
  assert.equal(bounds.maxX, 50);
  assert.equal(bounds.minY, 20);
  assert.equal(bounds.maxY, 60);
  assert.equal(bounds.w, 40);
  assert.equal(bounds.h, 40);

  const svgStr = SvgPathParser.commandsToSvg(cmds1);
  assert.equal(svgStr, 'M 10 20 L 30 40 L 50 60 Z');

  const pSvgStr = SvgPathParser.pointsToSvg(points, isClosed);
  assert.equal(pSvgStr, 'M 10 20 L 30 40 L 50 60 Z');
}
console.log('✓ SvgPathParser passed all tests.');
console.log('All tests passed successfully!');
