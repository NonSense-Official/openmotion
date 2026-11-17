import { a as imported, b as localScoped, d as localValueLocal, e as valueLocal, f as valueStart, g as localValueOuter, h as valueOuter, i as localOuter, j as localValueInner, k as valueInner, l as localInner } from './chunk.js';
var localParsed = class {
    constructor(canvas, log = console.log) {
      if (this.canvas = canvas, this.gl2 = canvas.getContext("webgl2") || null, this.gl = this.gl2 || canvas.getContext("webgl", {
        preserveDrawingBuffer: true
      }) || canvas.getContext("experimental-webgl"), !this.gl) throw new Error("WebGL not supported");
      this.webglVersion = this.gl2 ? 2 : 1, this.log = log, this.log("[WEBGL] Backend: WebGL" + this.webglVersion + " (GLSL ES " + (this.webglVersion >= 2 ? "3.00" : "1.00") + ')'), this.webglVersion < 2 && this.log("[WEBGL] WebGL2 tidak tersedia; sebagian efek (loop dinamis / min-max integer) bisa gagal dikompilasi."), this.currentEffect = null, this.program = null, this.uniformLocations = {}, this.attribLocations = {}, this.paramValues = {}, this.inputTexture = null, this.inputImageSize = [512, 512], this.animationFrameId = null, this.startTime = performance.now(), this.initGL();
    }
    ["initGL"]() {
      let gl = this.gl;
      this.positionBuffer = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      let localFloatArray = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, localFloatArray, gl.STATIC_DRAW), this.texCoordBuffer = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      let float32Array2 = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, float32Array2, gl.STATIC_DRAW), this.placeholderTexture = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, this.placeholderTexture), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255])), this.inputTexture = this.placeholderTexture;
    }
    ["loadEffect"](id) {
      this.log("[XML] Loading effect: " + (id.name || id.id));
      let localText = null;
      if (id.shader) {
        let localRecord = {
            webglVersion: this.webglVersion
          },
          localImported = valueLocal(id, this.log, localRecord),
          importedValue = valueStart(id, this.log, localRecord);
        this.compileProgram(importedValue, localImported), this.mode = "shader";
      } else {
        if (id.script && id.script.code) localText = localOuter(id, this.log), this.compileProgram(localValueOuter(this.webglVersion), valueOuter(this.webglVersion)), this.mode = "script", this.lastScriptText = null, this.scriptSampleText = /el\.text/.test(id.script.code) ? "Sample 1234.5" : '', this.log("[SCRIPT] Efek animator properti: alpha/posisi/scale/rotasi diterapkan ke gambar."), this.scriptSampleText && this.log("[SCRIPT] Efek ini mengubah teks layer; contoh teks yang dipakai: " + JSON.stringify(this.scriptSampleText));else throw id.script && id.script.external ? new Error("Efek " + id.id + " memakai script bawaan Alight Motion (" + id.script.external + ") yang jalan native di aplikasi, jadi belum bisa dipreview di web.") : new Error("Efek " + id.id + " diimplementasikan native di Alight Motion (bukan shader/script), jadi belum bisa dipreview di web.");
      }
      let rResult = {};
      for (let idValue of id.params) rResult[idValue.id] = structuredClone(idValue.defaultValue), this.log("[PARAM] Initialized " + idValue.id + " = " + JSON.stringify(rResult[idValue.id]));
      this.currentEffect = id, this.paramValues = rResult, this.scriptAnimator = localText, this.uniformNames = localValueLocal(id), this.log("[SHADER] Successfully loaded effect " + id.id);
    }
    ["compileProgram"](rValue, rText) {
      let glValue = this.gl;
      this.log("[SHADER] Compiling vertex and fragment shaders...");
      let createShader = this.createShader(glValue.VERTEX_SHADER, rValue),
        createShaderValue = this.createShader(glValue.FRAGMENT_SHADER, rText),
        createProgram = glValue.createProgram();
      if (glValue.attachShader(createProgram, createShader), glValue.attachShader(createProgram, createShaderValue), glValue.linkProgram(createProgram), !glValue.getProgramParameter(createProgram, glValue.LINK_STATUS)) {
        let getProgramInfoLog = glValue.getProgramInfoLog(createProgram);
        throw glValue.deleteProgram(createProgram), new Error("Shader Link Error:\n" + getProgramInfoLog + "\n\nFragment Shader Code:\n" + rText);
      }
      this.attribLocations = {
        a_position: glValue.getAttribLocation(createProgram, "a_position"),
        a_texCoord: glValue.getAttribLocation(createProgram, "a_texCoord")
      }, this.uniformLocations = {};
      let getProgramParameter = glValue.getProgramParameter(createProgram, glValue.ACTIVE_UNIFORMS);
      for (let rNumber = 0; rNumber < getProgramParameter; rNumber++) {
        let getActiveUniform = glValue.getActiveUniform(createProgram, rNumber);
        getActiveUniform && (this.uniformLocations[getActiveUniform.name] = glValue.getUniformLocation(createProgram, getActiveUniform.name));
      }
      let program = this.program;
      return this.program = createProgram, program && glValue.deleteProgram(program), this.log("[SHADER] Shader compiled & linked successfully."), createProgram;
    }
    ["createShader"](localArg, localArgValue) {
      let localCreateShader = this.gl,
        createShader = localCreateShader.createShader(localArg);
      if (localCreateShader.shaderSource(createShader, localArgValue), localCreateShader.compileShader(createShader), !localCreateShader.getShaderParameter(createShader, localCreateShader.COMPILE_STATUS)) {
        let getShaderInfoLog = localCreateShader.getShaderInfoLog(createShader);
        throw localCreateShader.deleteShader(createShader), new Error("Shader Compile Error (" + (localArg === localCreateShader.VERTEX_SHADER ? "Vertex" : "Fragment") + "):\n" + getShaderInfoLog + "\n\nSource:\n" + localArgValue);
      }
      return createShader;
    }
    ["setInputImage"](localArgRaw) {
      let localGl = this.gl,
        canvasEl = document.createElement("canvas");
      canvasEl.width = 512, canvasEl.height = 512, canvasEl.getContext('2d').drawImage(localArgRaw, 0, 0, 512, 512);
      let createTexture = localGl.createTexture();
      localGl.bindTexture(localGl.TEXTURE_2D, createTexture), localGl.pixelStorei(localGl.UNPACK_FLIP_Y_WEBGL, true), localGl.texParameteri(localGl.TEXTURE_2D, localGl.TEXTURE_WRAP_S, localGl.REPEAT), localGl.texParameteri(localGl.TEXTURE_2D, localGl.TEXTURE_WRAP_T, localGl.REPEAT), localGl.texParameteri(localGl.TEXTURE_2D, localGl.TEXTURE_MIN_FILTER, localGl.LINEAR), localGl.texParameteri(localGl.TEXTURE_2D, localGl.TEXTURE_MAG_FILTER, localGl.LINEAR), localGl.texImage2D(localGl.TEXTURE_2D, 0, localGl.RGBA, localGl.RGBA, localGl.UNSIGNED_BYTE, canvasEl), this.inputTexture = createTexture, this.inputImageSize = [512, 512], this.log("[WEBGL] Updated input texture size to POT canvas: 512x512");
    }
    ["setParamValue"](rKey, rKeyArg) {
      this.paramValues[rKey] = rKeyArg, this.log("[PARAM] " + rKey + " = " + JSON.stringify(rKeyArg));
    }
    ["startRenderLoop"]() {
      this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
      let localValueStart = fnValue => {
        try {
          this.renderFrame(fnValue), this.lastRenderError = null;
        } catch (message) {
          let lastRenderError = message.name + ':\x20' + message.message;
          this.lastRenderError !== lastRenderError && (this.lastRenderError = lastRenderError, this.log("[ERROR] Render failed: " + lastRenderError));
        }
        this.animationFrameId = requestAnimationFrame(localValueStart);
      };
      this.animationFrameId = requestAnimationFrame(localValueStart), this.log("[WEBGL] Started animation render loop.");
    }
    ["stopRenderLoop"]() {
      this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
    }
    ["renderFrame"](argValue) {
      if (!this.program || !this.currentEffect) return;
      if (this.mode === "script") {
        this.renderScriptFrame(argValue);
        return;
      }
      let viewport = this.gl;
      viewport.viewport(0, 0, this.canvas.width, this.canvas.height), viewport.clearColor(0, 0, 0, 1), viewport.clear(viewport.COLOR_BUFFER_BIT), viewport.useProgram(this.program), this.bindQuadAttributes();
      let width = this.canvas.width,
        height = this.canvas.height,
        localValueClamped = (argValue - this.startTime) / 1000;
      this.setUniform2f("acLayerNorm", 1, 1), this.setUniform2f("acLayerSize", width, height), this.setUniform2f("acScreenNorm", 1, 1), this.setUniform2f("acScreenSize", width, height), this.setUniform2f("acLayerCenter", width * 0.5, height * 0.5), this.setUniform2f("acLayerCenterNorm", 0.5, 0.5), this.setUniform2f("acLayerSizeNorm", 1, 1), this.setUniform2f("acLayerPivot", 0, 0), this.setUniform2f("acPreviewSize", width, height), this.setUniform2f("acProjectSize", width, height), this.setUniform1i("acPass", 0), this.setUniform1f("acTime", localValueClamped), this.setUniform1f("acAngularVelocity", 0), this.setUniform1i("acShowGuides", 0);
      let floatArray = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        acLayerToScreen = this.uniformLocations.acLayerToScreen;
      acLayerToScreen && viewport.uniformMatrix4fv(acLayerToScreen, false, floatArray);
      let acScreenToLayer = this.uniformLocations.acScreenToLayer;
      acScreenToLayer && viewport.uniformMatrix4fv(acScreenToLayer, false, floatArray);
      let localNumber = 0,
        valueClamped = this.uniformNames || new Map();
      for (let localId of this.currentEffect.params) {
        let localFlag = this.paramValues[localId.id],
          spinner = valueClamped.get(localId.id) || localId.id;
        if (localId.type === "texture") {
          viewport.activeTexture(viewport.TEXTURE0 + localNumber), viewport.bindTexture(viewport.TEXTURE_2D, this.inputTexture);
          let uniform = this.uniformLocations['u_' + localId.id + "_texture"];
          uniform && viewport.uniform1i(uniform, localNumber);
          let localUniform = this.uniformLocations['u_' + localId.id + "_size"];
          localUniform && viewport.uniform2f(localUniform, this.inputImageSize[0], this.inputImageSize[1]), localNumber++;
        } else localId.type === "spinner" || localId.type === "slider" || localId.type === "float" ? this.setUniform1f(spinner, parseFloat(localFlag)) : localId.type === "switch" ? this.setUniform1i(spinner, localFlag ? 1 : 0) : localId.type === "selector" ? this.setUniform1i(spinner, parseInt(localFlag, 10) || 0) : localId.type === "point" ? Array.isArray(localFlag) && this.setUniform2f(spinner, localFlag[0], localFlag[1]) : localId.type === "xyz" || localId.type === "hue-disc" ? Array.isArray(localFlag) && this.setUniform3f(spinner, localFlag[0], localFlag[1], localFlag[2]) : localId.type === "color" ? Array.isArray(localFlag) && this.setUniform4f(spinner, localFlag[0], localFlag[1], localFlag[2], localFlag[3]) : localId.type === "orient" && Array.isArray(localFlag) && localFlag.length === 16 && this.setUniformMatrix4fv(spinner, localFlag);
      }
      viewport.drawArrays(viewport.TRIANGLES, 0, 6);
    }
    ["bindQuadAttributes"]() {
      let bindBuffer = this.gl,
        aPosition = this.attribLocations.a_position;
      aPosition >= 0 && (bindBuffer.bindBuffer(bindBuffer.ARRAY_BUFFER, this.positionBuffer), bindBuffer.enableVertexAttribArray(aPosition), bindBuffer.vertexAttribPointer(aPosition, 2, bindBuffer.FLOAT, false, 0, 0));
      let aTexCoord = this.attribLocations.a_texCoord;
      aTexCoord >= 0 && (bindBuffer.bindBuffer(bindBuffer.ARRAY_BUFFER, this.texCoordBuffer), bindBuffer.enableVertexAttribArray(aTexCoord), bindBuffer.vertexAttribPointer(aTexCoord, 2, bindBuffer.FLOAT, false, 0, 0));
    }
    ["computeScriptTransform"](transform) {
      let localValueRaw = (transform.transform.angle || 0) * Math.PI / 180,
        localCos = Math.cos(localValueRaw),
        localSin = Math.sin(localValueRaw),
        localX = transform.transform.scale.x,
        localY = transform.transform.scale.y,
        localClamped = (transform.transform.location.x || 0) * (2 / this.canvas.width),
        localValueScoped = -(transform.transform.location.y || 0) * (2 / this.canvas.height);
      return new Float32Array([localCos * localX, localSin * localX, 0, -localSin * localY, localCos * localY, 0, localClamped, localValueScoped, 1]);
    }
    ["renderScriptFrame"](argRaw) {
      let localViewport = this.gl,
        valueScoped = (argRaw - this.startTime) / 1000,
        alpha;
      try {
        alpha = localValueInner(this.scriptSampleText || ''), this.scriptAnimator.animate(valueInner(valueScoped), alpha, localInner(this.currentEffect, this.paramValues)), this.lastScriptError = null;
      } catch (localMessage) {
        let lastScriptError = localMessage.name + ':\x20' + localMessage.message;
        this.lastScriptError !== lastScriptError && (this.lastScriptError = lastScriptError, this.log("[ERROR] Script gagal: " + lastScriptError));
        return;
      }
      typeof alpha.text == "string" && alpha.text && alpha.text !== this.lastScriptText && (this.lastScriptText = alpha.text, this.log("[SCRIPT] el.text = " + JSON.stringify(alpha.text))), localViewport.viewport(0, 0, this.canvas.width, this.canvas.height), localViewport.clearColor(0, 0, 0, 1), localViewport.clear(localViewport.COLOR_BUFFER_BIT), localViewport.useProgram(this.program), this.bindQuadAttributes(), localViewport.activeTexture(localViewport.TEXTURE0), localViewport.bindTexture(localViewport.TEXTURE_2D, this.inputTexture), this.setUniform1i("u_image", 0), this.setUniform1f("u_alpha", Math.max(0, Math.min(1, alpha.alpha))), this.setUniformMatrix3fv("u_transform", this.computeScriptTransform(alpha)), localViewport.drawArrays(localViewport.TRIANGLES, 0, 6);
    }
    ["setUniform1f"](localArgParsed, uniformArg) {
      let localRKey = this.uniformLocations[localArgParsed];
      localRKey && this.gl.uniform1f(localRKey, uniformArg);
    }
    ["setUniform1i"](argParsed, localArgClamped) {
      let rKeyValue = this.uniformLocations[argParsed];
      rKeyValue && this.gl.uniform1i(rKeyValue, localArgClamped);
    }
    ["setUniform2f"](argClamped, localArgScoped, argScoped) {
      let uniformValue = this.uniformLocations[argClamped];
      uniformValue && this.gl.uniform2f(uniformValue, localArgScoped, argScoped);
    }
    ["setUniform3f"](localArgLocal, argLocal, localArgOuter, argOuter) {
      let valueRaw = this.uniformLocations[localArgLocal];
      valueRaw && this.gl.uniform3f(valueRaw, argLocal, localArgOuter, argOuter);
    }
    ["setUniform4f"](localArgInner, argInner, localArgStart, argStart, localStart) {
      let localRaw = this.uniformLocations[localArgInner];
      localRaw && this.gl.uniform4f(localRaw, argInner, localArgStart, argStart, localStart);
    }
    ["setUniformMatrix3fv"](localArgEnd, rBytes) {
      let localValueParsed = this.uniformLocations[localArgEnd];
      localValueParsed && this.gl.uniformMatrix3fv(localValueParsed, false, new Float32Array(rBytes));
    }
    ["setUniformMatrix4fv"](argEnd, localEnd) {
      let valueParsed = this.uniformLocations[argEnd];
      valueParsed && this.gl.uniformMatrix4fv(valueParsed, false, new Float32Array(localEnd));
    }
  },
  renderCanvasEl = document.getElementById("render-canvas"),
  logsPanelEl = document.getElementById("logs-panel"),
  errorOverlayEl = document.getElementById("error-overlay"),
  effectSelect = document.getElementById("effect-select"),
  imageUploadEl = document.getElementById("image-upload"),
  uploadFilenameEl = document.getElementById("upload-filename"),
  controlsContainer = document.getElementById("controls-container");
document.querySelectorAll(".tab-btn").forEach(addEventListener => {
  addEventListener.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(classList => classList.classList.remove("active")), document.querySelectorAll(".tab-pane").forEach(localClassList => localClassList.classList.remove("active")), addEventListener.classList.add("active"), document.getElementById("tab-" + addEventListener.dataset.tab).classList.add("active");
  });
});
function handleHelper(handleText) {
  document.getElementById("tbtn-" + handleText).click();
}
function process(textContent) {
  let divEl = document.createElement("div");
  divEl.className = "log-entry", textContent.startsWith("[XML]") ? divEl.classList.add("log-xml") : textContent.startsWith("[PARAM]") ? divEl.classList.add("log-param") : textContent.startsWith("[SHADER]") ? divEl.classList.add("log-shader") : textContent.startsWith("[WEBGL]") ? divEl.classList.add("log-webgl") : textContent.startsWith("[ERROR]") && divEl.classList.add("log-error"), divEl.textContent = textContent, logsPanelEl.appendChild(divEl), logsPanelEl.scrollTop = logsPanelEl.scrollHeight;
}
var loadEffect = null;
try {
  loadEffect = new localParsed(renderCanvasEl, process), buildHelper();
} catch (messageValue) {
  process("[ERROR] WebGL Init Failed: " + messageValue.message), errorOverlayEl.style.display = "block", errorOverlayEl.textContent = "WebGL Init Failed: " + messageValue.message;
}
async function fail(computeText) {
  if (errorOverlayEl.style.display = "none", controlsContainer.innerHTML = '', !loadEffect) {
    process("[ERROR] Renderer not available");
    return;
  }
  try {
    let failText = null;
    try {
      let ok = await fetch("/api/effect-bin?id=" + encodeURIComponent(computeText));
      ok.ok && (failText = localScoped(await ok.arrayBuffer()));
    } catch {}
    if (!failText) {
      let textValue = null;
      try {
        let okValue = await fetch("/api/effect-xml?id=" + encodeURIComponent(computeText));
        okValue.ok && (textValue = await okValue.text());
      } catch {}
      if (textValue === null) {
        let computeOk = await fetch("../effects/" + computeText);
        if (!computeOk.ok) throw new Error("HTTP " + computeOk.status + " loading ../effects/" + computeText);
        textValue = await computeOk.text();
      }
      failText = imported(textValue, computeText);
    }
    loadEffect.loadEffect(failText), bind(failText), loadEffect.startRenderLoop(), handleHelper("params");
  } catch (computeMessage) {
    let computeValue = location.protocol === "file:" ? "\n\nBuka lewat web server: npm start lalu http://localhost:3000/runtime/preview.html" : '';
    /tidak punya fragment shader|native di Alight Motion|script bawaan/.test(computeMessage.message) && (computeValue = "\n\nEfek ini tidak punya shader/script — berjalan native di Alight Motion."), process("[ERROR] " + computeMessage.message), errorOverlayEl.style.display = "block", errorOverlayEl.textContent = computeMessage.message + computeValue;
  }
}
function arrHelper(step, arrKey, arrValue) {
  let arrHelperArrValue = typeof step.step == "number" && step.step > 0 ? step.step : 0.01;
  if (step.min !== null && step.max !== null && step.min !== step.max) return [step.min, step.max, arrHelperArrValue];
  if (step.type === "hue-disc") return [[0, 360, 1], [0, 1, 0.01], [-1, 1, 0.01]][arrKey] || [-1, 1, 0.01];
  if (step.type === "color") return [0, 1, 0.01];
  if (step.type === "xyz" && (step.valueType === "rotate" || /rotat/i.test(step.id))) return [-180, 180, 0.5];
  let arrHelperMax = Math.max(100, Math.abs(Number(arrValue) || 0) * 4);
  return [-arrHelperMax, arrHelperMax, arrHelperArrValue];
}
function applyHelper(applyValue, applyTextContent, valueArg, applyArg, applyCallback) {
  let [applyArr, applyMax, applyStep] = arrHelper(applyValue, applyArg, valueArg),
    divEl = document.createElement("div");
  divEl.className = "param-row";
  let applyDivEl = document.createElement("div");
  applyDivEl.className = "param-header";
  let spanEl = document.createElement("span");
  spanEl.className = "param-label", spanEl.textContent = applyTextContent;
  let applySpanEl = document.createElement("span");
  applySpanEl.className = "param-val", applySpanEl.textContent = Number(valueArg).toFixed(3), applyDivEl.appendChild(spanEl), applyDivEl.appendChild(applySpanEl);
  let inputEl = document.createElement("input");
  return inputEl.type = "range", inputEl.min = applyArr, inputEl.max = applyMax, inputEl.step = applyStep, inputEl.value = valueArg, inputEl.addEventListener("input", target => {
    let applyNumber = parseFloat(target.target.value);
    applySpanEl.textContent = applyNumber.toFixed(3), applyCallback(applyNumber);
  }), divEl.appendChild(applyDivEl), divEl.appendChild(inputEl), divEl;
}
function getHelper(getTextContent, textContentArg, getCondition) {
  let divEl = document.createElement("div");
  divEl.className = "param-row";
  let getDivEl = document.createElement("div");
  getDivEl.className = "param-header";
  let spanEl = document.createElement("span");
  spanEl.className = "param-label", spanEl.textContent = getTextContent;
  let getSpanEl = document.createElement("span");
  return getSpanEl.className = "param-val", getSpanEl.textContent = textContentArg, getDivEl.appendChild(spanEl), getDivEl.appendChild(getSpanEl), divEl.appendChild(getDivEl), getCondition && divEl.appendChild(getCondition), divEl;
}
function bind(params) {
  controlsContainer.innerHTML = '';
  let paramValues = loadEffect.paramValues;
  if (!params.params.length) {
    controlsContainer.innerHTML = "<div class=\"layers-empty\">Tidak ada parameter</div>";
    return;
  }
  for (let bindId of params.params) {
    let bindFlag = paramValues[bindId.id],
      bindParsed = bindId.label && !bindId.label.startsWith('@') ? bindId.label : bindId.id;
    if (bindId.type === "texture") controlsContainer.appendChild(getHelper(bindParsed, "from Input Image", null));else {
      if (["spinner", "slider", "float"].includes(bindId.type)) controlsContainer.appendChild(applyHelper(bindId, bindParsed, Number(bindFlag) || 0, 0, bindValue => loadEffect.setParamValue(bindId.id, bindValue)));else {
        if (bindId.type === "switch") {
          let inputEl = document.createElement("input");
          inputEl.type = "checkbox", inputEl.checked = !!bindFlag;
          let querySelector = getHelper(bindParsed, bindFlag ? 'ON' : "OFF", inputEl);
          inputEl.addEventListener("change", () => {
            querySelector.querySelector(".param-val").textContent = inputEl.checked ? 'ON' : "OFF", loadEffect.setParamValue(bindId.id, inputEl.checked);
          }), controlsContainer.appendChild(querySelector);
        } else {
          if (bindId.type === "selector") {
            let selectEl = document.createElement("select");
            selectEl.className = "inline-select";
            for (let label of bindId.choices) {
              let optionEl = document.createElement("option");
              optionEl.value = label.value, optionEl.textContent = label.label, selectEl.appendChild(optionEl);
            }
            selectEl.value = String(bindFlag), selectEl.addEventListener("change", () => loadEffect.setParamValue(bindId.id, parseInt(selectEl.value, 10) || 0)), controlsContainer.appendChild(getHelper(bindParsed, String(bindFlag), selectEl));
          } else {
            if (bindId.type === "color") {
              let bindValueClamped = Array.isArray(bindFlag) ? bindFlag.slice() : [1, 1, 1, 1],
                divEl = document.createElement("div");
              divEl.className = "color-swatch";
              let bindRaw = () => {
                let fnCallback = bindArgRaw => Math.round(Math.max(0, Math.min(1, bindArgRaw)) * 255);
                divEl.style.background = "rgb(" + fnCallback(bindValueClamped[0]) + ',' + fnCallback(bindValueClamped[1]) + ',' + fnCallback(bindValueClamped[2]) + ')', divEl.style.opacity = String(Math.max(0.15, bindValueClamped[3]));
              };
              bindRaw(), controlsContainer.appendChild(getHelper(bindParsed, "RGBA", divEl)), ['R', 'G', 'B', 'A'].forEach((bindText, bindKey) => controlsContainer.appendChild(applyHelper(bindId, bindParsed + '.' + bindText, bindValueClamped[bindKey], bindKey, bindArgParsed => {
                bindValueClamped[bindKey] = bindArgParsed, bindRaw(), loadEffect.setParamValue(bindId.id, bindValueClamped.slice());
              })));
            } else {
              if (["point", "xyz", "hue-disc"].includes(bindId.type)) {
                let bindValueParsed = bindId.type === "point" ? ['x', 'y'] : ['x', 'y', 'z'],
                  bindValueRaw = Array.isArray(bindFlag) ? bindFlag.slice() : bindValueParsed.map(() => 0);
                bindValueParsed.forEach((bindArgValue, bindArg) => controlsContainer.appendChild(applyHelper(bindId, bindParsed + '.' + bindArgValue, bindValueRaw[bindArg], bindArg, bindKeyArg => {
                  bindValueRaw[bindArg] = bindKeyArg, loadEffect.setParamValue(bindId.id, bindValueRaw.slice());
                })));
              } else controlsContainer.appendChild(getHelper(bindParsed, String(bindFlag), null));
            }
          }
        }
      }
    }
  }
}
function buildHelper() {
  let canvasEl = document.createElement("canvas");
  canvasEl.width = 512, canvasEl.height = 512;
  let ctx = canvasEl.getContext('2d'),
    buildNumber = 64;
  for (let buildHelperNumber = 0; buildHelperNumber < 512; buildHelperNumber += buildNumber) for (let numberValue = 0; numberValue < 512; numberValue += buildNumber) ctx.fillStyle = (buildHelperNumber / buildNumber + numberValue / buildNumber) % 2 === 0 ? "#ff5722" : "#3f51b5", ctx.fillRect(buildHelperNumber, numberValue, buildNumber, buildNumber);
  ctx.fillStyle = "#fff", ctx.font = "bold 32px sans-serif", ctx.textAlign = "center", ctx.fillText("ALIGHT MOTION", 256, 250), ctx.fillText("PREVIEW TEST", 256, 296), loadEffect.setInputImage(canvasEl);
}
imageUploadEl.addEventListener("change", localTarget => {
  let localValue = localTarget.target.files[0];
  if (!localValue) return;
  uploadFilenameEl.textContent = localValue.name, document.getElementById("upload-btn-text").textContent = localValue.name;
  let image = new Image();
  image.onload = () => loadEffect.setInputImage(image), image.src = URL.createObjectURL(localValue);
}), effectSelect.addEventListener("change", targetArg => fail(targetArg.target.value));
async function handleHelperValue() {
  try {
    let json = await fetch("/api/effects");
    if (json.ok) {
      let handleValue = ((await json.json()).files || []).map(handleArg => handleArg.name);
      if (handleValue.length) return handleValue;
    }
  } catch {}
  let handleOk = await fetch("../effects/");
  return handleOk.ok ? [...(await handleOk.text()).matchAll(/href="([^"]+\.xml)"/gi)].map(handleArgValue => decodeURIComponent(handleArgValue[1].split('/').pop().split('?')[0])) : [];
}
async function processHelper() {
  try {
    let sort = [...new Set(await handleHelperValue())].sort((localeCompare, sortValue) => localeCompare.localeCompare(sortValue));
    if (!sort.length) return;
    let processHelperValue = effectSelect.value || "tile.xml";
    effectSelect.innerHTML = '';
    for (let processValue of sort) {
      let optionEl = document.createElement("option");
      optionEl.value = processValue, optionEl.textContent = processValue, effectSelect.appendChild(optionEl);
    }
    effectSelect.value = sort.includes(processHelperValue) ? processHelperValue : sort[0], process("[XML] " + sort.length + " efek ditemukan");
  } catch (processMessage) {
    process("[XML] Gagal membaca daftar efek: " + processMessage.message);
  }
}
processHelper().then(() => fail(effectSelect.value));