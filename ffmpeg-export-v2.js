var ue = "0.12.10",
  Y = "0.12.6",
  fe = {
    moduleURL: "/ffmpeg/index.js?v=" + ue,
    coreURL: "/ffmpeg-core/ffmpeg-core.js?v=" + Y,
    wasmURL: "/ffmpeg-core/ffmpeg-core.wasm?v=" + Y
  };
function obj() {
  let val2 = typeof globalThis < 'u' && globalThis.AM_FFMPEG_CONFIG || {};
  return {
    ...fe,
    ...val2
  };
}
var B = null,
  val = null,
  te = a => import(a),
  ae = null;
function process(a) {
  te = typeof a == "function" ? a : a2 => import(a2);
}
function compute(a) {
  ae = a || null;
}
function render() {
  return !!(val && val.loaded);
}
function apply() {
  if (val) try {
    val.terminate();
  } catch {}
  val = null, B = null;
}
function get(a) {
  try {
    let val2 = typeof location < 'u' && location.href ? location.href : "http://localhost/";
    return new URL(a, val2).href;
  } catch {
    return a;
  }
}
function update(a, b) {
  let error = new Error(a);
  return error.ffmpegFailure = true, b && (error.cause = b), error;
}
async function build(a, {
  onProgress: b = () => {},
  stage: b2 = "ffmpeg-download",
  label: b3 = "Mengunduh FFmpeg"
} = {}) {
  if (typeof fetch != "function" || typeof Blob > 'u' || typeof URL > 'u' || typeof URL.createObjectURL != "function") return a;
  try {
    let val2 = await fetch(a, {
      cache: "force-cache"
    });
    if (!val2.ok || !val2.body || typeof val2.body.getReader != "function") return a;
    let val3 = Number(val2.headers.get("content-length")) || 0,
      getReader = val2.body.getReader(),
      arr = [],
      n = 0,
      n2 = 0,
      n3 = 0;
    for (;;) {
      let {
        done: val5,
        value: val6
      } = await getReader.read();
      if (val5) break;
      arr.push(val6), n += val6.length;
      let now = Date.now(),
        val7 = val3 ? Math.max(1, val3 / 100) : 4 * 1048576;
      if (!val5 && n - n2 < val7 && now - n3 < 300) continue;
      n2 = n, n3 = now;
      let val8 = val3 ? '\x20' + Math.round(n / val3 * 100) + '%' : '',
        val9 = val3 ? '\x20(' + (n / 1048576).toFixed(1) + '/' + (val3 / 1048576).toFixed(1) + " MB)" : '';
      b({
        phase: "fallback",
        stage: b2,
        loaded: n,
        total: val3,
        message: '' + b3 + val8 + val9
      });
    }
    let val4 = b2 === "ffmpeg-wasm" ? "application/wasm" : "text/javascript";
    return URL.createObjectURL(new Blob(arr, {
      type: val4
    }));
  } catch {
    return a;
  }
}
async function handle({
  onProgress: a = () => {}
} = {}) {
  return B || (B = (async () => {
    let obj2 = {
      ...obj(),
      ...(ae || {})
    };
    a({
      phase: "fallback",
      stage: "ffmpeg-load",
      message: "Memuat FFmpeg WASM..."
    });
    let val2;
    try {
      val2 = await te(obj2.moduleURL);
    } catch (val4) {
      throw B = null, update("Gagal memuat modul FFmpeg (" + obj2.moduleURL + "): " + (val4 && val4.message || val4), val4);
    }
    let val3 = val2 && (val2.FFmpeg || val2.default && val2.default.FFmpeg || val2.default);
    if (typeof val3 != "function") throw B = null, update("Modul FFmpeg tidak mengekspor kelas FFmpeg.");
    let val32 = new val3(),
      arr = [];
    try {
      let val4 = await build(get(obj2.coreURL), {
        onProgress: a,
        stage: "ffmpeg-core",
        label: "Mengunduh inti FFmpeg"
      });
      val4.startsWith("blob:") && arr.push(val4);
      let val5 = await build(get(obj2.wasmURL), {
        onProgress: a,
        stage: "ffmpeg-wasm",
        label: "Mengunduh WASM FFmpeg"
      });
      val5.startsWith("blob:") && arr.push(val5), await val32.load({
        coreURL: val4,
        wasmURL: val5
      });
    } catch (val4) {
      throw B = null, update("Gagal menginisialisasi FFmpeg WASM: " + (val4 && val4.message || val4), val4);
    } finally {
      for (let val4 of arr) try {
        URL.revokeObjectURL(val4);
      } catch {}
    }
    return val = val32, a({
      phase: "fallback",
      stage: "ffmpeg-ready",
      message: "FFmpeg ready"
    }), val32;
  })(), B);
}
function process2({
  fps: a = 30,
  hasAudio: a2 = false,
  codec: a3 = "h264",
  crf: a4 = 26,
  audioBitrate: a5 = 128,
  preset: a6 = "ultrafast"
} = {}) {
  let arr = ["-hide_banner", "-loglevel", "error", "-framerate", String(a), '-i', "frame%06d.jpg"];
  return a2 && arr.push('-i', "audio.wav"), arr.push("-c:v", a3 === "h265" ? "libx265" : "libx264"), arr.push("-preset", a6, "-crf", String(a4), "-pix_fmt", "yuv420p"), a3 === "h265" && arr.push("-tag:v", "hvc1"), a2 && arr.push("-c:a", "aac", "-b:a", Math.round(a5) + 'k', "-shortest"), arr.push("-movflags", "+faststart", "out.mp4"), arr;
}
function uint8Array(a) {
  let val2 = a.numberOfChannels,
    val3 = a.sampleRate,
    val4 = a.length,
    n = 2,
    val5 = val2 * n,
    val6 = val4 * val5,
    arrayBuffer = new ArrayBuffer(44 + val6),
    dataView = new DataView(arrayBuffer),
    fn = (a2, b) => {
      for (let n3 = 0; n3 < b.length; n3++) dataView.setUint8(a2 + n3, b.charCodeAt(n3));
    };
  fn(0, "RIFF"), dataView.setUint32(4, 36 + val6, true), fn(8, "WAVE"), fn(12, "fmt "), dataView.setUint32(16, 16, true), dataView.setUint16(20, 1, true), dataView.setUint16(22, val2, true), dataView.setUint32(24, val3, true), dataView.setUint32(28, val3 * val5, true), dataView.setUint16(32, val5, true), dataView.setUint16(34, 8 * n, true), fn(36, "data"), dataView.setUint32(40, val6, true);
  let arr = [];
  for (let n3 = 0; n3 < val2; n3++) arr.push(a.getChannelData(n3));
  let int16Array = new Int16Array(arrayBuffer, 44, val4 * val2),
    n2 = 0;
  for (let n3 = 0; n3 < val4; n3++) for (let n4 = 0; n4 < val2; n4++) {
    let max = Math.max(-1, Math.min(1, arr[n4][n3] || 0));
    int16Array[n2++] = max < 0 ? max * 32768 | 0 : max * 32767 | 0;
  }
  return new Uint8Array(arrayBuffer);
}
async function render2(a, b = 0.85) {
  if (typeof a.toBlob == "function") {
    let val2 = await new Promise((a2, b2) => {
      a.toBlob(a3 => a3 ? a2(a3) : b2(new Error("toBlob menghasilkan null")), "image/jpeg", b);
    });
    return new Uint8Array(await val2.arrayBuffer());
  }
  if (typeof a.convertToBlob == "function") {
    let val2 = await a.convertToBlob({
      type: "image/jpeg",
      quality: b
    });
    return new Uint8Array(await val2.arrayBuffer());
  }
  throw new Error("Canvas tidak mendukung toBlob/convertToBlob untuk frame JPEG.");
}
var de = a => "frame" + String(a).padStart(6, '0') + ".jpg",
  re = 40;
async function apply2({
  videoBytes: a,
  videoCodec: a5 = "h264",
  width: a2,
  height: a3,
  fps: a6 = 30,
  frames: a7 = null,
  renderAudio: a4,
  onProgress: a8 = () => {},
  isCancelled: a9 = () => false
}) {
  let val2 = await handle({
      onProgress: a10 => a8(a10)
    }),
    arr = [],
    fn = a10 => {
      arr.push(a10 && a10.message ? String(a10.message) : String(a10 || '')), arr.length > re && arr.shift();
    };
  try {
    val2.on("log", fn);
  } catch {}
  let fn2 = a10 => {
    let val3 = a10 && typeof a10.progress == "number" ? a10.progress : null,
      val4 = val3 != null ? Math.min(100, Math.max(0, Math.round(val3 * 100))) : null;
    a8({
      phase: "fallback",
      stage: "encode-progress",
      progress: val3,
      message: val4 != null ? "Menggabungkan audio… " + val4 + '%' : "Menggabungkan audio…"
    });
  };
  try {
    val2.on("progress", fn2);
  } catch {}
  let arr2 = [];
  try {
    if (a8({
      phase: "fallback",
      stage: "hybrid",
      message: "Menggabungkan video WebCodecs + audio FFmpeg (mode cepat)…"
    }), await val2.writeFile("video.mp4", a instanceof Uint8Array ? a : new Uint8Array(a)), arr2.push("video.mp4"), typeof a4 != "function") {
      let error = new Error("Audio diminta tetapi tidak ada sumber campuran audio.");
      throw error.audioFailure = true, error;
    }
    let val3;
    try {
      val3 = await a4();
    } catch (val6) {
      let error = new Error("Campuran audio gagal disiapkan: " + (val6 && val6.message || val6));
      throw error.audioFailure = true, error;
    }
    if (!val3 || !val3.length) {
      let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
      throw error.audioFailure = true, error;
    }
    let res = uint8Array(val3);
    await val2.writeFile("audio.wav", res), arr2.push("audio.wav");
    let obj2 = {
      packets: null,
      sampleRate: val3.sampleRate,
      channels: val3.numberOfChannels,
      seconds: val3.length / val3.sampleRate,
      bytes: res.byteLength
    };
    a8({
      phase: "audio",
      stage: 'ok',
      ...obj2
    });
    let arr3 = ["-hide_banner", "-loglevel", "error", '-i', "video.mp4", '-i', "audio.wav", "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", "out.mp4"],
      abortController = new AbortController(),
      res2 = setInterval(() => {
        a9() && abortController.abort();
      }, 100),
      n = 0;
    try {
      n = await val2.exec(arr3, -1, {
        signal: abortController.signal
      });
    } catch (val6) {
      if (clearInterval(res2), a9() || val6 && val6.name === "AbortError") {
        try {
          val2.terminate();
        } catch {}
        apply();
        let obj4 = {
          status: "cancelled",
          cancelled: true,
          blob: null,
          codec: a5,
          width: a2,
          height: a3,
          fps: a6,
          frames: a7,
          mode: "hybrid",
          audio: null
        };
        return a8({
          phase: "batal",
          ...obj4
        }), obj4;
      }
      let res3 = update("FFmpeg gagal memux audio: " + (val6 && val6.message || val6), val6);
      throw res3.audioFailure = true, res3;
    }
    if (clearInterval(res2), n !== 0) {
      let res3 = update("FFmpeg keluar dengan kode " + n + '.\x20' + arr.slice(-4).join(" | "));
      throw res3.audioFailure = true, res3;
    }
    let val4;
    try {
      val4 = await val2.readFile("out.mp4");
    } catch (val6) {
      throw update("FFmpeg tidak menghasilkan output: " + (val6 && val6.message || val6), val6);
    }
    let val5 = val4 instanceof Uint8Array ? val4 : new Uint8Array(val4);
    if (!val5 || !val5.byteLength) throw update("FFmpeg menghasilkan MP4 kosong.");
    let blob = new Blob([val5], {
        type: "video/mp4"
      }),
      obj3 = {
        status: "success",
        cancelled: false,
        blob: blob,
        codec: a5,
        width: a2,
        height: a3,
        fps: a6,
        frames: a7,
        mode: "hybrid",
        bitrate: null,
        audio: obj2,
        audioError: null
      };
    return a8({
      phase: "selesai",
      ...obj3,
      bytes: blob.size
    }), obj3;
  } finally {
    try {
      val2.off("log", fn);
    } catch {}
    try {
      val2.off("progress", fn2);
    } catch {}
    for (let val3 of [...arr2, "out.mp4"]) try {
      await val2.deleteFile(val3);
    } catch {}
  }
}
async function updateClock({
  canvas: a,
  snapshot: a2,
  renderFrame: a3,
  prepareFrame: a5 = null,
  startMs: a6 = 0,
  endMs: a4,
  fps: a7 = 30,
  bitrate: a8 = 6000000,
  codec: a9 = "h264",
  crf: a10 = null,
  jpegQuality: a11 = 0.85,
  renderAudio: a12 = null,
  audioRequested: a13 = false,
  onProgress: a14 = () => {},
  isCancelled: a15 = () => false
}) {
  let val2 = a.width - a.width % 2,
    val3 = a.height - a.height % 2,
    val4 = 1000 / a7,
    max = Math.max(1, Math.round((a4 - a6) / val4) + 1),
    now = performance.now(),
    fn = a16 => a14({
      total: max,
      elapsedMs: performance.now() - now,
      ...a16
    }),
    val5 = await handle({
      onProgress: a16 => fn(a16)
    });
  a14({
    phase: "fallback",
    stage: "ffmpeg",
    message: "Menggunakan FFmpeg WASM sebagai fallback audio/video."
  });
  let arr = [],
    fn2 = a16 => {
      let val7 = a16 && a16.message ? String(a16.message) : String(a16 || '');
      arr.push(val7), arr.length > re && arr.shift();
    };
  try {
    val5.on("log", fn2);
  } catch {}
  let fn3 = a16 => {
    let val7 = a16 && typeof a16.progress == "number" ? a16.progress : null,
      val8 = val7 != null ? Math.min(100, Math.max(0, Math.round(val7 * 100))) : null,
      val9 = a16 && typeof a16.time == "number" ? (a16.time / 1000000).toFixed(1) : null;
    a14({
      phase: "fallback",
      stage: "encode-progress",
      progress: val7,
      message: val8 != null ? "Encoding video… " + val8 + '%' + (val9 ? '\x20(' + val9 + 's)' : '') : "Encoding video…"
    });
  };
  try {
    val5.on("progress", fn3);
  } catch {}
  let arr2 = [],
    val6 = null;
  try {
    let flag = false,
      val7 = null;
    if (a13) {
      if (typeof a12 != "function") {
        let error = new Error("Audio diminta tetapi tidak ada sumber campuran audio untuk FFmpeg.");
        throw error.audioFailure = true, error;
      }
      fn({
        phase: "fallback",
        stage: "audio",
        message: "Menyiapkan audio PCM…"
      });
      let val10;
      try {
        val10 = await a12();
      } catch (val11) {
        let error = new Error("Campuran audio gagal disiapkan untuk FFmpeg: " + (val11 && val11.message || val11));
        throw error.audioFailure = true, error.cause = val11, error;
      }
      if (!val10 || !val10.length) {
        let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
        throw error.audioFailure = true, error;
      }
      let res3 = uint8Array(val10);
      await val5.writeFile("audio.wav", res3), arr2.push("audio.wav"), flag = true, val7 = {
        packets: null,
        sampleRate: val10.sampleRate,
        channels: val10.numberOfChannels,
        seconds: val10.length / val10.sampleRate,
        bytes: res3.byteLength
      }, fn({
        phase: "audio",
        stage: 'ok',
        ...val7
      });
    }
    let arr3 = [],
      obj2 = {
        prepare: 0,
        render: 0,
        encode: 0,
        queue: 0
      },
      flag2 = false;
    for (let n2 = 0; n2 < max; n2++) {
      if (a15()) {
        flag2 = true;
        break;
      }
      let now3 = performance.now(),
        val10 = a6 + n2 * val4;
      a5 && (await a5(val10));
      let now4 = performance.now();
      a3(val10);
      a2 && a2.ctx && a2.canvas && a2.canvas !== a && a2.ctx.drawImage(a, 0, 0, a.width, a.height);
      let now5 = performance.now(),
        val11 = await render2(a2 && a2.canvas ? a2.canvas : a, a11),
        res3 = de(n2 + 1);
      await val5.writeFile(res3, val11), arr2.push(res3);
      let now6 = performance.now();
      obj2.prepare += now4 - now3, obj2.render += now5 - now4, obj2.encode += now6 - now5;
      let val12 = performance.now() - now3;
      arr3.push(val12), arr3.length > 60 && arr3.shift();
      let val13 = arr3.reduce((a16, b) => a16 + b, 0) / arr3.length;
      fn({
        phase: "render",
        frame: n2 + 1,
        msPerFrame: val12,
        avgMs: val13,
        minMs: Math.min(...arr3),
        maxMs: Math.max(...arr3),
        renderFps: 1000 / val13,
        etaMs: val13 * (max - n2 - 1),
        encodedBytes: val11.byteLength
      }), await new Promise(a16 => setTimeout(a16, 0));
    }
    if (flag2 || a15()) {
      try {
        val5.terminate();
      } catch {}
      apply();
      let obj4 = {
        status: "cancelled",
        cancelled: true,
        blob: null,
        codec: a9,
        width: val2,
        height: val3,
        fps: a7,
        frames: arr2.filter(a16 => a16.endsWith(".jpg")).length,
        mode: "ffmpeg",
        audio: null
      };
      return fn({
        phase: "batal",
        ...obj4
      }), obj4;
    }
    fn({
      phase: "fallback",
      stage: "encode",
      message: "Encoding…"
    });
    let res = process2({
      fps: a7,
      hasAudio: flag,
      codec: a9,
      crf: a10 || (a9 === "h265" ? 30 : 26)
    });
    val6 = new AbortController();
    let res2 = setInterval(() => {
        a15() && val6.abort();
      }, 100),
      n = 0,
      now2 = performance.now();
    try {
      n = await val5.exec(res, -1, {
        signal: val6.signal
      });
    } catch (val10) {
      if (clearInterval(res2), a15() || val10 && val10.name === "AbortError") {
        try {
          val5.terminate();
        } catch {}
        apply();
        let obj4 = {
          status: "cancelled",
          cancelled: true,
          blob: null,
          codec: a9,
          width: val2,
          height: val3,
          fps: a7,
          frames: max,
          mode: "ffmpeg",
          audio: null
        };
        return fn({
          phase: "batal",
          ...obj4
        }), obj4;
      }
      let res3 = update("FFmpeg gagal menjalankan encoding: " + (val10 && val10.message || val10), val10);
      throw flag && (res3.audioFailure = true), res3;
    }
    if (clearInterval(res2), obj2.queue += performance.now() - now2, n !== 0) {
      let res3 = update("FFmpeg keluar dengan kode " + n + '.\x20' + arr.slice(-4).join(" | "));
      throw flag && (res3.audioFailure = true), res3;
    }
    let val8;
    try {
      val8 = await val5.readFile("out.mp4");
    } catch (val10) {
      throw update("FFmpeg tidak menghasilkan file output: " + (val10 && val10.message || val10), val10);
    }
    let val9 = val8 instanceof Uint8Array ? val8 : new Uint8Array(val8);
    if (!val9 || val9.byteLength === 0) throw update("FFmpeg menghasilkan file MP4 kosong.");
    let blob = new Blob([val9], {
        type: "video/mp4"
      }),
      obj3 = {
        status: "success",
        cancelled: false,
        blob: blob,
        codec: a9,
        width: val2,
        height: val3,
        fps: a7,
        frames: max,
        mode: "ffmpeg",
        bitrate: a8,
        audio: val7,
        audioError: null,
        profile: Object.fromEntries(Object.entries(obj2).map(([a16, a17]) => [a16, a17 / Math.max(1, max)]))
      };
    return fn({
      phase: "selesai",
      ...obj3,
      bytes: blob.size
    }), obj3;
  } finally {
    try {
      val5.off("log", fn2);
    } catch {}
    try {
      val5.off("progress", fn3);
    } catch {}
    for (let val7 of [...arr2, "out.mp4"]) try {
      await val5.deleteFile(val7);
    } catch {}
  }
}
export { fe as DEFAULT_FFMPEG_CONFIG, Y as FFMPEG_CORE_VERSION, ue as FFMPEG_WRAPPER_VERSION, uint8Array as audioBufferToWav, process2 as buildFFmpegArgs, render2 as canvasToJpegBytes, updateClock as exportFramesFFmpeg, obj as ffmpegConfig, render as isFFmpegLoaded, handle as loadFFmpeg, apply2 as muxVideoWithAudioFFmpeg, build as preloadToBlobURL, apply as resetFFmpeg, compute as setFFmpegConfigForTests, process as setFFmpegModuleLoaderForTests };