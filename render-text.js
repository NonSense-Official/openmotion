import { applyHelperValue, enginehintEl, expendsecEl, expendseclabEl, exphintEl, expstartsecEl, expstartseclEl, getHelperValue, localTertiary, localValue, logEl, mediapickerdEl, mediapickergEl, mediapickertEl, projectScene, renderer, urlamEl, urlamgoEl, urlampickEl, urlampickrowEl, urlamstateEl, urldriveEl, urldrivegoEl, urldrivestatEl, valueCurrent, valueExtra } from './state.js';
import { applyElement, getElHelper, handleHelperRaw } from './ui-shell.js';
import { applyHelper, buildHelperList, computeHelper, refFail, renderHelper } from './engine-core.js';
import { updateHelperValue } from './ui-properties.js';
function process(outerHtml) {
  if (!outerHtml) return '';
  if (typeof outerHtml.outerHTML == "string") return outerHtml.outerHTML;
  let processValueParsed = Object.entries(outerHtml.attributes || {}).map(([processArgMax, processArgByKey]) => '\x20' + processArgMax + '=\x22' + String(processArgByKey).replace(/"/g, "&quot;") + '\x22').join(''),
    processValue = outerHtml.tagName || "node",
    processValueClamped = (outerHtml.children || []).map(process).join(''),
    processValueScoped = outerHtml.textContent ? outerHtml.textContent.trim() : '';
  return processValueClamped || processValueScoped ? '<' + processValue + processValueParsed + '>' + processValueClamped + processValueScoped + '</' + processValue + '>' : '<' + processValue + processValueParsed + " />";
}
function appendLog(appendLogArg) {
  valueCurrent.push(appendLogArg), valueCurrent.length > 400 && valueCurrent.shift(), logEl.textContent = valueCurrent.join('\x0a'), logEl.scrollTop = logEl.scrollHeight;
}
var localItemRaw = appendLog;
appendLog = function (argCompared) {
  if (localItemRaw(argCompared), window.AM && Array.isArray(window.AM.$e)) {
    for (let localNodeInner of window.AM.$e) try {
      localNodeInner(argCompared);
    } catch {}
  }
};
function bind(bindValue, bindCallback, bindCondition) {
  bindCondition && (mediapickertEl.textContent = bindCondition), mediapickergEl.innerHTML = '', localValue.length || (mediapickergEl.innerHTML = "<div class=\"empty\" style=\"grid-column:1/-1\">Belum ada foto/video. Impor dulu lewat \"Galeri media\".</div>");
  for (let bindTextContent of localValue) {
    let buttonEl = document.createElement("button");
    buttonEl.type = "button", buttonEl.className = "g-item pick-btn" + (bindTextContent === bindValue ? " g-current" : ''), buttonEl.appendChild(handleHelperRaw(bindTextContent, "g-thumb", {
      preview: false
    }));
    let divEl = document.createElement("div");
    divEl.className = "g-meta", divEl.textContent = bindTextContent, divEl.title = bindTextContent, buttonEl.appendChild(divEl), buttonEl.addEventListener("click", () => {
      mediapickerdEl.close(), bindCallback(bindTextContent);
    }), mediapickergEl.appendChild(buttonEl);
  }
  mediapickerdEl.showModal();
}
function updateHelperEnd() {
  for (let updateText of localTertiary) {
    let updateTextContent = updateText.text();
    updateTextContent && updateText.el.textContent !== updateTextContent && (updateText.el.textContent = updateTextContent);
  }
}
async function flagHelper(flagHelperFlag = null, directUrl = null) {
  let trim = directUrl ? directUrl.trim() : (urlamEl ? urlamEl.value.trim() : "");
  if (!trim) {
    if (urlamstateEl) urlamstateEl.textContent = "isi link Alight Motion dulu";
    throw new Error("Link Alight Motion kosong");
  }
  if (urlamgoEl) urlamgoEl.disabled = true;
  if (urlamstateEl) urlamstateEl.textContent = "mengambil XML + media...";
  computeHelper("xml", "Mengambil XML + media dari link share…");
  try {
    let applyXml = await refFail("/api/project-xml", trim, flagHelperFlag ? {
        project: flagHelperFlag
      } : null);
    if (!applyXml || !applyXml.xml) {
      throw new Error((applyXml && applyXml.error) || "Format respon proyek tidak valid");
    }
    let xmlValue = applyXml.xml;
    renderHelper("xml", "Mendaftarkan media package…", (applyXml.media || []).length + " file");
    let applyBuild = buildHelperList(applyXml.media);
    Array.isArray(applyXml.projects) && applyXml.projects.length > 1 ? (urlampickEl.innerHTML = '', applyXml.projects.forEach(applyTitle => {
      let optionEl = document.createElement("option");
      optionEl.value = applyTitle.name, optionEl.textContent = applyTitle.title || applyTitle.name, applyTitle.name === applyXml.xmlName && (optionEl.selected = true), urlampickEl.appendChild(optionEl);
    }), urlampickrowEl && (urlampickrowEl.style.display = '')) : (urlampickrowEl && (urlampickrowEl.style.display = "none")), urlamstateEl && (urlamstateEl.textContent = "XML " + applyXml.xmlName + '\x20(' + xmlValue.length.toLocaleString("id-ID") + " karakter) + " + applyBuild + " media"), appendLog("[URL] XML \"" + applyXml.xmlName + "\" dari link Alight Motion didapat (" + xmlValue.length + " karakter, " + applyBuild + " media)."), await applyHelperValue([new File([xmlValue], applyXml.xmlName || "alight-url.xml", {
      type: "application/xml"
    })]);
  } catch (applyMessage) {
    if (urlamstateEl) urlamstateEl.textContent = "gagal: " + applyMessage.message;
    appendLog("[URL] Alight Motion gagal: " + applyMessage.message);
    getHelperValue("Gagal mengambil link Alight Motion: " + applyMessage.message);
    throw applyMessage;
  } finally {
    if (urlamgoEl) urlamgoEl.disabled = false;
    applyHelper("xml");
  }
}
async function getFlag(directUrl = null) {
  let trim = directUrl ? directUrl.trim() : (urldriveEl ? urldriveEl.value.trim() : "");
  if (!trim) {
    if (urldrivestatEl) urldrivestatEl.textContent = "isi link Google Drive dulu";
    throw new Error("Link Google Drive kosong");
  }
  if (urldrivegoEl) urldrivegoEl.disabled = true;
  if (urldrivestatEl) urldrivestatEl.textContent = "mengambil XML dari Drive...";
  computeHelper("xml", "Mengambil XML dari Google Drive…");
  try {
    let getXml = await refFail("/api/drive-xml", trim);
    if (!getXml || !getXml.xml) {
      throw new Error((getXml && getXml.error) || "Gagal mengambil XML dari Google Drive");
    }
    let getValueEnd = getXml.xml;
    if (urldrivestatEl) urldrivestatEl.textContent = "XML " + getXml.name + '\x20(' + getValueEnd.length.toLocaleString("id-ID") + " karakter)";
    appendLog("[DRIVE] XML \"" + getXml.name + "\" dari Google Drive didapat (" + getValueEnd.length + " karakter).");
    await applyHelperValue([new File([getValueEnd], getXml.name || "drive.xml", {
      type: "application/xml"
    })]);
  } catch (getMessage) {
    if (urldrivestatEl) urldrivestatEl.textContent = "gagal: " + getMessage.message;
    appendLog("[DRIVE] gagal: " + getMessage.message);
    getHelperValue("Gagal mengambil XML dari Google Drive: " + getMessage.message);
    throw getMessage;
  } finally {
    if (urldrivegoEl) urldrivegoEl.disabled = false;
    applyHelper("xml");
  }
}
function updateHelperParsed() {
  let updateHelperParsedValue = projectScene && projectScene.totalTime / 1000 || 0,
    updateValueSource = Number(expstartsecEl?.["value"]) || 0,
    updateValueList = Number(expendsecEl?.["value"]) || updateHelperParsedValue;
  expstartseclEl && (expstartseclEl.textContent = updateValueSource.toFixed(1) + '\x20s'), expendseclabEl && (expendseclabEl.textContent = updateValueList >= updateHelperParsedValue - 0.05 ? "full" : updateValueList.toFixed(1) + '\x20s'), expstartsecEl && updateHelperValue(expstartsecEl), expendsecEl && updateHelperValue(expendsecEl);
}
function helperOuter() {
  !enginehintEl || !renderer || (enginehintEl.textContent = "WebGL" + renderer.webglVersion + " - efek " + (renderer.effectsEnabled ? 'ON' : "OFF") + " - video " + (renderer.directVideoEnabled ? "tekstur GPU" : "kanvas 2D (fallback)") + " - embedScene " + (renderer.force2DSubScene ? "kanvas 2D (fallback)" : "GPU") + " - overscan " + renderer.overscanMax + " - media " + renderer.mediaScale + "x - drift " + renderer.videoDriftMs + "ms - cache FBO " + Math.round((renderer.targetBudget || 0) / 1048576) + " MB" + (renderer.exp ? " - EKSPERIMEN: " + renderer.exp.active.length : ''));
}
function renderHelperMin() {
  if (!exphintEl) return;
  let renderHelperMinValue = renderer && renderer.exp;
  exphintEl.textContent = renderHelperMinValue ? "EKSPERIMEN AKTIF: " + renderHelperMinValue.active.join(" | ") + " - efek dilewati: " + (renderer.W ? renderer.W.skipped : 0) : "Eksperimen mati (perilaku normal)";
}
function refHelperMap() {
  let refHelperMapValue = new Map();
  for (let refLayer of valueExtra) {
    let refHelperMapValueRaw = refLayer.layer.font || '';
    if (!refHelperMapValueRaw.includes("imported?name=")) continue;
    let match = refHelperMapValueRaw.match(/name=([^&]+)/);
    if (!match) continue;
    let refDecodeUriComponent = decodeURIComponent(match[1]);
    refHelperMapValue.set(refDecodeUriComponent.replace(/\.[^/.]+$/, ''), refDecodeUriComponent);
  }
  return refHelperMapValue;
}
function handleOuter(handleOuterFlag) {
  let handleGetEl = getElHelper("sp-start");
  if (handleGetEl) {
    handleGetEl.hidden = !handleOuterFlag;
    for (let handleOutput of ["sp-media", "sp-audio", "sp-text", "sTabs", "sTransport"]) {
      let handleHidden = getElHelper(handleOutput);
      handleHidden && (handleHidden.hidden = !!handleOuterFlag);
    }
    handleOuterFlag ? (getElHelper("sTitle").textContent = "Masukkan link Alight Motion", getElHelper("sAlightError").hidden = true, getElHelper("sAlightInput").focus({
      preventScroll: true
    })) : (getElHelper("sTabs").hidden = false, getElHelper("sTransport").hidden = false);
  }
}
async function processStart() {
  let processFlag = getElHelper("sAlightInput"),
    processGetEl = getElHelper("sAlightError"),
    processOuter = processFlag ? processFlag.value.trim() : '';
  if (!processOuter) {
    processGetEl.textContent = "Masukkan link Alight Motion dulu.", processGetEl.hidden = false;
    return;
  }
  processGetEl.hidden = true;
  let processDisabled = getElHelper("sAlightLoad");
  processDisabled && (processDisabled.disabled = true);
  try {
    await window.AM.loadPreset(processOuter), handleOuter(false), applyElement("media");
  } catch (processMessage) {
    processGetEl.textContent = "Gagal membuka preset: " + processMessage.message, processGetEl.hidden = false, appendLog("[SIMPLE] " + processMessage.message);
  } finally {
    processDisabled && (processDisabled.disabled = false);
  }
}
function omMultiRefreshStyles() {
  const ommultirefreValue = document.getElementById("om-am-style") || document.getElementById("om-feature-style");
  if (!ommultirefreValue) return;
  if (ommultirefreValue.textContent.indexOf("#omMultiBar") < 0) ommultirefreValue.textContent += `
#omMultiBar{position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:902;display:flex;gap:8px;background:var(--panel);border:1px solid var(--line2);border-radius:12px;padding:8px 10px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
#omMultiBar button{background:var(--card);border:1px solid var(--line2);color:var(--text);border-radius:8px;padding:7px 12px;font-size:13px;cursor:pointer}
#omMultiBar button:hover{background:var(--card2)}
#omMultiBar .primary{background:var(--accent)!important;color:#03231A!important;border-color:transparent!important}
.tl-label.om-multi{outline:2px solid var(--accent);border-radius:6px;background:rgba(0,255,169,.08)}
.tl-eye.om-multi{color:var(--accent)}
.tl-block.om-multi{outline:1px solid var(--accent);box-shadow:0 0 0 1px var(--accent)}
`;
}
export { appendLog, bind, flagHelper, getFlag, handleOuter, helperOuter, omMultiRefreshStyles, process, processStart, refHelperMap, renderHelperMin, updateHelperEnd, updateHelperParsed };
