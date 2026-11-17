import { applyHelperOuter, expbitrateEl, expbitratelaEl, expcodecEl, localKind, localMax, localValueKind, localValueSecondary, valueType } from './state.js';
import { smoothstep } from './parser-value.js';
import { buildHelperInner, handleFail, updateHelperStart } from './render-canvas.js';
import { objHelperInner } from './engine-core.js';
function objHelperClamped() {
  return {
    webcodecs: typeof globalThis.VideoEncoder == "function" && typeof globalThis.VideoFrame == "function",
    mediaRecorder: typeof globalThis.MediaRecorder == "function",
    audioEncoder: typeof globalThis.AudioEncoder == "function" && typeof globalThis.AudioData == "function" && typeof globalThis.OfflineAudioContext == "function"
  };
}
async function helperInner({
  width: updateArgMax,
  height: updateArgByKey,
  bitrate: updateArgByIndex,
  fps: updateArgEl
}) {
  for (let codec of localValueKind) {
    let helperInnerRecord = {
      codec: codec.codec,
      width: updateArgMax,
      height: updateArgByKey,
      bitrate: updateArgByIndex,
      framerate: updateArgEl,
      latencyMode: "realtime",
      hardwareAcceleration: "prefer-hardware",
      avc: {
        format: "avc"
      }
    };
    try {
      let supported = await VideoEncoder.isConfigSupported(helperInnerRecord);
      if (supported && supported.supported) return {
        ...codec,
        config: helperInnerRecord
      };
    } catch {}
  }
  return null;
}
async function objHelperOuter({
  sampleRate: objArgMin = localMax,
  bitrate: objArgMax = 128000,
  channels: objArgByKey = 2
} = {}) {
  if (typeof globalThis.AudioEncoder != "function") return {
    ok: false,
    reason: "AudioEncoder tidak ada di browser ini"
  };
  let objValueTertiary = [objArgMin, 48000, 44100, 32000, 24000, 22050, 16000].filter((objArgOutput, objArgPrimary, objArgSecondary) => objArgSecondary.indexOf(objArgOutput) === objArgPrimary);
  for (let objNext of objValueTertiary) for (let objValuePrev of [objArgByKey, 2, 1].filter((objHelperOuterArg, objArgTertiary, objArgExtra) => objArgExtra.indexOf(objHelperOuterArg) === objArgTertiary)) {
    let objHelperOuterRecord = {
      codec: "mp4a.40.2",
      sampleRate: objNext,
      numberOfChannels: objValuePrev,
      bitrate: Math.round(objArgMax),
      aac: {
        format: "aac"
      }
    };
    try {
      let objSupported = await AudioEncoder.isConfigSupported(objHelperOuterRecord);
      if (objSupported && objSupported.supported) return {
        ok: true,
        config: objSupported.config || objHelperOuterRecord,
        sampleRate: objNext,
        channels: objValuePrev
      };
    } catch {}
  }
  return {
    ok: false,
    reason: "AudioEncoder menolak AAC di semua kombinasi sample rate / channel"
  };
}
async function handleHelperInner({
  width: handleArgRaw = 0,
  height: handleArgParsed = 0,
  bitrate: handleArgClamped = 6000000,
  fps: handleArgScoped = 30,
  needAudio: handleHelperInnerFlag = false
} = {}) {
  let handleWebcodecs = objHelperClamped(),
    handleHelperInnerRecord = {
      mode: "none",
      video: {
        ok: false,
        codec: null,
        reason: ''
      },
      audio: {
        ok: !handleHelperInnerFlag,
        needed: !!handleHelperInnerFlag,
        reason: ''
      },
      reason: ''
    };
  if (handleWebcodecs.webcodecs) {
    let handleId = await helperInner({
      width: handleArgRaw,
      height: handleArgParsed,
      bitrate: handleArgClamped,
      fps: handleArgScoped
    });
    handleId ? (handleHelperInnerRecord.mode = "webcodecs", handleHelperInnerRecord.video = {
      ok: true,
      codec: handleId.id,
      config: handleId.config
    }) : handleHelperInnerRecord.video = {
      ok: false,
      codec: null,
      reason: "tidak ada profil H.264 yang didukung encoder perangkat ini"
    };
  } else handleHelperInnerRecord.video = {
    ok: false,
    codec: null,
    reason: "WebCodecs (VideoEncoder/VideoFrame) tidak ada"
  };
  if (handleHelperInnerFlag) {
    if (!handleWebcodecs.audioEncoder) handleHelperInnerRecord.audio = {
      ok: false,
      needed: true,
      reason: "WebCodecs audio (AudioEncoder/AudioData/OfflineAudioContext) tidak ada"
    };else {
      let ok = await objHelperOuter({
        bitrate: 128000
      });
      handleHelperInnerRecord.audio = ok.ok ? {
        ok: true,
        needed: true,
        config: ok.config,
        sampleRate: ok.sampleRate,
        channels: ok.channels
      } : {
        ok: false,
        needed: true,
        reason: ok.reason
      };
    }
  }
  return handleHelperInnerRecord.audioRequestedButUnavailable = handleHelperInnerFlag && !handleHelperInnerRecord.audio.ok, handleHelperInnerRecord.video.ok ? handleHelperInnerRecord.mode = "webcodecs" : handleWebcodecs.mediaRecorder ? handleHelperInnerRecord.mode = "mediarecorder" : handleHelperInnerRecord.mode = "none", handleHelperInnerRecord.mode === "none" && (handleHelperInnerRecord.reason = handleHelperInnerRecord.video.reason || "tidak ada jalur ekspor video yang didukung browser ini"), handleHelperInnerRecord;
}
async function failHelper(decodeAudioData, failHelperArgValue, failHelperArg = () => {}, {
  quick: failHelperFlag = false
} = {}) {
  let refOk = await fetch(failHelperArgValue);
  if (!refOk.ok) throw new Error("gagal memuat audio: HTTP " + refOk.status);
  let refByteLength = await refOk.arrayBuffer();
  failHelperArg({
    phase: "audio",
    stage: "decode",
    bytes: refByteLength.byteLength
  });
  {
    let failHelperUintArray = new Uint8Array(refByteLength.slice(0, 12)),
      refValueConverted = Array.from(failHelperUintArray).map(refArgScoped => refArgScoped >= 32 && refArgScoped < 127 ? String.fromCharCode(refArgScoped) : '.').join('');
    failHelperArg({
      phase: "audio",
      stage: "fallback",
      message: "sumber " + String(failHelperArgValue).slice(-60) + " | " + (refOk.headers.get("content-type") || '?') + " | " + refByteLength.byteLength + " B | header \"" + refValueConverted + '\x22'
    });
  }
  let copyToChannel;
  try {
    copyToChannel = await decodeAudioData.decodeAudioData(refByteLength.slice(0));
  } catch (refMessage) {
    failHelperArg({
      phase: "audio",
      stage: "fallback",
      message: "decodeAudioData gagal, coba demux Mediabunny: " + String(refMessage && refMessage.message || refMessage)
    });
    let refInput = await applyHelperOuter(),
      canDecode = await new refInput.Input({
        source: new refInput.BlobSource(new Blob([refByteLength])),
        formats: refInput.ALL_FORMATS
      }).getPrimaryAudioTrack();
    if (!canDecode) throw new Error("file ini tidak punya track audio");
    if (failHelperFlag) {
      if (typeof canDecode.canDecode == "function" && !(await canDecode.canDecode())) throw new Error("codec audio \"" + (canDecode.codec || '?') + "\" tidak didukung decoder perangkat ini (" + String(refMessage && refMessage.message || refMessage) + ')');
      let refBuffers = new refInput.AudioBufferSink(canDecode);
      for await (let bufferValue of refBuffers.buffers()) if (bufferValue && bufferValue.buffer) break;
      return null;
    }
    let buffers = new refInput.AudioBufferSink(canDecode),
      failHelperList = [],
      failHelperNumber = 0,
      refList = 0,
      refValueMap = 0;
    for await (let refConverted of buffers.buffers()) {
      let refBuffer = refConverted.buffer;
      refList || (refList = refBuffer.sampleRate, refValueMap = refBuffer.numberOfChannels), failHelperList.push(refBuffer), failHelperNumber += refBuffer.length;
    }
    if (!failHelperNumber) throw new Error("track audio kosong");
    copyToChannel = decodeAudioData.createBuffer(refValueMap, failHelperNumber, refList);
    let refAlternate = 0;
    for (let refGetChannelData of failHelperList) {
      for (let refValueMax = 0; refValueMax < refValueMap; refValueMax++) copyToChannel.copyToChannel(refGetChannelData.getChannelData(Math.min(refValueMax, refGetChannelData.numberOfChannels - 1)), refValueMax, refAlternate);
      refAlternate += refGetChannelData.length;
    }
  }
  return copyToChannel;
}
async function objFail({
  url: objExtra,
  tracks: objArgTotal = null,
  startMs: objArgByIndex = 0,
  endMs: objArgCurrent,
  rate: objArgNext = 1,
  offsetMs: objArgPrev = 0,
  inTimeMs: objArgSource = 0,
  sampleRate: objArgClamped = localMax,
  bitrate: objArgEl = 128000,
  onProgress: objFailArg = () => {}
}) {
  if (typeof globalThis.AudioEncoder != "function" || typeof globalThis.AudioData != "function") throw new Error("WebCodecs audio (AudioEncoder) tidak ada di browser ini");
  let objFailNumber = 2,
    objPrev = Math.max(0, (objArgCurrent - objArgByIndex) / 1000),
    objBuffer = await smoothstep({
      url: objExtra,
      tracks: objArgTotal,
      startMs: objArgByIndex,
      endMs: objArgCurrent,
      rate: objArgNext,
      offsetMs: objArgPrev,
      inTimeMs: objArgSource,
      sampleRate: objArgClamped,
      channels: objFailNumber,
      onProgress: objFailArg
    }),
    objOk = await objHelperOuter({
      sampleRate: objArgClamped,
      bitrate: objArgEl,
      channels: objFailNumber
    });
  if (!objOk || !objOk.ok) throw new Error("AudioEncoder menolak AAC di semua kombinasi sample rate / channel.");
  let sampleRate = objOk.sampleRate,
    channels = objOk.channels,
    objGetChannelData = objBuffer;
  if (sampleRate !== objArgClamped || channels !== objFailNumber) {
    let offlineAudioContext = new OfflineAudioContext(channels, Math.round(objPrev * sampleRate), sampleRate),
      createBufferSource = offlineAudioContext.createBufferSource();
    createBufferSource.buffer = objBuffer, createBufferSource.connect(offlineAudioContext.destination), createBufferSource.start(0), objGetChannelData = await offlineAudioContext.startRendering();
  }
  let objValueInner = sampleRate,
    objScoped = channels,
    objFailList = [],
    objText = null,
    audioEncoder = new AudioEncoder({
      output: (objArgAlternate, objAlternate) => {
        objFailList.push({
          chunk: objArgAlternate,
          metadata: objAlternate
        });
      },
      error: objArgOther => {
        objText = objArgOther;
      }
    });
  audioEncoder.configure(objOk.config || {
    codec: "mp4a.40.2",
    sampleRate: objValueInner,
    numberOfChannels: objScoped,
    bitrate: Math.round(objArgEl),
    aac: {
      format: "aac"
    }
  });
  let objValueByIndex = Math.max(1024, Math.round(objValueInner / 12)),
    objValueSource = [];
  for (let objByIndex = 0; objByIndex < objScoped; objByIndex++) objValueSource.push(objGetChannelData.getChannelData(objByIndex));
  try {
    for (let objNumber = 0; objNumber < objGetChannelData.length; objNumber += objValueByIndex) {
      if (objText) throw objText;
      let objFailMin = Math.min(objValueByIndex, objGetChannelData.length - objNumber),
        objFailFloatArray = new Float32Array(objFailMin * objScoped);
      for (let objInner = 0; objInner < objScoped; objInner++) objFailFloatArray.set(objValueSource[objInner].subarray(objNumber, objNumber + objFailMin), objInner * objFailMin);
      let audioData = new AudioData({
        format: "f32-planar",
        sampleRate: objValueInner,
        numberOfFrames: objFailMin,
        numberOfChannels: objScoped,
        timestamp: Math.round(objNumber / objValueInner * 1000000),
        data: objFailFloatArray
      });
      for (audioEncoder.encode(audioData), audioData.close(); audioEncoder.encodeQueueSize > 32;) if (await localValueSecondary(2), objText) throw objText;
      objNumber / objValueByIndex % 25 === 0 && objFailArg({
        phase: "audio",
        stage: "encode",
        frames: objNumber + objFailMin,
        total: objGetChannelData.length,
        packets: objFailList.length
      });
    }
    await audioEncoder.flush();
  } finally {
    try {
      audioEncoder.close();
    } catch {}
  }
  if (objText) throw objText;
  if (!objFailList.length) throw new Error("encoder AAC tidak menghasilkan paket audio");
  return {
    packets: objFailList,
    sampleRate: objValueInner,
    channels: objScoped,
    seconds: objPrev
  };
}
function handleParsed(handleParsedFlag) {
  return handleParsedFlag ? handleParsedFlag.cancelled || handleParsedFlag.name === "AbortError" || handleParsedFlag.name === "CancelledError" ? "cancelled" : handleParsedFlag.audioFailure ? "audio" : handleParsedFlag.codecFailure ? "codec" : handleParsedFlag.muxFailure ? "mux" : handleParsedFlag.ffmpegFailure ? "ffmpeg" : handleParsedFlag.renderFailure ? "renderer" : "unknown" : "unknown";
}
function processHelperMin(processHelperMinArg, {
  audioRequested: processArgOuter = false
} = {}) {
  switch (handleParsed(processHelperMinArg)) {
    case "audio":
    case "codec":
    case "mux":
      return true;
    default:
      return false;
  }
}
function refHelperRaw(codecFailure) {
  if (codecFailure && typeof codecFailure == "object" && !codecFailure.codecFailure && !codecFailure.audioFailure && !codecFailure.muxFailure) try {
    codecFailure.codecFailure = true;
  } catch {}
  return codecFailure;
}
async function renderFail({
  canvas: renderWidth,
  renderFrame: renderFailArgValue,
  prepareFrame: renderArgRaw = null,
  startMs: renderFailArg = 0,
  endMs: renderArgStart,
  fps: renderArg = 30,
  bitrate: renderArgValue = 6000000,
  onProgress: renderArgParsed = () => {},
  isCancelled: renderArgClamped = () => false,
  keyFrameEverySec: renderArgEnd = 2,
  audio: renderFailUrl = null
}) {
  let renderFailValue = renderWidth.width - renderWidth.width % 2,
    renderValueRaw = renderWidth.height - renderWidth.height % 2,
    renderRaw = 1000 / renderArg,
    renderMax = Math.max(1, Math.round((renderArgStart - renderFailArg) / renderRaw) + 1),
    renderWebcodecs = objHelperClamped(),
    renderValueList = updateHelperStart(renderFailValue, renderValueRaw, renderWidth),
    renderList = !!(renderFailUrl && (renderFailUrl.url || Array.isArray(renderFailUrl.tracks) && renderFailUrl.tracks.length)),
    renderNext = performance.now(),
    renderFailRenderValue = renderArgMap => renderArgParsed({
      total: renderMax,
      elapsedMs: performance.now() - renderNext,
      ...renderArgMap
    });
  if (!renderWebcodecs.webcodecs) {
    if (renderList) throw new Error("Ekspor audio butuh WebCodecs (VideoEncoder + AudioEncoder). Browser ini tidak punya WebCodecs, dan mode MediaRecorder tidak bisa menyertakan audio. Pilih ekspor video saja, atau pakai browser yang mendukung WebCodecs.");
    renderFailRenderValue({
      phase: "prepare",
      stage: "fallback",
      message: "WebCodecs tidak ada: memakai MediaRecorder (real-time, tanpa audio)"
    });
    let status = await handleFail({
      canvas: renderWidth,
      snapshot: renderValueList,
      renderFrame: renderFailArgValue,
      startMs: renderFailArg,
      intervalMs: renderRaw,
      totalFrames: renderMax,
      fps: renderArg,
      report: renderFailRenderValue,
      isCancelled: renderArgClamped
    });
    return status.status = status.cancelled ? "cancelled" : "success", status.audio = null, renderFailRenderValue({
      phase: "selesai",
      ...status,
      bytes: status.blob.size
    }), status;
  }
  let renderId = await helperInner({
    width: renderFailValue,
    height: renderValueRaw,
    bitrate: renderArgValue,
    fps: renderArg
  });
  if (!renderId) {
    let error = new Error("Tidak ada codec video (H.264) yang didukung encoder browser ini.");
    throw error.codecFailure = true, error;
  }
  renderArgParsed({
    phase: "mulai",
    total: renderMax,
    codec: renderId.id,
    width: renderFailValue,
    height: renderValueRaw,
    bitrate: renderArgValue,
    fps: renderArg
  });
  let packets = null,
    renderValueOuter = null;
  if (renderList) {
    renderFailRenderValue({
      phase: "audio",
      stage: "prepare"
    });
    try {
      packets = await objFail({
        url: renderFailUrl.url,
        tracks: renderFailUrl.tracks || null,
        startMs: renderFailArg,
        endMs: renderArgStart,
        rate: renderFailUrl.rate,
        offsetMs: renderFailUrl.offsetMs,
        inTimeMs: renderFailUrl.inTimeMs || 0,
        sampleRate: renderFailUrl.sampleRate || localMax,
        bitrate: renderFailUrl.bitrate || 128000,
        onProgress: renderArgCount => renderFailRenderValue(renderArgCount)
      });
    } catch (renderValueSource) {
      renderFailRenderValue({
        phase: "audio",
        stage: "gagal",
        message: renderValueSource.message
      });
      let error = new Error("Ekspor dibatalkan: track audio diminta tapi gagal disiapkan (" + renderValueSource.message + ').');
      throw error.audioFailure = true, error;
    }
  }
  renderFailRenderValue({
    phase: "mux",
    stage: "open"
  });
  let addVideoTrack = await localKind.create({
    fps: renderArg
  });
  if (addVideoTrack.addVideoTrack(), packets && addVideoTrack.addAudioTrack(), await addVideoTrack.start(), packets) {
    for (let chunk of packets.packets) await addVideoTrack.queueAudioPacket(chunk.chunk, chunk.metadata);
    renderValueOuter = {
      packets: packets.packets.length,
      sampleRate: packets.sampleRate,
      channels: packets.channels,
      seconds: packets.seconds,
      bytes: addVideoTrack.audioByteLength
    }, renderFailRenderValue({
      phase: "audio",
      stage: 'ok',
      ...renderValueOuter
    });
  }
  let renderValueParsed = null,
    renderFailMap = new Map(),
    renderFailRecord = {
      outputCount: 0,
      totalLatency: 0,
      minLatency: 1 / 0,
      maxLatency: 0,
      maxQueue: 0
    },
    videoEncoder = new VideoEncoder({
      output: (timestamp, videoencoderValue) => {
        let renderValueMap = renderFailMap.get(timestamp.timestamp);
        if (renderValueMap !== void 0) {
          let totalLatency = performance.now() - renderValueMap;
          renderFailMap.delete(timestamp.timestamp), renderFailRecord.outputCount++, renderFailRecord.totalLatency += totalLatency, renderFailRecord.minLatency = Math.min(renderFailRecord.minLatency, totalLatency), renderFailRecord.maxLatency = Math.max(renderFailRecord.maxLatency, totalLatency);
        }
        addVideoTrack.queueFrame(timestamp, videoencoderValue);
      },
      error: renderArgTotal => {
        renderValueParsed = renderArgTotal;
      }
    });
  try {
    videoEncoder.configure(renderId.config);
  } catch (renderValueSecondary) {
    try {
      videoEncoder.close();
    } catch {}
    let error = new Error("VideoEncoder menolak konfigurasi " + renderId.id + '\x20' + renderFailValue + 'x' + renderValueRaw + ':\x20' + renderValueSecondary.message);
    throw error.codecFailure = true, error;
  }
  let renderValuePrev = Math.max(1, Math.round(renderArg * renderArgEnd)),
    renderFailList = [],
    renderOuter = 1 / 0,
    renderFailNumber = 0,
    renderValueInner = false,
    prepare = {
      prepare: 0,
      render: 0,
      encode: 0,
      queue: 0
    };
  try {
    for (let renderNumber = 0; renderNumber < renderMax; renderNumber++) {
      if (renderArgClamped()) {
        renderValueInner = true;
        break;
      }
      if (renderValueParsed) throw refHelperRaw(renderValueParsed);
      let renderNow = performance.now(),
        renderMap = renderFailArg + renderNumber * renderRaw;
      renderArgRaw && (await renderArgRaw(renderMap));
      let nowValue = performance.now();
      renderFailArgValue(renderMap);
      let renderValueCount = performance.now(),
        videoFrame = new VideoFrame(buildHelperInner(renderValueList, renderWidth, renderFailValue, renderValueRaw), {
          timestamp: Math.round(renderNumber * renderRaw * 1000),
          duration: Math.round(renderRaw * 1000)
        });
      renderFailMap.set(videoFrame.timestamp, performance.now()), videoEncoder.encode(videoFrame, {
        keyFrame: renderNumber % renderValuePrev === 0
      }), renderFailRecord.maxQueue = Math.max(renderFailRecord.maxQueue, videoEncoder.encodeQueueSize), videoFrame.close();
      let renderCount = performance.now();
      for (; videoEncoder.encodeQueueSize > valueType;) if (await localValueSecondary(2), renderValueParsed) throw refHelperRaw(renderValueParsed);
      let renderSource = performance.now();
      prepare.prepare += nowValue - renderNow, prepare.render += renderValueCount - nowValue, prepare.encode += renderCount - renderValueCount, prepare.queue += renderSource - renderCount;
      let renderScoped = performance.now() - renderNow;
      renderFailList.push(renderScoped), renderFailList.length > 60 && renderFailList.shift(), renderOuter = Math.min(renderOuter, renderScoped), renderFailNumber = Math.max(renderFailNumber, renderScoped);
      let renderInner = renderFailList.reduce((renderFailArgRaw, renderArgCurrent) => renderFailArgRaw + renderArgCurrent, 0) / renderFailList.length;
      renderFailRenderValue({
        phase: "render",
        frame: renderNumber + 1,
        msPerFrame: renderScoped,
        avgMs: renderInner,
        minMs: renderOuter,
        maxMs: renderFailNumber,
        renderFps: 1000 / renderInner,
        etaMs: renderInner * (renderMax - renderNumber - 1),
        encodedBytes: addVideoTrack.byteLength
      }), await localValueSecondary(0);
    }
    if (!renderValueInner) {
      renderFailRenderValue({
        phase: "encode",
        stage: "flush",
        frame: addVideoTrack.frameCount,
        encodedBytes: addVideoTrack.byteLength
      });
      try {
        await videoEncoder.flush();
      } catch (renderSecondary) {
        throw refHelperRaw(renderSecondary);
      }
      let renderValueTarget = renderFailRecord.outputCount ? renderFailRecord.totalLatency / renderFailRecord.outputCount : 0;
      console.log("[VideoEncoder]", {
        outputCount: renderFailRecord.outputCount,
        avgLatencyMs: Math.round(renderValueTarget * 10) / 10,
        minLatencyMs: Math.round(renderFailRecord.minLatency * 10) / 10,
        maxLatencyMs: Math.round(renderFailRecord.maxLatency * 10) / 10,
        maxQueue: renderFailRecord.maxQueue
      });
    }
  } catch (renderValueTertiary) {
    try {
      addVideoTrack.cancel();
    } catch {}
    throw renderValueTertiary;
  } finally {
    try {
      videoEncoder.close();
    } catch {}
  }
  if (renderValueInner) {
    try {
      addVideoTrack.cancel();
    } catch {}
    let renderValueTotal = {
      status: "cancelled",
      cancelled: true,
      blob: null,
      codec: renderId.id,
      width: renderFailValue,
      height: renderValueRaw,
      fps: renderArg,
      frames: addVideoTrack.frameCount,
      mode: "webcodecs",
      audio: null
    };
    return renderFailRenderValue({
      phase: "batal",
      ...renderValueTotal
    }), renderValueTotal;
  }
  renderFailRenderValue({
    phase: "finalize"
  });
  let renderPrev;
  try {
    renderPrev = await addVideoTrack.finish();
  } catch (renderValueStart) {
    let muxFailure = renderValueStart && typeof renderValueStart == "object" ? renderValueStart : new Error(String(renderValueStart));
    throw muxFailure.muxFailure = true, muxFailure;
  }
  let renderRecord = {
    status: "success",
    cancelled: false,
    blob: new Blob([renderPrev], {
      type: "video/mp4"
    }),
    codec: renderId.id,
    width: renderFailValue,
    height: renderValueRaw,
    fps: renderArg,
    frames: addVideoTrack.frameCount,
    mode: "webcodecs",
    bitrate: renderArgValue,
    audio: renderValueOuter,
    audioError: null,
    profile: Object.fromEntries(Object.entries(prepare).map(([renderArgNext, renderFailRaw]) => [renderArgNext, renderFailRaw / Math.max(1, addVideoTrack.frameCount)]))
  };
  return renderFailRenderValue({
    phase: "selesai",
    ...renderRecord,
    bytes: renderRecord.blob.size
  }), renderRecord;
}
async function resHelperValue(resArg = {}) {
  let {
      onProgress: resHelperValueResValue = () => {},
      isCancelled: resValueRaw = () => false,
      audio: resUrl = null,
      forceFFmpeg: resRaw = false,
      codec: resValueParsed = "h264"
    } = resArg,
    resFlag = !!(resUrl && (resUrl.url || Array.isArray(resUrl.tracks) && resUrl.tracks.length));
  if (resRaw) console.warn("[Export] Falling back to FFmpeg WASM" + (resFlag ? " (audio requested)" : '')), resHelperValueResValue({
    phase: "fallback",
    stage: "select",
    message: resFlag ? "WebCodecs audio failed" : "WebCodecs video tidak dipakai"
  }), resHelperValueResValue({
    phase: "fallback",
    stage: "fallback-select",
    message: "Menggunakan FFmpeg WASM (software encode, bisa lambat) sebagai fallback audio/video."
  });else try {
    return await renderFail(resArg);
  } catch (resMessage) {
    let resHandle = handleParsed(resMessage);
    if (resHandle === "cancelled" || resValueRaw() || !processHelperMin(resMessage, {
      audioRequested: resFlag
    })) throw resMessage;
    if (console.warn("[Export] WebCodecs " + (resHandle === "audio" ? "audio" : "codec") + " failed: " + resMessage.message), console.warn("[Export] Falling back to FFmpeg WASM"), resHelperValueResValue({
      phase: "fallback",
      stage: "select",
      message: ((resHandle === "audio" ? "WebCodecs audio failed" : "WebCodecs video codec failed") + ':\x20' + (resMessage.message || '')).trim()
    }), resHandle === "audio" && resFlag) {
      let resParsed = await updateHelperMax(resArg);
      if (resParsed) return resParsed;
    }
    resHelperValueResValue({
      phase: "fallback",
      stage: "fallback-select",
      message: "Menggunakan FFmpeg WASM (software encode, bisa lambat) sebagai fallback audio/video."
    });
  }
  return exportFramesFFmpeg(resArg, {
    audioRequested: resFlag,
    codec: resValueParsed
  });
}
async function updateHelperMax(updateArgStart) {
  let {
    onProgress: updateValueParsed = () => {},
    isCancelled: updateClamped = () => false,
    audio: updateEnd = null,
    startMs: updateValueMin = 0,
    endMs: updateTotal
  } = updateArgStart;
  updateValueParsed({
    phase: "fallback",
    stage: "hybrid",
    message: "Menyiapkan audio (mode cepat)…"
  });
  let updateValueOuter;
  try {
    updateValueOuter = await smoothstep({
      ...objHelperInner(updateEnd, updateValueMin, updateTotal),
      onProgress: updateValueParsed
    });
  } catch (cause) {
    let error = new Error("Campuran audio gagal disiapkan: " + (cause && cause.message || cause));
    throw error.audioFailure = true, error.cause = cause, error;
  }
  if (!updateValueOuter || !updateValueOuter.length) {
    let error = new Error("Campuran audio kosong; ekspor dibatalkan supaya tidak menghasilkan video tanpa suara.");
    throw error.audioFailure = true, error;
  }
  updateValueParsed({
    phase: "fallback",
    stage: "hybrid",
    message: "Video WebCodecs + audio FFmpeg (mode cepat)."
  });
  let cancelled;
  try {
    cancelled = await renderFail({
      ...updateArgStart,
      audio: null,
      forceFFmpeg: void 0
    });
  } catch (updateMessage) {
    if (updateClamped() || handleParsed(updateMessage) === "cancelled" || handleParsed(updateMessage) === "renderer") throw updateMessage;
    return updateValueParsed({
      phase: "fallback",
      stage: "hybrid-fail",
      message: "Video WebCodecs tidak bisa: " + (updateMessage && updateMessage.message || updateMessage)
    }), null;
  }
  if (!cancelled) return null;
  if (cancelled.cancelled || cancelled.status === "cancelled") return cancelled;
  if (cancelled.status !== "success" || !cancelled.blob) return null;
  if (updateClamped()) return cancelled;
  try {
    let muxVideoWithAudioFFmpeg = await import("./ffmpeg-export-v2.js"),
      updateHelperMaxUintArray = new Uint8Array(await cancelled.blob.arrayBuffer()),
      profile = await muxVideoWithAudioFFmpeg.muxVideoWithAudioFFmpeg({
        videoBytes: updateHelperMaxUintArray,
        videoCodec: cancelled.codec,
        width: cancelled.width,
        height: cancelled.height,
        fps: cancelled.fps,
        frames: cancelled.frames,
        renderAudio: async () => updateValueOuter,
        onProgress: updateValueParsed,
        isCancelled: updateClamped
      });
    return profile.profile = cancelled.profile, profile.bitrate = cancelled.bitrate, profile;
  } catch (ffmpegFailure) {
    if (ffmpegFailure && ffmpegFailure.ffmpegFailure) throw ffmpegFailure;
    return updateValueParsed({
      phase: "fallback",
      stage: "hybrid-fail",
      message: "Mux audio FFmpeg gagal: " + (ffmpegFailure && ffmpegFailure.message || ffmpegFailure)
    }), null;
  }
}
async function exportFramesFFmpeg(exportFramesFFmpegArg, {
  audioRequested: exportframesCondition,
  codec: exportFramesFFmpegArgValue
}) {
  let {
    canvas: exportFramesFFmpegWidth,
    renderFrame: exportFramesFFmpegValueScoped,
    prepareFrame: exportFramesFFmpegValueRaw = null,
    startMs: exportFramesFFmpegResult = 0,
    endMs: exportFramesFFmpegRaw,
    fps: exportFramesFFmpegValueParsed = 30,
    bitrate: exportFramesFFmpegParsed = 6000000,
    onProgress: exportFramesFFmpegValue = () => {},
    isCancelled: exportFramesFFmpegValueClamped = () => false,
    audio: exportFramesFFmpegClamped = null
  } = exportFramesFFmpegArg;
  console.log("[Export] Loading FFmpeg WASM..."), exportFramesFFmpegValue({
    phase: "fallback",
    stage: "ffmpeg-load",
    message: "Memuat FFmpeg WASM..."
  });
  let exportFramesFFmpegData = await import("./ffmpeg-export-v2.js"),
    exportframesValue = exportFramesFFmpegWidth.width - exportFramesFFmpegWidth.width % 2,
    exportFramesFFmpegScoped = exportFramesFFmpegWidth.height - exportFramesFFmpegWidth.height % 2,
    exportFramesFFmpegUpdate = updateHelperStart(exportframesValue, exportFramesFFmpegScoped, exportFramesFFmpegWidth);
  return exportFramesFFmpegData.exportFramesFFmpeg({
    canvas: exportFramesFFmpegWidth,
    snapshot: exportFramesFFmpegUpdate,
    renderFrame: exportFramesFFmpegValueScoped,
    prepareFrame: exportFramesFFmpegValueRaw,
    startMs: exportFramesFFmpegResult,
    endMs: exportFramesFFmpegRaw,
    fps: exportFramesFFmpegValueParsed,
    bitrate: exportFramesFFmpegParsed,
    codec: exportFramesFFmpegArgValue,
    audioRequested: exportframesCondition,
    renderAudio: exportframesCondition ? () => smoothstep({
      ...objHelperInner(exportFramesFFmpegClamped, exportFramesFFmpegResult, exportFramesFFmpegRaw),
      onProgress: exportFramesFFmpegValue
    }) : null,
    onProgress: exportFramesFFmpegValue,
    isCancelled: exportFramesFFmpegValueClamped
  });
}
function getHelperByIndex() {
  return (expcodecEl ? expcodecEl.value : "h264") === "h265" ? "h265" : "h264";
}
function applyHelperStart() {
  let applyHelperStartValue = Number(expbitrateEl.value) || 0.08,
    applyValueMax = applyHelperStartValue <= 0.05 ? "Burik Enteng" : applyHelperStartValue <= 0.1 ? "Hemat" : applyHelperStartValue <= 0.2 ? "Rendah" : applyHelperStartValue <= 0.35 ? "Sedang" : applyHelperStartValue <= 0.5 ? "Lumayan" : applyHelperStartValue <= 0.75 ? "Jernih" : applyHelperStartValue <= 1 ? "Makan Memory" : applyHelperStartValue <= 1.25 ? "Boros Memory" : applyHelperStartValue <= 1.5 ? "Ketinggian" : applyHelperStartValue <= 2 ? "Ekstrem" : "File Jumbo";
  expbitratelaEl.textContent = applyValueMax + '\x20(' + applyHelperStartValue.toFixed(2) + '×)';
}
export { applyHelperStart, exportFramesFFmpeg, failHelper, getHelperByIndex, handleHelperInner, handleParsed, helperInner, objFail, objHelperClamped, objHelperOuter, processHelperMin, refHelperRaw, renderFail, resHelperValue, updateHelperMax };
