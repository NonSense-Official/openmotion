export const PARAM_TO_GLSL_TYPE = {
  spinner: 'float', slider: 'float', float: 'float', switch: 'bool', selector: 'int',
  point: 'vec2', xyz: 'vec3', 'hue-disc': 'vec3', color: 'vec4', orient: 'mat4'
};

const GLSL_RESERVED = new Set((
  'sample filter smooth flat centroid patch buffer shared coherent restrict readonly writeonly ' +
  'precise layout atomic_uint image2D image3D imageCube image2DArray imageBuffer input output half ' +
  'fixed long short double unsigned superp this resource cast sizeof namespace using class union enum ' +
  'typedef template goto inline noinline public static extern external interface packed asm common ' +
  'partition active sampler1D sampler3D sampler2DRect sampler1DShadow sampler2DShadow sampler2DRectShadow ' +
  'hvec2 hvec3 hvec4 dvec2 dvec3 dvec4 fvec2 fvec3 fvec4 radians degrees sin cos tan asin acos atan ' +
  'sinh cosh tanh asinh acosh atanh pow exp log exp2 log2 sqrt inversesqrt abs sign floor trunc round ' +
  'roundEven ceil fract mod modf min max clamp mix step smoothstep isnan isinf floatBitsToInt ' +
  'floatBitsToUint intBitsToFloat uintBitsToFloat packSnorm2x16 unpackSnorm2x16 packUnorm2x16 unpackUnorm2x16 ' +
  'packHalf2x16 unpackHalf2x16 length distance dot cross normalize faceforward reflect refract matrixCompMult ' +
  'outerProduct transpose determinant inverse lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual ' +
  'any all not texture textureProj textureLod textureOffset texelFetch texelFetchOffset textureProjOffset ' +
  'textureLodOffset textureProjLod textureProjLodOffset textureGrad textureGradOffset textureProjGrad ' +
  'textureProjGradOffset textureSize dFdx dFdy fwidth'
).split(' '));

const GLSL_TYPE_PATTERN = '(?:lowp|mediump|highp)?\\s*(?:void|bool|int|uint|float|vec[234]|ivec[234]|bvec[234]|uvec[234]|mat[234](?:x[234])?)';
let forcedPrecision = null;

export function setDefaultPrecision(precision) {
  forcedPrecision = precision === 'mediump' ? 'mediump' : null;
}

function pickPrecision(p) {
  return forcedPrecision || (p === 'high' ? 'highp' : p === 'medium' ? 'mediump' : p === 'low' ? 'lowp' : p || 'mediump');
}

export function collectShaderReserved(params = [], ...shaderCodes) {
  const combined = shaderCodes.filter(Boolean).join('\n');
  const paramIds = new Set(params.map(p => p.id));
  const reservedMap = new Map();

  for (const word of GLSL_RESERVED) {
    const isFuncDef = new RegExp(`\\b${GLSL_TYPE_PATTERN}\\s+${word}\\s*\\(`).test(combined);
    const isVarDef = new RegExp(`${GLSL_TYPE_PATTERN}\\s+${word}\\b`).test(combined);
    if (paramIds.has(word) || isFuncDef || isVarDef) {
      reservedMap.set(word, { name: '_' + word, renameCalls: isFuncDef });
    }
  }
  return reservedMap;
}

export function renameShaderReserved(code, reservedMap) {
  if (!reservedMap || !reservedMap.size) return code;
  let result = code;
  for (const [word, { name, renameCalls }] of reservedMap) {
    result = result.replace(new RegExp(`([.])?\\b${word}\\b(\\s*\\()?`, 'g'), (m, dot, call) => {
      return (dot || (call && !renameCalls)) ? m : name + (call || '');
    });
  }
  return result;
}

const paramNameCache = new WeakMap();

export function buildParamNameMap(effect) {
  if (!effect) return new Map();
  if (paramNameCache.has(effect)) return paramNameCache.get(effect);

  const codes = [effect.shader?.code, effect.vertexShader?.code];
  const reserved = collectShaderReserved(effect.params, ...codes);
  const map = new Map();

  for (const param of effect.params || []) {
    const entry = reserved.get(param.id);
    map.set(param.id, entry ? entry.name : param.id);
  }
  paramNameCache.set(effect, map);
  return map;
}

export function buildUniformDeclarations(effect, onWarn) {
  const nameMap = buildParamNameMap(effect);
  let decls = '';

  for (const p of effect.params || []) {
    const glslName = nameMap.get(p.id) || p.id;
    if (p.type === 'texture') {
      decls += `uniform sampler2D u_${glslName}_texture;\nuniform vec2 u_${glslName}_size;\n`;
    } else {
      const glslType = PARAM_TO_GLSL_TYPE[p.type];
      if (glslType) decls += `uniform ${glslType} ${glslName};\n`;
      else if (onWarn) onWarn(`[SHADER] Param type "${p.type}" (${p.id}) is not supported as a uniform.`);
    }
  }
  return decls;
}

export const buildUniformDecls = buildUniformDeclarations;

export function transpileGlsl(code, webglVersion = 1, shaderType = 'fragment', reservedMap = null) {
  let transpiled = renameShaderReserved(code, reservedMap);
  if (webglVersion >= 2) {
    return transpiled
      .replace(/\bvarying\b/g, shaderType === 'vertex' ? 'out' : 'in')
      .replace(/\battribute\b/g, 'in')
      .replace(/\btexture2DProjLod\s*\(/g, 'textureProjLod(')
      .replace(/\btexture2DLod\s*\(/g, 'textureLod(')
      .replace(/\btextureCubeLod\s*\(/g, 'textureLod(')
      .replace(/\btexture2DProj\s*\(/g, 'textureProj(')
      .replace(/\btexture2D\s*\(/g, 'texture(')
      .replace(/\btextureCube\s*\(/g, 'texture(');
  }
  return transpiled
    .replace(/\btextureLod\s*\(/g, 'texture2DLod(')
    .replace(/\btextureProj\s*\(/g, 'texture2DProj(')
    .replace(/\btexture\s*\(/g, 'texture2D(');
}

export const transpileShaderSource = transpileGlsl;

export function buildShaderPreamble(webglVersion = 1, shaderType = 'fragment', precision = 'mediump') {
  const texCall = webglVersion >= 2 ? 'texture' : 'texture2D';
  const vTexCoordDecl = webglVersion >= 2
    ? (shaderType === 'vertex' ? 'out vec2 v_texCoord;' : 'in vec2 v_texCoord;')
    : 'varying vec2 v_texCoord;';
  const fragColorDecl = webglVersion >= 2 && shaderType === 'fragment'
    ? 'out vec4 acFragColor;\n#define gl_FragColor acFragColor\n'
    : '';

  const es1Polyfills = webglVersion >= 2 ? '' : `
int abs(int x) { return x < 0 ? -x : x; } int sign(int x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }
int max(int a, int b) { return a > b ? a : b; } int min(int a, int b) { return a < b ? a : b; }
int clamp(int x, int lo, int hi) { return min(max(x, lo), hi); }
float max(float a, int b) { return max(a, float(b)); } float max(int a, float b) { return max(float(a), b); }
float min(float a, int b) { return min(a, float(b)); } float min(int a, float b) { return min(float(a), b); }
float clamp(float x, int lo, int hi) { return clamp(x, float(lo), float(hi)); }
float clamp(int x, float lo, float hi) { return clamp(float(x), lo, hi); }
float clamp(int x, int lo, float hi) { return clamp(float(x), float(lo), hi); }
float clamp(float x, float lo, int hi) { return clamp(x, lo, float(hi)); }
float clamp(float x, int lo, float hi) { return clamp(x, float(lo), hi); }
float mod(float a, int b) { return mod(a, float(b)); } float mod(int a, float b) { return mod(float(a), b); }
float step(float edge, int x) { return step(edge, float(x)); } float step(int edge, float x) { return step(float(edge), x); }
float smoothstep(float a, float b, int x) { return smoothstep(a, b, float(x)); } float pow(float a, int b) { return pow(a, float(b)); }
float floor(int x) { return float(x); } float ceil(int x) { return float(x); }`;

  return `precision ${precision} float;
precision ${precision} int;
${vTexCoordDecl}
${fragColorDecl}
uniform vec2 acOutputOrigin, acOutputSize, acInputOrigin, acInputSize, acCompOrigin, acCompSize;
#define acScreenNorm (acOutputOrigin + v_texCoord * acOutputSize)
#define acLayerNorm ((vec4(acScreenNorm, 0.0, 1.0) * acScreenToLayer).xy)
uniform vec2 acLayerSize, acScreenSize, acLayerCenter, acLayerCenterNorm, acLayerSizeNorm, acLayerPivot;
uniform mat4 acLayerToScreen, acScreenToLayer;
uniform vec2 acPreviewSize, acProjectSize;
uniform int acPass;
uniform float acTime, acAngularVelocity, acScaleVelocity;
uniform vec2 acVelocity;
uniform bool acShowGuides;
#define getTexSize(sz) (sz)
vec4 texture2DCv(sampler2D tex, vec2 uv) { return ${texCall}(tex, uv); }
float saturate(float x) { return clamp(x, 0.0, 1.0); }
vec2 saturate(vec2 x) { return clamp(x, vec2(0.0), vec2(1.0)); }
vec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }
vec4 saturate(vec4 x) { return clamp(x, vec4(0.0), vec4(1.0)); }
vec4 safe_pow(vec4 x, vec4 y) { return pow(max(x, vec4(0.0001)), clamp(y, vec4(0.0), vec4(8.0))); }
vec4 safe_pow(vec4 x, float y) { return pow(max(x, vec4(0.0001)), vec4(clamp(y, 0.0, 8.0))); }
float safe_pow(float x, float y) { return pow(max(x, 0.0001), clamp(y, 0.0, 8.0)); }
${es1Polyfills}`;
}

function rewriteBufferTextureCalls(code, bufferIds) {
  if (!bufferIds.length) return { code, used: false };
  const pattern = new RegExp(`\\b(?:${bufferIds.map(id => 'u_' + id + '_texture').join('|')})\\b`, 'g');
  const ranges = [];
  let match;

  while ((match = pattern.exec(code)) !== null) {
    let depth = 0, start = -1;
    for (let i = match.index - 1; i >= 0; i--) {
      if (code[i] === ')') depth++;
      else if (code[i] === '(') {
        if (depth === 0) { start = i; break; }
        depth--;
      } else if (code[i] === ';' || code[i] === '{' || code[i] === '}') break;
    }
    if (start < 0) continue;
    depth = 0;
    let end = -1;
    for (let i = start; i < code.length; i++) {
      if (code[i] === '(') depth++;
      else if (code[i] === ')' && (--depth === 0)) { end = i; break; }
    }
    if (end > start) ranges.push([start, end]);
  }

  if (!ranges.length) return { code, used: false };
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }

  let result = '', cursor = 0, used = false;
  for (const [s, e] of merged) {
    result += code.slice(cursor, s);
    const slice = code.slice(s, e + 1);
    let str = '';
    const stack = [];
    for (let i = 0; i < slice.length;) {
      if (slice[i] === '(') {
        const m = /^\(\s*u_(\w+)_texture\b/.exec(slice.slice(i));
        stack.push(Boolean(m && !bufferIds.includes(m[1])));
        str += slice[i++];
      } else if (slice[i] === ')') {
        stack.pop();
        str += slice[i++];
      } else if (slice.startsWith('acScreenNorm', i) && !/\w/.test(slice[i - 1] || '') && !/\w/.test(slice[i + 12] || '') && !stack.some(Boolean)) {
        str += 'acBufNorm';
        i += 12;
        used = true;
      } else str += slice[i++];
    }
    result += str;
    cursor = e + 1;
  }
  return { code: result + code.slice(cursor), used };
}

export function buildFragmentShaderSource(effect, log = console.log, options = {}) {
  const webglVersion = options.webglVersion || 1;
  const precision = pickPrecision(effect.shader?.precision);
  const uniformDecls = buildUniformDeclarations(effect, log);
  const reservedMap = collectShaderReserved(effect.params, effect.shader?.code, effect.vertexShader?.code);
  let code = effect.shader?.code || '';

  if (effect.id === 'com.alightcreative.effects.glowscan') {
    code = code.replace(
      'vec4 glow = pow(mix(baseColor, fillColor*luma, blend*0.99), vec4(power) * pow(linearPos, 2.0));',
      'float safeExp = clamp(power * pow(clamp(linearPos, 0.0, 1.0), 2.0), 0.0, 8.0);\nvec4 safeBase = max(mix(baseColor, fillColor*luma, clamp(blend*0.99, 0.0, 0.99)), vec4(0.0001));\nvec4 glow = pow(safeBase, vec4(safeExp));'
    );
  }

  for (const p of effect.params || []) {
    if (p.type === 'texture') {
      code = code.replace(new RegExp(`\\b${p.id}\\.texture\\b`, 'g'), `u_${p.id}_texture`);
      code = code.replace(new RegExp(`\\b${p.id}\\.size\\b`, 'g'), `u_${p.id}_size`);
    }
  }

  const bufferParamIds = (effect.params || []).filter(p => p.type === 'texture' && p.srcType === 'buffer').map(p => p.id);
  const bufRewritten = rewriteBufferTextureCalls(code, bufferParamIds);
  code = bufRewritten.code;
  const bufNormDef = bufRewritten.used ? '\n#define acBufNorm ((acScreenNorm - acOutputOrigin) / max(acOutputSize, vec2(0.000001)))\n' : '';

  let hasCompTex = false;
  for (const p of effect.params || []) {
    if (p.type === 'texture' && p.srcType === 'comp') {
      const reg = new RegExp(`\\b(?:texture2DCv|texture2D|texture)\\s*\\(\\s*(u_${p.id}_texture)\\s*,`, 'g');
      if (reg.test(code)) {
        reg.lastIndex = 0;
        code = code.replace(reg, 'acCompTexture2DCv($1,');
        hasCompTex = true;
      }
    }
  }

  const compTexHelper = hasCompTex ? `\nvec4 acCompTexture2DCv(sampler2D t, vec2 screenUv) {\n    vec2 uv = (screenUv - acCompOrigin) / max(acCompSize, vec2(0.000001));\n    return ${webglVersion >= 2 ? 'texture' : 'texture2D'}(t, uv);\n}\n` : '';

  const inputImgReg = /\b(?:texture2DCv|texture2D|texture)\s*\(\s*u_inputImg_texture\s*,/g;
  const hasInputImg = inputImgReg.test(code);
  inputImgReg.lastIndex = 0;
  if (hasInputImg) code = code.replace(inputImgReg, 'acInputTexture2DCv(');

  const inputTexHelper = hasInputImg ? `\nvec4 acInputTexture2DCv(vec2 screenUv) {\n    vec2 size = max(acInputSize, vec2(0.000001));\n    vec2 uv = (screenUv - acInputOrigin) / size;\n    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);\n    return ${webglVersion >= 2 ? 'texture' : 'texture2D'}(u_inputImg_texture, uv);\n}\n` : '';

  const versionPrefix = webglVersion >= 2 ? '#version 300 es\n' : '';
  const preamble = buildShaderPreamble(webglVersion, 'fragment', precision);
  const transpiledBody = transpileGlsl(code, webglVersion, 'fragment', reservedMap);

  return `${versionPrefix}${preamble}\n${uniformDecls}\n${bufNormDef}${inputTexHelper}${compTexHelper}\n${transpiledBody}\n`;
}

export function buildBlitVertexSource(webglVersion = 1, precision = 'highp') {
  if (webglVersion >= 2) {
    return `#version 300 es\nprecision ${precision} float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n`;
  }
  return `precision ${precision} float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n`;
}

export function buildVertexShaderSource(effect, log = console.log, options = {}) {
  const webglVersion = options.webglVersion || 1;
  const precision = pickPrecision(effect?.shader?.precision);
  if (!effect?.vertexShader?.code) return buildBlitVertexSource(webglVersion, precision);

  const uniformDecls = buildUniformDeclarations(effect, log);
  const reservedMap = collectShaderReserved(effect.params, effect.shader?.code, effect.vertexShader.code);
  const cleanCode = effect.vertexShader.code
    .replace(/^\s*(?:lowp|mediump|highp)?\s*vec2\s+v_texCoord\s*;\s*$/gm, '')
    .replace(/^\s*attribute\s+vec2\s+a_(position|texCoord)\s*;\s*$/gm, '')
    .replace(/^\s*(?:varying|in|out)\s+vec2\s+v_texCoord\s*;\s*$/gm, '');

  const versionPrefix = webglVersion >= 2 ? '#version 300 es\n' : '';
  const inKeyword = webglVersion >= 2 ? 'in' : 'attribute';
  const preamble = buildShaderPreamble(webglVersion, 'vertex', precision);
  const transpiledBody = transpileGlsl(cleanCode, webglVersion, 'vertex', reservedMap);

  return `${versionPrefix}${preamble}\n${inKeyword} vec2 a_position;\n${inKeyword} vec2 a_texCoord;\n\n${uniformDecls}\n\nvoid vertShaderInit() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n\n${transpiledBody}\n`;
}

export function buildTransformVertexSource(webglVersion = 1) {
  if (webglVersion >= 2) {
    return `#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n`;
  }
  return `precision highp float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n`;
}

export function buildBlitFragmentSource(webglVersion = 1) {
  if (webglVersion >= 2) {
    return `#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 color = texture(u_image, v_texCoord);\n    acFragColor = vec4(color.rgb, color.a * u_alpha);\n}\n`;
  }
  return `precision highp float;\nvarying vec2 v_texCoord;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 color = texture2D(u_image, v_texCoord);\n    gl_FragColor = vec4(color.rgb, color.a * u_alpha);\n}\n`;
}

export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'Unknown compilation error';
    gl.deleteShader(shader);
    const typeName = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';
    throw new Error(`Shader Compile Error (${typeName}):\n${info}\n\nSource:\n${source}`);
  }
  return shader;
}

export function compileProgram(gl, vertexSource, fragmentSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || 'Unknown program link error';
    gl.deleteProgram(program);
    throw new Error(`Shader Link Error:\n${info}\n\nFragment Shader Code:\n${fragmentSource}`);
  }
  return program;
}

export function getUniformLocations(gl, program) {
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) {
      const cleanName = info.name.replace(/\[0\]$/, '');
      uniforms[cleanName] = gl.getUniformLocation(program, info.name);
    }
  }
  return uniforms;
}

export function getAttribLocations(gl, program, attribNames = ['a_position', 'a_texCoord']) {
  const attribs = {};
  for (const name of attribNames) {
    attribs[name] = gl.getAttribLocation(program, name);
  }
  return attribs;
}
