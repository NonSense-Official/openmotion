var localValue = "0.12.10",
  textValue = "0.12.6",
  localRecord = {
    moduleURL: "/ffmpeg/index.js?v=" + localValue,
    coreURL: "/ffmpeg-core/ffmpeg-core.js?v=" + textValue,
    wasmURL: "/ffmpeg-core/ffmpeg-core.wasm?v=" + textValue
  };
function objHelper() {
  let objValue = typeof globalThis < 'u' && globalThis.AM_FFMPEG_CONFIG || {};
  return {
    ...localRecord,
    ...objValue
  };
}
var localText = null,
  loaded = null,
  localValueParsed = localArg => import(localArg),
  localValueRaw = null;
function process(processCondition) {
  localValueParsed = typeof processCondition == "function" ? processCondition : processRaw => import(processRaw);
}
function computeHelper(computeCondition) {
  localValueRaw = computeCondition || null;
}
function renderHelper() {
  return !!(loaded && loaded.loaded);
}
function applyHelper() {
  if (loaded) try {
    loaded.terminate();
  } catch {}
  loaded = null, localText = null;
}
function getHelper(getArg) {
  try {
    let getValue = typeof location < 'u' && location.href ? location.href : "http://localhost/";
    return new URL(getArg, getValue).href;
  } catch {
    return getArg;
  }
}
function updateHelper(updateArg, updateCondition) {
  let error = new Error(updateArg);
  return error.ffmpegFailure = true, updateCondition && (error.cause = updateCondition), error;
}
async function buildHelper(buildArg, {
  onProgress: buildCallback = () => {},
  stage: ffmpegWasm = "ffmpeg-download",
  label: buildText = "Mengunduh FFmpeg"
} = {}) {
  if (typeof fetch != "function" || typeof Blob > 'u' || typeof URL > 'u' || typeof URL.createObjectURL != "function") return buildArg;
  try {
    let ok = await fetch(buildArg, {
      cache: "force-cache"
    });
    if (!ok.ok || !ok.body || typeof ok.body.getReader != "function") return buildArg;
    let buildValue = Number(ok.headers.get("content-length")) || 0,
      getReader = ok.body.getReader(),
      buildItems = [],
      buildNumber = 0,
      buildHelperBuildValue = 0,
      buildValueRaw = 0;
    for (;;) {
      let {
        done: buildFlag,
        value: buildRaw
      } = await getReader.read();
      if (buildFlag) break;
      buildItems.push(buildRaw), buildNumber += buildRaw.length;
      let buildNow = Date.now(),
        buildParsed = buildValue ? Math.max(1, buildValue / 100) : 4 * 1048576;
      if (!buildFlag && buildNumber - buildHelperBuildValue < buildParsed && buildNow - buildValueRaw < 300) continue;
      buildHelperBuildValue = buildNumber, buildValueRaw = buildNow;
      let buildValueClamped = buildValue ? '\x20' + Math.round(buildNumber / buildValue * 100) + '%' : '',
        buildClamped = buildValue ? '\x20(' + (buildNumber / 1048576).toFixed(1) + '/' + (buildValue / 1048576).toFixed(1) + " MB)" : '';
      buildCallback({
        phase: "fallback",
        stage: ffmpegWasm,
        loaded: buildNumber,
        total: buildValue,
        message: '' + buildText + buildValueClamped + buildClamped
      });
    }
    let buildValueParsed = ffmpegWasm === "ffmpeg-wasm" ? "application/wasm" : "text/javascript";
    return URL.createObjectURL(new Blob(buildItems, {
      type: buildValueParsed
    }));
  } catch {
    return buildArg;
  }
}
async function handleHelper({
  onProgress: handleCallback = () => {}
} = {}) {
  return localText || (localText = (async () => {
    let handleResult = {
      ...objHelper(),
      ...(localValueRaw || {})
    };
    handleCallback({
      phase: "fallback",
      stage: "ffmpeg-load",
      message: "Memuat FFmpeg WASM..."
    });
    let fFmpeg;
    try {
      fFmpeg = await localValueParsed(handleResult.moduleURL);
    } catch (message) {
      throw localText = null, updateHelper("Gagal memuat modul FFmpeg (" + handleResult.moduleURL + "): " + (message && message.message || message), message);
    }
    let handleValue = fFmpeg && (fFmpeg.FFmpeg || fFmpeg.default && fFmpeg.default.FFmpeg || fFmpeg.default);
    if (typeof handleValue != "function") throw localText = null, updateHelper("Modul FFmpeg tidak mengekspor kelas FFmpeg.");
    let load = new handleValue(),
      handleItems = [];
    try {
      let handleHelperHandleValue = await buildHelper(getHelper(handleResult.coreURL), {
        onProgress: handleCallback,
        stage: "ffmpeg-core",
        label: "Mengunduh inti FFmpeg"
      });
      handleHelperHandleValue.startsWith("blob:") && handleItems.push(handleHelperHandleValue);
      let handleHelperValue = await buildHelper(getHelper(handleResult.wasmURL), {
        onProgress: handleCallback,
        stage: "ffmpeg-wasm",
        label: "Mengunduh WASM FFmpeg"
      });
      handleHelperValue.startsWith("blob:") && handleItems.push(handleHelperValue), await load.load({
        coreURL: handleHelperHandleValue,
        wasmURL: handleHelperValue
      });
    } catch (handleMessage) {
      throw localText = null, updateHelper("Gagal menginisialisasi FFmpeg WASM: " + (handleMessage && handleMessage.message || handleMessage), handleMessage);
    } finally {
      for (let handleValueRaw of handleItems) try {
        URL.revokeObjectURL(handleValueRaw);
      } catch {}
    }
    return loaded = load, handleCallback({
      phase: "fallback",
      stage: "ffmpeg-ready",
      message: "FFmpeg ready"
    }), load;
  })(), localText);
}
function processHelper({
  fps: processArg = 30,
  hasAudio: processHelperArg = false,
  codec: h265 = "h264",
  crf: processArgValue = 26,
  audioBitrate: processArgRaw = 128,
  preset: argRaw = "ultrafast"
} = {}) {
  let processHelperList = ["-hide_banner", "-loglevel", "error", "-framerate", String(processArg), '-i', "frame%06d.jpg"];
  return processHelperArg && processHelperList.push('-i', "audio.wav"), processHelperList.push("-c:v", h265 === "h265" ? "libx265" : "libx264"), processHelperList.push("-preset", argRaw, "-crf", String(processArgValue), "-pix_fmt", "yuv420p"), h265 === "h265" && processHelperList.push("-tag:v", "hvc1"), processHelperArg && processHelperList.push("-c:a", "aac", "-b:a", Math.round(processArgRaw) + 'k', "-shortest"), processHelperList.push("-movflags", "+faststart", "out.mp4"), processHelperList;
}
function uintArrayHelper(numberOfChannels) {
  let uintArrayNumberOfChannels = numberOfChannels.numberOfChannels,
    sampleRate = numberOfChannels.sampleRate,
    uintArrayValueRaw = numberOfChannels.length,
    uintArrayNumber = 2,
    uintArrayRaw = uintArrayNumberOfChannels * uintArrayNumber,
    uint8ArrayValue2 = uintArrayValueRaw * uintArrayRaw,
    arrayBuffer = new ArrayBuffer(44 + uint8ArrayValue2),
    dataView = new DataView(arrayBuffer),
    uintArrayValue = (fnText, charCodeAt) => {
      for (let fnNumber = 0; fnNumber < charCodeAt.length; fnNumber++) dataView.setUint8(fnText + fnNumber, charCodeAt.charCodeAt(fnNumber));
    };
  uintArrayValue(0, "RIFF"), dataView.setUint32(4, 36 + uint8ArrayValue2, true), uintArrayValue(8, "WAVE"), uintArrayValue(12, "fmt "), dataView.setUint32(16, 16, true), dataView.setUint16(20, 1, true), dataView.setUint16(22, uintArrayNumberOfChannels, true), dataView.setUint32(24, sampleRate, true), dataView.setUint32(28, sampleRate * uintArrayRaw, true), dataView.setUint16(32, uintArrayRaw, true), dataView.setUint16(34, 8 * uintArrayNumber, true), uintArrayValue(36, "data"), dataView.setUint32(40, uint8ArrayValue2, true);
  let uintArrayList = [];
  for (let uint8ArrayNumber3 = 0; uint8ArrayNumber3 < uintArrayNumberOfChannels; uint8ArrayNumber3++) uintArrayList.push(numberOfChannels.getChannelData(uint8ArrayNumber3));
  let intArray = new Int16Array(arrayBuffer, 44, uintArrayValueRaw * uintArrayNumberOfChannels),
    uint8ArrayNumber2 = 0;
  for (let uint8ArrayNumber4 = 0; uint8ArrayNumber4 < uintArrayValueRaw; uint8ArrayNumber4++) for (let uint8ArrayNumber5 = 0; uint8ArrayNumber5 < uintArrayNumberOfChannels; uint8ArrayNumber5++) {
    let uint8ArrayValue3 = Math.max(-1, Math.min(1, uintArrayList[uint8ArrayNumber5][uint8ArrayNumber4] || 0));
    intArray[uint8ArrayNumber2++] = uint8ArrayValue3 < 0 ? uint8ArrayValue3 * 32768 | 0 : uint8ArrayValue3 * 32767 | 0;
  }
  return new Uint8Array(arrayBuffer);
}
async function fail(toBlob, renderArg = 0.85) {
  if (typeof toBlob.toBlob == "function") {
    let renderArrayBuffer = await new Promise((failArg, renderArgValue) => {
      toBlob.toBlob(failFlag => failFlag ? failArg(failFlag) : renderArgValue(new Error("toBlob menghasilkan null")), "image/jpeg", renderArg);
    });
    return new Uint8Array(await renderArrayBuffer.arrayBuffer());
  }
  if (typeof toBlob.convertToBlob == "function") {
    let arrayBufferValue = await toBlob.convertToBlob({
      type: "image/jpeg",
      quality: renderArg
    });
    return new Uint8Array(await arrayBufferValue.arrayBuffer());
  }
  throw new Error("Canvas tidak mendukung toBlob/convertToBlob untuk frame JPEG.");
}
var localRaw = deValue => "frame" + String(deValue).padStart(6, '0') + ".jpg",
  localNumber = 40;
async function applyHelperValue({
  videoBytes: applyHelperValueArg,
  videoCodec: applyArgValue = "h264",
  width: argParsed,
  height: applyArgClamped,
  fps: applyArgRaw = 30,
  frames: applyRaw = null,
  renderAudio: applyHelperValueArgValue,
  onProgress: applyArg = () => {},
  isCancelled: applyArgParsed = () => false
}) {
  let applyOn = await handleHelper({
      onProgress: applyHelperValueArgRaw => applyArg(applyHelperValueArgRaw)
    }),
    applyHelperValueList = [],
    applyHelperValueApplyValue = fnCondition => {
      applyHelperValueList.push(fnCondition && fnCondition.message ? String(fnCondition.message) : String(fnCondition || '')), applyHelperValueList.length > localNumber && applyHelperValueList.shift();
    };
  try {
    applyOn.on("log", applyHelperValueApplyValue);
  } catch {}
  let applyValueRaw = applyHelperValueProgress => {
    let applyValue = applyHelperValueProgress && typeof applyHelperValueProgress.progress == "number" ? applyHelperValueProgress.progress : null,
      applyValueParsed = applyValue != null ? Math.min(100, Math.max(0, Math.round(applyValue * 100))) : null;
    applyArg({
      phase: "fallback",
      stage: "encode-progress",
      progress: applyValue,
      message: applyValueParsed != null ? "Menggabungkan audio… " + applyValueParsed + '%' : "Menggabungkan audio…"
    });
  };
  try {
    applyOn.on("progress", applyValueRaw);
  } catch {}
  let applyList = [];
  try {
    if (applyArg({
      phase: "fallback",
      stage: "hybrid",
      message: "Menggabungkan video WebCodecs + audio FFmpeg (mode cepat)…"
    }), await applyOn.writeFile("video.mp4", applyHelperValueArg instanceof Uint8Array ? applyHelperValueArg : new Uint8Array(applyHelperValueArg)), applyList.push("video.mp4"), typeof applyHelperValueArgValue != "function") {
      let error = new Error("Audio diminta tetapi tidak ada sumber campuran audio.");
      throw error.audioFailure = true, error;
    }
    let applySampleRate;
    try {
      applySampleRate = await applyHelperValueArgValue();
    } catch (applyParsed) {
      let error = new Error("Campuran audio gagal disiapkan: " + (applyParsed && applyParsed.message || applyParsed));
      throw error.audioFailure = true, error;
    }
    if (!applySampleRate || !applySampleRate.length) {
      let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
      throw error.audioFailure = true, error;
    }
    let uintArray = uintArrayHelper(applySampleRate);
    await applyOn.writeFile("audio.wav", uintArray), applyList.push("audio.wav");
    let applyHelperValueRecord = {
      packets: null,
      sampleRate: applySampleRate.sampleRate,
      channels: applySampleRate.numberOfChannels,
      seconds: applySampleRate.length / applySampleRate.sampleRate,
      bytes: uintArray.byteLength
    };
    applyArg({
      phase: "audio",
      stage: 'ok',
      ...applyHelperValueRecord
    });
    let listValue = ["-hide_banner", "-loglevel", "error", '-i', "video.mp4", '-i', "audio.wav", "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", "out.mp4"],
      abortController = new AbortController(),
      applyHelperValueResult = setInterval(() => {
        applyArgParsed() && abortController.abort();
      }, 100),
      applyHelperValueNumber = 0;
    try {
      applyHelperValueNumber = await applyOn.exec(listValue, -1, {
        signal: abortController.signal
      });
    } catch (applyMessage) {
      if (clearInterval(applyHelperValueResult), applyArgParsed() || applyMessage && applyMessage.name === "AbortError") {
        try {
          applyOn.terminate();
        } catch {}
        applyHelper();
        let recordValue = {
          status: "cancelled",
          cancelled: true,
          blob: null,
          codec: applyArgValue,
          width: argParsed,
          height: applyArgClamped,
          fps: applyArgRaw,
          frames: applyRaw,
          mode: "hybrid",
          audio: null
        };
        return applyArg({
          phase: "batal",
          ...recordValue
        }), recordValue;
      }
      let applyUpdate = updateHelper("FFmpeg gagal memux audio: " + (applyMessage && applyMessage.message || applyMessage), applyMessage);
      throw applyUpdate.audioFailure = true, applyUpdate;
    }
    if (clearInterval(applyHelperValueResult), applyHelperValueNumber !== 0) {
      let updateValue = updateHelper("FFmpeg keluar dengan kode " + applyHelperValueNumber + '.\x20' + applyHelperValueList.slice(-4).join(" | "));
      throw updateValue.audioFailure = true, updateValue;
    }
    let applyHelperValueFlag;
    try {
      applyHelperValueFlag = await applyOn.readFile("out.mp4");
    } catch (messageValue) {
      throw updateHelper("FFmpeg tidak menghasilkan output: " + (messageValue && messageValue.message || messageValue), messageValue);
    }
    let byteLength = applyHelperValueFlag instanceof Uint8Array ? applyHelperValueFlag : new Uint8Array(applyHelperValueFlag);
    if (!byteLength || !byteLength.byteLength) throw updateHelper("FFmpeg menghasilkan MP4 kosong.");
    let blob = new Blob([byteLength], {
        type: "video/mp4"
      }),
      applyRecord = {
        status: "success",
        cancelled: false,
        blob: blob,
        codec: applyArgValue,
        width: argParsed,
        height: applyArgClamped,
        fps: applyArgRaw,
        frames: applyRaw,
        mode: "hybrid",
        bitrate: null,
        audio: applyHelperValueRecord,
        audioError: null
      };
    return applyArg({
      phase: "selesai",
      ...applyRecord,
      bytes: blob.size
    }), applyRecord;
  } finally {
    try {
      applyOn.off("log", applyHelperValueApplyValue);
    } catch {}
    try {
      applyOn.off("progress", applyValueRaw);
    } catch {}
    for (let applyValueClamped of [...applyList, "out.mp4"]) try {
      await applyOn.deleteFile(applyValueClamped);
    } catch {}
  }
}
async function updateClock({
  canvas: updateClockCondition,
  snapshot: canvas,
  renderFrame: updateClockCallback,
  prepareFrame: updateClockArgRaw = null,
  startMs: updateClockText = 0,
  endMs: updateClockValue,
  fps: updateClockArg = 30,
  bitrate: updateClockArgClamped = 6000000,
  codec: updateClockH = "h264",
  crf: argClamped = null,
  jpegQuality: updateClockArgScoped = 0.85,
  renderAudio: updateClockArgParsed = null,
  audioRequested: flagArg = false,
  onProgress: argValue = () => {},
  isCancelled: updateClockArgValue = () => false
}) {
  let valueStart = updateClockCondition.width - updateClockCondition.width % 2,
    updateClockValueRaw = updateClockCondition.height - updateClockCondition.height % 2,
    updateClockParsed = 1000 / updateClockArg,
    updateClockMax = Math.max(1, Math.round((updateClockValue - updateClockText) / updateClockParsed) + 1),
    valueOuter = performance.now(),
    updateClockData = argScoped => argValue({
      total: updateClockMax,
      elapsedMs: performance.now() - valueOuter,
      ...argScoped
    }),
    ffmpegModule = await handleHelper({
      onProgress: updateClockArgInner => updateClockData(updateClockArgInner)
    });
  argValue({
    phase: "fallback",
    stage: "ffmpeg",
    message: "Menggunakan FFmpeg WASM sebagai fallback audio/video."
  });
  let updateClockItems = [],
    updateClockValueClamped = messageArg => {
      let updateClockOuter = messageArg && messageArg.message ? String(messageArg.message) : String(messageArg || '');
      updateClockItems.push(updateClockOuter), updateClockItems.length > localNumber && updateClockItems.shift();
    };
  try {
    ffmpegModule.on("log", updateClockValueClamped);
  } catch {}
  let valueClamped = progress => {
    let valueRaw = progress && typeof progress.progress == "number" ? progress.progress : null,
      updateClockClamped = valueRaw != null ? Math.min(100, Math.max(0, Math.round(valueRaw * 100))) : null,
      updateClockValueScoped = progress && typeof progress.time == "number" ? (progress.time / 1000000).toFixed(1) : null;
    argValue({
      phase: "fallback",
      stage: "encode-progress",
      progress: valueRaw,
      message: updateClockClamped != null ? "Encoding video… " + updateClockClamped + '%' + (updateClockValueScoped ? '\x20(' + updateClockValueScoped + 's)' : '') : "Encoding video…"
    });
  };
  try {
    ffmpegModule.on("progress", valueClamped);
  } catch {}
  let updateClockList = [],
    abort = null;
  try {
    let updateClockFlag = false,
      updateClockRaw = null;
    if (flagArg) {
      if (typeof updateClockArgParsed != "function") {
        let error = new Error("Audio diminta tetapi tidak ada sumber campuran audio untuk FFmpeg.");
        throw error.audioFailure = true, error;
      }
      updateClockData({
        phase: "fallback",
        stage: "audio",
        message: "Menyiapkan audio PCM…"
      });
      let updateClockSampleRate;
      try {
        updateClockSampleRate = await updateClockArgParsed();
      } catch (cause) {
        let error = new Error("Campuran audio gagal disiapkan untuk FFmpeg: " + (cause && cause.message || cause));
        throw error.audioFailure = true, error.cause = cause, error;
      }
      if (!updateClockSampleRate || !updateClockSampleRate.length) {
        let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
        throw error.audioFailure = true, error;
      }
      let updateClockUintArray = uintArrayHelper(updateClockSampleRate);
      await ffmpegModule.writeFile("audio.wav", updateClockUintArray), updateClockList.push("audio.wav"), updateClockFlag = true, updateClockRaw = {
        packets: null,
        sampleRate: updateClockSampleRate.sampleRate,
        channels: updateClockSampleRate.numberOfChannels,
        seconds: updateClockSampleRate.length / updateClockSampleRate.sampleRate,
        bytes: updateClockUintArray.byteLength
      }, updateClockData({
        phase: "audio",
        stage: 'ok',
        ...updateClockRaw
      });
    }
    let updateClockValueStart = [],
      updateClockResult = {
        prepare: 0,
        render: 0,
        encode: 0,
        queue: 0
      },
      valueScoped = false;
    for (let numberValue = 0; numberValue < updateClockMax; numberValue++) {
      if (updateClockArgValue()) {
        valueScoped = true;
        break;
      }
      let updateClockNow = performance.now(),
        updateClockScoped = updateClockText + numberValue * updateClockParsed;
      updateClockArgRaw && (await updateClockArgRaw(updateClockScoped));
      let nowValue = performance.now();
      updateClockCallback(updateClockScoped);
      canvas && canvas.ctx && canvas.canvas && canvas.canvas !== updateClockCondition && canvas.ctx.drawImage(updateClockCondition, 0, 0, updateClockCondition.width, updateClockCondition.height);
      let updateClockValueLocal = performance.now(),
        byteLengthValue = await fail(canvas && canvas.canvas ? canvas.canvas : updateClockCondition, updateClockArgScoped),
        callbackValue = localRaw(numberValue + 1);
      await ffmpegModule.writeFile(callbackValue, byteLengthValue), updateClockList.push(callbackValue);
      let valueInner = performance.now();
      updateClockResult.prepare += nowValue - updateClockNow, updateClockResult.render += updateClockValueLocal - nowValue, updateClockResult.encode += valueInner - updateClockValueLocal;
      let valueLocal = performance.now() - updateClockNow;
      updateClockValueStart.push(valueLocal), updateClockValueStart.length > 60 && updateClockValueStart.shift();
      let updateClockValueParsed = updateClockValueStart.reduce((argInner, updateClockArgLocal) => argInner + updateClockArgLocal, 0) / updateClockValueStart.length;
      updateClockData({
        phase: "render",
        frame: numberValue + 1,
        msPerFrame: valueLocal,
        avgMs: updateClockValueParsed,
        minMs: Math.min(...updateClockValueStart),
        maxMs: Math.max(...updateClockValueStart),
        renderFps: 1000 / updateClockValueParsed,
        etaMs: updateClockValueParsed * (updateClockMax - numberValue - 1),
        encodedBytes: byteLengthValue.byteLength
      }), await new Promise(argLocal => setTimeout(argLocal, 0));
    }
    if (valueScoped || updateClockArgValue()) {
      try {
        ffmpegModule.terminate();
      } catch {}
      applyHelper();
      let updateClockLocal = {
        status: "cancelled",
        cancelled: true,
        blob: null,
        codec: updateClockH,
        width: valueStart,
        height: updateClockValueRaw,
        fps: updateClockArg,
        frames: updateClockList.filter(updateClockArgOuter => updateClockArgOuter.endsWith(".jpg")).length,
        mode: "ffmpeg",
        audio: null
      };
      return updateClockData({
        phase: "batal",
        ...updateClockLocal
      }), updateClockLocal;
    }
    updateClockData({
      phase: "fallback",
      stage: "encode",
      message: "Encoding…"
    });
    let updateClockProcess = processHelper({
      fps: updateClockArg,
      hasAudio: updateClockFlag,
      codec: updateClockH,
      crf: argClamped || (updateClockH === "h265" ? 30 : 26)
    });
    abort = new AbortController();
    let updateClockSetInterval = setInterval(() => {
        updateClockArgValue() && abort.abort();
      }, 100),
      updateClockNumber = 0,
      updateClockValueInner = performance.now();
    try {
      updateClockNumber = await ffmpegModule.exec(updateClockProcess, -1, {
        signal: abort.signal
      });
    } catch (updateClockMessage) {
      if (clearInterval(updateClockSetInterval), updateClockArgValue() || updateClockMessage && updateClockMessage.name === "AbortError") {
        try {
          ffmpegModule.terminate();
        } catch {}
        applyHelper();
        let updateClockValueOuter = {
          status: "cancelled",
          cancelled: true,
          blob: null,
          codec: updateClockH,
          width: valueStart,
          height: updateClockValueRaw,
          fps: updateClockArg,
          frames: updateClockMax,
          mode: "ffmpeg",
          audio: null
        };
        return updateClockData({
          phase: "batal",
          ...updateClockValueOuter
        }), updateClockValueOuter;
      }
      let updateClockUpdate = updateHelper("FFmpeg gagal menjalankan encoding: " + (updateClockMessage && updateClockMessage.message || updateClockMessage), updateClockMessage);
      throw updateClockFlag && (updateClockUpdate.audioFailure = true), updateClockUpdate;
    }
    if (clearInterval(updateClockSetInterval), updateClockResult.queue += performance.now() - updateClockValueInner, updateClockNumber !== 0) {
      let audioFailure = updateHelper("FFmpeg keluar dengan kode " + updateClockNumber + '.\x20' + updateClockItems.slice(-4).join(" | "));
      throw updateClockFlag && (audioFailure.audioFailure = true), audioFailure;
    }
    let flagValue;
    try {
      flagValue = await ffmpegModule.readFile("out.mp4");
    } catch (valueParsed) {
      throw updateHelper("FFmpeg tidak menghasilkan file output: " + (valueParsed && valueParsed.message || valueParsed), valueParsed);
    }
    let updateClockByteLength = flagValue instanceof Uint8Array ? flagValue : new Uint8Array(flagValue);
    if (!updateClockByteLength || updateClockByteLength.byteLength === 0) throw updateHelper("FFmpeg menghasilkan file MP4 kosong.");
    let blob = new Blob([updateClockByteLength], {
        type: "video/mp4"
      }),
      updateClockRecord = {
        status: "success",
        cancelled: false,
        blob: blob,
        codec: updateClockH,
        width: valueStart,
        height: updateClockValueRaw,
        fps: updateClockArg,
        frames: updateClockMax,
        mode: "ffmpeg",
        bitrate: updateClockArgClamped,
        audio: updateClockRaw,
        audioError: null,
        profile: Object.fromEntries(Object.entries(updateClockResult).map(([argOuter, updateClockArgStart]) => [argOuter, updateClockArgStart / Math.max(1, updateClockMax)]))
      };
    return updateClockData({
      phase: "selesai",
      ...updateClockRecord,
      bytes: blob.size
    }), updateClockRecord;
  } finally {
    try {
      ffmpegModule.off("log", updateClockValueClamped);
    } catch {}
    try {
      ffmpegModule.off("progress", valueClamped);
    } catch {}
    for (let updateClockInner of [...updateClockList, "out.mp4"]) try {
      await ffmpegModule.deleteFile(updateClockInner);
    } catch {}
  }
}
export { localRecord as DEFAULT_FFMPEG_CONFIG, textValue as FFMPEG_CORE_VERSION, localValue as FFMPEG_WRAPPER_VERSION, uintArrayHelper as audioBufferToWav, processHelper as buildFFmpegArgs, fail as canvasToJpegBytes, updateClock as exportFramesFFmpeg, objHelper as ffmpegConfig, renderHelper as isFFmpegLoaded, handleHelper as loadFFmpeg, applyHelperValue as muxVideoWithAudioFFmpeg, buildHelper as preloadToBlobURL, applyHelper as resetFFmpeg, computeHelper as setFFmpegConfigForTests, process as setFFmpegModuleLoaderForTests };