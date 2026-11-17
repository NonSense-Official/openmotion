const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c;
}

export function calculateCrc32(bytes) {
  let c = -1;
  for (let i = 0; i < bytes.length; i++) {
    c = (c >>> 8) ^ CRC_TABLE[(c ^ bytes[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

export function createZipFromEntries(entries) {
  let totalSize = 0;
  for (const entry of entries) {
    totalSize += 30 + entry.name.length + entry.data.length + 46 + entry.name.length;
  }
  totalSize += 22;

  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);
  let offset = 0;
  const centralDirEntries = [];

  const textEncoder = new TextEncoder();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const nameBytes = textEncoder.encode(entry.name);
    const crc = calculateCrc32(entry.data);

    centralDirEntries.push({
      offset,
      nameBytes,
      size: entry.data.length,
      crc
    });

    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, 0, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint32(offset + 14, crc, true);
    view.setUint32(offset + 18, entry.data.length, true);
    view.setUint32(offset + 22, entry.data.length, true);
    view.setUint16(offset + 26, nameBytes.length, true);
    view.setUint16(offset + 28, 0, true);

    buffer.set(nameBytes, offset + 30);
    offset += 30 + nameBytes.length;

    buffer.set(entry.data, offset);
    offset += entry.data.length;
  }

  const centralDirStart = offset;
  for (let i = 0; i < centralDirEntries.length; i++) {
    const item = centralDirEntries[i];
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 0, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint16(offset + 14, 0, true);
    view.setUint32(offset + 16, item.crc, true);
    view.setUint32(offset + 20, item.size, true);
    view.setUint32(offset + 24, item.size, true);
    view.setUint16(offset + 28, item.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true);
    view.setUint16(offset + 32, 0, true);
    view.setUint16(offset + 34, 0, true);
    view.setUint16(offset + 36, 0, true);
    view.setUint32(offset + 38, 0, true);
    view.setUint32(offset + 42, item.offset, true);

    buffer.set(item.nameBytes, offset + 46);
    offset += 46 + item.nameBytes.length;
  }

  const centralDirSize = offset - centralDirStart;
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, centralDirEntries.length, true);
  view.setUint16(offset + 10, centralDirEntries.length, true);
  view.setUint32(offset + 12, centralDirSize, true);
  view.setUint32(offset + 16, centralDirStart, true);
  view.setUint16(offset + 20, 0, true);
  offset += 22;

  return new Blob([buffer.subarray(0, offset)], { type: 'application/zip' });
}

export async function canvasToPngBytes(canvas) {
  if (typeof canvas.toBlob === 'function') {
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/png');
    });
    return new Uint8Array(await blob.arrayBuffer());
  }
  if (typeof canvas.convertToBlob === 'function') {
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Uint8Array(await blob.arrayBuffer());
  }
  throw new Error('Canvas does not support PNG export');
}

export async function exportCurrentFramePng(canvas) {
  if (!canvas) return null;
  if (typeof canvas.toBlob === 'function') {
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }
  if (typeof canvas.convertToBlob === 'function') {
    return canvas.convertToBlob({ type: 'image/png' });
  }
  return null;
}

export async function exportImageSequenceZip({
  renderFrame,
  prepareFrame = null,
  startMs = 0,
  endMs = 0,
  fps = 30,
  canvas,
  onProgress = () => {},
  isCancelled = () => false
}) {
  const stepMs = 1000 / fps;
  const frameCount = Math.max(1, Math.round((endMs - startMs) / stepMs) + 1);
  const entries = [];

  for (let i = 0; i < frameCount; i++) {
    if (isCancelled()) {
      return null;
    }

    const curMs = startMs + i * stepMs;
    if (prepareFrame) {
      await prepareFrame(curMs);
    }
    renderFrame(curMs);

    const bytes = await canvasToPngBytes(canvas);
    const fileName = `frame_${String(i + 1).padStart(5, '0')}.png`;
    entries.push({ name: fileName, data: bytes });

    onProgress({
      phase: 'render',
      frame: i + 1,
      total: frameCount,
      pct: Math.round(((i + 1) / frameCount) * 100)
    });
  }

  if (isCancelled() || entries.length === 0) {
    return null;
  }

  return createZipFromEntries(entries);
}
