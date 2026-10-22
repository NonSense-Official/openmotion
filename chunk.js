var IDENTITY_MAT4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function parseNumberList(a, b) {
  let items = String(a).split(',').map(a2 => parseFloat(a2.trim())),
    arr2 = [];
  for (let n = 0; n < b; n++) arr2.push(Number.isFinite(items[n]) ? items[n] : 0);
  return arr2;
}
function parseEffectXml(a, b = '') {
  let parseFromString = new DOMParser().parseFromString(a, "text/xml"),
    querySelector = parseFromString.querySelector("parsererror");
  if (querySelector) throw new Error("XML parsing error in " + b + ':\x20' + querySelector.textContent);
  let querySelector2 = parseFromString.querySelector("effect");
  if (!querySelector2) throw new Error("No <effect> root tag found in " + b);
  let obj = {
      id: querySelector2.getAttribute('id') || '',
      name: querySelector2.getAttribute("name") || '',
      category: querySelector2.getAttribute("category") || '',
      overdraw: querySelector2.getAttribute("overdraw") === "true",
      maxOverdraw: querySelector2.getAttribute("max-overdraw") !== null ? parseFloat(querySelector2.getAttribute("max-overdraw")) : 0,
      filename: b,
      params: [],
      passes: [],
      shader: null,
      vertexShader: null,
      script: null
    },
    querySelector3 = parseFromString.querySelector("params");
  if (querySelector3) for (let val of querySelector3.children) {
    let toLowerCase = val.tagName.toLowerCase();
    if (toLowerCase === "section" || toLowerCase === "tip") continue;
    let attr = val.getAttribute('id');
    if (!attr) continue;
    let val2 = val.getAttribute("default") ?? val.getAttribute("value"),
      obj2 = {
        type: toLowerCase,
        id: attr,
        label: val.getAttribute("label") || val.getAttribute('id'),
        srcType: val.getAttribute("srcType") || null,
        defaultValue: resolveDefaultValue(val2, toLowerCase),
        min: val.getAttribute("min") !== null ? parseFloat(val.getAttribute("min")) : null,
        max: val.getAttribute("max") !== null ? parseFloat(val.getAttribute("max")) : null,
        step: val.getAttribute("step") !== null ? parseFloat(val.getAttribute("step")) : 0.01,
        valueType: val.getAttribute("type") || null,
        choices: []
      };
    for (let val3 of val.querySelectorAll("choice")) obj2.choices.push({
      label: val3.getAttribute("label") || val3.getAttribute("value"),
      value: val3.getAttribute("value")
    });
    obj.params.push(obj2);
  }
  let querySelector4 = parseFromString.querySelector("passes");
  if (querySelector4) {
    for (let val of querySelector4.querySelectorAll("pass")) obj.passes.push({
      target: val.getAttribute("target") || null
    });
  }
  let from = Array.from(parseFromString.querySelectorAll("shader[type=\"fragment\"]"));
  from.length && (obj.shaders = from.map(a2 => ({
    type: "fragment",
    group: a2.getAttribute("group") || '0',
    precision: a2.getAttribute("precision") || "mediump",
    code: a2.textContent.trim()
  })), obj.shader = obj.shaders[0]);
  let from2 = Array.from(parseFromString.querySelectorAll("script"));
  if (from2.length) {
    let val = null,
      str = 'js',
      arr2 = [];
    for (let val2 of from2) {
      str = val2.getAttribute("lang") || str;
      let attr = val2.getAttribute("external");
      if (attr) {
        val = val || attr;
        continue;
      }
      let trim = val2.textContent.trim();
      trim && arr2.push(trim);
    }
    obj.script = {
      lang: str,
      external: val,
      code: arr2.length ? arr2.join('\x0a\x0a') : null
    };
  }
  let querySelector5 = parseFromString.querySelector("shader[type=\"vertex\"]");
  if (querySelector5 && (obj.vertexShader = {
    type: "vertex",
    precision: querySelector5.getAttribute("precision") || obj.shader && obj.shader.precision || "mediump",
    code: querySelector5.textContent.trim()
  }), !obj.shader && !obj.script) throw new Error("Efek " + b + " tidak punya fragment shader maupun script.");
  return obj;
}
function resolveDefaultValue(a, b) {
  if (a == null) return b === "switch" ? false : b === "selector" ? 0 : b === "point" ? [0, 0] : b === "xyz" ? [0, 0, 0] : b === "hue-disc" ? [0, 1, 0] : b === "color" ? [1, 1, 1, 1] : b === "orient" ? IDENTITY_MAT4.slice() : 0;
  if (b === "switch") return String(a).toLowerCase() === "true";
  if (b === "selector") {
    let res = parseInt(a, 10);
    return Number.isFinite(res) ? res : 0;
  }
  if (b === "point") return parseNumberList(a, 2);
  if (b === "xyz" || b === "hue-disc") return parseNumberList(a, 3);
  if (b === "orient") return IDENTITY_MAT4.slice();
  if (b === "color") {
    let replace = String(a).replace('#', '');
    if (replace.length === 8) {
      let val = parseInt(replace.substring(0, 2), 16) / 255,
        val2 = parseInt(replace.substring(2, 4), 16) / 255,
        val3 = parseInt(replace.substring(4, 6), 16) / 255,
        val4 = parseInt(replace.substring(6, 8), 16) / 255;
      return [val2, val3, val4, val];
    } else {
      if (replace.length === 6) {
        let val = parseInt(replace.substring(0, 2), 16) / 255,
          val2 = parseInt(replace.substring(2, 4), 16) / 255,
          val3 = parseInt(replace.substring(4, 6), 16) / 255;
        return [val, val2, val3, 1];
      }
    }
    return [1, 1, 1, 1];
  }
  return parseFloat(a);
}
var arr = [65, 77, 70, 88],
  textEncoder = typeof TextEncoder < 'u' ? new TextEncoder() : null,
  textDecoder = typeof TextDecoder < 'u' ? new TextDecoder() : null,
  CHACHA_CONSTANTS = new Uint32Array([1634760805, 857760878, 2036477234, 1797285236]),
  CHACHA_ROUND_KEYS = new Uint32Array([2654435769, 2246822507, 3266489909, 668265263, 374761393, 3550635116, 4251993797, 3042594569]),
  chachaState = new Uint32Array(16),
  chachaBlockWords = new Uint32Array(16),
  chachaKeystream = new Uint8Array(64);
function rotl32(a, b) {
  return (a << b | a >>> 32 - b) >>> 0;
}
function chachaQuarterRound(a, b, c, d, arg) {
  a[b] = a[b] + a[c] >>> 0, a[arg] = rotl32(a[arg] ^ a[b], 16), a[d] = a[d] + a[arg] >>> 0, a[c] = rotl32(a[c] ^ a[d], 12), a[b] = a[b] + a[c] >>> 0, a[arg] = rotl32(a[arg] ^ a[b], 8), a[d] = a[d] + a[arg] >>> 0, a[c] = rotl32(a[c] ^ a[d], 7);
}
function chachaBlock(a, b) {
  for (let n = 0; n < 16; n++) b[n] = a[n];
  for (let n = 0; n < 10; n++) chachaQuarterRound(b, 0, 4, 8, 12), chachaQuarterRound(b, 1, 5, 9, 13), chachaQuarterRound(b, 2, 6, 10, 14), chachaQuarterRound(b, 3, 7, 11, 15), chachaQuarterRound(b, 0, 5, 10, 15), chachaQuarterRound(b, 1, 6, 11, 12), chachaQuarterRound(b, 2, 7, 8, 13), chachaQuarterRound(b, 3, 4, 9, 14);
  for (let n = 0; n < 16; n++) b[n] = b[n] + a[n] >>> 0;
}
function chachaXor(a, b) {
  let uint8Array2 = new Uint8Array(a.length);
  chachaState[0] = CHACHA_CONSTANTS[0], chachaState[1] = CHACHA_CONSTANTS[1], chachaState[2] = CHACHA_CONSTANTS[2], chachaState[3] = CHACHA_CONSTANTS[3];
  for (let n = 0; n < 8; n++) chachaState[4 + n] = CHACHA_ROUND_KEYS[n];
  chachaState[12] = 0, chachaState[13] = b >>> 0, chachaState[14] = 0, chachaState[15] = 0;
  for (let n = 0; n < a.length; n += 64) {
    chachaBlock(chachaState, chachaBlockWords);
    for (let n2 = 0; n2 < 16; n2++) {
      let val = chachaBlockWords[n2];
      chachaKeystream[n2 * 4] = val & 255, chachaKeystream[n2 * 4 + 1] = val >>> 8 & 255, chachaKeystream[n2 * 4 + 2] = val >>> 16 & 255, chachaKeystream[n2 * 4 + 3] = val >>> 24 & 255;
    }
    let min = Math.min(64, a.length - n);
    for (let n2 = 0; n2 < min; n2++) uint8Array2[n + n2] = a[n + n2] ^ chachaKeystream[n2];
    chachaState[12] = chachaState[12] + 1 >>> 0;
  }
  return uint8Array2;
}
function fail(a) {
  throw new Error("efek: " + a);
}
function parseAmfxBinary(a) {
  textDecoder || fail("TextDecoder tidak tersedia");
  let val = a instanceof Uint8Array ? a : new Uint8Array(a);
  val.length < 8 && fail("data efek terlalu pendek"), (val[0] !== arr[0] || val[1] !== arr[1] || val[2] !== arr[2] || val[3] !== arr[3]) && fail("header efek tidak dikenal (bukan AMFX)");
  let dataView = new DataView(val.buffer, val.byteOffset, val.byteLength),
    n = 4,
    getUint16 = dataView.getUint16(n, true);
  n += 2, getUint16 !== 3 && fail("versi format efek " + getUint16 + " tidak didukung (butuh 3)"), n += 2;
  let getUint32 = dataView.getUint32(n, true);
  n += 4;
  let array = new Array(getUint32);
  for (let n3 = 0; n3 < getUint32; n3++) {
    let getUint322 = dataView.getUint32(n, true);
    n += 4, n + getUint322 > val.length && fail("tabel string efek terpotong"), array[n3] = textDecoder.decode(val.subarray(n, n + getUint322)), n += getUint322;
  }
  let fn = a2 => {
      n + a2 > val.length && fail("data efek terpotong");
    },
    fn2 = a2 => a2 === 65535 ? null : array[a2],
    fn3 = () => {
      fn(1);
      let getUint8 = dataView.getUint8(n);
      return n += 1, getUint8;
    },
    fn4 = () => {
      fn(2);
      let getUint162 = dataView.getUint16(n, true);
      return n += 2, getUint162;
    },
    fn5 = () => {
      fn(8);
      let getFloat64 = dataView.getFloat64(n, true);
      return n += 8, getFloat64;
    },
    n2 = 0,
    fn6 = () => {
      fn(4);
      let getUint322 = dataView.getUint32(n, true);
      if (n += 4, getUint322 === 4294967295) return null;
      fn(getUint322);
      let subarray = val.subarray(n, n + getUint322);
      return n += getUint322, textDecoder.decode(chachaXor(subarray, n2++));
    },
    fn7 = () => {
      let res9 = fn3();
      if (res9 === 0) return false;
      if (res9 === 1) return true;
      if (res9 === 2) return fn5();
      if (res9 === 3) {
        let res10 = fn3(),
          array5 = new Array(res10);
        for (let n3 = 0; n3 < res10; n3++) array5[n3] = fn5();
        return array5;
      }
      return fail("tag nilai efek tidak dikenal: " + res9), null;
    },
    fn8 = () => fn3() === 1 ? fn5() : null,
    res = fn2(fn4()),
    res2 = fn2(fn4()),
    res3 = fn2(fn4()),
    res4 = fn2(fn4()),
    val2 = fn3() === 1,
    res5 = fn5(),
    res6 = fn4(),
    array2 = new Array(res6);
  for (let n3 = 0; n3 < res6; n3++) {
    let res9 = fn2(fn4()),
      res10 = fn2(fn4()),
      res11 = fn2(fn4()),
      res12 = fn2(fn4()),
      res13 = fn2(fn4()),
      res14 = fn7(),
      res15 = fn8(),
      res16 = fn8(),
      res17 = fn5(),
      res18 = fn4(),
      array5 = new Array(res18);
    for (let n4 = 0; n4 < res18; n4++) array5[n4] = {
      label: fn2(fn4()),
      value: fn2(fn4())
    };
    array2[n3] = {
      type: res9,
      id: res10,
      label: res11,
      srcType: res12,
      defaultValue: res14,
      min: res15,
      max: res16,
      step: res17,
      valueType: res13,
      choices: array5
    };
  }
  let res7 = fn4(),
    array3 = new Array(res7);
  for (let n3 = 0; n3 < res7; n3++) array3[n3] = {
    target: fn2(fn4())
  };
  let res8 = fn4(),
    array4 = new Array(res8);
  for (let n3 = 0; n3 < res8; n3++) array4[n3] = {
    type: "fragment",
    group: fn2(fn4()),
    precision: fn2(fn4()),
    code: fn6()
  };
  let obj = {
    id: res,
    name: res2,
    category: res3,
    overdraw: val2,
    maxOverdraw: res5,
    filename: res4,
    params: array2,
    passes: array3,
    shader: null,
    vertexShader: null,
    script: null
  };
  return array4.length && (obj.shaders = array4, obj.shader = array4[0]), fn3() === 1 && (obj.vertexShader = {
    type: "vertex",
    precision: fn2(fn4()),
    code: fn6()
  }), fn3() === 1 && (obj.script = {
    lang: fn2(fn4()),
    external: fn2(fn4()),
    code: fn6()
  }), obj;
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
function setDefaultPrecision(a) {
  forcedPrecision = a === "mediump" ? "mediump" : null;
}
function pickPrecision(a) {
  return forcedPrecision || (a === "high" ? "highp" : a === "medium" ? "mediump" : a === "low" ? "lowp" : a || "mediump");
}
function collectShaderReserved(a, ...b) {
  let join = b.filter(Boolean).join('\x0a'),
    set = new Set((a || []).map(a2 => a2.id)),
    map = new Map(),
    set2 = new Set([...GLSL_RESERVED_WORDS, ...GLSL_BUILTINS]);
  for (let val of set2) {
    let test = new RegExp('\x5cb' + GLSL_TYPE_PATTERN + "\\s+" + val + "\\s*\\(").test(join),
      test2 = new RegExp(GLSL_TYPE_PATTERN + "\\s+" + val + '\x5cb').test(join);
    !set.has(val) && !test && !test2 || map.set(val, {
      name: '_' + val,
      renameCalls: test
    });
  }
  return map;
}
function renameShaderReserved(a, b) {
  let a2 = a;
  for (let [val, {
    name: val2,
    renameCalls: val3
  }] of b) a2 = a2.replace(new RegExp("([.])?\\b" + val + "\\b(\\s*\\()?", 'g'), (a3, b2, c) => b2 || c && !val3 ? a3 : val2 + (c || ''));
  return a2;
}
var paramNameCache = new WeakMap();
function buildParamNameMap(a) {
  if (!a) return new Map();
  if (paramNameCache.has(a)) return paramNameCache.get(a);
  let arr2 = [a.shader && a.shader.code, a.vertexShader && a.vertexShader.code],
    res = collectShaderReserved(a.params, ...arr2),
    map = new Map();
  for (let val of a.params || []) {
    let get = res.get(val.id);
    map.set(val.id, get ? get.name : val.id);
  }
  return paramNameCache.set(a, map), map;
}
function buildUniformDecls(a, b) {
  let res = buildParamNameMap(a),
    str = '';
  for (let val of a.params || []) {
    let val2 = res.get(val.id) || val.id;
    if (val.type === "texture") str += "uniform sampler2D u_" + val2 + "_texture;\n", str += "uniform vec2 u_" + val2 + "_size;\n";else {
      let val3 = PARAM_TO_GLSL_TYPE[val.type];
      val3 ? str += "uniform " + val3 + '\x20' + val2 + ';\x0a' : b && b("[SHADER] Param type \"" + val.type + "\" (" + val.id + ") belum didukung, uniform dilewati.");
    }
  }
  return str;
}
function transpileShaderSource(a, b, c, d) {
  let res = renameShaderReserved(a, d);
  return b >= 2 && (res = res.replace(/\bvarying\b/g, c === "vertex" ? "out" : 'in').replace(/\battribute\b/g, 'in')), b >= 2 ? res.replace(/\btexture2DProjLod\s*\(/g, "textureProjLod(").replace(/\btexture2DLod\s*\(/g, "textureLod(").replace(/\btextureCubeLod\s*\(/g, "textureLod(").replace(/\btexture2DProj\s*\(/g, "textureProj(").replace(/\btexture2D\s*\(/g, "texture(").replace(/\btextureCube\s*\(/g, "texture(") : res.replace(/\btextureLod\s*\(/g, "texture2DLod(").replace(/\btextureProj\s*\(/g, "texture2DProj(").replace(/\btexture\s*\(/g, "texture2D(");
}
function buildShaderPreamble(a, b, c) {
  let val = a >= 2 ? "texture" : "texture2D",
    val2 = a >= 2 ? b === "vertex" ? "out vec2 v_texCoord;" : "in vec2 v_texCoord;" : "varying vec2 v_texCoord;",
    val3 = a >= 2 && b === "fragment" ? "out vec4 acFragColor;\n#define gl_FragColor acFragColor\n" : '',
    val4 = a >= 2 ? '' : "\n// GLSL ES 1.00 belum punya varian integer dari max/min/clamp/abs/sign/mod/\n// step/smoothstep/pow; semua itu baru ada di ES 3.00. Shader dari AM memakainya\n// (mis. max(1,int(radius)), min(dist, i), clamp(abs(to-from)/30,1,3)),\n// jadi di WebGL1 kita sediakan overload-nya. GLSL ES membolehkan overloading\n// fungsi built-in, dan signature di bawah ini meniru ES 3.00.\nint abs(int x) { return x < 0 ? -x : x; }\nint sign(int x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }\nint max(int a, int b) { return a > b ? a : b; }\nint min(int a, int b) { return a < b ? a : b; }\nint clamp(int x, int lo, int hi) { return min(max(x, lo), hi); }\nfloat max(float a, int b) { return max(a, float(b)); }\nfloat max(int a, float b) { return max(float(a), b); }\nfloat min(float a, int b) { return min(a, float(b)); }\nfloat min(int a, float b) { return min(float(a), b); }\nfloat clamp(float x, int lo, int hi) { return clamp(x, float(lo), float(hi)); }\nfloat clamp(int x, float lo, float hi) { return clamp(float(x), lo, hi); }\nfloat clamp(int x, int lo, float hi) { return clamp(float(x), float(lo), hi); }\nfloat clamp(float x, float lo, int hi) { return clamp(x, lo, float(hi)); }\nfloat clamp(float x, int lo, float hi) { return clamp(x, float(lo), hi); }\nfloat mod(float a, int b) { return mod(a, float(b)); }\nfloat mod(int a, float b) { return mod(float(a), b); }\nfloat step(float edge, int x) { return step(edge, float(x)); }\nfloat step(int edge, float x) { return step(float(edge), x); }\nfloat smoothstep(float a, float b, int x) { return smoothstep(a, b, float(x)); }\nfloat pow(float a, int b) { return pow(a, float(b)); }\nfloat floor(int x) { return float(x); }\nfloat ceil(int x) { return float(x); }\n";
  return "precision " + c + " float;\nprecision " + c + " int;\n" + val2 + '\x0a' + val3 + "\nuniform vec2 acOutputOrigin;\nuniform vec2 acOutputSize;\nuniform vec2 acInputOrigin;\nuniform vec2 acInputSize;\nuniform vec2 acCompOrigin;\nuniform vec2 acCompSize;\n\n#define acScreenNorm (acOutputOrigin + v_texCoord * acOutputSize)\n// acLayerNorm = posisi fragmen di ruang layer: (0,0) pojok kiri-bawah kotak\n// konten, (1,1) pojok kanan-atas. Ini yang dipakai efek geometris (tile,\n// mirror, bend, polar, ...) untuk menghitung koordinat, lalu hasilnya dipetakan\n// balik ke layar lewat acLayerToScreen.\n#define acLayerNorm ((vec4(acScreenNorm, 0.0, 1.0) * acScreenToLayer).xy)\n\nuniform vec2 acLayerSize;\nuniform vec2 acScreenSize;\nuniform vec2 acLayerCenter;\nuniform vec2 acLayerCenterNorm;\nuniform vec2 acLayerSizeNorm;\nuniform vec2 acLayerPivot;\nuniform mat4 acLayerToScreen;\nuniform mat4 acScreenToLayer;\nuniform vec2 acPreviewSize;\nuniform vec2 acProjectSize;\nuniform int acPass;\nuniform float acTime;\nuniform float acAngularVelocity;\nuniform vec2 acVelocity;\nuniform float acScaleVelocity;\nuniform bool acShowGuides;\n\n#define getTexSize(sz) (sz)\n\nvec4 texture2DCv(sampler2D tex, vec2 uv) {\n    return " + val + "(tex, uv);\n}\n\nfloat saturate(float x) { return clamp(x, 0.0, 1.0); }\nvec2 saturate(vec2 x) { return clamp(x, vec2(0.0), vec2(1.0)); }\nvec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }\nvec4 saturate(vec4 x) { return clamp(x, vec4(0.0), vec4(1.0)); }\n// Safe math helper for shaders with power calculations\nvec4 safe_pow(vec4 x, vec4 y) { return pow(max(x, vec4(0.0001)), clamp(y, vec4(0.0), vec4(8.0))); }\nvec4 safe_pow(vec4 x, float y) { return pow(max(x, vec4(0.0001)), vec4(clamp(y, 0.0, 8.0))); }\nfloat safe_pow(float x, float y) { return pow(max(x, 0.0001), clamp(y, 0.0, 8.0)); }\n" + val4 + '\x0a';
}
function rewriteBufferTextureCalls(a, b) {
  if (!b.length) return {
    code: a,
    used: false
  };
  let items = b.map(a2 => 'u_' + a2 + "_texture"),
    regex = new RegExp("\\b(?:" + items.join('|') + ")\\b", 'g'),
    arr2 = [],
    val;
  for (; (val = regex.exec(a)) !== null;) {
    let n2 = 0,
      val2 = -1;
    for (let val4 = val.index - 1; val4 >= 0; val4--) {
      let val5 = a[val4];
      if (val5 === ')') n2++;else {
        if (val5 === '(') {
          if (n2 === 0) {
            val2 = val4;
            break;
          }
          n2--;
        } else {
          if (val5 === ';' || val5 === '{' || val5 === '}') break;
        }
      }
    }
    if (val2 < 0) continue;
    n2 = 0;
    let val3 = -1;
    for (let val22 = val2; val22 < a.length; val22++) {
      let val4 = a[val22];
      if (val4 === '(') n2++;else {
        if (val4 === ')' && (n2--, n2 === 0)) {
          val3 = val22;
          break;
        }
      }
    }
    val3 > val2 && arr2.push([val2, val3]);
  }
  if (!arr2.length) return {
    code: a,
    used: false
  };
  arr2.sort((a2, b2) => a2[0] - b2[0]);
  let arr3 = [];
  for (let val2 of arr2) {
    let val3 = arr3[arr3.length - 1];
    val3 && val2[0] <= val3[1] ? val3[1] = Math.max(val3[1], val2[1]) : arr3.push([val2[0], val2[1]]);
  }
  let str = '',
    n = 0,
    flag = false;
  for (let [val2, val3] of arr3) {
    str += a.slice(n, val2);
    let slice = a.slice(val2, val3 + 1),
      arr4 = [],
      str2 = '';
    for (let n2 = 0; n2 < slice.length;) {
      let val4 = slice[n2];
      if (val4 === '(') {
        let exec = /^\(\s*u_(\w+)_texture\b/.exec(slice.slice(n2));
        arr4.push(!!exec && !b.includes(exec[1])), str2 += val4, n2++;
      } else val4 === ')' ? (arr4.pop(), str2 += val4, n2++) : slice.startsWith("acScreenNorm", n2) && !/\w/.test(slice[n2 - 1] || '') && !/\w/.test(slice[n2 + 12] || '') && !arr4.some(Boolean) ? (str2 += "acBufNorm", n2 += 12, flag = true) : (str2 += val4, n2++);
    }
    str += str2, n = val3 + 1;
  }
  return str += a.slice(n), {
    code: str,
    used: flag
  };
}
function buildFragmentShaderSource(a, b = console.log, c = {}) {
  let val = c.webglVersion || 1,
    res = pickPrecision(a.shader.precision),
    res2 = buildUniformDecls(a, b),
    res3 = collectShaderReserved(a.params, a.shader.code, a.vertexShader && a.vertexShader.code),
    val2 = a.shader.code;
  a.id === "com.alightcreative.effects.glowscan" && (val2 = val2.replace("vec4 glow = pow(mix(baseColor, fillColor*luma, blend*0.99), vec4(power) * pow(linearPos, 2.0));", "float safeExp = clamp(power * pow(clamp(linearPos, 0.0, 1.0), 2.0), 0.0, 8.0);\nvec4 safeBase = max(mix(baseColor, fillColor*luma, clamp(blend*0.99, 0.0, 0.99)), vec4(0.0001));\nvec4 glow = pow(safeBase, vec4(safeExp));"));
  for (let val6 of a.params || []) if (val6.type === "texture") {
    let val7 = val6.id,
      regex2 = new RegExp('\x5cb' + val7 + "\\.texture\\b", 'g'),
      regex3 = new RegExp('\x5cb' + val7 + "\\.size\\b", 'g');
    val2 = val2.replace(regex2, 'u_' + val7 + "_texture"), val2 = val2.replace(regex3, 'u_' + val7 + "_size");
  }
  let items = (a.params || []).filter(a2 => a2.type === "texture" && a2.srcType === "buffer").map(a2 => a2.id),
    res4 = rewriteBufferTextureCalls(val2, items);
  val2 = res4.code;
  let val3 = res4.used ? "\n#define acBufNorm ((acScreenNorm - acOutputOrigin) / max(acOutputSize, vec2(0.000001)))\n" : '',
    flag = false;
  for (let val6 of a.params || []) if (val6.type === "texture" && val6.srcType === "comp") {
    let regex2 = new RegExp("\\b(?:texture2DCv|texture2D|texture)\\s*\\(\\s*(u_" + val6.id + "_texture)\\s*,", 'g');
    regex2.test(val2) && (regex2.lastIndex = 0, val2 = val2.replace(regex2, "acCompTexture2DCv($1,"), flag = true);
  }
  let val4 = flag ? "\nvec4 acCompTexture2DCv(sampler2D t, vec2 screenUv) {\n    vec2 uv = (screenUv - acCompOrigin) / max(acCompSize, vec2(0.000001));\n    return " + (val >= 2 ? "texture" : "texture2D") + "(t, uv);\n}\n" : '',
    regex = /\b(?:texture2DCv|texture2D|texture)\s*\(\s*u_inputImg_texture\s*,/g,
    test = regex.test(val2);
  regex.lastIndex = 0, test && (val2 = val2.replace(regex, "acInputTexture2DCv("));
  let val5 = test ? "\nvec4 acInputTexture2DCv(vec2 screenUv) {\n    vec2 size = max(acInputSize, vec2(0.000001));\n    vec2 uv = (screenUv - acInputOrigin) / size;\n    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);\n    return " + (val >= 2 ? "texture" : "texture2D") + "(u_inputImg_texture, uv);\n}\n" : '';
  return '' + (val >= 2 ? "#version 300 es\n" : '') + buildShaderPreamble(val, "fragment", res) + '\x0a' + res2 + '\x0a' + val3 + val5 + val4 + '\x0a' + transpileShaderSource(val2, val, "fragment", res3) + '\x0a';
}
function buildBlitVertexSource(a = 1, b = "highp") {
  return a >= 2 ? "#version 300 es\nprecision " + b + " float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision " + b + " float;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying vec2 v_texCoord;\n\nvoid main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
}
var BLIT_VERTEX_SOURCE = buildBlitVertexSource(1);
function buildVertexShaderSource(a, b = console.log, c = {}) {
  let val = c.webglVersion || 1,
    res = pickPrecision(a.shader.precision);
  if (!a.vertexShader || !a.vertexShader.code) return buildBlitVertexSource(val, res);
  let res2 = buildUniformDecls(a, b),
    res3 = collectShaderReserved(a.params, a.shader.code, a.vertexShader.code),
    replace = a.vertexShader.code.replace(/^\s*(?:lowp|mediump|highp)?\s*vec2\s+v_texCoord\s*;\s*$/gm, '').replace(/^\s*attribute\s+vec2\s+a_(position|texCoord)\s*;\s*$/gm, '').replace(/^\s*(?:varying|in|out)\s+vec2\s+v_texCoord\s*;\s*$/gm, ''),
    val2 = val >= 2 ? "#version 300 es\n" : '',
    val3 = val >= 2 ? 'in' : "attribute";
  return '' + val2 + buildShaderPreamble(val, "vertex", res) + '\x0a' + val3 + " vec2 a_position;\n" + val3 + " vec2 a_texCoord;\n\n" + res2 + "\n\nvoid vertShaderInit() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n\n" + transpileShaderSource(replace, val, "vertex", res3) + '\x0a';
}
function buildTransformVertexSource(a = 1) {
  return a >= 2 ? "#version 300 es\nprecision highp float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nuniform mat3 u_transform;\n\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision highp float;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying vec2 v_texCoord;\n\nuniform mat3 u_transform;\n\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
}
function buildBlitFragmentSource(a = 1) {
  return a >= 2 ? "#version 300 es\nprecision highp float;\n\nin vec2 v_texCoord;\nout vec4 acFragColor;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\n\nvoid main() {\n    vec4 color = texture(u_image, v_texCoord);\n    acFragColor = vec4(color.rgb, color.a * u_alpha);\n}\n" : "precision highp float;\n\nvarying vec2 v_texCoord;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\n\nvoid main() {\n    vec4 color = texture2D(u_image, v_texCoord);\n    gl_FragColor = vec4(color.rgb, color.a * u_alpha);\n}\n";
}
function triangleWave(a) {
  let val = a - Math.floor(a);
  return 4 * Math.abs(val - 0.5) - 1;
}
var NOISE_GRAD3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
  uint8Array = new Uint8Array(512);
{
  let arr2 = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
  for (let n = 0; n < 512; n++) uint8Array[n] = arr2[n & 255];
}
function simplexNoise3D(a, b, c) {
  let val = Number(a) || 0,
    val2 = Number(b) || 0,
    val3 = (c === void 0 ? 0 : Number(c)) || 0,
    val4 = (val + val2 + val3) * (1 / 3),
    floor = Math.floor(val + val4),
    floor2 = Math.floor(val2 + val4),
    floor3 = Math.floor(val3 + val4),
    val5 = (floor + floor2 + floor3) * (1 / 6),
    val6 = val - (floor - val5),
    val7 = val2 - (floor2 - val5),
    val8 = val3 - (floor3 - val5),
    val9,
    val10,
    val11,
    val12,
    val13,
    val14;
  val6 >= val7 ? val7 >= val8 ? (val9 = 1, val10 = 0, val11 = 0, val12 = 1, val13 = 1, val14 = 0) : val6 >= val8 ? (val9 = 1, val10 = 0, val11 = 0, val12 = 1, val13 = 0, val14 = 1) : (val9 = 0, val10 = 0, val11 = 1, val12 = 1, val13 = 0, val14 = 1) : val7 < val8 ? (val9 = 0, val10 = 0, val11 = 1, val12 = 0, val13 = 1, val14 = 1) : val6 < val8 ? (val9 = 0, val10 = 1, val11 = 0, val12 = 0, val13 = 1, val14 = 1) : (val9 = 0, val10 = 1, val11 = 0, val12 = 1, val13 = 1, val14 = 0);
  let val15 = val6 - val9 + 1 / 6,
    val16 = val7 - val10 + 1 / 6,
    val17 = val8 - val11 + 1 / 6,
    val18 = val6 - val12 + 1 / 3,
    val19 = val7 - val13 + 1 / 3,
    val20 = val8 - val14 + 1 / 3,
    val21 = val6 - 0.5,
    val22 = val7 - 0.5,
    val23 = val8 - 0.5,
    val24 = floor & 255,
    val25 = floor2 & 255,
    val26 = floor3 & 255,
    fn = (a2, b2, c2, d) => {
      let val27 = 0.6 - b2 * b2 - c2 * c2 - d * d;
      if (val27 < 0) return 0;
      val27 *= val27;
      let val28 = a2 * 3;
      return val27 * val27 * (NOISE_GRAD3[val28] * b2 + NOISE_GRAD3[val28 + 1] * c2 + NOISE_GRAD3[val28 + 2] * d);
    },
    res = fn(uint8Array[val24 + uint8Array[val25 + uint8Array[val26]]] % 12, val6, val7, val8),
    res2 = fn(uint8Array[val24 + val9 + uint8Array[val25 + val10 + uint8Array[val26 + val11]]] % 12, val15, val16, val17),
    res3 = fn(uint8Array[val24 + val12 + uint8Array[val25 + val13 + uint8Array[val26 + val14]]] % 12, val18, val19, val20),
    res4 = fn(uint8Array[val24 + 1 + uint8Array[val25 + 1 + uint8Array[val26 + 1]]] % 12, val21, val22, val23);
  return 32 * (res + res2 + res3 + res4);
}
function compileScriptEffect(a, b) {
  if (!a.script || !a.script.code) throw new Error("Efek ini tidak punya shader maupun script yang bisa dijalankan.");
  let obj = {
      log: a2 => b("[SCRIPT] " + a2),
      triangle: triangleWave,
      simplexNoise: simplexNoise3D
    },
    val = null;
  try {
    val = new Function('AM', a.script.code + "\n;return typeof animate === 'function' ? animate : null;")(obj);
  } catch (val2) {
    throw new Error("Script error (" + (a.filename || a.id) + "): " + val2.message);
  }
  if (typeof val != "function") throw new Error("Script di " + (a.filename || a.id) + " tidak mendefinisikan animate(env, el, p).");
  return {
    animate: val
  };
}
function makeTextState(a = '') {
  return {
    alpha: 1,
    text: a,
    transform: {
      angle: 0,
      location: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1
      }
    }
  };
}
function makeTimeEnv(a) {
  return {
    time: a % 5 / 5,
    duration: 5,
    frame: Math.round(a * 30),
    fps: 30,
    absTime: a,
    inTime: 0,
    velocity: {
      x: 0,
      y: 0
    }
  };
}
function buildParamValueMap(a, b) {
  let obj = {};
  for (let val of a.params || []) {
    let val2 = b[val.id];
    val.type === "point" ? obj[val.id] = {
      x: val2[0],
      y: val2[1]
    } : val.type === "xyz" ? obj[val.id] = {
      x: val2[0],
      y: val2[1],
      z: val2[2]
    } : val.type === "color" ? obj[val.id] = {
      r: val2[0],
      g: val2[1],
      b: val2[2],
      a: val2[3]
    } : obj[val.id] = val2;
  }
  return obj;
}
export { parseEffectXml as a, parseAmfxBinary as b, setDefaultPrecision as c, buildParamNameMap as d, buildFragmentShaderSource as e, buildVertexShaderSource as f, buildTransformVertexSource as g, buildBlitFragmentSource as h, compileScriptEffect as i, makeTextState as j, makeTimeEnv as k, buildParamValueMap as l };