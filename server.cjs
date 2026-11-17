const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const nodeUrl = require("url");
const crypto = require("crypto");

const PORT = Number(process.env.OM_PORT) || 3000;
const PUBLIC_DIR = __dirname;
const REMOTE_HOST = "am.zervida.my.id";
const ROOT = process.env.OM_STORAGE || path.join(__dirname, "storage");
const PROJECTS_DIR = path.join(ROOT, "projects");
const DAY_MS = 24 * 3600 * 1000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".xml": "application/xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime"
};

fs.mkdirSync(PROJECTS_DIR, { recursive: true });
process.on("uncaughtException", localMessage => console.error("[uncaught]", localMessage && localMessage.message));
process.on("unhandledRejection", message => console.error("[unhandled]", message && message.message));

function ensureDir(ensureDirValue) {
  fs.mkdirSync(ensureDirValue, { recursive: true });
}
function sha(shaValue) {
  return crypto.createHash("sha256").update(String(shaValue)).digest("hex");
}
function randId(randIdArg = 22) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(randIdArg);
  let randIdText = "";
  for (let randIdNumber = 0; randIdNumber < randIdArg; randIdNumber++) randIdText += alphabet[bytes[randIdNumber] % alphabet.length];
  return randIdText;
}
const isValidId = id => /^[A-Za-z0-9_-]{16,64}$/.test(id || "");
const safeName = safeNameCondition => String(safeNameCondition || "").replace(/[\\/:*?"<>|]/g, "_").slice(0, 180);
const projDir = id => path.join(PROJECTS_DIR, id);
const metaPath = id => path.join(projDir(id), "meta.json");
const scenePath = id => path.join(projDir(id), "scene.xml");

function readMeta(id) {
  try {
    return JSON.parse(fs.readFileSync(metaPath(id), "utf8"));
  } catch (readMetaResult) {
    return null;
  }
}
function writeMeta(id, meta) {
  ensureDir(projDir(id));
  fs.writeFileSync(metaPath(id), JSON.stringify(meta));
}
function touchMeta(id) {
  const touchMetaReadMeta = readMeta(id);
  if (!touchMetaReadMeta) return;
  touchMetaReadMeta.lastSeen = Date.now();
  writeMeta(id, touchMetaReadMeta);
}
function uidOf(uidOfHeaders) {
  const cookies = String(uidOfHeaders.headers.cookie || "").split(";").map(uidOfArg => uidOfArg.trim());
  for (const uidOfValue of cookies) {
    if (uidOfValue.startsWith("om_uid=")) {
      const decodeUriComponent = decodeURIComponent(uidOfValue.slice(7));
      if (/^[A-Za-z0-9_-]{10,64}$/.test(decodeUriComponent)) return decodeUriComponent;
    }
  }
  return "u" + randId(20);
}
function newUidCookie(newUidCookieArg) {
  return `om_uid=${newUidCookieArg}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
function readBody(readBodyOn, limit = 200 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    readBodyOn.on("data", readBodyArg => {
      size += readBodyArg.length;
      if (size > limit) {
        reject(new Error("body too large"));
        readBodyOn.destroy();
        return;
      }
      chunks.push(readBodyArg);
    });
    readBodyOn.on("end", () => resolve(Buffer.concat(chunks)));
    readBodyOn.on("error", reject);
  });
}
function json(writeHead, code, jsonValue) {
  const body = JSON.stringify(jsonValue);
  writeHead.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  writeHead.end(body);
  return true;
}
function cleanupExpired() {
  let removed = 0;
  let entries = [];
  try {
    entries = fs.readdirSync(PROJECTS_DIR);
  } catch (cleanupExpiredValue) {
    return removed;
  }
  const cleanupExpiredNow = Date.now();
  for (const id of entries) {
    const cleanupExpiredReadMeta = readMeta(id);
    const last = cleanupExpiredReadMeta && (cleanupExpiredReadMeta.lastSeen || cleanupExpiredReadMeta.createdAt) || 0;
    if (cleanupExpiredNow - last > DAY_MS) {
      try {
        fs.rmSync(projDir(id), { recursive: true, force: true });
        removed++;
      } catch (cleanupExpiredResult) {}
    }
  }
  if (removed) console.log(`[storage] dibersihkan ${removed} proyek lewat 24 jam`);
  return removed;
}
cleanupExpired();
setInterval(cleanupExpired, 60 * 60 * 1000).unref();

let effectIndex = null;
function loadEffectIndex() {
  if (!effectIndex) {
    try {
      effectIndex = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, "effect-index.json"), "utf8"));
    } catch (loadEffectIndexValue) {
      effectIndex = {};
    }
  }
  return effectIndex;
}

function fetchRemoteProjectXml(targetUrl, project = null) {
  return new Promise((resolve, reject) => {
    let fetchRemoteProjeText = `/api/project-xml?url=${encodeURIComponent(targetUrl)}`;
    if (project) fetchRemoteProjeText += `&project=${encodeURIComponent(project)}`;
    const fetchRemoteProjectXmlRequest = https.request({
      hostname: REMOTE_HOST,
      port: 443,
      path: fetchRemoteProjeText,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `https://${REMOTE_HOST}/runtime/preset.html`,
        "Accept": "application/json, text/plain, */*"
      }
    }, fetchRemoteProjectXmlOn => {
      let body = "";
      fetchRemoteProjectXmlOn.on("data", fetchRemoteProjectXmlArg => body += fetchRemoteProjectXmlArg);
      fetchRemoteProjectXmlOn.on("end", () => {
        if (fetchRemoteProjectXmlOn.statusCode >= 200 && fetchRemoteProjectXmlOn.statusCode < 300) {
          try {
            const projectData = JSON.parse(body);
            if (projectData && (projectData.xml || projectData.success || projectData.projects)) {
              return resolve(projectData);
            }
          } catch (fetchRemoteProjectXmlValue) {}
        }
        reject(new Error(`Server preset mengembalikan HTTP ${fetchRemoteProjectXmlOn.statusCode}`));
      });
    });
    fetchRemoteProjectXmlRequest.on("error", reject);
    fetchRemoteProjectXmlRequest.setTimeout(60000, () => {
      fetchRemoteProjectXmlRequest.destroy();
      reject(new Error("Timeout saat menghubungi server preset"));
    });
    fetchRemoteProjectXmlRequest.end();
  });
}

async function resolveProjectXml(targetUrl, project = null) {
  if (!targetUrl) throw new Error("URL tidak boleh kosong");
  targetUrl = targetUrl.trim();

  // Alight Creative share link / shortlink -> gunakan backend extractor (bisa semua ukuran file, >5 MB bebas)
  if (targetUrl.includes("alightcreative.com/") || targetUrl.includes("alight.link/") || targetUrl.includes("alightcreative.page.link/")) {
    return await fetchRemoteProjectXml(targetUrl, project);
  }

  // Google Drive
  const driveMatch = targetUrl.match(/(?:\/file\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{25,})/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    const downloadUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
    const resolveProjectXmlResult = await fetchUrlText(downloadUrl);
    if (!/<scene[\s>]|<element[\s>]/i.test(resolveProjectXmlResult)) {
      throw new Error("File Google Drive bukan merupakan file XML Alight Motion yang valid");
    }
    return {
      xml: resolveProjectXmlResult,
      xmlName: "drive-" + fileId + ".xml",
      media: []
    };
  }

  // Direct XML URL
  const resolveProjectXmlValue = await fetchUrlText(targetUrl);
  if (/<scene[\s>]|<element[\s>]/i.test(resolveProjectXmlValue)) {
    let name = "preset.xml";
    try { name = path.basename(new URL(targetUrl).pathname) || name; } catch (resolveProjectXmlValueRaw) {}
    return {
      xml: resolveProjectXmlValue,
      xmlName: name,
      media: []
    };
  }

  // Fallback coba ke backend preset
  return await fetchRemoteProjectXml(targetUrl);
}

function fetchUrlText(fetchUrlTextArg) {
  return new Promise((resolve, reject) => {
    const isHttps = fetchUrlTextArg.startsWith("https:");
    const fetchUrlTextValue = isHttps ? https : http;
    fetchUrlTextValue.get(fetchUrlTextArg, { headers: { "User-Agent": "Mozilla/5.0" } }, statusCode => {
      if (statusCode.statusCode >= 300 && statusCode.statusCode < 400 && statusCode.headers.location) {
        return resolve(fetchUrlText(statusCode.headers.location));
      }
      let fetchUrlTextResult = "";
      statusCode.on("data", fetchUrlTextArgValue => fetchUrlTextResult += fetchUrlTextArgValue);
      statusCode.on("end", () => resolve(fetchUrlTextResult));
    }).on("error", reject);
  });
}

async function handleApi(method, setHeader, pathname, query) {
  const handleApiUidOf = uidOf(method);
  setHeader.setHeader("Set-Cookie", newUidCookie(handleApiUidOf));
  const parts = pathname.split("/").filter(Boolean); // ["api","project",id,...]

  // /api/projects — daftar proyek & simpan proyek
  if (pathname === "/api/projects") {
    if (method.method === "POST") {
      try {
        const handleApiResult = (await readBody(method, 60 * 1024 * 1024)).toString("utf8");
        const body = JSON.parse(handleApiResult);
        const id = (body.id && isValidId(body.id)) ? body.id : randId(22);
        const handleApiValue = readMeta(id) || { createdAt: Date.now(), owner: handleApiUidOf };
        handleApiValue.name = String(body.name || "Proyek").slice(0, 200);
        handleApiValue.width = Number(body.width) || 720;
        handleApiValue.height = Number(body.height) || 1280;
        handleApiValue.fps = Number(body.fps) || 30;
        if (typeof body.thumb === "string") handleApiValue.thumb = body.thumb.slice(0, 300000);
        handleApiValue.lastSeen = Date.now();
        handleApiValue.updatedAt = Date.now();
        ensureDir(projDir(id));
        if (body.xml) fs.writeFileSync(scenePath(id), String(body.xml));
        writeMeta(id, handleApiValue);
        return json(setHeader, 200, { ok: true, id, updatedAt: handleApiValue.updatedAt });
      } catch (handleApiMessage) {
        return json(setHeader, 500, { error: "save_failed", message: handleApiMessage.message });
      }
    }

    const handleApiItems = [];
    let entries = [];
    try {
      entries = fs.readdirSync(PROJECTS_DIR);
    } catch (valueParsed) {}
    for (const id of entries) {
      const handleApiReadMeta = readMeta(id);
      if (!handleApiReadMeta) continue;
      if (process.env.OM_MULTIUSER && handleApiReadMeta.owner && handleApiReadMeta.owner !== handleApiUidOf) continue;
      let width = handleApiReadMeta.width;
      let height = handleApiReadMeta.height;
      let handleApiFps = handleApiReadMeta.fps;
      if (!width || !height) {
        try {
          const readFileSync = fs.readFileSync(scenePath(id), "utf8");
          const valueScoped = readFileSync.match(/width="(\d+)"/);
          const handleApiFlag = readFileSync.match(/height="(\d+)"/);
          const flagValue = readFileSync.match(/fps="(\d+)"/);
          if (valueScoped) width = parseInt(valueScoped[1], 10);
          if (handleApiFlag) height = parseInt(handleApiFlag[1], 10);
          if (flagValue) handleApiFps = parseInt(flagValue[1], 10);
        } catch (handleApiParsed) {}
      }
      handleApiItems.push({
        id,
        name: handleApiReadMeta.name || "Proyek",
        lastSeen: handleApiReadMeta.lastSeen || 0,
        updatedAt: handleApiReadMeta.updatedAt || 0,
        hasPassword: !!handleApiReadMeta.passwordHash,
        width: width || 720,
        height: height || 1280,
        fps: handleApiFps || 30,
        thumb: handleApiReadMeta.thumb || null
      });
    }
    handleApiItems.sort((lastSeen, lastSeenArg) => (lastSeenArg.lastSeen || 0) - (lastSeen.lastSeen || 0));
    json(setHeader, 200, { uid: handleApiUidOf, projects: handleApiItems });
    return true;
  }

  if (parts[0] === "api" && parts[1] === "project" && isValidId(parts[2])) {
    const id = parts[2];
    const rest = parts.slice(3).join("/");

    // GET /api/project/<id> → meta
    if (method.method === "GET" && rest === "") {
      const readMetaValue = readMeta(id);
      if (!readMetaValue) return json(setHeader, 404, { error: "not_found" });
      json(setHeader, 200, { id, name: readMetaValue.name || "Proyek", hasPassword: !!readMetaValue.passwordHash, owner: readMetaValue.owner === handleApiUidOf, updatedAt: readMetaValue.updatedAt || 0, uploads: readMetaValue.uploads || [] });
      return true;
    }

    // GET /api/project/<id>/scene → XML (terkunci password kalau diset)
    if (method.method === "GET" && rest === "scene") {
      const handleApiPasswordHash = readMeta(id);
      if (!handleApiPasswordHash) return json(setHeader, 404, { error: "not_found" });
      if (handleApiPasswordHash.passwordHash) {
        const pass = String(method.headers["x-om-pass"] || "");
        if (sha((handleApiPasswordHash.passwordSalt || "") + pass) !== handleApiPasswordHash.passwordHash) {
          return json(setHeader, 401, { error: "need_password" });
        }
      }
      touchMeta(id);
      try {
        const handleApiReadFileSync = fs.readFileSync(scenePath(id), "utf8");
        setHeader.writeHead(200, { "Content-Type": "application/xml", "Cache-Control": "no-store" });
        setHeader.end(handleApiReadFileSync);
      } catch (handleApiValueClamped) {
        json(setHeader, 404, { error: "scene_missing" });
      }
      return true;
    }

    // POST /api/project/<id>/unlock
    if (method.method === "POST" && rest === "unlock") {
      const passwordSalt = readMeta(id);
      if (!passwordSalt) return json(setHeader, 404, { error: "not_found" });
      try {
        const body = JSON.parse((await readBody(method, 64 * 1024)).toString("utf8") || "{}");
        const handleApiValueScoped = sha((passwordSalt.passwordSalt || "") + String(body.password || "")) === passwordSalt.passwordHash;
        if (handleApiValueScoped) touchMeta(id);
        json(setHeader, handleApiValueScoped ? 200 : 403, handleApiValueScoped ? { ok: true } : { error: "wrong_password" });
      } catch (valueClamped) {
        json(setHeader, 400, { error: "bad_request" });
      }
      return true;
    }

    // POST /api/project/<id> → simpan (nama + xml + opsional password + uploads manifest)
    if (method.method === "POST" && rest === "") {
      try {
        const handleApiScoped = (await readBody(method, 60 * 1024 * 1024)).toString("utf8");
        let body;
        try {
          body = JSON.parse(handleApiScoped);
        } catch (handleApiClamped) {
          return json(setHeader, 400, { error: "invalid_json" });
        }
        const passwordHash = readMeta(id) || { createdAt: Date.now(), owner: handleApiUidOf };
        if (passwordHash.passwordHash && passwordHash.owner !== handleApiUidOf) {
          const pass = String(method.headers["x-om-pass"] || body.password || "");
          if (sha((passwordHash.passwordSalt || "") + pass) !== passwordHash.passwordHash) return json(setHeader, 403, { error: "forbidden" });
        }
        passwordHash.name = String(body.name || passwordHash.name || "Proyek").slice(0, 200);
        if (body.width) passwordHash.width = Number(body.width);
        if (body.height) passwordHash.height = Number(body.height);
        if (body.fps) passwordHash.fps = Number(body.fps);
        if (typeof body.thumb === "string") passwordHash.thumb = body.thumb.slice(0, 300000);
        if (typeof body.password === "string" && body.password.length > 0) {
          passwordHash.passwordSalt = passwordHash.passwordSalt || randId(12);
          passwordHash.passwordHash = sha(passwordHash.passwordSalt + body.password);
        }
        if (Array.isArray(body.uploads)) passwordHash.uploads = body.uploads.slice(0, 500);
        passwordHash.lastSeen = Date.now();
        passwordHash.updatedAt = Date.now();
        ensureDir(projDir(id));
        fs.writeFileSync(scenePath(id), String(body.xml || ""));
        writeMeta(id, passwordHash);
        json(setHeader, 200, { ok: true, id, updatedAt: passwordHash.updatedAt });
      } catch (messageValue) {
        json(setHeader, 500, { error: "save_failed", message: messageValue.message });
      }
      return true;
    }

    // DELETE /api/project/<id>
    if (method.method === "DELETE" && rest === "") {
      try {
        const handleApiProjDir = projDir(id);
        if (fs.existsSync(handleApiProjDir)) {
          fs.rmSync(handleApiProjDir, { recursive: true, force: true });
        }
        json(setHeader, 200, { ok: true, id });
      } catch (handleApiRaw) {
        json(setHeader, 500, { error: "delete_failed", message: handleApiRaw.message });
      }
      return true;
    }

    // POST /api/project/<id>/upload?name=file.png  (raw body = file)
    if (method.method === "POST" && rest === "upload") {
      const handleApiLastSeen = readMeta(id);
      if (!handleApiLastSeen) return json(setHeader, 404, { error: "not_found" });
      try {
        const qName = typeof query.get === "function" ? query.get("name") : query.name;
        const name = safeName(qName || "file.bin");
        const handleApiValueRaw = await readBody(method, 200 * 1024 * 1024);
        ensureDir(path.join(projDir(id), "uploads"));
        fs.writeFileSync(path.join(projDir(id), "uploads", name), handleApiValueRaw);
        handleApiLastSeen.lastSeen = Date.now();
        writeMeta(id, handleApiLastSeen);
        json(setHeader, 200, { ok: true, url: `/uploads/${id}/${encodeURIComponent(name)}`, name });
      } catch (handleApiValueParsed) {
        json(setHeader, 500, { error: "upload_failed", message: handleApiValueParsed.message });
      }
      return true;
    }
    return false;
  }

  // GET /uploads/<id>/<file>
  if (pathname.startsWith("/uploads/") && method.method === "GET") {
    const id = parts[1];
    const file = parts.slice(2).join("/");
    if (!isValidId(id) || !file) {
      json(setHeader, 404, { error: "not_found" });
      return true;
    }
    const full = path.join(projDir(id), "uploads", path.basename(file));
    if (!full.startsWith(path.join(projDir(id), "uploads")) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
      json(setHeader, 404, { error: "not_found" });
      return true;
    }
    const valueRaw = path.extname(full).toLowerCase();
    setHeader.writeHead(200, { "Content-Type": MIME_TYPES[valueRaw] || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" });
    fs.createReadStream(full).pipe(setHeader);
    return true;
  }
  return false;
}

const server = http.createServer(async (request, response) => {
  const parsedUrl = nodeUrl.parse(request.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  const query = parsedUrl.query;
  if (pathname === "/") pathname = "/index.html";

  try {
    if (pathname.startsWith("/api/") || pathname.startsWith("/uploads/")) {
      const handled = await handleApi(request, response, pathname, parsedUrl.query);
      if (handled) return;
    }

    // deep-link: /proyek/<id> → app shell; /proyek/... file assets → resolusi dari root
    if (pathname === "/proyek" || pathname.startsWith("/proyek/")) {
      const cleaned = pathname.replace(/^\/proyek(\/[A-Za-z0-9_-]{8,64})?/, "");
      if (/\.[a-z0-9]+$/i.test(cleaned)) {
        pathname = cleaned.startsWith("/") ? cleaned : "/" + cleaned;
      } else {
        response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
        fs.createReadStream(path.join(PUBLIC_DIR, "index.html")).pipe(response);
        return;
      }
    }

    // serve effect XML from local catalog (id -> file in effects/)
    if (pathname === "/api/effect-xml") {
      const effectId = query.id;
      if (effectId) {
        const localLoadEffectIndex = loadEffectIndex();
        const file = localLoadEffectIndex[effectId] || (effectId.includes(".") ? localLoadEffectIndex[effectId.split(".").pop()] : null);
        if (file) {
          const full = path.join(PUBLIC_DIR, "effects", file);
          if (fs.existsSync(full) && fs.statSync(full).isFile()) {
            response.writeHead(200, {
              "Content-Type": "application/xml",
              "Cache-Control": "no-store",
              "X-Effect-File": file
            });
            fs.createReadStream(full).pipe(response);
            return;
          }
        }
      }
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "effect_xml_not_found" }));
      return;
    }

    // effect binary cache lokal
    if (pathname === "/api/effect-bin") {
      const effectId = query.id;
      if (effectId) {
        const cachedBin = path.join(PUBLIC_DIR, "effects", `${effectId}.bin`);
        if (fs.existsSync(cachedBin) && fs.statSync(cachedBin).isFile()) {
          response.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Cache-Control": "no-store",
            "X-Effect-File": `${effectId}.bin`
          });
          fs.createReadStream(cachedBin).pipe(response);
          return;
        }
      }
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "effect_bin_not_found" }));
      return;
    }

    // Alight Creative & Google Drive link resolver
    if (pathname === "/api/project-xml") {
      const targetUrl = query.url;
      try {
        const localValueParsed = await resolveProjectXml(targetUrl, query.project);
        response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        response.end(JSON.stringify(localValueParsed));
      } catch (err) {
        response.writeHead(400, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        response.end(JSON.stringify({ error: err.message || "Gagal memproses link project" }));
      }
      return;
    }

    if (pathname === "/api/drive-xml") {
      const targetUrl = query.url;
      try {
        const xmlName = await resolveProjectXml(targetUrl);
        response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        response.end(JSON.stringify({ name: xmlName.xmlName, xml: xmlName.xml }));
      } catch (err) {
        response.writeHead(400, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        response.end(JSON.stringify({ error: err.message || "Gagal mengambil XML dari Google Drive" }));
      }
      return;
    }

    const localPath = path.join(PUBLIC_DIR, pathname);
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      const localValue = path.extname(localPath).toLowerCase();
      const contentType = MIME_TYPES[localValue] || "application/octet-stream";
      const headers = { "Content-Type": contentType };
      if ([".html", ".js", ".json", ".css", ".xml", ""].includes(localValue)) headers["Cache-Control"] = "no-store";
      response.writeHead(200, headers);
      fs.createReadStream(localPath).pipe(response);
      return;
    }

    // proxy ke server asset AM
    const remoteOptions = {
      hostname: REMOTE_HOST,
      port: 443,
      path: request.url,
      method: request.method,
      headers: {
        ...request.headers,
        host: REMOTE_HOST,
        referer: `https://${REMOTE_HOST}/runtime/preset.html`
      }
    };
    const proxyReq = https.request(remoteOptions, (proxyRes) => {
      if (response.headersSent || response.writableEnded) {
        proxyRes.resume();
        return;
      }
      if (request.url.match(/\.(html|js|json|css|xml)(\?|$)/)) proxyRes.headers["cache-control"] = "no-store";
      response.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(response);
    });
    proxyReq.on("error", (err) => {
      response.writeHead(502, { "Content-Type": "text/plain" });
      response.end("Proxy Error: " + err.message);
    });
    request.pipe(proxyReq);
  } catch (localValueRaw) {
    try {
      json(response, 500, { error: "server_error", message: localValueRaw.message });
    } catch (localRaw) {}
  }
});

server.listen(PORT, () => {
  console.log(`Open Motion server → http://localhost:${PORT}/  (storage: ${ROOT})`);
});