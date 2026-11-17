const QUAD_VERTICES = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1
]);

const QUAD_TEX_COORDS = new Float32Array([
  0, 0,
  1, 0,
  0, 1,
  0, 1,
  1, 0,
  1, 1
]);

const IDENTITY_MAT3 = new Float32Array([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
]);

const DEFAULT_UV_RECT = new Float32Array([0, 0, 1, 1]);

export class LayerCompositor {
  constructor(gl, isWebGL2 = false) {
    if (!gl) {
      throw new Error('LayerCompositor requires a valid WebGL context');
    }
    this.gl = gl;
    this.isWebGL2 = isWebGL2;

    this.positionBuffer = null;
    this.texCoordBuffer = null;
    this.program = null;
    this.attribs = {};
    this.uniforms = {};

    this.initBuffers();
    this.initProgram();
  }

  initBuffers() {
    const gl = this.gl;
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_TEX_COORDS, gl.STATIC_DRAW);
  }

  initProgram() {
    const gl = this.gl;
    const vsSource = this.isWebGL2
      ? `#version 300 es
        precision highp float;
        in vec2 a_position;
        in vec2 a_texCoord;
        out vec2 v_texCoord;
        uniform mat3 u_transform;
        uniform vec4 u_uvRect;
        void main() {
          vec3 pos = u_transform * vec3(a_position, 1.0);
          gl_Position = vec4(pos.xy, 0.0, 1.0);
          v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);
        }`
      : `precision highp float;
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        uniform mat3 u_transform;
        uniform vec4 u_uvRect;
        void main() {
          vec3 pos = u_transform * vec3(a_position, 1.0);
          gl_Position = vec4(pos.xy, 0.0, 1.0);
          v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);
        }`;

    const fsSource = this.isWebGL2
      ? `#version 300 es
        precision highp float;
        in vec2 v_texCoord;
        out vec4 fragColor;
        uniform sampler2D u_image;
        uniform float u_alpha;
        void main() {
          vec4 c = texture(u_image, v_texCoord);
          fragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);
        }`
      : `precision highp float;
        varying vec2 v_texCoord;
        uniform sampler2D u_image;
        uniform float u_alpha;
        void main() {
          vec4 c = texture2D(u_image, v_texCoord);
          gl_FragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);
        }`;

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Shader Link Error: ${err}`);
    }

    this.program = program;
    this.attribs = {
      a_position: gl.getAttribLocation(program, 'a_position'),
      a_texCoord: gl.getAttribLocation(program, 'a_texCoord')
    };

    this.uniforms = {
      u_transform: gl.getUniformLocation(program, 'u_transform'),
      u_uvRect: gl.getUniformLocation(program, 'u_uvRect'),
      u_image: gl.getUniformLocation(program, 'u_image'),
      u_alpha: gl.getUniformLocation(program, 'u_alpha')
    };
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader Compile Error: ${err}`);
    }
    return shader;
  }

  normalizeBlendMode(mode) {
    if (typeof mode !== 'string' || !mode) return 'normal';
    return mode.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]+/g, '-');
  }

  getBlendFuncFactors(blendMode) {
    const gl = this.gl;
    const mode = this.normalizeBlendMode(blendMode);
    switch (mode) {
      case 'add':
      case 'plus':
      case 'linear-dodge':
        return [gl.ONE, gl.ONE];
      case 'screen':
        return [gl.ONE, gl.ONE_MINUS_SRC_COLOR];
      case 'multiply':
        return [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
      case 'mask':
      case 'clipping-mask':
      case 'dst-in':
        return [gl.ZERO, gl.SRC_ALPHA];
      case 'mask-exclude':
      case 'exclude':
      case 'dst-out':
        return [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
      case 'copy':
        return [gl.ONE, gl.ZERO];
      case 'normal':
      case 'mask-fill':
      default:
        return [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    }
  }

  applyBlendMode(blendMode) {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    const [srcFactor, dstFactor] = this.getBlendFuncFactors(blendMode);
    gl.blendFunc(srcFactor, dstFactor);
  }

  bindQuadAttributes(customVertices = null) {
    const gl = this.gl;
    if (this.attribs.a_position >= 0) {
      if (customVertices) {
        if (!this.dynamicBuffer) {
          this.dynamicBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.dynamicBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, customVertices, gl.STREAM_DRAW);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      }
      gl.enableVertexAttribArray(this.attribs.a_position);
      gl.vertexAttribPointer(this.attribs.a_position, 2, gl.FLOAT, false, 0, 0);
    }

    if (this.attribs.a_texCoord >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.enableVertexAttribArray(this.attribs.a_texCoord);
      gl.vertexAttribPointer(this.attribs.a_texCoord, 2, gl.FLOAT, false, 0, 0);
    }
  }

  drawLayer(texture, options = {}) {
    if (!texture) return;

    const opacity = options.opacity !== undefined
      ? Math.max(0, Math.min(1, options.opacity))
      : 1.0;

    if (opacity <= 0.001) return;

    const gl = this.gl;
    const blendMode = options.blendMode || 'normal';
    const transform = options.transform || IDENTITY_MAT3;
    const uvRect = options.uvRect || DEFAULT_UV_RECT;

    this.applyBlendMode(blendMode);

    gl.useProgram(this.program);
    this.bindQuadAttributes(options.vertices || null);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    if (this.uniforms.u_image) {
      gl.uniform1i(this.uniforms.u_image, 0);
    }
    if (this.uniforms.u_alpha) {
      gl.uniform1f(this.uniforms.u_alpha, opacity);
    }
    if (this.uniforms.u_transform) {
      gl.uniformMatrix3fv(this.uniforms.u_transform, false, transform);
    }
    if (this.uniforms.u_uvRect) {
      gl.uniform4fv(this.uniforms.u_uvRect, uvRect);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disable(gl.BLEND);
  }

  dispose() {
    const gl = this.gl;
    if (this.positionBuffer) {
      gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }
    if (this.texCoordBuffer) {
      gl.deleteBuffer(this.texCoordBuffer);
      this.texCoordBuffer = null;
    }
    if (this.dynamicBuffer) {
      gl.deleteBuffer(this.dynamicBuffer);
      this.dynamicBuffer = null;
    }
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}
