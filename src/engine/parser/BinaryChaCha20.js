export const CHACHA_CONSTANTS = new Uint32Array([
  1634760805, 857760878, 2036477234, 1797285236
]);

export const CHACHA_ROUND_KEYS = new Uint32Array([
  2654435769, 2246822507, 3266489909, 668265263,
  374761393, 3550635116, 4251993797, 3042594569
]);

export function rotl32(v, c) {
  return ((v << c) | (v >>> (32 - c))) >>> 0;
}

export function chachaQuarterRound(state, a, b, c, d) {
  state[a] = (state[a] + state[b]) >>> 0;
  state[d] = rotl32(state[d] ^ state[a], 16);
  state[c] = (state[c] + state[d]) >>> 0;
  state[b] = rotl32(state[b] ^ state[c], 12);
  state[a] = (state[a] + state[b]) >>> 0;
  state[d] = rotl32(state[d] ^ state[a], 8);
  state[c] = (state[c] + state[d]) >>> 0;
  state[b] = rotl32(state[b] ^ state[c], 7);
}

export function chachaBlock(state, outWords) {
  for (let i = 0; i < 16; i++) {
    outWords[i] = state[i];
  }
  for (let i = 0; i < 10; i++) {
    chachaQuarterRound(outWords, 0, 4, 8, 12);
    chachaQuarterRound(outWords, 1, 5, 9, 13);
    chachaQuarterRound(outWords, 2, 6, 10, 14);
    chachaQuarterRound(outWords, 3, 7, 11, 15);
    chachaQuarterRound(outWords, 0, 5, 10, 15);
    chachaQuarterRound(outWords, 1, 6, 11, 12);
    chachaQuarterRound(outWords, 2, 7, 8, 13);
    chachaQuarterRound(outWords, 3, 4, 9, 14);
  }
  for (let i = 0; i < 16; i++) {
    outWords[i] = (outWords[i] + state[i]) >>> 0;
  }
}

export function chachaXor(data, counter = 0) {
  const input = data instanceof Uint8Array ? data : new Uint8Array(data);
  const output = new Uint8Array(input.length);
  const state = new Uint32Array(16);
  const blockWords = new Uint32Array(16);
  const keystream = new Uint8Array(64);

  state[0] = CHACHA_CONSTANTS[0];
  state[1] = CHACHA_CONSTANTS[1];
  state[2] = CHACHA_CONSTANTS[2];
  state[3] = CHACHA_CONSTANTS[3];

  for (let i = 0; i < 8; i++) {
    state[4 + i] = CHACHA_ROUND_KEYS[i];
  }

  state[12] = 0;
  state[13] = counter >>> 0;
  state[14] = 0;
  state[15] = 0;

  for (let offset = 0; offset < input.length; offset += 64) {
    chachaBlock(state, blockWords);

    for (let i = 0; i < 16; i++) {
      const word = blockWords[i];
      const base = i * 4;
      keystream[base] = word & 0xff;
      keystream[base + 1] = (word >>> 8) & 0xff;
      keystream[base + 2] = (word >>> 16) & 0xff;
      keystream[base + 3] = (word >>> 24) & 0xff;
    }

    const chunkLen = Math.min(64, input.length - offset);
    for (let i = 0; i < chunkLen; i++) {
      output[offset + i] = input[offset + i] ^ keystream[i];
    }

    state[12] = (state[12] + 1) >>> 0;
  }

  return output;
}

export default chachaXor;
