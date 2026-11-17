import { b as parseAmfxBinary, j as makeTextState, k as makeTimeEnv, l as buildParamValueMap } from "./chunk.js";
function parseEffectXml(xmlText, sourceName = '') {
  let xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml"),
    parserError = xmlDoc.querySelector("parsererror");
  if (parserError) throw new Error("XML parsing error in " + sourceName + ':\x20' + parserError.textContent);
  let effectEl = xmlDoc.querySelector("effect");
  if (!effectEl) throw new Error("No <effect> root tag found in " + sourceName);
  let effect = {
      id: effectEl.getAttribute('id') || '',
      name: effectEl.getAttribute("name") || '',
      category: effectEl.getAttribute("category") || '',
      overdraw: effectEl.getAttribute("overdraw") === "true",
      maxOverdraw: effectEl.getAttribute("max-overdraw") !== null ? parseFloat(effectEl.getAttribute("max-overdraw")) : 0,
      filename: sourceName,
      params: [],
      passes: [],
      shader: null,
      vertexShader: null,
      script: null
    },
    paramsEl = xmlDoc.querySelector("params");
  if (paramsEl) for (let paramEl of paramsEl.children) {
    let tagName = paramEl.tagName.toLowerCase();
    if (tagName === "section" || tagName === "tip") continue;
    let paramId = paramEl.getAttribute('id');
    if (!paramId) continue;
    let defaultAttr = paramEl.getAttribute("default") ?? paramEl.getAttribute("value"),
      param = {
        type: tagName,
        id: paramId,
        label: paramEl.getAttribute("label") || paramEl.getAttribute('id'),
        srcType: paramEl.getAttribute("srcType") || null,
        defaultValue: resolveDefaultValue(defaultAttr, tagName),
        min: paramEl.getAttribute("min") !== null ? parseFloat(paramEl.getAttribute("min")) : null,
        max: paramEl.getAttribute("max") !== null ? parseFloat(paramEl.getAttribute("max")) : null,
        step: paramEl.getAttribute("step") !== null ? parseFloat(paramEl.getAttribute("step")) : 0.01,
        valueType: paramEl.getAttribute("type") || null,
        choices: []
      };
    for (let choiceEl of paramEl.querySelectorAll("choice")) param.choices.push({
      label: choiceEl.getAttribute("label") || choiceEl.getAttribute("value"),
      value: choiceEl.getAttribute("value")
    });
    effect.params.push(param);
  }
  let passesEl = xmlDoc.querySelector("passes");
  if (passesEl) {
    for (let passEl of passesEl.querySelectorAll("pass")) effect.passes.push({
      target: passEl.getAttribute("target") || null
    });
  }
  let fragmentShaders = Array.from(xmlDoc.querySelectorAll("shader[type=\"fragment\"]"));
  fragmentShaders.length && (effect.shaders = fragmentShaders.map(shaderEl => ({
    type: "fragment",
    group: shaderEl.getAttribute("group") || '0',
    precision: shaderEl.getAttribute("precision") || "mediump",
    code: shaderEl.textContent.trim()
  })), effect.shader = effect.shaders[0]);
  let scriptEls = Array.from(xmlDoc.querySelectorAll("script"));
  if (scriptEls.length) {
    let scriptEl = null,
      scriptLang = 'js',
      scriptParts = [];
    for (let externalScript of scriptEls) {
      scriptLang = externalScript.getAttribute("lang") || scriptLang;
      let externalAttr = externalScript.getAttribute("external");
      if (externalAttr) {
        scriptEl = scriptEl || externalAttr;
        continue;
      }
      let scriptCode = externalScript.textContent.trim();
      scriptCode && scriptParts.push(scriptCode);
    }
    effect.script = {
      lang: scriptLang,
      external: scriptEl,
      code: scriptParts.length ? scriptParts.join('\x0a\x0a') : null
    };
  }
  let vertexShaderEl = xmlDoc.querySelector("shader[type=\"vertex\"]");
  if (vertexShaderEl) {
    effect.vertexShader = {
      type: "vertex",
      precision: vertexShaderEl.getAttribute("precision") || (effect.shader && effect.shader.precision) || "mediump",
      code: vertexShaderEl.textContent.trim()
    };
  }
  effect.isNative = !effect.shader && !effect.script;
  return effect;
}
var PARAM_TO_GLSL_TYPE = {
    spinner: "float",
    slider: "float",
    float: "float",
    switch: "bool",
    selector: "int",
    point: "vec2",
    xyz: "vec3",
    'hue-disc': "vec3",
    color: "vec4",
    orient: "mat4"
  },
  GLSL_RESERVED_WORDS = ["sample", "filter", "smooth", "flat", "centroid", "patch", "buffer", "shared", "coherent", "restrict", "readonly", "writeonly", "precise", "layout", "atomic_uint", "image2D", "image3D", "imageCube", "image2DArray", "imageBuffer", "input", "output", "half", "fixed", "long", "short", "double", "unsigned", "superp", "this", "resource", "cast", "sizeof", "namespace", "using", "class", "union", "enum", "typedef", "template", "goto", "inline", "noinline", "public", "static", "extern", "external", "interface", "packed", "asm", "common", "partition", "active", "sampler1D", "sampler3D", "sampler2DRect", "sampler1DShadow", "sampler2DShadow", "sampler2DRectShadow", "hvec2", "hvec3", "hvec4", "dvec2", "dvec3", "dvec4", "fvec2", "fvec3", "fvec4"],
  GLSL_BUILTINS = ["radians", "degrees", "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh", "pow", "exp", "log", "exp2", "log2", "sqrt", "inversesqrt", "abs", "sign", "floor", "trunc", "round", "roundEven", "ceil", "fract", "mod", "modf", "min", "max", "clamp", "mix", "step", "smoothstep", "isnan", "isinf", "floatBitsToInt", "floatBitsToUint", "intBitsToFloat", "uintBitsToFloat", "packSnorm2x16", "unpackSnorm2x16", "packUnorm2x16", "unpackUnorm2x16", "packHalf2x16", "unpackHalf2x16", "length", "distance", "dot", "cross", "normalize", "faceforward", "reflect", "refract", "matrixCompMult", "outerProduct", "transpose", "determinant", "inverse", "lessThan", "lessThanEqual", "greaterThan", "greaterThanEqual", "equal", "notEqual", "any", "all", "not", "texture", "textureProj", "textureLod", "textureOffset", "texelFetch", "texelFetchOffset", "textureProjOffset", "textureLodOffset", "textureProjLod", "textureProjLodOffset", "textureGrad", "textureGradOffset", "textureProjGrad", "textureProjGradOffset", "textureSize", "dFdx", "dFdy", "fwidth"],
  GLSL_TYPE_PATTERN = "(?:lowp|mediump|highp)?\\s*(?:void|bool|int|uint|float|vec[234]|ivec[234]|bvec[234]|uvec[234]|mat[234](?:x[234])?)",
  forcedPrecision = null;
function setDefaultPrecision(precision) {
  forcedPrecision = precision === "mediump" ? "mediump" : null;
}
function pickPrecision(hint) {
  return forcedPrecision || (hint === "high" ? "highp" : hint === "medium" ? "mediump" : hint === "low" ? "lowp" : hint || "mediump");
}
function collectShaderReserved(collectShaderReservedArg, ...sources) {
  let shaderText = sources.filter(Boolean).join('\x0a'),
    usedIds = new Set((collectShaderReservedArg || []).map(collectShaderReservedId => collectShaderReservedId.id)),
    renames = new Map(),
    reservedNames = new Set([...GLSL_RESERVED_WORDS, ...GLSL_BUILTINS]);
  for (let collectShaderReservedValue of reservedNames) {
    let isCall = new RegExp('\x5cb' + GLSL_TYPE_PATTERN + "\\s+" + collectShaderReservedValue + "\\s*\\(").test(shaderText),
      isDecl = new RegExp(GLSL_TYPE_PATTERN + "\\s+" + collectShaderReservedValue + '\x5cb').test(shaderText);
    !usedIds.has(collectShaderReservedValue) && !isCall && !isDecl || renames.set(collectShaderReservedValue, {
      name: '_' + collectShaderReservedValue,
      renameCalls: isCall
    });
  }
  return renames;
}
function renameShaderReserved(source, renameShaderReservedArg) {
  let renameShaderReservedValue = source;
  for (let [name, {
    name: replacement,
    renameCalls: renameShaderReservedResult
  }] of renameShaderReservedArg) renameShaderReservedValue = renameShaderReservedValue.replace(new RegExp("([.])?\\b" + name + "\\b(\\s*\\()?", 'g'), (match, prefix, callSuffix) => prefix || callSuffix && !renameShaderReservedResult ? match : replacement + (callSuffix || ''));
  return renameShaderReservedValue;
}
function buildParamNameMap(buildParamNameMapShader) {
  if (!buildParamNameMapShader) return new Map();
  if (paramNameCache.has(buildParamNameMapShader)) return paramNameCache.get(buildParamNameMapShader);
  let shaderSources = [buildParamNameMapShader.shader && buildParamNameMapShader.shader.code, buildParamNameMapShader.vertexShader && buildParamNameMapShader.vertexShader.code],
    buildParamNameMapCollectShaderReserved = collectShaderReserved(buildParamNameMapShader.params, ...shaderSources),
    nameMap = new Map();
  for (let buildParamNameMapId of buildParamNameMapShader.params || []) {
    let renamed = buildParamNameMapCollectShaderReserved.get(buildParamNameMapId.id);
    nameMap.set(buildParamNameMapId.id, renamed ? renamed.name : buildParamNameMapId.id);
  }
  return paramNameCache.set(buildParamNameMapShader, nameMap), nameMap;
}
function buildUniformDecls(buildUniformDeclsParams, logger) {
  let buildUniformDeclsBuildParamNameMap = buildParamNameMap(buildUniformDeclsParams),
    decls = '';
  for (let buildUniformDeclsId of buildUniformDeclsParams.params || []) {
    let glslName = buildUniformDeclsBuildParamNameMap.get(buildUniformDeclsId.id) || buildUniformDeclsId.id;
    if (buildUniformDeclsId.type === "texture") decls += "uniform sampler2D u_" + glslName + "_texture;\n", decls += "uniform vec2 u_" + glslName + "_size;\n";else {
      let glslType = PARAM_TO_GLSL_TYPE[buildUniformDeclsId.type];
      glslType ? decls += "uniform " + glslType + '\x20' + glslName + ';\x0a' : logger && logger("[SHADER] Param type \"" + buildUniformDeclsId.type + "\" (" + buildUniformDeclsId.id + ") belum didukung, uniform dilewati.");
    }
  }
  return decls;
}
function transpileShaderSource(transpileShaderSourceArgValue, transpileShaderSourceArg, shaderStage, argValue) {
  let renamedSource = renameShaderReserved(transpileShaderSourceArgValue, argValue);
  return transpileShaderSourceArg >= 2 && (renamedSource = renamedSource.replace(/\bvarying\b/g, shaderStage === "vertex" ? "out" : 'in').replace(/\battribute\b/g, 'in')), transpileShaderSourceArg >= 2 ? renamedSource.replace(/\btexture2DProjLod\s*\(/g, "textureProjLod(").replace(/\btexture2DLod\s*\(/g, "textureLod(").replace(/\btextureCubeLod\s*\(/g, "textureLod(").replace(/\btexture2DProj\s*\(/g, "textureProj(").replace(/\btexture2D\s*\(/g, "texture(").replace(/\btextureCube\s*\(/g, "texture(") : renamedSource.replace(/\btextureLod\s*\(/g, "texture2DLod(").replace(/\btextureProj\s*\(/g, "texture2DProj(").replace(/\btexture\s*\(/g, "texture2D(");
}
function buildShaderPreamble(buildShaderPreambleArg, stage, buildShaderPreambleArgValue) {
  let texFn = buildShaderPreambleArg >= 2 ? "texture" : "texture2D",
    varyingDecl = buildShaderPreambleArg >= 2 ? stage === "vertex" ? "out vec2 v_texCoord;" : "in vec2 v_texCoord;" : "varying vec2 v_texCoord;",
    fragOutput = buildShaderPreambleArg >= 2 && stage === "fragment" ? "out vec4 acFragColor;\n#define gl_FragColor acFragColor\n" : '',
    buildShaderPreambleValue = buildShaderPreambleArg >= 2 ? '' : "\n// GLSL ES 1.00 belum punya varian integer dari max/min/clamp/abs/sign/mod/\n// step/smoothstep/pow; semua itu baru ada di ES 3.00. Shader dari AM memakainya\n// (mis. max(1,int(radius)), min(dist, i), clamp(abs(to-from)/30,1,3)),\n// jadi di WebGL1 kita sediakan overload-nya. GLSL ES membolehkan overloading\n// fungsi built-in, dan signature di bawah ini meniru ES 3.00.\nint abs(int x) { return x < 0 ? -x : x; }\nint sign(int x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }\nint max(int a, int b) { return a > b ? a : b; }\nint min(int a, int b) { return a < b ? a : b; }\nint clamp(int x, int lo, int hi) { return min(max(x, lo), hi); }\nfloat max(float a, int b) { return max(a, float(b)); }\nfloat max(int a, float b) { return max(float(a), b); }\nfloat min(float a, int b) { return min(a, float(b)); }\nfloat min(int a, float b) { return min(float(a), b); }\nfloat clamp(float x, int lo, int hi) { return clamp(x, float(lo), float(hi)); }\nfloat clamp(int x, float lo, float hi) { return clamp(float(x), lo, hi); }\nfloat clamp(int x, int lo, float hi) { return clamp(float(x), float(lo), hi); }\nfloat clamp(float x, float lo, int hi) { return clamp(x, lo, float(hi)); }\nfloat clamp(float x, int lo, float hi) { return clamp(x, float(lo), hi); }\nfloat mod(float a, int b) { return mod(a, float(b)); }\nfloat mod(int a, float b) { return mod(float(a), b); }\nfloat step(float edge, int x) { return step(edge, float(x)); }\nfloat step(int edge, float x) { return step(float(edge), x); }\nfloat smoothstep(float a, float b, int x) { return smoothstep(a, b, float(x)); }\nfloat pow(float a, int b) { return pow(a, float(b)); }\nfloat floor(int x) { return float(x); }\nfloat ceil(int x) { return float(x); }\n";
  return "precision " + buildShaderPreambleArgValue + " float;\nprecision " + buildShaderPreambleArgValue + " int;\n" + varyingDecl + '\x0a' + fragOutput + "\nuniform vec2 acOutputOrigin;\nuniform vec2 acOutputSize;\nuniform vec2 acInputOrigin;\nuniform vec2 acInputSize;\nuniform vec2 acCompOrigin;\nuniform vec2 acCompSize;\n\n#define acScreenNorm (acOutputOrigin + v_texCoord * acOutputSize)\n// acLayerNorm = posisi fragmen di ruang layer: (0,0) pojok kiri-bawah kotak\n// konten, (1,1) pojok kanan-atas. Ini yang dipakai efek geometris (tile,\n// mirror, bend, polar, ...) untuk menghitung koordinat, lalu hasilnya dipetakan\n// balik ke layar lewat acLayerToScreen.\n#define acLayerNorm ((vec4(acScreenNorm, 0.0, 1.0) * acScreenToLayer).xy)\n\nuniform vec2 acLayerSize;\nuniform vec2 acScreenSize;\nuniform vec2 acLayerCenter;\nuniform vec2 acLayerCenterNorm;\nuniform vec2 acLayerSizeNorm;\nuniform vec2 acLayerPivot;\nuniform mat4 acLayerToScreen;\nuniform mat4 acScreenToLayer;\nuniform vec2 acPreviewSize;\nuniform vec2 acProjectSize;\nuniform int acPass;\nuniform float acTime;\nuniform float acAngularVelocity;\nuniform vec2 acVelocity;\nuniform float acScaleVelocity;\nuniform bool acShowGuides;\n\n#define getTexSize(sz) (sz)\n\nvec4 texture2DCv(sampler2D tex, vec2 uv) {\n    return " + texFn + "(tex, uv);\n}\n\nfloat saturate(float x) { return clamp(x, 0.0, 1.0); }\nvec2 saturate(vec2 x) { return clamp(x, vec2(0.0), vec2(1.0)); }\nvec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }\nvec4 saturate(vec4 x) { return clamp(x, vec4(0.0), vec4(1.0)); }\n// Safe math helper for shaders with power calculations\nvec4 safe_pow(vec4 x, vec4 y) { return pow(max(x, vec4(0.0001)), clamp(y, vec4(0.0), vec4(8.0))); }\nvec4 safe_pow(vec4 x, float y) { return pow(max(x, vec4(0.0001)), vec4(clamp(y, 0.0, 8.0))); }\nfloat safe_pow(float x, float y) { return pow(max(x, 0.0001), clamp(y, 0.0, 8.0)); }\n" + buildShaderPreambleValue + '\x0a';
}
function rewriteBufferTextureCalls(rewriteBufferTextureCallsArg, bufferParams) {
  if (!bufferParams.length) return {
    code: rewriteBufferTextureCallsArg,
    used: false
  };
  let textureNames = bufferParams.map(rewriteBufferTextureCallsArgValue => 'u_' + rewriteBufferTextureCallsArgValue + "_texture"),
    textureRegex = new RegExp("\\b(?:" + textureNames.join('|') + ")\\b", 'g'),
    callRanges = [],
    indexValue;
  for (; (indexValue = textureRegex.exec(rewriteBufferTextureCallsArg)) !== null;) {
    let depth = 0,
      openParen = -1;
    for (let rewriteBufferTextureCallsValue = indexValue.index - 1; rewriteBufferTextureCallsValue >= 0; rewriteBufferTextureCallsValue--) {
      let char = rewriteBufferTextureCallsArg[rewriteBufferTextureCallsValue];
      if (char === ')') depth++;else {
        if (char === '(') {
          if (depth === 0) {
            openParen = rewriteBufferTextureCallsValue;
            break;
          }
          depth--;
        } else {
          if (char === ';' || char === '{' || char === '}') break;
        }
      }
    }
    if (openParen < 0) continue;
    depth = 0;
    let closeParen = -1;
    for (let scanIndex = openParen; scanIndex < rewriteBufferTextureCallsArg.length; scanIndex++) {
      let rewriteBufferTextureCallsScanIndex = rewriteBufferTextureCallsArg[scanIndex];
      if (rewriteBufferTextureCallsScanIndex === '(') depth++;else {
        if (rewriteBufferTextureCallsScanIndex === ')' && (depth--, depth === 0)) {
          closeParen = scanIndex;
          break;
        }
      }
    }
    closeParen > openParen && callRanges.push([openParen, closeParen]);
  }
  if (!callRanges.length) return {
    code: rewriteBufferTextureCallsArg,
    used: false
  };
  callRanges.sort((start, end) => start[0] - end[0]);
  let mergedRanges = [];
  for (let lastRange of callRanges) {
    let mergedRange = mergedRanges[mergedRanges.length - 1];
    mergedRange && lastRange[0] <= mergedRange[1] ? mergedRange[1] = Math.max(mergedRange[1], lastRange[1]) : mergedRanges.push([lastRange[0], lastRange[1]]);
  }
  let rewriteBufferTextureCallsText = '',
    rewriteBufferTextureCallsNumber = 0,
    usedBufferNorm = false;
  for (let [rewriteBufferTextureCallsResult, rewriteBufferTextureCallsValueRaw] of mergedRanges) {
    rewriteBufferTextureCallsText += rewriteBufferTextureCallsArg.slice(rewriteBufferTextureCallsNumber, rewriteBufferTextureCallsResult);
    let segment = rewriteBufferTextureCallsArg.slice(rewriteBufferTextureCallsResult, rewriteBufferTextureCallsValueRaw + 1),
      parenStack = [],
      rewritten = '';
    for (let numberValue = 0; numberValue < segment.length;) {
      let rewriteBufferTextureCallsIndex = segment[numberValue];
      if (rewriteBufferTextureCallsIndex === '(') {
        let textureMatch = /^\(\s*u_(\w+)_texture\b/.exec(segment.slice(numberValue));
        parenStack.push(!!textureMatch && !bufferParams.includes(textureMatch[1])), rewritten += rewriteBufferTextureCallsIndex, numberValue++;
      } else rewriteBufferTextureCallsIndex === ')' ? (parenStack.pop(), rewritten += rewriteBufferTextureCallsIndex, numberValue++) : segment.startsWith("acScreenNorm", numberValue) && !/\w/.test(segment[numberValue - 1] || '') && !/\w/.test(segment[numberValue + 12] || '') && !parenStack.some(Boolean) ? (rewritten += "acBufNorm", numberValue += 12, usedBufferNorm = true) : (rewritten += rewriteBufferTextureCallsIndex, numberValue++);
    }
    rewriteBufferTextureCallsText += rewritten, rewriteBufferTextureCallsNumber = rewriteBufferTextureCallsValueRaw + 1;
  }
  return rewriteBufferTextureCallsText += rewriteBufferTextureCallsArg.slice(rewriteBufferTextureCallsNumber), {
    code: rewriteBufferTextureCallsText,
    used: usedBufferNorm
  };
}
function buildFragmentShaderSource(shader, buildFragmentShaderSourceArg = console.log, options = {}) {
  let buildFragmentShaderSourceValue = options.webglVersion || 1,
    buildFragmentShaderSourcePickPrecision = pickPrecision(shader.shader.precision),
    uniformDecls = buildUniformDecls(shader, buildFragmentShaderSourceArg),
    buildFragmentShaderSourceCollectShaderReserved = collectShaderReserved(shader.params, shader.shader.code, shader.vertexShader && shader.vertexShader.code),
    code = shader.shader.code;
  shader.id === "com.alightcreative.effects.glowscan" && (code = code.replace("vec4 glow = pow(mix(baseColor, fillColor*luma, blend*0.99), vec4(power) * pow(linearPos, 2.0));", "float safeExp = clamp(power * pow(clamp(linearPos, 0.0, 1.0), 2.0), 0.0, 8.0);\nvec4 safeBase = max(mix(baseColor, fillColor*luma, clamp(blend*0.99, 0.0, 0.99)), vec4(0.0001));\nvec4 glow = pow(safeBase, vec4(safeExp));"));
  for (let idValue of shader.params || []) if (idValue.type === "texture") {
    let buildFragmentShaderSourceId = idValue.id,
      regExp = new RegExp('\x5cb' + buildFragmentShaderSourceId + "\\.texture\\b", 'g'),
      sizeRegex = new RegExp('\x5cb' + buildFragmentShaderSourceId + "\\.size\\b", 'g');
    code = code.replace(regExp, 'u_' + buildFragmentShaderSourceId + "_texture"), code = code.replace(sizeRegex, 'u_' + buildFragmentShaderSourceId + "_size");
  }
  let buildFragmentShaderSourceResult = (shader.params || []).filter(srcTypeArg => srcTypeArg.type === "texture" && srcTypeArg.srcType === "buffer").map(idArg => idArg.id),
    bufferRewrite = rewriteBufferTextureCalls(code, buildFragmentShaderSourceResult);
  code = bufferRewrite.code;
  let bufferNormDefine = bufferRewrite.used ? "\n#define acBufNorm ((acScreenNorm - acOutputOrigin) / max(acOutputSize, vec2(0.000001)))\n" : '',
    usesComp = false;
  for (let buildFragmentShaderSourceSrcType of shader.params || []) if (buildFragmentShaderSourceSrcType.type === "texture" && buildFragmentShaderSourceSrcType.srcType === "comp") {
    let compTextureRegex = new RegExp("\\b(?:texture2DCv|texture2D|texture)\\s*\\(\\s*(u_" + buildFragmentShaderSourceSrcType.id + "_texture)\\s*,", 'g');
    compTextureRegex.test(code) && (compTextureRegex.lastIndex = 0, code = code.replace(compTextureRegex, "acCompTexture2DCv($1,"), usesComp = true);
  }
  let compHelper = usesComp ? "\nvec4 acCompTexture2DCv(sampler2D t, vec2 screenUv) {\n    vec2 uv = (screenUv - acCompOrigin) / max(acCompSize, vec2(0.000001));\n    return " + (buildFragmentShaderSourceValue >= 2 ? "texture" : "texture2D") + "(t, uv);\n}\n" : '',
    inputTextureRegex = /\b(?:texture2DCv|texture2D|texture)\s*\(\s*u_inputImg_texture\s*,/g,
    usesInputTexture = inputTextureRegex.test(code);
  inputTextureRegex.lastIndex = 0, usesInputTexture && (code = code.replace(inputTextureRegex, "acInputTexture2DCv("));
  let inputHelper = usesInputTexture ? "\nvec4 acInputTexture2DCv(vec2 screenUv) {\n    vec2 size = max(acInputSize, vec2(0.000001));\n    vec2 uv = (screenUv - acInputOrigin) / size;\n    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);\n    return " + (buildFragmentShaderSourceValue >= 2 ? "texture" : "texture2D") + "(u_inputImg_texture, uv);\n}\n" : '';
  return '' + (buildFragmentShaderSourceValue >= 2 ? "#version 300 es\n" : '') + buildShaderPreamble(buildFragmentShaderSourceValue, "fragment", buildFragmentShaderSourcePickPrecision) + '\x0a' + uniformDecls + '\x0a' + bufferNormDefine + inputHelper + compHelper + '\x0a' + transpileShaderSource(code, buildFragmentShaderSourceValue, "fragment", buildFragmentShaderSourceCollectShaderReserved) + '\x0a';
}
function buildBlitVertexSource(buildBlitVertexSourceArgValue = 1, buildBlitVertexSourceArg = "highp") {
  return buildBlitVertexSourceArgValue >= 2 ? "#version 300 es\nprecision " + buildBlitVertexSourceArg + " float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision " + buildBlitVertexSourceArg + " float;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying vec2 v_texCoord;\n\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
}
var BLIT_VERTEX_SOURCE = buildBlitVertexSource(1);
function buildVertexShaderSource(buildVertexShaderSourceShader, buildVertexShaderSourceArg = console.log, webglVersion = {}) {
  let buildVertexShaderSourceValue = webglVersion.webglVersion || 1,
    buildVertexShaderSourcePickPrecision = pickPrecision(buildVertexShaderSourceShader.shader && buildVertexShaderSourceShader.shader.precision);
  if (!buildVertexShaderSourceShader.vertexShader || !buildVertexShaderSourceShader.vertexShader.code) return buildBlitVertexSource(buildVertexShaderSourceValue, buildVertexShaderSourcePickPrecision);
  let buildVertexShaderSourceBuildUniformDecls = buildUniformDecls(buildVertexShaderSourceShader, buildVertexShaderSourceArg),
    buildVertexShaderSourceCollectShaderReserved = collectShaderReserved(buildVertexShaderSourceShader.params, buildVertexShaderSourceShader.shader && buildVertexShaderSourceShader.shader.code, buildVertexShaderSourceShader.vertexShader && buildVertexShaderSourceShader.vertexShader.code),
    vertexBody = buildVertexShaderSourceShader.vertexShader.code.replace(/^\s*(?:lowp|mediump|highp)?\s*vec2\s+v_texCoord\s*;\s*$/gm, '').replace(/^\s*attribute\s+vec2\s+a_(position|texCoord)\s*;\s*$/gm, '').replace(/^\s*(?:varying|in|out)\s+vec2\s+v_texCoord\s*;\s*$/gm, ''),
    versionHeader = buildVertexShaderSourceValue >= 2 ? "#version 300 es\n" : '',
    qualifier = buildVertexShaderSourceValue >= 2 ? 'in' : "attribute";
  return '' + versionHeader + buildShaderPreamble(buildVertexShaderSourceValue, "vertex", buildVertexShaderSourcePickPrecision) + '\x0a' + qualifier + " vec2 a_position;\n" + qualifier + " vec2 a_texCoord;\n\n" + buildVertexShaderSourceBuildUniformDecls + "\n\nvoid vertShaderInit() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n\n" + transpileShaderSource(vertexBody, buildVertexShaderSourceValue, "vertex", buildVertexShaderSourceCollectShaderReserved) + '\x0a';
}
function buildTransformVertexSource(buildTransformVertexSourceArg = 1) {
  return buildTransformVertexSourceArg >= 2 ? "#version 300 es\nprecision highp float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nuniform mat3 u_transform;\n\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision highp float;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying vec2 v_texCoord;\n\nuniform mat3 u_transform;\n\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
}
function buildBlitFragmentSource(buildBlitFragmentSourceArg = 1) {
  return buildBlitFragmentSourceArg >= 2 ? "#version 300 es\nprecision highp float;\n\nin vec2 v_texCoord;\nout vec4 acFragColor;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\n\nvoid main() {\n    vec4 color = texture(u_image, v_texCoord);\n    acFragColor = vec4(color.rgb, color.a * u_alpha);\n}\n" : "precision highp float;\n\nvarying vec2 v_texCoord;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\n\nvoid main() {\n    vec4 color = texture2D(u_image, v_texCoord);\n    gl_FragColor = vec4(color.rgb, color.a * u_alpha);\n}\n";
}
function compileScriptEffect(script, compileScriptEffectArg) {
  if (!script.script || !script.script.code) throw new Error("Efek ini tidak punya shader maupun script yang bisa dijalankan.");
  let compileScriptEffectRecord = {
      log: compileScriptEffectArgValue => compileScriptEffectArg("[SCRIPT] " + compileScriptEffectArgValue),
      triangle: triangleWave,
      simplexNoise: simplexNoiseDHelper
    },
    animateFn = null;
  try {
    animateFn = new Function('AM', script.script.code + "\n;return typeof animate === 'function' ? animate : null;")(compileScriptEffectRecord);
  } catch (error) {
    throw new Error("Script error (" + (script.filename || script.id) + "): " + error.message);
  }
  if (typeof animateFn != "function") throw new Error("Script di " + (script.filename || script.id) + " tidak mendefinisikan animate(env, el, p).");
  return {
    animate: animateFn
  };
}
export { BLIT_VERTEX_SOURCE, GLSL_BUILTINS, GLSL_RESERVED_WORDS, GLSL_TYPE_PATTERN, PARAM_TO_GLSL_TYPE, buildBlitFragmentSource, buildBlitVertexSource, buildFragmentShaderSource, buildParamNameMap, buildShaderPreamble, buildTransformVertexSource, buildUniformDecls, buildVertexShaderSource, collectShaderReserved, compileScriptEffect, forcedPrecision, parseEffectXml, pickPrecision, renameShaderReserved, rewriteBufferTextureCalls, setDefaultPrecision, transpileShaderSource };
