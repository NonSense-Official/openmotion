export class PerspectiveMatrix4 {
  constructor(elements) {
    if (elements && (Array.isArray(elements) || elements.buffer instanceof ArrayBuffer)) {
      this.elements = new Float32Array(elements);
    } else {
      this.elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
    }
  }

  static identity() {
    return new PerspectiveMatrix4();
  }

  reset() {
    const m = this.elements;
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0;
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0;
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0;
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1;
    return this;
  }

  copy(other) {
    const src = other.elements || other;
    for (let i = 0; i < 16; i++) this.elements[i] = src[i];
    return this;
  }

  clone() {
    return new PerspectiveMatrix4(this.elements);
  }

  multiply(other) {
    const a = this.elements;
    const b = other.elements || other;
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      const a0 = a[i], a1 = a[i + 4], a2 = a[i + 8], a3 = a[i + 12];
      out[i] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
      out[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
      out[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
      out[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
    }
    for (let i = 0; i < 16; i++) this.elements[i] = out[i];
    return this;
  }

  preMultiply(other) {
    const a = other.elements || other;
    const b = this.elements;
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      const a0 = a[i], a1 = a[i + 4], a2 = a[i + 8], a3 = a[i + 12];
      out[i] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
      out[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
      out[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
      out[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
    }
    for (let i = 0; i < 16; i++) this.elements[i] = out[i];
    return this;
  }

  translate(x, y, z = 0) {
    const m = this.elements;
    m[12] += m[0] * x + m[4] * y + m[8] * z;
    m[13] += m[1] * x + m[5] * y + m[9] * z;
    m[14] += m[2] * x + m[6] * y + m[10] * z;
    m[15] += m[3] * x + m[7] * y + m[11] * z;
    return this;
  }

  scale(x, y, z = 1) {
    const m = this.elements;
    m[0] *= x; m[1] *= x; m[2] *= x; m[3] *= x;
    m[4] *= y; m[5] *= y; m[6] *= y; m[7] *= y;
    m[8] *= z; m[9] *= z; m[10] *= z; m[11] *= z;
    return this;
  }

  rotateX(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m = this.elements;
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    m[4] = a10 * c + a20 * s; m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s; m[7] = a13 * c + a23 * s;
    m[8] = a20 * c - a10 * s; m[9] = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s; m[11] = a23 * c - a13 * s;
    return this;
  }

  rotateY(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m = this.elements;
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    m[0] = a00 * c - a20 * s; m[1] = a01 * c - a21 * s;
    m[2] = a02 * c - a22 * s; m[3] = a03 * c - a23 * s;
    m[8] = a00 * s + a20 * c; m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c; m[11] = a03 * s + a23 * c;
    return this;
  }

  rotateZ(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m = this.elements;
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    m[0] = a00 * c + a10 * s; m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s; m[3] = a03 * c + a13 * s;
    m[4] = a10 * c - a00 * s; m[5] = a11 * c - a01 * s;
    m[6] = a12 * c - a02 * s; m[7] = a13 * c - a03 * s;
    return this;
  }

  static fromEuler(pitchDeg, yawDeg, rollDeg) {
    const pitch = (pitchDeg * Math.PI) / 180;
    const yaw = (yawDeg * Math.PI) / 180;
    const roll = (rollDeg * Math.PI) / 180;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cr = Math.cos(roll), sr = Math.sin(roll);
    const m = new PerspectiveMatrix4();
    const e = m.elements;
    e[0] = cy * cr;
    e[1] = sp * sy * cr + cp * sr;
    e[2] = -cp * sy * cr + sp * sr;
    e[3] = 0;
    e[4] = -cy * sr;
    e[5] = -sp * sy * sr + cp * cr;
    e[6] = cp * sy * sr + sp * cr;
    e[7] = 0;
    e[8] = sy;
    e[9] = -sp * cy;
    e[10] = cp * cy;
    e[11] = 0;
    e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    return m;
  }

  toEuler() {
    const e = this.elements;
    const sy = Math.max(-1, Math.min(1, e[8]));
    const yaw = Math.asin(sy);
    let pitch = 0, roll = 0;
    if (Math.abs(e[8]) < 0.99999) {
      pitch = Math.atan2(-e[9], e[10]);
      roll = Math.atan2(-e[4], e[0]);
    } else {
      pitch = Math.atan2(e[6], e[5]);
      roll = 0;
    }
    return {
      pitchDeg: (pitch * 180) / Math.PI,
      yawDeg: (yaw * 180) / Math.PI,
      rollDeg: (roll * 180) / Math.PI
    };
  }

  static fromPositionRotationScale(position = [0, 0, 0], rotationDeg = [0, 0, 0], scale = [1, 1, 1]) {
    const px = position[0] || 0, py = position[1] || 0, pz = position[2] || 0;
    const rx = rotationDeg[0] || 0, ry = rotationDeg[1] || 0, rz = rotationDeg[2] || 0;
    const sx = scale[0] ?? 1, sy = scale[1] ?? 1, sz = scale[2] ?? 1;
    const rot = PerspectiveMatrix4.fromEuler(rx, ry, rz);
    rot.elements[0] *= sx; rot.elements[1] *= sx; rot.elements[2] *= sx;
    rot.elements[4] *= sy; rot.elements[5] *= sy; rot.elements[6] *= sy;
    rot.elements[8] *= sz; rot.elements[9] *= sz; rot.elements[10] *= sz;
    rot.elements[12] = px; rot.elements[13] = py; rot.elements[14] = pz;
    return rot;
  }

  static perspective(fovyRad, aspect, near = 0.1, far = 10000) {
    const f = 1.0 / Math.tan(fovyRad / 2);
    const nf = 1.0 / (near - far);
    const out = new PerspectiveMatrix4();
    const e = out.elements;
    e[0] = f / aspect; e[1] = 0; e[2] = 0; e[3] = 0;
    e[4] = 0; e[5] = f; e[6] = 0; e[7] = 0;
    e[8] = 0; e[9] = 0; e[10] = (far + near) * nf; e[11] = -1;
    e[12] = 0; e[13] = 0; e[14] = (2 * far * near) * nf; e[15] = 0;
    return out;
  }

  static perspectiveFromFov(fovDeg, width, height, near = 0.1, far = 10000) {
    const aspect = width / Math.max(1, height);
    const fovyRad = (fovDeg * Math.PI) / 180;
    return PerspectiveMatrix4.perspective(fovyRad, aspect, near, far);
  }

  static orthographic(left, right, bottom, top, near = -1000, far = 1000) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    const out = new PerspectiveMatrix4();
    const e = out.elements;
    e[0] = -2 * lr; e[1] = 0; e[2] = 0; e[3] = 0;
    e[4] = 0; e[5] = -2 * bt; e[6] = 0; e[7] = 0;
    e[8] = 0; e[9] = 0; e[10] = 2 * nf; e[11] = 0;
    e[12] = (left + right) * lr; e[13] = (top + bottom) * bt;
    e[14] = (far + near) * nf; e[15] = 1;
    return out;
  }

  static lookAt(eye, target, up = [0, 1, 0]) {
    const eyex = eye[0], eyey = eye[1], eyez = eye[2];
    const upx = up[0], upy = up[1], upz = up[2];
    const targetx = target[0], targety = target[1], targetz = target[2];
    let z0 = eyex - targetx, z1 = eyey - targety, z2 = eyez - targetz;
    let len = Math.hypot(z0, z1, z2);
    if (len > 1e-6) { z0 /= len; z1 /= len; z2 /= len; }
    let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (len > 1e-6) { x0 /= len; x1 /= len; x2 /= len; }
    let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
    if (len > 1e-6) { y0 /= len; y1 /= len; y2 /= len; }

    const out = new PerspectiveMatrix4();
    const e = out.elements;
    e[0] = x0; e[1] = y0; e[2] = z0; e[3] = 0;
    e[4] = x1; e[5] = y1; e[6] = z1; e[7] = 0;
    e[8] = x2; e[9] = y2; e[10] = z2; e[11] = 0;
    e[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    e[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    e[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    e[15] = 1;
    return out;
  }

  static createCameraMatrix({
    cameraType = 'perspective',
    fov = 60,
    cameraZoom = 1,
    sceneWidth = 1920,
    sceneHeight = 1080,
    near = 0.1,
    far = 10000
  } = {}) {
    if (cameraType === 'orthographic') {
      const zoom = cameraZoom > 0 ? cameraZoom : 1;
      const hw = (sceneWidth / 2) / zoom;
      const hh = (sceneHeight / 2) / zoom;
      return PerspectiveMatrix4.orthographic(-hw, hw, -hh, hh, near, far);
    }
    return PerspectiveMatrix4.perspectiveFromFov(fov, sceneWidth, sceneHeight, near, far);
  }

  determinant() {
    const m = this.elements;
    const b00 = m[0] * m[5] - m[1] * m[4], b01 = m[0] * m[6] - m[2] * m[4];
    const b02 = m[0] * m[7] - m[3] * m[4], b03 = m[1] * m[6] - m[2] * m[5];
    const b04 = m[1] * m[7] - m[3] * m[5], b05 = m[2] * m[7] - m[3] * m[6];
    const b06 = m[8] * m[13] - m[9] * m[12], b07 = m[8] * m[14] - m[10] * m[12];
    const b08 = m[8] * m[15] - m[11] * m[12], b09 = m[9] * m[14] - m[10] * m[13];
    const b10 = m[9] * m[15] - m[11] * m[13], b11 = m[10] * m[15] - m[11] * m[14];
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  invert() {
    const m = this.elements;
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (Math.abs(det) < 1e-12) return null;
    det = 1.0 / det;

    m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    m[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    m[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    m[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    m[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    m[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    m[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    m[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    m[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }

  getInverse() {
    const clone = this.clone();
    return clone.invert();
  }

  transformPoint(x, y, z = 0, w = 1) {
    const m = this.elements;
    const rx = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    const ry = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    const rz = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    const rw = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    if (rw !== 0 && rw !== 1) {
      const invW = 1.0 / rw;
      return { x: rx * invW, y: ry * invW, z: rz * invW, w: rw };
    }
    return { x: rx, y: ry, z: rz, w: rw };
  }

  project(x, y, z, viewportWidth, viewportHeight) {
    const pt = this.transformPoint(x, y, z, 1);
    return {
      x: ((pt.x + 1) * 0.5) * viewportWidth,
      y: ((1 - pt.y) * 0.5) * viewportHeight,
      z: pt.z,
      w: pt.w
    };
  }

  toArray() {
    return Array.from(this.elements);
  }

  toFloat32Array() {
    return new Float32Array(this.elements);
  }
}
