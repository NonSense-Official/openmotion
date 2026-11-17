const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function parseZipFromCentralDirectory(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("Format ZIP tidak valid");

  const count = buf.readUInt16LE(eocd + 10);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const files = {};
  let p = cdOffset;
  for (let e = 0; e < count; e++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);

    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    const localNameLen = buf.readUInt16LE(localOffset + 26);
    const localExtraLen = buf.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const compData = buf.subarray(dataStart, dataStart + compSize);

    if (method === 0) {
      files[name] = compData;
    } else if (method === 8) {
      files[name] = zlib.inflateRawSync(compData);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "*/*"
};

async function resolveAlightLink(targetUrl) {
  let curr = targetUrl.trim();
  if (!curr.startsWith("http://") && !curr.startsWith("https://")) {
    curr = "https://" + curr;
  }
  for (let i = 0; i < 5; i++) {
    const res = await fetch(curr, { method: "HEAD", redirect: "manual", headers: DEFAULT_HEADERS });
    const loc = res.headers.get("location");
    if (loc) {
      curr = new URL(loc, curr).toString();
      const m = curr.match(/\/u\/([^\/]+)\/p\/([^\/\?#]+)/);
      if (m) return { uid: m[1], pid: m[2], finalUrl: curr };
    } else {
      break;
    }
  }

  const res = await fetch(curr, { redirect: "follow", headers: DEFAULT_HEADERS });
  const finalUrl = res.url;
  const m = finalUrl.match(/\/u\/([^\/]+)\/p\/([^\/\?#]+)/);
  if (m) return { uid: m[1], pid: m[2], finalUrl };

  const html = await res.text();
  const mHtml = html.match(/\/u\/([a-zA-Z0-9_-]+)\/p\/([a-zA-Z0-9_-]+)/);
  if (mHtml) return { uid: mHtml[1], pid: mHtml[2], finalUrl };

  throw new Error("Link Alight Motion tidak valid atau tidak ditemukan UID/PID");
}

async function getProjectZipBuffer(uid, pid, cacheDir) {
  const cachePath = path.join(cacheDir, `am_${uid}_${pid}.zip`);
  try {
    if (fs.existsSync(cachePath)) {
      const stat = fs.statSync(cachePath);
      if (Date.now() - stat.mtimeMs < 3600 * 1000) {
        return fs.readFileSync(cachePath);
      }
    }
  } catch {}

  const dlRes = await fetch("https://us-central1-alight-creative.cloudfunctions.net/requestProjectDownload", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      data: {
        uid,
        pid,
        platform: "android",
        appBuild: 1028425,
        isFree: false,
        acctTestMode: "normal"
      }
    })
  });

  const dlData = await dlRes.json();
  if (!dlData.result || dlData.result.result !== "success" || !dlData.result.downloadUri) {
    throw new Error(dlData.result?.message || dlData.error?.message || "Gagal mendapatkan izin download proyek dari Alight Motion");
  }

  const zipUrl = `https://firebasestorage.googleapis.com/v0/b/alight-creative.appspot.com/o/${encodeURIComponent(dlData.result.downloadUri)}?alt=media`;
  const zipRes = await fetch(zipUrl);
  if (!zipRes.ok) {
    throw new Error(`Gagal mengunduh berkas proyek dari storage: HTTP ${zipRes.status}`);
  }

  const buf = Buffer.from(await zipRes.arrayBuffer());
  try {
    fs.writeFileSync(cachePath, buf);
  } catch {}
  return buf;
}

async function processAlightProject(targetUrl, requestedProject, cacheDir) {
  const { uid, pid } = await resolveAlightLink(targetUrl);
  const zipBuf = await getProjectZipBuffer(uid, pid, cacheDir);
  const files = parseZipFromCentralDirectory(zipBuf);

  const xmlFiles = Object.entries(files).filter(([name]) => name.endsWith(".xml"));
  if (xmlFiles.length === 0) {
    throw new Error("Tidak ada file XML dalam paket proyek ini");
  }

  let selectedEntry = xmlFiles[0];
  if (requestedProject) {
    const match = xmlFiles.find(([name]) => name === requestedProject);
    if (match) selectedEntry = match;
  }

  const xmlContent = selectedEntry[1].toString("utf8");
  const titleMatch = xmlContent.match(/<scene[^>]*\btitle="([^"]*)"/i);
  const sceneTitle = titleMatch ? titleMatch[1] : selectedEntry[0].replace(/\.xml$/i, "");

  const mediaList = Object.keys(files)
    .filter(name => !name.endsWith(".xml") && name !== "manifest.txt")
    .map(name => ({ name }));

  const projects = xmlFiles.map(([name, buf]) => {
    const tMatch = buf.toString("utf8").match(/<scene[^>]*\btitle="([^"]*)"/i);
    return {
      name,
      title: tMatch ? tMatch[1] : name.replace(/\.xml$/i, "")
    };
  });

  return {
    xml: xmlContent,
    xmlName: selectedEntry[0],
    packageId: `${uid}:${pid}`,
    meta: { title: sceneTitle },
    media: mediaList,
    projects
  };
}

module.exports = {
  parseZipFromCentralDirectory,
  resolveAlightLink,
  getProjectZipBuffer,
  processAlightProject
};
