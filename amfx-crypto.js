import { fail } from './engine-core.js';
var amfxMagic = [65, 77, 70, 88],
  textEncoder = typeof TextEncoder < 'u' ? new TextEncoder() : null,
  textDecoder = typeof TextDecoder < 'u' ? new TextDecoder() : null,
  CHACHA_CONSTANTS = new Uint32Array([1634760805, 857760878, 2036477234, 1797285236]),
  CHACHA_ROUND_KEYS = new Uint32Array([2654435769, 2246822507, 3266489909, 668265263, 374761393, 3550635116, 4251993797, 3042594569]),
  chachaState = new Uint32Array(16),
  chachaBlockWords = new Uint32Array(16),
  chachaKeystream = new Uint8Array(64);
function rotl32(rotlArg, shift) {
  return (rotlArg << shift | rotlArg >>> 32 - shift) >>> 0;
}
function chachaQuarterRound(state, columnIndex, xIndex, zIndex, yIndex) {
  state[columnIndex] = state[columnIndex] + state[xIndex] >>> 0, state[yIndex] = rotl32(state[yIndex] ^ state[columnIndex], 16), state[zIndex] = state[zIndex] + state[yIndex] >>> 0, state[xIndex] = rotl32(state[xIndex] ^ state[zIndex], 12), state[columnIndex] = state[columnIndex] + state[xIndex] >>> 0, state[yIndex] = rotl32(state[yIndex] ^ state[columnIndex], 8), state[zIndex] = state[zIndex] + state[yIndex] >>> 0, state[xIndex] = rotl32(state[xIndex] ^ state[zIndex], 7);
}
function chachaBlock(keyWords, working) {
  for (let roundIndex = 0; roundIndex < 16; roundIndex++) working[roundIndex] = keyWords[roundIndex];
  for (let chachaBlockNumber = 0; chachaBlockNumber < 10; chachaBlockNumber++) chachaQuarterRound(working, 0, 4, 8, 12), chachaQuarterRound(working, 1, 5, 9, 13), chachaQuarterRound(working, 2, 6, 10, 14), chachaQuarterRound(working, 3, 7, 11, 15), chachaQuarterRound(working, 0, 5, 10, 15), chachaQuarterRound(working, 1, 6, 11, 12), chachaQuarterRound(working, 2, 7, 8, 13), chachaQuarterRound(working, 3, 4, 9, 14);
  for (let rowIndex = 0; rowIndex < 16; rowIndex++) working[rowIndex] = working[rowIndex] + keyWords[rowIndex] >>> 0;
}
function chachaXor(input, counter) {
  let output = new Uint8Array(input.length);
  chachaState[0] = CHACHA_CONSTANTS[0], chachaState[1] = CHACHA_CONSTANTS[1], chachaState[2] = CHACHA_CONSTANTS[2], chachaState[3] = CHACHA_CONSTANTS[3];
  for (let offset = 0; offset < 8; offset++) chachaState[4 + offset] = CHACHA_ROUND_KEYS[offset];
  chachaState[12] = 0, chachaState[13] = counter >>> 0, chachaState[14] = 0, chachaState[15] = 0;
  for (let chachaXorNumber = 0; chachaXorNumber < input.length; chachaXorNumber += 64) {
    chachaBlock(chachaState, chachaBlockWords);
    for (let wordIndex = 0; wordIndex < 16; wordIndex++) {
      let word = chachaBlockWords[wordIndex];
      chachaKeystream[wordIndex * 4] = word & 255, chachaKeystream[wordIndex * 4 + 1] = word >>> 8 & 255, chachaKeystream[wordIndex * 4 + 2] = word >>> 16 & 255, chachaKeystream[wordIndex * 4 + 3] = word >>> 24 & 255;
    }
    let chunkLength = Math.min(64, input.length - chachaXorNumber);
    for (let byteIndex = 0; byteIndex < chunkLength; byteIndex++) output[chachaXorNumber + byteIndex] = input[chachaXorNumber + byteIndex] ^ chachaKeystream[byteIndex];
    chachaState[12] = chachaState[12] + 1 >>> 0;
  }
  return output;
}
function parseAmfxBinary(bytes) {
  textDecoder || fail("TextDecoder tidak tersedia");
  let effectBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  effectBytes.length < 8 && fail("data efek terlalu pendek"), (effectBytes[0] !== amfxMagic[0] || effectBytes[1] !== amfxMagic[1] || effectBytes[2] !== amfxMagic[2] || effectBytes[3] !== amfxMagic[3]) && fail("header efek tidak dikenal (bukan AMFX)");
  let view = new DataView(effectBytes.buffer, effectBytes.byteOffset, effectBytes.byteLength),
    cursor = 4,
    version = view.getUint16(cursor, true);
  cursor += 2, version !== 3 && fail("versi format efek " + version + " tidak didukung (butuh 3)"), cursor += 2;
  let stringCount = view.getUint32(cursor, true);
  cursor += 4;
  let strings = new Array(stringCount);
  for (let stringIndex = 0; stringIndex < stringCount; stringIndex++) {
    let stringLength = view.getUint32(cursor, true);
    cursor += 4, cursor + stringLength > effectBytes.length && fail("tabel string efek terpotong"), strings[stringIndex] = textDecoder.decode(effectBytes.subarray(cursor, cursor + stringLength)), cursor += stringLength;
  }
  let requireBytes = length => {
      cursor + length > effectBytes.length && fail("data efek terpotong");
    },
    lookupString = parseAmfxBinaryArg => parseAmfxBinaryArg === 65535 ? null : strings[parseAmfxBinaryArg],
    readU8 = () => {
      requireBytes(1);
      let byteValue = view.getUint8(cursor);
      return cursor += 1, byteValue;
    },
    readU16 = () => {
      requireBytes(2);
      let wordValue = view.getUint16(cursor, true);
      return cursor += 2, wordValue;
    },
    readF64 = () => {
      requireBytes(8);
      let floatValue = view.getFloat64(cursor, true);
      return cursor += 8, floatValue;
    },
    stringNonce = 0,
    readEncryptedText = () => {
      requireBytes(4);
      let textLength = view.getUint32(cursor, true);
      if (cursor += 4, textLength === 4294967295) return null;
      requireBytes(textLength);
      let encrypted = effectBytes.subarray(cursor, cursor + textLength);
      return cursor += textLength, textDecoder.decode(chachaXor(encrypted, stringNonce++));
    },
    readValue = () => {
      let valueTag = readU8();
      if (valueTag === 0) return false;
      if (valueTag === 1) return true;
      if (valueTag === 2) return readF64();
      if (valueTag === 3) {
        let valueCount = readU8(),
          values = new Array(valueCount);
        for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) values[valueIndex] = readF64();
        return values;
      }
      return fail("tag nilai efek tidak dikenal: " + valueTag), null;
    },
    readNullableF64 = () => readU8() === 1 ? readF64() : null,
    effectId = lookupString(readU16()),
    effectName = lookupString(readU16()),
    effectCategory = lookupString(readU16()),
    sourceFile = lookupString(readU16()),
    overdraw = readU8() === 1,
    maxOverdraw = readF64(),
    paramCount = readU16(),
    params = new Array(paramCount);
  for (let paramIndex = 0; paramIndex < paramCount; paramIndex++) {
    let parseAmfxBinaryLookupString = lookupString(readU16()),
      lookupStringValue = lookupString(readU16()),
      paramLabel = lookupString(readU16()),
      valueType = lookupString(readU16()),
      srcType = lookupString(readU16()),
      defaultValue = readValue(),
      minValue = readNullableF64(),
      maxValue = readNullableF64(),
      step = readF64(),
      choiceCount = readU16(),
      choices = new Array(choiceCount);
    for (let choiceIndex = 0; choiceIndex < choiceCount; choiceIndex++) choices[choiceIndex] = {
      label: lookupString(readU16()),
      value: lookupString(readU16())
    };
    params[paramIndex] = {
      type: parseAmfxBinaryLookupString,
      id: lookupStringValue,
      label: paramLabel,
      srcType: valueType,
      defaultValue: defaultValue,
      min: minValue,
      max: maxValue,
      step: step,
      valueType: srcType,
      choices: choices
    };
  }
  let passCount = readU16(),
    passes = new Array(passCount);
  for (let passIndex = 0; passIndex < passCount; passIndex++) passes[passIndex] = {
    target: lookupString(readU16())
  };
  let shaderCount = readU16(),
    shaders = new Array(shaderCount);
  for (let shaderIndex = 0; shaderIndex < shaderCount; shaderIndex++) shaders[shaderIndex] = {
    type: "fragment",
    group: lookupString(readU16()),
    precision: lookupString(readU16()),
    code: readEncryptedText()
  };
  let parseAmfxBinaryRecord = {
    id: effectId,
    name: effectName,
    category: effectCategory,
    overdraw: overdraw,
    maxOverdraw: maxOverdraw,
    filename: sourceFile,
    params: params,
    passes: passes,
    shader: null,
    vertexShader: null,
    script: null
  };
  return shaders.length && (parseAmfxBinaryRecord.shaders = shaders, parseAmfxBinaryRecord.shader = shaders[0]), readU8() === 1 && (parseAmfxBinaryRecord.vertexShader = {
    type: "vertex",
    precision: lookupString(readU16()),
    code: readEncryptedText()
  }), readU8() === 1 && (parseAmfxBinaryRecord.script = {
    lang: lookupString(readU16()),
    external: lookupString(readU16()),
    code: readEncryptedText()
  }), parseAmfxBinaryRecord;
}
export { CHACHA_CONSTANTS, CHACHA_ROUND_KEYS, amfxMagic, chachaBlock, chachaBlockWords, chachaKeystream, chachaQuarterRound, chachaState, chachaXor, parseAmfxBinary, rotl32, textDecoder, textEncoder };
