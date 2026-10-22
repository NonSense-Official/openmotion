import { a as imported, b as imported2, d as imported3, e as imported4, f as imported5, g as imported6, h as imported7, i as imported8, j as imported9, k as imported10, l as imported11 } from './chunk.js';
var R = class {
    constructor(a, b = console.log) {
      if (this.canvas = a, this.gl2 = a.getContext("webgl2") || null, this.gl = this.gl2 || a.getContext("webgl", {
        preserveDrawingBuffer: true
      }) || a.getContext("experimental-webgl"), !this.gl) throw new Error("WebGL not supported");
      this.webglVersion = this.gl2 ? 2 : 1, this.log = b, this.log("[WEBGL] Backend: WebGL" + this.webglVersion + " (GLSL ES " + (this.webglVersion >= 2 ? "3.00" : "1.00") + ')'), this.webglVersion < 2 && this.log("[WEBGL] WebGL2 tidak tersedia; sebagian efek (loop dinamis / min-max integer) bisa gagal dikompilasi."), this.currentEffect = null, this.program = null, this.uniformLocations = {}, this.attribLocations = {}, this.paramValues = {}, this.inputTexture = null, this.inputImageSize = [512, 512], this.animationFrameId = null, this.startTime = performance.now(), this.initGL();
    }
    ["initGL"]() {
      let val2 = this.gl;
      this.positionBuffer = val2.createBuffer(), val2.bindBuffer(val2.ARRAY_BUFFER, this.positionBuffer);
      let float32Array = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      val2.bufferData(val2.ARRAY_BUFFER, float32Array, val2.STATIC_DRAW), this.texCoordBuffer = val2.createBuffer(), val2.bindBuffer(val2.ARRAY_BUFFER, this.texCoordBuffer);
      let float32Array2 = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
      val2.bufferData(val2.ARRAY_BUFFER, float32Array2, val2.STATIC_DRAW), this.placeholderTexture = val2.createTexture(), val2.bindTexture(val2.TEXTURE_2D, this.placeholderTexture), val2.texImage2D(val2.TEXTURE_2D, 0, val2.RGBA, 1, 1, 0, val2.RGBA, val2.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255])), this.inputTexture = this.placeholderTexture;
    }
    ["loadEffect"](a) {
      this.log("[XML] Loading effect: " + (a.name || a.id));
      let val2 = null;
      if (a.shader) {
        let obj2 = {
            webglVersion: this.webglVersion
          },
          res = imported4(a, this.log, obj2),
          res2 = imported5(a, this.log, obj2);
        this.compileProgram(res2, res), this.mode = "shader";
      } else {
        if (a.script && a.script.code) val2 = imported8(a, this.log), this.compileProgram(imported6(this.webglVersion), imported7(this.webglVersion)), this.mode = "script", this.lastScriptText = null, this.scriptSampleText = /el\.text/.test(a.script.code) ? "Sample 1234.5" : '', this.log("[SCRIPT] Efek animator properti: alpha/posisi/scale/rotasi diterapkan ke gambar."), this.scriptSampleText && this.log("[SCRIPT] Efek ini mengubah teks layer; contoh teks yang dipakai: " + JSON.stringify(this.scriptSampleText));else throw a.script && a.script.external ? new Error("Efek " + a.id + " memakai script bawaan Alight Motion (" + a.script.external + ") yang jalan native di aplikasi, jadi belum bisa dipreview di web.") : new Error("Efek " + a.id + " diimplementasikan native di Alight Motion (bukan shader/script), jadi belum bisa dipreview di web.");
      }
      let obj = {};
      for (let val3 of a.params) obj[val3.id] = structuredClone(val3.defaultValue), this.log("[PARAM] Initialized " + val3.id + " = " + JSON.stringify(obj[val3.id]));
      this.currentEffect = a, this.paramValues = obj, this.scriptAnimator = val2, this.uniformNames = imported3(a), this.log("[SHADER] Successfully loaded effect " + a.id);
    }
    ["compileProgram"](a, b) {
      let val2 = this.gl;
      this.log("[SHADER] Compiling vertex and fragment shaders...");
      let createShader = this.createShader(val2.VERTEX_SHADER, a),
        createShader2 = this.createShader(val2.FRAGMENT_SHADER, b),
        createProgram = val2.createProgram();
      if (val2.attachShader(createProgram, createShader), val2.attachShader(createProgram, createShader2), val2.linkProgram(createProgram), !val2.getProgramParameter(createProgram, val2.LINK_STATUS)) {
        let getProgramInfoLog = val2.getProgramInfoLog(createProgram);
        throw val2.deleteProgram(createProgram), new Error("Shader Link Error:\n" + getProgramInfoLog + "\n\nFragment Shader Code:\n" + b);
      }
      this.attribLocations = {
        a_position: val2.getAttribLocation(createProgram, "a_position"),
        a_texCoord: val2.getAttribLocation(createProgram, "a_texCoord")
      }, this.uniformLocations = {};
      let getProgramParameter = val2.getProgramParameter(createProgram, val2.ACTIVE_UNIFORMS);
      for (let n = 0; n < getProgramParameter; n++) {
        let getActiveUniform = val2.getActiveUniform(createProgram, n);
        getActiveUniform && (this.uniformLocations[getActiveUniform.name] = val2.getUniformLocation(createProgram, getActiveUniform.name));
      }
      let val3 = this.program;
      return this.program = createProgram, val3 && val2.deleteProgram(val3), this.log("[SHADER] Shader compiled & linked successfully."), createProgram;
    }
    ["createShader"](a, b) {
      let val2 = this.gl,
        createShader = val2.createShader(a);
      if (val2.shaderSource(createShader, b), val2.compileShader(createShader), !val2.getShaderParameter(createShader, val2.COMPILE_STATUS)) {
        let getShaderInfoLog = val2.getShaderInfoLog(createShader);
        throw val2.deleteShader(createShader), new Error("Shader Compile Error (" + (a === val2.VERTEX_SHADER ? "Vertex" : "Fragment") + "):\n" + getShaderInfoLog + "\n\nSource:\n" + b);
      }
      return createShader;
    }
    ["setInputImage"](a) {
      let val2 = this.gl,
        canvasEl = document.createElement("canvas");
      canvasEl.width = 512, canvasEl.height = 512, canvasEl.getContext('2d').drawImage(a, 0, 0, 512, 512);
      let createTexture = val2.createTexture();
      val2.bindTexture(val2.TEXTURE_2D, createTexture), val2.pixelStorei(val2.UNPACK_FLIP_Y_WEBGL, true), val2.texParameteri(val2.TEXTURE_2D, val2.TEXTURE_WRAP_S, val2.REPEAT), val2.texParameteri(val2.TEXTURE_2D, val2.TEXTURE_WRAP_T, val2.REPEAT), val2.texParameteri(val2.TEXTURE_2D, val2.TEXTURE_MIN_FILTER, val2.LINEAR), val2.texParameteri(val2.TEXTURE_2D, val2.TEXTURE_MAG_FILTER, val2.LINEAR), val2.texImage2D(val2.TEXTURE_2D, 0, val2.RGBA, val2.RGBA, val2.UNSIGNED_BYTE, canvasEl), this.inputTexture = createTexture, this.inputImageSize = [512, 512], this.log("[WEBGL] Updated input texture size to POT canvas: 512x512");
    }
    ["setParamValue"](a, b) {
      this.paramValues[a] = b, this.log("[PARAM] " + a + " = " + JSON.stringify(b));
    }
    ["startRenderLoop"]() {
      this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
      let fn = a => {
        try {
          this.renderFrame(a), this.lastRenderError = null;
        } catch (val2) {
          let val3 = val2.name + ':\x20' + val2.message;
          this.lastRenderError !== val3 && (this.lastRenderError = val3, this.log("[ERROR] Render failed: " + val3));
        }
        this.animationFrameId = requestAnimationFrame(fn);
      };
      this.animationFrameId = requestAnimationFrame(fn), this.log("[WEBGL] Started animation render loop.");
    }
    ["stopRenderLoop"]() {
      this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
    }
    ["renderFrame"](a) {
      if (!this.program || !this.currentEffect) return;
      if (this.mode === "script") {
        this.renderScriptFrame(a);
        return;
      }
      let val2 = this.gl;
      val2.viewport(0, 0, this.canvas.width, this.canvas.height), val2.clearColor(0, 0, 0, 1), val2.clear(val2.COLOR_BUFFER_BIT), val2.useProgram(this.program), this.bindQuadAttributes();
      let val3 = this.canvas.width,
        val4 = this.canvas.height,
        val5 = (a - this.startTime) / 1000;
      this.setUniform2f("acLayerNorm", 1, 1), this.setUniform2f("acLayerSize", val3, val4), this.setUniform2f("acScreenNorm", 1, 1), this.setUniform2f("acScreenSize", val3, val4), this.setUniform2f("acLayerCenter", val3 * 0.5, val4 * 0.5), this.setUniform2f("acLayerCenterNorm", 0.5, 0.5), this.setUniform2f("acLayerSizeNorm", 1, 1), this.setUniform2f("acLayerPivot", 0, 0), this.setUniform2f("acPreviewSize", val3, val4), this.setUniform2f("acProjectSize", val3, val4), this.setUniform1i("acPass", 0), this.setUniform1f("acTime", val5), this.setUniform1f("acAngularVelocity", 0), this.setUniform1i("acShowGuides", 0);
      let float32Array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        val6 = this.uniformLocations.acLayerToScreen;
      val6 && val2.uniformMatrix4fv(val6, false, float32Array);
      let val7 = this.uniformLocations.acScreenToLayer;
      val7 && val2.uniformMatrix4fv(val7, false, float32Array);
      let n = 0,
        val8 = this.uniformNames || new Map();
      for (let val9 of this.currentEffect.params) {
        let val10 = this.paramValues[val9.id],
          val11 = val8.get(val9.id) || val9.id;
        if (val9.type === "texture") {
          val2.activeTexture(val2.TEXTURE0 + n), val2.bindTexture(val2.TEXTURE_2D, this.inputTexture);
          let val12 = this.uniformLocations['u_' + val9.id + "_texture"];
          val12 && val2.uniform1i(val12, n);
          let val13 = this.uniformLocations['u_' + val9.id + "_size"];
          val13 && val2.uniform2f(val13, this.inputImageSize[0], this.inputImageSize[1]), n++;
        } else val9.type === "spinner" || val9.type === "slider" || val9.type === "float" ? this.setUniform1f(val11, parseFloat(val10)) : val9.type === "switch" ? this.setUniform1i(val11, val10 ? 1 : 0) : val9.type === "selector" ? this.setUniform1i(val11, parseInt(val10, 10) || 0) : val9.type === "point" ? Array.isArray(val10) && this.setUniform2f(val11, val10[0], val10[1]) : val9.type === "xyz" || val9.type === "hue-disc" ? Array.isArray(val10) && this.setUniform3f(val11, val10[0], val10[1], val10[2]) : val9.type === "color" ? Array.isArray(val10) && this.setUniform4f(val11, val10[0], val10[1], val10[2], val10[3]) : val9.type === "orient" && Array.isArray(val10) && val10.length === 16 && this.setUniformMatrix4fv(val11, val10);
      }
      val2.drawArrays(val2.TRIANGLES, 0, 6);
    }
    ["bindQuadAttributes"]() {
      let val2 = this.gl,
        val3 = this.attribLocations.a_position;
      val3 >= 0 && (val2.bindBuffer(val2.ARRAY_BUFFER, this.positionBuffer), val2.enableVertexAttribArray(val3), val2.vertexAttribPointer(val3, 2, val2.FLOAT, false, 0, 0));
      let val4 = this.attribLocations.a_texCoord;
      val4 >= 0 && (val2.bindBuffer(val2.ARRAY_BUFFER, this.texCoordBuffer), val2.enableVertexAttribArray(val4), val2.vertexAttribPointer(val4, 2, val2.FLOAT, false, 0, 0));
    }
    ["computeScriptTransform"](a) {
      let val2 = (a.transform.angle || 0) * Math.PI / 180,
        cos = Math.cos(val2),
        sin = Math.sin(val2),
        val3 = a.transform.scale.x,
        val4 = a.transform.scale.y,
        val5 = (a.transform.location.x || 0) * (2 / this.canvas.width),
        val6 = -(a.transform.location.y || 0) * (2 / this.canvas.height);
      return new Float32Array([cos * val3, sin * val3, 0, -sin * val4, cos * val4, 0, val5, val6, 1]);
    }
    ["renderScriptFrame"](a) {
      let val2 = this.gl,
        val3 = (a - this.startTime) / 1000,
        val4;
      try {
        val4 = imported9(this.scriptSampleText || ''), this.scriptAnimator.animate(imported10(val3), val4, imported11(this.currentEffect, this.paramValues)), this.lastScriptError = null;
      } catch (val5) {
        let val6 = val5.name + ':\x20' + val5.message;
        this.lastScriptError !== val6 && (this.lastScriptError = val6, this.log("[ERROR] Script gagal: " + val6));
        return;
      }
      typeof val4.text == "string" && val4.text && val4.text !== this.lastScriptText && (this.lastScriptText = val4.text, this.log("[SCRIPT] el.text = " + JSON.stringify(val4.text))), val2.viewport(0, 0, this.canvas.width, this.canvas.height), val2.clearColor(0, 0, 0, 1), val2.clear(val2.COLOR_BUFFER_BIT), val2.useProgram(this.program), this.bindQuadAttributes(), val2.activeTexture(val2.TEXTURE0), val2.bindTexture(val2.TEXTURE_2D, this.inputTexture), this.setUniform1i("u_image", 0), this.setUniform1f("u_alpha", Math.max(0, Math.min(1, val4.alpha))), this.setUniformMatrix3fv("u_transform", this.computeScriptTransform(val4)), val2.drawArrays(val2.TRIANGLES, 0, 6);
    }
    ["setUniform1f"](a, b) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniform1f(val2, b);
    }
    ["setUniform1i"](a, b) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniform1i(val2, b);
    }
    ["setUniform2f"](a, b, c) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniform2f(val2, b, c);
    }
    ["setUniform3f"](a, b, c, d) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniform3f(val2, b, c, d);
    }
    ["setUniform4f"](a, b, c, d, arg) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniform4f(val2, b, c, d, arg);
    }
    ["setUniformMatrix3fv"](a, b) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniformMatrix3fv(val2, false, new Float32Array(b));
    }
    ["setUniformMatrix4fv"](a, b) {
      let val2 = this.uniformLocations[a];
      val2 && this.gl.uniformMatrix4fv(val2, false, new Float32Array(b));
    }
  },
  M = document.getElementById("render-canvas"),
  S = document.getElementById("logs-panel"),
  T = document.getElementById("error-overlay"),
  effectSelect = document.getElementById("effect-select"),
  $ = document.getElementById("image-upload"),
  V = document.getElementById("upload-filename"),
  controlsContainer = document.getElementById("controls-container");
document.querySelectorAll(".tab-btn").forEach(a => {
  a.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(a2 => a2.classList.remove("active")), document.querySelectorAll(".tab-pane").forEach(a2 => a2.classList.remove("active")), a.classList.add("active"), document.getElementById("tab-" + a.dataset.tab).classList.add("active");
  });
});
function handle(a) {
  document.getElementById("tbtn-" + a).click();
}
function process(a) {
  let divEl = document.createElement("div");
  divEl.className = "log-entry", a.startsWith("[XML]") ? divEl.classList.add("log-xml") : a.startsWith("[PARAM]") ? divEl.classList.add("log-param") : a.startsWith("[SHADER]") ? divEl.classList.add("log-shader") : a.startsWith("[WEBGL]") ? divEl.classList.add("log-webgl") : a.startsWith("[ERROR]") && divEl.classList.add("log-error"), divEl.textContent = a, S.appendChild(divEl), S.scrollTop = S.scrollHeight;
}
var val = null;
try {
  val = new R(M, process), build();
} catch (val2) {
  process("[ERROR] WebGL Init Failed: " + val2.message), T.style.display = "block", T.textContent = "WebGL Init Failed: " + val2.message;
}
async function compute(a) {
  if (T.style.display = "none", controlsContainer.innerHTML = '', !val) {
    process("[ERROR] Renderer not available");
    return;
  }
  try {
    let val2 = null;
    try {
      let val3 = await fetch("/api/effect-bin?id=" + encodeURIComponent(a));
      val3.ok && (val2 = imported2(await val3.arrayBuffer()));
    } catch {}
    if (!val2) {
      let val3 = null;
      try {
        let val4 = await fetch("/api/effect-xml?id=" + encodeURIComponent(a));
        val4.ok && (val3 = await val4.text());
      } catch {}
      if (val3 === null) {
        let val4 = await fetch("../effects/" + a);
        if (!val4.ok) throw new Error("HTTP " + val4.status + " loading ../effects/" + a);
        val3 = await val4.text();
      }
      val2 = imported(val3, a);
    }
    val.loadEffect(val2), bind(val2), val.startRenderLoop(), handle("params");
  } catch (val2) {
    let val3 = location.protocol === "file:" ? "\n\nBuka lewat web server: npm start lalu http://localhost:3000/runtime/preview.html" : '';
    /tidak punya fragment shader|native di Alight Motion|script bawaan/.test(val2.message) && (val3 = "\n\nEfek ini tidak punya shader/script — berjalan native di Alight Motion."), process("[ERROR] " + val2.message), T.style.display = "block", T.textContent = val2.message + val3;
  }
}
function arr(a, b, c) {
  let val2 = typeof a.step == "number" && a.step > 0 ? a.step : 0.01;
  if (a.min !== null && a.max !== null && a.min !== a.max) return [a.min, a.max, val2];
  if (a.type === "hue-disc") return [[0, 360, 1], [0, 1, 0.01], [-1, 1, 0.01]][b] || [-1, 1, 0.01];
  if (a.type === "color") return [0, 1, 0.01];
  if (a.type === "xyz" && (a.valueType === "rotate" || /rotat/i.test(a.id))) return [-180, 180, 0.5];
  let max = Math.max(100, Math.abs(Number(c) || 0) * 4);
  return [-max, max, val2];
}
function apply(a, b, c, d, arg) {
  let [res, res2, res3] = arr(a, d, c),
    divEl = document.createElement("div");
  divEl.className = "param-row";
  let divEl2 = document.createElement("div");
  divEl2.className = "param-header";
  let spanEl = document.createElement("span");
  spanEl.className = "param-label", spanEl.textContent = b;
  let spanEl2 = document.createElement("span");
  spanEl2.className = "param-val", spanEl2.textContent = Number(c).toFixed(3), divEl2.appendChild(spanEl), divEl2.appendChild(spanEl2);
  let inputEl = document.createElement("input");
  return inputEl.type = "range", inputEl.min = res, inputEl.max = res2, inputEl.step = res3, inputEl.value = c, inputEl.addEventListener("input", a2 => {
    let res4 = parseFloat(a2.target.value);
    spanEl2.textContent = res4.toFixed(3), arg(res4);
  }), divEl.appendChild(divEl2), divEl.appendChild(inputEl), divEl;
}
function get(a, b, c) {
  let divEl = document.createElement("div");
  divEl.className = "param-row";
  let divEl2 = document.createElement("div");
  divEl2.className = "param-header";
  let spanEl = document.createElement("span");
  spanEl.className = "param-label", spanEl.textContent = a;
  let spanEl2 = document.createElement("span");
  return spanEl2.className = "param-val", spanEl2.textContent = b, divEl2.appendChild(spanEl), divEl2.appendChild(spanEl2), divEl.appendChild(divEl2), c && divEl.appendChild(c), divEl;
}
function bind(a) {
  controlsContainer.innerHTML = '';
  let val2 = val.paramValues;
  if (!a.params.length) {
    controlsContainer.innerHTML = "<div class=\"layers-empty\">Tidak ada parameter</div>";
    return;
  }
  for (let val3 of a.params) {
    let val4 = val2[val3.id],
      val5 = val3.label && !val3.label.startsWith('@') ? val3.label : val3.id;
    if (val3.type === "texture") controlsContainer.appendChild(get(val5, "from Input Image", null));else {
      if (["spinner", "slider", "float"].includes(val3.type)) controlsContainer.appendChild(apply(val3, val5, Number(val4) || 0, 0, a2 => val.setParamValue(val3.id, a2)));else {
        if (val3.type === "switch") {
          let inputEl = document.createElement("input");
          inputEl.type = "checkbox", inputEl.checked = !!val4;
          let res = get(val5, val4 ? 'ON' : "OFF", inputEl);
          inputEl.addEventListener("change", () => {
            res.querySelector(".param-val").textContent = inputEl.checked ? 'ON' : "OFF", val.setParamValue(val3.id, inputEl.checked);
          }), controlsContainer.appendChild(res);
        } else {
          if (val3.type === "selector") {
            let selectEl = document.createElement("select");
            selectEl.className = "inline-select";
            for (let val6 of val3.choices) {
              let optionEl = document.createElement("option");
              optionEl.value = val6.value, optionEl.textContent = val6.label, selectEl.appendChild(optionEl);
            }
            selectEl.value = String(val4), selectEl.addEventListener("change", () => val.setParamValue(val3.id, parseInt(selectEl.value, 10) || 0)), controlsContainer.appendChild(get(val5, String(val4), selectEl));
          } else {
            if (val3.type === "color") {
              let val6 = Array.isArray(val4) ? val4.slice() : [1, 1, 1, 1],
                divEl = document.createElement("div");
              divEl.className = "color-swatch";
              let fn = () => {
                let fn2 = a2 => Math.round(Math.max(0, Math.min(1, a2)) * 255);
                divEl.style.background = "rgb(" + fn2(val6[0]) + ',' + fn2(val6[1]) + ',' + fn2(val6[2]) + ')', divEl.style.opacity = String(Math.max(0.15, val6[3]));
              };
              fn(), controlsContainer.appendChild(get(val5, "RGBA", divEl)), ['R', 'G', 'B', 'A'].forEach((a2, b) => controlsContainer.appendChild(apply(val3, val5 + '.' + a2, val6[b], b, a3 => {
                val6[b] = a3, fn(), val.setParamValue(val3.id, val6.slice());
              })));
            } else {
              if (["point", "xyz", "hue-disc"].includes(val3.type)) {
                let val6 = val3.type === "point" ? ['x', 'y'] : ['x', 'y', 'z'],
                  val7 = Array.isArray(val4) ? val4.slice() : val6.map(() => 0);
                val6.forEach((a2, b) => controlsContainer.appendChild(apply(val3, val5 + '.' + a2, val7[b], b, a3 => {
                  val7[b] = a3, val.setParamValue(val3.id, val7.slice());
                })));
              } else controlsContainer.appendChild(get(val5, String(val4), null));
            }
          }
        }
      }
    }
  }
}
function build() {
  let canvasEl = document.createElement("canvas");
  canvasEl.width = 512, canvasEl.height = 512;
  let ctx = canvasEl.getContext('2d'),
    n = 64;
  for (let n2 = 0; n2 < 512; n2 += n) for (let n3 = 0; n3 < 512; n3 += n) ctx.fillStyle = (n2 / n + n3 / n) % 2 === 0 ? "#ff5722" : "#3f51b5", ctx.fillRect(n2, n3, n, n);
  ctx.fillStyle = "#fff", ctx.font = "bold 32px sans-serif", ctx.textAlign = "center", ctx.fillText("ALIGHT MOTION", 256, 250), ctx.fillText("PREVIEW TEST", 256, 296), val.setInputImage(canvasEl);
}
$.addEventListener("change", a => {
  let val2 = a.target.files[0];
  if (!val2) return;
  V.textContent = val2.name, document.getElementById("upload-btn-text").textContent = val2.name;
  let image = new Image();
  image.onload = () => val.setInputImage(image), image.src = URL.createObjectURL(val2);
}), effectSelect.addEventListener("change", a => compute(a.target.value));
async function handle2() {
  try {
    let val3 = await fetch("/api/effects");
    if (val3.ok) {
      let items = ((await val3.json()).files || []).map(a => a.name);
      if (items.length) return items;
    }
  } catch {}
  let val2 = await fetch("../effects/");
  return val2.ok ? [...(await val2.text()).matchAll(/href="([^"]+\.xml)"/gi)].map(a => decodeURIComponent(a[1].split('/').pop().split('?')[0])) : [];
}
async function process2() {
  try {
    let sort = [...new Set(await handle2())].sort((a, b) => a.localeCompare(b));
    if (!sort.length) return;
    let val2 = effectSelect.value || "tile.xml";
    effectSelect.innerHTML = '';
    for (let val3 of sort) {
      let optionEl = document.createElement("option");
      optionEl.value = val3, optionEl.textContent = val3, effectSelect.appendChild(optionEl);
    }
    effectSelect.value = sort.includes(val2) ? val2 : sort[0], process("[XML] " + sort.length + " efek ditemukan");
  } catch (val2) {
    process("[XML] Gagal membaca daftar efek: " + val2.message);
  }
}
process2().then(() => compute(effectSelect.value));