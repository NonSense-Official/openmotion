import { a as parseEffectXml, b as parseAmfxBinary, c as setDefaultPrecision, d as buildParamNameMap, e as buildFragmentShaderSource, f as buildVertexShaderSource, g as buildTransformVertexSource, h as buildBlitFragmentSource, i as compileScriptEffect, j as makeTextState, k as makeTimeEnv, l as buildParamValueMap } from "./chunk.js";
import { applyHelperScoped, applyRaw, getHelperMin, handleHelperLocal, helperByIndex, renderHelperByIndex, renderHelperByKey, updateHelperClamped, updateHelperScoped } from './parser-value.js';
import { applyClamped, applyHelper, applyHelperClamped, applyHelperLocal, applyInner, applyStart, buildHelper, buildHelperByIndex, buildHelperByKey, buildHelperEnd, buildHelperMax, buildHelperMin, buildHelperScoped, buildHelperValue, buildRaw, computeHelper, computeHelperEnd, computeHelperInner, computeHelperLocal, computeHelperRaw, computeHelperStart, fail, flagHelperValue, getHelperInner, getHelperOuter, handleHelperClamped, handleHelperMax, handleRaw, helperByKey, helperEnd, itemsHelper, joinHelper, nHelperValue, objHelperEl, objHelperLocal, objHelperScoped, omAddNull, omEnterGroup, omEven, omExitGroup, omFxParamDef, omHexFrom, omId, omLayerCur, omMultiClear, omMultiIds, omMultiToggle, omNewId, omPass, omRestoreMediaUploads, omSerializeScene, omSizeFromRatio, omUploadFile, onclick, processHelperClamped, processHelperInner, processHelperValue, processParsed, pushUndo, redoScene, refFail, refHelperByIndex, refHelperInner, refHelperLocal, renderHelper, resFail, sceneSnapshot, undoScene, updateHelperInner, updateHelperMin, updateHelperRaw, updateHelperTotal } from './engine-core.js';
import { computeHelperMin, computeHelperParsed, helperRaw, helperValue, omAddGroup, omProjectXml, omWalkScenes, processMax, refHelperClamped } from './engine-scene.js';
import { maxHelper, setExportStatus } from './export-progress.js';
import { applyElement, applyHelperRaw, bindHelper, bindHelperClamped, bindHelperEnd, bindHelperInner, bindHelperOuter, bindHelperRaw, buildHelperLocal, buildHelperParsed, getEl, getElHelper, getHelperLocal, handleHelperRaw, helperLocal, helperMap, iHelper, omFxOpenBrowse, omFxRenderBrowse, omFxRenderSet, omInitElemBar, omInitProjectSettingsCard, omInitTopbar, omMultiRefresh, omOpenCurve, omPickInput, omSaveProject, processHelperEnd, processHelperOuter, showOmLanding, showOmPassword } from './ui-shell.js';
import { getFail } from './parser-amfx.js';
import { parseHexColor, toCssColor } from './color.js';
import { omFxWriteChannel, omKfRefresh, omSetKeyable, processScoped, refHelper } from './timeline-keyframe.js';
import { helperList, processHelperScoped, refHelperMin } from './render-camera.js';
import { applyHelperStart, failHelper, getHelperByIndex, handleHelperInner, objHelperClamped, resHelperValue } from './export-ffmpeg.js';
import { appendLog, bind, flagHelper, getFlag, handleOuter, helperOuter, omMultiRefreshStyles, processStart, renderHelperMin, updateHelperEnd, updateHelperParsed } from './render-text.js';
import { buildHelperStart, cloneLayerSafe, decodeAudioPeaks, findParentArray, getHelper, handleHelperByKey, objHelper, objHelperRaw, omAddCamera, omAddMediaFile, omCopyLayers, omExtendTotal, omMultiSelectAll, omResolveLayer, omRewriteAudioSrcs, processHelper, processInner, refHelperParsed, refHelperValue, renderWaveformSvgBars, updateHelperCount } from './engine-layer.js';
import { omAddShape, omPropsRefresh, updateHelperValue } from './ui-properties.js';
import { buildHelperOuter, computeHelperEl, getHelperScoped, handleHelper, handleHelperList, handleHelperStart, handleLocal, helperParsed, jumpNextKeyframeOrBookmark, jumpPrevKeyframeOrBookmark, nHelper, omMeta, processHelperLocal, renderElement, renderHelperParsed } from './timeline-playback.js';
import { handleHelperByIndex, helperStart, omCurrentLayers, omCurrentScene } from './render-canvas.js';
import { omAddText, omCopyStyle, omKeyableOf, omTransformXml, readGlobalT, sort } from './engine-transform.js';
import { refHelperOuter } from './render-shape.js';
import { omAddElementFile, omEffectObjFromXml, omParseLayer, renderHelperList, updateFail } from './parser-effect-xml.js';
import { omGetFontList, omImportFontFile } from './preset-data.js';
import { objHelperValue, rHelper } from './timeline-easing.js';
import { createZipFromEntries } from './export-render.js';
var valueStepped = new Map(),
  recordValue = {
    vec2: 2,
    vec3: 3,
    vec4: 4
  };
var bytes = new Uint8Array(512),
  localUintArray = new Uint8Array(512),
  noiseDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]];
{
  let localItemParsed = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
  for (let valueEl = 0; valueEl < 512; valueEl++) bytes[valueEl] = localItemParsed[valueEl % 256], localUintArray[valueEl] = bytes[valueEl] % 12;
}
var valuePhase = (Math.sqrt(3) - 1) * 0.5,
  localTotal = (3 - Math.sqrt(3)) / 6;
var easingFunctions = {
  linear: ksCondition => ksCondition <= 0 ? 0 : ksCondition >= 1 ? 1 : ksCondition,
  none: argTotal => argTotal <= 0 ? 0 : argTotal >= 1 ? 1 : argTotal
};
var lastIndex = /([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;
var localMode = {
  ...recordValue,
  point: 2,
  size: 2,
  offset: 2
};
var setValue = new Set(["shape", "embedScene", "group", "text", "nullobj", "camera", "audio", "drawing"]);
var valuePrimary = [65, 77, 83, 72],
  localNodeStart = typeof TextEncoder < 'u' ? new TextEncoder() : null,
  localStepped = typeof TextDecoder < 'u' ? new TextDecoder() : null,
  localNodeDerived = new Uint32Array([1634760805, 857760878, 2036477234, 1797285236]),
  uint32Array2 = new Uint32Array([2654435769, 2246822507, 3266489909, 668265263, 374761393, 3550635116, 4251993797, 3042594569]),
  uint32Array3 = new Uint32Array(16),
  uint32Array4 = new Uint32Array(16),
  uintArray = new Uint8Array(64);
var localValueMode = ["distort", "color", "procedural", "blur", '3d', "transform", "drawing", "matte", "opacity", "repeat", "text", "other"],
  valueRecord = "am.exp.config",
  freeze = Object.freeze({
    enabled: false,
    profiler: false,
    overdrawCapOn: false,
    overdrawCap: 0.1,
    categoryMode: "off",
    categorySet: [],
    invalidateTargets: false,
    domainBucket: '0',
    fragPrecision: "highp"
  }),
  localValueBuffer = [{
    key: "profiler",
    label: "Profiler (CPU + GPU timer)",
    kind: "bool",
    fidelity: "identical",
    hint: "Menambah overhead. Hasil lewat \"Salin profil\"."
  }, {
    key: "overdrawCapOn",
    label: "Batasi overdraw efek",
    kind: "bool",
    fidelity: "edges",
    hint: "Efek yang minta overdraw lebih besar diberi batas ini (dijepit, tidak ditolak)."
  }, {
    key: "overdrawCap",
    label: "Batas overdraw",
    kind: "num",
    min: 0,
    max: 0.5,
    step: 0.05,
    fidelity: "edges",
    hint: "0 = tanpa overdraw sama sekali; permukaan overscan ikut mengecil."
  }, {
    key: "categoryMode",
    label: "Filter kategori efek",
    kind: "select",
    options: ["off", "only", "skip"],
    fidelity: "visible",
    hint: "only = hanya kategori terpilih yang jalan; skip = kategori terpilih dilewati."
  }, {
    key: "invalidateTargets",
    label: "Invalidate framebuffer (GPU tile)",
    kind: "bool",
    fidelity: "identical",
    hint: "WebGL2 saja. Lewati pass yang bisa discard."
  }, {
    key: "domainBucket",
    label: "Bulatkan ukuran domain efek (px)",
    kind: "select",
    options: ['0', '16', '32', '64'],
    fidelity: "edges",
    hint: "Kurangi buat/buang tekstur per frame pada efek overdraw."
  }, {
    key: "fragPrecision",
    label: "Presisi fragment shader",
    kind: "select",
    options: ["highp", "mediump"],
    fidelity: "visible",
    hint: "mediump bisa bikin banding. Berlaku saat preset dimuat ulang."
  }],
  valueMode = {
    aman: {
      invalidateTargets: true,
      domainBucket: '64'
    },
    cepat: {
      invalidateTargets: true,
      domainBucket: '64',
      overdrawCapOn: true,
      overdrawCap: 0.1
    },
    ekstrem: {
      invalidateTargets: true,
      domainBucket: '64',
      overdrawCapOn: true,
      overdrawCap: 0,
      categoryMode: "skip",
      categorySet: ["blur"],
      fragPrecision: "mediump"
    },
    profil: {
      profiler: true
    }
  };
var float32Array2 = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
var float32Array3 = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
var localValueNested = [1, 1],
  localPrimary = [36064],
  floatArray = new Float64Array([1, 0, 0, 1, 0, 0]),
  float64Array2 = new Float64Array(6),
  float64Array3 = new Float64Array(6);
var valueBuffer = {
    normal: [1, 771],
    add: [1, 1],
    plus: [1, 1],
    'linear-dodge': [1, 1],
    screen: [1, 769],
    multiply: [774, 771],
    mask: [0, 770],
    'clipping-mask': [0, 770],
    'mask-fill': [1, 771],
    'mask-exclude': [0, 771],
    exclude: [0, 771],
    'dst-in': [0, 770],
    'dst-out': [0, 771]
  },
  Ws = ["vec3 blendRgb2hsv(vec3 c) {", "    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);", "    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));", "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));", "    float d = q.x - min(q.w, q.y);", "    float e = 1.0e-10;", "    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);", '}', "vec3 blendHsv2rgb(vec3 c) {", "    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);", "    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);", "    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);", '}'].join('\x0a'),
  localToken = {
    'soft-overlay': "vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));",
    'soft-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-(top-0.5))) + (1.-t) * (bot * (top+0.5));",
    overlay: "vec3 t = step(0.5, bot); vec3 result = t * (1. - (1.-2.*(bot-0.5)) * (1.-top)) + (1.-t) * ((2.*bot) * top);",
    'hard-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (1.-2.*(top-0.5))) + (1.-t) * (bot * (2.*top));",
    'linear-light': "vec3 t = step(0.5, top); vec3 result = t * (bot + 2.*(top-0.5)) + (1.-t) * (bot + 2.*top - 1.);",
    'vivid-light': "vec3 t = step(0.5, top); vec3 result = t * (1. - (1.-bot) * (2.*(top-0.5))) + (1.-t) * (bot * (1.-2.*top));",
    'pin-light': "vec3 t = step(0.5, top); vec3 result = t * max(bot, 2.*(top-0.5)) + (1.-t) * min(bot, 2.*top);",
    darken: "vec3 result = min(top, bot);",
    lighten: "vec3 result = max(top, bot);",
    diff: "vec3 result = abs(bot - top);",
    difference: "vec3 result = abs(bot - top);",
    exclusion: "vec3 result = 0.5 - 2.*(bot-0.5)*(top-0.5);",
    'color-dodge': "vec3 result = bot / max(1. - top, 1e-4);",
    'color-burn': "vec3 result = 1. - (1.-bot) / max(top, 1e-4);",
    'linear-burn': "vec3 result = top + bot - 1.;",
    subtract: "vec3 result = bot - top;",
    divide: "vec3 result = bot / max(top, 1e-4);",
    'lighter-color': "vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? top : bot;",
    'darker-color': "vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 result = length(lw * top) > length(lw * bot) ? bot : top;",
    hue: {
      header: Ws,
      body: "vec3 result = blendHsv2rgb(vec3(blendRgb2hsv(top).r, blendRgb2hsv(bot).gb));"
    },
    saturation: {
      header: Ws,
      body: "vec3 botHsv = blendRgb2hsv(bot); vec3 result = blendHsv2rgb(vec3(botHsv.r, blendRgb2hsv(top).g, botHsv.b));"
    },
    color: "mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((bot * rgb2yuv).r, (top * rgb2yuv).gb) * yuv2rgb;",
    luminance: "mat3 rgb2yuv = mat3(0.299, 0.587, 0.114, -0.14713, -0.28886, 0.436, 0.615, -0.51499, -0.10001); mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0); vec3 result = vec3((top * rgb2yuv).r, (bot * rgb2yuv).gb) * yuv2rgb;"
  };
var localType = {
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
  localValueType = {
    normal: "source-over",
    mask: "destination-in",
    'clipping-mask': "destination-in",
    'mask-fill': "source-over",
    'mask-exclude': "destination-out",
    exclude: "destination-out",
    multiply: "multiply",
    screen: "screen",
    add: "lighter",
    plus: "lighter",
    'linear-dodge': "lighter",
    overlay: "overlay",
    'soft-overlay': "overlay",
    'soft-light': "soft-light",
    'hard-light': "hard-light",
    'linear-light': "hard-light",
    'vivid-light': "hard-light",
    'pin-light': "hard-light",
    darken: "darken",
    lighten: "lighten",
    'lighter-color': "lighten",
    'darker-color': "darken",
    'color-dodge': "color-dodge",
    'color-burn': "color-burn",
    'linear-burn': "multiply",
    diff: "difference",
    difference: "difference",
    exclusion: "exclusion",
    subtract: "difference",
    divide: "screen",
    hue: "hue",
    saturation: "saturation",
    color: "color",
    luminance: "luminosity"
  };
var valueMax = class {
    constructor(localCanvas, log = console.log, opaque = {}) {
      this.canvas = localCanvas, this.log = log;
      let ltCallback = (localArgSorted, argHeader) => {
          if (typeof localStorage > 'u') return argHeader;
          try {
            let getItem = localStorage.getItem(localArgSorted);
            return getItem === null ? argHeader : getItem === '1';
          } catch {
            return argHeader;
          }
        },
        localItemClamped = (argSorted, localArgPayload) => {
          if (typeof localStorage > 'u') return localArgPayload;
          try {
            let getItem = localStorage.getItem(argSorted);
            return getItem === null ? localArgPayload : getItem;
          } catch {
            return localArgPayload;
          }
        },
        ltResult = {
          alpha: !(opaque.opaque !== void 0 ? opaque.opaque === true : ltCallback("am.engineOpaque", false)),
          antialias: ltCallback("am.engineAntialias", false),
          depth: false,
          stencil: false,
          preserveDrawingBuffer: true,
          powerPreference: localItemClamped("am.enginePower", "high-performance")
        },
        ltValue = opaque.forceWebGL1 === true;
      if (!ltValue && typeof localStorage < 'u') try {
        ltValue = localStorage.getItem("am.forceWebGL1") === '1';
      } catch {}
      if (this.forceWebGL1 = ltValue, this.gl2 = ltValue ? null : localCanvas.getContext("webgl2", ltResult) || null, this.gl = this.gl2 || localCanvas.getContext("webgl", ltResult), !this.gl) throw new Error("WebGL tidak didukung di browser ini.");
      this.webglVersion = this.gl2 ? 2 : 1, this.log("[WEBGL] Backend: WebGL" + this.webglVersion + " (GLSL ES " + (this.webglVersion >= 2 ? "3.00" : "1.00") + ')'), this.scene = null, this.images = new Map(), this.programs = new Map(), this.failedEffects = new Set(), this.targets = new Map(), this.targetBudget = opaque.targetBudget || getHelperMin(), this.targetBytes = 0, this.R = 0, this.shapeDefs = new Map(), this.k = new Float64Array([1, 0, 0, 1, 0, 0]), this.G = false, this.ht = [0, 0, 0], this.ye = 0, this.u = null, this.i = null, this.W = {
        skipped: 0
      }, this.setExperimental(opaque.experimental !== void 0 ? handleHelperLocal(opaque.experimental) : handleHelperLocal(refHelperLocal())), this.effectsEnabled = true, this.debugMode = false, this.debugSelectedLayerId = null, this.debugCanvas = null, this.force2DSubScene = false, this.xe = new WeakMap(), this.ve = [0, 0, 0, 0], this.Ie = new Float32Array(16), this.l = {
        input: null,
        comp: null
      }, this.ke = new Map(), this.o = {
        toScreen: new Float32Array(16),
        toLayer: new Float32Array(16),
        sizePx: [0, 0],
        sizeNorm: [0, 0],
        centerPx: [0, 0],
        centerNorm: [0, 0],
        valid: false
      }, this.mediaScale = 1, this.videoDriftMs = 300, this.sizeScale = 2, this.autoSizeScale = 2, this.workHeight = 480, this.workWidth = 270, this.baseWidth = 270, this.baseHeight = 480, this.overscanMax = 0.5, this.overscan = 0, this.padX = 0, this.padY = 0, this.surfWidth = 270, this.surfHeight = 480, this.O = {
        origin: [0, 0],
        size: [1, 1]
      }, this.pt = new Float32Array(9), this.timeMs = 0, this.stats = {
        layers: 0,
        passes: 0,
        videoUploads: 0,
        videoReuses: 0,
        videoPasses: 0,
        videoAudioOnly: 0
      }, this.directVideoEnabled = true, this.videoTextures = new Map(), this.j = new WeakMap(), this.ie = new Set(), this.videoFramePending = false, this.videoFramesSeen = 0, this.Pe = false, this.gt = new Float32Array(9), this.customFonts = new Map(), this.Y = 0, this.mediaMode = "preview", this.mediaPlaying = false, this.mediaRate = 1, this.rasterCache = new Map(), this.ae = 0, this.Mn = "fx0:", this.I = new Float32Array(9), this.bt = new Float32Array(9), this._e = [], this.raster = document.createElement("canvas"), this.raster.width = this.workWidth, this.raster.height = this.workHeight, this.rasterCtx = this.raster.getContext('2d'), this.rasterCache.set(this.workWidth + 'x' + this.workHeight, {
        canvas: this.raster,
        ctx: this.rasterCtx
      }), this.P = null, this.Ee = null, this.yt();
    }
    get ["exp"]() {
      return this.u;
    }
    ["setExperimental"](ltCondition) {
      this.u = ltCondition || null, this.ye++, setDefaultPrecision(this.u && this.u.fragPrecision === "mediump" ? "mediump" : null), this.u && this.u.profiler ? this.i || (this.i = this.Be()) : this.i = null, this.W = {
        skipped: 0
      }, this.log && this.u && this.log("[EXP] Aktif: " + this.u.active.join(" | "));
    }
    ['Be']() {
      let gl = this.gl;
      return {
        frames: 0,
        raster: 0,
        chain: 0,
        frame: 0,
        targetCreates: 0,
        passes: 0,
        ext: this.webglVersion === 2 && gl ? gl.getExtension("EXT_disjoint_timer_query_webgl2") : null,
        pending: [],
        gpuByCat: {},
        gpuByEffect: {},
        gpuTotalNs: 0,
        gpuSamples: 0
      };
    }
    ["resetProfile"]() {
      this.i && (this.i = this.Be());
    }
    ["profileSummary"]() {
      let localI = this.i;
      if (!localI || !localI.frames) return null;
      let frames = localI.frames,
        localValueClamped = localArgFiltered => Math.round(localArgFiltered * 100) / 100,
        valueLayer = {},
        localPoint = {};
      for (let localValueFiltered of Object.keys(localI.gpuByCat)) valueLayer[localValueFiltered] = {
        ms: localValueClamped(localI.gpuByCat[localValueFiltered].ns / 1000000 / frames),
        passes: localI.gpuByCat[localValueFiltered].n
      };
      for (let valueFiltered of Object.keys(localI.gpuByEffect)) localPoint[valueFiltered] = {
        ms: localValueClamped(localI.gpuByEffect[valueFiltered].ns / 1000000 / frames),
        passes: localI.gpuByEffect[valueFiltered].n
      };
      return {
        frames: frames,
        cpuMsPerFrame: {
          total: localValueClamped(localI.frame / frames),
          raster: localValueClamped(localI.raster / frames),
          chain: localValueClamped(localI.chain / frames)
        },
        passesPerFrame: localValueClamped(localI.passes / frames),
        targetCreatesPerFrame: localValueClamped(localI.targetCreates / frames),
        gpuTimer: localI.ext ? "EXT_disjoint_timer_query_webgl2" : "unavailable",
        gpuEffectPassMsPerFrame: localValueClamped(localI.gpuTotalNs / 1000000 / frames),
        gpuByCategory: valueLayer,
        gpuByEffect: localPoint,
        surf: [this.surfWidth, this.surfHeight],
        overscan: this.overscan,
        targetMB: Math.round(this.targetBytes / 1048576),
        skippedEffectsPerFrame: localValueClamped(this.W.skipped / frames),
        active: this.u ? this.u.active : []
      };
    }
    ['le']() {
      let extValue = this.i;
      if (!extValue || !extValue.ext || extValue.pending.length > 256) return null;
      let localCreateQuery = this.gl,
        createQuery = localCreateQuery.createQuery();
      return localCreateQuery.beginQuery(extValue.ext.TIME_ELAPSED_EXT, createQuery), createQuery;
    }
    ['ue'](argFiltered, category) {
      let localExt = this.i;
      this.gl.endQuery(localExt.ext.TIME_ELAPSED_EXT), localExt.pending.push({
        q: argFiltered,
        cat: category && category.category || "other",
        id: category && category.id || '?'
      });
    }
    ['xt']() {
      let iValue = this.i;
      if (!iValue || !iValue.ext || !iValue.pending.length) return;
      let localGetParameter = this.gl,
        getParameter = localGetParameter.getParameter(iValue.ext.GPU_DISJOINT_EXT);
      for (; iValue.pending.length;) {
        let localQ = iValue.pending[0];
        if (!localGetParameter.getQueryParameter(localQ.q, localGetParameter.QUERY_RESULT_AVAILABLE)) break;
        if (iValue.pending.shift(), !getParameter) {
          let getQueryParameter = localGetParameter.getQueryParameter(localQ.q, localGetParameter.QUERY_RESULT);
          iValue.gpuTotalNs += getQueryParameter, iValue.gpuSamples++;
          let ns = iValue.gpuByCat[localQ.cat] || (iValue.gpuByCat[localQ.cat] = {
            ns: 0,
            n: 0
          });
          ns.ns += getQueryParameter, ns.n++;
          let localNs = iValue.gpuByEffect[localQ.id] || (iValue.gpuByEffect[localQ.id] = {
            ns: 0,
            n: 0
          });
          localNs.ns += getQueryParameter, localNs.n++;
        }
        localGetParameter.deleteQuery(localQ.q);
      }
    }
    ['yt']() {
      let createBuffer = this.gl;
      this.positionBuffer = createBuffer.createBuffer(), createBuffer.bindBuffer(createBuffer.ARRAY_BUFFER, this.positionBuffer), createBuffer.bufferData(createBuffer.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), createBuffer.STATIC_DRAW), this.texCoordBuffer = createBuffer.createBuffer(), createBuffer.bindBuffer(createBuffer.ARRAY_BUFFER, this.texCoordBuffer), createBuffer.bufferData(createBuffer.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), createBuffer.STATIC_DRAW), this.placeholderTexture = createBuffer.createTexture(), createBuffer.bindTexture(createBuffer.TEXTURE_2D, this.placeholderTexture), createBuffer.texImage2D(createBuffer.TEXTURE_2D, 0, createBuffer.RGBA, 1, 1, 0, createBuffer.RGBA, createBuffer.UNSIGNED_BYTE, new Uint8Array([30, 30, 40, 255])), this.we(), this.blitProgram = this.K(this.de(), this.Ne()), this.blitUniforms = this.J(this.blitProgram), this.blitAttribs = this.Z(this.blitProgram), this.videoProgram = this.K(this.vt(), this.kt()), this.videoUniforms = this.J(this.videoProgram), this.videoAttribs = this.Z(this.videoProgram);
    }
    ['vt']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nuniform mat3 u_transform;\nuniform vec2 u_sizePx;\nuniform vec4 u_uvRect;\nvoid main() {\n    vec2 local = a_position * u_sizePx * 0.5;\n    vec3 pos = u_transform * vec3(local, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);\n}\n" : "precision highp float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nuniform mat3 u_transform;\nuniform vec2 u_sizePx;\nuniform vec4 u_uvRect;\nvoid main() {\n    vec2 local = a_position * u_sizePx * 0.5;\n    vec3 pos = u_transform * vec3(local, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_texCoord);\n}\n";
    }
    ['kt']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\nuniform sampler2D u_image;\nvoid main() {\n    acFragColor = texture(u_image, v_texCoord);\n}\n" : "precision highp float;\nvarying vec2 v_texCoord;\nuniform sampler2D u_image;\nvoid main() {\n    gl_FragColor = texture2D(u_image, v_texCoord);\n}\n";
    }
    ['de']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n" : "precision highp float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_texCoord;\nuniform mat3 u_transform;\nvoid main() {\n    vec3 pos = u_transform * vec3(a_position, 1.0);\n    gl_Position = vec4(pos.xy, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n}\n";
    }
    ['Ne']() {
      return this.webglVersion >= 2 ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 c = texture(u_image, v_texCoord);\n    // Tekstur premultiplied -> alpha ikut dikalikan ke rgb.\n    acFragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);\n}\n" : "precision highp float;\nvarying vec2 v_texCoord;\nuniform sampler2D u_image;\nuniform float u_alpha;\nvoid main() {\n    vec4 c = texture2D(u_image, v_texCoord);\n    gl_FragColor = vec4(c.rgb * u_alpha, c.a * u_alpha);\n}\n";
    }
    ['we']() {
      let texParameteri = this.gl;
      texParameteri.texParameteri(texParameteri.TEXTURE_2D, texParameteri.TEXTURE_WRAP_S, texParameteri.CLAMP_TO_EDGE), texParameteri.texParameteri(texParameteri.TEXTURE_2D, texParameteri.TEXTURE_WRAP_T, texParameteri.CLAMP_TO_EDGE), texParameteri.texParameteri(texParameteri.TEXTURE_2D, texParameteri.TEXTURE_MIN_FILTER, texParameteri.LINEAR), texParameteri.texParameteri(texParameteri.TEXTURE_2D, texParameteri.TEXTURE_MAG_FILTER, texParameteri.LINEAR);
    }
    ['Ue'](localArgMapped, argMapped) {
      let localCreateShader = this.gl,
        createShader = localCreateShader.createShader(localArgMapped);
      if (localCreateShader.shaderSource(createShader, argMapped), localCreateShader.compileShader(createShader), !localCreateShader.getShaderParameter(createShader, localCreateShader.COMPILE_STATUS)) {
        let getShaderInfoLog = localCreateShader.getShaderInfoLog(createShader);
        throw localCreateShader.deleteShader(createShader), new Error(getShaderInfoLog.split('\x0a')[0]);
      }
      return createShader;
    }
    ['K'](localArgFirst, argFirst) {
      let vertexShader = this.gl,
        localUe = this.Ue(vertexShader.VERTEX_SHADER, localArgFirst),
        ueValue = this.Ue(vertexShader.FRAGMENT_SHADER, argFirst),
        createProgram = vertexShader.createProgram();
      if (vertexShader.attachShader(createProgram, localUe), vertexShader.attachShader(createProgram, ueValue), vertexShader.linkProgram(createProgram), vertexShader.deleteShader(localUe), vertexShader.deleteShader(ueValue), !vertexShader.getProgramParameter(createProgram, vertexShader.LINK_STATUS)) {
        let getProgramInfoLog = vertexShader.getProgramInfoLog(createProgram);
        throw vertexShader.deleteProgram(createProgram), new Error(getProgramInfoLog.split('\x0a')[0]);
      }
      return createProgram;
    }
    ['J'](localArgCurrent) {
      let localGetProgramParameter = this.gl,
        localValuePoint = {},
        getProgramParameter = localGetProgramParameter.getProgramParameter(localArgCurrent, localGetProgramParameter.ACTIVE_UNIFORMS);
      for (let ltNumber = 0; ltNumber < getProgramParameter; ltNumber++) {
        let getActiveUniform = localGetProgramParameter.getActiveUniform(localArgCurrent, ltNumber);
        getActiveUniform && (localValuePoint[getActiveUniform.name.replace(/\[0\]$/, '')] = localGetProgramParameter.getUniformLocation(localArgCurrent, getActiveUniform.name));
      }
      return localValuePoint;
    }
    ['Z'](localArgSecondary) {
      let getAttribLocation = this.gl;
      return {
        a_position: getAttribLocation.getAttribLocation(localArgSecondary, "a_position"),
        a_texCoord: getAttribLocation.getAttribLocation(localArgSecondary, "a_texCoord")
      };
    }
    ['E'](aPosition) {
      let bindBuffer = this.gl;
      aPosition.a_position >= 0 && (bindBuffer.bindBuffer(bindBuffer.ARRAY_BUFFER, this.positionBuffer), bindBuffer.enableVertexAttribArray(aPosition.a_position), bindBuffer.vertexAttribPointer(aPosition.a_position, 2, bindBuffer.FLOAT, false, 0, 0)), aPosition.a_texCoord >= 0 && (bindBuffer.bindBuffer(bindBuffer.ARRAY_BUFFER, this.texCoordBuffer), bindBuffer.enableVertexAttribArray(aPosition.a_texCoord), bindBuffer.vertexAttribPointer(aPosition.a_texCoord, 2, bindBuffer.FLOAT, false, 0, 0));
    }
    ['F'](ltText, argOuter, argSecondary = '', argCurrent = false) {
      let valuePoint = argSecondary + ltText + 'x' + argOuter,
        lastFrame = this.targets.get(valuePoint);
      if (lastFrame) return lastFrame.lastFrame = this.R, argCurrent || (lastFrame.wantB = true), lastFrame;
      let createTextureValue = this.gl;
      this.i && this.i.targetCreates++;
      let localLine = () => {
          let createTexture = createTextureValue.createTexture();
          createTextureValue.bindTexture(createTextureValue.TEXTURE_2D, createTexture), createTextureValue.texImage2D(createTextureValue.TEXTURE_2D, 0, createTextureValue.RGBA, ltText, argOuter, 0, createTextureValue.RGBA, createTextureValue.UNSIGNED_BYTE, null), this.we();
          let createFramebuffer = createTextureValue.createFramebuffer();
          return createTextureValue.bindFramebuffer(createTextureValue.FRAMEBUFFER, createFramebuffer), createTextureValue.framebufferTexture2D(createTextureValue.FRAMEBUFFER, createTextureValue.COLOR_ATTACHMENT0, createTextureValue.TEXTURE_2D, createTexture, 0), {
            tex: createTexture,
            fbo: createFramebuffer
          };
        },
        et = {
          make: localLine,
          w: ltText,
          h: argOuter,
          wantB: !argCurrent,
          lastFrame: this.R,
          a: localLine(),
          ee: null
        };
      return Object.defineProperty(et, 'b', {
        enumerable: true,
        configurable: true,
        get() {
          return this.ee || (this.ee = this.make(), this.Et()), this.ee;
        }
      }), et.Et = () => {
        let localBytes = (1 + (et.ee ? 1 : 0)) * ltText * argOuter * 4,
          wt = et.wt;
        wt && (wt.targetBytes += localBytes - et.bytes), et.bytes = localBytes;
      }, et.wt = this, et.bytes = ltText * argOuter * 4, createTextureValue.bindFramebuffer(createTextureValue.FRAMEBUFFER, null), this.targets.set(valuePoint, et), this.targetBytes += et.bytes, this.targetBytes > this.targetBudget && this.De(), et;
    }
    ['De']() {
      if (this.targetBytes <= this.targetBudget) return;
      let deleteTexture = this.gl,
        localItemScoped = [...this.targets.keys()].filter(localArgStream => this.targets.get(localArgStream).lastFrame !== this.R).sort((localArgSecond, argSecond) => this.targets.get(localArgSecond).lastFrame - this.targets.get(argSecond).lastFrame);
      for (let localValueLine of localItemScoped) {
        if (this.targetBytes <= this.targetBudget) break;
        let ee = this.targets.get(localValueLine);
        for (let tex of [ee.a, ee.ee]) tex && (deleteTexture.deleteTexture(tex.tex), deleteTexture.deleteFramebuffer(tex.fbo));
        this.targets.delete(localValueLine), this.targetBytes -= ee.bytes;
      }
    }
    ['Tt']() {
      let localDeleteTexture = this.gl;
      for (let localEe of this.targets.values()) for (let localFbo of [localEe.a, localEe.ee]) localFbo && (localDeleteTexture.deleteTexture(localFbo.tex), localDeleteTexture.deleteFramebuffer(localFbo.fbo));
      this.targets.clear(), this.targetBytes = 0;
    }
    ["setScene"](sceneArg) {
      if (sceneArg) helperRaw(sceneArg);
      this.scene = sceneArg, this.autoSizeScale = nHelperValue(sceneArg), this.sizeScale = this.autoSizeScale, this.log("[SCENE] Satuan ukuran layer: x" + this.sizeScale + (this.sizeScale === 2 ? " (AM menyimpan size dalam satuan proxy 1/2)" : '')), this.setResolution(this.workHeight);
    }
    ["setResolution"](localArgThird) {
      this.workHeight = Math.max(180, Math.round(localArgThird)), this.workWidth = this.scene ? Math.max(2, Math.round(this.scene.width / this.scene.height * this.workHeight)) : this.workHeight, this.canvas.width = this.workWidth, this.canvas.height = this.workHeight, this.baseWidth = this.workWidth, this.baseHeight = this.workHeight, this.Oe(), this.log("[SCENE] Resolusi render: " + this.workWidth + 'x' + this.workHeight);
    }
    ['Oe']() {
      let localExtra = Math.max(0, this.overscan || 0);
      this.padX = localExtra > 0 ? Math.round(this.baseWidth * localExtra) : 0, this.padY = localExtra > 0 ? Math.round(this.baseHeight * localExtra) : 0, this.surfWidth = this.baseWidth + 2 * this.padX, this.surfHeight = this.baseHeight + 2 * this.padY, this.raster.width = this.surfWidth, this.raster.height = this.surfHeight, this.targets && this.Tt(), this.rasterCache = new Map(), this.rasterCache.set(this.surfWidth + 'x' + this.surfHeight, {
        canvas: this.raster,
        ctx: this.rasterCtx
      }), this.O = {
        origin: [-this.padX / this.baseWidth, -this.padY / this.baseHeight],
        size: [this.surfWidth / this.baseWidth, this.surfHeight / this.baseHeight]
      }, this.P = null, this.Ee = null;
    }
    ['Mt']() {
      let he = this.scene,
        stValue = this.hiddenLayers ? this.hiddenLayers.size : 0;
      (this.He !== he || this.St !== stValue || this.At !== this.ye) && (this.He = he, this.St = stValue, this.At = this.ye, this.Ft = this.Ct(he));
      let ft = this.Ft;
      ft !== this.overscan && (this.overscan = ft, this.Oe(), this.log("[SCENE] Overscan " + (ft ? Math.round(ft * 100) + '%' : "mati") + ": permukaan " + this.surfWidth + 'x' + this.surfHeight));
    }
    ['Ct'](localArgTertiary) {
      let localValueAlternate = 0;
      for (let valueAlternate of localArgTertiary.layers) {
        if (this.hiddenLayers && this.hiddenLayers.has(valueAlternate.id)) continue;
        let oe = this.oe(valueAlternate);
        if (!(oe > 0)) continue;
        let localFe = this.fe(valueAlternate, this.se(valueAlternate, localArgTertiary)),
          localItemLocal = Math.max(localFe[0] / this.baseWidth, localFe[1] / this.baseHeight, 0.5);
        localValueAlternate = Math.max(localValueAlternate, oe * localItemLocal);
      }
      let overdrawCap = this.u;
      return overdrawCap && overdrawCap.overdrawCap < this.overscanMax ? Math.min(this.overscanMax, overdrawCap.overdrawCap, Math.ceil(localValueAlternate * 20) / 20) : Math.min(this.overscanMax, Math.ceil(localValueAlternate * 20) / 20);
    }
    ["setImages"](images) {
      this.images = images;
      let ltSet = new Set();
      for (let localAlternate of images.values()) !localAlternate || localAlternate.tagName !== "VIDEO" || (ltSet.add(localAlternate), this.attachVideoElement(localAlternate));
      for (let valueLine of [...this.ie]) ltSet.has(valueLine) || this.detachVideoElement(valueLine);
      for (let [localRect, localItemOuter] of [...this.videoTextures]) if (!ltSet.has(localRect)) {
        if (typeof this.gl.deleteTexture == "function") try {
          this.gl.deleteTexture(localItemOuter.tex);
        } catch {}
        this.videoTextures.delete(localRect);
      }
    }
    ["attachVideoElement"](localRequestVideoFrameCallback) {
      if (!localRequestVideoFrameCallback || localRequestVideoFrameCallback.tagName !== "VIDEO" || (this.ie.add(localRequestVideoFrameCallback), typeof localRequestVideoFrameCallback.requestVideoFrameCallback != "function")) return;
      let localValueSource = this.j.get(localRequestVideoFrameCallback);
      localValueSource || (localValueSource = {
        active: true,
        id: 0
      }, this.j.set(localRequestVideoFrameCallback, localValueSource)), localValueSource.id || this.ze(localRequestVideoFrameCallback, localValueSource);
    }
    ['ze'](requestVideoFrameCallback, localActive) {
      if (localActive.active) try {
        localActive.id = requestVideoFrameCallback.requestVideoFrameCallback((localArgContext, mediaTime) => {
          if (localActive.active) {
            if (localActive.id = 0, this.videoFramePending = true, this.videoFramesSeen++, !requestVideoFrameCallback.paused && mediaTime && Number.isFinite(mediaTime.mediaTime)) {
              let lt = requestVideoFrameCallback.Lt;
              if (Number.isFinite(lt) && mediaTime.mediaTime > lt) {
                let localValueOther = mediaTime.mediaTime - lt;
                if (localValueOther > 0.001 && localValueOther < 1) {
                  let ve = requestVideoFrameCallback.Ve;
                  requestVideoFrameCallback.Ve = Number.isFinite(ve) && ve > 0 ? Math.min(ve, localValueOther) : localValueOther;
                }
              }
              requestVideoFrameCallback.Lt = mediaTime.mediaTime;
            }
            requestVideoFrameCallback.paused || this.ze(requestVideoFrameCallback, localActive);
          }
        });
      } catch {
        localActive.active = false, this.j.delete(requestVideoFrameCallback);
      }
    }
    ['Te'](localCancelVideoFrameCallback) {
      let valueOther = this.j.get(localCancelVideoFrameCallback);
      if (valueOther) {
        if (typeof localCancelVideoFrameCallback.cancelVideoFrameCallback == "function" && valueOther.id) try {
          localCancelVideoFrameCallback.cancelVideoFrameCallback(valueOther.id);
        } catch {}
        valueOther.id = 0;
      }
    }
    ["detachVideoElement"](cancelVideoFrameCallback) {
      this.ie.delete(cancelVideoFrameCallback);
      let localOther = this.j.get(cancelVideoFrameCallback);
      if (localOther && (localOther.active = false, this.j.delete(cancelVideoFrameCallback), typeof cancelVideoFrameCallback.cancelVideoFrameCallback == "function" && localOther.id)) try {
        cancelVideoFrameCallback.cancelVideoFrameCallback(localOther.id);
      } catch {}
    }
    ["consumeVideoFrame"]() {
      let videoFramePending = this.videoFramePending;
      return this.videoFramePending = false, videoFramePending;
    }
    ["setMediaMode"](localExport) {
      this.mediaMode = localExport === "export" ? "export" : "preview";
    }
    ['Xe']() {
      let localValueRect = new Set();
      for (let localFiltered of this.images.values()) localFiltered && localFiltered.tagName === "VIDEO" && localValueRect.add(localFiltered);
      return localValueRect;
    }
    ['me'](localFillVideo) {
      let localItemInner = localFillVideo.fillVideo || localFillVideo.fillImage;
      return this.images.get(localItemInner) || localFillVideo.fillVideo && this.images.get(localFillVideo.fillVideo) || localFillVideo.fillImage && this.images.get(localFillVideo.fillImage) || void 0;
    }
    ['Ge'](argThird) {
      let valueRect = new Set(),
        localPath = (localArgNext, argNext) => {
          if (!(!localArgNext || !localArgNext.layers)) for (let tagValue of localArgNext.layers) {
            if (tagValue.tag === "embedScene" && tagValue.scene) {
              localPath(tagValue.scene, argNext - tagValue.startTime);
              continue;
            }
            if (tagValue.fillType !== "media") continue;
            let localValueMapped = this.me(tagValue);
            if (!localValueMapped || localValueMapped.tagName !== "VIDEO" || tagValue.hidden || tagValue.re || this.hiddenLayers && this.hiddenLayers.has(tagValue.id)) continue;
            let localValuePath = this.X(tagValue, argNext);
            localValuePath !== null && (buildHelper(tagValue.transform.opacity, localValuePath) <= 0.002 || this.We(tagValue, (argNext - tagValue.startTime) / 1000) <= 0.002 || valueRect.add(localValueMapped));
          }
        };
      return localPath(this.scene, argThird), valueRect;
    }
    ['$t'](localArgFourth) {
      if (this.ie.size === 0) {
        this.stats.videoAudioOnly = 0;
        return;
      }
      let ge = this.Ge(localArgFourth),
        videoAudioOnly = 0;
      for (let valueMapped of this.ie) {
        if (ge.has(valueMapped)) {
          this.attachVideoElement(valueMapped);
          continue;
        }
        this.Te(valueMapped), videoAudioOnly++;
      }
      this.stats.videoAudioOnly = videoAudioOnly;
    }
    ["playMedia"](argTertiary = 1) {
      this.mediaPlaying = true, this.mediaRate = Math.max(0.0625, Math.min(16, Number(argTertiary) || 1));
      let localGe = this.Ge(this.timeMs);
      for (let je of this.Xe()) {
        je.je = null, je.Re = void 0, localGe.has(je) ? this.attachVideoElement(je) : this.Te(je);
        try {
          je.playbackRate = this.mediaRate, je.paused && je.play().catch(() => {});
        } catch {}
      }
    }
    ["pauseMedia"]() {
      this.mediaPlaying = false;
      for (let pause of this.Xe()) {
        this.Te(pause);
        try {
          pause.pause();
        } catch {}
      }
    }
    ['Rt'](argFourth) {
      let ltItems = [],
        valuePath = (localArgPrev, localArgExtra) => {
          if (!(!localArgPrev || !localArgPrev.layers)) for (let hidden of localArgPrev.layers) {
            if (hidden.hidden || hidden.re || this.hiddenLayers && this.hiddenLayers.has(hidden.id)) continue;
            let localEffect = this.X(hidden, localArgExtra);
            if (localEffect === null) continue;
            let localValueEffect = localArgExtra - hidden.startTime;
            if (hidden.tag === "embedScene" && hidden.scene) {
              valuePath(hidden.scene, localValueEffect);
              continue;
            }
            if (hidden.fillType !== "media") continue;
            let meValue = this.me(hidden);
            if (!meValue || meValue.tagName !== "VIDEO" || buildHelper(hidden.transform.opacity, localEffect) <= 0.002) continue;
            let valueEffect = maxHelper(hidden, localValueEffect, meValue.duration);
            valueEffect !== null && ltItems.push({
              layer: hidden,
              video: meValue,
              targetSec: valueEffect
            });
          }
        };
      return valuePath(this.scene, argFourth), ltItems;
    }
    ['It'](reArg, localArgInner) {
      let jeValue = reArg.je;
      if (jeValue == null) return false;
      if (Math.abs(localArgInner - jeValue) < 0.002) return true;
      if (localArgInner < jeValue) return false;
      let re = reArg.Re,
        localVe = reArg.Ve;
      return !Number.isFinite(re) || !Number.isFinite(localVe) || localVe <= 0 ? Math.abs(localArgInner - jeValue) < 0.004 : re > localArgInner + 0.000001 ? false : localArgInner < re + localVe - 0.002;
    }
    async ["prepareMedia"](localArgFifth) {
      let rt = this.Rt(localArgFifth);
      if (!rt.length) return 0;
      let ltMap = new Map();
      for (let {
        video: localItemStart,
        targetSec: localItemEnd
      } of rt) ltMap.set(localItemStart, localItemEnd);
      let localParam = 0;
      return await Promise.all([...ltMap].map(async ([localReadyState, jeArg]) => {
        await processHelperEnd(localReadyState), !(!localReadyState || localReadyState.readyState < 2) && (this.It(localReadyState, jeArg) || flagHelperValue(localReadyState, jeArg) && (localParam++, await renderHelperByKey(localReadyState, jeArg), localReadyState.je = jeArg));
      })), localParam;
    }
    async ["loadEffectLibrary"](argFifth, localArgSixth) {
      this.programs.clear(), this.failedEffects.clear(), this.He = null, this.xe = new WeakMap();
      let localValueParam = 0;
      for (let valueSource of argFifth) if (!this.programs.has(valueSource)) try {
        let valueParam = await localArgSixth(valueSource);
        this.programs.set(valueSource, {
          ...this.Pt(valueParam),
          definition: valueParam
        }), localValueParam++;
      } catch (message) {
        this.failedEffects.add(valueSource), this.log("[SCENE] Efek " + valueSource + " dilewati: " + String(message.message).split('\x0a')[0]);
      }
      this.log("[SCENE] " + localValueParam + " program efek siap, " + this.failedEffects.size + " efek dilewati.");
    }
    async ["loadEffect"](id, argSixth) {
      if (!id) return false;
      if (this.programs.has(id)) return true;
      try {
        let fetcher = argSixth || getFail;
        let localMapped = await fetcher(id);
        if (!localMapped) return false;
        this.programs.set(id, {
          ...this.Pt(localMapped),
          definition: localMapped
        });
        return true;
      } catch (localNodeEnd) {
        this.failedEffects.add(id);
        this.log("[SCENE] Efek " + id + " dilewati: " + String(localNodeEnd.message).split('\x0a')[0]);
        return false;
      }
    }
    async ["loadShapeLibrary"](localArgSeventh, argSeventh) {
      this.shapeDefs.clear();
      let localMedia = 0;
      for (let localValueList of localArgSeventh) if (!(!localValueList || localValueList[0] !== '.') && !this.shapeDefs.has(localValueList)) try {
        let localValueMedia = await argSeventh(localValueList);
        if (!localValueMedia) continue;
        this.shapeDefs.set(localValueList, fail(localValueMedia)), localMedia++;
      } catch (localNodeMin) {
        this.log("[SCENE] Bentuk " + localValueList + " dilewati: " + String(localNodeMin.message).split('\x0a')[0]);
      }
      this.log("[SCENE] " + localMedia + " bentuk bawaan siap.");
    }
    ['Pt'](shaders) {
      let valueMedia = shaders.shaders && shaders.shaders.length ? shaders.shaders : shaders.shader ? [shaders.shader] : [],
        localValueFirst = shaders.script && shaders.script.code ? compileScriptEffect(shaders, this.log) : null;
      if (valueMedia.length) {
        let localValueScene = {
            webglVersion: this.webglVersion
          },
          localSize = new Map(),
          valueFirst = [];
        for (let group of valueMedia) {
          let string = String(group.group);
          if (localSize.has(string)) continue;
          let localRecord = {
            ...shaders,
            shader: group
          };
          try {
            let localBuildVertexShaderSource = buildVertexShaderSource(localRecord, () => {}, localValueScene),
              localBuildFragmentShaderSource = buildFragmentShaderSource(localRecord, () => {}, localValueScene),
              kValue = this.K(localBuildVertexShaderSource, localBuildFragmentShaderSource);
            localSize.set(string, {
              program: kValue,
              canDiscard: /\bdiscard\b/.test(localBuildFragmentShaderSource),
              uniforms: this.J(kValue),
              attribs: this.Z(kValue),
              uniformNames: buildParamNameMap(localRecord),
              definition: localRecord
            }), valueFirst.push(string);
          } catch (localNodeMax) {
            this.log("[SCENE] Shader group " + string + " dari " + shaders.id + " dilewati: " + String(localNodeMax.message).split('\x0a')[0]);
          }
        }
        if (!localSize.size) throw new Error("semua shader group gagal dikompilasi.");
        return {
          ...localSize.get(valueFirst[0]),
          programsByGroup: localSize,
          groupOrder: valueFirst,
          animator: localValueFirst
        };
      }
      if (localValueFirst) {
        let localValueSecond = this.K(this.de(), this.Ne());
        return {
          program: localValueSecond,
          uniforms: this.J(localValueSecond),
          attribs: this.Z(localValueSecond),
          uniformNames: new Map(),
          programsByGroup: null,
          groupOrder: [],
          animator: localValueFirst
        };
      }
      // Efek native bawaan Alight Motion (mis. text-transform, drawing-progress, timequant, repeat, text-spacing)
      let localK = this.K(this.de(), this.Ne());
      return {
        program: localK,
        uniforms: this.J(localK),
        attribs: this.Z(localK),
        uniformNames: new Map(),
        programsByGroup: null,
        groupOrder: [],
        animator: null,
        isNative: true,
        definition: shaders
      };
    }
    ['_t'](fillStyle, localTagName, argInner, localArgStart, argClamped, localArgScoped, argPrev, localArgEighth) {
      if (!localTagName) {
        fillStyle.fillStyle = "rgba(70,70,90,0.6)", fillStyle.fillRect(argInner, localArgStart, argClamped, localArgScoped);
        return;
      }
      if (localTagName.tagName === "VIDEO" && localTagName.readyState < 2) return;
      let localValueAnother = localTagName.videoWidth || localTagName.naturalWidth || localTagName.width || 1,
        valueAnother = localTagName.videoHeight || localTagName.naturalHeight || localTagName.height || 1,
        valueSecond = updateHelperInner(localArgEighth, localValueAnother, valueAnother);
      if (valueSecond) {
        let {
          dw: valueScene,
          dh: localFrame
        } = objHelperScoped(valueSecond, localValueAnother, valueAnother, argClamped, localArgScoped, argPrev);
        fillStyle.save(), fillStyle.beginPath(), fillStyle.rect(argInner, localArgStart, argClamped, localArgScoped), fillStyle.clip(), fillStyle.translate(argInner + argClamped / 2, localArgStart + localArgScoped / 2), fillStyle.rotate(valueSecond * Math.PI / 180), fillStyle.drawImage(localTagName, 0, 0, localValueAnother, valueAnother, -valueScene / 2, -localFrame / 2, valueScene, localFrame), fillStyle.restore();
        return;
      }
      if (argPrev === "stretch") {
        fillStyle.drawImage(localTagName, argInner, localArgStart, argClamped, localArgScoped);
        return;
      }
      let localObjHelperLocal = objHelperLocal(argPrev, localValueAnother, valueAnother, argClamped, localArgScoped);
      fillStyle.drawImage(localTagName, localObjHelperLocal.sx, localObjHelperLocal.sy, localObjHelperLocal.sw, localObjHelperLocal.sh, argInner, localArgStart, argClamped, localArgScoped);
    }
    ['Me'](beginPath, shapeType, coordArg, argValue, argExtra) {
      let localSource = shapeType.shapeType || ".rect",
        getPath = this.shapeDefs.get(localSource);
      if (getPath) {
        let localValueFrame = shapeType.he || 0,
          localItemMin = localValueFrame > 0 ? (shapeType.B || 0) / localValueFrame : 0,
          localValueTarget = null;
        try {
          localValueTarget = getPath.getPath(refHelperByIndex(getPath, shapeType, localItemMin));
        } catch {
          localValueTarget = null;
        }
        if (localValueTarget && localValueTarget.length) {
          let localItemMax = this.workHeight / (shapeType.N || this.scene).height;
          this.$(beginPath, helperByIndex(localValueTarget), localItemMax);
          return;
        }
      }
      if (beginPath.beginPath(), localSource === ".circle" || localSource === ".ellipse") beginPath.ellipse(0, 0, Math.max(0.5, coordArg / 2), Math.max(0.5, argValue / 2), 0, 0, Math.PI * 2);else {
        if (localSource === ".pie") {
          let valueFrame = shapeType.B !== void 0 ? shapeType.B / Math.max(1, shapeType.he || 1000) : 0,
            localItemByKey = shapeType.startAngle ? buildHelper(shapeType.startAngle, valueFrame) : 0,
            localItemByIndex = shapeType.endAngle ? buildHelper(shapeType.endAngle, valueFrame) : 360,
            localItemEl = localItemByKey * Math.PI / 180,
            localItemList = localItemByIndex * Math.PI / 180,
            localItemMap = Math.max(0.5, coordArg / 2),
            localItemCount = Math.max(0.5, argValue / 2);
          beginPath.moveTo(0, 0), beginPath.ellipse(0, 0, localItemMap, localItemCount, 0, localItemEl, localItemList, false), beginPath.closePath();
        } else {
          if (localSource === ".roundrect" && argExtra > 0.5) {
            let localMin = Math.min(argExtra, Math.min(coordArg, argValue) / 2),
              coordValue = -coordArg / 2,
              localParsed = -argValue / 2;
            beginPath.moveTo(coordValue + localMin, localParsed), beginPath.lineTo(coordValue + coordArg - localMin, localParsed), beginPath.arcTo(coordValue + coordArg, localParsed, coordValue + coordArg, localParsed + localMin, localMin), beginPath.lineTo(coordValue + coordArg, localParsed + argValue - localMin), beginPath.arcTo(coordValue + coordArg, localParsed + argValue, coordValue + coordArg - localMin, localParsed + argValue, localMin), beginPath.lineTo(coordValue + localMin, localParsed + argValue), beginPath.arcTo(coordValue, localParsed + argValue, coordValue, localParsed + argValue - localMin, localMin), beginPath.lineTo(coordValue, localParsed + localMin), beginPath.arcTo(coordValue, localParsed, coordValue + localMin, localParsed, localMin), beginPath.closePath();
          } else beginPath.rect(-coordArg / 2, -argValue / 2, coordArg, argValue);
        }
      }
    }
    ['fe'](nArg, localArgAlternate) {
      let localAlpha = this.workHeight / (nArg.N || this.scene).height;
      return localValueNested[0] = Math.max(1, Math.round(localArgAlternate[0] * localAlpha)), localValueNested[1] = Math.max(1, Math.round(localArgAlternate[1] * localAlpha)), localValueNested;
    }
    ['Bt'](argAlternate, heightArg) {
      let localValueAlpha = argAlternate + 'x' + heightArg,
        localAnother = this.rasterCache.get(localValueAlpha);
      if (!localAnother) {
        let canvasEl = document.createElement("canvas");
        canvasEl.width = argAlternate, canvasEl.height = heightArg, localAnother = {
          canvas: canvasEl,
          ctx: canvasEl.getContext('2d')
        }, this.rasterCache.set(localValueAlpha, localAnother);
      }
      return localAnother;
    }
    ['$'](localBeginPath, argEighth, argRaw) {
      localBeginPath.beginPath();
      for (let localValueParsed of argEighth) localValueParsed[0] === 'M' ? localBeginPath.moveTo(localValueParsed[1] * argRaw, localValueParsed[2] * argRaw) : localValueParsed[0] === 'L' ? localBeginPath.lineTo(localValueParsed[1] * argRaw, localValueParsed[2] * argRaw) : localValueParsed[0] === 'C' ? localBeginPath.bezierCurveTo(localValueParsed[1] * argRaw, localValueParsed[2] * argRaw, localValueParsed[3] * argRaw, localValueParsed[4] * argRaw, localValueParsed[5] * argRaw, localValueParsed[6] * argRaw) : localValueParsed[0] === 'Z' && localBeginPath.closePath();
    }
    ['Nt'](path, save, localArgRaw) {
      let bounds = path.path.bounds,
        commands = path.path.commands,
        localItemTotal = Math.max(0.5, bounds.w * localArgRaw),
        localItemCurrent = Math.max(0.5, bounds.h * localArgRaw);
      if (save.save(), save.translate(-bounds.cx * localArgRaw, -bounds.cy * localArgRaw), this.Ut(path, save, commands, localArgRaw), path.fillType === "media") this.Dt(path, save, commands, localArgRaw, localItemTotal, localItemCurrent);else {
        if (path.fillType !== "none") {
          let gradient = path.gradient;
          if (this.$(save, commands, localArgRaw), path.fillType === "gradient" && gradient) {
            let localValueFinal = Math.max(0.001, bounds.hx) * localArgRaw,
              valueFinal = Math.max(0.001, bounds.hy) * localArgRaw,
              radial = -localValueFinal + (gradient.start[0] || 0) * 2 * localValueFinal,
              localRadial = -valueFinal + (gradient.start[1] || 0) * 2 * valueFinal,
              radialValue = -localValueFinal + (gradient.end[0] === void 0 ? 1 : gradient.end[0]) * 2 * localValueFinal,
              valueAlpha = -valueFinal + (gradient.end[1] === void 0 ? 0 : gradient.end[1]) * 2 * valueFinal,
              addColorStop = gradient.type === "radial" ? save.createRadialGradient(radial, localRadial, 0, radial, localRadial, Math.max(0.001, Math.hypot(radialValue - radial, valueAlpha - localRadial))) : save.createLinearGradient(radial, localRadial, radialValue, valueAlpha);
            if (gradient.stops && gradient.stops.length > 0) {
              for (let localColor of gradient.stops) addColorStop.addColorStop(Math.max(0, Math.min(1, localColor.t)), toCssColor(localColor.color));
            } else addColorStop.addColorStop(0, toCssColor(gradient.startColor)), addColorStop.addColorStop(1, toCssColor(gradient.endColor));
            save.fillStyle = addColorStop;
          } else save.fillStyle = toCssColor(path.fillColor);
          save.fill();
        }
      }
      let isStrokeOn = path.strokeEnabled !== undefined ? !!path.strokeEnabled : !!(path.border && path.border.size > 0);
      let sWidth = path.strokeWidth !== undefined ? Number(path.strokeWidth) : (path.border ? Number(path.border.size) : 0);
      if (isStrokeOn && sWidth > 0) {
        let sColor = path.strokeColor ? (typeof path.strokeColor === "string" ? path.strokeColor : toCssColor(path.strokeColor)) : (path.border && path.border.color ? toCssColor(path.border.color) : "#ffffff");
        let sPos = path.strokePosition || (path.border ? path.border.direction : "outside");
        let sCap = path.strokeCap === "square" ? "square" : path.strokeCap === "butt" ? "butt" : "round";
        let sJoin = path.strokeJoin === "bevel" ? "bevel" : path.strokeJoin === "miter" ? "miter" : "round";
        this.qe(save, commands, localArgRaw, sWidth, sColor, sPos, sCap, sJoin);
      }
      let pathStroke = path.pathStroke;
      if (pathStroke && pathStroke.enabled && pathStroke.size > 0) {
        let localItemNext = pathStroke.cap === "square" ? "square" : pathStroke.cap === "butt" ? "butt" : "round";
        let localItemPrev = pathStroke.join === "bevel" ? "bevel" : pathStroke.join === "miter" ? "miter" : "round";
        this.qe(save, commands, localArgRaw, pathStroke.size, toCssColor(pathStroke.color), pathStroke.direction, localItemNext, localItemPrev);
      }
      save.restore();
    }
    ['Dt'](mediaFillMode, clip, localArgOther, argOther, localArgNinth, argNinth) {
      let me = this.me(mediaFillMode),
        localValueColor = false;
      if (me) {
        this.Ot(mediaFillMode, me);
        let localFinal = me.videoWidth || me.naturalWidth || me.width || 0,
          localValueInitial = me.videoHeight || me.naturalHeight || me.height || 0;
        if (!(me.tagName === "VIDEO" && me.readyState < 2) && localFinal > 0 && localValueInitial > 0) {
          let localValueThird = updateHelperInner(mediaFillMode, localFinal, localValueInitial),
            {
              dw: valueColor,
              dh: localMatrix
            } = objHelperScoped(localValueThird, localFinal, localValueInitial, localArgNinth, argNinth, mediaFillMode.mediaFillMode);
          clip.save(), this.$(clip, localArgOther, argOther), clip.clip(), localValueThird && clip.rotate(localValueThird * Math.PI / 180), clip.drawImage(me, 0, 0, localFinal, localValueInitial, -valueColor / 2, -localMatrix / 2, valueColor, localMatrix), clip.restore(), localValueColor = true;
        }
      }
      localValueColor || (clip.save(), this.$(clip, localArgOther, argOther), clip.fillStyle = toCssColor(mediaFillMode.fillColor), clip.fill(), clip.restore());
    }
    ['Ot'](localArgSource, tagNameArg) {
      if (!tagNameArg || tagNameArg.tagName !== "VIDEO" || this.mediaMode === "export") return;
      let localItemSource = localArgSource.B !== void 0 ? localArgSource.B : 0,
        localCurrentTime = maxHelper(localArgSource, localItemSource, tagNameArg.duration);
      if (localCurrentTime !== null) {
        if (Math.abs(tagNameArg.currentTime - localCurrentTime) > (this.mediaPlaying ? 0.3 : 0.02)) try {
          tagNameArg.currentTime = localCurrentTime;
        } catch {}
        if (this.mediaPlaying && tagNameArg.paused && tagNameArg.readyState >= 2) try {
          tagNameArg.play().catch(() => {});
        } catch {}
      }
    }
    ['Ut'](shadowEnabled, getTransform, localArgAnother, argScoped) {
      let isShad = shadowEnabled.shadowEnabled !== undefined ? !!shadowEnabled.shadowEnabled : !!(shadowEnabled.shadow && shadowEnabled.shadow.enabled !== false);
      let sRad = shadowEnabled.shadowRadius !== undefined ? Number(shadowEnabled.shadowRadius) : (shadowEnabled.shadow ? Number(shadowEnabled.shadow.size) : 0);
      let sOffX = shadowEnabled.shadowX !== undefined ? Number(shadowEnabled.shadowX) : (shadowEnabled.shadow && shadowEnabled.shadow.offset ? shadowEnabled.shadow.offset[0] : 0);
      let sOffY = shadowEnabled.shadowY !== undefined ? Number(shadowEnabled.shadowY) : (shadowEnabled.shadow && shadowEnabled.shadow.offset ? shadowEnabled.shadow.offset[1] : 0);
      if (!isShad || (sRad <= 0 && sOffX === 0 && sOffY === 0)) return;
      let ht = this.Ht(),
        localFlag = getTransform.getTransform ? getTransform.getTransform() : null;
      ht.setTransform(localFlag ? localFlag.a : 1, localFlag ? localFlag.b : 0, localFlag ? localFlag.c : 0, localFlag ? localFlag.d : 1, localFlag ? localFlag.e : 0, localFlag ? localFlag.f : 0);
      let valueThird = sOffX,
        localValueFourth = sOffY,
        localItemTarget = localFlag ? Math.abs(localFlag.a * localFlag.d - localFlag.b * localFlag.c) : 1,
        localItemInput = argScoped * (Math.sqrt(localItemTarget) || 1);
      let shColArr = shadowEnabled.shadowColor ? (typeof shadowEnabled.shadowColor === "string" ? parseHexColor(shadowEnabled.shadowColor) : shadowEnabled.shadowColor) : (shadowEnabled.shadow && shadowEnabled.shadow.color ? shadowEnabled.shadow.color : [0, 0, 0, 1]);
      let shAlpha = shadowEnabled.shadowAlpha !== undefined ? Number(shadowEnabled.shadowAlpha) / 100 : (shadowEnabled.shadow && shadowEnabled.shadow.color ? shadowEnabled.shadow.color[3] : 0.6);
      let shColorStr = `rgba(${Math.round(shColArr[0] * 255)}, ${Math.round(shColArr[1] * 255)}, ${Math.round(shColArr[2] * 255)}, ${(shColArr[3] !== undefined ? shColArr[3] : 1) * shAlpha})`;
      ht.shadowColor = shColorStr, ht.shadowBlur = sRad * localItemInput, ht.shadowOffsetX = localFlag ? argScoped * (localFlag.a * valueThird + localFlag.c * localValueFourth) : valueThird * argScoped, ht.shadowOffsetY = localFlag ? argScoped * (localFlag.b * valueThird + localFlag.d * localValueFourth) : localValueFourth * argScoped, ht.fillStyle = "#000", ht.globalCompositeOperation = "source-over", this.$(ht, localArgAnother, argScoped), ht.fill(), ht.shadowColor = "rgba(0,0,0,0)", ht.shadowBlur = 0, ht.shadowOffsetX = 0, ht.shadowOffsetY = 0, ht.globalCompositeOperation = "destination-out", this.$(ht, localArgAnother, argScoped), ht.fill(), ht.globalCompositeOperation = "source-over", getTransform.save(), getTransform.setTransform(1, 0, 0, 1, 0, 0), getTransform.drawImage(this.P, 0, 0), getTransform.restore();
    }
    ['Ht']() {
      let localWidth = this.raster.width,
        height = this.raster.height;
      return !this.P || this.P.width !== localWidth || this.P.height !== height ? (this.P = document.createElement("canvas"), this.P.width = localWidth, this.P.height = height, this.Ee = this.P.getContext('2d')) : this.P.width = localWidth, this.Ee;
    }
    ['qe'](strokeStyle, argStart, argParsed, argSource, strokeStyleArg, localArgTenth, argTenth, localArgEleventh) {
      let inside = localArgTenth || "centered";
      strokeStyle.save(), strokeStyle.strokeStyle = strokeStyleArg, strokeStyle.lineJoin = localArgEleventh || "round", strokeStyle.lineCap = argTenth || "round", inside === "inside" ? (this.$(strokeStyle, argStart, argParsed), strokeStyle.clip(), this.$(strokeStyle, argStart, argParsed), strokeStyle.lineWidth = argSource * argParsed * 2, strokeStyle.stroke()) : inside === "outside" ? (this.$(strokeStyle, argStart, argParsed), strokeStyle.rect(-100000, -100000, 100000 * 2, 100000 * 2), strokeStyle.clip("evenodd"), this.$(strokeStyle, argStart, argParsed), strokeStyle.lineWidth = argSource * argParsed * 2, strokeStyle.stroke()) : (this.$(strokeStyle, argStart, argParsed), strokeStyle.lineWidth = argSource * argParsed, strokeStyle.stroke()), strokeStyle.restore();
    }
    ['Ye'](moveTo, localArgEnd, localArgMax) {
      moveTo.moveTo(localArgEnd[0][0] * localArgMax, localArgEnd[0][1] * localArgMax);
      for (let valueInitial = 1; valueInitial < localArgEnd.length; valueInitial++) moveTo.lineTo(localArgEnd[valueInitial][0] * localArgMax, localArgEnd[valueInitial][1] * localArgMax);
    }
    ['zt'](saveArg, localN) {
      let valueLocal = this.workHeight / (localN.N || this.scene).height,
        localItemOutput = localN.strokes || [];
      for (let pointsValue of localItemOutput) {
        let localPoints = pointsValue.points;
        if (!(!localPoints || !localPoints.length)) {
          if (saveArg.save(), pointsValue.type === "fill") saveArg.beginPath(), this.Ye(saveArg, localPoints, valueLocal), saveArg.closePath(), saveArg.fillStyle = toCssColor(pointsValue.color), saveArg.fill();else {
            if (pointsValue.type === "brush") {
              let localValueMatrix = Math.max(0, pointsValue.width) * valueLocal,
                ltLength = localPoints.length;
              saveArg.beginPath();
              for (let localNodeConverted = 0; localNodeConverted < ltLength; localNodeConverted++) {
                let localLtNumber = localPoints[localNodeConverted],
                  valueMatrix = localPoints[localNodeConverted > 0 ? localNodeConverted - 1 : 0],
                  localVector = localPoints[localNodeConverted < ltLength - 1 ? localNodeConverted + 1 : ltLength - 1],
                  localInitial = localVector[0] - valueMatrix[0],
                  localValuePending = localVector[1] - valueMatrix[1],
                  localValueVector = Math.hypot(localInitial, localValuePending) || 1;
                localInitial /= localValueVector, localValuePending /= localValueVector;
                let valuePending = localValueMatrix * (Number.isFinite(localLtNumber[2]) ? localLtNumber[2] : 1) / 2,
                  valueVector = localLtNumber[0] * valueLocal,
                  localShader = localLtNumber[1] * valueLocal;
                localNodeConverted === 0 ? saveArg.moveTo(valueVector - localValuePending * valuePending, localShader + localInitial * valuePending) : saveArg.lineTo(valueVector - localValuePending * valuePending, localShader + localInitial * valuePending);
              }
              for (let localInner = ltLength - 1; localInner >= 0; localInner--) {
                let localLtValue = localPoints[localInner],
                  localValueShader = localPoints[localInner > 0 ? localInner - 1 : 0],
                  valueShader = localPoints[localInner < ltLength - 1 ? localInner + 1 : ltLength - 1],
                  valueFourth = valueShader[0] - localValueShader[0],
                  localValueFifth = valueShader[1] - localValueShader[1],
                  localProgram = Math.hypot(valueFourth, localValueFifth) || 1;
                valueFourth /= localProgram, localValueFifth /= localProgram;
                let localValueProgram = localValueMatrix * (Number.isFinite(localLtValue[2]) ? localLtValue[2] : 1) / 2;
                saveArg.lineTo(localLtValue[0] * valueLocal + localValueFifth * localValueProgram, localLtValue[1] * valueLocal - valueFourth * localValueProgram);
              }
              saveArg.closePath(), saveArg.fillStyle = toCssColor(pointsValue.color), saveArg.fill();
            } else saveArg.beginPath(), this.Ye(saveArg, localPoints, valueLocal), saveArg.strokeStyle = toCssColor(pointsValue.color), saveArg.lineWidth = Math.max(0.5, pointsValue.width * valueLocal), saveArg.lineJoin = "round", saveArg.lineCap = "round", saveArg.stroke();
          }
          saveArg.restore();
        }
      }
    }
    ["setMediaMode"](mediaMode) {
      this.mediaMode = mediaMode;
    }
    ['Vt'](localMediaFillMode, readyStateArg, argAnother, localArgFinal, argEleventh, localGetTransform) {
      if (!this.directVideoEnabled || this.mediaMode === "export" || getHelperOuter(localMediaFillMode) || this.Y > 0 || argEleventh || !readyStateArg || readyStateArg.tagName !== "VIDEO" || readyStateArg.readyState < 2) return null;
      let videoWidth = readyStateArg.videoWidth,
        videoHeight = readyStateArg.videoHeight;
      if (!(videoWidth > 0) || !(videoHeight > 0) || typeof localGetTransform.getTransform != "function") return null;
      let localObj = objHelperLocal(localMediaFillMode.mediaFillMode, videoWidth, videoHeight, argAnother, localArgFinal);
      if (!(localObj.sw > 0) || !(localObj.sh > 0)) return null;
      let localA;
      try {
        localA = localGetTransform.getTransform();
      } catch {
        return null;
      }
      if (!localA || !Number.isFinite(localA.a) || !Number.isFinite(localA.b) || !Number.isFinite(localA.c) || !Number.isFinite(localA.d) || !Number.isFinite(localA.e) || !Number.isFinite(localA.f)) return null;
      let valueProgram;
      try {
        valueProgram = this.Xt(readyStateArg);
      } catch (localNodeByKey) {
        return this.Ke(localNodeByKey), null;
      }
      return valueProgram ? {
        video: readyStateArg,
        tex: valueProgram.tex,
        iw: videoWidth,
        ih: videoHeight,
        w: argAnother,
        h: localArgFinal,
        src: [localObj.sx, localObj.sy, localObj.sw, localObj.sh],
        m: [localA.a, localA.b, localA.c, localA.d, localA.e, localA.f]
      } : null;
    }
    ['Xt'](localVideoWidth) {
      let localCreateTexture = this.gl,
        videoWidthValue = localVideoWidth.videoWidth,
        localVideoHeight = localVideoWidth.videoHeight,
        localGt = this.Gt(localVideoWidth),
        localKey = this.videoTextures.get(localVideoWidth) || {
          tex: localCreateTexture.createTexture(),
          w: 0,
          h: 0,
          key: '',
          allocated: false
        };
      if (localKey.key === localGt && localKey.w === videoWidthValue && localKey.h === localVideoHeight) return this.videoTextures.set(localVideoWidth, localKey), this.stats.videoReuses++, localKey;
      this.videoTextures.set(localVideoWidth, localKey), localCreateTexture.activeTexture(localCreateTexture.TEXTURE0), localCreateTexture.bindTexture(localCreateTexture.TEXTURE_2D, localKey.tex), localCreateTexture.pixelStorei(localCreateTexture.UNPACK_FLIP_Y_WEBGL, false), localCreateTexture.pixelStorei(localCreateTexture.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      try {
        localKey.allocated && localKey.w === videoWidthValue && localKey.h === localVideoHeight ? localCreateTexture.texSubImage2D(localCreateTexture.TEXTURE_2D, 0, 0, 0, localCreateTexture.RGBA, localCreateTexture.UNSIGNED_BYTE, localVideoWidth) : localCreateTexture.texImage2D(localCreateTexture.TEXTURE_2D, 0, localCreateTexture.RGBA, localCreateTexture.RGBA, localCreateTexture.UNSIGNED_BYTE, localVideoWidth);
      } finally {
        localCreateTexture.pixelStorei(localCreateTexture.UNPACK_FLIP_Y_WEBGL, false), localCreateTexture.pixelStorei(localCreateTexture.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
      return this.we(), localKey.w = videoWidthValue, localKey.h = localVideoHeight, localKey.key = localGt, localKey.allocated = true, this.stats.videoUploads++, localKey;
    }
    ['Gt'](localGetVideoPlaybackQuality) {
      let localPending = -1;
      if (typeof localGetVideoPlaybackQuality.getVideoPlaybackQuality == "function") try {
        let getVideoPlaybackQuality = localGetVideoPlaybackQuality.getVideoPlaybackQuality();
        getVideoPlaybackQuality && typeof getVideoPlaybackQuality.totalVideoFrames == "number" && (localPending = getVideoPlaybackQuality.totalVideoFrames);
      } catch {}
      localPending < 0 && typeof localGetVideoPlaybackQuality.webkitDecodedFrameCount == "number" && (localPending = localGetVideoPlaybackQuality.webkitDecodedFrameCount);
      let localItemPrimary = Number.isFinite(localGetVideoPlaybackQuality.currentTime) ? localGetVideoPlaybackQuality.currentTime : 0;
      return localPending + '@' + localItemPrimary.toFixed(4) + '@' + localGetVideoPlaybackQuality.videoWidth + 'x' + localGetVideoPlaybackQuality.videoHeight;
    }
    ['Wt'](localArgTwelfth, localArgLocal, argFinal, localArgInitial, fbo, argMax, localArgByKey) {
      let localBindFramebuffer = this.gl,
        bt = this.bt;
      bt[0] = localArgLocal[0] * argFinal / argMax, bt[1] = -localArgLocal[1] * argFinal / localArgByKey, bt[2] = 0, bt[3] = -localArgLocal[2] * localArgInitial / argMax, bt[4] = localArgLocal[3] * localArgInitial / localArgByKey, bt[5] = 0, bt[6] = 2 * localArgLocal[4] / argMax - 1, bt[7] = 1 - 2 * localArgLocal[5] / localArgByKey, bt[8] = 1, localBindFramebuffer.bindFramebuffer(localBindFramebuffer.FRAMEBUFFER, fbo.fbo), localBindFramebuffer.viewport(0, 0, argMax, localArgByKey), localBindFramebuffer.disable(localBindFramebuffer.BLEND);
      let localValueStart = null;
      if (typeof localBindFramebuffer.getParameter == "function" && localBindFramebuffer.COLOR_CLEAR_VALUE !== void 0) try {
        localValueStart = localBindFramebuffer.getParameter(localBindFramebuffer.COLOR_CLEAR_VALUE);
      } catch {
        localValueStart = null;
      }
      localBindFramebuffer.clearColor(0, 0, 0, 0), localBindFramebuffer.clear(localBindFramebuffer.COLOR_BUFFER_BIT), localValueStart && localBindFramebuffer.clearColor(localValueStart[0], localValueStart[1], localValueStart[2], localValueStart[3]), localBindFramebuffer.useProgram(this.blitProgram), this.E(this.blitAttribs), localBindFramebuffer.activeTexture(localBindFramebuffer.TEXTURE0), localBindFramebuffer.bindTexture(localBindFramebuffer.TEXTURE_2D, localArgTwelfth), this.blitUniforms.u_image && localBindFramebuffer.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && localBindFramebuffer.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && localBindFramebuffer.uniformMatrix3fv(this.blitUniforms.u_transform, false, bt), localBindFramebuffer.drawArrays(localBindFramebuffer.TRIANGLES, 0, 6);
    }
    ['jt']() {
      if (this.Qe !== void 0) return this.Qe;
      let valueFifth = this.webglVersion >= 2,
        localItemSecondary = valueFifth ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\n" : "precision highp float;\nvarying vec2 v_texCoord;\n",
        localItemTertiary = valueFifth ? "acFragColor" : "gl_FragColor",
        localTexture = valueFifth ? "texture" : "texture2D",
        localItemExtra = localItemSecondary + ("\nuniform sampler2D u_image;\nuniform vec2 u_texel;\nuniform float u_mode;\nuniform float u_bw;\nuniform vec4 u_bc;\nuniform float u_sr;\nuniform vec2 u_so;\nuniform vec4 u_sc;\nuniform float u_useShadow;\nuniform float u_shOut;\nfloat A(vec2 uv) { return " + localTexture + "(u_image, uv).a; }\nvoid main() {\n    vec4 c = " + localTexture + "(u_image, v_texCoord);\n    vec4 res = c;\n    const float CS = 0.8660254;\n    const float SN = 0.5;\n    if (u_bw > 0.0) {\n        float rd = u_mode < 0.5 ? u_bw : (u_mode > 1.5 ? u_bw * 0.5 : 0.0);\n        float re = u_mode < 0.5 ? 0.0 : (u_mode > 1.5 ? u_bw * 0.5 : u_bw);\n        float dil = c.a;\n        float ero = c.a;\n        for (int i = 1; i <= 6; i++) {\n            float f = float(i) / 6.0;\n            float off = (i - (i / 2) * 2 == 1) ? 0.0 : 0.2617994;\n            vec2 d = vec2(cos(off), sin(off));\n            for (int j = 0; j < 12; j++) {\n                if (rd > 0.0) dil = max(dil, A(v_texCoord + d * (rd * f) * u_texel));\n                if (re > 0.0) ero = min(ero, A(v_texCoord + d * (re * f) * u_texel));\n                d = vec2(d.x * CS - d.y * SN, d.x * SN + d.y * CS);\n            }\n        }\n        float bA = u_mode < 0.5 ? dil : (u_mode < 1.5 ? c.a - ero : dil - ero);\n        bA = clamp(bA, 0.0, 1.0);\n        vec4 bl = vec4(u_bc.rgb * u_bc.a, u_bc.a) * bA;\n        if (u_mode < 0.5) res = res + bl * (1.0 - res.a);\n        else res = bl + res * (1.0 - bl.a);\n    }\n    if (u_useShadow > 0.5) {\n        vec2 base = v_texCoord - u_so;\n        float sig = max(u_sr * 0.5, 0.0001);\n        float acc = A(base) * 0.15;\n        float wsum = 0.15;\n        if (u_sr > 0.5) {\n            for (int i = 1; i <= 6; i++) {\n                float f = float(i) / 6.0;\n                float r = u_sr * f;\n                float wg = exp(-0.5 * (r * r) / (sig * sig)) * f;\n                float off = (i - (i / 2) * 2 == 1) ? 0.0 : 0.2617994;\n                vec2 d = vec2(cos(off), sin(off));\n                for (int j = 0; j < 12; j++) {\n                    acc += A(base + d * r * u_texel) * wg;\n                    wsum += wg;\n                    d = vec2(d.x * CS - d.y * SN, d.x * SN + d.y * CS);\n                }\n            }\n        } else {\n            acc = A(base);\n            wsum = 1.0;\n        }\n        float sA = acc / wsum;\n        if (u_shOut > 0.5) sA *= (1.0 - c.a);\n        vec4 sl = vec4(u_sc.rgb * u_sc.a, u_sc.a) * sA;\n        res = res + sl * (1.0 - res.a);\n    }\n    " + localItemTertiary + " = res;\n}\n"),
        qe = null;
      try {
        let localValueSixth = this.K(this.de(), localItemExtra);
        qe = {
          program: localValueSixth,
          uniforms: this.J(localValueSixth),
          attribs: this.Z(localValueSixth)
        };
      } catch (localNodeByIndex) {
        this.log("[SCENE] Program border/shadow gagal: " + String(localNodeByIndex.message).split('\x0a')[0]);
      }
      return this.Qe = qe, qe;
    }
    ['qt'](strokeEnabled, hArg, bArg, argByKey, argEnd) {
      const strokeOn = strokeEnabled.strokeEnabled !== undefined ? !!strokeEnabled.strokeEnabled : !!(strokeEnabled.border && strokeEnabled.border.size > 0);
      let strokeSize = strokeEnabled.strokeWidth !== undefined ? Number(strokeEnabled.strokeWidth) : (strokeEnabled.border ? Number(strokeEnabled.border.size) : 0);
      if (strokeEnabled.strokeKeyable && strokeEnabled.strokeKeyable.kfs && strokeEnabled.strokeKeyable.kfs.length) {
        strokeSize = refHelper(strokeEnabled.strokeKeyable, this.H !== undefined ? this.H / 1000 : (playheadMs / 1000))[0] || 0;
      }
      const strokeColArr = strokeEnabled.strokeColor ? (typeof strokeEnabled.strokeColor === "string" ? parseHexColor(strokeEnabled.strokeColor) : strokeEnabled.strokeColor) : (strokeEnabled.border && strokeEnabled.border.color ? strokeEnabled.border.color : [1, 1, 1, 1]);
      const strokeDir = strokeEnabled.strokePosition || (strokeEnabled.border ? strokeEnabled.border.direction : "outside");

      const shadowOn = strokeEnabled.shadowEnabled !== undefined ? !!strokeEnabled.shadowEnabled : !!(strokeEnabled.shadow && strokeEnabled.shadow.enabled !== false);
      let shadowSize = strokeEnabled.shadowRadius !== undefined ? Number(strokeEnabled.shadowRadius) : (strokeEnabled.shadow ? Number(strokeEnabled.shadow.size) : 0);
      if (strokeEnabled.shadowKeyable && strokeEnabled.shadowKeyable.kfs && strokeEnabled.shadowKeyable.kfs.length) {
        shadowSize = refHelper(strokeEnabled.shadowKeyable, this.H !== undefined ? this.H / 1000 : (playheadMs / 1000))[0] || 0;
      }
      const shadowAlpha = strokeEnabled.shadowAlpha !== undefined ? Number(strokeEnabled.shadowAlpha) / 100 : (strokeEnabled.shadow && strokeEnabled.shadow.color ? strokeEnabled.shadow.color[3] : 0.6);
      const shadowColArr = strokeEnabled.shadowColor ? (typeof strokeEnabled.shadowColor === "string" ? parseHexColor(strokeEnabled.shadowColor) : strokeEnabled.shadowColor.slice()) : (strokeEnabled.shadow && strokeEnabled.shadow.color ? strokeEnabled.shadow.color.slice() : [0, 0, 0, 1]);
      if (Array.isArray(shadowColArr)) shadowColArr[3] = (shadowColArr[3] !== undefined ? shadowColArr[3] : 1) * shadowAlpha;
      const shadowOff = [
        strokeEnabled.shadowX !== undefined ? Number(strokeEnabled.shadowX) : (strokeEnabled.shadow && strokeEnabled.shadow.offset ? strokeEnabled.shadow.offset[0] : 0),
        strokeEnabled.shadowY !== undefined ? Number(strokeEnabled.shadowY) : (strokeEnabled.shadow && strokeEnabled.shadow.offset ? strokeEnabled.shadow.offset[1] : 0)
      ];

      let valueStart = !!(strokeOn && strokeSize > 0 && strokeColArr && strokeColArr[3] > 0.001);
      let localInside = !!(shadowOn && shadowColArr && shadowColArr[3] > 0.001 && (shadowSize > 0 || shadowOff[0] !== 0 || shadowOff[1] !== 0));
      if (!valueStart && !localInside) return false;
      let localJt = this.jt();
      if (!localJt) return false;
      let localGl = this.gl,
        localM = hArg.m,
        valueSixth = this.workHeight / (strokeEnabled.N || this.scene).height,
        localValueTexture = valueSixth * (Math.sqrt(Math.abs(localM[0] * localM[3] - localM[1] * localM[2])) || 1),
        uniformValue = valueStart ? strokeSize * localValueTexture : 0,
        valueTexture = localInside ? shadowSize * localValueTexture : 0,
        localValueCanvas = 0,
        valueCanvas = 0,
        localContext = 0;
      if (localInside) {
        let localRequest = shadowOff[0] || 0,
          localValueRequest = shadowOff[1] || 0,
          valueRequest = valueSixth * (localM[0] * localRequest + localM[2] * localValueRequest),
          localHeader = valueSixth * (localM[1] * localRequest + localM[3] * localValueRequest);
        localValueCanvas = valueRequest / argByKey, valueCanvas = -localHeader / argEnd, localContext = Math.max(Math.abs(valueRequest), Math.abs(localHeader));
      }
      let localValueContext = hArg.w / 2,
        valueContext = hArg.h / 2,
        localValueSeventh = 1 / 0,
        valueSeventh = 1 / 0,
        localValueEighth = -1 / 0,
        valueEighth = -1 / 0;
      for (let valueResolved = 0; valueResolved < 4; valueResolved++) {
        let localValueHeader = valueResolved & 1 ? localValueContext : -localValueContext,
          valueHeader = valueResolved & 2 ? valueContext : -valueContext,
          localResolved = localM[0] * localValueHeader + localM[2] * valueHeader + localM[4],
          localValueConverted = localM[1] * localValueHeader + localM[3] * valueHeader + localM[5];
        localResolved < localValueSeventh && (localValueSeventh = localResolved), localResolved > localValueEighth && (localValueEighth = localResolved), localValueConverted < valueSeventh && (valueSeventh = localValueConverted), localValueConverted > valueEighth && (valueEighth = localValueConverted);
      }
      let localValueResolved = uniformValue + valueTexture + localContext + 2,
        localValueNinth = Math.max(0, Math.floor(localValueSeventh - localValueResolved)),
        localResponse = Math.min(argByKey, Math.ceil(localValueEighth + localValueResolved)),
        localValueResponse = Math.max(0, Math.floor(valueSeventh - localValueResolved)),
        minValue = Math.min(argEnd, Math.ceil(valueEighth + localValueResolved));
      if (!(localResponse > localValueNinth && minValue > localValueResponse)) return false;
      let valueResponse = this.Yt || (this.Yt = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])),
        localItemAlternate = valueStart ? strokeDir === "inside" ? 1 : strokeDir === "centered" || strokeDir === "center" ? 2 : 0 : 0,
        uniforms = localJt.uniforms;
      return localGl.enable(localGl.SCISSOR_TEST), localGl.scissor(localValueNinth, argEnd - minValue, localResponse - localValueNinth, minValue - localValueResponse), localGl.disable(localGl.BLEND), localGl.bindFramebuffer(localGl.FRAMEBUFFER, bArg.b.fbo), localGl.viewport(0, 0, argByKey, argEnd), localGl.useProgram(localJt.program), this.E(localJt.attribs), localGl.activeTexture(localGl.TEXTURE0), localGl.bindTexture(localGl.TEXTURE_2D, bArg.a.tex), uniforms.u_image && localGl.uniform1i(uniforms.u_image, 0), uniforms.u_transform && localGl.uniformMatrix3fv(uniforms.u_transform, false, valueResponse), uniforms.u_texel && localGl.uniform2f(uniforms.u_texel, 1 / argByKey, 1 / argEnd), uniforms.u_mode && localGl.uniform1f(uniforms.u_mode, localItemAlternate), uniforms.u_bw && localGl.uniform1f(uniforms.u_bw, uniformValue), uniforms.u_bc && localGl.uniform4f(uniforms.u_bc, valueStart ? strokeColArr[0] : 0, valueStart ? strokeColArr[1] : 0, valueStart ? strokeColArr[2] : 0, valueStart ? strokeColArr[3] : 0), uniforms.u_useShadow && localGl.uniform1f(uniforms.u_useShadow, localInside ? 1 : 0), uniforms.u_sr && localGl.uniform1f(uniforms.u_sr, valueTexture), uniforms.u_so && localGl.uniform2f(uniforms.u_so, localValueCanvas, valueCanvas), uniforms.u_sc && localGl.uniform4f(uniforms.u_sc, localInside ? shadowColArr[0] : 0, localInside ? shadowColArr[1] : 0, localInside ? shadowColArr[2] : 0, localInside ? shadowColArr[3] : 0), uniforms.u_shOut && localGl.uniform1f(uniforms.u_shOut, localInside && (strokeEnabled.shadow ? strokeEnabled.shadow.direction === "inside" : false) ? 0 : 1), localGl.drawArrays(localGl.TRIANGLES, 0, 6), localGl.bindFramebuffer(localGl.FRAMEBUFFER, bArg.a.fbo), localGl.useProgram(this.blitProgram), this.E(this.blitAttribs), localGl.bindTexture(localGl.TEXTURE_2D, bArg.b.tex), this.blitUniforms.u_image && localGl.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && localGl.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && localGl.uniformMatrix3fv(this.blitUniforms.u_transform, false, valueResponse), localGl.drawArrays(localGl.TRIANGLES, 0, 6), localGl.disable(localGl.SCISSOR_TEST), this.stats.passes += 2, true;
    }
    ['Kt'](localSrc, fboArg, localArgByIndex, argByIndex) {
      let bindFramebuffer = this.gl,
        mValue = localSrc.m,
        gt = this.gt;
      gt[0] = 2 * mValue[0] / localArgByIndex, gt[1] = -2 * mValue[1] / argByIndex, gt[2] = 0, gt[3] = 2 * mValue[2] / localArgByIndex, gt[4] = -2 * mValue[3] / argByIndex, gt[5] = 0, gt[6] = 2 * mValue[4] / localArgByIndex - 1, gt[7] = 1 - 2 * mValue[5] / argByIndex, gt[8] = 1;
      let srcValue = localSrc.src,
        localItemOther = srcValue[0] / localSrc.iw,
        localItemAnother = srcValue[1] / localSrc.ih,
        localItemFinal = (srcValue[0] + srcValue[2]) / localSrc.iw,
        localItemInitial = (srcValue[1] + srcValue[3]) / localSrc.ih;
      bindFramebuffer.bindFramebuffer(bindFramebuffer.FRAMEBUFFER, fboArg.fbo), bindFramebuffer.viewport(0, 0, localArgByIndex, argByIndex), bindFramebuffer.disable(bindFramebuffer.BLEND);
      let localStart = null;
      if (typeof bindFramebuffer.getParameter == "function" && bindFramebuffer.COLOR_CLEAR_VALUE !== void 0) try {
        localStart = bindFramebuffer.getParameter(bindFramebuffer.COLOR_CLEAR_VALUE);
      } catch {
        localStart = null;
      }
      bindFramebuffer.clearColor(0, 0, 0, 0), bindFramebuffer.clear(bindFramebuffer.COLOR_BUFFER_BIT), localStart && bindFramebuffer.clearColor(localStart[0], localStart[1], localStart[2], localStart[3]), bindFramebuffer.useProgram(this.videoProgram), this.E(this.videoAttribs), bindFramebuffer.activeTexture(bindFramebuffer.TEXTURE0), bindFramebuffer.bindTexture(bindFramebuffer.TEXTURE_2D, localSrc.tex);
      let videoUniforms = this.videoUniforms;
      videoUniforms.u_image && bindFramebuffer.uniform1i(videoUniforms.u_image, 0), videoUniforms.u_sizePx && bindFramebuffer.uniform2f(videoUniforms.u_sizePx, localSrc.w, localSrc.h), videoUniforms.u_uvRect && bindFramebuffer.uniform4f(videoUniforms.u_uvRect, localItemOther, localItemAnother, localItemFinal, localItemInitial), videoUniforms.u_transform && bindFramebuffer.uniformMatrix3fv(videoUniforms.u_transform, false, gt), bindFramebuffer.drawArrays(bindFramebuffer.TRIANGLES, 0, 6), localSrc.video && this.stats.videoPasses++;
    }
    ['Qt'](video) {
      let rasterCtx = this.rasterCtx;
      if (!rasterCtx || !video || !video.video || !video.src || !video.m || video.video.readyState < 2) return;
      let localValueMap = video.m,
        valueConverted = video.src;
      rasterCtx.save(), rasterCtx.setTransform(localValueMap[0], localValueMap[1], localValueMap[2], localValueMap[3], localValueMap[4], localValueMap[5]), rasterCtx.globalAlpha = 1, rasterCtx.globalCompositeOperation = "source-over", rasterCtx.drawImage(video.video, valueConverted[0], valueConverted[1], valueConverted[2], valueConverted[3], -video.w / 2, -video.h / 2, video.w, video.h), rasterCtx.restore();
    }
    ['Ke'](localMessage) {
      let valueNinth = localMessage && localMessage.message ? String(localMessage.message) : String(localMessage);
      if (localMessage && (localMessage.name === "SecurityError" || /security/i.test(valueNinth))) {
        if (!this.directVideoEnabled) return;
        this.directVideoEnabled = false, this.log("[SCENE] Jalur tekstur video dimatikan (" + valueNinth.split('\x0a')[0] + "). Kembali ke raster kanvas 2D.");
        return;
      }
      this.Pe || (this.Pe = true, this.log("[SCENE] Frame video dilewati ke jalur kanvas: " + valueNinth.split('\x0a')[0]));
    }
    ['oe'](jt) {
      if (jt.Jt === this.R) return jt.Zt;
      let localZt = 0;
      if (jt.effects) {
        let uValue = this.u;
        for (let disabled of jt.effects) {
          if (disabled.disabled || disabled.hidden === true || disabled.hidden === "true") continue;
          let localPayload = this.programs.get(disabled.id),
            overdraw = localPayload && localPayload.definition;
          if (!overdraw || !overdraw.overdraw || uValue && !processParsed(overdraw, uValue)) continue;
          let localConverted = Number.isFinite(overdraw.maxOverdraw) ? overdraw.maxOverdraw : 0;
          uValue && localConverted > uValue.overdrawCap && (localConverted = uValue.overdrawCap), localConverted > localZt && (localZt = localConverted);
        }
      }
      return jt.Jt = this.R, jt.Zt = localZt, localZt;
    }
    ['applyLayerShadow'](shadowColor, localShadowEnabled) {
      const isShadowOn = localShadowEnabled.shadowEnabled !== undefined ? !!localShadowEnabled.shadowEnabled : !!(localShadowEnabled.shadow && localShadowEnabled.shadow.enabled !== false && (localShadowEnabled.shadow.size > 0 || (localShadowEnabled.shadow.offset && (localShadowEnabled.shadow.offset[0] || localShadowEnabled.shadow.offset[1]))));
      const shRad = localShadowEnabled.shadowRadius !== undefined ? Number(localShadowEnabled.shadowRadius) : (localShadowEnabled.shadow ? Number(localShadowEnabled.shadow.size) : 0);
      const localValuePayload = localShadowEnabled.shadowX !== undefined ? Number(localShadowEnabled.shadowX) : (localShadowEnabled.shadow && localShadowEnabled.shadow.offset ? localShadowEnabled.shadow.offset[0] : 0);
      const valuePayload = localShadowEnabled.shadowY !== undefined ? Number(localShadowEnabled.shadowY) : (localShadowEnabled.shadow && localShadowEnabled.shadow.offset ? localShadowEnabled.shadow.offset[1] : 0);
      if (!isShadowOn || (shRad <= 0 && localValuePayload === 0 && valuePayload === 0)) return false;

      const sScale = this.workHeight / (localShadowEnabled.N || this.scene).height;
      const shAlpha = localShadowEnabled.shadowAlpha !== undefined ? Number(localShadowEnabled.shadowAlpha) / 100 : (localShadowEnabled.shadow && localShadowEnabled.shadow.color ? localShadowEnabled.shadow.color[3] : 0.6);
      const shCol = localShadowEnabled.shadowColor ? (typeof localShadowEnabled.shadowColor === "string" ? parseHexColor(localShadowEnabled.shadowColor) : localShadowEnabled.shadowColor) : (localShadowEnabled.shadow && localShadowEnabled.shadow.color ? localShadowEnabled.shadow.color : [0, 0, 0, 1]);
      const alpha = (shCol[3] !== undefined ? shCol[3] : 1) * Math.max(0, Math.min(1, shAlpha));
      shadowColor.shadowColor = `rgba(${Math.round(shCol[0] * 255)}, ${Math.round(shCol[1] * 255)}, ${Math.round(shCol[2] * 255)}, ${alpha.toFixed(3)})`;
      shadowColor.shadowBlur = shRad * sScale;
      shadowColor.shadowOffsetX = localValuePayload * sScale;
      shadowColor.shadowOffsetY = valuePayload * sScale;
      return true;
    }
    ['drawLayerStroke'](localStrokeStyle, localStrokeEnabled, localArgTarget, argTarget, argTwelfth) {
      const isStrokeOn = localStrokeEnabled.strokeEnabled !== undefined ? !!localStrokeEnabled.strokeEnabled : !!(localStrokeEnabled.border && localStrokeEnabled.border.size > 0);
      const sWidth = localStrokeEnabled.strokeWidth !== undefined ? Number(localStrokeEnabled.strokeWidth) : (localStrokeEnabled.border ? Number(localStrokeEnabled.border.size) : 0);
      if (!isStrokeOn || sWidth <= 0) return;
      const sColor = localStrokeEnabled.strokeColor ? (typeof localStrokeEnabled.strokeColor === "string" ? localStrokeEnabled.strokeColor : toCssColor(localStrokeEnabled.strokeColor)) : (localStrokeEnabled.border && localStrokeEnabled.border.color ? toCssColor(localStrokeEnabled.border.color) : "#ffffff");
      const sPos = localStrokeEnabled.strokePosition || (localStrokeEnabled.border ? localStrokeEnabled.border.direction : "outside");
      const sCap = localStrokeEnabled.strokeCap === "square" ? "square" : localStrokeEnabled.strokeCap === "butt" ? "butt" : "round";
      const sJoin = localStrokeEnabled.strokeJoin === "bevel" ? "bevel" : localStrokeEnabled.strokeJoin === "miter" ? "miter" : "round";
      const sScale = this.workHeight / (localStrokeEnabled.N || this.scene).height;
      const finalW = sWidth * sScale;

      localStrokeStyle.save();
      localStrokeStyle.strokeStyle = sColor;
      localStrokeStyle.lineCap = sCap;
      localStrokeStyle.lineJoin = sJoin;

      const localItemPending = localStrokeEnabled.shapeType && localStrokeEnabled.shapeType !== ".rect" && localStrokeEnabled.shapeType !== '';
      const drawPath = (ctx) => {
        localItemPending ? this.Me(ctx, localStrokeEnabled, localArgTarget, argTarget, argTwelfth) : (ctx.beginPath(), ctx.rect(-localArgTarget / 2, -argTarget / 2, localArgTarget, argTarget));
      };

      if (sPos === "inside") {
        drawPath(localStrokeStyle);
        localStrokeStyle.clip();
        drawPath(localStrokeStyle);
        localStrokeStyle.lineWidth = finalW * 2;
        localStrokeStyle.stroke();
      } else if (sPos === "outside") {
        drawPath(localStrokeStyle);
        localStrokeStyle.rect(-100000, -100000, 200000, 200000);
        localStrokeStyle.clip("evenodd");
        drawPath(localStrokeStyle);
        localStrokeStyle.lineWidth = finalW * 2;
        localStrokeStyle.stroke();
      } else {
        drawPath(localStrokeStyle);
        localStrokeStyle.lineWidth = finalW;
        localStrokeStyle.stroke();
      }
      localStrokeStyle.restore();
    }
    ['Se'](localTag, layerSize, localSave) {
      let feValue = this.fe(localTag, layerSize),
        localNodeAnother = feValue[0],
        localCoord = feValue[1];
      if (localTag.tag === "embedScene" && localTag.scene && !this.force2DSubScene) {
        localSave.save(), localSave.beginPath(), localSave.rect(-localNodeAnother / 2, -localCoord / 2, localNodeAnother, localCoord), localSave.clip(), localSave.translate(-localNodeAnother / 2, -localCoord / 2), localSave.scale(localNodeAnother / localTag.scene.width, localCoord / localTag.scene.height), this.en(localTag.scene, localSave, localTag.scene.width, localTag.scene.height, localTag.B, localTag.he), localSave.restore();
        return;
      }
      let localStream = localTag.shapeType || ".rect",
        localJe = this.Je(localTag),
        localValueDerived = (localTag.cornerRadius || 0) * (localJe[0] > 0 ? localNodeAnother / localJe[0] : 1),
        localValueTenth = localStream !== ".rect" && localStream !== '';
      if (localTag.tag === "text") {
        localSave.save();
        let fillColor = localTag.fillColor || localTag.color || [1, 1, 1, 1];
        localSave.fillStyle = typeof fillColor === "string" ? fillColor : toCssColor(fillColor);
        let localItemStored = this.workHeight / (localTag.N || this.scene).height,
          localItemCached = localJe[1] > 0 && localJe[1] !== 100 ? localJe[1] / 18 : 1,
          valueTenth = Math.max(1, (localTag.fontSize || 18) * localItemStored * localItemCached * 2),
          localFont = "Roboto",
          localValueStream = "normal",
          valueStream = "normal";
        if (localTag.font) {
          let replace = localTag.font.replace(/&amp;/g, '&'),
            match = replace.match(/name=([^&]+)/);
          if (replace.includes("googlefonts") && match) {
            localFont = decodeURIComponent(match[1]);
            if (typeof document < 'u' && typeof document.querySelector == "function" && !document.querySelector("link[data-font=\"" + localFont + '\x22]')) {
              let linkEl = document.createElement("link");
              linkEl.rel = "stylesheet", linkEl.dataset.font = localFont, linkEl.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(localFont).replace(/%20/g, '+') + ":wght@400;500;700&display=swap", document.head.appendChild(linkEl);
            }
          } else if (replace.includes("imported?name=")) {
            let localChunk = replace.match(/name=([^&]+)/);
            if (localChunk) {
              let decodeUriComponent = decodeURIComponent(localChunk[1]),
                valueEleventh = decodeUriComponent.replace(/\.[^/.]+$/, '');
              this.customFonts && (this.customFonts.has(valueEleventh) || this.customFonts.has(decodeUriComponent)) ? localFont = this.customFonts.get(valueEleventh) || this.customFonts.get(decodeUriComponent) : localFont = valueEleventh;
            }
          } else {
            let clean = replace.trim();
            if (clean) {
              this.customFonts && this.customFonts.has(clean) ? localFont = this.customFonts.get(clean) : localFont = clean;
              if (typeof document < 'u' && typeof document.querySelector == "function" && !clean.includes("/") && clean !== "Roboto" && clean !== "sans-serif" && !document.querySelector("link[data-font=\"" + clean + '\x22]')) {
                let linkEl = document.createElement("link");
                linkEl.rel = "stylesheet", linkEl.dataset.font = clean, linkEl.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(clean).replace(/%20/g, '+') + ":wght@300;400;500;600;700;800;900&display=swap", document.head.appendChild(linkEl);
              }
            }
          }
          if (replace.includes("weight=")) {
            let localValueChunk = replace.match(/weight=([^&]+)/);
            localValueChunk && (localValueStream = localValueChunk[1]);
          }
          replace.includes("italic=1") && (valueStream = "italic");
        }
        let fxSpacing = localTag.effects && localTag.effects.find(argInitial => argInitial.id && argInitial.id.includes("textspacing"));
        let letSpacing = localTag.letterSpacing !== undefined ? localTag.letterSpacing : (fxSpacing && fxSpacing.params && fxSpacing.params.letterspacing !== undefined ? parseFloat(fxSpacing.params.letterspacing) : 0);
        let lineMul = localTag.lineSpacing !== undefined ? localTag.lineSpacing : (fxSpacing && fxSpacing.params && fxSpacing.params.linespacing !== undefined ? parseFloat(fxSpacing.params.linespacing) : 1);
        if (Number.isNaN(letSpacing)) letSpacing = 0;
        if (Number.isNaN(lineMul) || lineMul <= 0) lineMul = 1;

        localSave.font = valueStream + '\x20' + localValueStream + '\x20' + valueTenth + "px \"" + localFont + "\", \"Roboto\", sans-serif";
        if ('letterSpacing' in localSave && typeof localSave.letterSpacing === "string") {
          localSave.letterSpacing = (letSpacing * valueTenth) + "px";
        }
        let isJustify = localTag.align === "justify";
        localSave.textAlign = isJustify ? "left" : (localTag.align || "center");
        localSave.textBaseline = "middle";

        this.applyLayerShadow(localSave, localTag);
        let parts = (localTag.textContent || '').split('\x0a'),
          localValueEleventh = valueTenth * 1.2 * lineMul,
          localItemBorder = -(parts.length * localValueEleventh) / 2 + localValueEleventh / 2,
          valueDerived = 0;
        localTag.align === "left" || isJustify ? valueDerived = -localNodeAnother / 2 : localTag.align === "right" && (valueDerived = localNodeAnother / 2);
        for (let valueTarget = 0; valueTarget < parts.length; valueTarget++) {
          let lineText = parts[valueTarget];
          if (!lineText) continue;
          let lineY = localItemBorder + valueTarget * localValueEleventh;
          if (isJustify && valueTarget < parts.length - 1 && lineText.includes(' ') && localNodeAnother > 0) {
            let words = lineText.split(' ');
            let wordsWidth = 0;
            for (let localItemEdge of words) wordsWidth += localSave.measureText(localItemEdge).width;
            let spaceLeft = localNodeAnother - wordsWidth;
            let spaceWidth = words.length > 1 ? spaceLeft / (words.length - 1) : 0;
            let curX = -localNodeAnother / 2;
            for (let wIdx = 0; wIdx < words.length; wIdx++) {
              localSave.fillText(words[wIdx], curX, lineY);
              curX += localSave.measureText(words[wIdx]).width + spaceWidth;
            }
          } else {
            localSave.fillText(lineText, valueDerived, lineY);
          }
          const isStrokeOn = localTag.strokeEnabled !== undefined ? !!localTag.strokeEnabled : !!(localTag.border && localTag.border.size > 0);
          const sWidth = localTag.strokeWidth !== undefined ? Number(localTag.strokeWidth) : (localTag.border ? Number(localTag.border.size) : 0);
          if (isStrokeOn && sWidth > 0) {
            localSave.save();
            localSave.shadowColor = "rgba(0,0,0,0)";
            localSave.shadowBlur = 0;
            localSave.lineWidth = sWidth * (this.workHeight / (localTag.N || this.scene).height);
            localSave.strokeStyle = localTag.strokeColor ? (typeof localTag.strokeColor === "string" ? localTag.strokeColor : toCssColor(localTag.strokeColor)) : (localTag.border && localTag.border.color ? toCssColor(localTag.border.color) : "#ffffff");
            localSave.lineCap = localTag.strokeCap === "square" ? "square" : localTag.strokeCap === "butt" ? "butt" : "round";
            localSave.lineJoin = localTag.strokeJoin === "bevel" ? "bevel" : localTag.strokeJoin === "miter" ? "miter" : "round";
            localSave.strokeText(lineText, valueDerived, lineY);
            localSave.restore();
          }
        }
        localSave.restore();
        return;
      }
      if (localTag.path) {
        this.Nt(localTag, localSave, this.workHeight / (localTag.N || this.scene).height);
        return;
      }
      if (localTag.tag === "drawing") {
        this.zt(localSave, localTag);
        return;
      }
      if (localTag.fillType === "media") {
        let localMe = this.me(localTag);
        if (localMe && localMe.tagName === "VIDEO" && this.mediaMode !== "export") {
          let localItemCenter = localTag.B !== void 0 ? localTag.B : 0,
            currentTimeValue = maxHelper(localTag, localItemCenter, localMe.duration);
          if (currentTimeValue !== null) {
            let localItemBase = (this.videoDriftMs || 300) / 1000;
            if (Math.abs(localMe.currentTime - currentTimeValue) > (this.mediaPlaying ? localItemBase : 0.02)) try {
              localMe.currentTime = currentTimeValue;
            } catch {}
            if (this.mediaPlaying && localMe.paused && localMe.readyState >= 2) try {
              localMe.play().catch(() => {});
            } catch {}
          }
        }
        if (!localMe) return;
        let vt = this.Vt(localTag, localMe, localNodeAnother, localCoord, localValueTenth, localSave);
        if (vt) return vt;
        localSave.save(), this.applyLayerShadow(localSave, localTag), localValueTenth && (this.Me(localSave, localTag, localNodeAnother, localCoord, localValueDerived), localSave.clip()), this._t(localSave, localMe, -localNodeAnother / 2, -localCoord / 2, localNodeAnother, localCoord, localTag.mediaFillMode, localTag), localSave.restore();
        this.drawLayerStroke(localSave, localTag, localNodeAnother, localCoord, localValueDerived);
        return;
      }
      if (localTag.tag === "audio") return;
      if (localTag.tag === "nullobj") {
        localSave.save();
        localSave.strokeStyle = "#00ffa8";
        localSave.lineWidth = 1.5;
        localSave.setLineDash([3, 3]);
        localSave.strokeRect(-26, -26, 52, 52);

        // Center plus crosshair (solid)
        localSave.setLineDash([]);
        localSave.lineWidth = 1.6;
        localSave.beginPath();
        localSave.moveTo(-9, 0); localSave.lineTo(9, 0);
        localSave.moveTo(0, -9); localSave.lineTo(0, 9);
        localSave.stroke();

        localSave.fillStyle = "#00ffa8";
        localSave.font = "bold 10px sans-serif";
        localSave.textAlign = "center";
        localSave.fillText(localTag.label || "Null", 0, 38);
        localSave.restore();
        return;
      }
      if (localTag.tag === "camera") {
        if (!this.G) {
          localSave.save();
          const cameraFovDegrees = localTag.fov || 60;
          const zoom = localTag.cameraZoom || 400;
          const cameraBodyHalfWidth = 26;
          const cameraBodyHalfHeight = 18;

          localSave.fillStyle = "rgba(0, 195, 255, 0.2)";
          localSave.strokeStyle = "#00c3ff";
          localSave.lineWidth = 2;
          localSave.beginPath();
          if (localSave.roundRect) localSave.roundRect(-cameraBodyHalfWidth, -cameraBodyHalfHeight, cameraBodyHalfWidth * 2, cameraBodyHalfHeight * 2, 4);
          else localSave.rect(-cameraBodyHalfWidth, -cameraBodyHalfHeight, cameraBodyHalfWidth * 2, cameraBodyHalfHeight * 2);
          localSave.fill();
          localSave.stroke();

          // Camera lens cone
          localSave.beginPath();
          localSave.moveTo(cameraBodyHalfWidth, -10);
          localSave.lineTo(cameraBodyHalfWidth + 12, -16);
          localSave.lineTo(cameraBodyHalfWidth + 12, 16);
          localSave.lineTo(cameraBodyHalfWidth, 10);
          localSave.closePath();
          localSave.fillStyle = "rgba(0, 195, 255, 0.4)";
          localSave.fill();
          localSave.stroke();

          // Lens circle
          localSave.beginPath();
          localSave.arc(0, 0, 8, 0, Math.PI * 2);
          localSave.stroke();

          // Frustum rays and plane
          const halfFovRad = (cameraFovDegrees / 2) * Math.PI / 180;
          const frustumLen = Math.min(500, Math.max(80, zoom * 0.6));
          const frustumSpread = frustumLen * Math.tan(halfFovRad);

          localSave.strokeStyle = "rgba(0, 195, 255, 0.65)";
          localSave.setLineDash([4, 4]);
          localSave.lineWidth = 1.5;

          localSave.beginPath();
          localSave.moveTo(cameraBodyHalfWidth + 12, 0);
          localSave.lineTo(cameraBodyHalfWidth + 12 + frustumLen, -frustumSpread);
          localSave.moveTo(cameraBodyHalfWidth + 12, 0);
          localSave.lineTo(cameraBodyHalfWidth + 12 + frustumLen, frustumSpread);
          localSave.moveTo(cameraBodyHalfWidth + 12 + frustumLen, -frustumSpread);
          localSave.lineTo(cameraBodyHalfWidth + 12 + frustumLen, frustumSpread);
          localSave.stroke();
          localSave.setLineDash([]);

          // Camera label
          localSave.fillStyle = "#00c3ff";
          localSave.font = "bold 11px sans-serif";
          localSave.textAlign = "center";
          localSave.fillText(localTag.label || "Kamera", 0, cameraBodyHalfHeight + 15);
          localSave.restore();
        }
        return;
      }
      let localItemResolved = -localNodeAnother / 2 + (localTag.gradient && localTag.gradient.start[0] || 0) * localNodeAnother,
        localItemConverted = -localCoord / 2 + (localTag.gradient && localTag.gradient.start[1] || 0) * localCoord,
        localItemDerived = -localNodeAnother / 2 + (localTag.gradient && localTag.gradient.end[0] || 1) * localNodeAnother,
        localItemComputed = -localCoord / 2 + (localTag.gradient && localTag.gradient.end[1] || 0) * localCoord;
      if (localTag.fillType !== "none") {
        if (localTag.fillType === "gradient" && localTag.gradient) {
          let localGradient = localTag.gradient,
            localAddColorStop;
          if (localGradient.type === "radial") {
            let localValueTwelfth = (localGradient.start ? localGradient.start[0] : 0.5) * localNodeAnother - localNodeAnother / 2,
              valueTwelfth = (localGradient.start ? localGradient.start[1] : 0.5) * localCoord - localCoord / 2,
              localItemStepped = (localGradient.end ? localGradient.end[0] : 0.5) * localNodeAnother - localNodeAnother / 2,
              localItemNested = (localGradient.end ? localGradient.end[1] : 0.5) * localCoord - localCoord / 2,
              localItemEmbedded = Math.max(0.001, Math.hypot(localItemStepped - localValueTwelfth, localItemNested - valueTwelfth));
            localAddColorStop = localSave.createRadialGradient(localValueTwelfth, valueTwelfth, 0, localValueTwelfth, valueTwelfth, localItemEmbedded);
          } else localAddColorStop = localSave.createLinearGradient(localItemResolved, localItemConverted, localItemDerived, localItemComputed);
          if (localGradient.stops && localGradient.stops.length > 0) {
            for (let colorValue of localGradient.stops) localAddColorStop.addColorStop(Math.max(0, Math.min(1, colorValue.t)), toCssColor(colorValue.color));
          } else localAddColorStop.addColorStop(0, toCssColor(localGradient.startColor)), localAddColorStop.addColorStop(1, toCssColor(localGradient.endColor));
          localSave.fillStyle = localAddColorStop;
        } else localSave.fillStyle = toCssColor(localTag.fillColor);
        localSave.save(), this.applyLayerShadow(localSave, localTag), localValueTenth ? (this.Me(localSave, localTag, localNodeAnother, localCoord, localValueDerived), localSave.fill()) : localSave.fillRect(-localNodeAnother / 2, -localCoord / 2, localNodeAnother, localCoord), localSave.restore();
      }
      this.drawLayerStroke(localSave, localTag, localNodeAnother, localCoord, localValueDerived);
    }
    ['se'](tn, localArgThirteenth) {
      if (tn.tn === this.R && tn.nn === tn.Ae) return tn.an;
      let localSn = this.sn(tn, localArgThirteenth);
      return tn.tn = this.R, tn.nn = tn.Ae, tn.an = localSn, localSn;
    }
    ['Je'](fe) {
      return fe.Fe && fe.Ae === this.R ? fe.Fe : fe.size && fe.size.value || [0, 0];
    }
    ['sn'](tagArg, localArgPending) {
      if (tagArg.tag === "embedScene" && tagArg.scene) return [tagArg.scene.width, tagArg.scene.height];
      if (tagArg.path) {
        let localBounds = tagArg.path.bounds;
        return [Math.max(1, localBounds.w), Math.max(1, localBounds.h)];
      }
      if (tagArg.tag === "drawing") {
        let localBlock = helperByKey(tagArg);
        return [Math.max(1, localBlock.w), Math.max(1, localBlock.h)];
      }
      if (tagArg.tag === "text" && tagArg.wrapWidth > 0) {
        let localItemTracked = (tagArg.textContent || '').split('\x0a').length * (tagArg.fontSize || 18) * 1.2;
        return [tagArg.wrapWidth, Math.max(50, localItemTracked)];
      }
      let localDerived = this.Je(tagArg),
        valueChunk = this.sizeScale || 1,
        localValueComputed = localDerived[0] > 0 && localDerived[1] > 0 ? [localDerived[0] * valueChunk, localDerived[1] * valueChunk] : [localArgPending.width, localArgPending.height];
      return this.mediaScale && this.mediaScale !== 1 && (localValueComputed = [localValueComputed[0] * this.mediaScale, localValueComputed[1] * this.mediaScale]), localValueComputed;
    }
    ['rn'](argPending, localBgcolor, localSurfWidth, localSurfHeight, localArgInput) {
      if (!(localSurfWidth > 0) || !(localSurfHeight > 0)) return null;
      let viewport = this.gl,
        localItemCompared = "sub" + this.ae + ':' + (argPending.id || "scene") + ':',
        sceneTarget = this.F(localSurfWidth, localSurfHeight, localItemCompared, true).a,
        cameraMat = {
          scene: this.scene,
          sceneTarget: this.sceneTarget,
          surfWidth: this.surfWidth,
          surfHeight: this.surfHeight,
          workWidth: this.workWidth,
          workHeight: this.workHeight,
          padX: this.padX,
          padY: this.padY,
          raster: this.raster,
          rasterCtx: this.rasterCtx,
          cameraActive: this.G,
          cameraMat: this.Ze ? this.Ze : this.Ze = new Float64Array(6),
          level: this.ae,
          subDepth: this.Y
        };
      for (let valueComputed = 0; valueComputed < 6; valueComputed++) cameraMat.cameraMat[valueComputed] = this.k[valueComputed];
      let localBt = this.Bt(localSurfWidth, localSurfHeight);
      this.scene = localBgcolor, this.sceneTarget = sceneTarget;
      let wValue = objHelperEl(localBgcolor),
        localValueBlock = Math.min(localSurfWidth / wValue.w, localSurfHeight / wValue.h) || 0;
      this.surfWidth = localSurfWidth, this.surfHeight = localSurfHeight, this.workWidth = wValue.w * localValueBlock, this.workHeight = wValue.h * localValueBlock, this.padX = (localSurfWidth - this.workWidth) / 2, this.padY = (localSurfHeight - this.workHeight) / 2, this.raster = localBt.canvas, this.rasterCtx = localBt.ctx, this.ae = cameraMat.level + 1, this.Y = cameraMat.subDepth + 1;
      try {
        viewport.bindFramebuffer(viewport.FRAMEBUFFER, sceneTarget.fbo), viewport.viewport(0, 0, localSurfWidth, localSurfHeight), viewport.disable(viewport.BLEND);
        let localComputed = localBgcolor.bgcolor || [0, 0, 0, 0];
        viewport.clearColor(localComputed[0], localComputed[1], localComputed[2], localComputed[3]), viewport.clear(viewport.COLOR_BUFFER_BIT), this.et(localArgInput);
        for (let localRe of localBgcolor.layers || []) {
          if (localRe.hidden || localRe.re || this.hiddenLayers && this.hiddenLayers.has(localRe.id)) continue;
          let valueBlock = this.X(localRe, localArgInput);
          valueBlock !== null && (this.stats.layers++, this.tt(localRe, valueBlock, (localArgInput - localRe.startTime) / 1000));
        }
        return sceneTarget;
      } catch (localNodeEl) {
        return this.log("[SCENE] Sub-scene " + (argPending.id || '') + " gagal dirender ke tekstur: " + String(localNodeEl.message).split('\x0a')[0]), null;
      } finally {
        this.scene = cameraMat.scene, this.sceneTarget = cameraMat.sceneTarget, this.surfWidth = cameraMat.surfWidth, this.surfHeight = cameraMat.surfHeight, this.workWidth = cameraMat.workWidth, this.workHeight = cameraMat.workHeight, this.padX = cameraMat.padX, this.padY = cameraMat.padY, this.raster = cameraMat.raster, this.rasterCtx = cameraMat.rasterCtx, this.G = cameraMat.cameraActive;
        for (let localValueStored = 0; localValueStored < 6; localValueStored++) this.k[localValueStored] = cameraMat.cameraMat[localValueStored];
        this.ae = cameraMat.level, this.Y = cameraMat.subDepth;
      }
    }
    ['en'](localLayers, globalAlpha, localWorkWidth, localWorkHeight, localArgResolved, argContext) {
      let workWidth = this.workWidth,
        workHeight = this.workHeight;
      this.workWidth = localWorkWidth, this.workHeight = localWorkHeight, this.Y++, localLayers.layers.forEach(argThirteenth => {
        argThirteenth.N = localLayers;
      }), globalAlpha.save();
      try {
        for (let blendMode of localLayers.layers) {
          let valueStored = localArgResolved !== void 0 ? localArgResolved : 0,
            localData = this.X(blendMode, valueStored);
          if (localData === null) continue;
          let localTe = this.te(blendMode, localData, valueStored / 1000);
          if (localTe.alpha <= 0.002) continue;
          let seValue = this.se(blendMode, localLayers),
            localItemSorted = localWorkHeight / localLayers.height;
          globalAlpha.save(), globalAlpha.globalAlpha = Math.max(0, Math.min(1, localTe.alpha)), globalAlpha.globalCompositeOperation = localValueType[processHelperClamped(blendMode.blendMode)] || "source-over", this.Ce(globalAlpha, blendMode, localTe, localItemSorted, (valueStored - blendMode.startTime) / 1000), blendMode.B = Math.max(0, valueStored - blendMode.startTime), blendMode.he = blendMode.endTime - blendMode.startTime, this.Se(blendMode, seValue, globalAlpha), globalAlpha.restore();
        }
        globalAlpha.restore();
      } finally {
        this.Y--, this.workWidth = workWidth, this.workHeight = workHeight;
      }
    }
    ['nt'](widthArg, texArg, localArgResponse, argResponse) {
      let bindTexture = this.gl;
      bindTexture.bindTexture(bindTexture.TEXTURE_2D, texArg.tex), bindTexture.pixelStorei(bindTexture.UNPACK_FLIP_Y_WEBGL, true), bindTexture.pixelStorei(bindTexture.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true), texArg.w === widthArg.width && texArg.h === widthArg.height ? bindTexture.texSubImage2D(bindTexture.TEXTURE_2D, 0, 0, 0, bindTexture.RGBA, bindTexture.UNSIGNED_BYTE, widthArg) : bindTexture.texImage2D(bindTexture.TEXTURE_2D, 0, bindTexture.RGBA, bindTexture.RGBA, bindTexture.UNSIGNED_BYTE, widthArg), bindTexture.pixelStorei(bindTexture.UNPACK_FLIP_Y_WEBGL, false), bindTexture.pixelStorei(bindTexture.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), bindTexture.texParameteri(bindTexture.TEXTURE_2D, bindTexture.TEXTURE_WRAP_S, bindTexture.CLAMP_TO_EDGE), bindTexture.texParameteri(bindTexture.TEXTURE_2D, bindTexture.TEXTURE_WRAP_T, bindTexture.CLAMP_TO_EDGE), bindTexture.texParameteri(bindTexture.TEXTURE_2D, bindTexture.TEXTURE_MIN_FILTER, bindTexture.LINEAR), bindTexture.texParameteri(bindTexture.TEXTURE_2D, bindTexture.TEXTURE_MAG_FILTER, bindTexture.LINEAR);
    }
    ['pe'](uniformsArg, localArgFourteenth, flagArg, uniform, angle, argInput = 1, uniformArg = 1, argResolved = null, localArgConverted = null) {
      let uniformF = this.gl,
        localUniforms = uniformsArg.uniforms;
      flagArg = this.workWidth, uniform = this.workHeight;
      let sizePx = this.o.valid ? this.o : null,
        localItemFiltered = sizePx ? sizePx.sizePx[0] : flagArg,
        localItemMapped = sizePx ? sizePx.sizePx[1] : uniform;
      localUniforms.acLayerSize && uniformF.uniform2f(localUniforms.acLayerSize, localItemFiltered, localItemMapped), localUniforms.acScreenSize && uniformF.uniform2f(localUniforms.acScreenSize, flagArg, uniform), localUniforms.acLayerCenter && uniformF.uniform2f(localUniforms.acLayerCenter, sizePx ? sizePx.centerPx[0] : flagArg / 2, sizePx ? sizePx.centerPx[1] : uniform / 2), localUniforms.acLayerCenterNorm && uniformF.uniform2f(localUniforms.acLayerCenterNorm, sizePx ? sizePx.centerNorm[0] : 0.5, sizePx ? sizePx.centerNorm[1] : 0.5), localUniforms.acLayerSizeNorm && uniformF.uniform2f(localUniforms.acLayerSizeNorm, sizePx ? sizePx.sizeNorm[0] : 1, sizePx ? sizePx.sizeNorm[1] : 1), localUniforms.acLayerPivot && uniformF.uniform2f(localUniforms.acLayerPivot, 0, 0), localUniforms.acPreviewSize && uniformF.uniform2f(localUniforms.acPreviewSize, flagArg, uniform), localUniforms.acProjectSize && uniformF.uniform2f(localUniforms.acProjectSize, flagArg, uniform), localUniforms.acPass && uniformF.uniform1i(localUniforms.acPass, uniformArg), localUniforms.acTime && uniformF.uniform1f(localUniforms.acTime, localArgFourteenth), localUniforms.acAngularVelocity && uniformF.uniform1f(localUniforms.acAngularVelocity, angle ? angle.angle : 0), localUniforms.acVelocity && uniformF.uniform2f(localUniforms.acVelocity, angle ? angle.x * argInput : 0, angle ? angle.y * argInput : 0), localUniforms.acScaleVelocity && uniformF.uniform1f(localUniforms.acScaleVelocity, angle ? angle.scale : 0), localUniforms.acShowGuides && uniformF.uniform1i(localUniforms.acShowGuides, 0), localUniforms.acLayerToScreen && uniformF.uniformMatrix4fv(localUniforms.acLayerToScreen, false, sizePx ? sizePx.toScreen : float32Array3), localUniforms.acScreenToLayer && uniformF.uniformMatrix4fv(localUniforms.acScreenToLayer, false, sizePx ? sizePx.toLayer : float32Array3);
      let origin = localArgConverted || this.O,
        localOrigin = argResolved || this.O;
      localUniforms.acCompOrigin && uniformF.uniform2f(localUniforms.acCompOrigin, this.O.origin[0], this.O.origin[1]), localUniforms.acCompSize && uniformF.uniform2f(localUniforms.acCompSize, this.O.size[0], this.O.size[1]), localUniforms.acOutputOrigin && uniformF.uniform2f(localUniforms.acOutputOrigin, origin.origin[0], origin.origin[1]), localUniforms.acOutputSize && uniformF.uniform2f(localUniforms.acOutputSize, origin.size[0], origin.size[1]), localUniforms.acInputOrigin && uniformF.uniform2f(localUniforms.acInputOrigin, localOrigin.origin[0], localOrigin.origin[1]), localUniforms.acInputSize && uniformF.uniform2f(localUniforms.acInputSize, localOrigin.size[0], localOrigin.size[1]);
    }
    ['Le'](localParams, xe) {
      let localValueData = xe.xe || (xe.xe = new WeakMap()),
        valueData = localValueData.get(localParams);
      if (valueData) return valueData;
      let localValueThirteenth = [];
      for (let localId of xe.definition.params) {
        let valueThirteenth = xe.uniformNames.get(localId.id) || localId.id,
          find = localParams.params.find(argFourteenth => argFourteenth.id === localId.id);
        if (localId.type === "texture") {
          localValueThirteenth.push({
            id: localId.id,
            type: "texture",
            comp: localId.srcType === "comp",
            buffer: localId.srcType === "buffer",
            uniform: xe.uniforms['u_' + valueThirteenth + "_texture"] || null,
            sizeUniform: xe.uniforms['u_' + valueThirteenth + "_size"] || null
          });
          continue;
        }
        localValueThirteenth.push({
          id: localId.id,
          type: localId.type,
          kind: localType[localId.type] || null,
          valueType: localId.valueType,
          loc: xe.uniforms[valueThirteenth] || null,
          channel: find ? find.channel : null,
          fallback: localId.defaultValue
        });
      }
      let localState = {
        entry: xe,
        items: localValueThirteenth
      };
      return localValueData.set(localParams, localState), localParams.it = null, localState;
    }
    ['ge'](localArgFifteenth, argFifteenth, localArgSixteenth, passBuffers, argConverted, localArgDerived, argSixteenth, localArgSeventeenth) {
      let activeTexture = this.gl,
        localItems = this.Le(argFifteenth, localArgFifteenth).items,
        veValue = this.ve,
        localUniform = 0;
      for (let localBuffer of localItems) {
        if (localBuffer.type === "texture") {
          let localValueFourteenth;
          localBuffer.buffer && passBuffers.passBuffers && passBuffers.passBuffers.has(localBuffer.id) ? localValueFourteenth = passBuffers.passBuffers.get(localBuffer.id) : localBuffer.comp ? localValueFourteenth = passBuffers.comp : localValueFourteenth = passBuffers.input, activeTexture.activeTexture(activeTexture.TEXTURE0 + localUniform), activeTexture.bindTexture(activeTexture.TEXTURE_2D, localValueFourteenth || this.placeholderTexture), localBuffer.uniform && activeTexture.uniform1i(localBuffer.uniform, localUniform), localBuffer.sizeUniform && (localBuffer.comp ? activeTexture.uniform2f(localBuffer.sizeUniform, argConverted, localArgDerived) : activeTexture.uniform2f(localBuffer.sizeUniform, argSixteenth || argConverted, localArgSeventeenth || localArgDerived)), localUniform++;
          continue;
        }
        let kind = localBuffer.kind,
          localLoc = localBuffer.loc;
        if (!localLoc || !kind) continue;
        let localValueRaw = localBuffer.channel ? refHelper(localBuffer.channel, localArgSixteenth, veValue) : localBuffer.fallback,
          localTarget = Array.isArray(localValueRaw) ? localValueRaw[0] : localValueRaw;
        kind === "float" ? activeTexture.uniform1f(localLoc, Number.isFinite(localTarget) ? localTarget : 0) : kind === "bool" ? activeTexture.uniform1i(localLoc, localTarget ? 1 : 0) : kind === "int" ? activeTexture.uniform1i(localLoc, Math.round(Number.isFinite(localTarget) ? localTarget : 0)) : kind === "vec2" ? activeTexture.uniform2f(localLoc, localValueRaw[0] || 0, localValueRaw[1] || 0) : kind === "vec3" ? activeTexture.uniform3f(localLoc, localValueRaw[0] || 0, localValueRaw[1] || 0, localValueRaw[2] || 0) : kind === "vec4" ? activeTexture.uniform4f(localLoc, localValueRaw[0] || 0, localValueRaw[1] || 0, localValueRaw[2] || 0, localValueRaw[3] === void 0 ? 1 : localValueRaw[3]) : kind === "mat4" && (localValueRaw.length === 16 ? (this.Ie.set(localValueRaw), activeTexture.uniformMatrix4fv(localLoc, false, this.Ie)) : activeTexture.uniformMatrix4fv(localLoc, false, float32Array3));
      }
    }
    ['cn'](argSeventeenth, xArg, argDerived, localArgRequest, localArgEighteenth) {
      let localBindTexture = this.gl;
      localBindTexture.bindFramebuffer(localBindTexture.FRAMEBUFFER, argSeventeenth.fbo), localBindTexture.bindTexture(localBindTexture.TEXTURE_2D, argDerived.tex);
      let localEntryRaw = Math.max(0, xArg.x + this.padX),
        localEntryParsed = Math.max(0, localArgEighteenth - (xArg.y + this.padY + xArg.h));
      return localBindTexture.copyTexSubImage2D(localBindTexture.TEXTURE_2D, 0, 0, 0, localEntryRaw, localEntryParsed, xArg.w, xArg.h), argDerived;
    }
    ['ln'](argEighteenth, wArg, localArgEl, argEl) {
      let localFramebuffer = this.gl,
        fboValue = this.F(localArgEl, argEl, "fx:placed:", true).a;
      localFramebuffer.bindFramebuffer(localFramebuffer.FRAMEBUFFER, fboValue.fbo), localFramebuffer.viewport(0, 0, localArgEl, argEl), localFramebuffer.disable(localFramebuffer.BLEND), localFramebuffer.clearColor(0, 0, 0, 0), localFramebuffer.clear(localFramebuffer.COLOR_BUFFER_BIT), localFramebuffer.useProgram(this.blitProgram), this.E(this.blitAttribs);
      let localEntryClamped = wArg.w / localArgEl,
        localEntryScoped = wArg.h / argEl,
        localEntryLocal = wArg.x + this.padX,
        localEntryOuter = wArg.y + this.padY,
        localEntryInner = (2 * localEntryLocal + wArg.w) / localArgEl - 1,
        localEntryStart = 1 - (2 * localEntryOuter + wArg.h) / argEl;
      return this.I[0] = localEntryClamped, this.I[1] = 0, this.I[2] = 0, this.I[3] = 0, this.I[4] = localEntryScoped, this.I[5] = 0, this.I[6] = localEntryInner, this.I[7] = localEntryStart, this.I[8] = 1, localFramebuffer.activeTexture(localFramebuffer.TEXTURE0), localFramebuffer.bindTexture(localFramebuffer.TEXTURE_2D, argEighteenth), this.blitUniforms.u_image && localFramebuffer.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && localFramebuffer.uniform1f(this.blitUniforms.u_alpha, 1), this.blitUniforms.u_transform && localFramebuffer.uniformMatrix3fv(this.blitUniforms.u_transform, false, this.I), localFramebuffer.drawArrays(localFramebuffer.TRIANGLES, 0, 6), fboValue.tex;
    }
    ['un'](effects, localArgList, argList, localArg, localArgValue, localArgMap, mArg, localH = null) {
      let glValue = this.gl,
        localU = this.u,
        passes = this.i,
        localEntryEnd = !!localH && this.effectsEnabled && this.oe(effects) > 0,
        localF = this.F(localArg, localArgValue),
        localTex = localF.a.tex,
        localB = localF.b,
        localStored = this.scene && this.scene.height ? this.workHeight / this.scene.height : 1;
      if (mArg && mArg.at) this.Wt(mArg.at, mArg.m, mArg.w, mArg.h, localF.a, localArg, localArgValue), this.qt(effects, mArg, localF, localArg, localArgValue);else {
        if (mArg) try {
          this.Kt(mArg, localF.a, localArg, localArgValue);
        } catch (localNodeList) {
          this.Ke(localNodeList), this.Qt(mArg), this.nt(this.raster, localF.a, localArg, localArgValue);
        } else this.nt(this.raster, localF.a, localArg, localArgValue);
        const bObj = mArg && mArg.m ? mArg : { m: [1, 0, 0, 1, 0, 0], w: localArg, h: localArgValue };
        this.qt(effects, bObj, localF, localArg, localArgValue);
      }
      if (!localEntryEnd) {
        let localCounter = localTex;
        if (this.effectsEnabled) {
          glValue.disable(glValue.BLEND);
          for (let localDisabled of effects.effects) {
            if (localDisabled.disabled || localDisabled.hidden === true || localDisabled.hidden === "true") continue;
            let programsByGroup = this.programs.get(localDisabled.id);
            if (!programsByGroup || !programsByGroup.programsByGroup) continue;
            let definitionValue = programsByGroup.definition;
            if (localU && !processParsed(definitionValue, localU)) {
              this.W.skipped++;
              continue;
            }
            let localValueCached = definitionValue && definitionValue.passes || [],
              localPassBuffers = new Map(),
              localValueFifteenth = localDisabled.be == null ? [programsByGroup.groupOrder[0]] : localDisabled.be;
            if (localValueCached.length > 1) for (let valueInput = 0; valueInput < localValueCached.length; valueInput++) {
              let ltNumberValue = localValueCached[valueInput],
                localEntryMin = localValueFifteenth[Math.min(valueInput, localValueFifteenth.length - 1)],
                canDiscard = programsByGroup.programsByGroup.get(String(localEntryMin));
              if (!canDiscard) continue;
              let valueCached = ltNumberValue && ltNumberValue.target ? ltNumberValue.target : null,
                localValueCounter = valueCached ? this.F(localArg, localArgValue, "fx:buf:" + valueCached + ':', true).a : localB;
              glValue.bindFramebuffer(glValue.FRAMEBUFFER, localValueCounter.fbo), glValue.viewport(0, 0, localArg, localArgValue), localU && localU.invalidate && this.gl2 && !canDiscard.canDiscard && glValue.invalidateFramebuffer(glValue.FRAMEBUFFER, localPrimary), glValue.useProgram(canDiscard.program), this.E(canDiscard.attribs), this.pe(canDiscard, argList, localArg, localArgValue, localArgMap, localStored, valueInput), this.l.input = localTex, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = localPassBuffers, this.ge(canDiscard, localDisabled, localArgList, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
              let valueCounter = passes ? this.le() : null;
              glValue.drawArrays(glValue.TRIANGLES, 0, 6), valueCounter && this.ue(valueCounter, definitionValue), passes && passes.passes++, this.stats.passes++, valueCached ? localPassBuffers.set(valueCached, localValueCounter.tex) : (localTex = localB.tex, localB = localB === localF.a ? localF.b : localF.a);
            } else {
              let valueFifteenth = 0;
              for (let localEntryMax of localValueFifteenth) {
                let localCanDiscard = programsByGroup.programsByGroup.get(String(localEntryMax));
                if (!localCanDiscard) continue;
                let localValueSixteenth = localValueCached[valueFifteenth],
                  localCached = localValueSixteenth && localValueSixteenth.target ? localValueSixteenth.target : null,
                  localTimer = localCached ? this.F(localArg, localArgValue, "fx:buf:" + localCached + ':', true).a : localB;
                glValue.bindFramebuffer(glValue.FRAMEBUFFER, localTimer.fbo), glValue.viewport(0, 0, localArg, localArgValue), localU && localU.invalidate && this.gl2 && !localCanDiscard.canDiscard && glValue.invalidateFramebuffer(glValue.FRAMEBUFFER, localPrimary), glValue.useProgram(localCanDiscard.program), this.E(localCanDiscard.attribs), this.pe(localCanDiscard, argList, localArg, localArgValue, localArgMap, localStored, valueFifteenth), this.l.input = localTex, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = localPassBuffers, this.ge(localCanDiscard, localDisabled, localArgList, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
                let localValueTimer = passes ? this.le() : null;
                glValue.drawArrays(glValue.TRIANGLES, 0, 6), localValueTimer && this.ue(localValueTimer, definitionValue), passes && passes.passes++, this.stats.passes++, valueFifteenth++, localCached ? localPassBuffers.set(localCached, localTimer.tex) : (localTex = localB.tex, localB = localB === localF.a ? localF.b : localF.a);
              }
            }
          }
          localCounter = localTex;
        }
        return {
          texture: localCounter,
          domain: null,
          expanded: false
        };
      }
      let localValueState = localH.m,
        valueFourteenth = localH.w,
        hValue = localH.h;
      if (!(valueFourteenth > 0) || !(hValue > 0)) return {
        texture: localTex,
        domain: null,
        expanded: false
      };
      let localW = updateHelperScoped(localValueState, valueFourteenth, hValue, this.workWidth, this.workHeight, this.oe(effects), this.padX, this.padY);
      if (localW.empty) return {
        texture: localTex,
        domain: null,
        expanded: false
      };
      localU && localU.bucket && computeHelperInner(localW, localU.bucket, this.workWidth, this.workHeight, this.padX, this.padY);
      let valueState = localU && localU.overdrawCap < 0.5 ? localU.overdrawCap : 0.5,
        localValueFlag = 0,
        valueFlag = this.F(localW.w, localW.h, "fx:src:", true).a;
      this.cn(localF.a, localW, valueFlag, localArg, localArgValue), localTex = valueFlag.tex;
      let localValueInput = localW;
      glValue.disable(glValue.BLEND);
      for (let disabledValue of effects.effects) {
        if (disabledValue.disabled || disabledValue.hidden === true || disabledValue.hidden === "true") continue;
        let localProgramsByGroup = this.programs.get(disabledValue.id);
        if (!localProgramsByGroup || !localProgramsByGroup.programsByGroup) continue;
        let localDefinition = localProgramsByGroup.definition;
        if (localU && !processParsed(localDefinition, localU)) {
          this.W.skipped++;
          continue;
        }
        let valueSixteenth = localDefinition && localDefinition.overdraw && Number.isFinite(localDefinition.maxOverdraw) ? Math.max(0, localDefinition.maxOverdraw) : 0;
        localU && valueSixteenth > localU.overdrawCap && (valueSixteenth = localU.overdrawCap);
        let valueTimer = Math.max(localValueFlag, valueSixteenth),
          localResult = Math.max(this.padX, this.workWidth * valueState),
          localValueResult = Math.max(this.padY, this.workHeight * valueState),
          localUpdate = updateHelperScoped(localValueState, valueFourteenth, hValue, this.workWidth, this.workHeight, valueTimer, localResult, localValueResult);
        localU && localU.bucket && computeHelperInner(localUpdate, localU.bucket, this.workWidth, this.workHeight, localResult, localValueResult);
        let fValue = this.F(localUpdate.w, localUpdate.h, "fx:pass:"),
          texValue = localTex === fValue.a.tex ? fValue.b : fValue.a,
          localValueBorder = localDefinition && localDefinition.passes || [],
          passBuffersValue = new Map(),
          localValueSeventeenth = disabledValue.be == null ? [localProgramsByGroup.groupOrder[0]] : disabledValue.be,
          localNodeMap = 0;
        if (localValueBorder.length > 1) for (let localInput = 0; localInput < localValueBorder.length; localInput++) {
          let valueSeventeenth = localValueBorder[localInput],
            localEntryByKey = localValueSeventeenth[Math.min(localInput, localValueSeventeenth.length - 1)],
            canDiscardValue = localProgramsByGroup.programsByGroup.get(String(localEntryByKey));
          if (!canDiscardValue) continue;
          let valueBorder = valueSeventeenth && valueSeventeenth.target ? valueSeventeenth.target : null,
            valueResult = valueBorder ? this.F(localUpdate.w, localUpdate.h, "fx:buf:" + valueBorder + ':', true).a : texValue;
          glValue.bindFramebuffer(glValue.FRAMEBUFFER, valueResult.fbo), glValue.viewport(0, 0, localUpdate.w, localUpdate.h), localU && localU.invalidate && this.gl2 && !canDiscardValue.canDiscard && glValue.invalidateFramebuffer(glValue.FRAMEBUFFER, localPrimary), glValue.useProgram(canDiscardValue.program), this.E(canDiscardValue.attribs), this.pe(canDiscardValue, argList, localArg, localArgValue, localArgMap, localStored, localInput, localValueInput, localUpdate), this.l.input = localTex, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = passBuffersValue, this.ge(canDiscardValue, disabledValue, localArgList, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
          let localValueKey = passes ? this.le() : null;
          glValue.drawArrays(glValue.TRIANGLES, 0, 6), localValueKey && this.ue(localValueKey, localDefinition), passes && passes.passes++, this.stats.passes++, valueBorder ? passBuffersValue.set(valueBorder, valueResult.tex) : (localTex = texValue.tex, localValueInput = localUpdate, texValue = texValue === fValue.a ? fValue.b : fValue.a);
        } else {
          let localValueEighteenth = 0;
          for (let localEntryByIndex of localValueSeventeenth) {
            let program = localProgramsByGroup.programsByGroup.get(String(localEntryByIndex));
            if (!program) continue;
            let valueEighteenth = localValueBorder[localValueEighteenth],
              localBorder = valueEighteenth && valueEighteenth.target ? valueEighteenth.target : null,
              valueKey = localBorder ? this.F(localUpdate.w, localUpdate.h, "fx:buf:" + localBorder + ':', true).a : texValue;
            glValue.bindFramebuffer(glValue.FRAMEBUFFER, valueKey.fbo), glValue.viewport(0, 0, localUpdate.w, localUpdate.h), localU && localU.invalidate && this.gl2 && !program.canDiscard && glValue.invalidateFramebuffer(glValue.FRAMEBUFFER, localPrimary), glValue.useProgram(program.program), this.E(program.attribs), this.pe(program, argList, localArg, localArgValue, localArgMap, localStored, localValueEighteenth, localValueInput, localUpdate), this.l.input = localTex, this.l.comp = this.sceneTarget.tex, this.l.passBuffers = passBuffersValue, this.ge(program, disabledValue, localArgList, this.l, this.workWidth, this.workHeight, this.o.valid ? this.o.sizePx[0] : this.workWidth, this.o.valid ? this.o.sizePx[1] : this.workHeight);
            let localValueSet = passes ? this.le() : null;
            glValue.drawArrays(glValue.TRIANGLES, 0, 6), localValueSet && this.ue(localValueSet, localDefinition), passes && passes.passes++, this.stats.passes++, localValueEighteenth++, localBorder ? passBuffersValue.set(localBorder, valueKey.tex) : (localTex = texValue.tex, localValueInput = localUpdate, texValue = texValue === fValue.a ? fValue.b : fValue.a);
          }
        }
        localValueFlag = valueTimer;
      }
      return {
        texture: localTex,
        domain: localValueInput,
        expanded: true
      };
    }
    ['dn'](localArgNineteenth) {
      return valueBuffer[processHelperClamped(localArgNineteenth)] || valueBuffer.normal;
    }
    ['fn'](ltKey) {
      if (this.ke.has(ltKey)) return this.ke.get(ltKey);
      let localLtKey = localToken[ltKey],
        valueSet = typeof localLtKey == "string" ? localLtKey : localLtKey ? localLtKey.body : null,
        localArray = localLtKey && typeof localLtKey == "object" && localLtKey.header || '',
        localValueEdge = null;
      if (valueSet) {
        let localValueNineteenth = this.webglVersion >= 2,
          localEntryEl = localValueNineteenth ? "#version 300 es\nprecision highp float;\nin vec2 v_texCoord;\nout vec4 acFragColor;\n" : "precision highp float;\nvarying vec2 v_texCoord;\n",
          localEntryList = localValueNineteenth ? "acFragColor" : "gl_FragColor",
          localValueArray = localValueNineteenth ? "texture" : "texture2D";
        try {
          let valueNineteenth = this.K(this.de(), localEntryEl + (localArray ? localArray + '\x0a' : '') + "uniform sampler2D u_image;\nuniform sampler2D u_comp;\nvoid main() {\n vec4 texColor = " + localValueArray + "(u_image, v_texCoord);\n vec4 compColor = " + localValueArray + "(u_comp, v_texCoord);\n vec3 top = texColor.rgb;\n vec3 bot = compColor.rgb * texColor.a;\n" + valueSet + '\x0a\x20' + localEntryList + " = vec4(result, texColor.a);\n}\n");
          localValueEdge = {
            program: valueNineteenth,
            uniforms: this.J(valueNineteenth),
            attribs: this.Z(valueNineteenth)
          };
        } catch (localNodeCount) {
          this.log("[SCENE] Blend " + ltKey + " gagal: " + String(localNodeCount.message).split('\x0a')[0]), localValueEdge = null;
        }
      }
      return this.ke.set(ltKey, localValueEdge), localValueEdge;
    }
    ['mn'](localArgComputed, argNineteenth, argComputed, localArgStored) {
      let localFn = this.fn(argNineteenth);
      if (!localFn) return localArgComputed;
      let framebuffer = this.gl,
        valueArray = this.F(argComputed, localArgStored, "blend:");
      return framebuffer.bindFramebuffer(framebuffer.FRAMEBUFFER, valueArray.a.fbo), framebuffer.viewport(0, 0, argComputed, localArgStored), framebuffer.disable(framebuffer.BLEND), framebuffer.useProgram(localFn.program), this.E(localFn.attribs), framebuffer.activeTexture(framebuffer.TEXTURE0), framebuffer.bindTexture(framebuffer.TEXTURE_2D, localArgComputed), framebuffer.activeTexture(framebuffer.TEXTURE1), framebuffer.bindTexture(framebuffer.TEXTURE_2D, this.sceneTarget.tex), localFn.uniforms.u_image && framebuffer.uniform1i(localFn.uniforms.u_image, 0), localFn.uniforms.u_comp && framebuffer.uniform1i(localFn.uniforms.u_comp, 1), framebuffer.drawArrays(framebuffer.TRIANGLES, 0, 6), this.stats.passes++, framebuffer.activeTexture(framebuffer.TEXTURE0), valueArray.a.tex;
    }
    ['te'](hn, time, absTime) {
      let localHn = hn.hn;
      if (!localHn) {
        let localMakeTextState = makeTextState('');
        localHn = hn.hn = {
          el: localMakeTextState,
          loc: localMakeTextState.transform.location,
          scale: localMakeTextState.transform.scale,
          env: {
            time: 0,
            duration: 0,
            frame: 0,
            fps: 30,
            absTime: 0,
            inTime: 0,
            velocity: {
              x: 0,
              y: 0
            },
            scaleVelocity: 0,
            angularVelocity: 0
          },
          vel: {
            x: 0,
            y: 0,
            scale: 0,
            angle: 0
          },
          vec: [0, 0, 0, 0],
          size: [0, 0],
          pivot: {
            x: 0,
            y: 0
          },
          skew: {
            x: 0,
            y: 0
          }
        };
      }
      let localEl = localHn.el,
        vec = localHn.vec;
      localEl.transform.location !== localHn.loc && (localEl.transform.location = localHn.loc), localEl.transform.scale !== localHn.scale && (localEl.transform.scale = localHn.scale), localEl.transform.pivot !== localHn.pivot && (localEl.transform.pivot = localHn.pivot), localEl.transform.skew !== localHn.skew && (localEl.transform.skew = localHn.skew), refHelper(hn.transform.location, time, vec), localHn.loc.x = vec[0], localHn.loc.y = vec[1], localHn.loc.z = vec[2], refHelper(hn.transform.scale, time, vec), localHn.scale.x = vec[0], localHn.scale.y = vec[1], hn.transform.pivot ? (refHelper(hn.transform.pivot, time, vec), localHn.pivot.x = vec[0], localHn.pivot.y = vec[1]) : (localHn.pivot.x = 0, localHn.pivot.y = 0), hn.transform.skew ? (refHelper(hn.transform.skew, time, vec), localHn.skew.x = vec[0], localHn.skew.y = vec[1]) : (localHn.skew.x = 0, localHn.skew.y = 0), localEl.alpha = buildHelper(hn.transform.opacity, time), localEl.transform.angle = buildHelper(hn.transform.rotation, time), hn.size ? (refHelper(hn.size, time, localHn.size), hn.Fe = localHn.size) : hn.Fe = null, hn.Ae = this.R, localEl.shaderGroups && (localEl.shaderGroups = null);
      for (let idValue of hn.effects) {
        let animator = this.programs.get(idValue.id);
        if (!(!animator || !animator.animator) && !(this.u && !processParsed(animator.definition, this.u))) try {
          let pn = this.pn(animator, idValue, time, absTime),
            localEnv = localHn.env,
            localFps = this.scene && this.scene.fps || 30;
          localEnv.time = time, localEnv.duration = (hn.endTime - hn.startTime) / 1000, localEnv.frame = Math.round(absTime * localFps), localEnv.fps = localFps, localEnv.absTime = absTime, localEnv.inTime = 0;
          let localEntryMap = this.scene && this.scene.width || 1,
            localEntryCount = this.scene && this.scene.height || 1;
          localEnv.velocity.x = localHn.vel.x / localEntryMap, localEnv.velocity.y = localHn.vel.y / localEntryCount, localEnv.scaleVelocity = localHn.vel.scale, localEnv.angularVelocity = localHn.vel.angle;
          let localAngle = localEl.transform.angle;
          if (animator.animator.animate(localEnv, localEl, pn), idValue.ot === void 0 && (idValue.ot = idValue.params.some(localArgTwentieth => localArgTwentieth.id === "rpm")), idValue.ot && localEl.transform.angle !== localAngle) {
            let gn = this.gn(animator, idValue, "rpm", time);
            localEl.transform.angle = localAngle + gn * absTime;
          }
          idValue.be = Array.isArray(localEl.shaderGroups) ? localEl.shaderGroups.map(String) : null, localEl.shaderGroups = null;
        } catch (localNodeTotal) {
          hn.bn || (hn.bn = true, this.log("[SCENE] Script " + idValue.id + " gagal: " + localNodeTotal.message));
        }
      }
      return this.yn(hn, localHn, localEl.transform.angle, absTime), localEl.xn = localHn.vel, localEl;
    }
    ['yn'](vn, vel, aArg, argTwentieth) {
      let localVel = vel.vel,
        localT = vn.vn || (vn.vn = {
          t: NaN,
          x: 0,
          y: 0,
          sx: 0,
          a: 0
        }),
        localString = vn.startTime + argTwentieth * 1000,
        localValueString = 1000 / (this.scene && this.scene.fps || 30),
        valueString = localString - localT.t;
      localT.t === localT.t && valueString >= localValueString * 0.25 && valueString <= localValueString * 4 ? (localVel.x = vel.loc.x - localT.x, localVel.y = vel.loc.y - localT.y, localVel.scale = vel.scale.x - localT.sx, localVel.angle = aArg - localT.a) : (localVel.x = 0, localVel.y = 0, localVel.scale = 0, localVel.angle = 0), localT.t = localString, localT.x = vel.loc.x, localT.y = vel.loc.y, localT.sx = vel.scale.x, localT.a = aArg;
    }
    ['gn'](localArgItem, argItem, localArgEntry, argEntry) {
      for (let channelValue of this.Le(argItem, localArgItem).items) if (!(channelValue.id !== localArgEntry || channelValue.type === "texture")) return channelValue.channel ? refHelper(channelValue.channel, argEntry, this.ve)[0] || 0 : channelValue.fallback;
      return 0;
    }
    ['pn'](localSt, localIt, localArgNode, argStored) {
      let localEntryTotal = this.Le(localIt, localSt).items,
        localValueEnd = localIt.it || (localIt.it = {}),
        localEntryCurrent = this.ve;
      if (localSt.st === void 0) {
        let localEntryPrev = localSt.definition && localSt.definition.script && localSt.definition.script.code || '';
        localSt.st = /env\s*\.\s*(time|absTime|duration)/.test(localEntryPrev);
      }
      let localEntryNext = !localSt.st;
      for (let localChannel of localEntryTotal) {
        let valueMap = localChannel.type;
        if (valueMap === "texture" || valueMap === "tip") continue;
        let valueParsed = localChannel.channel ? refHelper(localChannel.channel, localArgNode, localEntryCurrent) : localChannel.fallback,
          localX = localValueEnd[localChannel.id];
        if (valueMap === "point") (!localX || typeof localX != "object") && (localX = localValueEnd[localChannel.id] = {
          x: 0,
          y: 0
        }), localX.x = valueParsed[0], localX.y = valueParsed[1];else {
          if (valueMap === "xyz") (!localX || typeof localX != "object" || localX.z === void 0) && (localX = localValueEnd[localChannel.id] = {
            x: 0,
            y: 0,
            z: 0
          }), localX.x = valueParsed[0], localX.y = valueParsed[1], localX.z = valueParsed[2];else {
            if (valueMap === "color") (!localX || typeof localX != "object") && (localX = localValueEnd[localChannel.id] = {
              r: 0,
              g: 0,
              b: 0,
              a: 1
            }), localX.r = valueParsed[0], localX.g = valueParsed[1], localX.b = valueParsed[2], localX.a = valueParsed[3] === void 0 ? 1 : valueParsed[3];else {
              if (valueMap === "switch") localValueEnd[localChannel.id] = !!valueParsed[0];else {
                let localValueTwentieth = Array.isArray(valueParsed) ? valueParsed[0] : valueParsed;
                localChannel.valueType === 'hz' && localEntryNext && typeof argStored == "number" && (localValueTwentieth = localValueTwentieth * argStored), localValueEnd[localChannel.id] = localValueTwentieth;
              }
            }
          }
        }
      }
      return localValueEnd;
    }
    ['kn'](parentLayerArg, argRequest) {
      let valueEdge = [parentLayerArg],
        parentLayerValue = parentLayerArg.parentLayer;
      if (!parentLayerValue && parentLayerArg.parentId && this.scene) {
        if (!this.scene.layerById) helperRaw(this.scene);
        parentLayerValue = this.scene.layerById ? this.scene.layerById.get(parentLayerArg.parentId) : null;
        if (parentLayerValue) parentLayerArg.parentLayer = parentLayerValue;
      }
      let localEntrySource = 0;
      for (; parentLayerValue && localEntrySource++ < 16;) {
        valueEdge.push(parentLayerValue);
        let next = parentLayerValue.parentLayer;
        if (!next && parentLayerValue.parentId && this.scene && this.scene.layerById) {
          next = this.scene.layerById.get(parentLayerValue.parentId);
          if (next) parentLayerValue.parentLayer = next;
        }
        parentLayerValue = next;
      }
      return valueEdge.reverse(), valueEdge.length === 1 ? null : valueEdge;
    }
    ['rt'](localEndTime, argNode) {
      let localValueNumber = localEndTime.endTime - localEndTime.startTime;
      if (localValueNumber <= 0) return 0;
      let valueClamped = (argNode - localEndTime.startTime) / localValueNumber;
      valueClamped = valueClamped < 0 ? 0 : valueClamped > 1 ? 1 : valueClamped;
      if (localEndTime && localEndTime.freezeTime != null) return Math.max(0, Math.min(1, localEndTime.freezeTime));
      if (localEndTime && localEndTime.speedCurve && typeof localEndTime.speedCurve.evaluate === "function") {
        valueClamped = localEndTime.speedCurve.evaluate(valueClamped);
      }
      if (localEndTime && localEndTime.reversed) valueClamped = 1 - valueClamped;
      return valueClamped;
    }
    ['X'](startTime, localArgOutput) {
      if (localArgOutput < startTime.startTime || localArgOutput > startTime.endTime) return null;
      let valueNumber = startTime.endTime - startTime.startTime;
      let localValueOutput = valueNumber > 0 ? (localArgOutput - startTime.startTime) / valueNumber : 0;
      if (startTime && startTime.freezeTime != null) return Math.max(0, Math.min(1, startTime.freezeTime));
      if (startTime && startTime.speedCurve && typeof startTime.speedCurve.evaluate === "function") {
        localValueOutput = startTime.speedCurve.evaluate(localValueOutput);
      }
      if (startTime && startTime.reversed) localValueOutput = 1 - localValueOutput;
      return localValueOutput;
    }
    ['tt'](localHidden, localArgCached, argLocal) {
      if (localHidden.hidden || localHidden.re) return;
      let localScene = this.scene,
        te = this.te(localHidden, localArgCached, argLocal);
      if (Math.max(0, Math.min(1, te.alpha)) <= 0.002) return;
      let localIndex = Math.max(0, Math.min(1, te.alpha * this.We(localHidden, argLocal)));
      if (localIndex <= 0.002) return;
      let localNodeInitial = this.se(localHidden, localScene),
        localEntryTarget = this.workHeight / localScene.height,
        localRasterCtx = this.rasterCtx;
      localRasterCtx.setTransform(1, 0, 0, 1, 0, 0);
      let surfWidth = this.surfWidth,
        surfHeight = this.surfHeight;
      localRasterCtx.clearRect(0, 0, surfWidth, surfHeight), localRasterCtx.globalCompositeOperation = "source-over", localRasterCtx.globalAlpha = 1, localRasterCtx.save(), (this.padX || this.padY) && localRasterCtx.translate(this.padX, this.padY);
      let localEn = this.En(this.ae);
      this.Ce(localRasterCtx, localHidden, te, localEntryTarget, argLocal);
      if (this.G) {
        let layerMat = floatArray;
        let localOffset = (te.loc && te.loc.z) || 0;
        if (this.activeCamera && this.activeCamera.cameraType !== "orthographic" && localOffset !== 0) {
          let camZ = this.camZ || 500;
          let localEntryPrimary = Math.max(1, camZ - localOffset);
          let localCount = camZ / localEntryPrimary;
          let localValueOffset = this.camLoc ? this.camLoc[0] : (localScene.width / 2);
          let valueOffset = this.camLoc ? this.camLoc[1] : (localScene.height / 2);
          layerMat = [
            floatArray[0] * localCount,
            floatArray[1] * localCount,
            floatArray[2] * localCount,
            floatArray[3] * localCount,
            localValueOffset + (floatArray[4] - localValueOffset) * localCount,
            valueOffset + (floatArray[5] - valueOffset) * localCount
          ];
        }
        applyHelperLocal(localEn, this.k, layerMat);
      } else {
        for (let localEdge = 0; localEdge < 6; localEdge++) localEn[localEdge] = floatArray[localEdge];
      }
      localHidden.N = localScene, localHidden.B = Math.max(0, argLocal * 1000), localHidden.he = localHidden.endTime - localHidden.startTime;
      let localValueIndex = this.fe(localHidden, localNodeInitial),
        localValueCount = localValueIndex[0],
        valueCount = localValueIndex[1],
        localEntryInput = this.oe(localHidden) > 0 ? {
          m: [localEn[0], localEn[1], localEn[2], localEn[3], localEn[4], localEn[5]],
          w: localValueCount,
          h: valueCount
        } : null;
      if (updateHelperScoped(localEn, localValueCount, valueCount, this.workWidth, this.workHeight, this.oe(localHidden), this.padX, this.padY).empty) {
        localRasterCtx.restore();
        return;
      }
      let fbApplied = false;
      if (this.G && this.activeCamera && this.activeCamera.focusBlur && this.activeCamera.focusBlur.enabled) {
        let focusBlur = this.activeCamera.focusBlur;
        let localEntrySecondary = (te.loc && te.loc.z) || 0;
        let dist = Math.abs((this.camZ || 500) - localEntrySecondary);
        let fDist = focusBlur.distance != null ? focusBlur.distance : 500;
        let localEntryTertiary = focusBlur.depthOfField != null ? focusBlur.depthOfField : 100;
        let localEntryExtra = focusBlur.strength != null ? focusBlur.strength : 0.5;
        let delta = Math.abs(dist - fDist) - (localEntryTertiary / 2);
        if (delta > 0) {
          let blurPx = Math.min(25, (delta / 100) * localEntryExtra * 10);
          if (blurPx >= 0.5) {
            localRasterCtx.filter = "blur(" + blurPx.toFixed(1) + "px)";
            fbApplied = true;
          }
        }
      }
      let valueTwentieth = null;
      if (localHidden.tag === "embedScene" && localHidden.scene) {
        let round = Math.round(localValueCount),
          localLength = Math.round(valueCount),
          localEntryAlternate = Math.max(0, argLocal * 1000),
          rn = this.rn(localHidden, localHidden.scene, round, localLength, localEntryAlternate);
        if (rn) {
          let valueEnd = this.wn || (this.wn = [0, 0, 0, 0, 0, 0]);
          valueEnd[0] = localEn[0], valueEnd[1] = localEn[1], valueEnd[2] = localEn[2], valueEnd[3] = localEn[3], valueEnd[4] = localEn[4] + this.padX, valueEnd[5] = localEn[5] + this.padY, valueTwentieth = {
            at: rn.tex,
            m: valueEnd,
            w: round,
            h: localLength
          };
        } else this.Se(localHidden, localNodeInitial, localRasterCtx);
      } else {
        let localEntryOther = this.i ? performance.now() : 0;
        valueTwentieth = this.Se(localHidden, localNodeInitial, localRasterCtx), this.i && (this.i.raster += performance.now() - localEntryOther);
      }
      if (fbApplied) localRasterCtx.filter = "none";
      if (this.G && this.activeCamera && this.activeCamera.fog && this.activeCamera.fog.enabled) {
        let fog = this.activeCamera.fog;
        let localEntryAnother = (te.loc && te.loc.z) || 0;
        let dist = Math.abs((this.camZ || 500) - localEntryAnother);
        let localValueCenter = fog.nearZ != null ? fog.nearZ : 0;
        let localValueLength = fog.farZ != null ? fog.farZ : 500;
        if (localValueLength > localValueCenter && dist > localValueCenter) {
          let factor = Math.max(0, Math.min(1, (dist - localValueCenter) / (localValueLength - localValueCenter)));
          if (factor > 0.01) {
            localRasterCtx.save();
            localRasterCtx.globalCompositeOperation = "source-atop";
            let localValueItem = fog.color || [1, 1, 1, 1];
            localRasterCtx.fillStyle = "rgba(" + Math.round(localValueItem[0] * 255) + "," + Math.round(localValueItem[1] * 255) + "," + Math.round(localValueItem[2] * 255) + "," + (factor * 0.85).toFixed(3) + ")";
            localRasterCtx.fillRect(-localValueCount / 2, -valueCount / 2, localValueCount, valueCount);
            localRasterCtx.restore();
          }
        }
      }
      buildHelperByIndex(this.o, localEn, localValueCount, valueCount, this.workWidth, this.workHeight), localRasterCtx.restore();
      let localEntryOutput = this.i ? performance.now() : 0,
        localUn = this.un(localHidden, localArgCached, argLocal, surfWidth, surfHeight, te.xn, valueTwentieth, localEntryInput);
      this.i && (this.i.chain += performance.now() - localEntryOutput);
      let texture = localUn.texture;
      localUn.expanded && localUn.domain && (texture = this.ln(texture, localUn.domain, surfWidth, surfHeight));
      let valueIndex = processHelperClamped(localHidden.blendMode),
        localItem = localToken[valueIndex] ? valueIndex : null;
      localItem && (texture = this.mn(texture, localItem, surfWidth, surfHeight));
      let framebufferValue = this.gl;
      framebufferValue.bindFramebuffer(framebufferValue.FRAMEBUFFER, this.sceneTarget.fbo), framebufferValue.viewport(0, 0, surfWidth, surfHeight), framebufferValue.enable(framebufferValue.BLEND);
      let localDn = this.dn(localItem ? "normal" : localHidden.blendMode);
      framebufferValue.blendFunc(localDn[0], localDn[1]), framebufferValue.useProgram(this.blitProgram), this.E(this.blitAttribs), framebufferValue.activeTexture(framebufferValue.TEXTURE0), framebufferValue.bindTexture(framebufferValue.TEXTURE_2D, texture), this.blitUniforms.u_image && framebufferValue.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && framebufferValue.uniform1f(this.blitUniforms.u_alpha, localIndex), this.blitUniforms.u_transform && framebufferValue.uniformMatrix3fv(this.blitUniforms.u_transform, false, float32Array2), framebufferValue.drawArrays(framebufferValue.TRIANGLES, 0, 6), framebufferValue.disable(framebufferValue.BLEND);
    }
    ['Ce'](argCached, argOutput, localArgBorder, argBorder, localArgField) {
      let kn = this.kn(argOutput);
      if (!kn) return this.ct(argCached, localArgBorder, argBorder, floatArray), floatArray;
      floatArray[0] = 1, floatArray[1] = 0, floatArray[2] = 0, floatArray[3] = 1, floatArray[4] = 0, floatArray[5] = 0;
      let valueLength = argOutput.startTime + localArgField * 1000;
      for (let localStartTime of kn) {
        let localEntryFinal = localStartTime === argOutput ? localArgBorder : this.te(localStartTime, this.rt(localStartTime, valueLength), (valueLength - localStartTime.startTime) / 1000);
        this.ct(argCached, localEntryFinal, argBorder, float64Array2), applyHelperLocal(floatArray, floatArray, float64Array2);
      }
      return floatArray;
    }
    ['ct'](translate, transform, argMap, localArgClamped) {
      let localTransform = transform.transform,
        localValueWidth = localTransform.location.x * argMap,
        valueWidth = localTransform.location.y * argMap,
        localEnd = localTransform.scale.x || 0.0001,
        localValueMin = localTransform.scale.y || 0.0001,
        valueItem = localTransform.angle * Math.PI / 180,
        localCos = Math.cos(valueItem),
        localSin = Math.sin(valueItem),
        valueOutput = localTransform.skew && localTransform.skew.x || 0,
        localOutput = localTransform.skew && localTransform.skew.y || 0,
        valueCenter = (localTransform.pivot && localTransform.pivot.x || 0) * argMap,
        localCenter = (localTransform.pivot && localTransform.pivot.y || 0) * argMap;
      if (translate.translate(localValueWidth, valueWidth), localTransform.angle && translate.rotate(valueItem), (valueOutput || localOutput) && translate.transform(1, localOutput, valueOutput, 1, 0, 0), translate.scale(localEnd, localValueMin), (valueCenter || localCenter) && translate.translate(-valueCenter, -localCenter), localArgClamped) {
        let localHeight = -localEnd * valueCenter - valueOutput * localValueMin * localCenter,
          localValueHeight = -localOutput * localEnd * valueCenter - localValueMin * localCenter;
        localArgClamped[0] = localCos * localEnd - localSin * localOutput * localEnd, localArgClamped[1] = localSin * localEnd + localCos * localOutput * localEnd, localArgClamped[2] = localCos * valueOutput * localValueMin - localSin * localValueMin, localArgClamped[3] = localSin * valueOutput * localValueMin + localCos * localValueMin, localArgClamped[4] = localValueWidth + localCos * localHeight - localSin * localValueHeight, localArgClamped[5] = valueWidth + localSin * localHeight + localCos * localValueHeight;
      }
      return localArgClamped;
    }
    ['We'](localParentId, argField) {
      let localParentLayer = localParentId.parentLayer;
      if (!localParentLayer && localParentId.parentId && this.scene) {
        if (!this.scene.layerById) helperRaw(this.scene);
        localParentLayer = this.scene.layerById ? this.scene.layerById.get(localParentId.parentId) : null;
        if (localParentLayer) localParentId.parentLayer = localParentLayer;
      }
      let valueHeight = 1,
        localEntryInitial = 0;
      for (; localParentLayer && localEntryInitial++ < 16;) {
        let localValueAngle = localParentId.startTime + argField * 1000,
          localEntryPending = this.te(localParentLayer, this.rt(localParentLayer, localValueAngle), (localValueAngle - localParentLayer.startTime) / 1000);
        valueHeight *= localEntryPending.alpha;
        let next = localParentLayer.parentLayer;
        if (!next && localParentLayer.parentId && this.scene && this.scene.layerById) {
          next = this.scene.layerById.get(localParentLayer.parentId);
          if (next) localParentLayer.parentLayer = next;
        }
        localParentLayer = next;
      }
      return valueHeight;
    }
    ['En'](localArgEdge) {
      let ltKeyValue = this._e[localArgEdge];
      return ltKeyValue || (ltKeyValue = this._e[localArgEdge] = new Float32Array(6)), ltKeyValue;
    }
    ['et'](argEdge) {
      if (this.cameraViewEnabled === false) return this.G = false, this.activeCamera = null, false;
      let sceneValue = this.scene,
        cameraValue = refHelperMin(sceneValue, argEdge);
      if (!cameraValue) return this.G = false, this.activeCamera = null, false;
      let localCamera = cameraValue.camera;
      if (localCamera.hidden || (this.hiddenLayers && this.hiddenLayers.has(localCamera.id))) {
        return this.G = false, this.activeCamera = null, false;
      }
      let valueAngle = localCamera.endTime - localCamera.startTime,
        valueMin = valueAngle > 0 ? (argEdge - localCamera.startTime) / valueAngle : 0;
      valueMin < 0 ? valueMin = 0 : valueMin > 1 && (valueMin = 1);
      let localEntry = refHelper(localCamera.transform.location, valueMin, this.ht),
        camFov = localCamera.fov > 0 ? localCamera.fov : 60,
        orthographic = Math.max(0.001, Math.abs(localEntry[2])),
        localValueEntry = localCamera.cameraType === "orthographic"
          ? (localCamera.cameraZoom > 0 ? (localCamera.cameraZoom / 500) : 1)
          : (sceneValue.height / 2 / Math.tan(camFov * Math.PI / 360) / orthographic),
        localRadius = this.workHeight / sceneValue.height;
      let camScale = localCamera.transform && localCamera.transform.scale ? refHelper(localCamera.transform.scale, valueMin, this.ht) : [1, 1];
      localValueEntry *= (camScale[0] || 1);
      let camRot = (buildHelper(localCamera.transform.rotation, valueMin) || 0) * Math.PI / 180;
      let cCos = Math.cos(-camRot) * localValueEntry,
        cSin = Math.sin(-camRot) * localValueEntry;
      this.k[0] = cCos;
      this.k[1] = cSin;
      this.k[2] = -cSin;
      this.k[3] = cCos;
      let localEntryResolved = sceneValue.width / 2,
        localEntryConverted = sceneValue.height / 2,
        valueEntry = localEntry[0],
        localNode = localEntry[1];
      this.k[4] = (localEntryResolved - (valueEntry * cCos - localNode * cSin)) * localRadius;
      this.k[5] = (localEntryConverted - (valueEntry * cSin + localNode * cCos)) * localRadius;
      this.G = true;
      this.activeCamera = localCamera;
      this.camZ = orthographic;
      this.camLoc = [valueEntry, localNode, orthographic];
      this.camFov = camFov;
      return true;
    }
    ["renderAt"](timeMs) {
      if (!this.scene) return;
      let bindFramebufferValue = this.gl,
        localEntryDerived = this.i ? performance.now() : 0;
      this.i && this.xt(), this.R++, this.workWidth = this.baseWidth, this.workHeight = this.baseHeight, this.Mt(), this.timeMs = timeMs, this.stats = {
        layers: 0,
        passes: 0,
        videoUploads: 0,
        videoReuses: 0,
        videoPasses: 0,
        videoAudioOnly: 0
      }, this.sceneTarget = this.F(this.surfWidth, this.surfHeight, "scene:", true).a, bindFramebufferValue.bindFramebuffer(bindFramebufferValue.FRAMEBUFFER, this.sceneTarget.fbo), bindFramebufferValue.viewport(0, 0, this.surfWidth, this.surfHeight), bindFramebufferValue.disable(bindFramebufferValue.BLEND);
      let bgcolor = this.scene.bgcolor;
      bindFramebufferValue.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3]), bindFramebufferValue.clear(bindFramebufferValue.COLOR_BUFFER_BIT), this.et(timeMs);
      for (let localValueBase of this.scene.layers) {
        if (this.hiddenLayers && this.hiddenLayers.has(localValueBase.id)) continue;
        let localValueRadius = this.X(localValueBase, timeMs);
        localValueRadius !== null && (this.stats.layers++, this.tt(localValueBase, localValueRadius, (timeMs - localValueBase.startTime) / 1000));
      }
      this.$t(timeMs), this.De(), bindFramebufferValue.bindFramebuffer(bindFramebufferValue.FRAMEBUFFER, null), bindFramebufferValue.viewport(0, 0, this.workWidth, this.workHeight), bindFramebufferValue.disable(bindFramebufferValue.BLEND), bindFramebufferValue.useProgram(this.blitProgram), this.E(this.blitAttribs), bindFramebufferValue.activeTexture(bindFramebufferValue.TEXTURE0), bindFramebufferValue.bindTexture(bindFramebufferValue.TEXTURE_2D, this.sceneTarget.tex), this.blitUniforms.u_image && bindFramebufferValue.uniform1i(this.blitUniforms.u_image, 0), this.blitUniforms.u_alpha && bindFramebufferValue.uniform1f(this.blitUniforms.u_alpha, 1);
      let localPt = this.pt;
      localPt[0] = this.surfWidth / this.workWidth, localPt[1] = 0, localPt[2] = 0, localPt[3] = 0, localPt[4] = this.surfHeight / this.workHeight, localPt[5] = 0, localPt[6] = 0, localPt[7] = 0, localPt[8] = 1, this.blitUniforms.u_transform && bindFramebufferValue.uniformMatrix3fv(this.blitUniforms.u_transform, false, localPt), bindFramebufferValue.drawArrays(bindFramebufferValue.TRIANGLES, 0, 6), this.i && (this.i.frame += performance.now() - localEntryDerived, this.i.frames++), this.debugMode && this.Tn(timeMs);
    }
    ['Tn'](localArgSlot) {
      if (!this.scene || !this.scene.layers) return;
      let debugCanvas = this.debugCanvas;
      if (!debugCanvas || !this.canvas.getBoundingClientRect) return;
      let getBoundingClientRect = (debugCanvas.parentElement || debugCanvas).getBoundingClientRect(),
        localGetBoundingClientRect = this.canvas.getBoundingClientRect();
      if (!getBoundingClientRect.width || !localGetBoundingClientRect.width || !this.scene.height) return;
      let valueBase = Math.max(1, Math.min(3, typeof window < 'u' && window.devicePixelRatio || 1)),
        round = Math.round(getBoundingClientRect.width * valueBase),
        heightValue = Math.round(getBoundingClientRect.height * valueBase);
      (debugCanvas.width !== round || debugCanvas.height !== heightValue) && (debugCanvas.width = round, debugCanvas.height = heightValue);
      let ctx = debugCanvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height), ctx.save(), ctx.scale(valueBase, valueBase);
      let localValueNode = localGetBoundingClientRect.height / this.scene.height;
      ctx.translate(localGetBoundingClientRect.left - getBoundingClientRect.left, localGetBoundingClientRect.top - getBoundingClientRect.top), ctx.save(), ctx.strokeStyle = "rgba(255,255,255,0.55)", ctx.lineWidth = 1, ctx.setLineDash([6, 4]), ctx.strokeRect(0, 0, localGetBoundingClientRect.width, localGetBoundingClientRect.height), ctx.restore();
      let localEntryComputed = argSlot => argSlot,
        valueRadius = (layersArg, argPayload) => {
          if (!(!layersArg || !layersArg.layers)) for (let hiddenValue of layersArg.layers) {
            if (hiddenValue.hidden || hiddenValue.re || this.hiddenLayers && this.hiddenLayers.has(hiddenValue.id)) continue;
            let localScale = localArgSlot - argPayload,
              localValueScale = this.X(hiddenValue, localScale);
            if (localValueScale === null) continue;
            if (hiddenValue.tag === "embedScene" && hiddenValue.scene) {
              valueRadius(hiddenValue.scene, argPayload + (hiddenValue.startTime || 0));
              continue;
            }
            let valueScale = (localScale - hiddenValue.startTime) / 1000,
              alphaValue = this.te(hiddenValue, localValueScale, valueScale);
            if (Math.max(0, Math.min(1, alphaValue.alpha)) <= 0.002) continue;
            ctx.save(), this.Ce(ctx, hiddenValue, alphaValue, localValueNode, valueScale);
            let localSe = this.se(hiddenValue, layersArg),
              localZoom = localSe[0] * localValueNode,
              localValueZoom = localSe[1] * localValueNode,
              valueZoom = this.debugSelectedLayerId != null && (hiddenValue.id === this.debugSelectedLayerId || String(hiddenValue.id) === String(this.debugSelectedLayerId));
            ctx.strokeStyle = valueZoom ? "#ff3333" : "#00ff44", ctx.lineWidth = localEntryComputed(valueZoom ? 2.5 : 1.2), ctx.beginPath(), ctx.rect(-localZoom / 2, -localValueZoom / 2, localZoom, localValueZoom), ctx.stroke(), ctx.restore();
          }
        };
      valueRadius(this.scene, 0), ctx.restore();
    }
  },
  valueNested = null,
  valueType = 6;
function applyHelperOuter() {
  return valueNested || (valueNested = import("https://cdn.jsdelivr.net/npm/mediabunny@1.55.6/+esm")), valueNested;
}
var localKind = class localNodeCurrent {
    constructor({
      fps: fpsArg
    }, mb) {
      this.mb = mb, this.output = new mb.Output({
        format: new mb.Mp4OutputFormat(),
        target: new mb.BufferTarget()
      }), this.fps = fpsArg, this.videoSource = null, this.audioSource = null, this.U = Promise.resolve(), this.ne = null, this.lt = 0, this.ut = 0, this.dt = 0, this.ft = 0;
    }
    static async ["create"]({
      fps: localArgRecord
    }) {
      let localEntryStored = await applyHelperOuter();
      return new localNodeCurrent({
        fps: localArgRecord
      }, localEntryStored);
    }
    ["addVideoTrack"]() {
      this.videoSource = new this.mb.EncodedVideoPacketSource("avc"), this.output.addVideoTrack(this.videoSource, {
        frameRate: this.fps
      });
    }
    ["addAudioTrack"]() {
      this.audioSource = new this.mb.EncodedAudioPacketSource("aac"), this.output.addAudioTrack(this.audioSource);
    }
    async ["start"]() {
      await this.output.start();
    }
    ["queueFrame"](byteLength, jiValue) {
      this.lt++, this.dt += byteLength.byteLength;
      let fromEncodedChunk = this.mb.EncodedPacket.fromEncodedChunk(byteLength);
      return this.U = this.U.then(() => this.videoSource.add(fromEncodedChunk, jiValue)).catch(localArgHeader => {
        this.ne || (this.ne = localArgHeader);
      }), this.U;
    }
    ["queueAudioPacket"](localByteLength, argRecord) {
      this.ut++, this.ft += localByteLength.byteLength;
      let fromEncodedChunk = this.mb.EncodedPacket.fromEncodedChunk(localByteLength);
      return this.U = this.U.then(() => this.audioSource.add(fromEncodedChunk, argRecord)).catch(localNe => {
        this.ne || (this.ne = localNe);
      }), this.U;
    }
    get ["frameCount"]() {
      return this.lt;
    }
    get ["audioCount"]() {
      return this.ut;
    }
    get ["hasAudio"]() {
      return !!this.audioSource;
    }
    get ["byteLength"]() {
      return this.dt;
    }
    get ["audioByteLength"]() {
      return this.ft;
    }
    async ["drain"]() {
      if (await this.U, this.ne) throw this.ne;
    }
    ["cancel"]() {
      this.U = this.U.catch(() => {});
      try {
        if (this.output && typeof this.output.cancel == "function") return this.output.cancel();
      } catch {}
      return Promise.resolve();
    }
    async ["finish"]() {
      return await this.drain(), await this.output.finalize(), this.output.target.buffer;
    }
  },
  localValueKind = [{
    id: "h264",
    codec: "avc1.640033"
  }, {
    id: "h264",
    codec: "avc1.64002A"
  }, {
    id: "h264",
    codec: "avc1.4D0028"
  }, {
    id: "h264",
    codec: "avc1.42E01F"
  }];
var localValueSecondary = jnValue => new Promise(localArgBuffer => setTimeout(localArgBuffer, jnValue)),
  localMax = 48000;
var localNested = new Map(),
  localValueEmbedded = 0,
  valueKind = 96 * 1024 * 1024;
function helperScoped() {
  localNested.clear(), localValueEmbedded = 0;
}
async function helperEl(helperElArgValue, {
  sampleRate: refArgLocal = localMax,
  onProgress: helperElArg = () => {},
  isCancelled: refArgOuter = () => false
} = {}) {
  let helperElRecord = {
      ok: [],
      failed: []
    },
    helperElMap = new Map(),
    refMap = (helperElArgValue || []).filter(helperElUrl => helperElUrl && helperElUrl.url);
  if (typeof globalThis.OfflineAudioContext != "function") {
    for (let refUrl of refMap) helperElRecord.failed.push({
      url: refUrl.url,
      label: refUrl.label || "audio",
      reason: "OfflineAudioContext tidak ada di browser ini"
    });
    return helperElRecord;
  }
  let offlineAudioContext = new OfflineAudioContext(2, 1, refArgLocal),
    helperElNumber = 0;
  for (let refLabel of refMap) {
    if (refArgOuter()) break;
    helperElNumber++;
    let helperElValue = refLabel.label || "audio";
    if (helperElMap.has(refLabel.url)) {
      let errorValue = helperElMap.get(refLabel.url);
      (errorValue.error ? helperElRecord.failed : helperElRecord.ok).push(errorValue.error ? {
        url: refLabel.url,
        label: helperElValue,
        reason: errorValue.error
      } : {
        url: refLabel.url,
        label: helperElValue
      });
      continue;
    }
    let refNow = performance.now(),
      refValueOther = () => helperElArg({
        phase: "audio",
        stage: "preflight",
        message: "Memeriksa audio " + helperElNumber + '/' + refMap.length + ':\x20' + helperElValue + '\x20(' + Math.round((performance.now() - refNow) / 1000) + " dtk)"
      });
    refValueOther();
    let helperElBoundary = setInterval(refValueOther, 1000);
    try {
      let numberOfChannels = await failHelper(offlineAudioContext, refLabel.url, () => {}, {
        quick: true
      });
      if (numberOfChannels) {
        let refOther = numberOfChannels.length * numberOfChannels.numberOfChannels * 4;
        localValueEmbedded + refOther <= valueKind && (localNested.set(refLabel.url, numberOfChannels), localValueEmbedded += refOther);
      }
      helperElMap.set(refLabel.url, {}), helperElRecord.ok.push({
        url: refLabel.url,
        label: helperElValue
      });
    } catch (refValueAnother) {
      let helperElString = String(refValueAnother && refValueAnother.message || refValueAnother);
      helperElMap.set(refLabel.url, {
        error: helperElString
      }), helperElRecord.failed.push({
        url: refLabel.url,
        label: helperElValue,
        reason: helperElString
      });
    } finally {
      clearInterval(helperElBoundary);
    }
  }
  return helperElRecord;
}
var localGroup = /^(?:am|amproj|amres|amv):/i,
  localValueGroup = /\.(mp4|webm|mov|m4v|ogv)$/i,
  valueGroup = /\.(mp3|m4a|aac|wav|ogg|opus)$/i;
var localBatch = class {
  constructor() {
    this.refs = [], this.byName = new Map(), this.alias = new Map();
  }
  ["add"](ynCondition) {
    let ynValue = ynCondition && (ynCondition.url || ynCondition.src),
      localValueMax = ynCondition && (ynCondition.name || String(ynValue || '').split('/').pop());
    if (!ynValue || !localValueMax) return false;
    let localUrl = this.byName.get(localValueMax);
    if (localUrl) return localUrl.url = ynValue, false;
    let localProcess = processHelperInner(ynCondition.mime, localValueMax),
      ynResult = {
        name: localValueMax,
        url: ynValue,
        mime: String(ynCondition && ynCondition.mime || ''),
        kind: localProcess,
        isVideo: localProcess === "video",
        isAudio: localProcess === "audio"
      };
    this.refs.push(ynResult), this.byName.set(localValueMax, ynResult);
    for (let localBound of computeHelperStart(localValueMax)) this.alias.has(localBound) || this.alias.set(localBound, localValueMax);
    return true;
  }
  ["list"]() {
    return this.refs;
  }
  ["has"](argBuffer) {
    return this.byName.has(String(argBuffer ?? ''));
  }
  ["byFileName"](localArgToken) {
    return this.byName.get(String(localArgToken ?? '')) || null;
  }
  ["find"](argToken) {
    let trim = String(argToken ?? '').trim();
    if (!trim) return null;
    let localValueBound = this.byName.get(trim);
    if (localValueBound) return localValueBound;
    for (let localEntryCached of computeHelperStart(trim)) {
      let valueBound = this.alias.get(localEntryCached);
      if (valueBound) return this.byName.get(valueBound) || null;
    }
    return null;
  }
  ["candidates"](localArgSegment, argSegment) {
    let localEntryBorder = argSegment || new Set();
    return this.refs.filter(localArgCenter => localArgCenter.kind === localArgSegment && !localEntryBorder.has(localArgCenter.name));
  }
  ["clear"]() {
    this.refs = [], this.byName.clear(), this.alias.clear();
  }
};
var localRef = refHelperLocal(),
  contains = document.documentElement.classList.contains("simple"),
  valueEmbedded = "../preset/Beraksi.xml",
  valueOuter = "../preset/Beraksi.mp3",
  localValueCurrent = "../preset/",
  localValueToken = valueOuter,
  localOuter = valueOuter,
  localEmbedded = valueOuter.split('/').pop(),
  valueRaw = [{
    name: "Beraksi.mp3",
    src: valueOuter
  }],
  localMap = new Map([["Beraksi.mp3", valueOuter]]),
  mapValue = new Map(),
  logEl = document.getElementById("log"),
  stageEl = document.getElementById("stage"),
  subtitleEl = document.getElementById("subtitle"),
  statusEl = document.getElementById("status"),
  audiostateEl = document.getElementById("audioState"),
  timelabelEl = document.getElementById("timeLabel"),
  seekEl = document.getElementById("seek"),
  playEl = document.getElementById("play"),
  loopbtnEl = document.getElementById("loopBtn"),
  scaleEl = document.getElementById("scale"),
  scalelabelEl = document.getElementById("scaleLabel"),
  mediarowsEl = document.getElementById("mediaRows"),
  qualityEl = document.getElementById("quality"),
  reslabelEl = document.getElementById("resLabel"),
  viewEl = document.getElementById("view"),
  debugcanvasEl = document.getElementById("debugCanvas"),
  sizescaleEl = document.getElementById("sizeScale"),
  fpstargetEl = document.getElementById("fpsTarget"),
  fpscustomEl = document.getElementById("fpsCustom"),
  fpscustomrowEl = document.getElementById("fpsCustomRow"),
  syncStateEl = document.getElementById("syncState"),
  rateEl = document.getElementById("rate"),
  ratelabelEl = document.getElementById("rateLabel"),
  rateautoEl = document.getElementById("rateAuto"),
  pitchkeepEl = document.getElementById("pitchKeep"),
  offsetEl = document.getElementById("offset"),
  offsetlabelEl = document.getElementById("offsetLabel"),
  expresEl = document.getElementById("expRes"),
  expcodecEl = document.getElementById("expCodec"),
  expfpsEl = document.getElementById("expFps"),
  expfpscustomEl = document.getElementById("expFpsCustom"),
  expFpsCustomRowEl = document.getElementById("expFpsCustomRow"),
  expbitrateEl = document.getElementById("expBitrate"),
  expstartEl = document.getElementById("expStart"),
  expcancelEl = document.getElementById("expCancel"),
  expbarEl = document.getElementById("expBar"),
  expstatsEl = document.getElementById("expStats"),
  expresultEl = document.getElementById("expResult"),
  autoqualityEl = document.getElementById("autoQuality"),
  fxtoggleEl = document.getElementById("fxToggle"),
  perflabelEl = document.getElementById("perfLabel"),
  impxmlEl = document.getElementById("impXml"),
  impphotoEl = document.getElementById("impPhoto"),
  imppickEl = document.getElementById("impPick"),
  imppickrowEl = document.getElementById("impPickRow"),
  impresetEl = document.getElementById("impReset"),
  impstateEl = document.getElementById("impState"),
  urltiktokEl = document.getElementById("urlTiktok"),
  urltiktokgoEl = document.getElementById("urlTiktokGo"),
  urltiktokstaEl = document.getElementById("urlTiktokState"),
  urlamEl = document.getElementById("urlAm"),
  urlamgoEl = document.getElementById("urlAmGo"),
  urlamstateEl = document.getElementById("urlAmState"),
  urlampickEl = document.getElementById("urlAmPick"),
  urlampickrowEl = document.getElementById("urlAmPickRow"),
  urldriveEl = document.getElementById("urlDrive"),
  urldrivegoEl = document.getElementById("urlDriveGo"),
  urldrivestatEl = document.getElementById("urlDriveState"),
  urldriveaudiEl = document.getElementById("urlDriveAudio"),
  urlDriveAudioGoEl = document.getElementById("urlDriveAudioGo"),
  urlDriveAudioStateEl = document.getElementById("urlDriveAudioState"),
  photogalleryEl = document.getElementById("photoGallery"),
  looplabelEl = document.getElementById("loopLabel"),
  localValueByKey = (ptText, argCenter = '') => "<svg class=\"i " + argCenter + "\" aria-hidden=\"true\"><use href=\"#i-" + ptText + "\"/></svg>",
  eyeOff = {
    play: localValueByKey("play", 'sm'),
    pause: localValueByKey("pause", 'sm'),
    upload: localValueByKey("upload", 'sm'),
    eye: localValueByKey("eye"),
    eyeOff: localValueByKey("eyeoff")
  },
  valueToken = [...document.querySelectorAll(".tab-btn")],
  localValueBatch = ["proyek", "media", "audio", "layer", "ekspor"],
  fromEntries = Object.fromEntries(localValueBatch.map(saText => [saText, document.getElementById("pane-" + saText)])),
  panesEl = document.getElementById("panes"),
  timelinedockEl = document.getElementById("timelineDock"),
  matchMedia = window.matchMedia("(min-width: 900px) and (min-height: 620px)"),
  localValueTracked = "proyek";
function aHelper(aKey) {
  fromEntries[aKey] || (aKey = "proyek"), aKey === "layer" && matchMedia.matches && (aKey = "proyek"), localValueTracked = aKey;
  for (let [aHelperAValue, classList] of Object.entries(fromEntries)) aHelperAValue === "layer" && matchMedia.matches || classList.classList.toggle("active", aHelperAValue === aKey);
  for (let dataset of valueToken) {
    let aValue = dataset.dataset.tab === aKey;
    dataset.classList.toggle("active", aValue), dataset.setAttribute("aria-selected", aValue ? "true" : "false");
  }
  panesEl.scrollTop = 0, aKey === "layer" && requestAnimationFrame(() => buildHelperValue());
}
for (let addEventListener of valueToken) addEventListener.addEventListener("click", () => aHelper(addEventListener.dataset.tab));
var valueCurrent = [];
document.getElementById("copyLogBtn")?.["addEventListener"]("click", async currentTarget => {
  let localCurrentTarget = currentTarget.currentTarget,
    localSpan = valueCurrent.join('\x0a'),
    localValuePrimary = false;
  try {
    await navigator.clipboard.writeText(localSpan), localValuePrimary = true;
  } catch {}
  if (!localValuePrimary) {
    let textareaEl = document.createElement("textarea");
    textareaEl.value = localSpan, textareaEl.style.position = "fixed", textareaEl.style.opacity = '0', document.body.appendChild(textareaEl), textareaEl.select();
    try {
      localValuePrimary = document.execCommand("copy");
    } catch {
      localValuePrimary = false;
    }
    textareaEl.remove();
  }
  let localTextContent = localCurrentTarget.textContent;
  localCurrentTarget.textContent = localValuePrimary ? "Tersalin ✓" : "Gagal salin", setTimeout(() => {
    localCurrentTarget.textContent = localTextContent;
  }, 1500);
});
var stagebusyEl = document.getElementById("stageBusy"),
  busylabelEl = document.getElementById("busyLabel"),
  busydetailEl = document.getElementById("busyDetail"),
  busydismissEl = document.getElementById("busyDismiss"),
  localClamped = new Map(),
  isLoading = false,
  loadingMessage = '',
  pendingPlay = false,
  valueSecondary = false,
  videoBuildVersion = 0;
function processHelperParsed() {
  let processHelperParsedList = [...localClamped.values()];
  isLoading = processHelperParsedList.length > 0;
  let processHelperParsedValue = isLoading || !!loadingMessage;
  if (stagebusyEl.hidden = !processHelperParsedValue, stagebusyEl.classList.toggle("error", !!loadingMessage), loadingMessage) busylabelEl.textContent = "Gagal", busydetailEl.textContent = loadingMessage;else {
    if (processHelperParsedList.length) {
      let processLabel = processHelperParsedList[processHelperParsedList.length - 1];
      busylabelEl.textContent = processLabel.label;
      let processValueInner = processHelperParsedList.slice(0, -1).map(labelArg => '•\x20' + labelArg.label + (labelArg.detail ? ':\x20' + labelArg.detail : ''));
      busydetailEl.textContent = [processLabel.detail, ...processValueInner].filter(Boolean).join('\x0a');
    } else busydetailEl.textContent = '';
  }
  busydismissEl.hidden = !(loadingMessage || localClamped.has("video")), busydismissEl.textContent = loadingMessage ? "Tutup pesan" : "Putar tanpa menunggu", playEl.disabled = isLoading, playEl.title = isLoading ? "Tunggu loading selesai" : '', expstartEl.disabled = isLoading || isExporting, seekEl.disabled = isLoading, isLoading && isPlaying && (pendingPlay = true, requestPlayback(false), appendLog("[LOAD] Putar dihentikan karena masih ada proses loading.")), !isLoading && !loadingMessage && pendingPlay && projectScene && (pendingPlay = false, requestPlayback(true));
}
function getHelperValue(getHelperValueArg) {
  loadingMessage = String(getHelperValueArg || "kesalahan tidak diketahui"), isPlaying && requestPlayback(false), processHelperParsed();
}
busydismissEl.addEventListener("click", () => {
  if (loadingMessage) {
    loadingMessage = '', processHelperParsed();
    return;
  }
  valueSecondary = true;
  for (let readyStateValue of refHelperInner()) readyStateValue.readyState < 2 && weakSet.add(readyStateValue);
  pendingPlay = true, applyHelper("video");
});
var localCurrent = () => new Promise(cnValue => requestAnimationFrame(() => setTimeout(cnValue, 0)));
var amAudioEe = [],
  localSegment = new Map();
function renderHelperValue() {
  if (getHelperInner(), !projectScene) return 0;
  let renderRef = refHelperValue(projectScene, 0, []);
  for (let renderHelperValueNumber = 0; renderHelperValueNumber < renderRef.length; renderHelperValueNumber++) {
    let {
        layer: renderHelperValueRenderNumber,
        offsetMs: renderTarget
      } = renderRef[renderHelperValueNumber],
      {
        url: renderObj,
        name: renderValueInput
      } = objHelperRaw(renderHelperValueRenderNumber),
      renderHelperValueRaw = renderHelperValueRenderNumber.id || "audio-" + renderHelperValueNumber;
    if (!renderObj) {
      appendLog("[AUDIO] Layer \"" + (renderHelperValueRenderNumber.label || renderHelperValueRaw) + "\" tidak punya sumber yang bisa diputar.");
      continue;
    }
    let audio = new Audio(renderObj);
    audio.preload = "auto", audio.loop = false;
    let gainNode = null;
    try {
      if (!window.__AM_AUDIO_CTX) {
        const ACtx = window.AudioContext || window.webkitAudioContext;
        if (ACtx) window.__AM_AUDIO_CTX = new ACtx();
      }
      const actx = window.__AM_AUDIO_CTX;
      if (actx) {
        if (/^https?:\/\//i.test(renderObj)) {
          audio.crossOrigin = "anonymous";
        }
        const srcNode = actx.createMediaElementSource(audio);
        gainNode = actx.createGain();
        srcNode.connect(gainNode);
        gainNode.connect(actx.destination);
      }
    } catch(renderValueExtra) {}
    let renderHelperValueRecord = {
      id: renderHelperValueRaw,
      layer: renderHelperValueRenderNumber,
      offsetMs: renderTarget,
      el: audio,
      gainNode: gainNode,
      src: renderObj,
      label: renderValueInput || renderHelperValueRenderNumber.src,
      broken: false,
      ready: false,
      durationMs: 0
    };
    audio.addEventListener("error", () => {
      renderHelperValueRecord.broken = true, appendLog("[AUDIO] Gagal memuat \"" + renderHelperValueRecord.label + '\"' + (audio.error ? " kode " + audio.error.code : '') + "; layer ini senyap.");
    }), audio.addEventListener("loadedmetadata", () => {
      renderHelperValueRecord.durationMs = Number.isFinite(audio.duration) ? audio.duration * 1000 : 0, renderHelperValueRecord.ready = true;
    }), audio.load(), amAudioEe.push(renderHelperValueRecord), localSegment.set(renderHelperValueRaw, renderHelperValueRecord);
  }
  window.__AM_AUDIO_EE = amAudioEe;
  return valueSegment = amAudioEe.length > 0, appendLog("[AUDIO] " + amAudioEe.length + " layer audio scene (" + renderRef.length + " ditemukan, timeline project independen)."), amAudioEe.length;
}
function computeHelperClamped(computeHelperClampedArg, computeHelperClampedArgValue) {
  playbackRate = Math.min(1.5, Math.max(0.5, computeHelperClampedArg)), rateEl.value = String(playbackRate), updateHelperValue(rateEl), ratelabelEl.textContent = playbackRate.toFixed(3) + 'x', volume && (volume.playbackRate = playbackRate, volume.preservesPitch = pitchkeepEl.checked, "mozPreservesPitch" in volume && (volume.mozPreservesPitch = pitchkeepEl.checked), "webkitPreservesPitch" in volume && (volume.webkitPreservesPitch = pitchkeepEl.checked)), helperParsed(), buildHelperRaw(playheadMs), isDirty = true, renderHelperParsed(), computeHelperClampedArgValue || appendLog("[SYNC] Kecepatan audio " + playbackRate.toFixed(3) + "x (pitch " + (pitchkeepEl.checked ? "dipertahankan" : "ikut turun") + ')');
}
var projectScene = null,
  renderer = null,
  volume = null,
  localValueSegment = 0,
  hasMediaItems = false,
  valueSegment = false,
  mediaKeys = [],
  videoAudioSlots = [],
  playheadMs = 0,
  lastFrameMs = 0,
  lastRenderError = null,
  targetFps = 30,
  isDirty = true,
  lastRenderMs = 0,
  smoothedFrameMs = 0,
  lastQualityCheckMs = 0,
  recentFrameTimes = [],
  isPlaying = false,
  loopPlayback = true,
  audioLoadFailed = false,
  isScrubbing = false,
  lastStatusUpdateMs = 0,
  perfStatusText = "fps - | frame -",
  audioDriftMs = 0,
  isExporting = false,
  exportCancelled = false,
  exportBlobUrl = null,
  idle = "idle",
  localValueInner = '',
  playbackRate = 1,
  audioOffsetMs = 0,
  valueInner = null,
  localValue = [],
  map = new Map(),
  localValueScoped = new Map(),
  localNodePending = [],
  localRaw = new Map(),
  byFileName = new localBatch(),
  localSecondary = [],
  valueScoped = [],
  valueTracked = [],
  valueByKey = [],
  localValueTertiary = '',
  localByKey = valueEmbedded.split('/').pop(),
  localValueByIndex = -1,
  valueByIndex = null;
function getHelperStart(getArgParsed) {
  localNodePending = getArgParsed, updateHelperLocal();
}
function updateHelperLocal() {
  localRaw.clear();
  for (let updateByKey of localNodePending) localRaw.set(updateByKey.name, updateByKey);
  for (let updateValueByIndex of byFileName.list()) localRaw.set(updateValueByIndex.name, updateValueByIndex);
  let updateValuePrev = byFileName.list().filter(updateKind => updateKind.kind).map(updateHelperLocalArg => updateHelperLocalArg.name);
  localValue = [...new Set([...localNodePending.map(updateArgCount => updateArgCount.name), ...updateValuePrev])];
}
function computeHelperByKey() {
  localSecondary = [];
  let computeHelperByKeyValue = computeMedia => {
    for (let computeValuePrimary of computeMedia.media || []) localSecondary.push(computeValuePrimary);
    for (let computeValueNext of computeMedia.layers || []) computeValueNext.scene && computeHelperByKeyValue(computeValueNext.scene);
  };
  projectScene && computeHelperByKeyValue(projectScene);
}
function getPos() {
  let container = document.getElementById("am-preview-stage") || (typeof stageEl !== 'undefined' ? stageEl : null) || document.getElementById("stage");
  if (!container || typeof viewEl === 'undefined' || !viewEl) return;
  let getBoundingClientRect = container.getBoundingClientRect(),
    getPosValue = (viewEl.width && viewEl.height) ? (viewEl.width / viewEl.height) : (9 / 16),
    getposNumber = 24,
    getPosResult = Math.max(100, getBoundingClientRect.width - getposNumber),
    getPosMax = Math.max(100, getBoundingClientRect.height - getposNumber),
    getposValue = getPosMax * getPosValue;
  getposValue > getPosResult && (getposValue = getPosResult, getPosMax = getposValue / getPosValue);
  viewEl.style.width = Math.round(getposValue) + 'px';
  viewEl.style.height = Math.round(getPosMax) + 'px';
  let getposDebugcanvasEl = document.getElementById("debugCanvas");
  if (getposDebugcanvasEl) {
    getposDebugcanvasEl.style.width = viewEl.style.width;
    getposDebugcanvasEl.style.height = viewEl.style.height;
  }
  try {
    isDirty = true;
  } catch {}
}
window.addEventListener("resize", getPos), window.addEventListener("orientationchange", () => setTimeout(getPos, 150));
var valueBatch = /\.(mp4|webm|ogv|mov|m4v)$/i;
function computeHelperValue() {
  mediarowsEl.innerHTML = '';
  let slotCount = document.getElementById("slotCount"),
    computeValueLocal = projectScene.media.filter(computeArgEnd => {
      let toLowerCase = (computeArgEnd.type || '').toLowerCase();
      return toLowerCase.startsWith("audio") ? false : toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || !!computeArgEnd.uri;
    });
  if (slotCount && (slotCount.textContent = computeValueLocal.length ? computeValueLocal.length + " slot" : ''), contains && bindHelperMin(computeValueLocal), !computeValueLocal.length) {
    mediarowsEl.innerHTML = "<div class=\"empty\">Preset ini tidak memakai foto atau video.</div>";
    return;
  }
  computeValueLocal.forEach((computeUri, computeHelperValueArg) => {
    let startsWith = (computeUri.type || '').toLowerCase().startsWith("video"),
      divEl = document.createElement("div");
    divEl.className = "slot";
    let computeClassName = document.createElement("div");
    computeClassName.className = "thumb-holder";
    let computeHelperValueParsed = computeArgMap => {
        computeClassName.innerHTML = '', computeClassName.appendChild(handleHelperRaw(computeArgMap));
      },
      computeDivEl = document.createElement("div");
    computeDivEl.className = "slot-body";
    let computeAppendChild = document.createElement("div");
    computeAppendChild.className = "slot-title";
    let spanEl = document.createElement("span");
    spanEl.className = "badge" + (startsWith ? " video" : ''), spanEl.textContent = startsWith ? "Video" : "Gambar";
    let computeSpanEl = document.createElement("span");
    computeSpanEl.textContent = "Slot " + (computeHelperValueArg + 1), computeAppendChild.appendChild(spanEl), computeAppendChild.appendChild(computeSpanEl);
    let computeTextContent = document.createElement("div");
    computeTextContent.className = "slot-sub", computeTextContent.textContent = String(computeUri.uri || '').split('/').pop(), computeTextContent.title = computeUri.uri || '';
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "btn swap-btn", buttonEl.innerHTML = "<svg class=\"i sm\"><use href=\"#i-loop\"/></svg><span>Ganti media</span>";
    let computeHelperValueRaw = map.get(computeUri.uri) || localValue[0] || '',
      computePrimary = async computeArgParsed => {
        computeHelperValueRaw = computeArgParsed, map.set(computeUri.uri, computeArgParsed), computeHelperValueParsed(computeArgParsed), bindHelper(), await updateHelperRaw("media:pick", "Memuat " + computeArgParsed + '…', async () => {
          await applyHelperRaw(computeArgParsed), renderer.setImages(helperValue()), isDirty = true;
        });
      };
    map.set(computeUri.uri, computeHelperValueRaw), computeHelperValueParsed(computeHelperValueRaw), buttonEl.addEventListener("click", () => bind(computeHelperValueRaw, computePrimary, "Ganti media — Slot " + (computeHelperValueArg + 1))), computeDivEl.appendChild(computeAppendChild), computeDivEl.appendChild(computeTextContent), computeDivEl.appendChild(buttonEl), divEl.appendChild(computeClassName), divEl.appendChild(computeDivEl), mediarowsEl.appendChild(divEl);
  });
}
var mediapickerdEl = document.getElementById("mediaPickerDlg"),
  mediapickergEl = document.getElementById("mediaPickerGrid"),
  mediapickertEl = document.getElementById("mediaPickerTitle");
var localNumber = 112,
  camera = {
    image: {
      bg: "#1f6f9f",
      text: "#a6e3ff"
    },
    video: {
      bg: "#2d5fb0",
      text: "#b7d0ff"
    },
    audio: {
      bg: "#2a7a4b",
      text: "#a8f0c8"
    },
    text: {
      bg: "#7245a3",
      text: "#e2c6ff"
    },
    shape: {
      bg: "#3d4f9a",
      text: "#c1ceff"
    },
    camera: {
      bg: "#8c4414",
      text: "#ffd2b3"
    },
    embedScene: {
      bg: "#8a6a1f",
      text: "#ffe2a0"
    },
    default: {
      bg: "#3a3f55",
      text: "#c9cde0"
    }
  };
var valueTertiary = [],
  localRule = 26,
  localValueRule = 24;
var localNodeFinal = 3,
  localValueNext = false,
  textValue = null,
  valueNext = false,
  localNodeResolved = teValue => String(teValue).replace(/[&<>"']/g, teKey => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '\x22': "&quot;",
    '\x27': "&#39;"
  })[teKey]),
  localNext = (localArgLayer, argLayer) => String(localArgLayer.id || argLayer);
function getHelperRaw(getHelperRawArg, getHelperRawArgValue) {
  localNodeFinal = Math.min(20, Math.max(0.2, getHelperRawArg)), getHelperRawArgValue && (localValueNext = true);
  let tlZoom = document.getElementById("tl-zoom");
  tlZoom.value = String(localNodeFinal), updateHelperValue(tlZoom), document.getElementById("tl-zoom-label").textContent = localNodeFinal.toFixed(1) + 'x', projectScene && bindFlag();
}
function updateHelperList() {
  let updateGetEl = getEl();
  if (!projectScene || !updateGetEl || updateGetEl.clientWidth < 160) return false;
  let updateHelperListValue = updateGetEl.clientWidth - localNumber - 6;
  return localValueNext = false, getHelperRaw(updateHelperListValue / Math.max(1, projectScene.totalTime / 100), false), true;
}
function renderHelperLocal(renderArgScoped) {
  if (renderer) {
    renderer.hiddenLayers || (renderer.hiddenLayers = new Set()), renderer.hiddenLayers.has(renderArgScoped.id) ? renderer.hiddenLayers.delete(renderArgScoped.id) : renderer.hiddenLayers.add(renderArgScoped.id);
    try {
      handleHelper();
    } catch {}
    bindFlag(), isDirty = true;
  }
}
function applyFlag(applyFlagId, applyFlagArg) {
  textValue = applyFlagId ? localNext(applyFlagId, applyFlagArg) : null, renderer && (renderer.debugSelectedLayerId = applyFlagId ? applyFlagId.id : null), document.querySelectorAll(".tl-block").forEach(applyClassList => applyClassList.classList.toggle("tl-selected", textValue && applyClassList.dataset.key === textValue)), document.querySelectorAll(".tl-label").forEach(applyFlagClassList => applyFlagClassList.classList.toggle("sel", textValue && applyFlagClassList.dataset.key === textValue)), document.querySelectorAll(".st-row").forEach(applyFlagSecondArg => applyFlagSecondArg.classList.toggle("st-sel", textValue && applyFlagSecondArg.dataset.key === textValue));
  if (applyFlagId) bindElement(applyFlagId, applyFlagArg, applyFlagId.ce || 0); else helperLocal();
  isDirty = true;
  try { if (typeof window.omOnLayerSelected === "function") window.omOnLayerSelected(applyFlagId); } catch (applyValueByIndex) {}
}
var listValue = [],
  localValuePrev = [];
function getHelperParsed() {
  listValue = [...new Set(listValue.map(getHelperParsedArg => Math.round(Number(getHelperParsedArg) || 0)).filter(getArgClamped => getArgClamped >= 0))].sort((getArgScoped, getArgLocal) => getArgScoped - getArgLocal);
}
function updateHelperMap() {
  listValue = (projectScene && Array.isArray(projectScene.bookmarks) ? projectScene.bookmarks : []).slice(), getHelperParsed();
}
function elementHelper() {
  let timelineRuler = document.getElementById("timeline-ruler");
  let timelineTracks = document.getElementById("timeline-tracks");
  if (!timelineRuler) return;
  timelineRuler.querySelectorAll(".tl-bm-flag").forEach(remove => remove.remove());
  if (timelineTracks) timelineTracks.querySelectorAll(".tl-bm-line").forEach(bindRemove => bindRemove.remove());
  if (!projectScene) {
    localValuePrev = [];
    return;
  }
  let bindValuePrimary = computeHelperRaw();
  localValuePrev = [];
  for (let bindValueRaw of listValue) {
    let pxLeft = localNumber + Math.round(bindValueRaw * bindValuePrimary);
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "tl-bm-flag", buttonEl.style.left = pxLeft + 'px', buttonEl.dataset.time = buildRaw(bindValueRaw), buttonEl.dataset.ms = String(bindValueRaw), buttonEl.title = "Ke " + buildRaw(bindValueRaw) + " - klik kanan untuk membuang penanda", buttonEl.setAttribute("aria-label", buttonEl.title), buttonEl.addEventListener("click", bindStopPropagation => {
      bindStopPropagation.stopPropagation(), seekToTime(bindValueRaw), nHelper();
    }), buttonEl.addEventListener("contextmenu", preventDefault => {
      preventDefault.preventDefault(), preventDefault.stopPropagation();
      let indexOf = listValue.indexOf(bindValueRaw);
      indexOf >= 0 && listValue.splice(indexOf, 1);
      if (projectScene) projectScene.bookmarks = listValue.slice();
      elementHelper();
      appendLog("[BOOKMARK] Penanda " + buildRaw(bindValueRaw) + " dihapus.");
    }), timelineRuler.appendChild(buttonEl), localValuePrev.push(buttonEl);

    if (timelineTracks) {
      let lineEl = document.createElement("div");
      lineEl.className = "tl-bm-line";
      lineEl.style.left = pxLeft + 'px';
      lineEl.dataset.ms = String(bindValueRaw);
      timelineTracks.appendChild(lineEl);
    }
  }
  renderElement();
  if (typeof window.omOnBookmarksChanged === "function") window.omOnBookmarksChanged(listValue, playheadMs);
}
var localValueLayer = 0;
function applyHelperInner(applyArgMin) {
  if (!valueTertiary.length) return;
  let applyNow = performance.now();
  if (!(!applyArgMin && applyNow - localValueLayer < 250)) {
    localValueLayer = applyNow;
    for (let applyCanvas of valueTertiary) applyCanvas.canvas.isConnected && helperStart(applyCanvas.canvas, applyCanvas.source);
  }
}
function bindFlag() {
  let timelineTracks = document.getElementById("timeline-tracks"),
    timelineInner = document.getElementById("timeline-inner"),
    layersCount = document.getElementById("layers-count");
  if (!timelineTracks || !timelineInner) return;
  helperMap(), timelineTracks.innerHTML = '';
  let layersValue = objHelper(),
    bindLayers = layersValue.layers;
  if (!bindLayers.length) {
    timelineTracks.innerHTML = "<div class=\"empty\">Scene ini tidak punya layer.</div>", layersCount && (layersCount.textContent = ''), helperLocal();
    return;
  }
  valueTertiary = [];
  let bindFlagValue = projectScene.totalTime || 1;
  layersCount && (layersCount.textContent = bindLayers.length + " layer" + (localList.length ? " (scene " + localList.length + ')' : '')), renderer && !renderer.hiddenLayers && (renderer.hiddenLayers = new Set());
  let bindCompute = computeHelperRaw(),
    bindList = Math.max(160, Math.round(bindFlagValue * bindCompute));
  timelineInner.style.width = localNumber + bindList + 'px';
  let reverse = [...bindLayers].reverse(),
    layerValue = null;
  function bindHelperScoped(bindLayer, bindHelperScopedArg, bindArgValue, bindArgRaw) {
    let callbackValue = localNext(bindLayer, bindHelperScopedArg),
      bindApply = applyHelperClamped(bindLayer),
      bindHelperScopedValue = callbackValue === textValue;
    bindHelperScopedValue && (layerValue = {
      layer: bindLayer,
      xmlIndex: bindHelperScopedArg
    }), bindLayer.ce = bindArgRaw;
    let divEl = document.createElement("div");
    divEl.className = "tl-track" + (bindArgValue > 0 ? " tl-sub-track" : '');
    divEl.__layer = bindLayer;
    let divElValue = document.createElement("div");
    divElValue.className = "tl-label" + (bindApply ? " tl-hidden" : '') + (bindHelperScopedValue ? " sel" : '') + (bindArgValue > 0 ? " tl-sub-label" : ''), divElValue.dataset.key = callbackValue, divElValue.title = bindLayer.label || bindLayer.id || "Layer " + (bindHelperScopedArg + 1), bindArgValue > 0 && (divElValue.style.paddingLeft = bindArgValue * 14 + 'px');
    let buttonEl = document.createElement("button");
    if (buttonEl.type = "button", buttonEl.className = "tl-eye" + (bindApply ? " off" : ''), buttonEl.setAttribute("aria-label", bindApply ? "Tampilkan layer" : "Sembunyikan layer"), buttonEl.innerHTML = bindApply ? eyeOff.eyeOff : eyeOff.eye, buttonEl.addEventListener("click", stopPropagationArg => {
      stopPropagationArg.stopPropagation(), renderHelperLocal(bindLayer);
    }), divElValue.appendChild(buttonEl), getHelper(bindLayer)) {
      let bindValueOuter = localSet.has(callbackValue),
        bindButtonEl = document.createElement("button");
      bindButtonEl.type = "button", bindButtonEl.className = "tl-chev" + (bindValueOuter ? '' : " closed"), bindButtonEl.textContent = bindValueOuter ? '▾' : '▸', bindButtonEl.title = bindValueOuter ? "Tutup isi grup" : "Lihat isi grup", bindButtonEl.setAttribute("aria-label", bindButtonEl.title), bindButtonEl.addEventListener("click", bindArgCount => {
        bindArgCount.stopPropagation(), applyInner(callbackValue);
      }), divElValue.appendChild(bindButtonEl);
    }
    let spanEl = document.createElement("span");
    spanEl.className = "tl-thumb", spanEl.title = "Lihat isi layer di posisi ini";
    if (bindLayer.tag === "audio") {
      spanEl.innerHTML = `<img src="./icons/ac_ic_audio.svg" style="width:18px;height:18px;filter:brightness(0) invert(1) drop-shadow(0 0 2px #00ffa8);" alt="Audio">`;
      spanEl.addEventListener("click", bindArgTotal => {
        bindArgTotal.stopPropagation(), applyFlag(bindLayer, bindHelperScopedArg), seekToTime(bindRaw);
      });
    } else {
      let canvasEl = document.createElement("canvas");
      canvasEl.width = localRule, canvasEl.height = localValueRule, spanEl.appendChild(canvasEl);
      let bindBuild = helperList(bindLayer);
      helperStart(canvasEl, bindBuild), bindBuild && typeof bindBuild == "object" && (canvasEl.dataset.thumb = "live", valueTertiary.push({
        canvas: canvasEl,
        source: bindBuild
      })), spanEl.addEventListener("click", bindArgCurrent => {
        bindArgCurrent.stopPropagation(), applyFlag(bindLayer, bindHelperScopedArg), seekToTime(bindRaw);
      });
    }
    divElValue.appendChild(spanEl);
    let bindValueMap = document.createElement("span");
    bindValueMap.textContent = bindLayer.label || bindLayer.id || 'L' + (bindHelperScopedArg + 1), divElValue.appendChild(bindValueMap);
    let bindStyle = document.createElement("div");
    bindStyle.className = "tl-canvas-area", bindStyle.style.width = bindList + 'px';
    let bindRaw = bindArgRaw + (bindLayer.startTime || 0),
      bindLocal = bindArgRaw + (bindLayer.endTime || bindFlagValue),
      bindPrimary = Math.max(0, bindLocal - bindRaw),
      round = Math.round(bindRaw * bindCompute),
      bindMax = Math.max(4, Math.round(bindPrimary * bindCompute)),
      bindProcess = processHelperScoped(bindLayer),
      bindDivEl = document.createElement("div");
    bindDivEl.className = "tl-block" + (bindApply ? " tl-hidden-block" : '') + (bindHelperScopedValue ? " tl-selected" : '') + (bindArgValue > 0 ? " tl-sub-block" : '') + (bindLayer.tag === "audio" ? " tl-audio-block" : ''), bindDivEl.dataset.key = callbackValue;
    let bindValueSecondary = bindArgValue > 0 ? bindProcess.bg + 'bb' : bindProcess.bg;
    bindDivEl.style.cssText = "left:" + round + "px;width:" + bindMax + "px;background:" + bindValueSecondary + ";color:" + bindProcess.text + ';';
    let setDrop = dataTransfer => {
        if (!dataTransfer || !dataTransfer.dataTransfer || ![...dataTransfer.dataTransfer.types].includes("Files")) return;
        dataTransfer.preventDefault(), dataTransfer.dataTransfer.dropEffect = "copy", divEl.classList.add("tl-drop");
      },
      clearDrop = () => divEl.classList.remove("tl-drop"),
      dropReplace = bindDataTransfer => {
        clearDrop(), localValueEl = 0, document.body.classList.remove("dragging");
        if (!bindDataTransfer || !bindDataTransfer.dataTransfer) return;
        let bindValueCount = [...(bindDataTransfer.dataTransfer.files || [])];
        if (!bindValueCount.length || bindLayer.fillType !== "media") return;
        let bindValueExtra = bindLayer.fillVideo || bindLayer.fillImage,
          bindExtra = (projectScene.media || []).find(bindArgNext => bindArgNext.uri === bindValueExtra);
        if (!bindExtra) return;
        bindDataTransfer.preventDefault(), bindDataTransfer.stopPropagation(), replaceMediaForLayer(bindLayer, bindValueCount[0]);
      };
    for (let el of [divEl, divElValue, bindDivEl, spanEl]) el.addEventListener("dragover", setDrop), el.addEventListener("dragleave", clearDrop), el.addEventListener("drop", dropReplace);
    let textContentValue = bindLayer.label || bindLayer.id || '';
    if (bindLayer.tag === "audio") {
      let durSec = Math.max(0, ((bindLayer.endTime || 0) - (bindLayer.startTime || 0)) / 1000);
      let mins = Math.floor(durSec / 60);
      let secs = Math.floor(durSec % 60);
      let timeStr = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
      bindDivEl.innerHTML = `
        <div class="tl-audio-header">
          <span class="tl-audio-title">${localNodeResolved(textContentValue)}</span>
          <span class="tl-audio-dur">[${timeStr}]</span>
        </div>
        <svg class="tl-audio-waveform-svg" viewBox="0 0 ${Math.max(50, bindMax)} 28" preserveAspectRatio="none">
          ${renderWaveformSvgBars(bindLayer, Math.max(50, bindMax), 28)}
        </svg>
      `;
      bindDivEl.title = `${textContentValue} [${timeStr}]`;
      let { url: aUrl } = objHelperRaw(bindLayer);
      if (aUrl && !bindLayer.peaks) decodeAudioPeaks(bindLayer, aUrl);
    } else {
      bindMax > 28 ? bindDivEl.textContent = textContentValue : bindDivEl.title = textContentValue;
    }
    let bindSort = sort(bindLayer, bindRaw, bindLocal),
      bindSecondary = bindSort.length > 60 ? bindSort.filter((bindArgEdge, bindHelperScopedArgValue) => bindHelperScopedArgValue % Math.ceil(bindSort.length / 60) === 0) : bindSort;
    for (let bindOuter of bindSecondary) {
      let bindValueInner = Math.round((bindOuter - bindArgRaw) * bindCompute) - round;
      if (bindValueInner < 0 || bindValueInner > bindMax) continue;
      let bindHelperScopedIEl = document.createElement('i');
      bindHelperScopedIEl.className = "tl-kf" + (bindOuter <= bindRaw || bindOuter >= bindLocal ? " tl-kf-edge" : ''), bindHelperScopedIEl.style.left = bindValueInner + 'px', bindDivEl.appendChild(bindHelperScopedIEl);
    }
    let bindMap = bindArgRaw,
      bindValueTertiary = bindLayer.startTime || 0,
      bindTertiary = bindLayer.endTime != null ? bindLayer.endTime : (projectScene.totalTime || 0),
      mkEdge = (mkedgeText, side) => {
        let edgeEl = document.createElement("i");
        edgeEl.className = "tl-edge " + mkedgeText;
        edgeEl.title = side === "r" ? "Geser akhir layer" : "Geser awal layer";
        edgeEl.addEventListener("click", bindArgPrev => bindArgPrev.stopPropagation());
        edgeEl.addEventListener("pointerdown", button => {
          if (button.button != null && button.button !== 0) return;
          button.preventDefault(), button.stopPropagation();
          try { edgeEl.setPointerCapture(button.pointerId); } catch {}
          let snapBefore = sceneSnapshot();
          let clientX = button.clientX, bindInner = computeHelperRaw(), mkedgeValue = bindLayer.startTime || bindValueTertiary,
            bindEndTime = bindLayer.endTime != null ? bindLayer.endTime : bindTertiary, moved = false;
          let applyLive = () => {
            bindDivEl.style.left = Math.round((bindMap + (bindLayer.startTime || 0)) * bindInner) + 'px';
            bindDivEl.style.width = Math.max(4, Math.round(((bindLayer.endTime || 0) - (bindLayer.startTime || 0)) * bindInner)) + 'px';
          };
          let onMove = bindClientX => {
            let onmoveValue = (bindClientX.clientX - clientX) / bindInner;
            moved = Math.abs(bindClientX.clientX - clientX) > 2;
            if (side === "r") bindLayer.endTime = Math.max(mkedgeValue + 100, bindEndTime + onmoveValue);
            else bindLayer.startTime = Math.max(0, Math.min(bindEndTime - 100, mkedgeValue + onmoveValue));
            moved && applyLive();
          };
          let onUp = () => {
            window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp), window.removeEventListener("pointercancel", onUp);
            if (!moved) {
              bindLayer.startTime = mkedgeValue, bindLayer.endTime = bindEndTime;
              return;
            }
            pushUndo(snapBefore);
            isDirty = true;
            omExtendTotal(Math.max(bindLayer.startTime || 0, bindLayer.endTime || 0));
            appendLog("[EDIT] Layer \"" + (bindLayer.label || bindLayer.id) + "\" durasi " + Math.round(mkedgeValue) + "→" + Math.round(bindEndTime) + " ms  (" + Math.round(bindLayer.startTime) + "–" + Math.round(bindLayer.endTime) + " ms)");
            bindFlag(), renderer && renderer.renderAt(playheadMs);
          };
          window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp), window.addEventListener("pointercancel", onUp);
        }, { passive: false });
        return edgeEl;
      };
    bindDivEl.appendChild(mkEdge("tl-edge-l", "l")), bindDivEl.appendChild(mkEdge("tl-edge-r", "r"));
    bindDivEl.addEventListener("pointerdown", bindButton => {
      if (bindButton.button != null && bindButton.button !== 0) return;
      if (bindButton.target && bindButton.target.classList && bindButton.target.classList.contains("tl-edge")) return;
      let snapT = sceneSnapshot(), clientXValue = bindButton.clientX, scaleT = computeHelperRaw(),
        bindCount = bindLayer.startTime || 0, bindValueAlternate = bindLayer.endTime != null ? bindLayer.endTime : (projectScene.totalTime || 0), moved = false;
      const onMove = clientXArg => {
        let bindValueStart = clientXArg.clientX - clientXValue;
        if (!moved && Math.abs(bindValueStart) < 5) return;
        moved = Math.abs(bindValueStart) >= 5;
        if (!moved) return;
        let bindAlternate = bindValueAlternate - bindCount,
          bindStart = Math.max(0, bindCount + bindValueStart / scaleT);
        bindLayer.startTime = bindStart, bindLayer.endTime = bindStart + bindAlternate;
        bindDivEl.style.left = Math.round((bindMap + bindStart) * scaleT) + "px";
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp);
        if (!moved) return;
        pushUndo(snapT), isDirty = true;
        omExtendTotal(Math.max(bindLayer.startTime || 0, bindLayer.endTime || 0));
        appendLog("[EDIT] Layer \"" + (bindLayer.label || bindLayer.id) + "\" dipindah ke " + Math.round(bindLayer.startTime) + " ms");
        bindFlag(), renderer && renderer.renderAt(playheadMs);
      };
      window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp);
    }, { passive: false });
    divElValue.addEventListener("pointerdown", buttonArg => {
      if (buttonArg.button != null && buttonArg.button !== 0) return;
      if (buttonArg.target && buttonArg.target.closest && buttonArg.target.closest("button, .tl-thumb, .tl-edge")) return;
      let snapT = sceneSnapshot(), clientY = buttonArg.clientY, active = false;
      const onMove = bindClientY => {
        let bindValueTotal = bindClientY.clientY - clientY;
        if (!active && Math.abs(bindValueTotal) < 7) return;
        if (!active) {
          active = true, divEl.classList.add("tl-reorder"), divEl.style.zIndex = "6";
        }
        divEl.style.transform = "translateY(" + bindValueTotal + "px)";
      };
      const onUp = clientYArg => {
        window.removeEventListener("pointermove", onMove), window.removeEventListener("pointerup", onUp);
        divEl.classList.remove("tl-reorder"), divEl.style.transform = "", divEl.style.zIndex = "";
        if (!active) return;
        let bindFindParentArray = findParentArray(bindLayer);
        if (!bindFindParentArray || bindFindParentArray.length < 2) return;
        let rows = [...document.querySelectorAll(".tl-track")].filter(layerArg => layerArg.__layer && findParentArray(layerArg.__layer) === bindFindParentArray && layerArg !== divEl);
        if (!rows.length) return;
        let onupNumber = 0;
        for (; onupNumber < rows.length; onupNumber++) {
          let bindGetBoundingClientRect = rows[onupNumber].getBoundingClientRect();
          if (clientYArg.clientY < bindGetBoundingClientRect.top + bindGetBoundingClientRect.height / 2) break;
        }
        let domOrder = rows.map(bindArgSource => bindArgSource.__layer);
        domOrder.splice(onupNumber, 0, bindLayer);
        let newArr = domOrder.slice().reverse().filter(bindArgTarget => bindFindParentArray.indexOf(bindArgTarget) >= 0);
        bindFindParentArray.forEach(bindArgMax => {
          newArr.indexOf(bindArgMax) < 0 && newArr.push(bindArgMax);
        });
        if (newArr.length !== bindFindParentArray.length) return;
        let oldIdx = bindFindParentArray.indexOf(bindLayer), newIdx = newArr.indexOf(bindLayer);
        if (oldIdx === newIdx) return;
        pushUndo(snapT), bindFindParentArray.splice(0, bindFindParentArray.length, ...newArr), isDirty = true;
        appendLog("[EDIT] Layer \"" + (bindLayer.label || bindLayer.id) + "\" urutan " + (oldIdx + 1) + " → " + (newIdx + 1));
        bindFlag(), renderer && renderer.renderAt(playheadMs);
      };
      window.addEventListener("pointermove", onMove), window.addEventListener("pointerup", onUp);
    }, { passive: false });
    bindDivEl.addEventListener("dblclick", bindTarget => {
      if (bindTarget.target && bindTarget.target.classList && bindTarget.target.classList.contains("tl-edge")) return;
      if (getHelper(bindLayer)) {
        bindTarget.preventDefault(), computeHelperParsed(bindLayer);
      }
    });
    divElValue.addEventListener("dblclick", bindPreventDefault => {
      if (bindPreventDefault.target && bindPreventDefault.target.closest && bindPreventDefault.target.closest("button, .tl-thumb")) return;
      if (getHelper(bindLayer)) {
        bindPreventDefault.preventDefault(), computeHelperParsed(bindLayer);
      }
    });
    bindSort.length && (bindDivEl.title = textContentValue + " - " + bindSort.length + " keyframe"), bindDivEl.addEventListener("click", () => applyFlag(bindLayer, bindHelperScopedArg)), divElValue.addEventListener("click", () => {
      applyFlag(bindLayer, bindHelperScopedArg), seekToTime(bindRaw);
    }), bindStyle.appendChild(bindDivEl), divEl.appendChild(divElValue), divEl.appendChild(bindStyle), timelineTracks.appendChild(divEl), getHelper(bindLayer) && localSet.has(callbackValue) && [...bindLayer.scene.layers].reverse().forEach((bindArgInput, bindArgOutput) => {
      let bindValueOther = bindLayer.scene.layers.length - 1 - bindArgOutput;
      bindHelperScoped(bindArgInput, bindValueOther, bindArgValue + 1, bindRaw);
    });
  }
  reverse.forEach((bindArgPrimary, bindArgSecondary) => {
    let bindOther = bindLayers.length - 1 - bindArgSecondary;
    bindHelperScoped(bindArgPrimary, bindOther, 0, layersValue.offsetMs);
  }), handleHelperByIndex(), elementHelper(), applyHelperInner(), layerValue ? bindElement(layerValue.layer, layerValue.xmlIndex) : helperLocal();
}
var localList = [],
  localSet = new Set();
var localTertiary = [],
  valuePrev = null,
  localTracked = 0;
function bindElement(bindStartTime, bindElementArgValue, bindArg = 0) {
  let layerInfo = document.getElementById("layer-info");
  if (!layerInfo || !projectScene) return;
  localTertiary = [], valuePrev = bindStartTime, localTracked = bindElementArgValue;
  let bindObj = objHelper(),
    bindValueAnother = bindObj.scene && bindObj.scene.totalTime ? bindObj.scene.totalTime : projectScene.totalTime || 1,
    bindElementValue = bindStartTime.startTime || 0,
    bindMin = bindStartTime.endTime || bindValueAnother,
    bindBg = processHelperScoped(bindStartTime),
    bindElementBindValue = bindStartTime.fillVideo || bindStartTime.fillImage || '',
    bindValueNext = bindElementBindValue ? processHelperValue(map.get(bindElementBindValue) || bindElementBindValue) : null,
    bindValueMax = bindElementBindValue && (map.get(bindElementBindValue) || bindValueNext && bindValueNext.name) || '',
    bindAnother = applyHelperClamped(bindStartTime),
    bindNext = bindArg > 0 || localList.length > 0,
    bindItems = itemsHelper(bindStartTime),
    bindElementList = [["Urutan", bindElementArgValue + 1 + " dari " + bindObj.layers.length + (localList.length ? " (scene " + localList.length + ')' : '')], ["Jenis", bindStartTime.tag || '-'], ["Isi", bindStartTime.fillType || '-'], ["Mulai", (bindElementValue / 1000).toFixed(2) + 's' + (bindNext ? " (lokal)" : '')], ["Selesai", (bindMin / 1000).toFixed(2) + 's' + (bindNext ? " (lokal)" : '')], ["Durasi", ((bindMin - bindElementValue) / 1000).toFixed(2) + 's'], ["Blend", bindStartTime.blendMode && bindStartTime.blendMode !== "normal" ? bindStartTime.blendMode : "normal"]];
  if (bindStartTime.shapeType && bindStartTime.shapeType !== ".rect" && bindElementList.push(["Bentuk", bindStartTime.shapeType]), bindStartTime.tag === "text" && bindElementList.push(["Teks", (bindStartTime.textContent || '').slice(0, 140) || '-']), (bindStartTime.inTime || bindStartTime.outTime) && bindElementList.push(["Potong sumber", (bindStartTime.inTime || 0) / 1000 + "s - " + (bindStartTime.outTime || 0) / 1000 + 's']), bindElementBindValue && bindElementList.push([bindStartTime.fillVideo ? "Video" : "Gambar", bindValueMax || bindElementBindValue]), bindStartTime.fillAudio && bindElementList.push(["Audio", bindStartTime.fillAudio]), bindStartTime.tag === "audio") {
    let slice = (bindStartTime.src || '').replace(/^content:\/\/.*\//, '').replace(/^am:/, "am:").slice(0, 60);
    bindElementList.push(["Sumber audio", slice || '-']), (bindStartTime.inTime || bindStartTime.outTime) && bindElementList.push(["Potong audio", (bindStartTime.inTime || 0) / 1000 + "s → " + (bindStartTime.outTime || 0) / 1000 + 's']);
  }
  let bindText = null,
    bindValueByKey = false;
  if (bindStartTime.tag === "text") {
    let bindValueScoped = bindStartTime.font || '';
    if (bindValueScoped.includes("imported?name=")) {
      let match = bindValueScoped.match(/name=([^&]+)/);
      match && (bindText = decodeURIComponent(match[1]).replace(/\.[^/.]+$/, ''), bindValueByKey = renderer && renderer.customFonts && (renderer.customFonts.has(bindText) || renderer.customFonts.has(match[1])), bindElementList.push(["Font", '\x22' + bindText + '\x22\x20' + (bindValueByKey ? "(Font kustom aktif)" : "(Font kustom — perlu diimport)")]));
    } else bindValueScoped && bindElementList.push(["Font", bindValueScoped]);
  }
  let bindValueFinal = getHelper(bindStartTime) ? "<div class=\"li-group\"><div class=\"li-group-head\"><span>Isi grup</span><b>" + bindStartTime.scene.layers.length + " layer</b></div></div>" : '',
    bindFinal = bindItems.length ? "<div class=\"li-fx\">" + bindItems.map((bindParams, bindElementArg) => "\n              <div class=\"li-fx-item\" data-fx-idx=\"" + bindElementArg + "\">\n                <div class=\"li-fx-name\">\n                  <label class=\"check\" style=\"margin:0;font-size:inherit;display:inline-flex;align-items:center;gap:4px\">\n                    <input type=\"checkbox\" class=\"fx-toggle-cb\" data-fx-i=\"" + bindElementArg + '\x22\x20' + (bindStartTime.effects[bindElementArg] && (bindStartTime.effects[bindElementArg].disabled || bindStartTime.effects[bindElementArg].hidden === true || bindStartTime.effects[bindElementArg].hidden === "true") ? '' : "checked") + ">\n                    <span>" + localNodeResolved(bindParams.name) + "</span>\n                  </label>\n                  <span class=\"li-fx-state\" data-state=\"" + bindElementArg + "\"></span>\n                </div>\n                " + (bindParams.params.length ? "<div class=\"li-fx-params\">" + bindParams.params.map((bindEdge, bindElementArgRaw) => "<span data-pi=\"" + bindElementArg + ':' + bindElementArgRaw + "\"></span>").join(" · ") + "</div>" : '') + "\n              </div>").join('') + "</div>" : '';
  layerInfo.innerHTML = "\n        <div class=\"li-head\"><span class=\"li-dot\" style=\"background:" + bindBg.bg + "\"></span><strong>" + localNodeResolved(bindStartTime.label || bindStartTime.id || "Layer") + "</strong></div>\n        <div class=\"li-thumb\"></div>\n        <table class=\"li-table\">" + bindElementList.map(([bindArgFinal, bindArgInitial]) => "<tr><td>" + localNodeResolved(bindArgFinal) + "</td><td>" + localNodeResolved(bindArgInitial) + "</td></tr>").join('') + "</table>\n        " + bindValueFinal + "\n        " + bindFinal + "\n        <div class=\"li-actions\">\n            " + (helperEnd() ? "<button type=\"button\" class=\"btn sm primary\" data-act=\"addFx\">+ Tambah Efek</button>" : '') + "\n            <button type=\"button\" class=\"btn sm\" data-act=\"seek\">Ke awal layer</button>\n            <button type=\"button\" class=\"btn sm\" data-act=\"toggle\">" + (bindAnother ? "Tampilkan layer" : "Sembunyikan layer") + "</button>\n            " + (bindElementBindValue ? "<button type=\"button\" class=\"btn sm\" data-act=\"replaceMedia\">Ganti media</button>" : '') + "\n            " + (helperEnd() ? "<button type=\"button\" class=\"btn sm\" data-act=\"viewXml\">Lihat XML</button>" : '') + "\n            " + (bindText ? "<button type=\"button\" class=\"btn sm primary\" data-act=\"uploadFont\" data-font=\"" + localNodeResolved(bindText) + '\x22>' + (bindValueByKey ? "Ganti Font" : "Import Font (.ttf/.otf)") + "</button>" : '') + "\n            " + (getHelper(bindStartTime) ? "<button type=\"button\" class=\"btn sm\" data-act=\"open\">Buka grup</button>" : '') + "\n        </div>";
  let querySelector = layerInfo.querySelector("[data-act=\"addFx\"]");
  querySelector && querySelector.addEventListener("click", () => getElement(bindStartTime, bindElementArgValue, bindArg));
  let liThumbEl = layerInfo.querySelector(".li-thumb");
  bindValueMax ? liThumbEl.appendChild(handleHelperRaw(bindValueMax, "thumb lg")) : liThumbEl.remove(), layerInfo.querySelector("[data-act=\"seek\"]").addEventListener("click", () => seekToTime(bindArg + bindElementValue)), layerInfo.querySelector("[data-act=\"toggle\"]").addEventListener("click", () => renderHelperLocal(bindStartTime));
  let dataActOpenEl = layerInfo.querySelector("[data-act=\"open\"]");
  dataActOpenEl && dataActOpenEl.addEventListener("click", () => computeHelperParsed(bindStartTime));
  let dataActReplaceMediaEl = layerInfo.querySelector("[data-act=\"replaceMedia\"]");
  dataActReplaceMediaEl && dataActReplaceMediaEl.addEventListener("click", () => {
    let bindValueInitial = map.get(bindElementBindValue) || bindElementBindValue;
    bind(bindValueInitial, bindArgScoped => {
      let bindFillVideo = "am:user:" + Date.now() + ":" + Math.floor(Math.random() * 1e5);
      map.set(bindFillVideo, bindArgScoped);
      if (!projectScene.media) projectScene.media = [];
      projectScene.media.push({ uri: bindFillVideo, filename: bindArgScoped, title: bindArgScoped, type: "image/png" });
      if (bindStartTime.fillVideo) { bindStartTime.fillVideo = bindFillVideo; bindStartTime.fillImage = ''; }
      else { bindStartTime.fillImage = bindFillVideo; bindStartTime.fillVideo = ''; }
      renderer && renderer.setImages(helperValue()), isDirty = true, appendLog("[MEDIA] Layer \"" + (bindStartTime.label || bindStartTime.id) + "\" memakai media \"" + bindArgScoped + '\" (khusus kelompok/layer ini).'), bindElement(bindStartTime, bindElementArgValue, bindArg);
    }, "Ganti media — " + (bindStartTime.label || bindStartTime.id || "layer"));
  });
  let dataActViewXmlEl = layerInfo.querySelector("[data-act=\"viewXml\"]");
  dataActViewXmlEl && dataActViewXmlEl.addEventListener("click", () => {
    let layerXmlDlg = document.getElementById("layerXmlDlg"),
      layerXmlBody = document.getElementById("layerXmlBody"),
      layerXmlTitle = document.getElementById("layerXmlTitle");
    layerXmlTitle && (layerXmlTitle.textContent = "XML — " + (bindStartTime.label || bindStartTime.id || bindStartTime.tag)), layerXmlBody && (layerXmlBody.textContent = bindStartTime.sourceXml || "(sumber XML tidak tersedia)"), layerXmlDlg && layerXmlDlg.showModal && layerXmlDlg.showModal();
  }), layerInfo.querySelectorAll(".fx-toggle-cb").forEach(bindAddEventListener => {
    bindAddEventListener.addEventListener("change", bindArgByIndex => {
      let bindElementNumber = Number(bindArgByIndex.target.dataset.fxI);
      if (bindStartTime.effects && bindStartTime.effects[bindElementNumber]) {
        let bindDisabled = !bindArgByIndex.target.checked;
        bindStartTime.effects[bindElementNumber].disabled = bindDisabled, bindStartTime.effects[bindElementNumber].hidden = bindDisabled, isDirty = true, appendLog("[DEBUG FX] Efek \"" + (bindItems[bindElementNumber] ? bindItems[bindElementNumber].name : bindElementNumber) + "\" pada layer \"" + bindStartTime.id + '\x22\x20' + (bindDisabled ? "DIMATIKAN" : "DIDAFTARKAN/DIAKTIFKAN") + '.'), typeof tElement == "function" && tElement(bindStartTime);
      }
    });
  }), typeof tElement == "function" && tElement(bindStartTime);
  let dataActUploadFontEl = layerInfo.querySelector("[data-act=\"uploadFont\"]");
  dataActUploadFontEl && dataActUploadFontEl.addEventListener("click", () => {
    let font = dataActUploadFontEl.dataset.font,
      inputEl = document.createElement("input");
    inputEl.type = "file", inputEl.accept = ".ttf,.otf,.woff,.woff2", inputEl.onchange = async bindArgPending => {
      let bindValuePrev = bindArgPending.target.files[0];
      if (bindValuePrev) try {
        await window.AM.loadFont(font, bindValuePrev), alert("Font \"" + font + "\" berhasil diupload dan dipakai."), bindElement(bindStartTime, bindElementArgValue, bindArg);
      } catch (bindMessage) {
        console.error(bindMessage), alert("Gagal mengupload font: " + bindMessage.message);
      }
    }, inputEl.click();
  });
  for (let bindNumber = 0; bindNumber < bindItems.length; bindNumber++) {
    let bindElementBindNumber = bindItems[bindNumber],
      bindQuerySelector = layerInfo.querySelector("[data-state=\"" + bindNumber + '\x22]');
    bindQuerySelector && localTertiary.push({
      el: bindQuerySelector,
      text: () => bindElementBindNumber.state || (playheadMs - bindArg >= bindElementValue && playheadMs - bindArg < bindMin ? "aktif" : "luar waktu")
    });
    for (let bindScoped = 0; bindScoped < bindElementBindNumber.params.length; bindScoped++) {
      let querySelectorValue = layerInfo.querySelector("[data-pi=\"" + bindNumber + ':' + bindScoped + '\x22]');
      querySelectorValue && localTertiary.push({
        el: querySelectorValue,
        text: () => renderHelperByIndex(bindElementBindNumber.params[bindScoped], bindElementBindNumber.definition, buildHelperMax(bindStartTime, playheadMs - bindArg))
      });
    }
  }
  updateHelperEnd();
}
async function getElement(getLabel, getElementArg, getArgOuter) {
  let getValueClamped = null;
  try {
    valueInner && (getValueClamped = await valueInner);
  } catch {
    getValueClamped = null;
  }
  if (!getValueClamped) try {
    getValueClamped = await (await fetch("./effect-index.json")).json();
  } catch {
    appendLog("[FX PICKER] Gagal memuat effect-index.json");
    return;
  }
  let divEl = document.createElement("div");
  divEl.className = "lightbox-bg", divEl.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
  let getStyle = document.createElement("div");
  getStyle.style.cssText = "background:#1a1d24;border-radius:12px;width:100%;max-width:540px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);";
  let styleValue = document.createElement("div");
  styleValue.style.cssText = "padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;", styleValue.innerHTML = "<strong style=\"font-size:16px;color:#fff;\">Tambah Efek ke " + localNodeResolved(getLabel.label || getLabel.id) + "</strong><button type=\"button\" class=\"btn sm\" style=\"min-width:32px;\">✕</button>", styleValue.querySelector("button").onclick = () => divEl.remove();
  let getAppendChild = document.createElement("div");
  getAppendChild.style.cssText = "padding:12px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;flex:1;";
  let entries = Object.entries(getValueClamped);
  for (let [getRaw, getCount] of entries) {
    let getDivEl = document.createElement("div");
    getDivEl.style.cssText = "background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px;display:flex;flex-direction:column;align-items:center;cursor:pointer;text-align:center;transition:background 0.15s;", getDivEl.onmouseenter = () => getDivEl.style.background = "rgba(255,255,255,0.12)", getDivEl.onmouseleave = () => getDivEl.style.background = "rgba(255,255,255,0.05)";
    let replace = getCount.replace(/\.xml$/i, '').replace(/-/g, '_'),
      getElementList = ["./effect-thumb/" + replace + ".webp", "/effects/thumb/" + replace + ".webp", "./effect-thumb/" + replace + "_bg.webp", "/effects/thumb/" + replace + "_bg.webp"],
      getElementNumber = 0,
      getSrc = getElementList[0],
      imgEl = document.createElement("img");
    imgEl.src = getSrc, imgEl.style.cssText = "width:64px;height:64px;object-fit:cover;border-radius:6px;background:#000;margin-bottom:6px;", imgEl.onerror = () => {
      getElementNumber++, getElementNumber < getElementList.length ? imgEl.src = getElementList[getElementNumber] : imgEl.style.display = "none";
    };
    let spanEl = document.createElement("span");
    spanEl.style.cssText = "font-size:11px;color:#ddd;line-height:1.2;word-break:break-word;", spanEl.textContent = getRaw.split('.').pop(), getDivEl.appendChild(imgEl), getDivEl.appendChild(spanEl), getDivEl.onclick = async () => {
      divEl.remove(), computeHelper('fx', "Menambahkan efek " + getRaw + '…');
      try {
        getLabel.effects || (getLabel.effects = []);
        let getElementRecord = {
          id: getRaw,
          params: [],
          hidden: false,
          disabled: false
        };
        getLabel.effects.push(getElementRecord);
        let getElementValue = getArgInner => getFail(getArgInner),
          getElementSet = new Set();
        refHelperClamped(projectScene, getElementSet), await renderer.loadEffectLibrary([...getElementSet], getElementValue);
        let getValueInner = renderer.programs.get(getRaw)?.["definition"];
        getValueInner && getValueInner.name && localByIndex.set(getRaw, getValueInner), isDirty = true, appendLog("[FX] Efek \"" + getRaw + "\" ditambahkan ke layer \"" + (getLabel.label || getLabel.id) + '\x22.'), bindElement(getLabel, getElementArg, getArgOuter);
      } catch (getValueTotal) {
        appendLog("[FX] Gagal menambah efek: " + getValueTotal.message), getHelperValue("Gagal menambah efek: " + getValueTotal.message);
      } finally {
        applyHelper('fx');
      }
    }, getAppendChild.appendChild(getDivEl);
  }
  getStyle.appendChild(styleValue), getStyle.appendChild(getAppendChild), divEl.appendChild(getStyle), document.body.appendChild(divEl);
}
function bindHelperLocal() {
  let tlZoom = document.getElementById("tl-zoom");
  tlZoom.addEventListener("input", () => getHelperRaw(Number(tlZoom.value), true)), document.getElementById("tl-zoom-in").addEventListener("click", () => getHelperRaw(localNodeFinal * 1.5, true)), document.getElementById("tl-zoom-out").addEventListener("click", () => getHelperRaw(localNodeFinal / 1.5, true)), document.getElementById("tl-fit").addEventListener("click", () => {
    localValueNext = false, buildHelperValue();
  }), document.getElementById("tl-here").addEventListener("click", () => nHelper()), document.getElementById("tl-groups").addEventListener("click", () => handleHelperByKey());
  let timelineInner = document.getElementById("timeline-inner"),
    timelineRuler = document.getElementById("timeline-ruler"),
    bindHelperLocalValue = bindArgResolved => (bindArgResolved.clientX - timelineInner.getBoundingClientRect().left - localNumber) / computeHelperRaw();
  timelineInner.addEventListener("click", bindArgEl => {
    if (!projectScene || bindArgEl.target.closest(".tl-block, .tl-label, .tl-eye, #timeline-ruler")) return;
    let bindCallbackValue = bindHelperLocalValue(bindArgEl);
    bindCallbackValue >= 0 && seekToTime(bindCallbackValue);
  });
  let scrubStartH = 0;
  timelineRuler.addEventListener("pointerdown", pointerId => {
    if (!(!projectScene || pointerId.target.closest(".tl-corner"))) {
      valueNext = true;
      scrubStartH = playheadMs;
      try {
        timelineRuler.setPointerCapture(pointerId.pointerId);
      } catch {}
      const targetTime = Math.max(0, bindHelperLocalValue(pointerId));
      seekToTime(targetTime);
      if (typeof window.omOnScrubStateChanged === "function") {
        window.omOnScrubStateChanged(true, targetTime, scrubStartH);
      }
    }
  }), timelineRuler.addEventListener("pointermove", bindHelperLocalArg => {
    if (valueNext) {
      const targetTime = Math.max(0, bindHelperLocalValue(bindHelperLocalArg));
      seekToTime(targetTime);
      if (typeof window.omOnScrubStateChanged === "function") {
        window.omOnScrubStateChanged(true, targetTime, scrubStartH);
      }
    }
  });
  let bindPrev = () => {
    if (valueNext) {
      valueNext = false;
      if (typeof window.omOnScrubStateChanged === "function") {
        window.omOnScrubStateChanged(false, playheadMs, scrubStartH);
      }
    }
  };
  timelineRuler.addEventListener("pointerup", bindPrev), timelineRuler.addEventListener("pointercancel", bindPrev), tlZoom.value = String(localNodeFinal), updateHelperValue(tlZoom);
  let bindHelperLocalNumber = 0;
  window.addEventListener("resize", () => {
    clearTimeout(bindHelperLocalNumber), bindHelperLocalNumber = setTimeout(() => {
      projectScene && buildHelperValue();
    }, 180);
  });
}
var localValueCompared = null;
function computeHelperByIndex() {
  return localValueCompared || (localValueCompared = fetch("./shape-index.json").then(json => json.json())), localValueCompared;
}
var localByIndex = new Map();
var badEffects = new Set();
var weakSet = new WeakSet();
async function updateClock(updateClockArgValue, updateClockArg = 45000) {
  let updateClockValue = [...updateClockArgValue].filter(updateClockArgRaw => updateClockArgRaw.readyState < 2);
  if (!updateClockValue.length) return 0;
  let updateClockRaw = ++videoBuildVersion,
    updateclockCallback = () => updateClockRaw === videoBuildVersion && !valueSecondary,
    updateClockNow = performance.now(),
    updateclockNumber = 0,
    updateClockValueParsed = updateClockArgParsed => {
      updateclockCallback() && renderHelper("video", "Menunggu video siap…", updateClockArgParsed + '/' + updateClockValue.length + " video");
    };
  computeHelper("video", "Menunggu video siap…"), updateClockValueParsed(updateclockNumber);
  try {
    await new Promise(updateClockArgClamped => {
      let updateClockParsed = false,
        updateClockValueRaw = () => {
          if (!updateClockParsed) {
            updateClockParsed = true, clearInterval(updateClockSetInterval);
            for (let removeEventListener of updateClockValue) removeEventListener.removeEventListener("loadeddata", updateClockResult), removeEventListener.removeEventListener("canplay", updateClockResult), removeEventListener.removeEventListener("error", updateClockResult);
            updateClockArgClamped();
          }
        },
        updateClockResult = () => {
          if (!updateclockCallback()) {
            updateClockValueRaw();
            return;
          }
          updateclockNumber++, updateClockValueParsed(updateclockNumber), updateclockNumber >= updateClockValue.length && updateClockValueRaw();
        };
      for (let updateClockAddEventListener of updateClockValue) updateClockAddEventListener.addEventListener("loadeddata", updateClockResult, {
        once: true
      }), updateClockAddEventListener.addEventListener("canplay", updateClockResult, {
        once: true
      }), updateClockAddEventListener.addEventListener("error", updateClockResult, {
        once: true
      });
      let updateClockSetInterval = setInterval(() => {
        updateclockCallback() ? (updateClockValue.every(updateClockArgScoped => updateClockArgScoped.readyState >= 2) || performance.now() - updateClockNow > updateClockArg) && updateClockValueRaw() : updateClockValueRaw();
      }, 300);
    });
    let updateClockNumber = 0;
    for (let updateClockReadyState of updateClockValue) updateClockReadyState.readyState < 2 && (weakSet.add(updateClockReadyState), updateClockNumber++);
    return updateClockNumber && appendLog("[LOAD] " + updateClockNumber + " video belum siap setelah " + (updateClockArg / 1000).toFixed(0) + "s; lanjut dengan apa adanya (bisa muncul frame hitam)."), updateClockValue.length - updateClockNumber;
  } finally {
    updateClockRaw === videoBuildVersion && applyHelper("video");
  }
}
function updateHelperOuter() {
  videoBuildVersion++, applyHelper("video");
}
function buildHelperMap() {
  let buildValueRaw = projectScene ? refHelperParsed(projectScene, 0, []) : [];
  videoAudioSlots = buildValueRaw;
  {
    let buildHelperMapList = [...new Set(buildValueRaw.filter(buildArgEnd => !computeHelperEnd(buildArgEnd.key)).map(buildHelperMapKey => buildHelperMapKey.key + " -> " + (map.get(buildHelperMapKey.key) || '-')))];
    buildHelperMapList.length && appendLog("[AUDIO] PERHATIAN: " + buildHelperMapList.length + " slot video belum berisi file video (diganti gambar contoh), jadi tidak ada suaranya. Tambahkan file mp4 aslinya di tab Media: " + buildHelperMapList.join(" | "));
  }
  for (let keyValue of videoAudioSlots) keyValue.el = computeHelperLocal(keyValue.key);
  mediaKeys = [...new Set(buildValueRaw.map(buildArgMin => buildArgMin.key))];
  let buildValueEl = projectScene ? refHelperValue(projectScene, 0, []) : [],
    buildHelperMapValue = buildValueEl.length > 0;
  if (hasMediaItems = buildValueRaw.length > 0, buildHelperMapValue) {
    renderHelperClamped(), renderHelperValue();
    let buildValueList = buildValueEl.map(({
      layer: buildEndTime,
      offsetMs: buildHelperMapArg
    }) => {
      let buildCount = ((buildHelperMapArg + buildEndTime.startTime) / 1000).toFixed(1) + '-' + ((buildHelperMapArg + buildEndTime.endTime) / 1000).toFixed(1) + 's';
      return (buildEndTime.label || buildEndTime.id || "audio") + '\x20' + buildCount;
    });
    buildValueList.length && appendLog("[AUDIO] Layer audio: " + buildValueList.join(',\x20'));
  } else getHelperInner(), hasMediaItems && renderHelperClamped();
  if (hasMediaItems) {
    let buildValueTotal = buildValueRaw.map(({
      layer: buildStartTime,
      offsetMs: buildArgLocal
    }) => {
      let buildTotal = ((buildArgLocal + buildStartTime.startTime) / 1000).toFixed(1) + '-' + ((buildArgLocal + buildStartTime.endTime) / 1000).toFixed(1) + 's';
      return (buildStartTime.label || buildStartTime.id || buildStartTime.fillVideo) + '\x20' + buildTotal + (buildStartTime.hidden ? " (audio-only)" : '');
    });
    appendLog("[AUDIO] Layer video sumber suara: " + buildValueTotal.join(',\x20'));
  }
  return buildHelperLocal(), handleHelper({
    force: true
  }), hasMediaItems;
}
async function handleHelperValue() {
  computeHelperByKey(), await processMax(), localList = [], localSet.clear(), appendLog("[SCENE] \"" + projectScene.title + '\x22\x20' + projectScene.width + 'x' + projectScene.height + '\x20' + (projectScene.totalTime / 1000).toFixed(2) + "s @ " + projectScene.fps + "fps"), updateHelperMap(), appendLog("[SCENE] " + projectScene.layers.length + " layer, " + projectScene.media.length + " media, " + projectScene.audio.length + " audio, " + projectScene.bookmarks.length + " bookmark"), subtitleEl.textContent = projectScene.title + " - " + projectScene.layers.length + " layer - " + (projectScene.totalTime / 1000).toFixed(1) + 's', renderer.setScene(projectScene), renderer.setImages(helperValue());
  let handleHelperValueList = [...refHelperClamped(projectScene, new Set())];
  appendLog("[SCENE] " + handleHelperValueList.length + " efek unik dipakai preset ini"), computeHelper('fx', "Menyiapkan efek shader…");
  try {
    let handleHelperValueNumber = 0;
    await renderer.loadEffectLibrary(handleHelperValueList, async handleHelperValueArg => {
      let handleValueTarget = await getFail(handleHelperValueArg);
      return handleHelperValueNumber++, renderHelper('fx', "Menyiapkan efek shader…", handleHelperValueNumber + '/' + handleHelperValueList.length + '\x20' + String(handleHelperValueArg).split('.').pop()), handleValueTarget;
    });
  } finally {
    applyHelper('fx');
  }
  let handleScoped = [...refHelperOuter(projectScene, new Set())];
  if (handleScoped.length) {
    computeHelper("shape", "Menyiapkan bentuk bawaan…");
    try {
      let handleValueMap = 0;
      await renderer.loadShapeLibrary(handleScoped, async handleHelperValueArgValue => {
        let handleValueInput = await resFail(handleHelperValueArgValue);
        return handleValueMap++, renderHelper("shape", "Menyiapkan bentuk bawaan…", handleValueMap + '/' + handleScoped.length + '\x20' + handleHelperValueArgValue), handleValueInput;
      });
    } finally {
      applyHelper("shape");
    }
  }
  if (computeHelperValue(), bindHelperRaw(), bindHelper(), contains) {
    handleOuter(false), localValueLocal = -1, bindHelperByKey();
    let sTitle = document.getElementById("sTitle");
    sTitle && (sTitle.textContent = projectScene.title || "Preset");
  }
  textValue = null, buildHelperValue(), buildHelperMap(), updateHelperOuter(), valueSecondary = false;
  let handleApply = applyClamped();
  handleApply.length && updateClock(handleApply), seekEl.max = String(Math.round(projectScene.totalTime)), playheadMs > projectScene.totalTime && (playheadMs = 0), seekEl.value = String(Math.round(playheadMs)), updateHelperValue(seekEl), valueCompared = false, getPos(), await renderer.prepareMedia(Math.min(playheadMs, projectScene.totalTime)), renderer.renderAt(Math.min(playheadMs, projectScene.totalTime)), getPos(), reslabelEl.textContent = renderer.workWidth + 'x' + renderer.workHeight + " (canvas " + viewEl.width + 'x' + viewEl.height + ')', sizescaleEl.value = "auto", isDirty = true, processHelperLocal(), typeof getHelperScoped == "function" && getHelperScoped();
}
var localValueExtra = '',
  localScoped = '',
  localPrev = '';
async function renderHelperStart(renderHelperStartFlag, renderHelperStartArg) {
  let renderHelperStartList = [];
  computeHelper("scene", "Menyusun scene…");
  try {
    await localCurrent();
    let renderTitle,
      renderHelperStartText = '';
    if (renderHelperStartFlag >= 0 && valueScoped[renderHelperStartFlag]) {
      let renderKey = valueScoped[renderHelperStartFlag];
      renderHelperStartText = renderKey.name, renderTitle = updateFail(renderKey.text, renderKey.name), renderTitle.title || (renderTitle.title = renderKey.name.replace(/\.xml$/i, ''));
    } else {
      if (localValueByIndex >= 0 && valueScoped[localValueByIndex]) {
        let renderBt = valueScoped[localValueByIndex];
        renderHelperStartText = renderBt.name, renderTitle = updateFail(renderBt.text, renderBt.name), renderTitle.title || (renderTitle.title = renderBt.name.replace(/\.xml$/i, ''));
      } else renderHelperStartText = localByKey, renderTitle = updateFail(localValueTertiary, localByKey);
    }
    let renderHelperStartNumber = 0;
    for (let renderParsed of valueTracked) if (renderParsed.name !== renderHelperStartText) try {
      let renderUpdate = updateFail(computeHelperEl(renderParsed.text, renderParsed.name, renderTitle), renderParsed.name);
      renderTitle.layers.push(...renderUpdate.layers);
      for (let renderUri of renderUpdate.media) renderTitle.media.some(renderArgOutput => renderArgOutput.uri === renderUri.uri) || renderTitle.media.push(renderUri);
      renderHelperStartNumber += renderUpdate.layers.length;
    } catch (renderTertiary) {
      renderHelperStartList.push(renderParsed.name + ':\x20' + renderTertiary.message);
    }
    return requestPlayback(false), projectScene = renderTitle, localValueByIndex = renderHelperStartFlag >= 0 ? renderHelperStartFlag : localValueByIndex, map.clear(), mapValue.clear(), (typeof omUploads !== "undefined" && omUploads && omUploads.length && typeof omRestoreMediaUploads === "function" && omRestoreMediaUploads(omUploads)), playheadMs = 0, buildHelperRaw(0), await handleHelperValue(), volume && !audioLoadFailed && helperParsed(), renderer && renderer.renderAt(0), isDirty = true, localValueExtra = '' + renderHelperStartText + (valueScoped.length > 1 ? " + " + (valueScoped.length - 1) + " xml lain" : '') + (renderHelperStartNumber ? " + " + renderHelperStartNumber + " layer grup" : ''), processHelper(renderHelperStartList.concat(renderHelperStartArg || []).join('\x0a')), appendLog("[IMPORT] \"" + projectScene.title + "\" dimuat: " + projectScene.layers.length + " layer, " + projectScene.media.length + " media, " + projectScene.audio.length + " audio."), true;
  } catch (renderMessage) {
    return processHelper("gagal memuat: " + renderMessage.message), appendLog("[IMPORT] Gagal: " + renderMessage.message), getHelperValue("Gagal menyusun scene: " + renderMessage.message), false;
  } finally {
    applyHelper("scene");
  }
}
async function applyHelperValue(applyArgByKey) {
  let applyHelperValueList = [...applyArgByKey];
  if (!applyHelperValueList.length) return;
  computeHelper("read", "Membaca file XML…");
  let applyList = [],
    applyValueParsed = [],
    applyValueClamped = [];
  try {
    await localCurrent();
    let applyHelperValueNumber = 0;
    for (let applyText of applyHelperValueList) {
      renderHelper("read", "Membaca file XML…", ++applyHelperValueNumber + '/' + applyHelperValueList.length + '\x20' + applyText.name);
      let applyHelperValueText = '';
      try {
        applyHelperValueText = await applyText.text();
      } catch (applyValueByKey) {
        applyValueClamped.push(applyText.name + ':\x20' + applyValueByKey.message);
        continue;
      }
      /<scene[\s>]/.test(applyHelperValueText) ? applyList.push({
        name: applyText.name,
        text: applyHelperValueText
      }) : applyValueParsed.push({
        name: applyText.name,
        text: applyHelperValueText
      });
    }
  } finally {
    applyHelper("read");
  }
  if (!applyList.length && !applyValueParsed.length) {
    processHelper(applyValueClamped.join('\x0a') || "tidak ada XML yang bisa dibaca");
    return;
  }
  valueScoped = applyList, valueTracked = applyValueParsed, imppickEl.innerHTML = '', applyList.forEach((applyArgByIndex, applyHelperValueArg) => {
    let optionEl = document.createElement("option");
    optionEl.value = String(applyHelperValueArg), optionEl.textContent = applyArgByIndex.name, imppickEl.appendChild(optionEl);
  }), imppickrowEl.style.display = applyList.length > 1 ? '' : "none";
  let applyParsed = -1,
    applyLocal = -1;
  applyList.forEach((textArg, applyByIndex) => {
    let applyHelperValueRaw = (textArg.text.match(/<shape /g) || []).length;
    applyHelperValueRaw > applyLocal && (applyLocal = applyHelperValueRaw, applyParsed = applyByIndex);
  }), applyParsed >= 0 && (imppickEl.value = String(applyParsed)), appendLog("[IMPORT] " + applyList.length + " preset + " + applyValueParsed.length + " grup XML dibaca."), await renderHelperStart(applyParsed, applyValueClamped);
}
async function getHelperClamped(getArgMin) {
  let getHelperClampedList = [...getArgMin];
  if (getHelperClampedList.length) {
    computeHelper("photo", "Menambah media ke galeri…"), await localCurrent();
    try {
      let getList = [],
        getHelperClampedNumber = 0;
      for (let getHelperClampedGetValue of getHelperClampedList) {
        if (getHelperClampedNumber++, /^audio\//.test(getHelperClampedGetValue.type) || /\.(mp3|wav|m4a|aac|ogg)$/i.test(getHelperClampedGetValue.name)) {
          handleHelperOuter(getHelperClampedGetValue);
          continue;
        }
        let getHelperClampedValue = /^video\//.test(getHelperClampedGetValue.type) || /\.(mp4|webm|ogv|mov|m4v)$/i.test(getHelperClampedGetValue.name),
          getValueParsed = getHelperClampedGetValue.name || "media-" + getHelperClampedNumber;
        for (; localRaw.has(getValueParsed) || byFileName.has(getValueParsed);) getValueParsed = getHelperClampedNumber + '-' + getValueParsed;
        let getHelperClampedRecord = {
          name: getValueParsed,
          src: URL.createObjectURL(getHelperClampedGetValue),
          isVideo: getHelperClampedValue
        };
        getList.push(getHelperClampedRecord), localRaw.set(getValueParsed, getHelperClampedRecord), valueByKey.push(getHelperClampedRecord.src);
      }
      getList.length && (getHelperStart(localNodePending.concat(getList)), localPrev = localNodePending.length + " media tersedia (+" + getList.length + " baru: " + getList.map(getArgMax => getArgMax.name).join(',\x20') + ')', processHelper(), computeHelperValue(), bindHelper(), appendLog("[IMPORT] " + getList.length + " media ditambahkan (total " + localNodePending.length + " media di Galeri)."));
    } finally {
      applyHelper("photo");
    }
  }
}
async function helperCount(updateSrc, updateArgLocal) {
  let updateScoped = updateSrc.src;
  updateSrc.src = URL.createObjectURL(updateArgLocal), updateSrc.isVideo = /^video\//.test(updateArgLocal.type) || /\.(mp4|webm|ogv|mov|m4v)$/i.test(updateArgLocal.name), updateScoped.startsWith("blob:") && (URL.revokeObjectURL(updateScoped), valueByKey = valueByKey.filter(helperCountArg => helperCountArg !== updateScoped)), valueByKey.push(updateSrc.src), localValueScoped.delete(updateScoped), await updateHelperRaw("media:replace", "Memuat " + updateSrc.name + '…', async () => {
    await applyHelperRaw(updateSrc.name), renderer.setImages(helperValue()), isDirty = true, bindHelper(), computeHelperValue();
  }), localPrev = localNodePending.length + " media tersedia (terakhir diganti: " + updateSrc.name + ')', processHelper(), appendLog("[IMPORT] Media \"" + updateSrc.name + "\" diganti manual.");
}
function handleHelperOuter(handleArg) {
  if (!handleArg) return;
  let createObjectUrl = URL.createObjectURL(handleArg);
  valueByIndex && URL.revokeObjectURL(valueByIndex), valueByIndex = createObjectUrl, localScoped = '' + handleArg.name + (/^video\//.test(handleArg.type) ? " (audio dari video)" : ''), localMap.has(handleArg.name) || (valueRaw.push({
    name: handleArg.name,
    src: createObjectUrl
  }), localMap.set(handleArg.name, createObjectUrl));
  let handleLayer = projectScene ? refHelperValue(projectScene, 0, [])[0] : null;
  mapValue.set(handleLayer ? handleLayer.layer.id || "audio-0" : "main-audio", handleArg.name), handleLayer || amAudioEe.length ? (renderHelperValue(), handleHelper({
    force: true
  })) : bindHelperValue(createObjectUrl, localScoped), bindHelperRaw(), processHelper(), appendLog("[IMPORT] Audio ditambahkan: " + handleArg.name + '\x20(' + (handleArg.type || "tipe tidak dikenal") + ').');
}
async function processLocal() {
  computeHelper("reset", "Kembali ke preset contoh…"), await localCurrent();
  try {
    requestPlayback(false), valueScoped = [], valueTracked = [], handleHelperMax(), imppickEl.innerHTML = '', imppickrowEl.style.display = "none", localValueByIndex = -1, localValueExtra = '', localScoped = '', localPrev = '';
    for (let processEnd of valueByKey) URL.revokeObjectURL(processEnd);
    valueByKey = [], valueByIndex && (URL.revokeObjectURL(valueByIndex), valueByIndex = null), await buildHelperEnd(), map.clear(), mapValue.clear(), projectScene = updateFail(localValueTertiary, localByKey), await handleHelperValue(), bindHelperValue(localValueToken, localValueToken.split('/').pop()), bindHelper(), processHelper(), appendLog("[IMPORT] Kembali ke preset contoh (foto + audio bawaan).");
  } finally {
    applyHelper("reset");
  }
}
async function renderHelperEnd() {
  let trim = urltiktokEl.value.trim();
  if (!trim) {
    urltiktokstaEl.textContent = "isi URL TikTok dulu";
    return;
  }
  urltiktokgoEl.disabled = true, urltiktokstaEl.textContent = "mengambil...";
  try {
    let renderMedia = (await refFail("/api/tiktok", trim)).media;
    urltiktokstaEl.textContent = renderMedia, localScoped = "TikTok: " + trim, bindHelperValue(renderMedia, "TikTok " + trim.split('/').pop()), processHelper(), appendLog("[URL] Media TikTok didapat: " + renderMedia);
  } catch (renderValuePrimary) {
    urltiktokstaEl.textContent = "gagal: " + renderValuePrimary.message, appendLog("[URL] TikTok gagal: " + renderValuePrimary.message);
  } finally {
    urltiktokgoEl.disabled = false;
  }
}
async function buildFail() {
  let trim = urldriveaudiEl.value.trim();
  if (!trim) {
    urlDriveAudioStateEl.textContent = "isi link Google Drive dulu";
    return;
  }
  urlDriveAudioGoEl.disabled = true, urlDriveAudioStateEl.textContent = "mengambil audio dari Drive...";
  try {
    let params = new URLSearchParams(trim ? {
        url: trim,
        kind: "audio",
        start: '0',
        end: '0'
      } : {}),
      buildOk = await fetch("/api/drive-media?" + params.toString());
    if (!buildOk.ok) {
      let buildValueEnd = "HTTP " + buildOk.status;
      try {
        buildValueEnd = (await buildOk.json()).error || buildValueEnd;
      } catch {}
      throw new Error(buildValueEnd);
    }
    let buildFailValue = updateHelperTotal(buildOk.headers.get("content-disposition")) || "audio dari Drive",
      buildStart = "/api/drive-media?url=" + encodeURIComponent(trim) + "&kind=audio";
    localMap.has(buildFailValue) || valueRaw.push({
      name: buildFailValue,
      src: buildStart
    }), localMap.set(buildFailValue, buildStart), mapValue.set(projectScene && projectScene.audio && projectScene.audio[0] ? projectScene.audio[0].id || "audio-0" : "main-audio", buildFailValue), localScoped = buildFailValue + " (Google Drive)", urlDriveAudioStateEl.textContent = "audio " + buildFailValue + " siap dimuat", appendLog("[DRIVE] Audio \"" + buildFailValue + "\" dari Google Drive dipakai sebagai track project."), bindHelperValue(buildStart, localScoped), bindHelperRaw(), processHelper();
  } catch (buildMessage) {
    urlDriveAudioStateEl.textContent = "gagal: " + buildMessage.message, appendLog("[DRIVE] audio gagal: " + buildMessage.message), getHelperValue("Gagal mengambil audio dari Google Drive: " + buildMessage.message);
  } finally {
    urlDriveAudioGoEl.disabled = false;
  }
}
function renderHelperClamped() {
  if (volume) {
    try {
      volume.pause();
    } catch {}
    volume.removeAttribute("src");
    try {
      volume.load();
    } catch {}
    volume = null;
  }
  audioLoadFailed = false;
}
function bindHelperValue(bindArgParsed, bindHelperValueArg) {
  if (!bindArgParsed) {
    renderHelperClamped();
    return;
  }
  localOuter = bindArgParsed, localEmbedded = bindHelperValueArg || String(bindArgParsed).split('/').pop(), renderHelperClamped();
  let bindPending = ++localValueSegment;
  computeHelper("audio", "Memuat audio: " + localEmbedded);
  let audio = new Audio(bindArgParsed);
  audio.preload = "auto";
  let bindHelperValueParsed = () => {
    bindPending === localValueSegment && applyHelper("audio");
  };
  audio.addEventListener("loadeddata", bindHelperValueParsed, {
    once: true
  }), audio.addEventListener("canplay", bindHelperValueParsed, {
    once: true
  }), audio.addEventListener("error", bindHelperValueParsed, {
    once: true
  }), setTimeout(bindHelperValueParsed, 30000), audio.addEventListener("error", () => {
    volume === audio && (bindHelperValueParsed(), audioLoadFailed = true, appendLog("[AUDIO] Gagal memuat \"" + localEmbedded + '\x22' + (audio.error ? " kode " + audio.error.code : '') + "; timeline jalan tanpa suara."));
  }), audio.addEventListener("canplaythrough", () => {
    volume === audio && appendLog("[AUDIO] Audio siap diputar.");
  }), audio.addEventListener("ended", () => {
    volume === audio && (loopPlayback || requestPlayback(false));
  }), audio.addEventListener("loadedmetadata", () => {
    if (volume !== audio) return;
    renderHelperParsed();
    let bindHandle = handleHelperStart(),
      bindHelperValueRaw = audio.duration * 1000;
    if (!Number.isFinite(bindHelperValueRaw) || bindHelperValueRaw <= 0) return;
    let bindValueResolved = bindHelperValueRaw / bindHandle;
    Math.abs(bindHelperValueRaw - bindHandle) > 100 ? (appendLog("[SYNC] PERINGATAN: file audio " + (bindHelperValueRaw / 1000).toFixed(2) + "s != audio project " + (bindHandle / 1000).toFixed(2) + "s (selisih " + ((bindHelperValueRaw - bindHandle) / 1000).toFixed(2) + "s)."), appendLog("[SYNC] Beat tidak akan pernah pas kalau begini. Pakai audio asli dari AM, atau tekan tombol \"Cocokkan kecepatan audio ke project\" (kecepatan " + bindValueResolved.toFixed(3) + "x).")) : appendLog("[SYNC] Durasi audio cocok dengan project.");
  }), volume = audio, volume.load(), computeHelperClamped(playbackRate, true), helperParsed(), renderHelperParsed(), appendLog("[AUDIO] Sumber: " + new URL(bindArgParsed, location.href).href);
}
async function getHelperByKey() {
  if (location.protocol === "file:") {
    appendLog("Halaman ini harus dibuka lewat web server (bukan file://) karena fetch() diblokir. Jalankan \"npm start\" lalu buka http://localhost:3000/runtime/preset.html"), subtitleEl.textContent = "Buka lewat http://, bukan file://";
    return;
  }
  computeHelper("boot", "Menyiapkan player…");
  try {
    let params = new URLSearchParams(location.search),
      getHelperByKeyValue = params.get("alight") || params.get("url") || params.get("drive") || params.get("project") || params.get("xml") || params.get("preset");
    if (!getHelperByKeyValue && /\/proyek\//.test(location.pathname)) {
      renderer = new valueMax(viewEl, appendLog), renderer.effectsEnabled = fxtoggleEl.checked, renderer.debugCanvas = debugcanvasEl, targetFps = applyRaw(), valueInner = fetch("./effect-index.json").then(getJson => getJson.json()), helperClamped();
      appendLog("[BOOT] Membuka proyek dari URL: " + location.pathname);
      return;
    }
    if (contains && !getHelperByKeyValue) {
      renderer = new valueMax(viewEl, appendLog), renderer.effectsEnabled = fxtoggleEl.checked, renderer.debugCanvas = debugcanvasEl, targetFps = applyRaw(), valueInner = fetch("./effect-index.json").then(jsonArg => jsonArg.json()), helperClamped(), handleOuter(true);
      return;
    }
    if (getHelperByKeyValue) {
      appendLog("[BOOT] Deteksi query parameter (" + getHelperByKeyValue + "), membatalkan muat default preset bawaan..."), renderer = new valueMax(viewEl, appendLog), renderer.effectsEnabled = fxtoggleEl.checked, renderer.debugCanvas = debugcanvasEl, targetFps = applyRaw(), valueInner = fetch("./effect-index.json").then(getArgByKey => getArgByKey.json()), processHelper(), helperClamped();
      let getTotal = /^https?:\/\//i.test(getHelperByKeyValue) || getHelperByKeyValue.length >= 25 && !getHelperByKeyValue.includes('.') ? getHelperByKeyValue : "https://alight.link/" + getHelperByKeyValue;
      await window.AM.loadPreset(getTotal);
    } else await helperTotal();
  } finally {
    applyHelper("boot");
  }
}
async function helperTotal() {
  renderer = new valueMax(viewEl, appendLog), renderer.effectsEnabled = fxtoggleEl.checked, renderer.debugCanvas = debugcanvasEl, targetFps = applyRaw(), valueInner = fetch("./effect-index.json").then(updateJson => updateJson.json()), localValueTertiary = await (await fetch(valueEmbedded)).text(), localByKey = valueEmbedded.split('/').pop(), projectScene = updateFail(localValueTertiary, localByKey), await buildHelperEnd(), appendLog("[MEDIA] " + localValue.length + " gambar contoh di preset/: " + localValue.join(',\x20')), bindHelper(), await handleHelperValue(), !amAudioEe.length && !hasMediaItems && bindHelperValue(valueOuter, valueOuter.split('/').pop()), appendLog("[SCENE] Siap. Tekan Putar. (" + renderer.failedEffects.size + " efek dilewati)");
  try { buildHelperValue(); } catch(updateSource) {}
  let webcodecs = objHelperClamped();
  appendLog("[EXPORT] WebCodecs: " + (webcodecs.webcodecs ? "ada" : "TIDAK ada") + (webcodecs.webcodecs ? '' : " -> ekspor pakai MediaRecorder real-time")), appendLog("[EXPORT] Audio track (AAC): " + (webcodecs.audioEncoder ? "siap" : "render audio lewat Mediabunny AAC")), expstatsEl.textContent = webcodecs.webcodecs ? "siap - ekspor MP4 H.264 + AAC" : "siap - browser ini tidak punya WebCodecs, fallback hanya WebM real-time", processHelper(), helperClamped();
}
var valueRule = 0,
  valueCompared = false;
function buildHelperRaw(buildArgMax) {
  valueRule = buildArgMax, valueCompared = false;
}
function requestPlayback(requestPlaybackFlag) {
  if (requestPlaybackFlag && isLoading) {
    pendingPlay = true, appendLog("[LOAD] Tombol Putar masih terkunci sampai proses loading selesai.");
    return;
  }
  if (requestPlaybackFlag && (!projectScene || !renderer)) {
    appendLog("[LOAD] Player belum siap: scene/renderer belum selesai dibuat.");
    return;
  }
  if (requestPlaybackFlag && applyClamped().length) {
    pendingPlay = true, localClamped.has("video") || updateClock(applyClamped());
    return;
  }
  if (isPlaying = requestPlaybackFlag, requestPlaybackFlag && setTimeout(() => {
    if (isPlaying) try {
      processInner("play");
    } catch (requestPlaybackMessage) {
      appendLog("[AUDIO][diag] error: " + (requestPlaybackMessage && requestPlaybackMessage.message));
    }
  }, 900), stageEl.classList.toggle("is-playing", requestPlaybackFlag), isDirty = true, playEl.innerHTML = requestPlaybackFlag ? eyeOff.pause + "Jeda" : eyeOff.play + "Putar", renderer && (requestPlaybackFlag ? renderer.playMedia(playbackRate) : renderer.pauseMedia()), !!projectScene) {
    if (requestPlaybackFlag) playheadMs >= projectScene.totalTime - 5 && (playheadMs = 0), buildHelperRaw(playheadMs), handleHelper({
      force: true
    });else {
      for (let requestPlaybackEl of amAudioEe) try {
        requestPlaybackEl.el.pause();
      } catch {}
      volume && !audioLoadFailed && volume.pause();
    }
  }
  if (typeof window.omOnPlayStateChanged === "function") window.omOnPlayStateChanged(isPlaying);
}
var renderRequestId = 0;
async function seekToTime(seekToTimeArg) {
  if (!projectScene || isLoading || (playheadMs = Math.max(0, Math.min(projectScene.totalTime, seekToTimeArg)), buildHelperRaw(playheadMs), handleHelper({
    force: true
  }), isDirty = true, processHelperLocal(), isPlaying || !renderer)) return;
  if (typeof window.omOnTimeUpdate === "function") window.omOnTimeUpdate(playheadMs, projectScene.totalTime, projectScene.fps || 30);
  let seekToTimeValue = ++renderRequestId,
    seekToTimeResult = await renderer.prepareMedia(playheadMs);
  seekToTimeValue !== renderRequestId || isPlaying || seekToTimeResult && renderer.renderAt(playheadMs);
}
function helperClamped(computeArgValue) {
  let computeValueTertiary = lastFrameMs ? Math.min(100, computeArgValue - lastFrameMs) : 0;
  if (lastFrameMs = computeArgValue, isPlaying && projectScene && (valueCompared = false, audioDriftMs = 0, playheadMs += computeValueTertiary * (playbackRate || 1), playheadMs >= projectScene.totalTime && (playheadMs = loopPlayback ? playheadMs % projectScene.totalTime : projectScene.totalTime, buildHelperRaw(playheadMs), loopPlayback ? handleHelper({
    force: true
  }) : requestPlayback(false)), isPlaying && handleHelper()), !isScrubbing) {
    let helperClampedString = String(Math.round(playheadMs));
    seekEl.value !== helperClampedString && (seekEl.value = helperClampedString, updateHelperValue(seekEl));
  }
  let helperClampedValue = 1000 / targetFps,
    computeTertiary = !!(renderer && renderer.videoFramePending);
  if (renderer && !isExporting && !isLoading && (isPlaying || isDirty || computeTertiary) && computeArgValue - lastRenderMs >= helperClampedValue - 1) {
    lastRenderMs = computeArgValue, isDirty = false, renderer && typeof renderer.consumeVideoFrame == "function" && renderer.consumeVideoFrame();
    let computeNow = performance.now();
    try {
      renderer.renderAt(playheadMs);
      let computeValuePrev = renderer.stats.layers + " layer - " + renderer.stats.passes + " pass" + (renderer.stats.videoPasses ? " - " + renderer.stats.videoPasses + " video (" + renderer.stats.videoUploads + " upload)" : '') + (renderer.stats.videoAudioOnly ? " - " + renderer.stats.videoAudioOnly + " audio-only" : '');
      statusEl.textContent !== computeValuePrev && (statusEl.textContent = computeValuePrev), statusEl.style.color !== "rgb(143, 216, 160)" && (statusEl.style.color = "#8fd8a0");
    } catch (messageValue) {
      messageValue.message !== lastRenderError && (lastRenderError = messageValue.message, appendLog("[ERROR] Render: " + messageValue.message), getHelperValue("Render gagal: " + messageValue.message)), statusEl.textContent = messageValue.message.slice(0, 60), statusEl.style.color = "#ff8888", requestPlayback(false);
    }
    let computeNext = performance.now() - computeNow;
    for (smoothedFrameMs = smoothedFrameMs ? smoothedFrameMs * 0.8 + computeNext * 0.2 : computeNext, recentFrameTimes.push(computeArgValue); recentFrameTimes.length && computeArgValue - recentFrameTimes[0] > 1000;) recentFrameTimes.shift();
    perfStatusText = "fps " + recentFrameTimes.length + " (target " + targetFps + ") | frame " + smoothedFrameMs.toFixed(0) + "ms | budget " + helperClampedValue.toFixed(0) + 'ms', renderHelperEl(computeArgValue, helperClampedValue);
  }
  if (computeArgValue - lastStatusUpdateMs >= 250) {
    lastStatusUpdateMs = computeArgValue;
    let computeValueExtra = projectScene ? projectScene.totalTime : 0;
    timelabelEl.textContent = (playheadMs / 1000).toFixed(2) + "s / " + (computeValueExtra / 1000).toFixed(2) + 's', audiostateEl.textContent = handleHelperList(), perflabelEl.textContent = isPlaying ? perfStatusText + " | drift " + audioDriftMs.toFixed(0) + 'ms' : perfStatusText, updateHelperEnd();
  }
  if ((isPlaying || isDirty) && typeof window.omOnTimeUpdate === "function") window.omOnTimeUpdate(playheadMs, projectScene ? projectScene.totalTime : 0, projectScene ? projectScene.fps || 30 : 30);
  (isPlaying || isDirty) && processHelperLocal(), requestAnimationFrame(helperClamped);
}
var localCompared = [960, 640, 480, 360, 270];
function renderHelperEl(renderArgMin, renderArgMax) {
  if (!autoqualityEl.checked || !renderer || renderArgMin - lastQualityCheckMs < 2000 || smoothedFrameMs <= renderArgMax * 1.25) return;
  let indexOf = localCompared.indexOf(renderer.workHeight);
  if (indexOf < 0 || indexOf >= localCompared.length - 1) return;
  let renderEnd = localCompared[indexOf + 1];
  lastQualityCheckMs = renderArgMin, smoothedFrameMs = 0, renderer.setResolution(renderEnd), qualityEl.value = String(renderEnd), reslabelEl.textContent = renderer.workWidth + 'x' + renderer.workHeight + " (canvas " + viewEl.width + 'x' + viewEl.height + ')', getPos(), appendLog("[PERF] Ngelag (frame " + smoothedFrameMs.toFixed(0) + "ms > budget " + renderArgMax.toFixed(0) + "ms), kualitas diturunkan ke " + renderEnd + 'p.');
}
playEl.addEventListener("click", () => requestPlayback(!isPlaying));
var localValueSorted = '';
function lHelper(lValue) {
  let lMax = Math.max(1, Math.round(Number(lValue) || 0)),
    lRaw = projectScene && projectScene.height ? projectScene.width / projectScene.height : 1,
    lItems = [],
    lGl = renderer.gl;
  if (lGl && typeof lGl.getParameter == "function") for (let lValueParsed of ["MAX_TEXTURE_SIZE", "MAX_RENDERBUFFER_SIZE"]) {
    let lValueRaw = lGl[lValueParsed] !== void 0 ? lGl.getParameter(lGl[lValueParsed]) : 0;
    Number.isFinite(lValueRaw) && lValueRaw > 0 && lItems.push(lValueRaw);
  }
  localValueSorted = '';
  let lCallback = lArg => Math.round(lArg * Math.max(1, lRaw)),
    lHelperLValue = lMax;
  if (lItems.length) {
    let lMin = Math.min(...lItems);
    lCallback(lHelperLValue) > lMin && (lHelperLValue = Math.max(180, Math.floor(lMin / Math.max(1, lRaw))), localValueSorted = "GPU hanya mendukung sisi terpanjang " + lMin + 'px');
  }
  return lHelperLValue % 2 && (lHelperLValue -= 1), Math.max(180, lHelperLValue);
}
var localStage = "▁▂▃▄▅▆▇█";
async function computeFail() {
  if (isExporting || isLoading || !renderer || !projectScene) return;
  isExporting = true, exportCancelled = false, idle = "running", localValueInner = '', expstartEl.disabled = true, isDirty = false, isPlaying && requestPlayback(false), volume && !volume.paused && volume.pause(), expresultEl.textContent = '', exportBlobUrl && (URL.revokeObjectURL(exportBlobUrl), exportBlobUrl = null), computeHelper("export", "Mengekspor video…");
  let workHeightValue = renderer.workHeight,
    computeApply = applyHelperScoped(),
    same = expresEl.value,
    computeValueMax = projectScene && projectScene.height ? projectScene.width / projectScene.height : 1,
    computeFailValue = computeValueMax < 1,
    computePrev = same === "same" ? workHeightValue : computeFailValue ? Number(same) / computeValueMax : Number(same),
    computeL = lHelper(computePrev);
  computeL !== computePrev && appendLog("[EXPORT] Resolusi diturunkan ke tinggi " + computeL + "px: " + localValueSorted);
  let computeExtra = Number(expbitrateEl.value) || 0.08,
    round = Math.round(computeL * computeValueMax),
    computeUpdate = updateHelperCount();
  appendLog("[EXPORT][AUDIO] " + (computeUpdate ? computeUpdate.length : 0) + " track suara dikumpulkan"), renderer.exp && appendLog("[EXPORT][EXP] EKSPERIMEN AKTIF: " + renderer.exp.active.join(" | "));
  try {
    processInner("export");
  } catch (computeAnother) {
    appendLog("[AUDIO][diag] error: " + (computeAnother && computeAnother.message));
  }
  let computeParsed = !!computeUpdate || !!volume || !!localOuter;
  setExportStatus("memeriksa dukungan encoder perangkat…");
  let computeGet = getHelperByIndex(),
    computeMode = await handleHelperInner({
      width: round,
      height: computeL,
      bitrate: 6000000,
      fps: computeApply,
      needAudio: computeParsed,
      codec: computeGet
    });
  appendLog("[EXPORT] Probe: mode=" + computeMode.mode + ", video.ok=" + computeMode.video.ok + (computeMode.video.reason ? '\x20(' + computeMode.video.reason + ')' : '') + ", audio.diminta=" + computeParsed + ", audio.ok=" + computeMode.audio.ok + (computeMode.audio.reason ? '\x20(' + computeMode.audio.reason + ')' : ''));
  let computeMax = globalThis.AM_DISABLE_FFMPEG_FALLBACK !== true,
    computeFlag = false,
    computeFailComputeValue = computeParsed && computeMode.audio.ok;
  if (computeGet === "h265" && (appendLog("[EXPORT] Codec H.265 dipilih: memakai FFmpeg WASM (fallback)."), computeFlag = true), computeMode.mode === "none") {
    if (computeMax) appendLog("[EXPORT] Tidak ada jalur ekspor primer (" + (computeMode.reason || "tidak didukung") + "); memakai FFmpeg WASM."), computeFlag = true;else {
      let computeOuter = computeMode.reason || "perangkat ini tidak punya jalur ekspor yang didukung";
      appendLog("[EXPORT] Tidak bisa mengekspor: " + computeOuter), idle = "failed", localValueInner = computeOuter, setExportStatus("GAGAL: " + computeOuter), getHelperValue("Ekspor tidak didukung di perangkat ini: " + computeOuter), isExporting = false, applyHelper("export"), expstartEl.disabled = false;
      return;
    }
  } else computeMode.mode !== "webcodecs" && computeParsed && computeMax && (appendLog("[EXPORT] WebCodecs tidak tersedia untuk audio; memakai FFmpeg WASM."), computeFlag = true);
  if (computeParsed && !computeMode.audio.ok) {
    if (computeMax) appendLog("[EXPORT] WebCodecs audio failed: " + (computeMode.audio.reason || "encoder audio tidak siap")), appendLog("[EXPORT] Falling back to FFmpeg WASM"), computeMode.mode !== "webcodecs" && (computeFlag = true), computeFailComputeValue = computeParsed;else {
      let computeByIndex = computeMode.audio.reason || "encoder audio tidak siap";
      if (appendLog("[EXPORT] Audio diminta tapi tidak didukung: " + computeByIndex), !((await getHelperLocal({
        intro: "Encoder audio (AAC) tidak didukung di perangkat ini. Video bisa tetap diekspor tanpa suara.",
        lines: [computeByIndex],
        canPartial: false
      })) === "noaudio")) {
        idle = "cancelled", localValueInner = "dibatalkan user: audio tidak didukung", setExportStatus("dibatalkan: audio tidak didukung (" + computeByIndex + ')'), appendLog("[EXPORT] Dibatalkan user: audio tidak didukung."), isExporting = false, applyHelper("export"), expstartEl.disabled = false;
        return;
      }
      computeFailComputeValue = false, setExportStatus("audio tidak didukung - ekspor tanpa audio");
    }
  }
  let computeValueByKey = computeUpdate;
  if (computeFailComputeValue) {
    setExportStatus("memeriksa file audio…");
    let computeValueFinal = computeUpdate ? computeUpdate.map(computeUrl => ({
        url: computeUrl.url,
        label: computeUrl.label || "layer audio"
      })) : [{
        url: localOuter,
        label: "Audio project"
      }],
      computeFailRecord = {
        ok: [],
        failed: []
      };
    try {
      computeFailRecord = await helperEl(computeValueFinal, {
        sampleRate: 48000,
        onProgress: computeArgMax => {
          computeArgMax.message && setExportStatus(computeArgMax.message);
        },
        isCancelled: () => exportCancelled
      });
    } catch (computeFinal) {
      appendLog("[EXPORT][AUDIO] Preflight error (dilewati): " + (computeFinal && computeFinal.message));
    }
    if (exportCancelled) {
      idle = "cancelled", setExportStatus("dibatalkan saat memeriksa audio"), helperScoped(), isExporting = false, applyHelper("export"), expstartEl.disabled = false;
      return;
    }
    if (computeFailRecord.failed.length) {
      let computeValueEl = computeFailRecord.ok.length === 0;
      appendLog("[EXPORT][AUDIO] Preflight: " + computeFailRecord.failed.length + " sumber gagal, " + computeFailRecord.ok.length + " ok");
      for (let computeLabel of computeFailRecord.failed) appendLog("[EXPORT][AUDIO] Gagal: " + computeLabel.label + ':\x20' + computeLabel.reason);
      let computeTarget = await getHelperLocal({
        intro: computeValueEl ? "Semua sumber audio gagal di-decode di perangkat ini, jadi video akan tanpa suara kalau dilanjutkan. Belum ada frame yang dirender." : computeFailRecord.failed.length + " dari " + (computeFailRecord.failed.length + computeFailRecord.ok.length) + " sumber audio gagal di-decode. Belum ada frame yang dirender.",
        lines: computeFailRecord.failed.map(computeReason => '•\x20' + computeReason.label + ':\x20' + computeReason.reason),
        canPartial: !computeValueEl
      });
      if (computeTarget === "cancel") {
        idle = "cancelled", localValueInner = "dibatalkan user: audio gagal di-decode", setExportStatus("dibatalkan: audio gagal di-decode"), appendLog("[EXPORT] Dibatalkan user: audio gagal di-decode."), helperScoped(), isExporting = false, applyHelper("export"), expstartEl.disabled = false;
        return;
      }
      if (computeTarget === "noaudio" || computeValueEl) computeFailComputeValue = false, helperScoped(), setExportStatus("ekspor tanpa audio"), appendLog("[EXPORT][AUDIO] User memilih ekspor tanpa audio.");else {
        let computeFailSet = new Set(computeFailRecord.ok.map(urlArg => urlArg.url));
        computeValueByKey = computeUpdate && computeUpdate.filter(computeArgCount => computeFailSet.has(computeArgCount.url)), appendLog("[EXPORT][AUDIO] Lanjut dengan " + computeFailRecord.ok.length + " sumber; " + computeFailRecord.failed.length + " dilewati.");
      }
    }
  }
  appendLog("[EXPORT] Mulai: " + round + 'x' + computeL + " @ " + computeApply + "fps, codec " + computeGet.toUpperCase() + ", mode " + (computeFlag ? "FFmpeg WASM (fallback)" : computeMode.mode === "webcodecs" ? "WebCodecs" : "MediaRecorder (real-time)")), computeFailComputeValue && playbackRate !== 1 && appendLog(pitchkeepEl.checked ? "[EXPORT] Kecepatan audio " + playbackRate.toFixed(3) + "x: pitch di preview dipertahankan, tapi di file hasil ekspor ikut turun (belum ada time-stretch)." : "[EXPORT] Kecepatan audio " + playbackRate.toFixed(3) + "x dipakai di track audio hasil ekspor."), renderer.setResolution(computeL), getPos();
  let computeWorkWidth = renderer.workWidth,
    computeWorkHeight = renderer.workHeight,
    computeValueAlternate = Math.min(80000000, Math.round(computeWorkWidth * computeWorkHeight * computeApply * computeExtra)),
    computeValueSource = (projectScene.totalTime || 0) / 1000,
    computeAlternate = Math.max(0, Number(document.getElementById("expStartSec")?.["value"]) || 0),
    computeFailNumber = Number(document.getElementById("expEndSec")?.["value"]),
    computeSource = computeFailNumber >= computeValueSource - 0.05 ? computeValueSource : computeFailNumber,
    computeByKey = Math.min(projectScene.totalTime, computeAlternate * 1000),
    computeValueTarget = computeSource <= 0 ? projectScene.totalTime : Math.min(projectScene.totalTime, Math.max(computeByKey + 100, computeSource * 1000)),
    computeValueOther = Math.max(100, computeValueTarget - computeByKey),
    computeOther = Math.max(1, Math.round(computeValueOther / (1000 / computeApply)) + 1),
    computeFailList = [];
  expbarEl.value = 0, expbarEl.max = computeOther;
  let computeValueAnother = performance.now(),
    computeValueByIndex = computeMode.mode !== "webcodecs" && !computeFlag;
  renderer.setMediaMode(computeValueByIndex ? "preview" : "export");
  let directVideoEnabled = renderer.directVideoEnabled;
  computeValueByIndex ? renderer.playMedia(1) : renderer.pauseMedia();
  try {
    let computeRecord = {
        canvas: viewEl,
        prepareFrame: computeValueByIndex ? null : computeFailArg => renderer.prepareMedia(Math.min(computeFailArg, projectScene.totalTime)),
        renderFrame: computeArgTotal => renderer.renderAt(Math.min(computeArgTotal, projectScene.totalTime)),
        startMs: computeByKey,
        endMs: computeValueTarget,
        fps: computeApply,
        bitrate: computeValueAlternate,
        codec: computeGet,
        forceFFmpeg: computeFlag,
        audio: computeFailComputeValue ? {
          tracks: computeValueByKey,
          url: computeValueByKey ? '' : localOuter,
          rate: playbackRate,
          offsetMs: audioOffsetMs,
          inTimeMs: buildHelperScoped(),
          sampleRate: (() => {
            let expAudioSr = document.getElementById("expAudioSr"),
              computeValueInput = expAudioSr ? expAudioSr.value : "auto";
            return computeValueInput === "auto" ? 44100 : Number(computeValueInput) || 44100;
          })(),
          bitrate: 128000
        } : null,
        isCancelled: () => exportCancelled,
        onProgress: phase => {
          let computeValueRaw = {
            prepare: "Menyiapkan proyek",
            assets: "Memuat aset",
            media: "Memuat media",
            mulai: "Mulai encoding",
            render: "Merender frame",
            encode: "Encoding video",
            audio: "Memproses audio",
            mux: "Menggabungkan (mux)",
            finalize: "Menyelesaikan file",
            fallback: "Fallback FFmpeg",
            selesai: "Selesai",
            batal: "Dibatalkan",
            gagal: "Gagal"
          }[phase.phase] || phase.phase;
          try {
            let pctCalc = phase.total && phase.frame ? Math.min(100, Math.round((phase.frame / phase.total) * 100)) : (phase.phase === "selesai" ? 100 : 0);
            let etaCalc = phase.avgMs && phase.total && phase.frame ? Math.max(0, phase.avgMs * (phase.total - phase.frame)) : 0;
            window.dispatchEvent(new CustomEvent("am-export-progress", {
              detail: {
                phase: phase.phase,
                frame: phase.frame || 0,
                total: phase.total || 0,
                pct: pctCalc,
                etaMs: etaCalc,
                avgMs: phase.avgMs || 0,
                status: computeValueRaw,
                message: phase.message || ''
              }
            }));
          } catch(computeResolved){}
          if (phase.phase !== "render" && renderHelper("export", "Mengekspor video…", computeValueRaw), phase.phase === "prepare" || phase.phase === "mux" || phase.phase === "finalize" || phase.phase === "encode") {
            phase.message && appendLog("[EXPORT] " + computeValueRaw + ':\x20' + phase.message), setExportStatus('' + computeValueRaw + (phase.message ? " - " + phase.message : ''));
            return;
          }
          if (phase.phase === "fallback") {
            let computeValueOuter = phase.message || (phase.stage ? '(' + phase.stage + ')' : '');
            renderHelper("export", "Mengekspor video…", '' + computeValueRaw + (computeValueOuter ? " - " + computeValueOuter : '')), phase.stage === "ffmpeg-core" || phase.stage === "ffmpeg-wasm" || phase.stage === "encode-progress" || appendLog("[EXPORT] " + (computeValueOuter || computeValueRaw)), setExportStatus('' + computeValueRaw + (computeValueOuter ? " - " + computeValueOuter : ''));
            return;
          }
          if (phase.phase === "mulai") {
            renderHelper("export", "Mengekspor video…", "codec " + phase.codec.toUpperCase() + " | " + phase.total + " frame"), setExportStatus("codec " + phase.codec.toUpperCase() + " | " + phase.width + 'x' + phase.height + " | " + (phase.bitrate / 1000000).toFixed(1) + " Mbps | " + phase.total + " frame");
            return;
          }
          if (phase.phase === "render") {
            renderHelper("export", "Mengekspor video…", "frame " + phase.frame + '/' + phase.total + '\x20(' + (phase.frame / phase.total * 100).toFixed(0) + '%)'), computeFailList.push(phase.msPerFrame), computeFailList.length > 48 && computeFailList.shift(), expbarEl.value = phase.frame;
            let computeValueInitial = phase.avgMs * (phase.total - phase.frame),
              computeInitial = phase.frame / phase.total * 100;
            setExportStatus("frame " + phase.frame + '/' + phase.total + '\x20(' + computeInitial.toFixed(1) + "%)  " + phase.msPerFrame.toFixed(1) + " ms/frame  | total " + (phase.elapsedMs / 1000).toFixed(1) + "s  (avg " + phase.avgMs.toFixed(1) + ", min " + phase.minMs.toFixed(1) + ", max " + phase.maxMs.toFixed(1) + ")\nrender " + phase.renderFps.toFixed(1) + " fps | " + handleRaw(phase.encodedBytes) + " | ETA " + (phase.realtime ? "real-time" : updateHelperClamped(computeValueInitial)) + '\x0a' + joinHelper(computeFailList));
            return;
          }
          if (phase.phase === "audio") {
            renderHelper("export", "Menyiapkan track audio (AAC)…", phase.stage || ''), (phase.stage === "skip" || phase.stage === "fallback" || phase.stage === "gagal" || phase.stage === "info") && appendLog("[EXPORT][AUDIO] " + phase.stage + ':\x20' + (phase.message || phase.error || ''));
            let computeValuePending = phase.total ? '\x20(' + ((phase.frames || 0) / phase.total * 100).toFixed(0) + '%)' : '',
              computePending = {
                prepare: "menyiapkan audio",
                decode: "membaca file audio",
                render: "memotong audio di grid waktu project",
                encode: "encode AAC",
                ok: "audio siap",
                gagal: "audio GAGAL"
              }[phase.stage] || phase.stage;
            setExportStatus("audio: " + computePending + computeValuePending + (phase.packets ? "  | " + phase.packets + " paket" : '') + (phase.stage === 'ok' ? "  | " + phase.channels + "ch " + phase.sampleRate + "Hz, " + phase.seconds.toFixed(2) + "s, " + handleRaw(phase.bytes) : '') + (phase.message ? '\x0a' + phase.message : ''));
            return;
          }
        }
      },
      computeStatus;
    try {
      computeStatus = await resHelperValue(computeRecord);
    } catch (audioFailure) {
      let computeInput = false;
      if (audioFailure.audioFailure && !exportCancelled && (computeInput = (await getHelperLocal({
        intro: "Audio gagal diproses di tengah ekspor. Video bisa diulang tanpa suara.",
        lines: [audioFailure.message],
        canPartial: false
      })) === "noaudio"), computeInput) appendLog("[EXPORT] Audio gagal; user memilih lanjut tanpa audio."), computeFailComputeValue = false, setExportStatus("audio gagal - melanjutkan tanpa audio"), computeStatus = await resHelperValue({
        ...computeRecord,
        audio: null,
        forceFFmpeg: false
      });else throw audioFailure;
    }
    let computeLocal = performance.now() - computeValueAnother,
      download = (projectScene.title || "preset").replace(/[^\w.-]+/g, '_') + '-' + computeWorkHeight + 'p' + computeApply + "fps.mp4";
    if (exportCancelled || computeStatus.status === "cancelled" || computeStatus.cancelled) {
      idle = "cancelled", setExportStatus("dibatalkan di frame " + computeStatus.frames + '\x20(' + updateHelperClamped(computeLocal) + ')'), appendLog("[EXPORT] Dibatalkan setelah " + computeStatus.frames + " frame.");
      try { window.dispatchEvent(new CustomEvent("am-export-cancelled")); } catch(computeValueConverted){}
    } else {
      if (computeStatus.status !== "success" || !computeStatus.blob) throw new Error("Ekspor tidak selesai dengan benar (status: " + (computeStatus.status || "tidak diketahui") + ').');
      {
        exportBlobUrl = URL.createObjectURL(computeStatus.blob);
        let linkEl = document.createElement('a');
        if (linkEl.href = exportBlobUrl, linkEl.download = download, linkEl.className = "btn primary block", linkEl.innerHTML = localValueByKey("download", 'sm') + "<span></span>", linkEl.lastChild.textContent = "Unduh " + download + '\x20(' + handleRaw(computeStatus.blob.size) + ')', expresultEl.textContent = '', computeStatus.audio) {
          let videoEl = document.createElement("video");
          videoEl.controls = true, videoEl.playsInline = true, videoEl.preload = "metadata", videoEl.load(), videoEl.addEventListener("loadedmetadata", () => {
            appendLog("[PREVIEW] metadata: " + videoEl.videoWidth + 'x' + videoEl.videoHeight + ',\x20' + videoEl.duration.toFixed(2) + 's');
          }), videoEl.addEventListener("canplay", () => {
            appendLog("[PREVIEW] canplay");
          }), videoEl.addEventListener("error", () => {
            let computeError = videoEl.error;
            appendLog("[PREVIEW] ERROR code=" + computeError?.["code"] + " message=" + (computeError?.["message"] || '-'));
          }), videoEl.style.touchAction = "pan-y", videoEl.src = exportBlobUrl;
          let divEl = document.createElement("div");
          divEl.className = "mono";
          let computeValueResolved = computeStatus.codec === "h265" ? "H.265" : "H.264";
          divEl.textContent = "preview file hasil ekspor (MP4/" + computeValueResolved + " + AAC, " + computeStatus.audio.channels + "ch " + computeStatus.audio.sampleRate + "Hz)", expresultEl.appendChild(videoEl), expresultEl.appendChild(divEl);
        }
        expresultEl.appendChild(linkEl), idle = "success", setExportStatus("selesai: " + computeStatus.frames + " frame, " + handleRaw(computeStatus.blob.size) + ',\x20' + updateHelperClamped(computeLocal) + "\nfile: " + computeStatus.width + 'x' + computeStatus.height + " @ " + computeStatus.fps + "fps, " + (computeStatus.bitrate ? (computeStatus.bitrate / 1000000).toFixed(1) + " Mbps" : '-') + " (diminta " + computeWorkWidth + 'x' + computeWorkHeight + ')' + (computeStatus.profile ? "\nper frame: seek video " + computeStatus.profile.prepare.toFixed(0) + " ms | render " + computeStatus.profile.render.toFixed(0) + " | ambil+encode " + computeStatus.profile.encode.toFixed(0) + " | antre " + computeStatus.profile.queue.toFixed(0) : '') + ("\ntrack audio: " + (computeStatus.audio ? "AAC " + computeStatus.audio.channels + "ch " + computeStatus.audio.sampleRate + 'Hz' : "tidak ada") + "\nrata-rata " + (computeLocal / computeStatus.frames).toFixed(1) + " ms/frame (" + (computeStatus.frames / (computeLocal / 1000)).toFixed(1) + " frame/detik saat ekspor)\n" + joinHelper(computeFailList))), computeStatus.profile && appendLog("[EXPORT] Profil per frame (ms): " + JSON.stringify(computeStatus.profile, (computeArgCurrent, computeFailFlag) => typeof computeFailFlag == "number" ? Math.round(computeFailFlag) : computeFailFlag) + "; file " + computeStatus.width + 'x' + computeStatus.height), appendLog("[EXPORT] Selesai: " + computeStatus.frames + " frame, " + handleRaw(computeStatus.blob.size) + ", codec " + computeStatus.codec + ", mode " + computeStatus.mode + ", audio " + (computeStatus.audio ? "AAC" : "tidak ada") + ',\x20' + updateHelperClamped(computeLocal) + '.');
        try {
          if (window.__AM_INTERNAL) {
            window.__AM_INTERNAL._lastExport = {
              blob: computeStatus.blob,
              url: exportBlobUrl,
              filename: download,
              frames: computeStatus.frames,
              width: computeStatus.width,
              height: computeStatus.height,
              fps: computeStatus.fps,
              bitrate: computeStatus.bitrate,
              codec: computeStatus.codec,
              duration: (projectScene?.totalTime || 0) / 1000
            };
          }
          window.dispatchEvent(new CustomEvent("am-export-complete", {
            detail: {
              blob: computeStatus.blob,
              url: exportBlobUrl,
              filename: download,
              frames: computeStatus.frames,
              width: computeStatus.width,
              height: computeStatus.height,
              fps: computeStatus.fps,
              bitrate: computeStatus.bitrate,
              codec: computeStatus.codec,
              duration: (projectScene?.totalTime || 0) / 1000
            }
          }));
        } catch(computeConverted){}
      }
    }
  } catch (computeMessage) {
    idle = exportCancelled ? "cancelled" : "failed", localValueInner = computeMessage.message, computeMessage.audioFailure ? (setExportStatus("GAGAL (audio): " + computeMessage.message), appendLog("[EXPORT] Audio gagal -> ekspor dibatalkan: " + computeMessage.message), getHelperValue("Audio diminta, tetapi gagal diproses. Ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.\n\n" + computeMessage.message)) : exportCancelled ? (setExportStatus("dibatalkan: " + computeMessage.message), appendLog("[EXPORT] Dibatalkan: " + computeMessage.message)) : (setExportStatus("GAGAL: " + computeMessage.message), appendLog("[EXPORT] Gagal: " + computeMessage.message), getHelperValue("Ekspor gagal: " + computeMessage.message));
    try {
      window.dispatchEvent(new CustomEvent("am-export-error", { detail: { message: computeMessage.message || String(computeMessage) } }));
    } catch(computeValueDerived){}
  } finally {
    helperScoped(), isExporting = false, applyHelper("export"), expstartEl.disabled = false, renderer.directVideoEnabled = directVideoEnabled, renderer.setMediaMode("preview"), renderer.pauseMedia(), renderer.setResolution(workHeightValue), getPos(), isDirty = true, reslabelEl.textContent = renderer.workWidth + 'x' + renderer.workHeight + " (canvas " + viewEl.width + 'x' + viewEl.height + ')';
  }
}
impxmlEl.addEventListener("change", localArgBase => {
  let localEntryEdge = [...localArgBase.target.files];
  if (localArgBase.target.value = '', !renderer) {
    appendLog("[IMPORT] Harap tunggu renderer selesai diinisialisasi.");
    return;
  }
  applyHelperValue(localEntryEdge).catch(localArgPoint => appendLog("[IMPORT] " + localArgPoint.message));
}), impphotoEl.addEventListener("change", argBase => {
  let localEntryCenter = [...argBase.target.files];
  argBase.target.value = '', getHelperClamped(localEntryCenter).catch(argPoint => appendLog("[IMPORT] " + argPoint.message));
}), imppickEl.addEventListener("change", () => {
  renderHelperStart(Number(imppickEl.value), []).catch(localArgLine => appendLog("[IMPORT] " + localArgLine.message));
}), impresetEl.addEventListener("click", () => {
  processLocal().catch(argLine => appendLog("[IMPORT] " + argLine.message));
}), urltiktokgoEl.addEventListener("click", () => renderHelperEnd()), urlamgoEl.addEventListener("click", () => flagHelper()), urlampickEl.addEventListener("change", () => flagHelper(urlampickEl.value)), urldrivegoEl.addEventListener("click", () => getFlag()), urldriveEl.addEventListener("keydown", localArgRect => {
  localArgRect.key === "Enter" && getFlag();
}), document.getElementById("tl-bm").addEventListener("click", () => handleLocal()), document.getElementById("tl-bm-next").addEventListener("click", () => processScoped(1)), document.getElementById("tl-bm-prev").addEventListener("click", () => processScoped(-1)), urlDriveAudioGoEl.addEventListener("click", () => buildFail()), urldriveaudiEl.addEventListener("keydown", argRect => {
  argRect.key === "Enter" && buildFail();
});
document.querySelectorAll(".range-reset[data-reset]").forEach(addEventListenerArg => {
  addEventListenerArg.addEventListener("click", () => renderHelperList(document.getElementById(addEventListenerArg.dataset.reset), addEventListenerArg.dataset.default));
}), document.getElementById("seekReset").addEventListener("click", () => {
  seekToTime(0), requestPlayback(false);
});
var expbitratelaEl = document.getElementById("expBitrateLabel");
expbitrateEl.addEventListener("input", applyHelperStart), applyHelperStart();
var expstartsecEl = document.getElementById("expStartSec"),
  expendsecEl = document.getElementById("expEndSec"),
  expstartseclEl = document.getElementById("expStartSecLabel"),
  expendseclabEl = document.getElementById("expEndSecLabel");
expstartsecEl?.["addEventListener"]("input", () => {
  expendsecEl && Number(expstartsecEl.value) >= Number(expendsecEl.value) && (expstartsecEl.value = Math.max(0, Number(expendsecEl.value) - 0.1)), updateHelperParsed();
}), expendsecEl?.["addEventListener"]("input", () => {
  expstartsecEl && Number(expendsecEl.value) <= Number(expstartsecEl.value) && (expendsecEl.value = Math.min(Number(expstartsecEl.max) || 100, Number(expstartsecEl.value) + 0.1)), updateHelperParsed();
}), document.getElementById("expStartReset")?.["addEventListener"]("click", () => {
  expstartsecEl && (expstartsecEl.value = 0, updateHelperParsed());
}), document.getElementById("expEndReset")?.["addEventListener"]("click", () => {
  let localEntryBase = projectScene && projectScene.totalTime / 1000 || 100;
  expendsecEl && (expendsecEl.value = localEntryBase, updateHelperParsed());
});
var localValueStage = [["Spasi", "putar / jeda"], ["<- / ->", "mundur / maju 1 frame (Shift 1 detik, Ctrl 10 detik)"], ["Home / End", "ke awal / akhir"], ["+ / -", "zoom timeline"], ['L', "loop"], ['F', "gulir timeline ke playhead"], ['R', "reset posisi ke 0"], ['M', "bisukan suara layer"], ['B', "pasang / buang penanda (bookmark) di posisi ini"], ["N / Shift+N", "lompat ke penanda berikutnya / sebelumnya"]];
{
  let shortcutRows = document.getElementById("shortcutRows");
  shortcutRows && (shortcutRows.innerHTML = localValueStage.map(([localArgPath, argPath]) => "<tr><td><kbd>" + localNodeResolved(localArgPath) + "</kbd></td><td>" + localNodeResolved(argPath) + "</td></tr>").join(''));
}
function handleHelperMap(ctrlKey) {
  if (ctrlKey.ctrlKey || ctrlKey.metaKey || ctrlKey.altKey) return;
  let handleTarget = ctrlKey.target,
    handleHelperMapValue = handleTarget && handleTarget.tagName;
  if (["INPUT", "SELECT", "TEXTAREA", "DIALOG", "BUTTON"].includes(handleHelperMapValue) || handleTarget && handleTarget.isContentEditable || isExporting || !projectScene) return;
  let handleValueOutput = 1000 / (projectScene.fps || 30),
    handleTotal = ctrlKey.shiftKey ? 1000 : ctrlKey.ctrlKey || ctrlKey.metaKey ? 10000 : handleValueOutput;
  switch (ctrlKey.key) {
    case '\x20':
    case "Spacebar":
      ctrlKey.preventDefault(), requestPlayback(!isPlaying);
      break;
    case "ArrowLeft":
      ctrlKey.preventDefault(), requestPlayback(false), buildHelperOuter(-handleTotal);
      break;
    case "ArrowRight":
      ctrlKey.preventDefault(), requestPlayback(false), buildHelperOuter(handleTotal);
      break;
    case "Home":
      ctrlKey.preventDefault(), buildHelperOuter(-playheadMs);
      break;
    case "End":
      ctrlKey.preventDefault(), seekToTime(projectScene.totalTime);
      break;
    case '+':
    case '=':
      ctrlKey.preventDefault(), getHelperRaw(localNodeFinal * 1.5, true);
      break;
    case '-':
    case '_':
      ctrlKey.preventDefault(), getHelperRaw(localNodeFinal / 1.5, true);
      break;
    case 'l':
    case 'L':
      ctrlKey.preventDefault(), loopbtnEl.click();
      break;
    case 'b':
    case 'B':
      handleLocal();
      break;
    case 'n':
    case 'N':
      processScoped(ctrlKey.shiftKey ? -1 : 1);
      break;
    case 'f':
    case 'F':
      ctrlKey.preventDefault(), localValueNext = false, buildHelperValue(true);
      break;
    case 'r':
    case 'R':
      ctrlKey.preventDefault(), requestPlayback(false), seekToTime(0);
      break;
    case 'm':
    case 'M':
      {
        let videoAudioMute = document.getElementById("videoAudioMute");
        videoAudioMute && (ctrlKey.preventDefault(), videoAudioMute.checked = !videoAudioMute.checked, videoAudioMute.dispatchEvent(new Event("change", {
          bubbles: true
        })));
        break;
      }
    default:
      break;
  }
}
window.addEventListener("keydown", handleHelperMap), expstartEl.addEventListener("click", () => computeFail()), expcancelEl.addEventListener("click", () => {
  exportCancelled = true;
}), expfpsEl.addEventListener("change", () => {
  expFpsCustomRowEl.style.display = expfpsEl.value === "custom" ? '' : "none", expfpsEl.value === "custom" && (expfpscustomEl.value = String(applyHelperScoped()));
}), rateEl.addEventListener("input", () => computeHelperClamped(Number(rateEl.value), true)), rateEl.addEventListener("change", () => computeHelperClamped(Number(rateEl.value), false)), pitchkeepEl.addEventListener("change", () => computeHelperClamped(playbackRate, false)), document.getElementById("videoAudioMute")?.["addEventListener"]("change", localArgEffect => {
  buildHelperLocal(), appendLog("[AUDIO] Suara video layer: " + (localArgEffect.target.checked ? "Unmuted (suara video aktif)" : "Muted (di-bisu)") + (hasMediaItems ? " - suara project tetap dari layer video" : ''));
}), rateautoEl.addEventListener("click", () => {
  if (!volume || !Number.isFinite(volume.duration) || volume.duration <= 0) {
    appendLog("[SYNC] Durasi file audio belum terbaca; tunggu audio siap dulu.");
    return;
  }
  let localHandle = handleHelperStart(),
    localValueSpan = volume.duration * 1000;
  computeHelperClamped(localValueSpan / localHandle, true), renderHelperParsed(), appendLog("[SYNC] Dicocokkan: file " + (localValueSpan / 1000).toFixed(2) + "s -> project " + (localHandle / 1000).toFixed(2) + "s, kecepatan audio " + playbackRate.toFixed(3) + 'x');
}), offsetEl.addEventListener("input", () => {
  audioOffsetMs = Number(offsetEl.value), offsetlabelEl.textContent = '' + (audioOffsetMs > 0 ? '+' : '') + audioOffsetMs + " ms", helperParsed(), buildHelperRaw(playheadMs), isDirty = true;
}), document.getElementById("restart").addEventListener("click", () => {
  seekToTime(0);
}), loopbtnEl.addEventListener("click", () => {
  loopPlayback = !loopPlayback, loopbtnEl.classList.toggle('on', loopPlayback), loopbtnEl.title = loopPlayback ? "Ulangi otomatis: nyala" : "Ulangi otomatis: mati", looplabelEl.textContent = loopPlayback ? "Loop" : "Loop mati";
}), seekEl.addEventListener("pointerdown", () => {
  isScrubbing = true;
}), seekEl.addEventListener("pointerup", () => {
  isScrubbing = false;
}), seekEl.addEventListener("pointercancel", () => {
  isScrubbing = false;
}), window.addEventListener("pointerup", () => {
  isScrubbing = false;
}), seekEl.addEventListener("input", () => {
  seekToTime(Number(seekEl.value));
}), scaleEl.addEventListener("input", () => {
  renderer.mediaScale = Number(scaleEl.value), scalelabelEl.textContent = Number(scaleEl.value).toFixed(2) + 'x', isDirty = true;
}), sizescaleEl.addEventListener("change", () => {
  renderer.sizeScale = sizescaleEl.value === "auto" ? renderer.autoSizeScale : Number(sizescaleEl.value), appendLog("[SCENE] Ukuran kotak layer: x" + renderer.sizeScale + (renderer.sizeScale === 2 ? " -> size XML dikali 2, jadi layer yang size-nya setengah layar akan menutupi seluruh layar (efek tile/mirror jadi tidak kelihatan)." : " -> size XML dipakai apa adanya, jadi kotak layer setengah layar kalau size = setengah comp (efek tile/mirror kelihatan).") + " Kalau hasilnya tidak sama dengan AM, tukar pilihannya."), isDirty = true;
}), document.getElementById("debugModeToggle")?.["addEventListener"]("change", localArgStepped => {
  if (renderer) {
    if (renderer.debugMode = localArgStepped.target.checked, !localArgStepped.target.checked && debugcanvasEl) {
      let ctx = debugcanvasEl.getContext('2d');
      ctx && ctx.clearRect(0, 0, debugcanvasEl.width, debugcanvasEl.height);
    }
    isDirty = true, appendLog("[DEBUG] Mode Debug Visual: " + (renderer.debugMode ? "AKTIF (border hijau/merah)" : "NONAKTIF"));
  }
});
function processHelperStart(processArgStart) {
  targetFps = applyRaw(), fpstargetEl.value === "custom" && !processArgStart && (fpscustomEl.value = String(targetFps)), smoothedFrameMs = 0, recentFrameTimes.length = 0, appendLog("[PERF] Target FPS: " + targetFps + (fpstargetEl.value === "custom" ? " (custom)" : ''));
}
fpstargetEl.addEventListener("change", () => {
  fpscustomrowEl.style.display = fpstargetEl.value === "custom" ? '' : "none", processHelperStart(false);
}), fpscustomEl.addEventListener("input", () => {
  targetFps = applyRaw();
}), fpscustomEl.addEventListener("change", () => processHelperStart(true)), fxtoggleEl.addEventListener("change", () => {
  renderer.effectsEnabled = fxtoggleEl.checked, appendLog("[PERF] Rantai efek: " + (fxtoggleEl.checked ? 'ON' : "OFF")), isDirty = true;
});
var debugmodetogEl = document.getElementById("debugModeToggle");
{
  let debugModeToggleEl = document.getElementById("debugModeToggle2");
  debugModeToggleEl && debugmodetogEl && (debugModeToggleEl.addEventListener("change", () => {
    debugmodetogEl.checked = debugModeToggleEl.checked, debugmodetogEl.dispatchEvent(new Event("change"));
  }), debugmodetogEl.addEventListener("change", () => {
    debugModeToggleEl.checked = debugmodetogEl.checked;
  }));
}
var debugoverlayEl = document.getElementById("debugOverlay"),
  dbgcontentEl = document.getElementById("dbgContent");
document.getElementById("dbgCloseBtn")?.["addEventListener"]("click", () => {
  debugmodetogEl && (debugmodetogEl.checked = false), debugoverlayEl && (debugoverlayEl.style.display = "none");
});
function tElement(tN) {
  if (!debugmodetogEl || !debugmodetogEl.checked || !debugoverlayEl || !dbgcontentEl) {
    debugoverlayEl && (debugoverlayEl.style.display = "none");
    return;
  }
  if (debugoverlayEl.style.display = "block", !tN || !renderer) {
    dbgcontentEl.innerHTML = "<div>Pilih layer pada timeline untuk inspect efek & transform.</div>";
    return;
  }
  let tTransform, tElementTValue;
  try {
    let tMax = Math.max(0, playheadMs - (tN.ce || 0)),
      tValueScoped = renderer.X(tN, tMax);
    tTransform = renderer.te(tN, tValueScoped ?? 0, tMax / 1000);
    let tSe = renderer.se(tN, tN.N || projectScene);
    tElementTValue = renderer.fe(tN, tSe);
  } catch (tMessage) {
    dbgcontentEl.innerHTML = "<div style=\"color:#ff8a8a;\">Gagal baca state layer: " + localNodeResolved(String(tMessage.message || tMessage)) + "</div>";
    return;
  }
  let tValue = tTransform.transform?.["location"] || {
      x: 0,
      y: 0
    },
    tX = tTransform.transform?.["scale"] || {
      x: 1,
      y: 1
    },
    tValueParsed = tTransform.transform?.["angle"] ?? 0,
    tParsed = tTransform.alpha ?? 1,
    tValueClamped = tElementTValue?.[0] ?? '?',
    tClamped = tElementTValue?.[1] ?? '?',
    innerHtml = "<div style=\"border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px;\">\n        <strong style=\"color:var(--accent);\">" + localNodeResolved(tN.label || tN.id) + "</strong> (" + localNodeResolved(tN.tag || "layer") + ")\n        <br><span style=\"color:#aaa;\">Ukuran Content:</span> " + tValueClamped + 'x' + tClamped + " px\n        <br><span style=\"color:#aaa;\">Opacity:</span> " + (tParsed * 100).toFixed(0) + "%\n        <br><span style=\"color:#aaa;\">Posisi:</span> (" + tValue.x.toFixed(1) + ',\x20' + tValue.y.toFixed(1) + ") | Rotasi: " + tValueParsed.toFixed(1) + "°\n        <br><span style=\"color:#aaa;\">Skala:</span> (" + tX.x.toFixed(2) + ',\x20' + tX.y.toFixed(2) + ")\n    </div>";
  innerHtml += "<div style=\"font-weight:bold; margin-top:4px; color:#a793ff;\">Rantai Efek & Status:</div>", !tN.effects || !tN.effects.length ? innerHtml += "<div style=\"color:#888;\">(Layer ini tidak memiliki efek)</div>" : tN.effects.forEach((tId, tText) => {
    let tValueRaw = localByIndex.get(tId.id),
      tFlag = tId.disabled || tId.hidden === true || tId.hidden === "true",
      tScoped = tValueRaw && tValueRaw.name || tId.id;
    innerHtml += "<div style=\"background:rgba(255,255,255,0.06); padding:4px 6px; border-radius:4px; margin-top:2px; display:flex; justify-content:space-between; align-items:center;\">\n                <div>\n                    <span style=\"color:" + (tFlag ? "#ff8a8a" : "#79dc98") + ";\">" + (tFlag ? "OFF" : 'ON') + "</span>\n                    <strong>#" + (tText + 1) + '\x20' + localNodeResolved(tScoped) + "</strong>\n                </div>\n                <button type=\"button\" class=\"btn sm dbg-fx-btn\" data-fx-idx=\"" + tText + "\" style=\"min-height:22px; padding:0 6px; font-size:10px;\">" + (tFlag ? "Aktifkan" : "Matikan") + "</button>\n            </div>";
  }), dbgcontentEl.innerHTML = innerHtml, dbgcontentEl.querySelectorAll(".dbg-fx-btn").forEach(tAddEventListener => {
    tAddEventListener.addEventListener("click", tTarget => {
      let tNumber = Number(tTarget.target.dataset.fxIdx);
      if (tN.effects && tN.effects[tNumber]) {
        let tRaw = tN.effects[tNumber].disabled || tN.effects[tNumber].hidden === true || tN.effects[tNumber].hidden === "true";
        tN.effects[tNumber].disabled = !tRaw, tN.effects[tNumber].hidden = !tRaw, isDirty = true, tElement(tN), bindElement(tN, localTracked || 0, tN.ce || 0);
      }
    });
  });
}
debugmodetogEl?.["addEventListener"]("change", () => {
  if (appendLog("[DEBUG] Mode Debug Visual & Inspector: " + (debugmodetogEl.checked ? 'ON' : "OFF")), renderer && (renderer.debugMode = debugmodetogEl.checked), !debugmodetogEl.checked && debugcanvasEl) {
    let ctx = debugcanvasEl.getContext('2d');
    ctx && ctx.clearRect(0, 0, debugcanvasEl.width, debugcanvasEl.height);
  }
  isDirty = true, valuePrev ? (tElement(valuePrev), bindElement(valuePrev, localTracked, valuePrev.ce || 0)) : debugoverlayEl && (debugoverlayEl.style.display = debugmodetogEl.checked ? "block" : "none");
}), qualityEl.addEventListener("change", () => {
  renderer.setResolution(Number(qualityEl.value)), reslabelEl.textContent = renderer.workWidth + 'x' + renderer.workHeight + " (canvas " + viewEl.width + 'x' + viewEl.height + ')', getPos(), isDirty = true;
});
var enginehintEl = document.getElementById("engineHint"),
  enginerowsEl = document.getElementById("engineRows"),
  valueSorted = [{
    key: "directVideoEnabled",
    label: "Video lewat tekstur GPU",
    hint: "Mati = paksa kanvas 2D (fallback)",
    kind: "bool",
    def: true,
    get: localDirectVideoEnabled => localDirectVideoEnabled.directVideoEnabled,
    set: (directVideoEnabledArg, argEffect) => {
      directVideoEnabledArg.directVideoEnabled = argEffect;
    }
  }, {
    key: "force2DSubScene",
    label: "Paksa embedScene lewat kanvas 2D",
    kind: "bool",
    def: false,
    get: forceDSubSceneArg => forceDSubSceneArg.force2DSubScene,
    set: (forceDSubScene, localForceDSubScene) => {
      forceDSubScene.force2DSubScene = localForceDSubScene;
    }
  }, {
    key: "effectsEnabled",
    label: "Jalankan efek shader",
    kind: "bool",
    def: true,
    get: effectsEnabled => effectsEnabled.effectsEnabled,
    set: (localEffectsEnabled, effectsEnabledArg) => {
      localEffectsEnabled.effectsEnabled = effectsEnabledArg;
    }
  }, {
    key: "overscanMax",
    label: "Batas overscan efek",
    hint: "0-2; makin besar makin boros",
    kind: "num",
    min: 0,
    max: 2,
    step: 0.05,
    def: 0.5,
    get: overscanMax => overscanMax.overscanMax,
    set: (localOverscanMax, overscanMaxArg) => {
      localOverscanMax.overscanMax = overscanMaxArg;
    }
  }, {
    key: "mediaScale",
    label: "Skala media global",
    kind: "num",
    min: 0.1,
    max: 4,
    step: 0.05,
    def: 1,
    get: mediaScale => mediaScale.mediaScale,
    set: (localMediaScale, mediaScaleArg) => {
      localMediaScale.mediaScale = mediaScaleArg;
    }
  }, {
    key: "videoDriftMs",
    label: "Koreksi drift video (ms)",
    kind: "num",
    min: 10,
    max: 2000,
    step: 10,
    def: 300,
    get: videoDriftMs => videoDriftMs.videoDriftMs,
    set: (localVideoDriftMs, videoDriftMsArg) => {
      localVideoDriftMs.videoDriftMs = videoDriftMsArg;
    }
  }, {
    key: "targetBudgetMB",
    label: "Batas cache FBO (MB)",
    kind: "num",
    min: 32,
    max: 1024,
    step: 16,
    def: 192,
    get: targetBudget => Math.round((targetBudget.targetBudget || 0) / 1048576),
    set: (localTargetBudget, rsValue) => {
      localTargetBudget.targetBudget = rsValue * 1048576;
    }
  }, {
    key: "forceWebGL1",
    label: "Paksa WebGL1 (GLSL ES 1.00)",
    kind: "bool",
    store: "am.forceWebGL1",
    def: false,
    reload: true
  }, {
    key: "engineAntialias",
    label: "Antialias kanvas",
    kind: "bool",
    store: "am.engineAntialias",
    def: false,
    reload: true
  }, {
    key: "engineOpaque",
    label: "Kanvas opaque (tanpa alpha)",
    kind: "bool",
    store: "am.engineOpaque",
    def: false,
    reload: true
  }, {
    key: "enginePower",
    label: "Power preference GPU",
    kind: "select",
    store: "am.enginePower",
    options: ["high-performance", "low-power", "default"],
    def: "high-performance",
    reload: true
  }];
function buildHelperCount(buildStore, bool) {
  if (buildStore.store) {
    let boolValue = buildStore.kind === "bool" ? bool.checked : null;
    applyStart(buildStore, buildStore.kind === "bool" ? boolValue ? '1' : '0' : bool.value), appendLog("[ENGINE] " + buildStore.label + ':\x20' + (buildStore.kind === "bool" ? boolValue ? 'ON' : "OFF" : bool.value) + (buildStore.reload ? " (muat ulang halaman untuk menerapkan)" : ''));
    return;
  }
  if (!renderer) return;
  let buildBool = buildStore.kind === "bool" ? bool.checked : Number(bool.value);
  buildStore.kind === "num" && (Number.isFinite(buildBool) || (buildBool = buildStore.def), buildBool = Math.max(buildStore.min, Math.min(buildStore.max, buildBool)), bool.value = String(buildBool)), buildStore.set(renderer, buildBool), buildStore.key === "mediaScale" && typeof scaleEl < 'u' && scaleEl && (scaleEl.value = String(buildBool), updateHelperValue(scaleEl)), appendLog("[ENGINE] " + buildStore.label + ':\x20' + (buildStore.kind === "bool" ? buildBool ? 'ON' : "OFF" : buildBool)), helperOuter(), isDirty = true;
}
document.getElementById("engineReset")?.["addEventListener"]("click", () => {
  for (let localStore of valueSorted) localStore.store ? applyStart(localStore, localStore.kind === "bool" ? localStore.def ? '1' : '0' : localStore.def) : renderer && localStore.set(renderer, localStore.def);
  processHelperOuter(), appendLog("[ENGINE] Konfigurasi renderer dikembalikan ke bawaan."), isDirty = true;
});
var exprowsEl = document.getElementById("expRows"),
  expcatsEl = document.getElementById("expCats"),
  exphintEl = document.getElementById("expHint"),
  expEnabledEl = document.getElementById("exp-enabled"),
  valueStage = {
    identical: "identik",
    edges: "beda di tepi",
    visible: "tampilan berubah"
  };
function computeHelperScoped() {
  buildHelperByKey(localRef), renderer && renderer.setExperimental(handleHelperLocal(localRef)), isDirty = true, renderHelperMin(), helperOuter();
}
expEnabledEl?.["addEventListener"]("change", () => {
  localRef.enabled = expEnabledEl.checked, computeHelperScoped();
});
for (let [localEntryStepped, valueSpan] of [["expPresetAman", "aman"], ["expPresetCepat", "cepat"], ["expPresetEkstrem", "ekstrem"], ["expPresetProfil", "profil"]]) document.getElementById(localEntryStepped)?.["addEventListener"]("click", () => {
  let localVal = valueMode[valueSpan];
  localRef = {
    ...freeze,
    ...localVal,
    categorySet: [...(localVal.categorySet || [])],
    enabled: true
  }, buildHelperParsed(), computeHelperScoped(), appendLog("[EXP] Preset " + valueSpan + " diterapkan.");
});
document.getElementById("expReset")?.["addEventListener"]("click", () => {
  localRef = {
    ...freeze,
    categorySet: []
  }, buildHelperParsed(), computeHelperScoped(), appendLog("[EXP] Eksperimen direset (mati).");
}), document.getElementById("expProfReset")?.["addEventListener"]("click", () => {
  renderer && renderer.resetProfile(), appendLog("[EXP] Profil direset.");
}), document.getElementById("expProfCopy")?.["addEventListener"]("click", async () => {
  let localRange = renderer ? renderer.profileSummary() : null;
  if (!localRange) {
    appendLog("[EXP] Belum ada profil: aktifkan Profiler lalu putar/ekspor beberapa frame.");
    return;
  }
  let stringify = JSON.stringify(localRange, null, 2);
  try {
    await navigator.clipboard.writeText(stringify), appendLog("[EXP] Profil disalin ke clipboard.");
  } catch {
    appendLog("[EXP] Clipboard ditolak, profil:\n" + stringify);
  }
}), bindHelperOuter(), bindHelperInner(), buildHelperParsed(), bindHelperLocal(), document.addEventListener("input", localArgPrimary => {
  localArgPrimary.target && localArgPrimary.target.type === "range" && updateHelperValue(localArgPrimary.target);
}), document.querySelectorAll("input[type=range]").forEach(updateHelperValue);
var settingsdlgEl = document.getElementById("settingsDlg");
document.getElementById("openSettings").addEventListener("click", () => {
  processHelperOuter(), settingsdlgEl.showModal();
}), bindHelperEnd();
for (let localAddEventListener of document.querySelectorAll("dialog")) localAddEventListener.addEventListener("click", localArgParam => {
  localArgParam.target === localAddEventListener && localAddEventListener.close();
}), localAddEventListener.querySelectorAll("[data-close]").forEach(argParam => argParam.addEventListener("click", () => localAddEventListener.close()));
document.getElementById("lightbox").addEventListener("close", () => {
  document.getElementById("lightboxBody").innerHTML = '';
}), document.getElementById("hdrOpen").addEventListener("click", () => impxmlEl.click()), stageEl.addEventListener("click", localArgMedia => {
  localArgMedia.target.closest("#stageBusy, .stage-btn") || requestPlayback(!isPlaying);
}), document.getElementById("stageBtnSize").addEventListener("click", localStopPropagation => {
  localStopPropagation.stopPropagation(), document.body.classList.toggle("stage-big");
}), typeof ResizeObserver == "function" && new ResizeObserver(() => getPos()).observe(stageEl);
var localValueEl = 0;
function replaceMediaForLayer(replaceMediaForLayerTag, replaceMediaForLayerArg) {
  if (!replaceMediaForLayerTag || !replaceMediaForLayerArg) return Promise.resolve(false);
  const replaceMediaForLayerResult = sceneSnapshot ? sceneSnapshot() : null;
  const uniqueId = Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e5);
  const cleanBase = (replaceMediaForLayerArg.name || "media").replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = uniqueId + "_" + cleanBase;
  let replaceMediaForLayerCreateObjectUrl = URL.createObjectURL(replaceMediaForLayerArg),
    replaceMediaForLayerValue = "am:user:" + uniqueId,
    replaceMediaForLayerFlag = /^video\//.test(replaceMediaForLayerArg.type) || /\.(mp4|webm|ogv|mov|m4v)$/i.test(replaceMediaForLayerArg.name);

  localRaw.set(uniqueName, {
    name: uniqueName,
    src: replaceMediaForLayerCreateObjectUrl
  });
  if (!localNodePending.some(replaceMediaForLayerArgValue => replaceMediaForLayerArgValue.name === uniqueName)) localNodePending.push(localRaw.get(uniqueName));
  if (!localValue.includes(uniqueName)) localValue.push(uniqueName);
  map.set(replaceMediaForLayerValue, uniqueName);

  if (!projectScene.media) projectScene.media = [];
  projectScene.media.push({
    uri: replaceMediaForLayerValue,
    type: replaceMediaForLayerArg.type || (replaceMediaForLayerFlag ? "video/mp4" : "image/png"),
    filename: uniqueName,
    title: replaceMediaForLayerArg.name,
    duration: 0,
    width: 0,
    height: 0,
    orientation: 0
  });

  const targetLayers = [];
  if (replaceMediaForLayerTag.tag === "embedScene" && replaceMediaForLayerTag.scene && replaceMediaForLayerTag.scene.layers) {
    for (const fillTypeValue of replaceMediaForLayerTag.scene.layers) {
      if (fillTypeValue.fillType === "media" || fillTypeValue.fillImage || fillTypeValue.fillVideo) {
        targetLayers.push(fillTypeValue);
      }
    }
  } else {
    targetLayers.push(replaceMediaForLayerTag);
  }

  for (const replaceMediaForLayerFillType of targetLayers) {
    replaceMediaForLayerFillType.fillType = "media";
    if (replaceMediaForLayerFlag) {
      replaceMediaForLayerFillType.fillVideo = replaceMediaForLayerValue;
      replaceMediaForLayerFillType.fillImage = '';
    } else {
      replaceMediaForLayerFillType.fillImage = replaceMediaForLayerValue;
      replaceMediaForLayerFillType.fillVideo = '';
    }
    replaceMediaForLayerFillType.mediaUrl = replaceMediaForLayerCreateObjectUrl;
    if (replaceMediaForLayerFillType.sourceXml) {
      if (/\sfillImage="[^"]*"/.test(replaceMediaForLayerFillType.sourceXml)) replaceMediaForLayerFillType.sourceXml = replaceMediaForLayerFillType.sourceXml.replace(/\sfillImage="[^"]*"/g, ` fillImage="${replaceMediaForLayerValue}"`);
      if (/\sfillVideo="[^"]*"/.test(replaceMediaForLayerFillType.sourceXml)) replaceMediaForLayerFillType.sourceXml = replaceMediaForLayerFillType.sourceXml.replace(/\sfillVideo="[^"]*"/g, ` fillVideo="${replaceMediaForLayerValue}"`);
    }
  }

  return applyHelperRaw(uniqueName).then(() => {
    renderer.setImages(helperValue());
    isDirty = true;
    computeHelperValue();
    bindHelper();
    if (replaceMediaForLayerResult && pushUndo) pushUndo(replaceMediaForLayerResult);
    appendLog("[REPLACE] Layer \"" + (replaceMediaForLayerTag.label || replaceMediaForLayerTag.id) + "\" diganti: " + replaceMediaForLayerArg.name);
    omUploadFile(replaceMediaForLayerArg, uniqueName).then(replaceMediaForLayerUrl => {
      if (!replaceMediaForLayerUrl) return;
      omUploads = omUploads.filter(replaceMediaForLayerUri => replaceMediaForLayerUri.uri !== replaceMediaForLayerValue);
      omUploads.push({
        uri: replaceMediaForLayerValue,
        name: uniqueName,
        file: replaceMediaForLayerUrl.name,
        url: replaceMediaForLayerUrl.url
      });
      const replaceMediaForLayerSrc = localRaw.get(uniqueName);
      replaceMediaForLayerSrc && (replaceMediaForLayerSrc.src = replaceMediaForLayerUrl.url);
      renderer.setImages(helperValue());
      omScheduleSave();
    }).catch(() => {});
    return true;
  }).catch(replaceMediaForLayerMessage => {
    appendLog("[REPLACE] " + replaceMediaForLayerMessage.message);
    return false;
  });
}
var ctxTarget = null,
  ctxMenu = null,
  ctxInput = null;
function closeLayerCtx() {
  ctxMenu && (ctxMenu.remove(), ctxMenu = null), ctxTarget = null;
}
function splitLayerAt(layer) {
  const splitLayerAtValue = omMulti.size ? omMultiIds() : [];
  const targets = splitLayerAtValue.length ? splitLayerAtValue.map(id => omResolveLayer(id)).filter(Boolean) : [layer || omLayerCur()].filter(Boolean);
  if (!targets.length) return appendLog("[EDIT] split: pilih layer terlebih dahulu");
  const snap = sceneSnapshot();
  let count = 0;
  let lastCopy = null;
  for (const splitLayerAtStartTime of targets) {
    const splitLayerAtFindParentArray = findParentArray(splitLayerAtStartTime);
    if (!splitLayerAtFindParentArray) continue;
    const splitlayeratValue = splitLayerAtStartTime.startTime || 0,
      splitLayerAtRaw = splitLayerAtStartTime.endTime != null ? splitLayerAtStartTime.endTime : (projectScene ? projectScene.totalTime : 0),
      splitLayerAtEndTime = playheadMs;
    if (splitLayerAtEndTime <= splitlayeratValue + 50 || splitLayerAtEndTime >= splitLayerAtRaw - 50) continue;
    const copy = cloneLayerSafe(splitLayerAtStartTime);
    copy.id = "layer_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
    copy.startTime = splitLayerAtEndTime;
    splitLayerAtStartTime.endTime = splitLayerAtEndTime;
    const splitLayerAtResult = splitLayerAtEndTime - splitlayeratValue;
    if (splitLayerAtStartTime.inTime != null || splitLayerAtStartTime.outTime != null || splitLayerAtStartTime.src || splitLayerAtStartTime.fillVideo) {
      copy.inTime = (splitLayerAtStartTime.inTime || 0) + splitLayerAtResult;
      splitLayerAtStartTime.outTime = (splitLayerAtStartTime.inTime || 0) + splitLayerAtResult;
    }
    const splitLayerAtValueRaw = splitLayerAtFindParentArray.indexOf(splitLayerAtStartTime);
    if (splitLayerAtValueRaw >= 0) {
      splitLayerAtFindParentArray.splice(splitLayerAtValueRaw + 1, 0, copy);
      count++;
      lastCopy = copy;
    }
  }
  if (!count) return appendLog("[EDIT] split: geser playhead dulu ke dalam layer (±50ms dari ujung)");
  pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Split " + count + " layer di " + Math.round(playheadMs) + " ms");
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  if (lastCopy) applyFlag(lastCopy);
}
function duplicateLayer(layer) {
  const duplicateLayerValue = omMulti.size ? omMultiIds() : [];
  const targets = duplicateLayerValue.length ? duplicateLayerValue.map(id => omResolveLayer(id)).filter(Boolean) : [layer || omLayerCur()].filter(Boolean);
  if (!targets.length) return;
  const snap = sceneSnapshot();
  const newLayers = [];
  targets.forEach(target => {
    const duplicateLayerFindParentArray = findParentArray(target);
    if (!duplicateLayerFindParentArray) return;
    const copy = cloneLayerSafe(target);
    copy.id = "layer_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
    const duplicateLayerResult = duplicateLayerFindParentArray.indexOf(target);
    duplicateLayerResult >= 0 ? duplicateLayerFindParentArray.splice(duplicateLayerResult + 1, 0, copy) : duplicateLayerFindParentArray.push(copy);
    newLayers.push(copy);
  });
  if (!newLayers.length) return;
  pushUndo(snap), isDirty = true;
  appendLog(newLayers.length === 1 ? "Duplikat 1 lapisan" : `Duplikat ${newLayers.length} lapisan`);
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  if (newLayers.length === 1) {
    applyFlag(newLayers[0]);
  } else {
    omMulti.clear();
    newLayers.forEach(duplicateLayerId => omMulti.add(duplicateLayerId.id));
    omMultiRefresh();
  }
  omScheduleSave();
  return newLayers;
}
function omPasteLayers() {
  if (!window.__omClipboardLayers || !window.__omClipboardLayers.length) return;
  const ompastelayerValue = (projectScene && projectScene.layers) || [];
  if (!ompastelayerValue) return;
  const snap = sceneSnapshot();
  const minStart = Math.min(...window.__omClipboardLayers.map(omPasteLayersStartTime => omPasteLayersStartTime.startTime || 0));
  const offset = playheadMs - minStart;
  const newLayers = [];
  window.__omClipboardLayers.forEach(orig => {
    const copy = cloneLayerSafe(orig);
    copy.id = "layer_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
    const omPasteLayersValue = (copy.endTime != null ? copy.endTime : (projectScene ? projectScene.totalTime : 0)) - (copy.startTime || 0);
    copy.startTime = Math.max(0, (copy.startTime || 0) + offset);
    copy.endTime = copy.startTime + Math.max(100, omPasteLayersValue);
    ompastelayerValue.push(copy);
    newLayers.push(copy);
  });
  pushUndo(snap), isDirty = true;
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  if (newLayers.length === 1) {
    applyFlag(newLayers[0]);
  } else if (newLayers.length > 1) {
    omMulti.clear();
    newLayers.forEach(omPasteLayersId => omMulti.add(omPasteLayersId.id));
    omMultiRefresh();
  }
  appendLog(newLayers.length === 1 ? "1 Lapisan ditempel" : `${newLayers.length} Lapisan ditempel`);
  omScheduleSave();
  return newLayers;
}
function omPasteStyle(options = {}) {
  if (!window.__omClipboardStyle) {
    appendLog("Belum ada gaya lapisan yang disalin");
    return;
  }
  const targets = omMulti.size ? omMultiIds().map(omResolveLayer).filter(Boolean) : [omLayerCur()].filter(Boolean);
  if (!targets.length) {
    appendLog("Pilih layer tujuan terlebih dahulu");
    return;
  }
  const style = window.__omClipboardStyle;
  const snap = sceneSnapshot();
  targets.forEach(layer => {
    if (options.colorFill !== false && style.colorFill) {
      if (style.colorFill.fillColor !== undefined) layer.fillColor = style.colorFill.fillColor;
      if (style.colorFill.fillType !== undefined) layer.fillType = style.colorFill.fillType;
      if (style.colorFill.fillImage !== undefined) layer.fillImage = style.colorFill.fillImage;
      if (style.colorFill.fillVideo !== undefined) layer.fillVideo = style.colorFill.fillVideo;
      if (style.colorFill.gradient) layer.gradient = cloneLayerSafe(style.colorFill.gradient);
      if (style.colorFill.src !== undefined) layer.src = style.colorFill.src;
    }
    if (options.borderShadow !== false && style.borderShadow) {
      Object.assign(layer, cloneLayerSafe(style.borderShadow));
    }
    if (options.blendingOpacity !== false && style.blendingOpacity) {
      if (style.blendingOpacity.opacity !== undefined) layer.opacity = style.blendingOpacity.opacity;
      if (style.blendingOpacity.blendMode !== undefined) layer.blendMode = style.blendingOpacity.blendMode;
      if (style.blendingOpacity.maskType !== undefined) layer.maskType = style.blendingOpacity.maskType;
    }
    if (options.moveTransform !== false && style.moveTransform) {
      if (style.moveTransform.transform) layer.transform = cloneLayerSafe(style.moveTransform.transform);
      if (style.moveTransform.location) layer.location = cloneLayerSafe(style.moveTransform.location);
      if (style.moveTransform.scale) layer.scale = cloneLayerSafe(style.moveTransform.scale);
      if (style.moveTransform.rotation !== null) layer.rotation = style.moveTransform.rotation;
      if (style.moveTransform.skew !== null) layer.skew = style.moveTransform.skew;
      if (style.moveTransform.pivot) layer.pivot = cloneLayerSafe(style.moveTransform.pivot);
    }
    if (options.text !== false && style.text && (layer.text != null || layer.type === 'text')) {
      if (style.text.fontFamily) layer.fontFamily = style.text.fontFamily;
      if (style.text.fontSize) layer.fontSize = style.text.fontSize;
      if (style.text.textAlign) layer.textAlign = style.text.textAlign;
      if (style.text.textColor) layer.textColor = style.text.textColor;
      if (style.text.lineHeight) layer.lineHeight = style.text.lineHeight;
      if (style.text.letterSpacing) layer.letterSpacing = style.text.letterSpacing;
    }
    if (options.effects !== false && style.effects) {
      layer.effects = cloneLayerSafe(style.effects);
      if (layer.visualEffects) layer.visualEffects = cloneLayerSafe(style.effects);
    }
    if (options.speed !== false && style.speed != null) {
      layer.speed = style.speed;
      layer.timeScale = style.speed;
    }
  });
  pushUndo(snap), isDirty = true;
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  appendLog("Gaya lapisan ditempel");
  omScheduleSave();
}
function deleteLayer(layer) {
  const deleteLayerFindParentArray = findParentArray(layer);
  if (!deleteLayerFindParentArray) return;
  const deleteLayerValue = deleteLayerFindParentArray.indexOf(layer);
  if (deleteLayerValue < 0) return;
  const snap = sceneSnapshot();
  deleteLayerFindParentArray.splice(deleteLayerValue, 1), pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Hapus layer \"" + (layer.label || layer.id) + "\"");
  try { renderHelperValue(); } catch(deleteLayerResult){}
  bindFlag(), renderer && renderer.renderAt(playheadMs);
}
function openLayerCtx(openLayerCtxFillType, openlayerctxValue, openLayerCtxArgValue) {
  closeLayerCtx(), ctxTarget = openLayerCtxFillType;
  let menu = document.createElement("div");
  menu.className = "tl-ctx", menu.style.left = Math.max(4, Math.min(openlayerctxValue, innerWidth - 220)) + 'px', menu.style.top = Math.max(4, Math.min(openLayerCtxArgValue, innerHeight - 220)) + 'px';
  const openlayerctxCallback = (label, openLayerCtxArgRaw) => {
    const addButtonEl = document.createElement("button");
    addButtonEl.type = "button", addButtonEl.textContent = label;
    addButtonEl.addEventListener("click", () => {
      closeLayerCtx();
      try { openLayerCtxArgRaw(); } catch (openLayerCtxMessage) { appendLog("[EDIT] " + openLayerCtxMessage.message); }
    });
    menu.appendChild(addButtonEl);
  };
  if (openLayerCtxFillType.fillType === "media") openlayerctxCallback("Ganti foto/video…", () => {
    ctxInput || (ctxInput = document.createElement("input"), ctxInput.type = "file", ctxInput.accept = "image/*,video/*", ctxInput.classList.add("tl-ctx-input"), ctxInput.style.display = "none", ctxInput.addEventListener("change", () => {
      let openLayerCtxFlag = ctxInput.files && ctxInput.files[0];
      if (openLayerCtxFlag) replaceMediaForLayer(openLayerCtxFillType, openLayerCtxFlag).then(() => ctxInput.value = '');
    }), document.body.appendChild(ctxInput));
    ctxTarget = openLayerCtxFillType, ctxInput.click();
  });
  openlayerctxCallback("Split di playhead", () => splitLayerAt(openLayerCtxFillType));
  openlayerctxCallback("Duplikat layer", () => duplicateLayer(openLayerCtxFillType));
  openlayerctxCallback("Hapus layer", () => deleteLayer(openLayerCtxFillType));
  if (getHelper(openLayerCtxFillType)) openlayerctxCallback("Buka grup", () => computeHelperParsed(openLayerCtxFillType));
  if (localList.length) openlayerctxCallback("Kembali ke grup induk", () => onclick());
  if (!getHelper(openLayerCtxFillType) && !localList.length) openlayerctxCallback("Masukkan ke grup…", () => {
    const groups = [];
    omWalkScenes(projectScene, openLayerCtxLayers => {
      (openLayerCtxLayers.layers || []).forEach(openLayerCtxTag => {
        if (openLayerCtxTag.tag === "embedScene") groups.push(openLayerCtxTag);
      });
    });
    if (!groups.length) return appendLog("[GRUP] belum ada grup untuk dimasukkan");
    const openlayerctxDivEl = document.createElement("div");
    openlayerctxDivEl.id = "om-move-group-back";
    openlayerctxDivEl.style.cssText = "position:fixed;inset:0;z-index:100006;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";
    openlayerctxDivEl.innerHTML = '<div class="om-dialog" style="max-width:320px;width:100%"><h2>Masukkan ke grup</h2><label class="field">Pilih grup<select id="om-move-grp"></select></label><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px"><button class="btn" type="button" id="om-move-cancel">Batal</button><button class="btn primary" type="button" id="om-move-ok">Masukkan</button></div></div>';
    document.body.appendChild(openlayerctxDivEl);
    const openlayerctxOmMoveGrpEl = openlayerctxDivEl.querySelector("#om-move-grp");
    groups.forEach((openLayerCtxId, openLayerCtxArg) => { const openlayerctxOptionEl = document.createElement("option"); openlayerctxOptionEl.value = openLayerCtxId.id || String(openLayerCtxArg); openlayerctxOptionEl.textContent = openLayerCtxId.label || openLayerCtxId.id || ("Grup " + (openLayerCtxArg+1)); openlayerctxOmMoveGrpEl.appendChild(openlayerctxOptionEl); });
    openlayerctxDivEl.querySelector("#om-move-cancel").addEventListener("click", () => openlayerctxDivEl.remove());
    openlayerctxDivEl.addEventListener("click", openLayerCtxTarget => { if (openLayerCtxTarget.target === openlayerctxDivEl) openlayerctxDivEl.remove(); });
    openlayerctxDivEl.querySelector("#om-move-ok").addEventListener("click", () => {
      const openLayerCtxResult = openlayerctxOmMoveGrpEl.value;
      const openLayerCtxValue = groups.find(openLayerCtxRaw => openLayerCtxRaw.id === openLayerCtxResult) || groups[Number(openLayerCtxResult)] || groups[0];
      if (!openLayerCtxValue || !openLayerCtxValue.scene || !Array.isArray(openLayerCtxValue.scene.layers)) return openlayerctxDivEl.remove();
      const snap = sceneSnapshot();
      const openLayerCtxFindParentArray = findParentArray(openLayerCtxFillType);
      if (openLayerCtxFindParentArray) { const openLayerCtxValueRaw = openLayerCtxFindParentArray.indexOf(openLayerCtxFillType); if (openLayerCtxValueRaw >= 0) openLayerCtxFindParentArray.splice(openLayerCtxValueRaw, 1); }
      openLayerCtxValue.scene.layers.push(openLayerCtxFillType);
      pushUndo(snap), isDirty = true;
      openlayerctxDivEl.remove();
      appendLog("[GRUP] " + (openLayerCtxFillType.label || openLayerCtxFillType.id) + " dimasukkan ke grup");
      omHandleInContextHelper().then(() => renderer && renderer.renderAt(playheadMs));
    });
  });
  document.body.appendChild(menu), ctxMenu = menu, setTimeout(() => {
    let once = ev => {
      if (ev && ev.target && ctxMenu && ctxMenu.contains(ev.target)) return;
      closeLayerCtx(), window.removeEventListener("pointerdown", once), window.removeEventListener("scroll", once, true), window.removeEventListener("contextmenu", once);
    };
    window.addEventListener("pointerdown", once), window.addEventListener("scroll", once, true), window.addEventListener("contextmenu", once);
  }, 0);
}
(function injectFeatureStyles() {
  if (document.getElementById("om-feature-style")) return;
  const injectfeaturStyleEl = document.createElement("style");
  injectfeaturStyleEl.id = "om-feature-style";
  injectfeaturStyleEl.textContent = `
.tl-track.tl-drop { outline: 2px dashed var(--accent); outline-offset: -2px; border-radius: 8px; box-shadow: inset 0 0 0 999px rgba(31,200,238,.08); }
.tl-ctx { position: fixed; z-index: 9999; background: var(--card); border: 1px solid var(--line2); border-radius: 10px; padding: 4px; box-shadow: 0 8px 24px rgba(0,0,0,.5); min-width: 200px; }
.tl-ctx button { display: block; width: 100%; text-align: left; background: none; border: 0; color: var(--text); padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; }
.tl-ctx button:hover { background: var(--card2); color: var(--accent); }
.tl-edge { position: absolute; top: 0; bottom: 0; width: 9px; cursor: col-resize; touch-action: none; z-index: 3; }
.tl-edge-l { left: 0; }
.tl-edge-r { right: 0; }
.tl-edge:hover, .tl-edge:active { background: rgba(31,200,238,.4); }
.tl-track.tl-reorder { outline: 2px dashed var(--accent); outline-offset: -2px; opacity: .92; box-shadow: 0 6px 18px rgba(0,0,0,.45); }
.tl-block { cursor: move; touch-action: none; }
.tl-label { cursor: grab; touch-action: none; }
.tl-label:active { cursor: grabbing; }`;
  document.head.appendChild(injectfeaturStyleEl);
})();
(function omStyles() {
  const omstylesOmFeatureStyEl = document.getElementById("om-feature-style");
  if (!omstylesOmFeatureStyEl) return;
  omstylesOmFeatureStyEl.textContent += `
#om-landing { position: fixed; inset: 0; z-index: 100000; background: linear-gradient(160deg,#090a0e,#121524 60%,#0b1418); display: flex; align-items: center; justify-content: center; }
.om-card { text-align: center; padding: 36px; max-width: 420px; }
.om-logo { font-size: 2.1rem; font-weight: 700; letter-spacing: .5px; background: linear-gradient(90deg,#1fc8ee,#a793ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.om-sub { color: var(--muted); margin: 10px 0 26px; font-size: .9rem; }
.om-btn { display: block; width: 100%; padding: 13px; border: 0; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; }
.om-btn.primary { background: var(--accent); color: var(--accent-ink); }
#om-dialog-back { position: fixed; inset: 0; z-index: 100001; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; padding: 16px; }
.om-dialog { width: 100%; max-width: 460px; max-height: 88vh; overflow: auto; background: var(--panel); border: 1px solid var(--line2); border-radius: 16px; padding: 18px; }
.om-dialog h2 { font-size: 1.05rem; margin-bottom: 14px; }
.om-field { margin-bottom: 14px; }
.om-field > label { display: block; font-size: .78rem; color: var(--muted); margin-bottom: 6px; }
.om-row { display: flex; gap: 6px; align-items: center; }
.om-row input[type="text"], .om-row input[type="number"] { flex: 1; min-width: 0; background: var(--card); border: 1px solid var(--line2); border-radius: 9px; color: var(--text); padding: 9px 10px; }
.om-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.om-chip { padding: 7px 11px; border-radius: 9px; border: 1px solid var(--line2); background: var(--card); color: var(--text); font-size: .78rem; cursor: pointer; }
.om-chip.on { background: var(--accent); color: var(--accent-ink); border-color: transparent; font-weight: 700; }
.om-sw { width: 34px; height: 34px; border-radius: 9px; border: 2px solid var(--line2); cursor: pointer; padding: 0; }
.om-sw.on { border-color: #fff; outline: 2px solid var(--accent); }
.iconbtn { border: 1px solid var(--line2); background: var(--card); color: var(--text); border-radius: 9px; width: 36px; height: 36px; cursor: pointer; flex: none; }
.iconbtn.on { background: var(--accent); color: var(--accent-ink); border-color: transparent; }
.om-sizeinfo { font-size: .8rem; color: var(--muted); margin-top: 8px; }
.om-sizeinfo b { color: var(--text); }
#om-add-menu { position: fixed; z-index: 9999; background: var(--panel); border: 1px solid var(--line2); border-radius: 14px; box-shadow: 0 12px 34px rgba(0,0,0,.5); padding: 10px; width: 330px; max-height: 72vh; overflow: auto; }
#om-add-menu h4 { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 10px 2px 6px; }
.om-shapes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.om-shapes button { padding: 8px 3px; font-size: .68rem; }
.om-items { display: flex; flex-direction: column; gap: 6px; }
.om-items button { text-align: left; padding: 9px 10px; }
.om-recent { margin-top: 22px; text-align: left; max-height: 32vh; overflow: auto; }
.om-recent h4 { font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin: 0 0 8px; }
.om-recent button { width: 100%; text-align: left; margin-bottom: 6px; }`;
})();
(function bindTimelineWheelZoom() {
  const wrap = document.getElementById("timeline-wrap");
  if (!wrap || wrap.__zoomWheel) return;
  wrap.__zoomWheel = true;
  wrap.addEventListener("wheel", bindTimelineWheelZoomCtrlKey => {
    if (!bindTimelineWheelZoomCtrlKey.ctrlKey && !bindTimelineWheelZoomCtrlKey.metaKey) return;
    bindTimelineWheelZoomCtrlKey.preventDefault();
    getHelperRaw(localNodeFinal * (bindTimelineWheelZoomCtrlKey.deltaY < 0 ? 1.25 : 0.8), true);
  }, { passive: false });
})();
const OM_SHAPES = {
  ".circle": "Circle", ".rect": "Rectangle", ".plus": "Plus", ".arc": "Arc",
  ".triangle": "Triangle", ".pie": "Pie", ".poly": "Polygon", ".multifoil": "Multifoil",
  ".arrow": "Arrow", ".quad": "Quad", ".roundrect": "Rounded Rect", ".star": "Star",
  ".line": "Line", ".wideline": "Wide Line", ".callout.roundrect": "Callout",
  ".moon": "Moon", ".teardrop": "Teardrop", ".stamp": "Stamp", ".penta": "Pentagon"
};
async function omHandleInContextHelper() {
  const teSave = localList.slice(), ieSave = new Set(localSet);
  await handleHelperValue();
  if (teSave.length) {
    localList = teSave, localSet = ieSave, handleHelperClamped();
  }
}
async function omAddLayer(layer, label) {
  if (!projectScene) return appendLog("[EDIT] belum ada proyek");
  if (!layer) return appendLog("[EDIT] gagal membuat layer");
  const snap = sceneSnapshot();
  omCurrentLayers().push(layer), pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Tambah layer \"" + (layer.label || label || layer.id) + "\"" + (localList.length ? " (di dalam grup)" : ""));
  await omHandleInContextHelper();
  return layer;
}
async function omAddAudioFile(file) {
  if (!projectScene) return;
  const omAddAudioFileOmMeta = omMeta(), omAddAudioFileCreateObjectUrl = URL.createObjectURL(file);
  const layer = omParseLayer('<audio id="' + omId() + '" label="' + file.name + '" startTime="0" endTime="' + omAddAudioFileOmMeta.total + '" src="' + omAddAudioFileCreateObjectUrl + '" />');
  if (!layer) return appendLog("[EDIT] gagal menambah audio");
  const omAddAudioFileOmCurrentScene = omCurrentScene();
  if (!Array.isArray(omAddAudioFileOmCurrentScene.audio)) omAddAudioFileOmCurrentScene.audio = [];
  const snap = sceneSnapshot();
  const entry = {
    id: layer.id,
    label: file.name,
    src: omAddAudioFileCreateObjectUrl,
    startTime: 0,
    endTime: omAddAudioFileOmMeta.total,
    inTime: 0,
    outTime: 0
  };
  omCurrentLayers().push(layer), omAddAudioFileOmCurrentScene.audio.push(entry), omAddAudioFileOmCurrentScene !== projectScene && projectScene.audio.push({ ...entry }), pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Tambah audio \"" + file.name + "\"" + (localList.length ? " (di dalam grup)" : ""));
  await omHandleInContextHelper();
  omUploadFile(file).then(omAddAudioFileUrl => {
    if (!omAddAudioFileUrl) return;
    omUploads.push({
      kind: "audio",
      layerId: layer.id,
      name: file.name,
      file: omAddAudioFileUrl.name,
      url: omAddAudioFileUrl.url
    });
    omWalkScenes(projectScene, omAddAudioFileLayers => {
      (omAddAudioFileLayers.layers || []).forEach(omAddAudioFileId => {
        if (omAddAudioFileId.id === layer.id) omAddAudioFileId.src = omAddAudioFileUrl.url;
      });
      (omAddAudioFileLayers.audio || []).forEach(omAddAudioFileSrc => {
        if (omAddAudioFileSrc.id === layer.id) omAddAudioFileSrc.src = omAddAudioFileUrl.url;
      });
    }), omScheduleSave();
  }).catch(() => {});
}
let omAddMenu = null;
function omCloseAddMenu() {
  omAddMenu && (omAddMenu.remove(), omAddMenu = null);
}
function omOpenAddMenu(getBoundingClientRectArg) {
  omCloseAddMenu();
  const menu = document.createElement("div");
  menu.id = "om-add-menu";
  menu.innerHTML = '<h4>Bentuk</h4><div class="om-shapes"></div><h4>Lapisan</h4><div class="om-items"></div>';
  const shapes = menu.querySelector(".om-shapes");
  Object.keys(OM_SHAPES).forEach(omOpenAddMenuArg => {
    const omopenaddmenButtonEl = document.createElement("button");
    omopenaddmenButtonEl.type = "button", omopenaddmenButtonEl.className = "btn sm", omopenaddmenButtonEl.textContent = OM_SHAPES[omOpenAddMenuArg];
    omopenaddmenButtonEl.addEventListener("click", () => {
      omCloseAddMenu(), omAddShape(omOpenAddMenuArg);
    });
    shapes.appendChild(omopenaddmenButtonEl);
  });
  const omopenaddmenOmItemsEl = menu.querySelector(".om-items");
  const omopenaddmenCallback = (label, omOpenAddMenuArgValue) => {
    const itemButtonEl = document.createElement("button");
    itemButtonEl.type = "button", itemButtonEl.className = "btn sm", itemButtonEl.textContent = label;
    itemButtonEl.addEventListener("click", () => {
      omCloseAddMenu(), omOpenAddMenuArgValue();
    });
    omopenaddmenOmItemsEl.appendChild(itemButtonEl);
  };
  omopenaddmenCallback("Teks", () => omAddText());
  omopenaddmenCallback("Media (Gambar / Video)", () => omPickInput("media", "image/*,video/*", omopenaddmenValue => omAddMediaFile(omopenaddmenValue)));
  omopenaddmenCallback("Audio / Musik", () => omPickInput("audio", "audio/*", omOpenAddMenuArgRaw => omAddAudioFile(omOpenAddMenuArgRaw)));
  omopenaddmenCallback("Kamera", () => omAddCamera());
  omopenaddmenCallback("Null Object", () => omAddNull());
  omopenaddmenCallback("Grup Kosong", () => omAddGroup());
  omopenaddmenCallback("Elemen / Proyek (XML)", () => omPickInput("elem", ".xml,text/xml", omOpenAddMenuRaw => omAddElementFile(omOpenAddMenuRaw)));
  document.body.appendChild(menu);
  const omOpenAddMenuGetBoundingClientRect = getBoundingClientRectArg.getBoundingClientRect();
  menu.style.left = Math.max(4, Math.min(omOpenAddMenuGetBoundingClientRect.left, innerWidth - 344)) + 'px';
  menu.style.top = Math.max(4, Math.min(omOpenAddMenuGetBoundingClientRect.bottom + 6, innerHeight - 430)) + 'px';
  omAddMenu = menu;
  setTimeout(() => {
    const once = onceCondition => {
      if (onceCondition && onceCondition.target && menu.contains(onceCondition.target)) return;
      omCloseAddMenu(), window.removeEventListener("pointerdown", once);
    };
    window.addEventListener("pointerdown", once);
  }, 0);
}
window.omInitAddButton = function omInitAddButton() {
  const ominitaddbutPaneLayerEl = document.querySelector("#pane-layer .tl-toolbar");
  if (!ominitaddbutPaneLayerEl || document.getElementById("om-add")) return;
  const ominitaddbutButtonEl = document.createElement("button");
  ominitaddbutButtonEl.id = "om-add", ominitaddbutButtonEl.type = "button", ominitaddbutButtonEl.className = "btn sm", ominitaddbutButtonEl.textContent = "＋ Tambah";
  ominitaddbutButtonEl.addEventListener("click", omInitAddButtonStopPropagation => {
    omInitAddButtonStopPropagation.stopPropagation(), omOpenAddMenu(ominitaddbutButtonEl);
  });
  const count = ominitaddbutPaneLayerEl.querySelector("#layers-count");
  count && count.parentNode ? count.parentNode.insertBefore(ominitaddbutButtonEl, count.nextSibling) : ominitaddbutPaneLayerEl.insertBefore(ominitaddbutButtonEl, ominitaddbutPaneLayerEl.firstChild);
}
const OM_RATIOS = {
  "16:9": [16, 9],
  "9:16": [9, 16],
  "4:5": [4, 5],
  "1:1": [1, 1],
  "4:3": [4, 3]
};
const OM_RES = [[1440, "1440p QHD"], [1080, "1080p FHD"], [720, "720p HD"], [540, "540p SD"], [360, "360p"], [270, "270p"], [180, "180p"]];
const OM_FPS = [12, 15, 18, 20, 24, 25, 30, 48, 60, 90, 120];
const OM_BGS = [["Hitam", "#ff000000", "#000000"], ["Putih", "#ffffffff", "#ffffff"], ["Abu Muda", "#ffb3b3b3", "#b3b3b3"], ["Hijau", "#ff00d62f", "#00d62f"], ["Biru", "#ff2979ff", "#2979ff"]];
function showOmProjectDialog() {
  if (document.getElementById("om-dialog-back")) return;
  const newProjectOptions = {
    name: "Proyek Baru",
    ratio: "9:16",
    res: 1080,
    custom: false,
    w: 1080,
    h: 1920,
    lock: true,
    fps: 30,
    bg: 0
  };
  const back = document.createElement("div");
  back.id = "om-dialog-back";
  back.innerHTML = `
    <div class="om-dialog">
      <h2>Buat Proyek</h2>
      <div class="om-field"><label>Nama Proyek</label>
        <div class="om-row"><input type="text" id="om-name" value="Proyek Baru" /><button class="iconbtn" type="button" id="om-name-x" aria-label="Bersihkan">✕</button></div>
      </div>
      <div class="om-field"><label>Aspect Ratio</label><div class="om-chips" id="om-aspect"></div></div>
      <div class="om-field"><label>Resolusi</label><div class="om-chips" id="om-res"></div></div>
      <div class="om-field" id="om-customrow" style="display:none"><label>Custom Resolution</label>
        <div class="om-row">
          <input type="number" id="om-w" min="16" max="7680" step="2" value="1080" aria-label="Width" />
          <button class="iconbtn" type="button" id="om-lock" title="Kunci rasio">🔗</button>
          <input type="number" id="om-h" min="16" max="7680" step="2" value="1920" aria-label="Height" />
        </div>
        <div class="om-sizeinfo">Komposisi: <b id="om-size">1080 × 1920</b></div>
      </div>
      <div class="om-field"><label>Frame Rate</label><div class="om-chips" id="om-fps"></div></div>
      <div class="om-field"><label>Latar Belakang</label><div class="om-row" id="om-bg"></div></div>
      <button class="om-btn primary" type="button" id="om-create">BUAT PROYEK</button>
      <button class="om-btn" type="button" id="om-cancel" style="margin-top:8px;background:var(--card);color:var(--text);border:1px solid var(--line2)">Batal</button>
    </div>`;
  document.body.appendChild(back);
  const showomprojecCallback = showOmProjectDialogArg => back.querySelector(showOmProjectDialogArg);
  const showOmProjectDialogValue = () => {
    back.querySelectorAll("#om-aspect .om-chip").forEach(showOmProjectDialogClassList => showOmProjectDialogClassList.classList.toggle("on", showOmProjectDialogClassList.dataset.k === (newProjectOptions.custom ? "custom" : newProjectOptions.ratio)));
    back.querySelectorAll("#om-res .om-chip").forEach(classListArg => classListArg.classList.toggle("on", Number(classListArg.dataset.k) === newProjectOptions.res));
    back.querySelectorAll("#om-fps .om-chip").forEach(showOmProjectDialogDataset => showOmProjectDialogDataset.classList.toggle("on", Number(showOmProjectDialogDataset.dataset.k) === newProjectOptions.fps));
    back.querySelectorAll("#om-bg .om-sw").forEach((showOmProjectDialogArgValue, showOmProjectDialogArgRaw) => showOmProjectDialogArgValue.classList.toggle("on", showOmProjectDialogArgRaw === newProjectOptions.bg));
    showomprojecCallback("#om-customrow").style.display = newProjectOptions.custom || newProjectOptions.res === 0 ? "" : "none";
    showomprojecCallback("#om-lock").classList.toggle("on", newProjectOptions.lock);
    showomprojecCallback("#om-w").value = newProjectOptions.w, showomprojecCallback("#om-h").value = newProjectOptions.h;
    const sizeEl = showomprojecCallback("#om-size");
    if (sizeEl) sizeEl.textContent = newProjectOptions.w + " × " + newProjectOptions.h;
  };
  const aspectBox = showomprojecCallback("#om-aspect");
  Object.keys(OM_RATIOS).forEach(showOmProjectDialogK => {
    const showomprojecButtonEl = document.createElement("button");
    showomprojecButtonEl.type = "button", showomprojecButtonEl.className = "om-chip", showomprojecButtonEl.dataset.k = showOmProjectDialogK, showomprojecButtonEl.textContent = showOmProjectDialogK;
    showomprojecButtonEl.addEventListener("click", () => {
      newProjectOptions.ratio = showOmProjectDialogK, newProjectOptions.custom = false;
      if (newProjectOptions.res !== 0) {
        const showOmProjectDialogOmSizeFromRatio = omSizeFromRatio(showOmProjectDialogK, newProjectOptions.res);
        newProjectOptions.w = showOmProjectDialogOmSizeFromRatio.w, newProjectOptions.h = showOmProjectDialogOmSizeFromRatio.h;
      }
      showOmProjectDialogValue();
    });
    aspectBox.appendChild(showomprojecButtonEl);
  });
  const customBtn = document.createElement("button");
  customBtn.type = "button", customBtn.className = "om-chip", customBtn.dataset.k = "custom", customBtn.textContent = "✎ Custom";
  customBtn.addEventListener("click", () => {
    newProjectOptions.custom = true, newProjectOptions.res = 0, showOmProjectDialogValue();
  });
  aspectBox.appendChild(customBtn);
  const resBox = showomprojecCallback("#om-res");
  OM_RES.forEach(([showOmProjectDialogRes, label]) => {
    const showOmProjectDialogButtonEl = document.createElement("button");
    showOmProjectDialogButtonEl.type = "button", showOmProjectDialogButtonEl.className = "om-chip", showOmProjectDialogButtonEl.dataset.k = String(showOmProjectDialogRes), showOmProjectDialogButtonEl.textContent = label;
    showOmProjectDialogButtonEl.addEventListener("click", () => {
      newProjectOptions.res = showOmProjectDialogRes, newProjectOptions.custom = false;
      const omSizeFromRatioValue = omSizeFromRatio(newProjectOptions.ratio, showOmProjectDialogRes);
      newProjectOptions.w = omSizeFromRatioValue.w, newProjectOptions.h = omSizeFromRatioValue.h, showOmProjectDialogValue();
    });
    resBox.appendChild(showOmProjectDialogButtonEl);
  });
  const resCustom = document.createElement("button");
  resCustom.type = "button", resCustom.className = "om-chip", resCustom.dataset.k = "0", resCustom.textContent = "Custom";
  resCustom.addEventListener("click", () => {
    newProjectOptions.custom = true, newProjectOptions.res = 0, showOmProjectDialogValue();
  });
  resBox.appendChild(resCustom);
  showomprojecCallback("#om-w").addEventListener("input", showOmProjectDialogTarget => {
    let showOmProjectDialogOmEven = omEven(Number(showOmProjectDialogTarget.target.value) || 0);
    newProjectOptions.w = showOmProjectDialogOmEven;
    if (newProjectOptions.lock) newProjectOptions.h = newProjectOptions.res === 0 && newProjectOptions.custom ? omEven(showOmProjectDialogOmEven * (newProjectOptions.h / Math.max(1, newProjectOptions.w || 1)) || showOmProjectDialogOmEven) : omEven(showOmProjectDialogOmEven * (OM_RATIOS[newProjectOptions.ratio] ? OM_RATIOS[newProjectOptions.ratio][1] / OM_RATIOS[newProjectOptions.ratio][0] : 1));
    showOmProjectDialogValue();
  });
  showomprojecCallback("#om-h").addEventListener("input", showOmProjectDialogRaw => {
    let omEvenValue = omEven(Number(showOmProjectDialogRaw.target.value) || 0);
    newProjectOptions.h = omEvenValue;
    if (newProjectOptions.lock) newProjectOptions.w = omEven(omEvenValue * (OM_RATIOS[newProjectOptions.ratio] ? OM_RATIOS[newProjectOptions.ratio][0] / OM_RATIOS[newProjectOptions.ratio][1] : (newProjectOptions.w / Math.max(1, newProjectOptions.h))));
    showOmProjectDialogValue();
  });
  showomprojecCallback("#om-lock").addEventListener("click", () => {
    newProjectOptions.lock = !newProjectOptions.lock, showOmProjectDialogValue();
  });
  const fpsBox = showomprojecCallback("#om-fps");
  OM_FPS.forEach(showomprojecText => {
    const showOmProjectDialogClassName = document.createElement("button");
    showOmProjectDialogClassName.type = "button", showOmProjectDialogClassName.className = "om-chip", showOmProjectDialogClassName.dataset.k = String(showomprojecText), showOmProjectDialogClassName.textContent = showomprojecText + " fps";
    showOmProjectDialogClassName.addEventListener("click", () => {
      newProjectOptions.fps = showomprojecText, showOmProjectDialogValue();
    });
    fpsBox.appendChild(showOmProjectDialogClassName);
  });
  const bgBox = showomprojecCallback("#om-bg");
  OM_BGS.forEach(([, , showOmProjectDialogBackground], showOmProjectDialogBg) => {
    const classNameValue = document.createElement("button");
    classNameValue.type = "button", classNameValue.className = "om-sw", classNameValue.style.background = showOmProjectDialogBackground, classNameValue.title = OM_BGS[showOmProjectDialogBg][0];
    classNameValue.addEventListener("click", () => {
      newProjectOptions.bg = showOmProjectDialogBg, showOmProjectDialogValue();
    });
    bgBox.appendChild(classNameValue);
  });
  showomprojecCallback("#om-name-x").addEventListener("click", () => {
    showomprojecCallback("#om-name").value = "";
    showomprojecCallback("#om-name").focus();
  });
  const close = () => back.remove();
  showomprojecCallback("#om-cancel").addEventListener("click", close);
  back.addEventListener("pointerdown", showOmProjectDialogArgParsed => {
    if (showOmProjectDialogArgParsed.target === back) close();
  });
  showomprojecCallback("#om-create").addEventListener("click", async () => {
    const showOmProjectDialogRecord = {
      name: (showomprojecCallback("#om-name").value || "").trim() || "Proyek Baru",
      w: newProjectOptions.res !== 0 && !newProjectOptions.custom ? omSizeFromRatio(newProjectOptions.ratio, newProjectOptions.res).w : newProjectOptions.w,
      h: newProjectOptions.res !== 0 && !newProjectOptions.custom ? omSizeFromRatio(newProjectOptions.ratio, newProjectOptions.res).h : newProjectOptions.h,
      fps: newProjectOptions.fps,
      bg: OM_BGS[newProjectOptions.bg][1]
    };
    const showOmProjectDialogOmProjectXml = omProjectXml(showOmProjectDialogRecord);
    const file = new File([showOmProjectDialogOmProjectXml], showOmProjectDialogRecord.name + ".xml", {
      type: "text/xml"
    });
    try {
      omProjectId = omNewId(), omUploads = [], history.replaceState({}, "", "/proyek/" + omProjectId);
      await window.AM.loadPreset(file);
      close();
      const land = document.getElementById("om-landing");
      land && land.remove();
      appendLog("[PROYEK] Dibuat: " + showOmProjectDialogRecord.name + " (" + showOmProjectDialogRecord.w + "×" + showOmProjectDialogRecord.h + " @ " + showOmProjectDialogRecord.fps + "fps) — id " + omProjectId);
      await omSaveProject();
    } catch (showOmProjectDialogMessage) {
      appendLog("[PROYEK] Gagal: " + showOmProjectDialogMessage.message);
    }
  });
  showOmProjectDialogValue();
}
var omProjectId = null,
  omUploads = [],
  omSaveTimer = null;
function omEnsureId() {
  if (omProjectId) return omProjectId;
  omProjectId = omNewId(), history.replaceState({}, "", "/proyek/" + omProjectId);
  appendLog("[PROYEK] id baru: " + omProjectId);
  return omProjectId;
}
function omScheduleSave() {
  if (!projectScene) return;
  clearTimeout(omSaveTimer);
  omSaveTimer = setTimeout(omSaveProject, 3000);
}
async function omLoadProjectScene(meta) {
  const id = omProjectId, pass = omPass();
  try {
    const headers = {};
    if (pass) headers["x-om-pass"] = pass;
    const omLoadProjectSceneStatus = await fetch("/api/project/" + id + "/scene", {
      headers
    });
    if (omLoadProjectSceneStatus.status === 401) {
      sessionStorage.removeItem("om_pass_" + id);
      showOmPassword(meta, () => omLoadProjectScene(meta));
      return;
    }
    if (!omLoadProjectSceneStatus.ok) throw new Error("HTTP " + omLoadProjectSceneStatus.status);
    const omLoadProjectSceneValue = await omLoadProjectSceneStatus.text();
    const uploads = meta.uploads || [];
    omUploads = uploads;
    await window.AM.loadPreset(new File([omLoadProjectSceneValue], (meta.name || "proyek") + ".xml", {
      type: "text/xml"
    }));
    omRestoreMediaUploads(uploads);
    if (renderer) {
      renderer.setImages(helperValue());
      isDirty = true;
      renderer.renderAt(playheadMs);
    }
    if (projectScene && meta && meta.name) {
      projectScene.title = meta.name;
    }
    const topTitle = document.getElementById("am-project-title");
    if (topTitle) topTitle.value = (projectScene && projectScene.title) || meta.name || id;
    if (omRewriteAudioSrcs(uploads)) await handleHelperValue();
    appendLog("[PROYEK] terbuka: " + (meta.name || id));
    const land = document.getElementById("om-landing");
    land && land.remove();
    const passBack = document.getElementById("om-pass-back");
    passBack && passBack.remove();
  } catch (omLoadProjectSceneMessage) {
    appendLog("[PROYEK] gagal memuat: " + omLoadProjectSceneMessage.message);
  }
}
async function omOpenProject(id) {
  omProjectId = id;
  let meta;
  try {
    const omOpenProjectStatus = await fetch("/api/project/" + id);
    if (omOpenProjectStatus.status === 404) {
      appendLog("[PROYEK] tidak ditemukan: " + id);
      showOmLanding();
      return;
    }
    meta = await omOpenProjectStatus.json();
  } catch (omOpenProjectMessage) {
    appendLog("[PROYEK] server tidak menjawab: " + omOpenProjectMessage.message);
    showOmLanding();
    return;
  }
  if (meta.hasPassword && !sessionStorage.getItem("om_pass_" + id)) {
    showOmPassword(meta, () => omLoadProjectScene(meta));
    return;
  }
  await omLoadProjectScene(meta);
}
omInitProjectSettingsCard();
var omPropsLayerId = null,
  omPropsSnap = null;
var OM_BLENDS = [
  ["Normal", ["normal"]],
  ["Darken", ["multiply", "darken", "color-burn", "linear-burn", "darker-color"]],
  ["Lighten", ["screen", "lighten", "color-dodge", "linear-dodge", "lighter-color", "add", "plus"]],
  ["Difference", ["difference", "diff", "exclusion", "subtract", "divide"]],
  ["Contrast", ["overlay", "soft-overlay", "soft-light", "hard-light", "vivid-light", "pin-light", "linear-light"]],
  ["Color", ["hue", "saturation", "color", "luminance"]],
  ["Mask", ["mask", "clipping-mask", "mask-fill", "mask-exclude", "exclude", "dst-in", "dst-out"]]
];
var OM_PALETTE = ["#ffff00", "#ff9900", "#ff0000", "#ff00cc", "#9900ff", "#0066ff", "#00ccff", "#00cc66", "#ffffff", "#999999", "#000000"];
function omPropsBegin() {
  if (!omPropsSnap) omPropsSnap = sceneSnapshot();
}
function omPropsCommit() {
  if (omPropsSnap) pushUndo(omPropsSnap), omPropsSnap = null;
  isDirty = true;
  try {
    renderer && renderer.renderAt(playheadMs);
  } catch (omPropsCommitValue) {}
  try {
    omKfRefresh();
  } catch (omPropsCommitResult) {}
}
const OM_DEFAULT_FONTS = [
  "Roboto", "Space Grotesk", "Montserrat", "Poppins", "Oswald", "Bebas Neue",
  "Inter", "Playfair Display", "Anton", "Pacifico", "Caveat", "Dancing Script",
  "Cinzel", "Permanent Marker", "Raleway", "Merriweather", "Lobster", "Roboto Mono",
  "Comic Neue", "Fredoka", "Kanit", "Outfit", "Comfortaa", "Rubik", "Righteous",
  "Bungee", "Abril Fatface", "Titan One", "Alfa Slab One", "Archivo Black",
  "Syne", "Work Sans", "Plus Jakarta Sans", "DM Sans", "Urbanist"
];
function omEnsureGoogleFont(fontName) {
  if (!fontName || fontName === "Roboto" || fontName === "sans-serif") return;
  if (renderer && renderer.customFonts && renderer.customFonts.has(fontName)) return;
  if (typeof document !== "undefined" && document.querySelector(`link[data-font="${fontName}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.dataset.font = fontName;
  link.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(fontName).replace(/%20/g, "+") + ":wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
  if (document.fonts && document.fonts.load) {
    document.fonts.load(`16px "${fontName}"`).then(() => {
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omEnsureGoogleFontValue) {}
    }).catch(() => {});
  }
}
function omInitPropsPanel() {
  if (document.getElementById("om-props")) return;
  const ominitpropspStyleEl = document.createElement("style");
  ominitpropspStyleEl.textContent = "#om-props{position:fixed;top:56px;right:8px;width:268px;max-height:calc(100vh - 200px);overflow:auto;background:var(--panel);border:1px solid var(--line2);border-radius:14px;z-index:9998;display:none;box-shadow:0 10px 30px rgba(0,0,0,.45);padding:10px 12px 14px}#om-props.on{display:block}.om-props-head{display:flex;gap:6px;align-items:center;justify-content:space-between}.om-props-head strong{font-size:.9rem}.om-props-head span{font-size:.64rem;color:var(--muted);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.om-props-sec{font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:12px 0 6px;border-top:1px solid var(--line2);padding-top:10px}.om-props-sec:first-of-type{border-top:0;padding-top:0;margin-top:4px}.om-props-row{display:flex;gap:6px;align-items:center}.om-props-row input[type=text]{flex:1;min-width:0;background:var(--card);border:1px solid var(--line2);border-radius:8px;color:var(--text);padding:7px 8px;font-size:.8rem}#om-propColor{width:36px;height:32px;padding:0;border:1px solid var(--line2);border-radius:8px;background:var(--card);cursor:pointer}#om-propBlend,#om-propOp{width:100%}#om-propSw{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}#om-propSw i{width:20px;height:20px;border-radius:5px;cursor:pointer;border:1px solid rgba(255,255,255,.3);display:block}#om-propOpv{font-size:.78rem;min-width:38px;text-align:right}";
  document.head.appendChild(ominitpropspStyleEl);
  const panel = document.createElement("div");
  panel.id = "om-props";
  const blendOpts = OM_BLENDS.map(([blendoptsText, omInitPropsPanelArgRaw]) => '<optgroup label="' + blendoptsText + '">' + omInitPropsPanelArgRaw.map(omInitPropsPanelArg => '<option value="' + omInitPropsPanelArg + '">' + omInitPropsPanelArg + "</option>").join("") + "</optgroup>").join("");
  panel.innerHTML = '<div class="om-props-head"><strong id="om-pname2">-</strong><span id="om-ptype2"></span><button class="iconbtn" type="button" id="om-pclose" style="width:28px;height:28px">✕</button></div>' +
    '<div class="om-props-sec" id="om-sec-text" style="display:none">Teks &amp; Tipografi</div>' +
    '<div id="om-propTextRow" style="display:none">' +
      '<label class="field">Isi Teks<textarea id="om-propText" rows="2" style="width:100%;background:var(--card);border:1px solid var(--line2);border-radius:8px;color:var(--text);padding:6px 8px;font-size:.82rem" spellcheck="false"></textarea></label>' +
      '<label class="field" style="margin-top:6px">Pilihan Fon<div style="display:flex;gap:6px"><select id="om-propFont" style="flex:1"></select><input type="file" id="om-propFontFile" accept=".ttf,.otf,.woff,.woff2" style="display:none"><button type="button" class="btn sm" id="om-propFontImport" title="Impor file fon (.ttf, .otf, .woff)" style="white-space:nowrap">+ Impor</button></div></label>' +
      '<div class="om-props-row" style="margin-top:6px"><label class="field" style="flex:1">Ukuran<input type="number" id="om-propFontSize" min="6" max="600" step="1"></label><label class="field" style="flex:1">Align<select id="om-propTextAlign"><option value="left">Kiri</option><option value="center">Tengah</option><option value="right">Kanan</option><option value="justify">Rata Kiri-Kanan</option></select></label></div>' +
      '<div class="om-props-row" style="margin-top:6px"><label class="field" style="flex:1">Spasi Huruf<input type="number" id="om-propLetterSpacing" step="0.05" value="0"></label><label class="field" style="flex:1">Spasi Baris<input type="number" id="om-propLineSpacing" step="0.05" value="1"></label></div>' +
    '</div>' +
    '<div class="om-props-sec" id="om-sec-blend">Blending &amp; Opacity</div>' + '<label class="field om-props-row"><span style="width:56px">Opacity</span><input type="range" id="om-propOp" min="0" max="100" step="1" value="100"><span id="om-propOpv">100%</span></label>' + '<label class="field">Blend mode<select id="om-propBlend">' + blendOpts + '</select></label>' + '<div class="om-props-sec" id="om-sec-fill">Color &amp; Fill</div>' + '<div id="om-propFillRow"><div class="om-props-row"><input type="color" id="om-propColor" title="Pilih warna"><input type="text" id="om-propFill" placeholder="#ff000000" spellcheck="false"></div><div id="om-propSw"></div></div>' + '<div class="om-props-sec" id="om-sec-xf">Move &amp; Transform</div>' + '<div class="om-props-row"><label class="field" style="flex:1">X<input type="number" id="om-propX" step="1"></label><label class="field" style="flex:1">Y<input type="number" id="om-propY" step="1"></label></div>' + '<div class="om-props-row"><label class="field" style="flex:1">Rot °<input type="number" id="om-propR" step="0.1"></label><label class="field" style="flex:1">Skala X %<input type="number" id="om-propSX" step="0.1"></label></div>' + '<div class="om-props-row"><label class="field" style="flex:1">Skala Y %<input type="number" id="om-propSY" step="0.1"></label><button class="iconbtn on" type="button" id="om-propLink" title="Kunci skala X &amp; Y biar selaras" style="width:44px;height:34px">🔗</button></div>' + '<div class="om-props-sec" id="om-sec-bord">Border &amp; Shadow</div>' + '<label class="check"><input type="checkbox" id="om-propBord"><span>Border (stroke)</span></label>' + '<div class="om-props-row" id="om-propBordRow"><label class="field" style="flex:1">Lebar<input type="number" id="om-propBordSize" min="0" step="1"></label><input type="color" id="om-propBordColor" title="Warna border"><select id="om-propBordDir" style="width:92px"><option value="outside">Luar</option><option value="center">Tengah</option><option value="inside">Dalam</option></select></div>' + '<label class="check"><input type="checkbox" id="om-propShad"><span>Bayangan</span></label>' + '<div class="om-props-row" id="om-propShadRow"><label class="field" style="flex:1">Size<input type="number" id="om-propShadSize" min="0" step="1"></label><input type="color" id="om-propShadColor" title="Warna bayangan"><label class="field" style="flex:1">X<input type="number" id="om-propShadX" step="1"></label><label class="field" style="flex:1">Y<input type="number" id="om-propShadY" step="1"></label></div>';
  document.body.appendChild(panel);
  const ominitpropspOmPropswEl = panel.querySelector("#om-propSw");
  OM_PALETTE.forEach(background => {
    const iEl = document.createElement("i");
    iEl.style.background = background;
    iEl.title = background;
    iEl.addEventListener("click", () => {
      const omInitPropsPanelFillColor = omResolveLayer(omPropsLayerId);
      if (!omInitPropsPanelFillColor) return;
      omPropsBegin(), omInitPropsPanelFillColor.fillColor = parseHexColor("ff" + background.slice(1)), panel.querySelector("#om-propFill").value = "#ff" + background.slice(1), panel.querySelector("#om-propColor").value = background, omPropsCommit();
    });
    ominitpropspOmPropswEl.appendChild(iEl);
  });
  panel.querySelector("#om-pclose").addEventListener("click", () => {
    omPropsLayerId = null, panel.classList.remove("on");
  });
  const ominitpropspOmPropopEl = panel.querySelector("#om-propOp");
  ominitpropspOmPropopEl.addEventListener("input", () => {
    const omInitPropsPanelOmResolveLayer = omResolveLayer(omPropsLayerId);
    if (!omInitPropsPanelOmResolveLayer || !omInitPropsPanelOmResolveLayer.transform) return;
    omActProp = "op", omPropsBegin(), omInitPropsPanelOmResolveLayer.transform.opacity = omInitPropsPanelOmResolveLayer.transform.opacity || {
      value: [1],
      kfs: []
    }, omSetKeyable(omInitPropsPanelOmResolveLayer.transform.opacity, Number(ominitpropspOmPropopEl.value) / 100), panel.querySelector("#om-propOpv").textContent = ominitpropspOmPropopEl.value + "%", isDirty = true;
    try {
      renderer && renderer.renderAt(playheadMs);
    } catch (omInitPropsPanelClamped) {}
  });
  ominitpropspOmPropopEl.addEventListener("change", () => omPropsCommit());
  panel.querySelector("#om-propBlend").addEventListener("change", omInitPropsPanelArgParsed => {
    const omInitPropsPanelBlendMode = omResolveLayer(omPropsLayerId);
    if (!omInitPropsPanelBlendMode) return;
    omPropsBegin(), omInitPropsPanelBlendMode.blendMode = omInitPropsPanelArgParsed.target.value, omPropsCommit();
  });
  const fillText = panel.querySelector("#om-propFill");
  fillText.addEventListener("change", () => {
    const omInitPropsPanelValue = String(fillText.value || "").trim();
    if (!/^#?[0-9a-f]{6,8}$/i.test(omInitPropsPanelValue)) return omPropsRefresh();
    const omInitPropsPanelFlag = (omInitPropsPanelValue[0] === "#" ? omInitPropsPanelValue.slice(1) : omInitPropsPanelValue);
    const full = omInitPropsPanelFlag.length === 6 ? "ff" + omInitPropsPanelFlag : omInitPropsPanelFlag.length === 7 ? "ff" + omInitPropsPanelFlag.slice(1) : omInitPropsPanelFlag;
    const fillColorValue = omResolveLayer(omPropsLayerId);
    if (!fillColorValue) return;
    omPropsBegin(), fillColorValue.fillColor = parseHexColor("#" + full), omPropsCommit();
  });
  panel.querySelector("#om-propColor").addEventListener("input", omInitPropsPanelTarget => {
    const omInitPropsPanelValueRaw = omResolveLayer(omPropsLayerId);
    if (!omInitPropsPanelValueRaw) return;
    omPropsBegin(), omInitPropsPanelValueRaw.fillColor = parseHexColor("ff" + String(omInitPropsPanelTarget.target.value).slice(1)), isDirty = true;
    try {
      renderer && renderer.renderAt(playheadMs);
    } catch (omInitPropsPanelValueScoped) {}
    fillText.value = "#ff" + String(omInitPropsPanelTarget.target.value).slice(1);
  });
  panel.querySelector("#om-propColor").addEventListener("change", () => omPropsCommit());
  // ---- Move & Transform (numerik, gaya desktop) ----
  let xfLink = true;
  const ominitpropspCallback = numValue => panel.querySelector(numValue);
  const readT = () => {
    const omResolveLayerValue = omResolveLayer(omPropsLayerId);
    return omResolveLayerValue && omResolveLayerValue.transform ? omResolveLayerValue.transform : null;
  };
  ominitpropspCallback("#om-propLink").addEventListener("click", () => {
    xfLink = !xfLink, ominitpropspCallback("#om-propLink").classList.toggle("on", xfLink);
  });
  ominitpropspCallback("#om-propX").addEventListener("change", () => {
    omActProp = "loc"; const userTouched = omResolveLayer(omPropsLayerId); if (userTouched) userTouched.userTouched = true; const omInitPropsPanelReadT = readT();
    if (!omInitPropsPanelReadT) return;
    omPropsBegin(), omSetKeyable(omInitPropsPanelReadT.location, [Number(ominitpropspCallback("#om-propX").value) || 0, Number(ominitpropspCallback("#om-propY").value) || 0, (omInitPropsPanelReadT.location.value && omInitPropsPanelReadT.location.value[2]) || 0]), omPropsCommit();
  });
  ominitpropspCallback("#om-propY").addEventListener("change", () => {
    omActProp = "loc"; const omInitPropsPanelUserTouched = omResolveLayer(omPropsLayerId); if (omInitPropsPanelUserTouched) omInitPropsPanelUserTouched.userTouched = true; const readTValue = readT();
    if (!readTValue) return;
    omPropsBegin(), omSetKeyable(readTValue.location, [Number(ominitpropspCallback("#om-propX").value) || 0, Number(ominitpropspCallback("#om-propY").value) || 0, (readTValue.location.value && readTValue.location.value[2]) || 0]), omPropsCommit();
  });
  ominitpropspCallback("#om-propR").addEventListener("change", () => {
    omActProp = "rot"; const userTouchedValue = omResolveLayer(omPropsLayerId); if (userTouchedValue) userTouchedValue.userTouched = true; const rotation = readT();
    if (!rotation) return;
    omPropsBegin(), omSetKeyable(rotation.rotation, Number(ominitpropspCallback("#om-propR").value) || 0), omPropsCommit();
  });
  ominitpropspCallback("#om-propSX").addEventListener("change", () => {
    omActProp = "sc"; const omInitPropsPanelRaw = omResolveLayer(omPropsLayerId); if (omInitPropsPanelRaw) omInitPropsPanelRaw.userTouched = true; const omInitPropsPanelScale = readT();
    if (!omInitPropsPanelScale) return;
    const ominitpropspValue = (Number(ominitpropspCallback("#om-propSX").value) || 0) / 100;
    xfLink && (ominitpropspCallback("#om-propSY").value = ominitpropspCallback("#om-propSX").value);
    omPropsBegin(), omSetKeyable(omInitPropsPanelScale.scale, [ominitpropspValue, xfLink ? ominitpropspValue : (Number(ominitpropspCallback("#om-propSY").value) || 0) / 100]), omPropsCommit();
  });
  ominitpropspCallback("#om-propSY").addEventListener("change", () => {
    omActProp = "sc"; const omInitPropsPanelValueParsed = omResolveLayer(omPropsLayerId); if (omInitPropsPanelValueParsed) omInitPropsPanelValueParsed.userTouched = true; const scaleValue = readT();
    if (!scaleValue) return;
    const omInitPropsPanelParsed = (Number(ominitpropspCallback("#om-propSY").value) || 0) / 100;
    xfLink && (ominitpropspCallback("#om-propSX").value = ominitpropspCallback("#om-propSY").value);
    omPropsBegin(), omSetKeyable(scaleValue.scale, [xfLink ? omInitPropsPanelParsed : (Number(ominitpropspCallback("#om-propSX").value) || 0) / 100, omInitPropsPanelParsed]), omPropsCommit();
  });
  // ---- Border & Shadow ----
  const bordChk = panel.querySelector("#om-propBord");
  const applyBord = live => {
    const omInitPropsPanelBorder = omResolveLayer(omPropsLayerId);
    if (!omInitPropsPanelBorder) return;
    omPropsBegin();
    if (bordChk.checked) {
      const size = Math.max(0, Number(ominitpropspCallback("#om-propBordSize").value) || 4);
      const applybordText = String(ominitpropspCallback("#om-propBordColor").value || "#ffffff");
      const applybordValue = ominitpropspCallback("#om-propBordDir").value || "outside";
      omInitPropsPanelBorder.border = {
        direction: applybordValue,
        color: parseHexColor("ff" + applybordText.slice(1)),
        size: size,
        enabled: true
      };
      ominitpropspCallback("#om-propBordSize").value = size;
    } else delete omInitPropsPanelBorder.border;
    if (live) isDirty = true;
    try {
      renderer && renderer.renderAt(playheadMs);
    } catch (omInitPropsPanelScoped) {}
    live && omPropsCommit();
  };
  bordChk.addEventListener("change", () => {
    ominitpropspCallback("#om-propBordRow").style.display = bordChk.checked ? "" : "none", applyBord(true);
  });
  ominitpropspCallback("#om-propBordSize").addEventListener("change", () => applyBord(true));
  ominitpropspCallback("#om-propBordDir").addEventListener("change", () => applyBord(true));
  ominitpropspCallback("#om-propBordColor").addEventListener("input", () => applyBord(false));
  ominitpropspCallback("#om-propBordColor").addEventListener("change", () => omPropsCommit());
  const shadChk = panel.querySelector("#om-propShad");
  const applyShad = live => {
    const omInitPropsPanelShadow = omResolveLayer(omPropsLayerId);
    if (!omInitPropsPanelShadow) return;
    omPropsBegin();
    if (shadChk.checked) {
      const size = Math.max(0, Number(ominitpropspCallback("#om-propShadSize").value) || 8);
      const applyshadValue = Number(ominitpropspCallback("#om-propShadX").value) || 0;
      const omInitPropsPanelValueClamped = Number(ominitpropspCallback("#om-propShadY").value) || 4;
      const applyshadText = String(ominitpropspCallback("#om-propShadColor").value || "#000000");
      omInitPropsPanelShadow.shadow = {
        enabled: true,
        direction: "outside",
        color: parseHexColor("80" + applyshadText.slice(1)),
        size: size,
        offset: [applyshadValue, omInitPropsPanelValueClamped]
      };
      ominitpropspCallback("#om-propShadSize").value = size;
    } else delete omInitPropsPanelShadow.shadow;
    if (live) isDirty = true;
    try {
      renderer && renderer.renderAt(playheadMs);
    } catch (omInitPropsPanelValueLocal) {}
    live && omPropsCommit();
  };
  shadChk.addEventListener("change", () => {
    ominitpropspCallback("#om-propShadRow").style.display = shadChk.checked ? "" : "none", applyShad(true);
  });
  ominitpropspCallback("#om-propShadSize").addEventListener("change", () => applyShad(true));
  ominitpropspCallback("#om-propShadX").addEventListener("change", () => applyShad(true));
  ominitpropspCallback("#om-propShadY").addEventListener("change", () => applyShad(true));
  ominitpropspCallback("#om-propShadColor").addEventListener("input", () => applyShad(false));
  ominitpropspCallback("#om-propShadColor").addEventListener("change", () => omPropsCommit());

  // ---- Text & Typography event listeners ----
  const txtContent = ominitpropspCallback("#om-propText");
  if (txtContent) {
    txtContent.addEventListener("input", () => {
      const omInitPropsPanelTag = omResolveLayer(omPropsLayerId);
      if (!omInitPropsPanelTag || omInitPropsPanelTag.tag !== "text") return;
      omPropsBegin();
      omInitPropsPanelTag.textContent = txtContent.value;
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omInitPropsPanelLocal) {}
    });
    txtContent.addEventListener("change", () => omPropsCommit());
  }

  const txtFont = ominitpropspCallback("#om-propFont");
  if (txtFont) {
    txtFont.addEventListener("change", () => {
      const omInitPropsPanelFont = omResolveLayer(omPropsLayerId);
      if (!omInitPropsPanelFont || omInitPropsPanelFont.tag !== "text") return;
      omPropsBegin();
      const omInitPropsPanelResult = txtFont.value;
      omEnsureGoogleFont(omInitPropsPanelResult);
      omInitPropsPanelFont.font = (renderer && renderer.customFonts && renderer.customFonts.has(omInitPropsPanelResult)) ? omInitPropsPanelResult : "googlefonts?name=" + encodeURIComponent(omInitPropsPanelResult);
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omInitPropsPanelValueOuter) {}
      omPropsCommit();
    });
  }

  const txtFontImport = ominitpropspCallback("#om-propFontImport");
  const txtFontFile = ominitpropspCallback("#om-propFontFile");
  if (txtFontImport && txtFontFile) {
    txtFontImport.addEventListener("click", () => txtFontFile.click());
    txtFontFile.addEventListener("change", async (omInitPropsPanelArgValue) => {
      const file = omInitPropsPanelArgValue.target.files && omInitPropsPanelArgValue.target.files[0];
      if (!file) return;
      try {
        const fontName = await omImportFontFile(file);
        if (fontName) {
          const fontValue = omResolveLayer(omPropsLayerId);
          if (fontValue && fontValue.tag === "text") {
            omPropsBegin();
            fontValue.font = "imported?name=" + encodeURIComponent(file.name);
            omPropsCommit();
          }
          omPropsRefresh();
          appendLog("[FONT] Font " + fontName + " berhasil diimpor.");
        }
      } catch (err) {
        alert("Gagal impor font: " + err.message);
      }
    });
  }

  const txtFontSize = ominitpropspCallback("#om-propFontSize");
  if (txtFontSize) {
    txtFontSize.addEventListener("input", () => {
      const fontSize = omResolveLayer(omPropsLayerId);
      if (!fontSize || fontSize.tag !== "text") return;
      omPropsBegin();
      fontSize.fontSize = Math.max(1, Number(txtFontSize.value) || 28);
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omInitPropsPanelOuter) {}
    });
    txtFontSize.addEventListener("change", () => omPropsCommit());
  }

  const txtAlign = ominitpropspCallback("#om-propTextAlign");
  if (txtAlign) {
    txtAlign.addEventListener("change", () => {
      const align = omResolveLayer(omPropsLayerId);
      if (!align || align.tag !== "text") return;
      omPropsBegin();
      align.align = txtAlign.value;
      omPropsCommit();
    });
  }

  const txtLetSp = ominitpropspCallback("#om-propLetterSpacing");
  if (txtLetSp) {
    txtLetSp.addEventListener("input", () => {
      const letterSpacing = omResolveLayer(omPropsLayerId);
      if (!letterSpacing || letterSpacing.tag !== "text") return;
      omPropsBegin();
      letterSpacing.letterSpacing = Number(txtLetSp.value) || 0;
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omInitPropsPanelValueInner) {}
    });
    txtLetSp.addEventListener("change", () => omPropsCommit());
  }

  const txtLineSp = ominitpropspCallback("#om-propLineSpacing");
  if (txtLineSp) {
    txtLineSp.addEventListener("input", () => {
      const lineSpacing = omResolveLayer(omPropsLayerId);
      if (!lineSpacing || lineSpacing.tag !== "text") return;
      omPropsBegin();
      lineSpacing.lineSpacing = Math.max(0.1, Number(txtLineSp.value) || 1);
      isDirty = true;
      try { renderer && renderer.renderAt(playheadMs); } catch (omInitPropsPanelInner) {}
    });
    txtLineSp.addEventListener("change", () => omPropsCommit());
  }

  const kfSec = document.createElement("div");
  kfSec.className = "om-props-sec", kfSec.id = "om-sec-kf", kfSec.textContent = "Keyframe";
  const kfRow = document.createElement("div");
  kfRow.className = "om-props-row", kfRow.style.cssText = "flex-wrap:wrap;gap:5px";
  [["P", "loc"], ["R", "rot"], ["S", "sc"], ["O", "op"]].forEach(([ominitpropspText, kfp]) => {
    const omInitPropsPanelButtonEl = document.createElement("button");
    omInitPropsPanelButtonEl.type = "button", omInitPropsPanelButtonEl.dataset.kfp = kfp, omInitPropsPanelButtonEl.textContent = "◇ " + ominitpropspText, omInitPropsPanelButtonEl.title = "Tambah keyframe";
    omInitPropsPanelButtonEl.addEventListener("click", () => {
      omActProp = kfp, omKfInsert(kfp);
    });
    kfRow.appendChild(omInitPropsPanelButtonEl);
  });
  const ominitpropspButtonEl = document.createElement("button");
  ominitpropspButtonEl.type = "button", ominitpropspButtonEl.className = "btn sm", ominitpropspButtonEl.id = "om-open-curve", ominitpropspButtonEl.textContent = "Curve…", ominitpropspButtonEl.disabled = true, ominitpropspButtonEl.title = "Buka curve editor";
  ominitpropspButtonEl.addEventListener("click", () => omOpenCurve());
  kfRow.appendChild(ominitpropspButtonEl), panel.appendChild(kfSec), panel.appendChild(kfRow);
}
omInitPropsPanel();
applyFlag = (function(orig) {
  return function(localArgCount, argMedia) {
    const localOrig = orig(localArgCount, argMedia);
    try {
      omPropsLayerId = localArgCount ? localArgCount.id : null, omPropsRefresh();
      if (typeof window.omOnLayerSelected === "function") window.omOnLayerSelected(localArgCount);
    } catch (localNodeNext) {}
    return localOrig;
  };
})(applyFlag);
bindFlag = (function(orig) {
  return function() {
    const localEntryNested = orig.apply(this, arguments);
    try {
      omPropsRefresh();
    } catch (localNodePrev) {}
    return localEntryNested;
  };
})(bindFlag);
function omTrimSide(side, layer) {
  const omTrimSideValue = omMulti.size ? omMultiIds() : [];
  const targets = omTrimSideValue.length ? omTrimSideValue.map(id => omResolveLayer(id)).filter(Boolean) : [layer || omLayerCur()].filter(Boolean);
  if (!targets.length) return appendLog("[EDIT] trim: pilih layer terlebih dahulu");
  const snap = sceneSnapshot();
  let count = 0;
  for (const omTrimSideStartTime of targets) {
    const startTimeValue = playheadMs,
      omtrimsideValue = omTrimSideStartTime.startTime || 0,
      omTrimSideResult = omTrimSideStartTime.endTime != null ? omTrimSideStartTime.endTime : (projectScene ? projectScene.totalTime : 0);
    if (startTimeValue <= omtrimsideValue + 50 || startTimeValue >= omTrimSideResult - 50) continue;
    if (side === "l") {
      const omTrimSideValueRaw = startTimeValue - omtrimsideValue;
      omTrimSideStartTime.startTime = startTimeValue;
      if (omTrimSideStartTime.inTime != null || omTrimSideStartTime.outTime != null || omTrimSideStartTime.src || omTrimSideStartTime.fillVideo) {
        omTrimSideStartTime.inTime = (omTrimSideStartTime.inTime || 0) + omTrimSideValueRaw;
      }
    } else {
      omTrimSideStartTime.endTime = startTimeValue;
      if (omTrimSideStartTime.inTime != null || omTrimSideStartTime.outTime != null || omTrimSideStartTime.src || omTrimSideStartTime.fillVideo) {
        omTrimSideStartTime.outTime = (omTrimSideStartTime.inTime || 0) + (startTimeValue - omtrimsideValue);
      }
    }
    count++;
  }
  if (!count) return appendLog("[EDIT] trim: geser playhead dulu ke dalam layer");
  pushUndo(snap), isDirty = true;
  appendLog("[EDIT] " + (side === "l" ? "Trim kiri" : "Trim kanan") + " (" + count + " layer) → " + Math.round(playheadMs) + " ms");
  bindFlag(), renderer && renderer.renderAt(playheadMs);
}
function omMuteToggle() {
  const omMuteToggleOmLayerCur = omLayerCur();
  if (!omMuteToggleOmLayerCur) return;
  const snap = sceneSnapshot();
  const omMuteToggleValue = omMuteToggleOmLayerCur.gain && omMuteToggleOmLayerCur.gain.value ? Number(omMuteToggleOmLayerCur.gain.value[0]) : 1;
  omMuteToggleOmLayerCur.gain = {
    value: [omMuteToggleValue > 0 ? 0 : 1],
    kfs: []
  }, pushUndo(snap), isDirty = true;
  appendLog("[EDIT] " + (omMuteToggleValue > 0 ? "Mute" : "Unmute") + " layer \"" + (omMuteToggleOmLayerCur.label || omMuteToggleOmLayerCur.id) + "\"");
  try {
    renderer && renderer.renderAt(playheadMs);
  } catch (omMuteToggleResult) {}
}
function omSetLayerSpeed(layer, speed, stretchDuration = true) {
  const omSetLayerSpeedValue = layer || omLayerCur();
  if (!omSetLayerSpeedValue) return;
  const snap = sceneSnapshot();
  const omsetlayerspValue = Math.max(0.1, Math.min(16, Number(speed) || 1));
  const curDur = Math.max(50, (omSetLayerSpeedValue.endTime != null ? omSetLayerSpeedValue.endTime : (projectScene ? projectScene.totalTime : 0)) - (omSetLayerSpeedValue.startTime || 0));
  if (!omSetLayerSpeedValue._origDuration || typeof omSetLayerSpeedValue._origDuration !== "number") {
    omSetLayerSpeedValue._origDuration = curDur * (omSetLayerSpeedValue.speed || 1);
  }
  omSetLayerSpeedValue.speed = omsetlayerspValue;
  omSetLayerSpeedValue.timeScale = omsetlayerspValue;
  if (stretchDuration) {
    omSetLayerSpeedValue.timeStretchMode = "stretch";
    const newDur = Math.max(50, Math.round(omSetLayerSpeedValue._origDuration / omsetlayerspValue));
    omSetLayerSpeedValue.endTime = (omSetLayerSpeedValue.startTime || 0) + newDur;
    omExtendTotal(omSetLayerSpeedValue.endTime);
  } else {
    omSetLayerSpeedValue.timeStretchMode = "keep";
  }
  pushUndo(snap), isDirty = true;
  appendLog("[SPEED] Kecepatan layer \"" + (omSetLayerSpeedValue.label || omSetLayerSpeedValue.id) + "\" diatur ke " + omsetlayerspValue + "x (" + (omSetLayerSpeedValue.timeStretchMode === "stretch" ? "Ubah Durasi" : "Pertahankan Durasi") + ")");
  bindFlag(), renderer && renderer.renderAt(playheadMs);
}
function omRetime(action, layer) {
  const omRetimeValue = layer || omLayerCur();
  if (!omRetimeValue) return appendLog("[RETIME] Pilih layer terlebih dahulu");
  const snap = sceneSnapshot();
  const omretimeValue = Math.round(playheadMs);
  let omRetimeResult = omRetimeValue.startTime || 0;
  let omRetimeValueRaw = omRetimeValue.endTime != null ? omRetimeValue.endTime : (projectScene ? projectScene.totalTime : 0);
  const curDur = Math.max(50, omRetimeValueRaw - omRetimeResult);
  if (!omRetimeValue._origDuration) omRetimeValue._origDuration = curDur * (omRetimeValue.speed || 1);

  if (action === "extend_start") {
    const newStart = Math.min(omretimeValue, omRetimeValueRaw - 50);
    const newDur = Math.max(50, omRetimeValueRaw - newStart);
    const ratio = curDur / newDur;
    omRetimeValue.startTime = newStart;
    omRetimeValue.speed = Number(Math.max(0.1, Math.min(16, (omRetimeValue.speed || 1) * ratio)).toFixed(3));
    omRetimeValue.timeScale = omRetimeValue.speed;
  } else if (action === "reduce_start") {
    const newStart = Math.min(Math.max(omretimeValue, 0), omRetimeValueRaw - 50);
    const newDur = Math.max(50, omRetimeValueRaw - newStart);
    const ratio = curDur / newDur;
    omRetimeValue.startTime = newStart;
    omRetimeValue.speed = Number(Math.max(0.1, Math.min(16, (omRetimeValue.speed || 1) * ratio)).toFixed(3));
    omRetimeValue.timeScale = omRetimeValue.speed;
  } else if (action === "reduce_end") {
    const newEnd = Math.max(omretimeValue, omRetimeResult + 50);
    const newDur = Math.max(50, newEnd - omRetimeResult);
    const ratio = curDur / newDur;
    omRetimeValue.endTime = newEnd;
    omRetimeValue.speed = Number(Math.max(0.1, Math.min(16, (omRetimeValue.speed || 1) * ratio)).toFixed(3));
    omRetimeValue.timeScale = omRetimeValue.speed;
  } else if (action === "extend_end") {
    const newEnd = Math.max(omretimeValue, omRetimeResult + 50);
    const newDur = Math.max(50, newEnd - omRetimeResult);
    const ratio = curDur / newDur;
    omRetimeValue.endTime = newEnd;
    omRetimeValue.speed = Number(Math.max(0.1, Math.min(16, (omRetimeValue.speed || 1) * ratio)).toFixed(3));
    omRetimeValue.timeScale = omRetimeValue.speed;
    omExtendTotal(omRetimeValue.endTime);
  }
  pushUndo(snap), isDirty = true;
  appendLog("[RETIME] " + action + " layer \"" + (omRetimeValue.label || omRetimeValue.id) + "\" (" + omRetimeValue.speed + "x, durasi " + Math.round(omRetimeValue.endTime - omRetimeValue.startTime) + " ms)");
  bindFlag(), renderer && renderer.renderAt(playheadMs);
}
function omToggleFreezeFrame(layer) {
  const omToggleFreezeFrameValue = layer || omLayerCur();
  if (!omToggleFreezeFrameValue) return;
  const snap = sceneSnapshot();
  if (omToggleFreezeFrameValue.freezeTime != null) {
    omToggleFreezeFrameValue.freezeTime = null;
    omToggleFreezeFrameValue.freezeFrame = false;
    appendLog("[SPEED] Freeze frame dinonaktifkan");
  } else {
    const omtogglefreeValue = omToggleFreezeFrameValue.startTime || 0;
    const omToggleFreezeFrameMax = Math.max(1, (omToggleFreezeFrameValue.endTime != null ? omToggleFreezeFrameValue.endTime : (projectScene ? projectScene.totalTime : 0)) - omtogglefreeValue);
    const norm = Math.max(0, Math.min(1, (playheadMs - omtogglefreeValue) / omToggleFreezeFrameMax));
    omToggleFreezeFrameValue.freezeTime = norm;
    omToggleFreezeFrameValue.freezeFrame = true;
    appendLog("[SPEED] Freeze frame aktif di " + (norm * 100).toFixed(1) + "%");
  }
  pushUndo(snap), isDirty = true;
  renderer && renderer.renderAt(playheadMs);
}
function omToggleReverse(layer) {
  const omToggleReverseValue = layer || omLayerCur();
  if (!omToggleReverseValue) return;
  const snap = sceneSnapshot();
  omToggleReverseValue.reversed = !omToggleReverseValue.reversed;
  pushUndo(snap), isDirty = true;
  appendLog("[SPEED] Putar balik (Reverse) " + (omToggleReverseValue.reversed ? "aktif" : "nonaktif"));
  renderer && renderer.renderAt(playheadMs);
}
function omSetSpeedCurve(layer, curveType) {
  const omSetSpeedCurveValue = layer || omLayerCur();
  if (!omSetSpeedCurveValue) return;
  const snap = sceneSnapshot();
  if (!curveType || curveType === "linear") {
    omSetSpeedCurveValue.speedCurve = null;
  } else {
    const curves = {
      ease_in: (curvesValue) => curvesValue * curvesValue,
      ease_out: (omSetSpeedCurveArgRaw) => omSetSpeedCurveArgRaw * (2 - omSetSpeedCurveArgRaw),
      ease_in_out: (omSetSpeedCurveArg) => (omSetSpeedCurveArg < 0.5 ? 2 * omSetSpeedCurveArg * omSetSpeedCurveArg : -1 + (4 - 2 * omSetSpeedCurveArg) * omSetSpeedCurveArg),
      fast_start: (omSetSpeedCurveRaw) => 1 - Math.pow(1 - omSetSpeedCurveRaw, 3),
      slow_motion: (omSetSpeedCurveArgValue) => (omSetSpeedCurveArgValue < 0.5 ? 0.5 * Math.pow(2 * omSetSpeedCurveArgValue, 0.6) : 1 - 0.5 * Math.pow(2 * (1 - omSetSpeedCurveArgValue), 0.6)),
      dramatic: (omSetSpeedCurveArgParsed) => Math.pow(omSetSpeedCurveArgParsed, 3)
    };
    omSetSpeedCurveValue.speedCurve = {
      type: curveType,
      evaluate: curves[curveType] || ((omSetSpeedCurveParsed) => omSetSpeedCurveParsed)
    };
  }
  pushUndo(snap), isDirty = true;
  appendLog("[SPEED] Kurva kecepatan diatur ke " + (curveType || "linear"));
  renderer && renderer.renderAt(playheadMs);
}
function omOpenTextDlg(layer) {
  const omOpenTextDlgValue = layer || omLayerCur();
  if (!omOpenTextDlgValue || omOpenTextDlgValue.tag !== "text") return;
  if (typeof window.omOpenTextEditor === "function" && document.getElementById("am-navbar-textedit") && document.getElementById("am-navbar-textedit").offsetParent !== null) {
    return window.omOpenTextEditor(omOpenTextDlgValue);
  }
  if (document.getElementById("om-txt-back")) return;
  const back = document.createElement("div");
  back.id = "om-txt-back";
  back.style.cssText = "position:fixed;inset:0;z-index:100003;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px";

  let curFont = omOpenTextDlgValue.font || "Roboto";
  if (curFont.includes("name=")) {
    const omOpenTextDlgFlag = curFont.match(/name=([^&]+)/);
    if (omOpenTextDlgFlag) curFont = decodeURIComponent(omOpenTextDlgFlag[1]).replace(/\.[^/.]+$/, "");
  }
  const fontList = omGetFontList();
  if (!fontList.includes(curFont)) fontList.unshift(curFont);
  const fontOptions = fontList.map(fontoptionsText => '<option value="' + fontoptionsText + '"' + (fontoptionsText === curFont ? ' selected' : '') + '>' + fontoptionsText + '</option>').join("");

  back.innerHTML = '<div class="om-dialog" style="max-width:400px;width:100%">' +
    '<h2>Edit Teks</h2>' +
    '<div class="om-field" style="margin-bottom:8px">' +
      '<label>Teks</label>' +
      '<textarea id="om-txt" rows="3" style="width:100%;background:var(--card);border:1px solid var(--line2);border-radius:8px;color:var(--text);padding:8px;font-size:.9rem" spellcheck="false"></textarea>' +
    '</div>' +
    '<div class="om-field" style="margin-bottom:8px">' +
      '<label>Pilihan Fon</label>' +
      '<div style="display:flex;gap:6px">' +
        '<select id="om-txtfont" style="flex:1;background:var(--card);border:1px solid var(--line2);border-radius:8px;color:var(--text);padding:6px 8px">' + fontOptions + '</select>' +
        '<input type="file" id="om-txtfile" accept=".ttf,.otf,.woff,.woff2" style="display:none">' +
        '<button type="button" class="btn sm" id="om-txtimport" title="Impor file fon (.ttf, .otf, .woff)">+ Impor</button>' +
      '</div>' +
    '</div>' +
    '<div class="om-row" style="margin-bottom:8px">' +
      '<label class="field" style="flex:1">Ukuran<input type="number" id="om-txtsize" min="1" max="600" step="1"></label>' +
      '<label class="field" style="flex:1">Align<select id="om-txtalign"><option value="left">Kiri</option><option value="center">Tengah</option><option value="right">Kanan</option><option value="justify">Rata Kiri-Kanan</option></select></label>' +
    '</div>' +
    '<div class="om-row" style="margin-bottom:12px">' +
      '<label class="field" style="flex:1">Spasi Huruf<input type="number" id="om-txtletsp" step="0.05" value="0"></label>' +
      '<label class="field" style="flex:1">Spasi Baris<input type="number" id="om-txtlinesp" step="0.05" value="1"></label>' +
    '</div>' +
    '<button class="om-btn primary" type="button" id="om-txtok">Terapkan</button>' +
    '<button class="om-btn" type="button" id="om-txtcancel" style="margin-top:8px;background:var(--card);color:var(--text)">Batal</button>' +
  '</div>';
  document.body.appendChild(back);
  const omopentextdlOmTxtEl = back.querySelector("#om-txt");
  omopentextdlOmTxtEl.value = omOpenTextDlgValue.textContent || "";
  back.querySelector("#om-txtsize").value = omOpenTextDlgValue.fontSize || 48;
  back.querySelector("#om-txtalign").value = omOpenTextDlgValue.align || "center";
  back.querySelector("#om-txtletsp").value = omOpenTextDlgValue.letterSpacing !== undefined ? omOpenTextDlgValue.letterSpacing : 0;
  back.querySelector("#om-txtlinesp").value = omOpenTextDlgValue.lineSpacing !== undefined ? omOpenTextDlgValue.lineSpacing : 1;

  const txtFontSel = back.querySelector("#om-txtfont");
  const txtImportBtn = back.querySelector("#om-txtimport");
  const txtFileInput = back.querySelector("#om-txtfile");

  txtImportBtn.addEventListener("click", () => txtFileInput.click());
  txtFileInput.addEventListener("change", async (omOpenTextDlgTarget) => {
    const file = omOpenTextDlgTarget.target.files && omOpenTextDlgTarget.target.files[0];
    if (!file) return;
    try {
      const fontName = await omImportFontFile(file);
      if (fontName) {
        const fonts = omGetFontList();
        if (!fonts.includes(fontName)) fonts.unshift(fontName);
        txtFontSel.innerHTML = fonts.map(omopentextdlText => '<option value="' + omopentextdlText + '"' + (omopentextdlText === fontName ? ' selected' : '') + '>' + omopentextdlText + '</option>').join("");
      }
    } catch (err) {
      alert("Gagal impor font: " + err.message);
    }
  });

  const close = () => back.remove();
  back.querySelector("#om-txtcancel").addEventListener("click", close);
  back.addEventListener("pointerdown", omOpenTextDlgArg => {
    if (omOpenTextDlgArg.target === back) close();
  });
  back.querySelector("#om-txtok").addEventListener("click", () => {
    const layer = omLayerCur();
    if (!layer) return close();
    const snap = sceneSnapshot();
    layer.textContent = omopentextdlOmTxtEl.value;
    layer.fontSize = Math.max(1, Number(back.querySelector("#om-txtsize").value) || layer.fontSize || 48);
    layer.align = back.querySelector("#om-txtalign").value;
    layer.letterSpacing = Number(back.querySelector("#om-txtletsp").value) || 0;
    layer.lineSpacing = Math.max(0.1, Number(back.querySelector("#om-txtlinesp").value) || 1);
    const selF = txtFontSel.value;
    omEnsureGoogleFont(selF);
    layer.font = (renderer && renderer.customFonts && renderer.customFonts.has(selF)) ? selF : "googlefonts?name=" + encodeURIComponent(selF);
    pushUndo(snap), isDirty = true, appendLog("[EDIT] Teks layer \"" + (layer.label || layer.id) + "\" diperbarui");
    try {
      renderer && renderer.renderAt(playheadMs);
    } catch (omOpenTextDlgResult) {}
    close();
  });
  setTimeout(() => omopentextdlOmTxtEl.focus(), 60);
}
omInitElemBar();
var omFxIndexCache = null,
  omFxDialogLayer = null;
async function omFxIndex() {
  if (omFxIndexCache) return omFxIndexCache;
  const omFxIndexValue = await (await fetch("./effect-index.json")).json();
  const seen = new Set(),
    omFxIndexList = [];
  for (const id of Object.keys(omFxIndexValue)) {
    const omFxIndexId = omFxIndexValue[id];
    if (typeof omFxIndexId !== "string" || !omFxIndexId.endsWith(".xml") || seen.has(omFxIndexId)) continue;
    seen.add(omFxIndexId), omFxIndexList.push({
      id,
      f: omFxIndexId
    });
  }
  const omfxindexItems = [];
  for (let omFxIndexNumber = 0; omFxIndexNumber < omFxIndexList.length; omFxIndexNumber += 24) {
    const chunkL = omFxIndexList.slice(omFxIndexNumber, omFxIndexNumber + 24);
    const omFxIndexValueRaw = await Promise.all(chunkL.map(async omFxIndexF => {
      let name = omFxIndexF.id,
        resText = "other",
        omFxIndexText = "";
      try {
        const omFxIndexOk = await fetch("./effects/" + omFxIndexF.f);
        if (omFxIndexOk.ok) omFxIndexText = await omFxIndexOk.text();
      } catch (err) {}
      const omFxIndexFlag = /<effect\b[^>]*\bname="([^"]*)"/.exec(omFxIndexText);
      if (omFxIndexFlag) name = omFxIndexFlag[1];
      const omFxIndexResult = /<effect\b[^>]*\bcategory="([^"]*)"/.exec(omFxIndexText);
      if (omFxIndexResult) resText = omFxIndexResult[1];
      return {
        id: omFxIndexF.id,
        f: omFxIndexF.f,
        name,
        cat: resText,
        xml: omFxIndexText
      };
    }));
    omfxindexItems.push(...omFxIndexValueRaw);
  }
  omFxIndexCache = {
    list: omfxindexItems,
    byId: new Map(omfxindexItems.map(omFxIndexArg => [omFxIndexArg.id, omFxIndexArg]))
  };
  return omFxIndexCache;
}
async function omAddFxToLayer(layer, entry) {
  const omAddFxToLayerOmEffectObjFromXml = omEffectObjFromXml(entry.xml, entry.id);
  if (!omAddFxToLayerOmEffectObjFromXml) return appendLog("[FX] gagal parse efek " + entry.id);
  const snap = sceneSnapshot();
  layer.effects.push(omAddFxToLayerOmEffectObjFromXml), pushUndo(snap), isDirty = true;
  appendLog("[FX] Tambah efek \"" + entry.name + "\" ke \"" + (layer.label || layer.id) + "\"");
  await omHandleInContextHelper();
  renderer && renderer.renderAt(playheadMs);
}
function omOpenFxDialog() {
  const omOpenFxDialogOmLayerCur = omLayerCur();
  if (!omOpenFxDialogOmLayerCur || document.getElementById("om-fx-back")) return;
  omFxDialogLayer = omOpenFxDialogOmLayerCur;
  const back = document.createElement("div");
  back.id = "om-fx-back";
  back.style.cssText = "position:fixed;inset:0;z-index:100004;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";
  back.innerHTML = '<div class="om-dialog" style="max-width:560px;min-width:min(92vw,560px)"><h2>Efek — <span id="om-fx-layer">' + (omOpenFxDialogOmLayerCur.label || omOpenFxDialogOmLayerCur.id) + "</span></h2>" + '<div class="om-fx-tabs"><button type="button" class="om-chip on" data-t="browse">Tambah Efek</button><button type="button" class="om-chip" data-t="set">Efek Aktif (' + (omOpenFxDialogOmLayerCur.effects ? omOpenFxDialogOmLayerCur.effects.length : 0) + ')</button></div>' + '<div id="om-fx-browse"><input type="search" id="om-fx-q" placeholder="Cari efek…" style="width:100%;background:var(--card);border:1px solid var(--line2);border-radius:8px;color:var(--text);padding:9px 10px;margin:8px 0"><div id="om-fx-cats" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px"></div><div id="om-fx-list" style="max-height:46vh;overflow:auto"></div></div>' + '<div id="om-fx-set" style="display:none;max-height:52vh;overflow:auto"></div></div>';
  document.body.appendChild(back);
  back.addEventListener("pointerdown", omOpenFxDialogArgRaw => {
    if (omOpenFxDialogArgRaw.target === back) back.remove();
  });
  const tabBtn = (tabbtnValue) => back.querySelector(tabbtnValue);
  back.querySelector(".om-fx-tabs").addEventListener("click", omOpenFxDialogArgParsed => {
    const omOpenFxDialogDataset = omOpenFxDialogArgParsed.target.closest("button");
    if (!omOpenFxDialogDataset) return;
    back.querySelectorAll(".om-fx-tabs button").forEach(omOpenFxDialogClassList => omOpenFxDialogClassList.classList.toggle("on", omOpenFxDialogClassList === omOpenFxDialogDataset));
    const omOpenFxDialogT = omOpenFxDialogDataset.dataset.t;
    back.querySelector("#om-fx-browse").style.display = omOpenFxDialogT === "browse" ? "" : "none";
    back.querySelector("#om-fx-set").style.display = omOpenFxDialogT === "set" ? "" : "none";
    if (omOpenFxDialogT === "set") omFxRenderSet();
  });
  const omopenfxdialOmFxQEl = back.querySelector("#om-fx-q");
  omopenfxdialOmFxQEl.addEventListener("input", () => omFxRenderBrowse(omopenfxdialOmFxQEl.value));
  back.querySelector("#om-fx-list").addEventListener("click", omOpenFxDialogArgClamped => {
    const datasetValue = omOpenFxDialogArgClamped.target.closest("button[data-fx]");
    if (!datasetValue) return;
    const entry = omFxIndexCache.byId.get(datasetValue.dataset.fx);
    if (entry) omAddFxToLayer(omFxDialogLayer, entry).then(() => {
      back.querySelector(".om-fx-tabs button[data-t='set']").textContent = "Efek Aktif (" + (omFxDialogLayer.effects ? omFxDialogLayer.effects.length : 0) + ")";
      omFxRenderSet();
    });
  });
  back.querySelector("#om-fx-set").addEventListener("click", omOpenFxDialogArg => {
    const omOpenFxDialogValueClamped = omOpenFxDialogArg.target.closest("button[data-fxrm]");
    if (!omOpenFxDialogValueClamped) {
      const omOpenFxDialogFlag = omOpenFxDialogArg.target.closest("input[data-fxtg]");
      if (omOpenFxDialogFlag) {
        const omOpenFxDialogNumber = Number(omOpenFxDialogFlag.dataset.fxtg), effectsValue = omFxDialogLayer;
        if (effectsValue && effectsValue.effects && effectsValue.effects[omOpenFxDialogNumber]) {
          const snap = sceneSnapshot();
          effectsValue.effects[omOpenFxDialogNumber].hidden = !omOpenFxDialogFlag.checked, pushUndo(snap), isDirty = true;
          try { renderer && renderer.renderAt(playheadMs); } catch (omOpenFxDialogValueStart) {}
        }
        return;
      }
      return;
    }
    const omopenfxdialNumber = Number(omOpenFxDialogValueClamped.dataset.fxrm), omOpenFxDialogEffects = omFxDialogLayer;
    if (!omOpenFxDialogEffects || !omOpenFxDialogEffects.effects) return;
    const snap = sceneSnapshot();
    omOpenFxDialogEffects.effects.splice(omopenfxdialNumber, 1), pushUndo(snap), isDirty = true;
    appendLog("[FX] Efek dihapus dari \"" + (omOpenFxDialogEffects.label || omOpenFxDialogEffects.id) + "\"");
    try {
      renderer.renderAt(playheadMs);
    } catch (omOpenFxDialogStart) {}
    omFxRenderSet();
  });
  back.querySelector("#om-fx-set").addEventListener("input", omOpenFxDialogTarget => {
    const omOpenFxDialogClosest = omOpenFxDialogTarget.target.closest("[data-pi]");
    if (!omOpenFxDialogClosest) return;
    const [omOpenFxDialogScoped, omOpenFxDialogValueLocal] = String(omOpenFxDialogClosest.dataset.pi).split(":").map(Number);
    const omOpenFxDialogRaw = omFxDialogLayer, omopenfxdialValue = omOpenFxDialogRaw && omOpenFxDialogRaw.effects && omOpenFxDialogRaw.effects[omOpenFxDialogScoped], omOpenFxDialogValue = omopenfxdialValue && omopenfxdialValue.params && omopenfxdialValue.params[omOpenFxDialogValueLocal];
    if (!omOpenFxDialogValue) return;
    if (!omOpenFxDialogClosest.__snap) {
      omOpenFxDialogClosest.__snap = sceneSnapshot(), omOpenFxDialogClosest.__committed = false;
    }
    omOpenFxDialogClosest.__committed = false;
    let omOpenFxDialogResult;
    if (omOpenFxDialogValue.dataType === "bool") omOpenFxDialogResult = omOpenFxDialogTarget.target.checked ? 1 : 0;
    else if (omOpenFxDialogValue.dataType === "color") omOpenFxDialogResult = parseHexColor("ff" + String(omOpenFxDialogTarget.target.value).slice(1));
    else if (omOpenFxDialogValue.dataType === "int") omOpenFxDialogResult = parseInt(omOpenFxDialogTarget.target.value) || 0;
    else omOpenFxDialogResult = Number(omOpenFxDialogTarget.target.value) || 0;
    const animated = !!omOpenFxDialogValue.channel.kfs.length;
    omFxWriteChannel(omOpenFxDialogValue.channel, omOpenFxDialogResult, animated);
    isDirty = true;
    try { renderer && renderer.renderAt(playheadMs); } catch (omOpenFxDialogValueEnd) {}
  });
  back.querySelector("#om-fx-set").addEventListener("change", omOpenFxDialogArgScoped => {
    const closestValue = omOpenFxDialogArgScoped.target.closest("[data-pi]");
    if (!closestValue) return;
    if (closestValue.__snap) {
      pushUndo(closestValue.__snap);
      closestValue.__snap = null;
    }
    isDirty = true;
    try { renderer && renderer.renderAt(playheadMs); } catch (omOpenFxDialogEnd) {}
  });
  back.querySelector("#om-fx-set").addEventListener("click", omOpenFxDialogArgValue => {
    const omOpenFxDialogClamped = omOpenFxDialogArgValue.target.closest("button[data-fxcurve]");
    if (omOpenFxDialogClamped) {
      const [omOpenFxDialogValueInner, omOpenFxDialogInner] = String(omOpenFxDialogClamped.dataset.fxcurve).split(":").map(Number);
      const omOpenFxDialogValueRaw = omFxDialogLayer, omOpenFxDialogParams = omOpenFxDialogValueRaw && omOpenFxDialogValueRaw.effects && omOpenFxDialogValueRaw.effects[omOpenFxDialogValueInner], omOpenFxDialogChannel = omOpenFxDialogParams && omOpenFxDialogParams.params && omOpenFxDialogParams.params[omOpenFxDialogInner];
      if (omOpenFxDialogChannel && omOpenFxDialogChannel.channel && typeof window.omOpenCurveEditor === "function") {
        window.omOpenCurveEditor({
          layer: omOpenFxDialogValueRaw,
          channel: omOpenFxDialogChannel.channel,
          title: (omOpenFxDialogParams.name || omOpenFxDialogParams.id) + " - " + omOpenFxDialogChannel.id
        });
      }
      return;
    }
    const omOpenFxDialogValueScoped = omOpenFxDialogArgValue.target.closest("button[data-fxkf]");
    if (!omOpenFxDialogValueScoped) return;
    const [omOpenFxDialogLocal, omOpenFxDialogValueOuter] = String(omOpenFxDialogValueScoped.dataset.fxkf).split(":").map(Number);
    const omOpenFxDialogValueParsed = omFxDialogLayer, paramsValue = omOpenFxDialogValueParsed && omOpenFxDialogValueParsed.effects && omOpenFxDialogValueParsed.effects[omOpenFxDialogLocal], omOpenFxDialogParsed = paramsValue && paramsValue.params && paramsValue.params[omOpenFxDialogValueOuter];
    if (!omOpenFxDialogParsed) return;
    const snap = sceneSnapshot();
    const omOpenFxDialogOuter = omOpenFxDialogParsed.channel.value || [0];
    omFxWriteChannel(omOpenFxDialogParsed.channel, omOpenFxDialogOuter, true);
    pushUndo(snap), isDirty = true;
    try { renderer && renderer.renderAt(playheadMs); } catch (omOpenFxDialogValueMin) {}
    omFxRenderSet();
  });
  omFxOpenBrowse();
}
if (document.getElementById("om-elembar")) {
  const localTitle = [...document.querySelectorAll("#om-elembar button")].find(localDataset => localDataset.dataset.role === "Efek");
  if (localTitle) {
    localTitle.disabled = false;
    localTitle.title = "Browser efek";
    localTitle.onclick = omOpenFxDialog;
  }
}
var omActProp = "loc";
function omKfInsert(propName, optLayer) {
  const omkfinsertValue = optLayer || (omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null);
  if (omkfinsertValue) omkfinsertValue.userTouched = true;
  if (propName === "gain" && omkfinsertValue) {
    if (!omkfinsertValue.gain) omkfinsertValue.gain = { value: [1], kfs: [] };
    else if (typeof omkfinsertValue.gain === "number") omkfinsertValue.gain = { value: [omkfinsertValue.gain], kfs: [] };
    const omKfInsertGain = omkfinsertValue.gain;
    const snap = sceneSnapshot();
    const omKfInsertValue = playheadMs / 1000;
    const omKfInsertParsed = Array.isArray(omKfInsertGain.value) ? omKfInsertGain.value.concat() : [Number(omKfInsertGain.value) || 1];
    omKfInsertGain.kfs = omKfInsertGain.kfs || [];
    const omKfInsertValueClamped = omKfInsertGain.kfs.findIndex(omKfInsertT => Math.abs(Number(omKfInsertT.t) - omKfInsertValue) < 0.002);
    if (omKfInsertValueClamped >= 0) omKfInsertGain.kfs[omKfInsertValueClamped].v = omKfInsertParsed;
    else omKfInsertGain.kfs.push({ t: omKfInsertValue, v: omKfInsertParsed, e: null, easing: null });
    omKfInsertGain.kfs.sort((omKfInsertArg, omKfInsertArgValue) => omKfInsertArg.t - omKfInsertArgValue.t);
    pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe gain @ " + omKfInsertValue.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfInsertValueLocal){}
    omKfRefresh();
    return;
  }
  if ((propName === "stroke" || propName === "strokeWidth") && omkfinsertValue) {
    if (!omkfinsertValue.strokeKeyable) {
      const curW = omkfinsertValue.strokeWidth !== undefined ? Number(omkfinsertValue.strokeWidth) : 10;
      omkfinsertValue.strokeKeyable = { value: [curW], kfs: [] };
    }
    const strokeKeyable = omkfinsertValue.strokeKeyable;
    const snap = sceneSnapshot();
    const omKfInsertResult = playheadMs / 1000;
    const curW = omkfinsertValue.strokeWidth !== undefined ? Number(omkfinsertValue.strokeWidth) : 10;
    strokeKeyable.value = [curW];
    strokeKeyable.kfs = strokeKeyable.kfs || [];
    const omKfInsertClamped = strokeKeyable.kfs.findIndex(omKfInsertArgRaw => Math.abs(Number(omKfInsertArgRaw.t) - omKfInsertResult) < 0.002);
    if (omKfInsertClamped >= 0) strokeKeyable.kfs[omKfInsertClamped].v = [curW];
    else strokeKeyable.kfs.push({ t: omKfInsertResult, v: [curW], e: null, easing: null });
    strokeKeyable.kfs.sort((omKfInsertArgParsed, omKfInsertArgClamped) => omKfInsertArgParsed.t - omKfInsertArgClamped.t);
    pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe stroke @ " + omKfInsertResult.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfInsertValueOuter){}
    omKfRefresh();
    return;
  }
  if ((propName === "shadow" || propName === "shadowRadius") && omkfinsertValue) {
    if (!omkfinsertValue.shadowKeyable) {
      const curR = omkfinsertValue.shadowRadius !== undefined ? Number(omkfinsertValue.shadowRadius) : 25;
      omkfinsertValue.shadowKeyable = { value: [curR], kfs: [] };
    }
    const shadowKeyable = omkfinsertValue.shadowKeyable;
    const snap = sceneSnapshot();
    const omKfInsertValueRaw = playheadMs / 1000;
    const curR = omkfinsertValue.shadowRadius !== undefined ? Number(omkfinsertValue.shadowRadius) : 25;
    shadowKeyable.value = [curR];
    shadowKeyable.kfs = shadowKeyable.kfs || [];
    const omKfInsertValueScoped = shadowKeyable.kfs.findIndex(omKfInsertArgScoped => Math.abs(Number(omKfInsertArgScoped.t) - omKfInsertValueRaw) < 0.002);
    if (omKfInsertValueScoped >= 0) shadowKeyable.kfs[omKfInsertValueScoped].v = [curR];
    else shadowKeyable.kfs.push({ t: omKfInsertValueRaw, v: [curR], e: null, easing: null });
    shadowKeyable.kfs.sort((omKfInsertScoped, omKfInsertArgLocal) => omKfInsertScoped.t - omKfInsertArgLocal.t);
    pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe shadow @ " + omKfInsertValueRaw.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfInsertValueInner){}
    omKfRefresh();
    return;
  }
  const omKfInsertReadGlobalT = readGlobalT();
  if (!omKfInsertReadGlobalT) return;
  const omKfInsertOmKeyableOf = omKeyableOf(omKfInsertReadGlobalT, propName);
  if (!omKfInsertOmKeyableOf) return;
  const snap = sceneSnapshot();
  const omKfInsertRaw = playheadMs / 1000;
  const omKfInsertV = Array.isArray(omKfInsertOmKeyableOf.value) ? omKfInsertOmKeyableOf.value.concat() : [Number(omKfInsertOmKeyableOf.value) || 0];
  omKfInsertOmKeyableOf.kfs = omKfInsertOmKeyableOf.kfs || [];
  const omKfInsertValueParsed = omKfInsertOmKeyableOf.kfs.findIndex(omKfInsertLocal => Math.abs(Number(omKfInsertLocal.t) - omKfInsertRaw) < 0.001);
  if (omKfInsertValueParsed >= 0) omKfInsertOmKeyableOf.kfs[omKfInsertValueParsed].v = omKfInsertV;
  else omKfInsertOmKeyableOf.kfs.push({ t: omKfInsertRaw, v: omKfInsertV, e: null, easing: null });
  omKfInsertOmKeyableOf.kfs.sort((omKfInsertArgOuter, omKfInsertOuter) => omKfInsertArgOuter.t - omKfInsertOuter.t);
  pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Keyframe " + propName + " @ " + (playheadMs / 1000).toFixed(3) + "s");
  try {
    renderer && renderer.renderAt(playheadMs);
  } catch (omKfInsertInner) {}
  omKfRefresh();
}
function omKfRemoveAt(propName, optLayer) {
  if (propName === "gain") {
    const omKfRemoveAtFlag = optLayer || (omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null);
    const omKfRemoveAtKfs = omKfRemoveAtFlag ? omKfRemoveAtFlag.gain : null;
    if (!omKfRemoveAtKfs || !omKfRemoveAtKfs.kfs || !omKfRemoveAtKfs.kfs.length) return;
    const omKfRemoveAtValueRaw = playheadMs / 1000;
    const omKfRemoveAtRaw = omKfRemoveAtKfs.kfs.findIndex(omKfRemoveAtT => Math.abs(Number(omKfRemoveAtT.t) - omKfRemoveAtValueRaw) < 0.002);
    if (omKfRemoveAtRaw < 0) return appendLog("[EDIT] tidak ada keyframe di playhead");
    const snap = sceneSnapshot();
    omKfRemoveAtKfs.kfs.splice(omKfRemoveAtRaw, 1), pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe gain dihapus @ " + omKfRemoveAtValueRaw.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfRemoveAtValueScoped){}
    omKfRefresh();
    return;
  }
  if (propName === "stroke" || propName === "strokeWidth") {
    const omKfRemoveAtStrokeKeyable = optLayer || (omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null);
    const kfsValue = omKfRemoveAtStrokeKeyable ? omKfRemoveAtStrokeKeyable.strokeKeyable : null;
    if (!kfsValue || !kfsValue.kfs || !kfsValue.kfs.length) return;
    const omKfRemoveAtValueParsed = playheadMs / 1000;
    const omKfRemoveAtParsed = kfsValue.kfs.findIndex(omKfRemoveAtArg => Math.abs(Number(omKfRemoveAtArg.t) - omKfRemoveAtValueParsed) < 0.002);
    if (omKfRemoveAtParsed < 0) return appendLog("[EDIT] tidak ada keyframe di playhead");
    const snap = sceneSnapshot();
    kfsValue.kfs.splice(omKfRemoveAtParsed, 1), pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe stroke dihapus @ " + omKfRemoveAtValueParsed.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfRemoveAtScoped){}
    omKfRefresh();
    return;
  }
  if (propName === "shadow" || propName === "shadowRadius") {
    const omKfRemoveAtShadowKeyable = optLayer || (omPropsLayerId != null ? omResolveLayer(omPropsLayerId) : null);
    const omKfRemoveAtValue = omKfRemoveAtShadowKeyable ? omKfRemoveAtShadowKeyable.shadowKeyable : null;
    if (!omKfRemoveAtValue || !omKfRemoveAtValue.kfs || !omKfRemoveAtValue.kfs.length) return;
    const omKfRemoveAtValueClamped = playheadMs / 1000;
    const omKfRemoveAtClamped = omKfRemoveAtValue.kfs.findIndex(omKfRemoveAtArgValue => Math.abs(Number(omKfRemoveAtArgValue.t) - omKfRemoveAtValueClamped) < 0.002);
    if (omKfRemoveAtClamped < 0) return appendLog("[EDIT] tidak ada keyframe di playhead");
    const snap = sceneSnapshot();
    omKfRemoveAtValue.kfs.splice(omKfRemoveAtClamped, 1), pushUndo(snap), isDirty = true;
    appendLog("[EDIT] Keyframe shadow dihapus @ " + omKfRemoveAtValueClamped.toFixed(3) + "s");
    try { renderer && renderer.renderAt(playheadMs); } catch(omKfRemoveAtValueLocal){}
    omKfRefresh();
    return;
  }
  const omKfRemoveAtReadGlobalT = readGlobalT();
  if (!omKfRemoveAtReadGlobalT) return;
  const omKfRemoveAtOmKeyableOf = omKeyableOf(omKfRemoveAtReadGlobalT, propName);
  if (!omKfRemoveAtOmKeyableOf || !omKfRemoveAtOmKeyableOf.kfs || !omKfRemoveAtOmKeyableOf.kfs.length) return;
  const omkfremoveatValue = playheadMs / 1000;
  const omKfRemoveAtResult = omKfRemoveAtOmKeyableOf.kfs.findIndex(omKfRemoveAtArgRaw => Math.abs(Number(omKfRemoveAtArgRaw.t) - omkfremoveatValue) < 0.001);
  if (omKfRemoveAtResult < 0) return appendLog("[EDIT] tidak ada keyframe di playhead");
  const snap = sceneSnapshot();
  omKfRemoveAtOmKeyableOf.kfs.splice(omKfRemoveAtResult, 1), pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Keyframe " + propName + " dihapus @ " + omkfremoveatValue.toFixed(3) + "s");
  try {
    renderer && renderer.renderAt(playheadMs);
  } catch (omKfRemoveAtLocal) {}
  omKfRefresh();
}
function omKfSetEasing(propName, token) {
  const omKfSetEasingReadGlobalT = readGlobalT();
  if (!omKfSetEasingReadGlobalT) return;
  const omKfSetEasingOmKeyableOf = omKeyableOf(omKfSetEasingReadGlobalT, propName);
  if (!omKfSetEasingOmKeyableOf || !omKfSetEasingOmKeyableOf.kfs || !omKfSetEasingOmKeyableOf.kfs.length) return;
  const snap = sceneSnapshot();
  omKfSetEasingOmKeyableOf.kfs.forEach(omKfSetEasingE => {
    omKfSetEasingE.e = token, omKfSetEasingE.easing = objHelperValue(token);
  });
  pushUndo(snap), isDirty = true;
  appendLog("[EDIT] Easing " + propName + " → " + token);
  try {
    renderer.renderAt(playheadMs);
  } catch (omKfSetEasingValue) {}
}
(function omAmStyle() {
  if (document.getElementById("om-am-style")) return;
  const omamstyleStyleEl = document.createElement("style");
  omamstyleStyleEl.id = "om-am-style";
  omamstyleStyleEl.textContent = `
:root{--bg:#141720;--bg-deep:#0D1016;--bg-alt:#191B27;--panel:#202537;--surface:#1E2239;--card:#272D3D;--card2:#2F354D;--card3:#343851;--line:#2E3446;--line2:#3D4356;--text:#fff;--muted:#848C98;--hint:#9EA1A7;--accent:#00FFA9;--accent-ink:#03231A;--accent-blue:#5D9DCB;--danger:#FF4544;--radius:8px}
body{background:var(--bg);color:var(--text)}
dialog, .om-dialog, #om-props, #om-elembar, .tl-ctx, #om-add-menu{background:var(--panel);border-color:var(--line2);color:var(--text)}
#top{background:var(--panel);border-bottom:1px solid var(--line)}
#stage{background:var(--bg-deep)}
.tl-toolbar,#timeline-wrap,#panes,#transport{background:var(--bg-alt)}
#timeline-ruler{background:#151723}
#timeline-inner{background:var(--bg-alt)}
.tl-track{border-color:var(--line)}
.tl-label{color:#fff}
.tl-block{border-radius:5px;box-shadow:none}
#tl-playhead{background:#fff;width:2px}
.btn.primary{background:var(--accent)!important;color:#03231A!important;border-color:transparent!important}
.btn:not(.primary):not(.ghost){background:var(--card);border-color:var(--line2);color:var(--text)}
.btn.ghost{background:var(--card);border-color:var(--line2);color:var(--text)}
.om-chip.on{background:var(--accent);color:#03231A!important;border-color:transparent!important}
.om-chip{background:var(--card);border-color:var(--line2);color:var(--text)}
.card{background:var(--surface);border-color:var(--line2)}
.status-box{background:var(--card);border-color:var(--line2)}
input,select,textarea{background:var(--card);border-color:var(--line2);color:var(--text)}
.om-sw{border-color:var(--line2)}
.om-sw.on{border-color:#fff;outline:2px solid var(--accent)}
/* home/landing: tema terang ala AM */
#om-landing{background:#F6F6F6}
#om-landing .om-logo{color:#202239;background:none;-webkit-background-clip:text;background-clip:text}
#om-landing .om-sub{color:#4F5858}
#om-landing .om-btn.primary{background:#00FFA9!important;color:#03231A!important}
.om-recent h4{color:#202239}
.om-recent button{background:#fff;color:#202239;border:1px solid #E3E6EC}
.om-dialog{background:#EDEEF0;border-color:#DFE2E8;color:#202239}
.om-dialog h2{color:#202239}
.om-dialog label{color:#4F5858}
.om-dialog input,.om-dialog select,.om-dialog textarea{background:#fff;border-color:#D9DDE4;color:#202239}
.om-dialog .om-chip{background:#fff;color:#202239;border-color:#D9DDE4}
.om-dialog .om-chip.on{background:#00FFA9;color:#03231A;border-color:transparent}
.om-dialog .btn.primary{background:#00FFA9!important;color:#03231A!important}
.om-dialog .om-btn{background:var(--card);color:var(--text)}
.om-props-sec{color:var(--muted)}
#om-elembar button:disabled{opacity:.4}`;
  document.head.appendChild(omamstyleStyleEl);
})();
(function omBootGate() {
  const omBootGateFlag = /\/proyek\/([A-Za-z0-9_-]{8,64})/.exec(location.pathname);
  if (omBootGateFlag) {
    omProjectId = omBootGateFlag[1];
    setTimeout(() => omOpenProject(omBootGateFlag[1]), 0);
    return;
  }
  const ombootgateValue = location.search || '';
  if (/mode=(simple|instant)/.test(ombootgateValue) || /alight=/.test(ombootgateValue) || /proj=/.test(ombootgateValue)) return;
  // showOmLanding();
})();
window.addEventListener("dragenter", localDataTransfer => {
  localDataTransfer.dataTransfer && [...localDataTransfer.dataTransfer.types].includes("Files") && (localValueEl++, document.body.classList.add("dragging"));
}), window.addEventListener("dragleave", () => {
  localValueEl = Math.max(0, localValueEl - 1), localValueEl || document.body.classList.remove("dragging");
}), window.addEventListener("dragover", localPreventDefault => localPreventDefault.preventDefault()), window.addEventListener("drop", preventDefaultArg => {
  preventDefaultArg.preventDefault(), localValueEl = 0, document.body.classList.remove("dragging");
  let valueNode = [...(preventDefaultArg.dataTransfer && preventDefaultArg.dataTransfer.files || [])];
  if (!valueNode.length || !renderer) return;
  let localField = valueNode.filter(argStepped => /\.xml$/i.test(argStepped.name) || /xml/.test(argStepped.type)),
    localValueRange = valueNode.filter(argStream => !localField.includes(argStream));
  (async () => {
    localField.length && (await applyHelperValue(localField)), localValueRange.length && (await getHelperClamped(localValueRange));
  })().catch(localArgScene => appendLog("[IMPORT] " + localArgScene.message));
}), function bindTracksCtx() {
  let tracksButton = document.getElementById("timeline-tracks");
  if (!tracksButton || tracksButton.__ctxBound) return;
  tracksButton.__ctxBound = true;
  tracksButton.addEventListener("contextmenu", bindTracksCtxTarget => {
    let bindTracksCtxValue = bindTracksCtxTarget.target && bindTracksCtxTarget.target.closest && bindTracksCtxTarget.target.closest(".tl-track"),
      bindTracksCtxResult = bindTracksCtxValue && bindTracksCtxValue.__layer;
    if (!bindTracksCtxResult) return;
    bindTracksCtxTarget.preventDefault(), bindTracksCtxTarget.stopPropagation(), openLayerCtx(bindTracksCtxResult, bindTracksCtxTarget.clientX, bindTracksCtxTarget.clientY);
  });
}();
var undoStack = [], redoStack = [];
function applySceneSnapshot(applySceneSnapshotArg) {
  if (!projectScene || !applySceneSnapshotArg) return false;
  for (const applySceneSnapshotResult of Object.keys(projectScene)) delete projectScene[applySceneSnapshotResult];
  for (const applySceneSnapshotValue of Object.keys(applySceneSnapshotArg)) projectScene[applySceneSnapshotValue] = applySceneSnapshotArg[applySceneSnapshotValue];
  if (localList.length) {
    const applyscenesnMap = new Map();
    omWalkScenes(projectScene, applySceneSnapshotLayers => (applySceneSnapshotLayers.layers || []).forEach(applySceneSnapshotId => applyscenesnMap.set(applySceneSnapshotId.id, applySceneSnapshotId)));
    localList = localList.map(applySceneSnapshotLayer => {
      const applySceneSnapshotFlag = applySceneSnapshotLayer.layer && applyscenesnMap.get(applySceneSnapshotLayer.layer.id);
      return applySceneSnapshotFlag ? {
        layer: applySceneSnapshotFlag
      } : null;
    }).filter(Boolean);
    if (!localList.length) handleHelperClamped();
  }
  try {
    renderer && renderer.setScene(projectScene);
  } catch {}
  try {
    renderer && renderer.setImages(helperValue());
  } catch {}
  isDirty = true;
  try {
    bindFlag(), computeHelperValue(), bindHelper();
  } catch {}
  try {
    renderer && renderer.renderAt(playheadMs);
  } catch {}
  omScheduleSave();
  return true;
}
window.addEventListener("keydown", localCtrlKey => {
  if (!(localCtrlKey.ctrlKey || localCtrlKey.metaKey)) return;
  const localValueField = (localCtrlKey.key || "").toLowerCase();
  if (localValueField !== "z" && localValueField !== "y") return;
  const targetValue = localCtrlKey.target, localEntryEmbedded = targetValue && targetValue.tagName;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(localEntryEmbedded) || targetValue && targetValue.isContentEditable) return;
  localCtrlKey.preventDefault(), (localValueField === "y" || localCtrlKey.shiftKey) ? redoScene() : undoScene();
});
matchMedia.addEventListener("change", buildHelperStart), buildHelperStart(), aHelper("proyek"), window.addEventListener("error", argCount => {
  !argCount || !argCount.message || (appendLog("[ERROR] " + argCount.message), getHelperValue(argCount.message));
}), window.addEventListener("unhandledrejection", reason => {
  let localBase = reason && reason.reason,
    valueRange = localBase && localBase.message ? localBase.message : String(localBase);
  appendLog("[ERROR] " + valueRange), getHelperValue(valueRange);
}), window.AM = {
  async waitReady(localArgNested = 60000) {
    let localNow = Date.now();
    for (; isLoading;) {
      if (Date.now() - localNow > localArgNested) throw new Error("Timeout waiting for player idle");
      await new Promise(argScene => setTimeout(argScene, 50));
    }
    return this.getState();
  },
  getState() {
    return {
      isBusy: !!isLoading,
      busyLabel: busylabelEl ? busylabelEl.textContent : '',
      busyDetail: busydetailEl ? busydetailEl.textContent : '',
      title: projectScene ? projectScene.title || localByKey : '',
      width: projectScene ? projectScene.width : 0,
      height: projectScene ? projectScene.height : 0,
      durationMs: projectScene ? projectScene.totalTime : 0,
      fps: projectScene && projectScene.fps || 30,
      hasAudio: !!(volume && !audioLoadFailed),
      exporting: !!isExporting,
      availableProjects: this.getAvailableProjects()
    };
  },
  stopDefaultLoad() {
    if (typeof updateHelperOuter == "function" && updateHelperOuter(), volume) {
      try {
        volume.pause();
      } catch {}
      volume = null;
    }
    applyHelper("boot"), applyHelper("xml"), applyHelper("media"), applyHelper('fx'), applyHelper("video"), applyHelper("audio"), appendLog("[AM] Default preset load cancelled for automation.");
  },
  async loadFont(argPrimary, localArgMin) {
    if (!argPrimary) throw new Error("Nama font tidak boleh kosong");
    let valueField = '';
    if (typeof localArgMin == "string") valueField = localArgMin;else {
      if (localArgMin instanceof File || localArgMin instanceof Blob) valueField = URL.createObjectURL(localArgMin);else throw new Error("Sumber font tidak valid");
    }
    let replace = argPrimary.replace(/\.[^/.]+$/, ''),
      fontFace = new FontFace(replace, "url(\"" + valueField + '\x22)');
    return await fontFace.load(), document.fonts.add(fontFace), renderer && (renderer.customFonts.set(replace, replace), renderer.customFonts.set(argPrimary, replace), isDirty = true), appendLog("[FONT] Font kustom \"" + replace + "\" berhasil dimuat."), {
      success: true,
      family: replace
    };
  },
  async loadPreset(localArgTotal, argNested = null) {
    const land = document.getElementById("om-landing");
    if (land) land.remove();
    if (this.stopDefaultLoad(), await this.waitReady(), typeof localArgTotal == "string") {
      let trim = localArgTotal.trim();
      if (/\.xml$/i.test(trim) || trim.startsWith("blob:") || trim.startsWith("data:")) {
        let localOk = await fetch(trim);
        if (!localOk.ok) throw new Error("HTTP " + localOk.status + " fetching XML");
        let localEntryTracked = await localOk.text(),
          file = new File([localEntryTracked], "preset.xml", {
            type: "text/xml"
          });
        await applyHelperValue([file]);
      } else trim.includes("drive.google.com") || trim.includes("/api/drive-xml") || /^[a-zA-Z0-9_-]{25,50}$/.test(trim) ? await getFlag(trim) : (urlamEl && (urlamEl.value = trim), await flagHelper(argNested, trim));
    } else {
      if (localArgTotal instanceof File) await applyHelperValue([localArgTotal]);else throw new Error("Invalid preset source: must be URL string or File object");
    }
    return await this.waitReady(), this.getState();
  },
  getAvailableProjects() {
    return !urlampickEl || urlampickEl.options.length === 0 ? [] : [...urlampickEl.options].map(valueArg => ({
      name: valueArg.value,
      title: valueArg.textContent,
      selected: valueArg.selected
    }));
  },
  async selectProject(localArgEmbedded) {
    if (await this.waitReady(), !urlamEl.value) throw new Error("Belum ada link Alight Motion yang dimuat");
    return urlampickEl.value = localArgEmbedded, await flagHelper(localArgEmbedded), await this.waitReady(), this.getState();
  },
  getMediaSlots() {
    return projectScene ? (projectScene.media || []).filter(argEmbedded => {
      let toLowerCase = (argEmbedded.type || '').toLowerCase();
      return toLowerCase.startsWith("audio") ? false : toLowerCase.startsWith("image") || toLowerCase.startsWith("video") || !!argEmbedded.uri;
    }).map((localUri, localArgTracked) => {
      let localSlot = map.get(localUri.uri) || localValue && localValue[0] || localUri.uri,
        tagNameValue = localValueScoped.get(localSlot) || (renderer && renderer.images ? renderer.images.get(localSlot) : null),
        localValueSlot = '';
      if (tagNameValue) try {
        if (tagNameValue.tagName === "IMG" && tagNameValue.src) localValueSlot = tagNameValue.src;else {
          if (tagNameValue.tagName === "VIDEO") {
            let canvasEl = document.createElement("canvas");
            canvasEl.width = tagNameValue.videoWidth || 160, canvasEl.height = tagNameValue.videoHeight || 90;
            let ctx = canvasEl.getContext('2d');
            ctx && tagNameValue.readyState >= 2 && (ctx.drawImage(tagNameValue, 0, 0, canvasEl.width, canvasEl.height), localValueSlot = canvasEl.toDataURL("image/jpeg", 0.6));
          }
        }
      } catch {}
      let startsWith = (localUri.type || '').toLowerCase().startsWith("video");
      return {
        index: localArgTracked,
        id: localUri.uri || "slot-" + localArgTracked,
        name: localSlot,
        type: startsWith ? "video" : "image",
        previewUrl: localValueSlot,
        isReplaceable: true
      };
    }) : [];
  },
  async applyMedia(argMin, localArgParsed) {
    if (await this.waitReady(), !projectScene) throw new Error("No scene loaded");
    let getMediaSlots = this.getMediaSlots(),
      localValueOuter = null;
    if (typeof argMin == "number" ? localValueOuter = getMediaSlots[argMin] : localValueOuter = getMediaSlots.find(argTracked => argTracked.id === argMin || argTracked.name === argMin), !localValueOuter) throw new Error("Slot media \"" + argMin + "\" tidak ditemukan");
    let localText = null;
    if (localArgParsed instanceof File) localText = localArgParsed;else {
      if (localArgParsed instanceof Blob) localText = new File([localArgParsed], localValueOuter.name, {
        type: localArgParsed.type || "image/png"
      });else {
        if (typeof localArgParsed == "string") {
          if (localArgParsed.startsWith("data:") || localArgParsed.startsWith("blob:")) {
            let localValuePair = await (await fetch(localArgParsed)).blob();
            localText = new File([localValuePair], localValueOuter.name, {
              type: localValuePair.type || "image/png"
            });
          } else {
            let localStatus = await fetch(localArgParsed);
            if (!localStatus.ok) throw new Error("HTTP " + localStatus.status + " fetching media URL");
            let valuePair = await localStatus.blob();
            localText = new File([valuePair], localValueOuter.name, {
              type: valuePair.type || "image/png"
            });
          }
        }
      }
    }
    if (!localText) throw new Error("Invalid media input");
    let localPair = {
      name: localText.name,
      src: URL.createObjectURL(localText)
    };
    return localRaw.set(localText.name, localPair), localNodePending.push(localPair), localValue.includes(localText.name) || localValue.push(localText.name), map.set(localValueOuter.id, localText.name), await updateHelperRaw("media:pick", "Memuat " + localText.name + '…', async () => {
      await applyHelperRaw(localText.name), renderer.setImages(helperValue()), isDirty = true;
    }), computeHelperValue(), bindHelper(), await this.waitReady(), {
      success: true,
      slotId: localValueOuter.id
    };
  },
  async setAudio(localArgOuter) {
    if (await this.waitReady(), typeof localArgOuter == "string") {
      let trim = localArgOuter.trim();
      trim.includes("tiktok.com") || trim.includes("/api/tiktok") ? (urltiktokEl.value = trim, await renderHelperEnd()) : trim.includes("drive.google.com") || trim.includes("/api/drive-media") ? (urldriveaudiEl.value = trim, await buildFail()) : bindHelperValue(trim, trim.split('/').pop());
    } else {
      if (localArgOuter instanceof File || localArgOuter instanceof Blob) {
        let localCreateObjectUrl = URL.createObjectURL(localArgOuter),
          valueSlot = localArgOuter.name || "custom-audio.mp3";
        valueRaw.push({
          name: valueSlot,
          src: localCreateObjectUrl
        }), localMap.set(valueSlot, localCreateObjectUrl), bindHelperValue(localCreateObjectUrl, valueSlot);
      } else throw new Error("Invalid audio input");
    }
    return await this.waitReady(), {
      success: true,
      audioSrc: localOuter
    };
  },
  $e: [],
  onLog(localArgCompared) {
    typeof localArgCompared == "function" && this.$e.push(localArgCompared);
  },
  getRenderProgress() {
    let localStep = {
      status: idle,
      error: localValueInner || null,
      statsText: expstatsEl ? expstatsEl.textContent : ''
    };
    if (!isExporting) return {
      exporting: false,
      progressPct: idle === "success" ? 100 : 0,
      currentFrame: 0,
      totalFrames: 0,
      phase: idle === "idle" ? "idle" : idle,
      ...localStep
    };
    let localValueStep = Number(expbarEl.max) || 1,
      valueStep = Number(expbarEl.value) || 0;
    return {
      exporting: true,
      phase: "running",
      progressPct: Math.min(100, Math.round(valueStep / localValueStep * 100)),
      currentFrame: valueStep,
      totalFrames: localValueStep,
      ...localStep
    };
  },
  async checkExportSupport(resolution = {}) {
    let localPhase = resolution.resolution || 720,
      localEntryCompared = resolution.fps || 30,
      localValueRecord = projectScene && projectScene.height ? projectScene.width / projectScene.height : 1,
      localValuePhase = localValueRecord < 1 ? Math.round(localPhase / localValueRecord) : localPhase,
      round = Math.round(localValuePhase * localValueRecord),
      localEntrySorted = resolution.needAudio !== void 0 ? !!resolution.needAudio : !!(amAudioEe.length > 0 || localOuter);
    return handleHelperInner({
      width: round,
      height: localValuePhase,
      bitrate: resolution.bitrate || 6000000,
      fps: localEntryCompared,
      needAudio: localEntrySorted
    });
  },
  cancelRender() {
    return isExporting ? (exportCancelled = true, expcancelEl && expcancelEl.click(), appendLog("[AM] Rendering video dibatalkan via API window.AM.cancelRender()"), true) : false;
  },
  async renderVideo(localResolution = {}) {
    if (await this.waitReady(), !projectScene) throw new Error("No scene loaded");
    let localEntryFiltered = localResolution.resolution || 720,
      localEntryMapped = localResolution.fps || 30,
      localNodeRaw = typeof localResolution.quality == "number" ? Math.min(2, Math.max(0.04, localResolution.quality)) : localResolution.quality === "high" ? 0.12 : localResolution.quality === "low" ? 0.04 : 0.08;
    expresEl.value = String(localEntryFiltered), expfpsEl.value = String(localEntryMapped), expbitrateEl.value = String(localNodeRaw);
    let localValueStepped = typeof localResolution.onProgress == "function" ? localResolution.onProgress : null,
      localCompute = computeFail();
    for (; isExporting;) {
      if (localValueStepped) try {
        localValueStepped(this.getRenderProgress());
      } catch {}
      await new Promise(localArgFrame => setTimeout(localArgFrame, 100));
    }
    if (await localCompute, idle === "cancelled") throw new Error("Render video dibatalkan oleh pengguna/skrip");
    if (idle === "failed") throw new Error(localValueInner || "Render video gagal");
    if (idle !== "success" || !exportBlobUrl) throw new Error("Render video gagal: status " + idle);
    let sizeValue = await (await fetch(exportBlobUrl)).blob(),
      reader = new FileReader(),
      promise = new Promise((promiseCallback, onerror) => {
        reader.onloadend = () => promiseCallback(reader.result), reader.onerror = onerror;
      });
    reader.readAsDataURL(sizeValue);
    let localNodeParsed = await promise,
      localNodeClamped = {
        success: true,
        durationSec: projectScene.totalTime / 1000,
        blobUrl: exportBlobUrl,
        base64: localNodeParsed,
        sizeBytes: sizeValue.size,
        type: sizeValue.type
      };
    if (localValueStepped) try {
      localValueStepped({
        exporting: false,
        progressPct: 100,
        statsText: expstatsEl ? expstatsEl.textContent : ''
      });
    } catch {}
    return localNodeClamped;
  }
};
window.__AM_INTERNAL = {
  get val() { return projectScene; },
  get val2() { return renderer; },
  get w() { return projectScene ? projectScene.width : (typeof viewEl !== 'undefined' && viewEl ? viewEl.width : 0); },
  set w(argFrame) {
    if (projectScene) {
      const roundValue = Math.round(argFrame);
      projectScene.width = roundValue;
      projectScene.exportWidth = roundValue;
      if (typeof viewEl !== 'undefined' && viewEl) viewEl.width = roundValue;
      if (typeof renderer !== 'undefined' && renderer && typeof renderer.setResolution === 'function') {
        renderer.setResolution(projectScene.height || 720);
      }
    }
  },
  get h() { return projectScene ? projectScene.height : (typeof viewEl !== 'undefined' && viewEl ? viewEl.height : 0); },
  set h(localArgAlpha) {
    if (projectScene) {
      const localRound = Math.round(localArgAlpha);
      projectScene.height = localRound;
      projectScene.exportHeight = localRound;
      if (typeof viewEl !== 'undefined' && viewEl) viewEl.height = localRound;
      if (typeof renderer !== 'undefined' && renderer && typeof renderer.setResolution === 'function') {
        renderer.setResolution(localRound);
      }
    }
  },
  get H() { return playheadMs; },
  set H(argAlpha) { playheadMs = argAlpha; },
  set V(localArgColor) { isDirty = localArgColor; },
  get omMulti() { return omMulti; },
  sceneSnapshot,
  undoScene,
  redoScene,
  pushUndo,
  applySceneSnapshot,
  parseHexColor,
  handle5: toCssColor,
  omHexFrom,
  omLayerCur,
  omPropsRefresh,
  omSetKeyable,
  omKfInsert,
  omKfRemoveAt,
  omKfSetEasing,
  omOpenCurve,
  omKeyableOf,
  obj: objHelperValue,
  _r: rHelper,
  handle9: appendLog,
  bind4: bindFlag,
  findParentArray,
  omId,
  omMeta,
  omParseLayer,
  omTransformXml,
  omHandle21InContext: omHandleInContextHelper,
  omScheduleSave,
  selectLayer: argColor => applyFlag(argColor),
  deselectLayer: () => applyFlag(null),
  get isPlaying() { return isPlaying; },
  togglePlay: () => requestPlayback(!isPlaying),
  play: () => requestPlayback(true),
  pause: () => requestPlayback(false),
  seek: (localArgMatrix) => seekToTime(localArgMatrix),
  splitLayerAt,
  deleteLayer,
  duplicateLayer,
  omAddMediaFile: (file) => omAddMediaFile(file),
  omAddNull: () => omAddNull(),
  omAddCamera: () => omAddCamera(),
  setCameraViewEnabled: (enabled) => {
    if (renderer) {
      renderer.cameraViewEnabled = !!enabled;
      isDirty = true;
      if (renderer.renderAt) renderer.renderAt(playheadMs);
    }
  },
  omAddGroup: () => omAddGroup(),
  resolveHierarchy: (argMatrix) => helperRaw(argMatrix || projectScene),
  setLayerParent: (layer, parentId) => {
    if (!layer) return;
    const snap = sceneSnapshot ? sceneSnapshot() : null;
    layer.parentId = parentId || '';
    if (projectScene) helperRaw(projectScene);
    if (snap && pushUndo) pushUndo(snap);
    isDirty = true;
    if (renderer && renderer.renderAt) renderer.renderAt(playheadMs);
    if (typeof omScheduleSave === "function") omScheduleSave();
  },
  omCopyLayers: (layers) => omCopyLayers(layers),
  omPasteLayers: () => omPasteLayers(),
  omCopyStyle: (layer) => omCopyStyle(layer),
  omPasteStyle: (options) => omPasteStyle(options),
  omMultiSelectAll: () => omMultiSelectAll(),
  omTrimSide,
  omSetLayerSpeed,
  omRetime,
  omToggleFreezeFrame,
  omToggleReverse,
  omSetSpeedCurve,
  omMuteToggle,
  omOpenTextDlg,
  get bookmarks() { return listValue; },
  addBookmark: (localArgVector) => { listValue.push(localArgVector); getHelperParsed(); isDirty = true; if (projectScene) projectScene.bookmarks = listValue.slice(); elementHelper(); },
  removeBookmark: (argVector) => { listValue = listValue.filter(localArgShader => Math.abs(localArgShader - argVector) > 100); getHelperParsed(); isDirty = true; if (projectScene) projectScene.bookmarks = listValue.slice(); elementHelper(); },
  toggleBookmark: () => handleLocal(),
  jumpPrevKeyframeOrBookmark: (argShader) => jumpPrevKeyframeOrBookmark(argShader),
  jumpNextKeyframeOrBookmark: (localArgProgram) => jumpNextKeyframeOrBookmark(localArgProgram),
  omMultiGroup: (mode) => omMultiGroup(mode),
  omUngroup: (argProgram) => omUngroup(argProgram),
  omEnterGroup: (localArgTexture) => omEnterGroup(localArgTexture),
  omExitGroup: () => omExitGroup(),
  omMultiToggle: (id) => omMultiToggle(id),
  omMultiClear: () => omMultiClear(),
  omMultiIds: () => omMultiIds(),
  omMultiDelete: () => omMultiDelete(),
  omMultiAlignScreen: (mode) => omMultiAlignScreen(mode),
  omMultiAlignTimeline: (mode) => omMultiAlignTimeline(mode),
  omMultiTrimLeft: () => omTrimSide("l"),
  omMultiTrimRight: () => omTrimSide("r"),
  omMultiSplit: () => splitLayerAt(),
  isGroup: (argTexture) => getHelper(argTexture),
  get Te() { return localList; },
  stepFrame: (delta) => {
    let localNodeScoped = projectScene ? projectScene.fps || 30 : 30;
    seekToTime(Math.max(0, Math.min(projectScene ? projectScene.totalTime : 0, playheadMs + (delta * 1000 / localNodeScoped))));
  },
  buildTimeline: () => { try { buildHelperValue(); } catch(localNodeSource){} },
  fitCanvas: () => { try { getPos(); } catch(localNodeTarget){} },
  refreshScene: () => { try { handleHelperValue(); } catch(localNodeInput){} },
  omSerializeScene: () => { try { return omSerializeScene(); } catch(localNodeOutput){ return ''; } },
  omOpenProject: (id) => omOpenProject(id),
  omProjectXml: (localArgCanvas) => omProjectXml(localArgCanvas),
  omNewId: () => omNewId(),
  omSaveProject: () => omSaveProject(),
  openEffectPicker: (layer) => getElement(layer, 0, 0),
  addAudioLayer: (file, optName, optDurMs) => {
    if (!file) return;
    const snap = sceneSnapshot ? sceneSnapshot() : null;
    const audioId = "audio_" + Date.now().toString(36);
    let audioUrl = "";
    let audioName = "";
    if (typeof file === "string") {
      audioUrl = file;
      audioName = optName || file.split("/").pop().replace(/\.[^/.]+$/, "") || "Audio";
    } else if (file && file.url) {
      audioUrl = file.url;
      audioName = file.name || optName || "Audio";
    } else if (file instanceof Blob || file instanceof File) {
      audioUrl = URL.createObjectURL(file);
      audioName = file.name || optName || "Audio";
    } else {
      return;
    }
    localMap.set(audioName, audioUrl);
    localMap.set(audioUrl, audioUrl);
    valueRaw.push({ name: audioName, src: audioUrl });
    mapValue.set(audioId, audioName);
    const tempAudio = new Audio(audioUrl);
    const commitLayer = (durMs) => {
      const newLayer = {
        id: audioId,
        tag: "audio",
        label: audioName.replace(/\.[^/.]+$/, "") || "Audio",
        src: audioUrl,
        startTime: playheadMs || 0,
        endTime: (playheadMs || 0) + (durMs || 5000),
        inTime: 0,
        outTime: durMs || 5000,
        speed: 1,
        gain: { value: [1], kfs: [] },
        transform: {
          location: { value: [0, 0, 0], kfs: [] },
          scale: { value: [1, 1], kfs: [] },
          rotation: { value: [0], kfs: [] },
          opacity: { value: [1], kfs: [] }
        },
        effects: []
      };
      if (projectScene && projectScene.layers) {
        projectScene.layers.push(newLayer);
        if (snap && pushUndo) pushUndo(snap);
        isDirty = true;
        if (projectScene.totalTime < newLayer.endTime) {
          projectScene.totalTime = newLayer.endTime;
        }
        try { renderHelperValue(); } catch(localNodePrimary){}
        try { handleHelper({ force: true }); } catch(localNodeSecondary){}
        if (bindFlag) bindFlag();
        if (applyFlag) applyFlag(newLayer);
        if (renderer && renderer.renderAt) renderer.renderAt(playheadMs);
        decodeAudioPeaks(newLayer, audioUrl);
        appendLog("[AUDIO] Layer audio ditambahkan: " + audioName);
      }
    };
    if (optDurMs && optDurMs > 0) {
      commitLayer(optDurMs);
    } else {
      tempAudio.addEventListener("loadedmetadata", () => {
        const durSec = tempAudio.duration && !isNaN(tempAudio.duration) ? tempAudio.duration : 5;
        commitLayer(Math.round(durSec * 1000));
      });
      tempAudio.addEventListener("error", () => {
        commitLayer(5000);
      });
    }
  },
  omSetAudioGain: (layer, gainVal) => {
    if (!layer) return;
    const localValueTotal = Math.max(0, Number(gainVal) || 0);
    if (!layer.gain) layer.gain = { value: [localValueTotal], kfs: [] };
    else if (Array.isArray(layer.gain.value)) layer.gain.value[0] = localValueTotal;
    else layer.gain = { value: [localValueTotal], kfs: [] };
    layer.userTouched = true;
    for (let localLayer of amAudioEe) {
      if (localLayer.layer === layer || localLayer.id === layer.id) {
        if (localLayer.gainNode) {
          try {
            if (window.__AM_AUDIO_CTX && window.__AM_AUDIO_CTX.state === "suspended") {
              window.__AM_AUDIO_CTX.resume();
            }
            localLayer.gainNode.gain.value = localValueTotal;
            localLayer.el.volume = 1;
          } catch(localNodeTertiary) {
            localLayer.el.volume = Math.max(0, Math.min(1, localValueTotal));
          }
        } else {
          localLayer.el.volume = Math.max(0, Math.min(1, localValueTotal));
        }
      }
    }
    isDirty = true;
  },
  replaceMediaForLayer: (layer, file) => replaceMediaForLayer(layer, file),
  get omProjectId() { return omProjectId; },
  set omProjectId(argCanvas) { omProjectId = argCanvas; },
  startVideoExport: async (opts = {}) => {
    if (opts.resolution) {
      const el = document.getElementById("expRes");
      if (el) el.value = String(opts.resolution);
    }
    if (opts.fps) {
      const el = document.getElementById("expFps");
      if (el) el.value = String(opts.fps);
    }
    if (opts.bitrate != null) {
      const el = document.getElementById("expBitrate");
      if (el) el.value = String(opts.bitrate);
    }
    if (opts.codec) {
      const el = document.getElementById("expCodec");
      if (el) el.value = String(opts.codec);
    }
    return computeFail();
  },
  cancelVideoExport: () => {
    exportCancelled = true;
    const expCancelEl = document.getElementById("expCancel");
    if (expCancelEl) expCancelEl.click();
  },
  exportCurrentFrameBlob: async () => {
    if (!renderer) return null;
    renderer.renderAt(playheadMs);
    const canvas = viewEl || document.getElementById("view");
    if (!canvas) return null;
    return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  },
  exportImageSequenceZip: async (onProg, isCanc) => {
    if (!renderer || !projectScene) return null;
    const total = projectScene.totalTime || 0;
    const localNodeLocal = applyHelperScoped() || 30;
    const stepMs = 1000 / localNodeLocal;
    const framesCount = Math.max(1, Math.round(total / stepMs));
    const entries = [];
    const origH = playheadMs;
    const cancelFn = isCanc || (() => exportCancelled);
    try {
      renderer.setMediaMode("export");
      for (let valueTotal = 0; valueTotal < framesCount; valueTotal++) {
        if (cancelFn()) break;
        const curMs = Math.min(total, valueTotal * stepMs);
        renderer.renderAt(curMs);
        const canvas = viewEl || document.getElementById("view");
        const blob = await new Promise(blobValue => canvas.toBlob(blobValue, "image/png"));
        const uintArrayValue = new Uint8Array(await blob.arrayBuffer());
        const name = "frame_" + String(valueTotal + 1).padStart(5, "0") + ".png";
        entries.push({ name, data: uintArrayValue });
        if (onProg) onProg({ frame: valueTotal + 1, total: framesCount, pct: Math.round(((valueTotal + 1) / framesCount) * 100) });
      }
    } finally {
      renderer.setMediaMode("preview");
      renderer.renderAt(origH);
    }
    if (!entries.length || cancelFn()) return null;
    return createZipFromEntries(entries);
  },
  parseHexColor,
  omEffectObjFromXml,
  omAddFxToLayer,
  omFxWriteChannel,
  omFxParamDef,
  loadEffect: async (id) => {
    if (renderer && typeof renderer.loadEffect === "function") return await renderer.loadEffect(id);
    return false;
  },
  getLastExport: () => window.__AM_INTERNAL._lastExport || null
};
try {
  const origRenderAt = valueMax.prototype.renderAt;
  valueMax.prototype.renderAt = function() {
    const localNodeOuter = origRenderAt.apply(this, arguments);
    try { if (typeof window.omOnRender === "function") window.omOnRender(arguments[0]); } catch (localNodeExtra) {}
    return localNodeOuter;
  };
} catch (localNodeAlternate) {}
var localSorted = [],
  valueExtra = [],
  localValueLocal = -1;
function bindHelperMin(bindArgLocal) {
  localSorted = bindArgLocal;
  let bindGetEl = getElHelper("sMediaStrip");
  if (bindGetEl) {
    if (bindGetEl.innerHTML = '', getElHelper("sFillAll").hidden = bindArgLocal.length < 2, !bindArgLocal.length) {
      bindGetEl.innerHTML = "<div class=\"s-empty\">Preset ini tidak memakai foto atau video.</div>";
      return;
    }
    bindArgLocal.forEach((bindUri, bindHelperMinArg) => {
      let buttonEl = document.createElement("button");
      buttonEl.type = "button", buttonEl.className = "s-tile", buttonEl.setAttribute("aria-label", "Ganti media " + (bindHelperMinArg + 1));
      let bindHelperMinValue = map.get(bindUri.uri) || localValue[0] || '';
      buttonEl.appendChild(handleHelperRaw(bindHelperMinValue, "s-thumb", {
        preview: false
      }));
      let spanEl = document.createElement("span");
      spanEl.className = "s-num", spanEl.textContent = String(bindHelperMinArg + 1);
      let innerHtmlValue = document.createElement("span");
      innerHtmlValue.className = "s-swap", innerHtmlValue.innerHTML = "<svg class=\"i\"><use href=\"#i-upload\"/></svg>", buttonEl.appendChild(spanEl), buttonEl.appendChild(innerHtmlValue), buttonEl.addEventListener("click", () => {
        iHelper("image/*,video/*", false, ([bindArgStored]) => buildHelperTotal(bindUri, bindArgStored).catch(bindStored => appendLog("[SIMPLE] " + bindStored.message)));
      }), bindGetEl.appendChild(buttonEl);
    });
  }
}
async function buildHelperTotal(buildHelperTotalArg, buildArgByKey) {
  let buildHelperTotalValue = localNodePending.length;
  await getHelperClamped([buildArgByKey]);
  let buildEnd = localNodePending[localNodePending.length - 1];
  !buildEnd || localNodePending.length === buildHelperTotalValue || (await updateHelperRaw("media:pick", "Memuat " + buildEnd.name + '…', async () => {
    await updateHelperMin(buildHelperTotalArg, buildEnd.name), renderer.setImages(helperValue()), isDirty = true;
  }), computeHelperValue(), bindHelper());
}
async function handleHelperCount(handleHelperCountArg) {
  let handleHelperCountValue = localNodePending.length;
  await getHelperClamped(handleHelperCountArg);
  let slice = localNodePending.slice(handleHelperCountValue);
  slice.length && (await updateHelperRaw("media:pick", "Memasang media…", async () => {
    for (let handleHelperCountNumber = 0; handleHelperCountNumber < localSorted.length && handleHelperCountNumber < slice.length; handleHelperCountNumber++) await updateHelperMin(localSorted[handleHelperCountNumber], slice[handleHelperCountNumber].name);
    renderer.setImages(helperValue()), isDirty = true;
  }), computeHelperValue(), bindHelper());
}
function bindHelperByKey() {
  if (!projectScene) return;
  let bindHelperByKeyList = [];
  computeHelperMin(projectScene.layers, 0, bindHelperByKeyList, new Set()), valueExtra = bindHelperByKeyList, localValueLocal >= bindHelperByKeyList.length && (localValueLocal = -1);
  let bindValueByIndex = getElHelper("sTextStrip");
  bindValueByIndex.innerHTML = '', bindHelperByKeyList.length || (bindValueByIndex.innerHTML = "<div class=\"s-empty\">Preset ini tidak punya layer teks.</div>"), bindHelperByKeyList.forEach((bindArgCached, bindHelperByKeyArg) => {
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "s-chip" + (bindHelperByKeyArg === localValueLocal ? " on" : ''), buttonEl.textContent = String(bindArgCached.layer.textContent || '').trim() || "(kosong)", buttonEl.addEventListener("click", () => applyByKey(bindHelperByKeyArg)), bindValueByIndex.appendChild(buttonEl);
  }), getElHelper("sTextEditWrap").hidden = localValueLocal < 0, bindHelperClamped();
}
function applyByKey(applyByKeyArg) {
  let applyKey = valueExtra[applyByKeyArg];
  if (!applyKey) return;
  localValueLocal = applyByKeyArg, [...getElHelper("sTextStrip").children].forEach((applyArgOuter, applyByKeyArgValue) => applyArgOuter.classList && applyArgOuter.classList.toggle('on', applyByKeyArgValue === applyByKeyArg)), getElHelper("sTextEditWrap").hidden = false, getElHelper("sTextEdit").value = applyKey.layer.textContent || '';
  let applyMax = Math.max(0, applyKey.end - applyKey.start);
  seekToTime(applyKey.start + Math.min(800, applyMax / 2));
}
function updateClockElement() {
  let updateClockDocumentElement = document.documentElement,
    updateClockGetEl = getElHelper("sSeek"),
    addEventListenerValue = getElHelper("sPlay"),
    updateClockOuter = getElHelper("sTime"),
    updateClockValueInner = getElHelper("sExportBtn"),
    updateClockTextContent = getElHelper("sExportTxt"),
    updateClockText = false,
    updateClockValueClamped = null;
  document.querySelectorAll("#sTabs .s-tab").forEach(updateClockDataset => updateClockDataset.addEventListener("click", () => applyElement(updateClockDataset.dataset.s))), getElHelper("sModeBtn")?.["addEventListener"]("click", () => buildHelperMin(false)), getElHelper("sSettingsBtn")?.["addEventListener"]("click", () => {
    processHelperOuter(), settingsdlgEl.showModal();
  }), getElHelper("sAlightLoad")?.["addEventListener"]("click", processStart), getElHelper("sAlightInput")?.["addEventListener"]("keydown", updateClockKey => {
    updateClockKey.key === "Enter" && processStart();
  }), addEventListenerValue.addEventListener("click", () => requestPlayback(!isPlaying)), updateClockGetEl.addEventListener("pointerdown", () => {
    updateClockText = true;
  }), window.addEventListener("pointerup", () => {
    updateClockText = false;
  }), updateClockGetEl.addEventListener("input", () => {
    updateHelperValue(updateClockGetEl), seekEl.value = updateClockGetEl.value, seekEl.dispatchEvent(new Event("input", {
      bubbles: true
    }));
  }), getElHelper("sFillAll").addEventListener("click", () => {
    iHelper("image/*,video/*", true, updateClockElementArg => updateClockElementValueRaw(updateClockElementArg));
  });
  let updateClockElementValueRaw = updateClockArgLocal => handleHelperCount(updateClockArgLocal).catch(updateClockMessage => appendLog("[SIMPLE] " + updateClockMessage.message));
  getElHelper("sTextEdit").addEventListener("input", updateClockTarget => {
    let updateClockOt = valueExtra[localValueLocal];
    if (!updateClockOt) return;
    updateClockOt.layer.textContent = updateClockTarget.target.value;
    let otValue = getElHelper("sTextStrip").children[localValueLocal];
    otValue && (otValue.textContent = updateClockTarget.target.value.trim() || "(kosong)"), isDirty = true;
  });
  let updateClockClamped = () => updateClockDocumentElement.classList.remove("s-export");
  updateClockValueInner.addEventListener("click", () => {
    let updateClockValueScoped = getElHelper("expCodec"),
      updateClockScoped = getElHelper("expAudioSr");
    if (updateClockValueScoped && (updateClockValueScoped.value = "h264"), updateClockScoped && (updateClockScoped.value = "auto"), !isExporting) {
      let updateClockValueLocal = getElHelper("expStartSec");
      updateClockValueLocal && (updateClockValueLocal.value = '0'), typeof getHelperScoped == "function" && getHelperScoped();
    }
    updateClockDocumentElement.classList.add("s-export");
  }), getElHelper("sExportClose").addEventListener("click", updateClockClamped), getElHelper("panes").addEventListener("click", updateClockArgOuter => {
    updateClockArgOuter.target === getElHelper("panes") && updateClockClamped();
  }), setInterval(() => {
    if (projectScene) {
      let round = Math.round(projectScene.totalTime);
      updateClockGetEl.max !== String(round) && (updateClockGetEl.max = String(round)), updateClockText || (updateClockGetEl.value = String(Math.round(playheadMs)), updateHelperValue(updateClockGetEl));
      let updateClockElementValue = updateClockArgInner => {
        let floor = Math.floor(updateClockArgInner / 1000);
        return String(Math.floor(floor / 60)).padStart(2, '0') + ':' + String(floor % 60).padStart(2, '0');
      };
      updateClockOuter.textContent = updateClockElementValue(playheadMs) + " · " + updateClockElementValue(projectScene.totalTime);
    }
    updateClockValueClamped !== isPlaying && (updateClockValueClamped = isPlaying, addEventListenerValue.innerHTML = "<svg class=\"i\"><use href=\"#i-" + (isPlaying ? "pause" : "play") + "\"/></svg>");
    let updateClockLocal = isExporting && expbarEl.max ? Math.round(Number(expbarEl.value) / Number(expbarEl.max) * 100) : null,
      updateClockValueOuter = updateClockLocal === null ? "Ekspor" : updateClockLocal + '%';
    updateClockTextContent.textContent !== updateClockValueOuter && (updateClockTextContent.textContent = updateClockValueOuter);
  }, 150);
}
contains && updateClockElement(), getHelperByKey().catch(messageArg => {
  appendLog("[ERROR] " + messageArg.message), subtitleEl.textContent = "Gagal memuat preset", getHelperValue("Gagal memuat preset: " + messageArg.message);
  let bootError = document.getElementById("bootError"),
    bootErrorText = document.getElementById("bootErrorText");
  bootError && bootErrorText && (bootErrorText.textContent = '\x0a' + (messageArg.stack || messageArg.message || String(messageArg)), bootError.style.display = "block");
});
omInitTopbar();
var omMulti = new Set(),
  omMultiTimer = null,
  omMultiTrack = null;
var omMultiSuppress = 0;
function omMultiGroup(mode) {
  if (!projectScene) return omMultiClear();
  const omMultiGroupOmMultiIds = omMultiIds();
  const layers = omMultiGroupOmMultiIds.map(id => omResolveLayer(id)).filter(Boolean);
  if (!layers.length) return omMultiClear();
  const omMultiGroupOmMeta = omMeta();
  const parents = new Set(layers.map(omMultiGroupArgValue => findParentArray(omMultiGroupArgValue)));
  if (parents.size > 1) {
    appendLog("[GRUP] pilih layer dari tempat yang sama dulu");
    return;
  }
  const omMultiGroupValue = parents.values().next().value;
  if (!omMultiGroupValue) return omMultiClear();
  const snap = sceneSnapshot();
  const minStart = Math.min(...layers.map(omMultiGroupStartTime => omMultiGroupStartTime.startTime || 0));
  const maxEnd = Math.max(...layers.map(omMultiGroupEndTime => omMultiGroupEndTime.endTime != null ? omMultiGroupEndTime.endTime : omMultiGroupOmMeta.total));

  let mask = null;
  const xmls = layers.map(sourceXml => sourceXml.sourceXml || "").filter(Boolean);
  if (xmls.length === layers.length) {
    const inner = '<scene title="Grup" width="' + omMultiGroupOmMeta.w + '" height="' + omMultiGroupOmMeta.h + '" exportWidth="' + omMultiGroupOmMeta.w + '" exportHeight="' + omMultiGroupOmMeta.h + '" precompose="dynamicResolution" bgcolor="#ff000000" totalTime="' + (maxEnd - minStart) + '" fps="' + omMultiGroupOmMeta.fps + '">' + xmls.join('') + '</scene>';
    const gXml = '<embedScene id="' + omId() + '" label="Grup" startTime="' + minStart + '" endTime="' + maxEnd + '">' + inner + omTransformXml(Math.round(omMultiGroupOmMeta.w / 2), Math.round(omMultiGroupOmMeta.h / 2), 1) + '</embedScene>';
    mask = omParseLayer(gXml);
  }
  if (!mask) {
    const groupId = "group_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
    mask = {
      id: groupId,
      tag: "group",
      label: "Grup",
      startTime: minStart,
      endTime: maxEnd,
      inTime: 0,
      outTime: maxEnd - minStart,
      transform: {
        location: { value: [omMultiGroupOmMeta.w / 2, omMultiGroupOmMeta.h / 2, 0], kfs: [] },
        scale: { value: [1, 1], kfs: [] },
        rotation: { value: [0], kfs: [] },
        opacity: { value: [1], kfs: [] }
      },
      scene: {
        title: "Grup",
        width: omMultiGroupOmMeta.w,
        height: omMultiGroupOmMeta.h,
        totalTime: maxEnd - minStart,
        fps: omMultiGroupOmMeta.fps,
        layers: layers.map(omMultiGroupArgRaw => {
          const omMultiGroupCloneLayerSafe = cloneLayerSafe(omMultiGroupArgRaw);
          omMultiGroupCloneLayerSafe.startTime = Math.max(0, (omMultiGroupCloneLayerSafe.startTime || 0) - minStart);
          if (omMultiGroupCloneLayerSafe.endTime != null) omMultiGroupCloneLayerSafe.endTime = Math.max(0, omMultiGroupCloneLayerSafe.endTime - minStart);
          return omMultiGroupCloneLayerSafe;
        })
      },
      effects: []
    };
  }
  if (mode === "mask") {
    mask.mask = true;
    mask.label = "Masking Grup";
    if (mask.scene && mask.scene.layers && mask.scene.layers.length > 0) {
      mask.scene.layers[0].mask = true;
      mask.scene.layers[0].maskType = "alpha";
    }
  } else if (mode === "exclude") {
    mask.blendMode = "exclude";
    mask.label = "Exclude Grup";
  }
  const firstIndex = omMultiGroupValue.indexOf(layers[0]);
  layers.forEach(omMultiGroupArg => {
    const omMultiGroupFindParentArray = findParentArray(omMultiGroupArg);
    if (omMultiGroupFindParentArray) {
      const omMultiGroupResult = omMultiGroupFindParentArray.indexOf(omMultiGroupArg);
      if (omMultiGroupResult >= 0) omMultiGroupFindParentArray.splice(omMultiGroupResult, 1);
    }
  });
  if (firstIndex >= 0) omMultiGroupValue.splice(firstIndex, 0, mask);
  else omMultiGroupValue.push(mask);

  pushUndo(snap), isDirty = true, omMulti.clear();
  appendLog("[GRUP] " + layers.length + " layer digabung jadi \"" + mask.label + "\"");
  omMultiRefresh();
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  applyFlag(mask);
}
function omMultiAlignScreen(type) {
  if (!projectScene) return;
  const omMultiAlignScreenResult = omMulti.size ? omMultiIds() : [];
  const layers = omMultiAlignScreenResult.length ? omMultiAlignScreenResult.map(omResolveLayer).filter(Boolean) : [omLayerCur()].filter(Boolean);
  if (!layers.length) return appendLog("[ALIGN] Pilih layer terlebih dahulu");

  const omMultiAlignScreenOmMeta = omMeta();
  const snap = sceneSnapshot();

  function getBounds(layer) {
    let getBoundsNumber = 100, numberValue = 100;
    try {
      if (renderer && typeof renderer.se === "function") {
        const getBoundsSe = renderer.se(layer, layer.N || projectScene);
        const getBoundsResult = typeof renderer.fe === "function" ? renderer.fe(layer, getBoundsSe) : getBoundsSe;
        if (getBoundsResult && getBoundsResult[0] > 0 && getBoundsResult[1] > 0) {
          getBoundsNumber = getBoundsResult[0];
          numberValue = getBoundsResult[1];
        }
      }
    } catch {}
    if ((!getBoundsNumber || !numberValue || (getBoundsNumber === 100 && numberValue === 100)) && layer.size) {
      if (Array.isArray(layer.size.value)) {
        getBoundsNumber = layer.size.value[0] || getBoundsNumber;
        numberValue = layer.size.value[1] || numberValue;
      } else if (Array.isArray(layer.size)) {
        getBoundsNumber = layer.size[0] || getBoundsNumber;
        numberValue = layer.size[1] || numberValue;
      }
    }
    let getboundsValue = omMultiAlignScreenOmMeta.w / 2, getBoundsValue = omMultiAlignScreenOmMeta.h / 2;
    if (layer.transform && layer.transform.location) {
      const getBoundsLocation = layer.transform.location;
      if (Array.isArray(getBoundsLocation.value)) {
        getboundsValue = getBoundsLocation.value[0];
        getBoundsValue = getBoundsLocation.value[1];
      } else if (Array.isArray(getBoundsLocation)) {
        getboundsValue = getBoundsLocation[0];
        getBoundsValue = getBoundsLocation[1];
      }
    }
    return {
      layer,
      w: getBoundsNumber,
      h: numberValue,
      cx: getboundsValue,
      cy: getBoundsValue,
      left: getboundsValue - getBoundsNumber / 2,
      right: getboundsValue + getBoundsNumber / 2,
      top: getBoundsValue - numberValue / 2,
      bottom: getBoundsValue + numberValue / 2
    };
  }

  function translateLayer(layer, translatelayText, translateLayerArg) {
    if (Math.abs(translatelayText) < 0.001 && Math.abs(translateLayerArg) < 0.001) return;
    layer.transform = layer.transform || {};
    if (!layer.transform.location) {
      layer.transform.location = { value: [Math.round(omMultiAlignScreenOmMeta.w / 2 + translatelayText), Math.round(omMultiAlignScreenOmMeta.h / 2 + translateLayerArg), 0], kfs: [] };
      return;
    }
    const translateLayerLocation = layer.transform.location;
    if (Array.isArray(translateLayerLocation.value)) {
      translateLayerLocation.value[0] = Math.round(translateLayerLocation.value[0] + translatelayText);
      translateLayerLocation.value[1] = Math.round(translateLayerLocation.value[1] + translateLayerArg);
      if (Array.isArray(translateLayerLocation.kfs)) {
        translateLayerLocation.kfs.forEach(translateLayerValue => {
          if (Array.isArray(translateLayerValue.value)) {
            translateLayerValue.value[0] = Math.round(translateLayerValue.value[0] + translatelayText);
            translateLayerValue.value[1] = Math.round(translateLayerValue.value[1] + translateLayerArg);
          }
        });
      }
    } else if (Array.isArray(translateLayerLocation)) {
      translateLayerLocation[0] = Math.round(translateLayerLocation[0] + translatelayText);
      translateLayerLocation[1] = Math.round(translateLayerLocation[1] + translateLayerArg);
    }
  }

  const omMultiAlignScreenValue = layers.map(getBounds);

  if (type === "left") {
    if (layers.length === 1) {
      translateLayer(layers[0], -omMultiAlignScreenValue[0].left, 0);
    } else {
      const minLeft = Math.min(...omMultiAlignScreenValue.map(left => left.left));
      omMultiAlignScreenValue.forEach(omMultiAlignScreenLayer => translateLayer(omMultiAlignScreenLayer.layer, minLeft - omMultiAlignScreenLayer.left, 0));
    }
    appendLog("[ALIGN] Rata Kiri Layar");
  } else if (type === "center-h") {
    if (layers.length === 1) {
      translateLayer(layers[0], (omMultiAlignScreenOmMeta.w / 2) - omMultiAlignScreenValue[0].cx, 0);
    } else {
      const minLeft = Math.min(...omMultiAlignScreenValue.map(omMultiAlignScreenLeft => omMultiAlignScreenLeft.left));
      const maxRight = Math.max(...omMultiAlignScreenValue.map(right => right.right));
      const targetCx = (minLeft + maxRight) / 2;
      omMultiAlignScreenValue.forEach(omMultiAlignScreenCx => translateLayer(omMultiAlignScreenCx.layer, targetCx - omMultiAlignScreenCx.cx, 0));
    }
    appendLog("[ALIGN] Tengah Horizontal Layar");
  } else if (type === "right") {
    if (layers.length === 1) {
      translateLayer(layers[0], omMultiAlignScreenOmMeta.w - omMultiAlignScreenValue[0].right, 0);
    } else {
      const maxRight = Math.max(...omMultiAlignScreenValue.map(rightArg => rightArg.right));
      omMultiAlignScreenValue.forEach(omMultiAlignScreenRight => translateLayer(omMultiAlignScreenRight.layer, maxRight - omMultiAlignScreenRight.right, 0));
    }
    appendLog("[ALIGN] Rata Kanan Layar");
  } else if (type === "top") {
    if (layers.length === 1) {
      translateLayer(layers[0], 0, -omMultiAlignScreenValue[0].top);
    } else {
      const minTop = Math.min(...omMultiAlignScreenValue.map(top => top.top));
      omMultiAlignScreenValue.forEach(omMultiAlignScreenTop => translateLayer(omMultiAlignScreenTop.layer, 0, minTop - omMultiAlignScreenTop.top));
    }
    appendLog("[ALIGN] Rata Atas Layar");
  } else if (type === "center-v") {
    if (layers.length === 1) {
      translateLayer(layers[0], 0, (omMultiAlignScreenOmMeta.h / 2) - omMultiAlignScreenValue[0].cy);
    } else {
      const minTop = Math.min(...omMultiAlignScreenValue.map(topArg => topArg.top));
      const maxBottom = Math.max(...omMultiAlignScreenValue.map(bottom => bottom.bottom));
      const targetCy = (minTop + maxBottom) / 2;
      omMultiAlignScreenValue.forEach(omMultiAlignScreenCy => translateLayer(omMultiAlignScreenCy.layer, 0, targetCy - omMultiAlignScreenCy.cy));
    }
    appendLog("[ALIGN] Tengah Vertikal Layar");
  } else if (type === "bottom") {
    if (layers.length === 1) {
      translateLayer(layers[0], 0, omMultiAlignScreenOmMeta.h - omMultiAlignScreenValue[0].bottom);
    } else {
      const maxBottom = Math.max(...omMultiAlignScreenValue.map(bottomArg => bottomArg.bottom));
      omMultiAlignScreenValue.forEach(omMultiAlignScreenBottom => translateLayer(omMultiAlignScreenBottom.layer, 0, maxBottom - omMultiAlignScreenBottom.bottom));
    }
    appendLog("[ALIGN] Rata Bawah Layar");
  } else if (type === "distribute-h") {
    if (layers.length <= 2) {
      if (layers.length === 1) translateLayer(layers[0], (omMultiAlignScreenOmMeta.w / 2) - omMultiAlignScreenValue[0].cx, 0);
    } else {
      const sorted = [...omMultiAlignScreenValue].sort((omMultiAlignScreenArgValue, omMultiAlignScreenArgRaw) => omMultiAlignScreenArgValue.cx - omMultiAlignScreenArgRaw.cx);
      const firstCx = sorted[0].cx;
      const lastCx = sorted[sorted.length - 1].cx;
      const step = (lastCx - firstCx) / (sorted.length - 1);
      sorted.forEach((cxArg, ommultialignValue) => {
        if (ommultialignValue > 0 && ommultialignValue < sorted.length - 1) {
          const target = firstCx + ommultialignValue * step;
          translateLayer(cxArg.layer, target - cxArg.cx, 0);
        }
      });
    }
    appendLog("[ALIGN] Distribusi Horizontal Layar");
  } else if (type === "distribute-v") {
    if (layers.length <= 2) {
      if (layers.length === 1) translateLayer(layers[0], 0, (omMultiAlignScreenOmMeta.h / 2) - omMultiAlignScreenValue[0].cy);
    } else {
      const sorted = [...omMultiAlignScreenValue].sort((omMultiAlignScreenRaw, omMultiAlignScreenArgParsed) => omMultiAlignScreenRaw.cy - omMultiAlignScreenArgParsed.cy);
      const firstCy = sorted[0].cy;
      const lastCy = sorted[sorted.length - 1].cy;
      const step = (lastCy - firstCy) / (sorted.length - 1);
      sorted.forEach((cyArg, omMultiAlignScreenArg) => {
        if (omMultiAlignScreenArg > 0 && omMultiAlignScreenArg < sorted.length - 1) {
          const target = firstCy + omMultiAlignScreenArg * step;
          translateLayer(cyArg.layer, 0, target - cyArg.cy);
        }
      });
    }
    appendLog("[ALIGN] Distribusi Vertikal Layar");
  }

  pushUndo(snap);
  isDirty = true;
  renderer && renderer.renderAt(playheadMs);
  omScheduleSave();
}
function omMultiAlignTimeline(mode) {
  if (!projectScene) return;
  const omMultiAlignTimelineValue = omMulti.size ? omMultiIds() : [];
  const layers = omMultiAlignTimelineValue.length ? omMultiAlignTimelineValue.map(omResolveLayer).filter(Boolean) : [omLayerCur()].filter(Boolean);
  if (!layers.length) return appendLog("[ALIGN] Pilih layer terlebih dahulu");
  const omMultiAlignTimelineOmMeta = omMeta();
  const total = omMultiAlignTimelineOmMeta.total || (projectScene ? projectScene.totalTime : 3000);
  const snap = sceneSnapshot();

  if (mode === "left") {
    const minStart = Math.min(...layers.map(omMultiAlignTimelineArgValue => omMultiAlignTimelineArgValue.startTime || 0));
    layers.forEach(omMultiAlignTimelineEndTime => {
      const omMultiAlignTimelineResult = (omMultiAlignTimelineEndTime.endTime != null ? omMultiAlignTimelineEndTime.endTime : total) - (omMultiAlignTimelineEndTime.startTime || 0);
      omMultiAlignTimelineEndTime.startTime = minStart;
      omMultiAlignTimelineEndTime.endTime = minStart + omMultiAlignTimelineResult;
    });
    appendLog("[TIMELINE] Rata Kiri Timeline (" + minStart + " ms)");
  } else if (mode === "right") {
    const maxEnd = Math.max(...layers.map(omMultiAlignTimelineArg => omMultiAlignTimelineArg.endTime != null ? omMultiAlignTimelineArg.endTime : total));
    layers.forEach(endTimeArg => {
      const omMultiAlignTimelineValueRaw = (endTimeArg.endTime != null ? endTimeArg.endTime : total) - (endTimeArg.startTime || 0);
      endTimeArg.endTime = maxEnd;
      endTimeArg.startTime = Math.max(0, maxEnd - omMultiAlignTimelineValueRaw);
    });
    appendLog("[TIMELINE] Rata Kanan Timeline (" + maxEnd + " ms)");
  } else if (mode === "distribute") {
    if (layers.length <= 2) {
      appendLog("[TIMELINE] Distribusi memerlukan minimal 3 layer");
      return;
    }
    const sorted = [...layers].sort((omMultiAlignTimelineArgRaw, omMultiAlignTimelineArgParsed) => (omMultiAlignTimelineArgRaw.startTime || 0) - (omMultiAlignTimelineArgParsed.startTime || 0));
    const firstStart = sorted[0].startTime || 0;
    const lastStart = sorted[sorted.length - 1].startTime || 0;
    const step = (lastStart - firstStart) / (sorted.length - 1);
    sorted.forEach((omMultiAlignTimelineStartTime, omMultiAlignTimelineParsed) => {
      const omMultiAlignTimelineRaw = (omMultiAlignTimelineStartTime.endTime != null ? omMultiAlignTimelineStartTime.endTime : total) - (omMultiAlignTimelineStartTime.startTime || 0);
      const newStart = Math.round(firstStart + omMultiAlignTimelineParsed * step);
      omMultiAlignTimelineStartTime.startTime = newStart;
      omMultiAlignTimelineStartTime.endTime = newStart + omMultiAlignTimelineRaw;
    });
    appendLog("[TIMELINE] Distribusi Timeline Selesai");
  }

  pushUndo(snap);
  isDirty = true;
  bindFlag();
  renderer && renderer.renderAt(playheadMs);
  omScheduleSave();
}
function omUngroup(groupLayer) {
  const omungroupValue = groupLayer || omLayerCur();
  if (!omungroupValue || !getHelper(omungroupValue)) return appendLog("[GRUP] Pilih layer grup terlebih dahulu");
  const omUngroupFindParentArray = findParentArray(omungroupValue);
  if (!omUngroupFindParentArray) return;
  const snap = sceneSnapshot();
  const children = (omungroupValue.scene && omungroupValue.scene.layers) || [];
  const gStart = omungroupValue.startTime || 0;
  const omUngroupValue = omUngroupFindParentArray.indexOf(omungroupValue);
  if (omUngroupValue < 0) return;
  omUngroupFindParentArray.splice(omUngroupValue, 1);
  children.forEach((omUngroupArg, omUngroupArgValue) => {
    const omUngroupCloneLayerSafe = cloneLayerSafe(omUngroupArg);
    omUngroupCloneLayerSafe.startTime = (omUngroupCloneLayerSafe.startTime || 0) + gStart;
    if (omUngroupCloneLayerSafe.endTime != null) omUngroupCloneLayerSafe.endTime += gStart;
    omUngroupFindParentArray.splice(omUngroupValue + omUngroupArgValue, 0, omUngroupCloneLayerSafe);
  });
  pushUndo(snap), isDirty = true;
  appendLog("[GRUP] Grup dibubarkan menjadi " + children.length + " layer");
  bindFlag(), renderer && renderer.renderAt(playheadMs);
  applyFlag(null);
}
function omMultiDelete() {
  if (!projectScene) return omMultiClear();
  const omMultiDeleteOmMultiIds = omMultiIds();
  const layers = omMultiDeleteOmMultiIds.map(id => omResolveLayer(id)).filter(Boolean);
  if (!layers.length) return omMultiClear();
  const snap = sceneSnapshot();
  layers.forEach(omMultiDeleteArg => {
    const omMultiDeleteFindParentArray = findParentArray(omMultiDeleteArg);
    if (omMultiDeleteFindParentArray) omMultiDeleteFindParentArray.splice(omMultiDeleteFindParentArray.indexOf(omMultiDeleteArg), 1);
  });
  pushUndo(snap), isDirty = true, omMulti.clear();
  appendLog("[EDIT] " + layers.length + " layer dihapus");
  omMultiRefresh();
  renderer && renderer.renderAt(playheadMs);
  bindFlag();
}
function omBindMulti() {
  if (omMultiBound) return;
  omMultiBound = true;
  omMultiRefreshStyles();
  document.addEventListener("pointerdown", targetArg => {
    const label = targetArg.target && targetArg.target.closest && (targetArg.target.closest(".tl-label") || targetArg.target.closest(".tl-block"));
    if (!label || !label.dataset || !label.dataset.key) return;
    const id = label.dataset.key;
    const omBindMultiResult = omMultiTrack = { id, x: targetArg.clientX, y: targetArg.clientY, moved: false };
    clearTimeout(omMultiTimer);
    omMultiTimer = setTimeout(() => {
      const omBindMultiId = omMultiTrack;
      if (omBindMultiId && omBindMultiId.id === id && !omBindMultiId.moved) {
        omMultiSuppress = Date.now() + 1600;
        omMultiToggle(id);
      }
    }, 420);
  }, true);
  document.addEventListener("pointermove", omBindMultiClientX => {
    if (omMultiTrack && Math.abs(omBindMultiClientX.clientX - omMultiTrack.x) + Math.abs(omBindMultiClientX.clientY - omMultiTrack.y) > 6) omMultiTrack.moved = true;
  }, true);
  const cancelTrack = omBindMultiArgValue => {
    if (omMultiTrack) clearTimeout(omMultiTimer), omMultiTrack = null;
  };
  document.addEventListener("pointerup", cancelTrack, true);
  document.addEventListener("pointercancel", cancelTrack, true);
  document.addEventListener("click", omBindMultiTarget => {
    if (Date.now() < omMultiSuppress) {
      const ombindmultiValue = omBindMultiTarget.target && omBindMultiTarget.target.closest && (omBindMultiTarget.target.closest(".tl-eye") || omBindMultiTarget.target.closest(".tl-thumb"));
      if (ombindmultiValue) {
        omBindMultiTarget.preventDefault(), omBindMultiTarget.stopPropagation(), omBindMultiTarget.stopImmediatePropagation();
      }
    }
    if (omMulti.size) {
      if (omBindMultiTarget.target.closest("#omMultiBar") || omBindMultiTarget.target.closest("#am-navbar-select") || omBindMultiTarget.target.closest("#am-select-bottom-bar")) {
        return;
      }
      const targetLabel = omBindMultiTarget.target.closest && (omBindMultiTarget.target.closest(".tl-label") || omBindMultiTarget.target.closest(".tl-block"));
      if (targetLabel && targetLabel.dataset && targetLabel.dataset.key) {
        omBindMultiTarget.preventDefault(), omBindMultiTarget.stopPropagation(), omBindMultiTarget.stopImmediatePropagation();
        omMultiToggle(targetLabel.dataset.key);
        return;
      }
      const insideTimeline = omBindMultiTarget.target.closest && (omBindMultiTarget.target.closest("#am-bottom-container") || omBindMultiTarget.target.closest("#pane-layer") || omBindMultiTarget.target.closest(".tl-timeline"));
      if (!insideTimeline) {
        omMultiClear();
      }
    }
  }, true);
  // Delete / Backspace hapus seleksi banyak
  document.addEventListener("keydown", omBindMultiKey => {
    if (!omMulti.size) return;
    const omBindMultiTagName = omBindMultiKey.target, omBindMultiValue = omBindMultiTagName && omBindMultiTagName.tagName;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(omBindMultiValue) || omBindMultiTagName && omBindMultiTagName.isContentEditable) return;
    if (omBindMultiKey.key === "Delete" || omBindMultiKey.key === "Backspace") {
      omBindMultiKey.preventDefault(), omMultiDelete();
    } else if (omBindMultiKey.key === "Escape") omMultiClear();
  }, true);
  document.addEventListener("keydown", omBindMultiArg => { if (omBindMultiArg.key === "Escape") omMultiClear(); }, true);
}
var omMultiBound = false;
omBindMulti();
setInterval(()=>{ if(document.querySelector("#pane-layer .tl-toolbar") && !document.getElementById("om-add") && typeof window.omInitAddButton==="function"){ try{window.omInitAddButton()}catch(localNodeOther){} } },1200);
export { OM_BGS, OM_BLENDS, OM_DEFAULT_FONTS, OM_FPS, OM_PALETTE, OM_RATIOS, OM_RES, OM_SHAPES, Ws, aHelper, amAudioEe, applyByKey, applyFlag, applyHelperInner, applyHelperOuter, applyHelperValue, applySceneSnapshot, audioDriftMs, audioLoadFailed, audioOffsetMs, audiostateEl, autoqualityEl, badEffects, bindElement, bindFlag, bindHelperByKey, bindHelperLocal, bindHelperMin, bindHelperValue, buildFail, buildHelperCount, buildHelperMap, buildHelperRaw, buildHelperTotal, busydetailEl, busydismissEl, busylabelEl, byFileName, bytes, camera, closeLayerCtx, computeFail, computeHelperByIndex, computeHelperByKey, computeHelperClamped, computeHelperScoped, computeHelperValue, contains, ctxInput, ctxMenu, ctxTarget, dbgcontentEl, debugcanvasEl, debugmodetogEl, debugoverlayEl, deleteLayer, duplicateLayer, easingFunctions, elementHelper, enginehintEl, enginerowsEl, expEnabledEl, expFpsCustomRowEl, expbarEl, expbitrateEl, expbitratelaEl, expcancelEl, expcatsEl, expcodecEl, expendsecEl, expendseclabEl, expfpsEl, expfpscustomEl, exphintEl, exportBlobUrl, exportCancelled, expresEl, expresultEl, exprowsEl, expstartEl, expstartsecEl, expstartseclEl, expstatsEl, eyeOff, float32Array2, float32Array3, float64Array2, float64Array3, floatArray, fpscustomEl, fpscustomrowEl, fpstargetEl, freeze, fromEntries, fxtoggleEl, getElement, getHelperByKey, getHelperClamped, getHelperParsed, getHelperRaw, getHelperStart, getHelperValue, getPos, handleHelperCount, handleHelperMap, handleHelperOuter, handleHelperValue, hasMediaItems, helperClamped, helperCount, helperEl, helperScoped, helperTotal, idle, impphotoEl, imppickEl, imppickrowEl, impresetEl, impstateEl, impxmlEl, isDirty, isExporting, isLoading, isPlaying, isScrubbing, lHelper, lastFrameMs, lastIndex, lastQualityCheckMs, lastRenderError, lastRenderMs, lastStatusUpdateMs, listValue, loadingMessage, localBatch, localByIndex, localByKey, localClamped, localCompared, localCurrent, localEmbedded, localGroup, localKind, localList, localMap, localMax, localMode, localNested, localNext, localNodeDerived, localNodeFinal, localNodePending, localNodeResolved, localNodeStart, localNumber, localOuter, localPrev, localPrimary, localRaw, localRef, localRule, localScoped, localSecondary, localSegment, localSet, localSorted, localStage, localStepped, localTertiary, localToken, localTotal, localTracked, localType, localUintArray, localValue, localValueBatch, localValueBuffer, localValueByIndex, localValueByKey, localValueCompared, localValueCurrent, localValueEl, localValueEmbedded, localValueExtra, localValueGroup, localValueInner, localValueKind, localValueLayer, localValueLocal, localValueMode, localValueNested, localValueNext, localValuePrev, localValueRule, localValueScoped, localValueSecondary, localValueSegment, localValueSorted, localValueStage, localValueTertiary, localValueToken, localValueTracked, localValueType, logEl, loopPlayback, loopbtnEl, looplabelEl, map, mapValue, matchMedia, mediaKeys, mediapickerdEl, mediapickergEl, mediapickertEl, mediarowsEl, noiseDirections, offsetEl, offsetlabelEl, omActProp, omAddAudioFile, omAddFxToLayer, omAddLayer, omAddMenu, omBindMulti, omCloseAddMenu, omEnsureGoogleFont, omEnsureId, omFxDialogLayer, omFxIndex, omFxIndexCache, omHandleInContextHelper, omInitPropsPanel, omKfInsert, omKfRemoveAt, omKfSetEasing, omLoadProjectScene, omMulti, omMultiAlignScreen, omMultiAlignTimeline, omMultiBound, omMultiDelete, omMultiGroup, omMultiSuppress, omMultiTimer, omMultiTrack, omMuteToggle, omOpenAddMenu, omOpenFxDialog, omOpenProject, omOpenTextDlg, omPasteLayers, omPasteStyle, omProjectId, omPropsBegin, omPropsCommit, omPropsLayerId, omPropsSnap, omRetime, omSaveTimer, omScheduleSave, omSetLayerSpeed, omSetSpeedCurve, omToggleFreezeFrame, omToggleReverse, omTrimSide, omUngroup, omUploads, openLayerCtx, panesEl, pendingPlay, perfStatusText, perflabelEl, photogalleryEl, pitchkeepEl, playEl, playbackRate, playheadMs, processHelperParsed, processHelperStart, processLocal, projectScene, qualityEl, rateEl, rateautoEl, ratelabelEl, recentFrameTimes, recordValue, redoStack, renderHelperClamped, renderHelperEl, renderHelperEnd, renderHelperLocal, renderHelperStart, renderHelperValue, renderRequestId, renderer, replaceMediaForLayer, requestPlayback, reslabelEl, scaleEl, scalelabelEl, seekEl, seekToTime, setValue, settingsdlgEl, showOmProjectDialog, sizescaleEl, smoothedFrameMs, splitLayerAt, stageEl, stagebusyEl, statusEl, subtitleEl, syncStateEl, tElement, targetFps, textValue, timelabelEl, timelinedockEl, uint32Array2, uint32Array3, uint32Array4, uintArray, undoStack, updateClock, updateClockElement, updateHelperList, updateHelperLocal, updateHelperMap, updateHelperOuter, urlDriveAudioGoEl, urlDriveAudioStateEl, urlamEl, urlamgoEl, urlampickEl, urlampickrowEl, urlamstateEl, urldriveEl, urldriveaudiEl, urldrivegoEl, urldrivestatEl, urltiktokEl, urltiktokgoEl, urltiktokstaEl, valueBatch, valueBuffer, valueByIndex, valueByKey, valueCompared, valueCurrent, valueEmbedded, valueExtra, valueGroup, valueInner, valueKind, valueMax, valueMode, valueNested, valueNext, valueOuter, valuePhase, valuePrev, valuePrimary, valueRaw, valueRecord, valueRule, valueScoped, valueSecondary, valueSegment, valueSorted, valueStage, valueStepped, valueTertiary, valueToken, valueTracked, valueType, videoAudioSlots, videoBuildVersion, viewEl, volume, weakSet };
