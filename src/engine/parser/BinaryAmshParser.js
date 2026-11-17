import { chachaXor } from './BinaryChaCha20.js';

const AMSH_MAGIC = [65, 77, 83, 72];
const AMSH_VERSION = 1;
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;

function fail(message) {
  throw new Error('bentuk: ' + message);
}

export function isAmshBinary(buffer) {
  if (!buffer) return false;
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 8) return false;
  return (
    bytes[0] === AMSH_MAGIC[0] &&
    bytes[1] === AMSH_MAGIC[1] &&
    bytes[2] === AMSH_MAGIC[2] &&
    bytes[3] === AMSH_MAGIC[3]
  );
}

export function parseAmshBinary(buffer) {
  if (!textDecoder) {
    fail('TextDecoder tidak tersedia');
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 8) {
    fail('data bentuk terlalu pendek');
  }

  if (
    bytes[0] !== AMSH_MAGIC[0] ||
    bytes[1] !== AMSH_MAGIC[1] ||
    bytes[2] !== AMSH_MAGIC[2] ||
    bytes[3] !== AMSH_MAGIC[3]
  ) {
    fail('header bentuk tidak dikenal (bukan AMSH)');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 4;

  const version = view.getUint16(offset, true);
  offset += 2;
  if (version !== AMSH_VERSION) {
    fail('versi format bentuk ' + version + ' tidak didukung (butuh 1)');
  }
  offset += 2;

  const stringCount = view.getUint32(offset, true);
  offset += 4;

  const stringTable = new Array(stringCount);
  for (let i = 0; i < stringCount; i++) {
    const strLen = view.getUint32(offset, true);
    offset += 4;
    if (offset + strLen > bytes.length) {
      fail('tabel string bentuk terpotong');
    }
    stringTable[i] = textDecoder.decode(bytes.subarray(offset, offset + strLen));
    offset += strLen;
  }

  const checkBounds = (size) => {
    if (offset + size > bytes.length) {
      fail('data bentuk terpotong');
    }
  };

  const readStringRef = (index) => (index === 65535 ? null : stringTable[index]);

  const readUint16 = () => {
    checkBounds(2);
    const value = view.getUint16(offset, true);
    offset += 2;
    return value;
  };

  const readUint32 = () => {
    checkBounds(4);
    const value = view.getUint32(offset, true);
    offset += 4;
    return value;
  };

  const id = readStringRef(readUint16());
  const filename = readStringRef(readUint16());

  const paramCount = readUint16();
  const params = new Array(paramCount);
  for (let i = 0; i < paramCount; i++) {
    params[i] = {
      id: readStringRef(readUint16()),
      type: readStringRef(readUint16()),
      defaultValue: readStringRef(readUint16())
    };
  }

  const codeLen = readUint32();
  let code = '';
  if (codeLen !== 4294967295) {
    checkBounds(codeLen);
    const decrypted = chachaXor(bytes.subarray(offset, offset + codeLen), 0);
    code = textDecoder.decode(decrypted);
    offset += codeLen;
  }

  return {
    id,
    filename,
    params,
    code
  };
}

export default parseAmshBinary;
