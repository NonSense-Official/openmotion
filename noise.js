function triangleWave(triangleWaveArg) {
  let fraction = triangleWaveArg - Math.floor(triangleWaveArg);
  return 4 * Math.abs(fraction - 0.5) - 1;
}
var NOISE_GRAD3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
  permutationTable = new Uint8Array(512);
{
  let permutation = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
  for (let permIndex = 0; permIndex < 512; permIndex++) permutationTable[permIndex] = permutation[permIndex & 255];
}
function simplexNoiseDHelper(simplexNoiseDArgRaw, argRaw, simplexNoiseDArgValue) {
  let xv = Number(simplexNoiseDArgRaw) || 0,
    yv = Number(argRaw) || 0,
    zv = (simplexNoiseDArgValue === void 0 ? 0 : Number(simplexNoiseDArgValue)) || 0,
    skew = (xv + yv + zv) * (1 / 3),
    cellX = Math.floor(xv + skew),
    cellY = Math.floor(yv + skew),
    cellZ = Math.floor(zv + skew),
    skewOffset = (cellX + cellY + cellZ) * (1 / 6),
    localX = xv - (cellX - skewOffset),
    localY = yv - (cellY - skewOffset),
    localZ = zv - (cellZ - skewOffset),
    simplexNoiseDValue,
    simplexNoiseD,
    simplexNoiseDLocal,
    simplexNoiseDValueRaw,
    valueRaw,
    simplexNoiseDRaw;
  localX >= localY ? localY >= localZ ? (simplexNoiseDValue = 1, simplexNoiseD = 0, simplexNoiseDLocal = 0, simplexNoiseDValueRaw = 1, valueRaw = 1, simplexNoiseDRaw = 0) : localX >= localZ ? (simplexNoiseDValue = 1, simplexNoiseD = 0, simplexNoiseDLocal = 0, simplexNoiseDValueRaw = 1, valueRaw = 0, simplexNoiseDRaw = 1) : (simplexNoiseDValue = 0, simplexNoiseD = 0, simplexNoiseDLocal = 1, simplexNoiseDValueRaw = 1, valueRaw = 0, simplexNoiseDRaw = 1) : localY < localZ ? (simplexNoiseDValue = 0, simplexNoiseD = 0, simplexNoiseDLocal = 1, simplexNoiseDValueRaw = 0, valueRaw = 1, simplexNoiseDRaw = 1) : localX < localZ ? (simplexNoiseDValue = 0, simplexNoiseD = 1, simplexNoiseDLocal = 0, simplexNoiseDValueRaw = 0, valueRaw = 1, simplexNoiseDRaw = 1) : (simplexNoiseDValue = 0, simplexNoiseD = 1, simplexNoiseDLocal = 0, simplexNoiseDValueRaw = 1, valueRaw = 1, simplexNoiseDRaw = 0);
  let simplexNoiseDValueParsed = localX - simplexNoiseDValue + 1 / 6,
    valueParsed = localY - simplexNoiseD + 1 / 6,
    simplexNoiseDParsed = localZ - simplexNoiseDLocal + 1 / 6,
    simplexNoiseDValueClamped = localX - simplexNoiseDValueRaw + 1 / 3,
    valueClamped = localY - valueRaw + 1 / 3,
    simplexNoiseDClamped = localZ - simplexNoiseDRaw + 1 / 3,
    simplexNoiseDValueScoped = localX - 0.5,
    valueScoped = localY - 0.5,
    simplexNoiseDScoped = localZ - 0.5,
    hashX = cellX & 255,
    hashY = cellY & 255,
    hashZ = cellZ & 255,
    contribution = (gradientIndex, dx, simplexNoiseDArg, dz) => {
      let attenuation = 0.6 - dx * dx - simplexNoiseDArg * simplexNoiseDArg - dz * dz;
      if (attenuation < 0) return 0;
      attenuation *= attenuation;
      let gradientOffset = gradientIndex * 3;
      return attenuation * attenuation * (NOISE_GRAD3[gradientOffset] * dx + NOISE_GRAD3[gradientOffset + 1] * simplexNoiseDArg + NOISE_GRAD3[gradientOffset + 2] * dz);
    },
    simplexNoiseDContribution = contribution(permutationTable[hashX + permutationTable[hashY + permutationTable[hashZ]]] % 12, localX, localY, localZ),
    contributionValue = contribution(permutationTable[hashX + simplexNoiseDValue + permutationTable[hashY + simplexNoiseD + permutationTable[hashZ + simplexNoiseDLocal]]] % 12, simplexNoiseDValueParsed, valueParsed, simplexNoiseDParsed),
    simplexNoiseDValueLocal = contribution(permutationTable[hashX + simplexNoiseDValueRaw + permutationTable[hashY + valueRaw + permutationTable[hashZ + simplexNoiseDRaw]]] % 12, simplexNoiseDValueClamped, valueClamped, simplexNoiseDClamped),
    valueLocal = contribution(permutationTable[hashX + 1 + permutationTable[hashY + 1 + permutationTable[hashZ + 1]]] % 12, simplexNoiseDValueScoped, valueScoped, simplexNoiseDScoped);
  return 32 * (simplexNoiseDContribution + contributionValue + simplexNoiseDValueLocal + valueLocal);
}
export { NOISE_GRAD3, permutationTable, simplexNoiseDHelper, triangleWave };
