import { chachaXor } from './BinaryChaCha20.js';

const AMFX_MAGIC = [65, 77, 70, 88];
const AMFX_VERSION = 3;
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;

function fail(message) {
  throw new Error('efek: ' + message);
}

export function isAmfxBinary(buffer) {
  if (!buffer) return false;
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 8) return false;
  return (
    bytes[0] === AMFX_MAGIC[0] &&
    bytes[1] === AMFX_MAGIC[1] &&
    bytes[2] === AMFX_MAGIC[2] &&
    bytes[3] === AMFX_MAGIC[3]
  );
}

export function parseAmfxBinary(buffer) {
  if (!textDecoder) {
    fail('TextDecoder tidak tersedia');
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 8) {
    fail('data efek terlalu pendek');
  }

  if (
    bytes[0] !== AMFX_MAGIC[0] ||
    bytes[1] !== AMFX_MAGIC[1] ||
    bytes[2] !== AMFX_MAGIC[2] ||
    bytes[3] !== AMFX_MAGIC[3]
  ) {
    fail('header efek tidak dikenal (bukan AMFX)');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 4;

  const version = view.getUint16(offset, true);
  offset += 2;
  if (version !== AMFX_VERSION) {
    fail('versi format efek ' + version + ' tidak didukung (butuh 3)');
  }
  offset += 2;

  const stringCount = view.getUint32(offset, true);
  offset += 4;

  const stringTable = new Array(stringCount);
  for (let i = 0; i < stringCount; i++) {
    const strLen = view.getUint32(offset, true);
    offset += 4;
    if (offset + strLen > bytes.length) {
      fail('tabel string efek terpotong');
    }
    stringTable[i] = textDecoder.decode(bytes.subarray(offset, offset + strLen));
    offset += strLen;
  }

  const checkBounds = (size) => {
    if (offset + size > bytes.length) {
      fail('data efek terpotong');
    }
  };

  const readStringRef = (index) => (index === 65535 ? null : stringTable[index]);

  const readUint8 = () => {
    checkBounds(1);
    const value = view.getUint8(offset);
    offset += 1;
    return value;
  };

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

  const readFloat64 = () => {
    checkBounds(8);
    const value = view.getFloat64(offset, true);
    offset += 8;
    return value;
  };

  let cipherIndex = 0;
  const readEncryptedString = () => {
    checkBounds(4);
    const len = view.getUint32(offset, true);
    offset += 4;
    if (len === 4294967295) {
      return null;
    }
    checkBounds(len);
    const encrypted = bytes.subarray(offset, offset + len);
    const decrypted = chachaXor(encrypted, cipherIndex++);
    offset += len;
    return textDecoder.decode(decrypted);
  };

  const readValue = () => {
    const tag = readUint8();
    if (tag === 0) return false;
    if (tag === 1) return true;
    if (tag === 2) return readFloat64();
    if (tag === 3) {
      const arrLen = readUint8();
      const arr = new Array(arrLen);
      for (let i = 0; i < arrLen; i++) {
        arr[i] = readFloat64();
      }
      return arr;
    }
    fail('tag nilai efek tidak dikenal: ' + tag);
    return null;
  };

  const readOptionalFloat64 = () => (readUint8() === 1 ? readFloat64() : null);

  const id = readStringRef(readUint16());
  const name = readStringRef(readUint16());
  const category = readStringRef(readUint16());
  const filename = readStringRef(readUint16());
  const overdraw = readUint8() === 1;
  const maxOverdraw = readFloat64();

  const paramCount = readUint16();
  const params = new Array(paramCount);
  for (let i = 0; i < paramCount; i++) {
    const type = readStringRef(readUint16());
    const paramId = readStringRef(readUint16());
    const label = readStringRef(readUint16());
    const srcType = readStringRef(readUint16());
    const valueType = readStringRef(readUint16());
    const defaultValue = readValue();
    const min = readOptionalFloat64();
    const max = readOptionalFloat64();
    const step = readFloat64();
    const choiceCount = readUint16();
    const choices = new Array(choiceCount);

    for (let c = 0; c < choiceCount; c++) {
      choices[c] = {
        label: readStringRef(readUint16()),
        value: readStringRef(readUint16())
      };
    }

    params[i] = {
      type,
      id: paramId,
      label,
      srcType,
      defaultValue,
      min,
      max,
      step,
      valueType,
      choices
    };
  }

  const passCount = readUint16();
  const passes = new Array(passCount);
  for (let i = 0; i < passCount; i++) {
    passes[i] = {
      target: readStringRef(readUint16())
    };
  }

  const shaderCount = readUint16();
  const shaders = new Array(shaderCount);
  for (let i = 0; i < shaderCount; i++) {
    shaders[i] = {
      type: 'fragment',
      group: readStringRef(readUint16()),
      precision: readStringRef(readUint16()),
      code: readEncryptedString()
    };
  }

  const result = {
    id,
    name,
    category,
    overdraw,
    maxOverdraw,
    filename,
    params,
    passes,
    shader: null,
    vertexShader: null,
    script: null
  };

  if (shaders.length > 0) {
    result.shaders = shaders;
    result.shader = shaders[0];
  }

  if (readUint8() === 1) {
    result.vertexShader = {
      type: 'vertex',
      precision: readStringRef(readUint16()),
      code: readEncryptedString()
    };
  }

  if (readUint8() === 1) {
    result.script = {
      lang: readStringRef(readUint16()),
      external: readStringRef(readUint16()),
      code: readEncryptedString()
    };
  }

  return result;
}

export default parseAmfxBinary;
