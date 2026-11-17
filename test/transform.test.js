import assert from 'node:assert/strict';
import { TransformResolver } from '../src/engine/renderer/TransformResolver.js';

console.log('--- Testing TransformResolver Static & Animated ---');
{
  const staticLayer = {
    id: 'l1',
    transform: {
      location: [100, 200],
      scale: [2, 3],
      rotation: 45,
      pivot: [10, 20],
      skew: [0, 0]
    },
    opacity: 0.8
  };

  const props = TransformResolver.evaluateLayerProperties(staticLayer, 500, 720, 1280);
  assert.deepEqual(props.location, [100, 200]);
  assert.deepEqual(props.scale, [2, 3]);
  assert.equal(props.rotation, 45);
  assert.deepEqual(props.pivot, [10, 20]);
  assert.equal(props.opacity, 0.8);

  const animLayer = {
    id: 'l2',
    transform: {
      location: {
        kfs: [
          { t: 0, v: [0, 0] },
          { t: 1000, v: [100, 200] }
        ]
      },
      rotation: {
        kfs: [
          { t: 0, v: 0 },
          { t: 1000, v: 90 }
        ]
      }
    },
    opacity: 1.0
  };

  const propsMid = TransformResolver.evaluateLayerProperties(animLayer, 500, 720, 1280);
  assert.ok(Math.abs(propsMid.location[0] - 50) < 1e-4);
  assert.ok(Math.abs(propsMid.location[1] - 100) < 1e-4);
  assert.ok(Math.abs(propsMid.rotation - 45) < 1e-4);
}

console.log('--- Testing TransformResolver Hierarchy & Shader Transform ---');
{
  const parent = {
    id: 'p1',
    transform: {
      location: [100, 100],
      scale: [2, 2],
      rotation: 0
    },
    opacity: 0.5
  };

  const child = {
    id: 'c1',
    parentId: 'p1',
    transform: {
      location: [50, 50],
      scale: [1, 1],
      rotation: 0
    },
    opacity: 0.8
  };

  const map = new Map([['p1', parent], ['c1', child]]);
  const res = TransformResolver.computeWorldMatrix(child, 0, 720, 1280, map);
  assert.ok(Math.abs(res.opacity - 0.4) < 1e-4, 'Child opacity multiplied by parent');

  const shaderTransform = TransformResolver.computeShaderTransform(res.matrix, 100, 100, 720, 1280);
  assert.equal(shaderTransform.length, 9);
  assert.equal(shaderTransform[8], 1);
}

console.log('All TransformResolver tests PASSED!');
