import assert from 'node:assert/strict';
import { LayerCompositor } from '../src/engine/renderer/LayerCompositor.js';
import { WebGLRenderer } from '../src/engine/renderer/WebGLRenderer.js';

function createMockGL() {
  const state = {
    calls: [],
    enabledCaps: new Set(),
    currentProgram: null,
    boundTextures: {},
    activeTextureUnit: 0,
    viewport: [0, 0, 0, 0],
    clearColor: [0, 0, 0, 0],
    blendFunc: [0, 0],
    uniforms: {},
    drawnArrays: []
  };

  const gl = {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    STREAM_DRAW: 35040,
    FLOAT: 5126,
    BLEND: 3042,
    COLOR_BUFFER_BIT: 16384,
    TRIANGLES: 4,
    TEXTURE0: 33984,
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    CLAMP_TO_EDGE: 33071,
    REPEAT: 10497,
    LINEAR: 9729,
    NEAREST: 9728,
    ONE: 1,
    ZERO: 0,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
    DST_COLOR: 774,
    ONE_MINUS_SRC_COLOR: 769,
    FRAMEBUFFER: 36160,
    COLOR_ATTACHMENT0: 36064,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
    UNPACK_FLIP_Y_WEBGL: 37440,
    LINK_STATUS: 35714,
    COMPILE_STATUS: 35713,

    _state: state,

    createBuffer: () => ({ id: Math.random() }),
    bindBuffer: (target, buf) => state.calls.push({ method: 'bindBuffer', target, buf }),
    bufferData: (target, data, usage) => state.calls.push({ method: 'bufferData', target, length: data.length, usage }),
    deleteBuffer: (buf) => state.calls.push({ method: 'deleteBuffer', buf }),

    createShader: (type) => ({ id: Math.random(), type }),
    shaderSource: (shader, source) => { shader.source = source; },
    compileShader: (shader) => { shader.compiled = true; },
    getShaderParameter: () => true,
    getShaderInfoLog: () => '',
    deleteShader: (s) => state.calls.push({ method: 'deleteShader', shader: s }),

    createProgram: () => ({ id: Math.random() }),
    attachShader: (p, s) => state.calls.push({ method: 'attachShader', program: p, shader: s }),
    linkProgram: (p) => { p.linked = true; },
    getProgramParameter: () => true,
    getProgramInfoLog: () => '',
    deleteProgram: (p) => state.calls.push({ method: 'deleteProgram', program: p }),
    useProgram: (p) => {
      state.currentProgram = p;
      state.calls.push({ method: 'useProgram', program: p });
    },

    getAttribLocation: (p, name) => (name === 'a_position' ? 0 : name === 'a_texCoord' ? 1 : -1),
    enableVertexAttribArray: (index) => state.calls.push({ method: 'enableVertexAttribArray', index }),
    vertexAttribPointer: (index, size, type, norm, stride, offset) => {
      state.calls.push({ method: 'vertexAttribPointer', index, size, type });
    },

    getUniformLocation: (p, name) => ({ name }),
    uniform1i: (loc, v) => { state.uniforms[loc.name] = v; },
    uniform1f: (loc, v) => { state.uniforms[loc.name] = v; },
    uniform4fv: (loc, v) => { state.uniforms[loc.name] = Array.from(v); },
    uniformMatrix3fv: (loc, trans, v) => { state.uniforms[loc.name] = Array.from(v); },

    enable: (cap) => state.enabledCaps.add(cap),
    disable: (cap) => state.enabledCaps.delete(cap),
    blendFunc: (sfactor, dfactor) => { state.blendFunc = [sfactor, dfactor]; },

    drawArrays: (mode, first, count) => {
      state.drawnArrays.push({ mode, first, count });
      state.calls.push({ method: 'drawArrays', mode, first, count });
    },

    createTexture: () => ({ id: Math.random() }),
    bindTexture: (target, tex) => { state.boundTextures[state.activeTextureUnit] = tex; },
    activeTexture: (unit) => { state.activeTextureUnit = unit; },
    texParameteri: (target, pname, param) => state.calls.push({ method: 'texParameteri', target, pname, param }),
    texImage2D: (...args) => state.calls.push({ method: 'texImage2D', argsCount: args.length }),
    texSubImage2D: (...args) => state.calls.push({ method: 'texSubImage2D', argsCount: args.length }),
    deleteTexture: (tex) => state.calls.push({ method: 'deleteTexture', tex }),
    pixelStorei: (pname, param) => state.calls.push({ method: 'pixelStorei', pname, param }),

    createFramebuffer: () => ({ id: Math.random() }),
    bindFramebuffer: (target, fbo) => state.calls.push({ method: 'bindFramebuffer', target, fbo }),
    framebufferTexture2D: (target, attachment, textarget, texture, level) => {
      state.calls.push({ method: 'framebufferTexture2D', attachment, texture });
    },
    deleteFramebuffer: (fbo) => state.calls.push({ method: 'deleteFramebuffer', fbo }),

    viewport: (x, y, w, h) => { state.viewport = [x, y, w, h]; },
    clearColor: (r, g, b, a) => { state.clearColor = [r, g, b, a]; },
    clear: (mask) => state.calls.push({ method: 'clear', mask })
  };

  return gl;
}

function createMockCanvas(gl) {
  return {
    width: 1280,
    height: 720,
    getContext: (type) => {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') {
        return gl;
      }
      return null;
    }
  };
}

console.log('--- Testing LayerCompositor ---');
{
  const gl = createMockGL();
  const compositor = new LayerCompositor(gl, false);

  assert.ok(compositor.positionBuffer !== null);
  assert.ok(compositor.texCoordBuffer !== null);
  assert.ok(compositor.program !== null);
  assert.equal(compositor.attribs.a_position, 0);
  assert.equal(compositor.attribs.a_texCoord, 1);

  assert.deepEqual(compositor.getBlendFuncFactors('normal'), [gl.ONE, gl.ONE_MINUS_SRC_ALPHA]);
  assert.deepEqual(compositor.getBlendFuncFactors('add'), [gl.ONE, gl.ONE]);
  assert.deepEqual(compositor.getBlendFuncFactors('plus'), [gl.ONE, gl.ONE]);
  assert.deepEqual(compositor.getBlendFuncFactors('linear-dodge'), [gl.ONE, gl.ONE]);
  assert.deepEqual(compositor.getBlendFuncFactors('screen'), [gl.ONE, gl.ONE_MINUS_SRC_COLOR]);
  assert.deepEqual(compositor.getBlendFuncFactors('multiply'), [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA]);
  assert.deepEqual(compositor.getBlendFuncFactors('mask'), [gl.ZERO, gl.SRC_ALPHA]);
  assert.deepEqual(compositor.getBlendFuncFactors('clipping-mask'), [gl.ZERO, gl.SRC_ALPHA]);
  assert.deepEqual(compositor.getBlendFuncFactors('dst-out'), [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA]);
  assert.deepEqual(compositor.getBlendFuncFactors('copy'), [gl.ONE, gl.ZERO]);

  assert.equal(compositor.normalizeBlendMode('LinearDodge'), 'linear-dodge');
  assert.equal(compositor.normalizeBlendMode('Soft Overlay'), 'soft-overlay');
  assert.equal(compositor.normalizeBlendMode(null), 'normal');

  const tex = gl.createTexture();
  compositor.drawLayer(tex, {
    opacity: 0.8,
    blendMode: 'screen',
    transform: new Float32Array([1, 0, 0, 0, 1, 0, 0.5, 0.5, 1])
  });

  assert.equal(gl._state.drawnArrays.length, 1);
  assert.equal(gl._state.drawnArrays[0].count, 6);
  assert.equal(gl._state.uniforms.u_alpha, 0.8);
  assert.deepEqual(gl._state.blendFunc, [gl.ONE, gl.ONE_MINUS_SRC_COLOR]);

  const beforeSkip = gl._state.drawnArrays.length;
  compositor.drawLayer(tex, { opacity: 0.0001 });
  assert.equal(gl._state.drawnArrays.length, beforeSkip, 'Zero opacity must skip draw');

  compositor.drawLayer(null);
  assert.equal(gl._state.drawnArrays.length, beforeSkip, 'Null texture must skip draw');

  compositor.dispose();
  assert.equal(compositor.positionBuffer, null);
  assert.equal(compositor.texCoordBuffer, null);
  assert.equal(compositor.program, null);
}

console.log('--- Testing WebGLRenderer Context & Sizing ---');
{
  const gl = createMockGL();
  const canvas = createMockCanvas(gl);
  const renderer = new WebGLRenderer(canvas);

  assert.equal(renderer.width, 1280);
  assert.equal(renderer.height, 720);
  assert.deepEqual(gl._state.viewport, [0, 0, 1280, 720]);

  renderer.setSize(1920, 1080);
  assert.equal(renderer.width, 1920);
  assert.equal(renderer.height, 1080);
  assert.equal(canvas.width, 1920);
  assert.equal(canvas.height, 1080);
  assert.deepEqual(gl._state.viewport, [0, 0, 1920, 1080]);
  assert.deepEqual(renderer.getSize(), { width: 1920, height: 1080 });
}

console.log('--- Testing WebGLRenderer Color & Clear ---');
{
  const gl = createMockGL();
  const canvas = createMockCanvas(gl);
  const renderer = new WebGLRenderer(canvas);

  const hexColor = renderer.parseColor('#ff0000');
  assert.deepEqual(hexColor, [1, 0, 0, 1]);

  const hex8Color = renderer.parseColor('#00ff0080');
  assert.ok(Math.abs(hex8Color[1] - 1) < 1e-4);
  assert.ok(Math.abs(hex8Color[3] - 0.5019) < 1e-2);

  const arrColor = renderer.parseColor([255, 128, 0, 255]);
  assert.equal(arrColor[0], 1);
  assert.ok(Math.abs(arrColor[1] - 0.5019) < 1e-2);

  renderer.clear('#0000ff');
  assert.deepEqual(gl._state.clearColor, [0, 0, 1, 1]);
}

console.log('--- Testing WebGLRenderer Texture Caching ---');
{
  const gl = createMockGL();
  const canvas = createMockCanvas(gl);
  const renderer = new WebGLRenderer(canvas);

  const tex1 = renderer.createTexture('img1', { width: 100, height: 100 });
  assert.ok(tex1 !== null);
  assert.ok(renderer.hasTexture('img1'));
  assert.equal(renderer.getTexture('img1'), tex1);

  const tex1Updated = renderer.updateTexture('img1', { width: 100, height: 100 });
  assert.equal(tex1Updated, tex1);

  renderer.deleteTexture('img1');
  assert.equal(renderer.hasTexture('img1'), false);
  assert.equal(renderer.getTexture('img1'), null);

  renderer.createTexture('a', { width: 10, height: 10 });
  renderer.createTexture('b', { width: 20, height: 20 });
  assert.equal(renderer.hasTexture('a'), true);
  assert.equal(renderer.hasTexture('b'), true);
  renderer.clearTextureCache();
  assert.equal(renderer.hasTexture('a'), false);
  assert.equal(renderer.hasTexture('b'), false);
}

console.log('--- Testing WebGLRenderer Render Targets ---');
{
  const gl = createMockGL();
  const canvas = createMockCanvas(gl);
  const renderer = new WebGLRenderer(canvas);

  const rt = renderer.getRenderTarget('rt_main', 500, 500);
  assert.ok(rt.fbo !== null);
  assert.ok(rt.texture !== null);
  assert.equal(rt.width, 500);
  assert.equal(rt.height, 500);

  renderer.bindRenderTarget(rt);
  assert.deepEqual(gl._state.viewport, [0, 0, 500, 500]);

  renderer.bindRenderTarget(null);
  assert.deepEqual(gl._state.viewport, [0, 0, renderer.width, renderer.height]);

  renderer.deleteRenderTarget('rt_main');
}

console.log('--- Testing WebGLRenderer Scene Orchestration ---');
{
  const gl = createMockGL();
  const canvas = createMockCanvas(gl);
  const renderer = new WebGLRenderer(canvas);

  const scene = {
    title: 'Test Project',
    width: 720,
    height: 1280,
    bgcolor: '#112233',
    layers: [
      {
        id: 'layer1',
        startTime: 0,
        endTime: 3000,
        opacity: 0.9,
        blendMode: 'normal',
        transform: {
          location: [360, 640],
          scale: [1, 1],
          rotation: 0
        }
      },
      {
        id: 'layer_hidden',
        hidden: true,
        startTime: 0,
        endTime: 3000,
        opacity: 1
      },
      {
        id: 'layer_future',
        startTime: 4000,
        endTime: 7000,
        opacity: 1
      }
    ]
  };

  renderer.setScene(scene);
  assert.equal(renderer.width, 720);
  assert.equal(renderer.height, 1280);

  const prevDrawn = gl._state.drawnArrays.length;
  renderer.renderAt(1000);

  assert.equal(gl._state.drawnArrays.length, prevDrawn + 1, 'Only 1 active visible layer rendered');

  renderer.dispose();
  assert.equal(renderer.compositor, null);
  assert.equal(renderer.scene, null);
}

console.log('All LayerCompositor & WebGLRenderer tests PASSED successfully!');
