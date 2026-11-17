function createZipFromEntries(entries) {
  let totalSize = 0;
  for (const createZipFromEntriesData of entries) {
    totalSize += 30 + createZipFromEntriesData.name.length + createZipFromEntriesData.data.length + 46 + createZipFromEntriesData.name.length;
  }
  totalSize += 22;
  const createzipfroBytes = new Uint8Array(totalSize);
  const view = new DataView(createzipfroBytes.buffer);
  let offset = 0;
  const cdOffsets = [];

  const crcTable = new Uint32Array(256);
  for (let createZipFromEntriesNumber = 0; createZipFromEntriesNumber < 256; createZipFromEntriesNumber++) {
    let createZipFromEntriesValue = createZipFromEntriesNumber;
    for (let createZipFromEntriesRaw = 0; createZipFromEntriesRaw < 8; createZipFromEntriesRaw++) createZipFromEntriesValue = ((createZipFromEntriesValue & 1) ? (0xEDB88320 ^ (createZipFromEntriesValue >>> 1)) : (createZipFromEntriesValue >>> 1));
    crcTable[createZipFromEntriesNumber] = createZipFromEntriesValue;
  }
  function calcCrc(calcCrcArg) {
    let calcCrcValue = -1;
    for (let calcCrcNumber = 0; calcCrcNumber < calcCrcArg.length; calcCrcNumber++) calcCrcValue = (calcCrcValue >>> 8) ^ crcTable[(calcCrcValue ^ calcCrcArg[calcCrcNumber]) & 0xFF];
    return (calcCrcValue ^ -1) >>> 0;
  }

  for (let createZipFromEntriesResult = 0; createZipFromEntriesResult < entries.length; createZipFromEntriesResult++) {
    const createZipFromEntriesI = entries[createZipFromEntriesResult];
    const nameBytes = new TextEncoder().encode(createZipFromEntriesI.name);
    const createZipFromEntriesCalcCrc = calcCrc(createZipFromEntriesI.data);
    cdOffsets.push({ offset, nameBytes, size: createZipFromEntriesI.data.length, crc: createZipFromEntriesCalcCrc });

    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, 0, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint32(offset + 14, createZipFromEntriesCalcCrc, true);
    view.setUint32(offset + 18, createZipFromEntriesI.data.length, true);
    view.setUint32(offset + 22, createZipFromEntriesI.data.length, true);
    view.setUint16(offset + 26, nameBytes.length, true);
    view.setUint16(offset + 28, 0, true);
    createzipfroBytes.set(nameBytes, offset + 30);
    offset += 30 + nameBytes.length;
    createzipfroBytes.set(createZipFromEntriesI.data, offset);
    offset += createZipFromEntriesI.data.length;
  }

  const cdStart = offset;
  for (let createZipFromEntriesValueRaw = 0; createZipFromEntriesValueRaw < cdOffsets.length; createZipFromEntriesValueRaw++) {
    const createZipFromEntriesCrc = cdOffsets[createZipFromEntriesValueRaw];
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 0, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, 0, true);
    view.setUint16(offset + 14, 0, true);
    view.setUint32(offset + 16, createZipFromEntriesCrc.crc, true);
    view.setUint32(offset + 20, createZipFromEntriesCrc.size, true);
    view.setUint32(offset + 24, createZipFromEntriesCrc.size, true);
    view.setUint16(offset + 28, createZipFromEntriesCrc.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true);
    view.setUint16(offset + 32, 0, true);
    view.setUint16(offset + 34, 0, true);
    view.setUint16(offset + 36, 0, true);
    view.setUint32(offset + 38, 0, true);
    view.setUint32(offset + 42, createZipFromEntriesCrc.offset, true);
    createzipfroBytes.set(createZipFromEntriesCrc.nameBytes, offset + 46);
    offset += 46 + createZipFromEntriesCrc.nameBytes.length;
  }

  const cdSize = offset - cdStart;
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, cdOffsets.length, true);
  view.setUint16(offset + 10, cdOffsets.length, true);
  view.setUint32(offset + 12, cdSize, true);
  view.setUint32(offset + 16, cdStart, true);
  view.setUint16(offset + 20, 0, true);
  offset += 22;

  return new Blob([createzipfroBytes.subarray(0, offset)], { type: "application/zip" });
}
export { createZipFromEntries };
