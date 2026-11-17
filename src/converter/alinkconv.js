const ALIGHT_DOMAINS = ['alight.link', 'alightcreative.com', 'alightcreative.page.link'];
const DRIVE_REGEX = /(?:\/file\/d\/|id=|\/open\?id=|^)([a-zA-Z0-9_-]{25,})/;

export function extractDriveFileId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  const match = trimmed.match(DRIVE_REGEX);
  return match ? match[1] : null;
}

export function isDriveLink(input) {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  return trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    trimmed.includes('/api/drive-xml') ||
    DRIVE_REGEX.test(trimmed);
}

export function isAlightLink(input) {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim().toLowerCase();
  return ALIGHT_DOMAINS.some((domain) => trimmed.includes(domain));
}

export function normalizeAlightUrl(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.length >= 25 && !trimmed.includes('.') && !trimmed.includes('/')) {
    return `https://alight.link/${trimmed}`;
  }

  if (trimmed.startsWith('alight.link/')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function isValidSceneXml(text) {
  return typeof text === 'string' && (/<scene[\s>]/i.test(text) || /<element[\s>]/i.test(text));
}

export async function resolveDirectXml(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} saat mengunduh XML`);
  }
  const text = await res.text();
  if (!isValidSceneXml(text)) {
    throw new Error('Berkas XML tidak berisi scene atau elemen Alight Motion yang valid');
  }

  let xmlName = 'preset.xml';
  try {
    const pathname = new URL(url, window.location.href).pathname;
    const base = pathname.split('/').filter(Boolean).pop();
    if (base && /\.xml$/i.test(base)) {
      xmlName = base;
    }
  } catch {
    xmlName = 'preset.xml';
  }

  return {
    xml: text,
    xmlName,
    media: []
  };
}

export async function resolveDriveLink(input) {
  const fileId = extractDriveFileId(input);
  if (!fileId) {
    throw new Error('ID berkas Google Drive tidak ditemukan');
  }

  try {
    const apiRes = await fetch(`/api/drive-xml?url=${encodeURIComponent(input)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.xml && isValidSceneXml(data.xml)) {
        return {
          xml: data.xml,
          xmlName: data.name || `drive-${fileId}.xml`,
          media: Array.isArray(data.media) ? data.media : []
        };
      }
    }
  } catch {}

  try {
    const apiProjectRes = await fetch(`/api/project-xml?url=${encodeURIComponent(input)}`);
    if (apiProjectRes.ok) {
      const data = await apiProjectRes.json();
      if (data && data.xml && isValidSceneXml(data.xml)) {
        return {
          xml: data.xml,
          xmlName: data.xmlName || `drive-${fileId}.xml`,
          media: Array.isArray(data.media) ? data.media : [],
          projects: Array.isArray(data.projects) ? data.projects : []
        };
      }
    }
  } catch {}

  const directDownloadUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
  try {
    const directRes = await fetch(directDownloadUrl);
    if (directRes.ok) {
      const text = await directRes.text();
      if (isValidSceneXml(text)) {
        return {
          xml: text,
          xmlName: `drive-${fileId}.xml`,
          media: []
        };
      }
    }
  } catch {}

  throw new Error('Gagal mengunduh atau memverifikasi berkas XML dari Google Drive');
}

export async function convertAlightLink(rawInput, project = null) {
  if (!rawInput || typeof rawInput !== 'string') {
    throw new Error('URL atau tautan Alight Motion tidak boleh kosong');
  }

  const trimmed = rawInput.trim();

  if (isValidSceneXml(trimmed)) {
    return {
      xml: trimmed,
      xmlName: 'preset.xml',
      media: []
    };
  }

  const targetUrl = normalizeAlightUrl(trimmed);

  if (/\.xml(\?.*)?$/i.test(targetUrl) || targetUrl.startsWith('blob:') || targetUrl.startsWith('data:')) {
    return await resolveDirectXml(targetUrl);
  }

  if (isDriveLink(targetUrl)) {
    return await resolveDriveLink(targetUrl);
  }

  let apiUrl = `/api/project-xml?url=${encodeURIComponent(targetUrl)}`;
  if (project) {
    apiUrl += `&project=${encodeURIComponent(project)}`;
  }

  const res = await fetch(apiUrl);
  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const errorMsg = payload?.error || payload?.message || `HTTP ${res.status}`;
    throw new Error(`Gagal mengambil proyek dari server: ${errorMsg}`);
  }

  if (!payload || !payload.xml) {
    throw new Error(payload?.error || payload?.message || 'Format respons proyek Alight Motion tidak valid (tidak ada XML)');
  }

  if (!isValidSceneXml(payload.xml)) {
    throw new Error('Respon XML Alight Motion tidak valid');
  }

  return {
    xml: payload.xml,
    xmlName: payload.xmlName || 'alight-project.xml',
    packageId: payload.packageId || null,
    media: Array.isArray(payload.media) ? payload.media : [],
    projects: Array.isArray(payload.projects) ? payload.projects : []
  };
}
