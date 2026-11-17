export class AffineMatrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    if (Array.isArray(a) || (a && a.buffer instanceof ArrayBuffer)) {
      this.elements = new Float32Array([
        a[0] ?? 1, a[1] ?? 0, a[2] ?? 0,
        a[3] ?? 1, a[4] ?? 0, a[5] ?? 0
      ]);
    } else {
      this.elements = new Float32Array([a, b, c, d, e, f]);
    }
  }

  get a() { return this.elements[0]; }
  set a(v) { this.elements[0] = v; }
  get b() { return this.elements[1]; }
  set b(v) { this.elements[1] = v; }
  get c() { return this.elements[2]; }
  set c(v) { this.elements[2] = v; }
  get d() { return this.elements[3]; }
  set d(v) { this.elements[3] = v; }
  get e() { return this.elements[4]; }
  set e(v) { this.elements[4] = v; }
  get f() { return this.elements[5]; }
  set f(v) { this.elements[5] = v; }

  static identity() {
    return new AffineMatrix2D(1, 0, 0, 1, 0, 0);
  }

  static fromTranslation(tx, ty) {
    return new AffineMatrix2D(1, 0, 0, 1, tx, ty);
  }

  static fromRotation(rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new AffineMatrix2D(cos, sin, -sin, cos, 0, 0);
  }

  static fromRotationDeg(deg) {
    return AffineMatrix2D.fromRotation((deg * Math.PI) / 180);
  }

  static fromScale(sx, sy = sx) {
    return new AffineMatrix2D(sx, 0, 0, sy, 0, 0);
  }

  static fromSkew(skewXRad, skewYRad = 0) {
    return new AffineMatrix2D(1, Math.tan(skewYRad), Math.tan(skewXRad), 1, 0, 0);
  }

  static fromSkewDeg(skewXDeg, skewYDeg = 0) {
    return AffineMatrix2D.fromSkew(
      (skewXDeg * Math.PI) / 180,
      (skewYDeg * Math.PI) / 180
    );
  }

  static fromTransform({
    location = [0, 0],
    scale = [1, 1],
    rotation = 0,
    pivot = [0, 0],
    skew = [0, 0]
  } = {}) {
    const m = AffineMatrix2D.identity();
    const locX = Array.isArray(location) ? (location[0] || 0) : (location.x || 0);
    const locY = Array.isArray(location) ? (location[1] || 0) : (location.y || 0);
    const pivX = Array.isArray(pivot) ? (pivot[0] || 0) : (pivot.x || 0);
    const pivY = Array.isArray(pivot) ? (pivot[1] || 0) : (pivot.y || 0);
    const scX = Array.isArray(scale) ? (scale[0] ?? 1) : (scale.x ?? 1);
    const scY = Array.isArray(scale) ? (scale[1] ?? 1) : (scale.y ?? 1);
    const rotDeg = typeof rotation === 'number'
      ? rotation
      : (Array.isArray(rotation) ? (rotation[0] || 0) : 0);
    const skX = Array.isArray(skew) ? (skew[0] || 0) : (skew.x || 0);
    const skY = Array.isArray(skew) ? (skew[1] || 0) : (skew.y || 0);

    m.translate(locX, locY);
    if (rotDeg !== 0) m.rotate((rotDeg * Math.PI) / 180);
    if (skX !== 0 || skY !== 0) {
      m.skew((skX * Math.PI) / 180, (skY * Math.PI) / 180);
    }
    m.scale(scX, scY);
    if (pivX !== 0 || pivY !== 0) m.translate(-pivX, -pivY);
    return m;
  }

  reset() {
    this.elements[0] = 1;
    this.elements[1] = 0;
    this.elements[2] = 0;
    this.elements[3] = 1;
    this.elements[4] = 0;
    this.elements[5] = 0;
    return this;
  }

  copy(other) {
    const src = other.elements || other;
    for (let i = 0; i < 6; i++) {
      this.elements[i] = src[i];
    }
    return this;
  }

  clone() {
    return new AffineMatrix2D(this.elements);
  }

  multiply(other) {
    const a0 = this.elements[0], b0 = this.elements[1], c0 = this.elements[2];
    const d0 = this.elements[3], e0 = this.elements[4], f0 = this.elements[5];
    const o = other.elements || other;
    const a1 = o[0], b1 = o[1], c1 = o[2];
    const d1 = o[3], e1 = o[4], f1 = o[5];

    this.elements[0] = a0 * a1 + c0 * b1;
    this.elements[1] = b0 * a1 + d0 * b1;
    this.elements[2] = a0 * c1 + c0 * d1;
    this.elements[3] = b0 * c1 + d0 * d1;
    this.elements[4] = a0 * e1 + c0 * f1 + e0;
    this.elements[5] = b0 * e1 + d0 * f1 + f0;
    return this;
  }

  preMultiply(other) {
    const o = other.elements || other;
    const a0 = o[0], b0 = o[1], c0 = o[2];
    const d0 = o[3], e0 = o[4], f0 = o[5];
    const a1 = this.elements[0], b1 = this.elements[1], c1 = this.elements[2];
    const d1 = this.elements[3], e1 = this.elements[4], f1 = this.elements[5];

    this.elements[0] = a0 * a1 + c0 * b1;
    this.elements[1] = b0 * a1 + d0 * b1;
    this.elements[2] = a0 * c1 + c0 * d1;
    this.elements[3] = b0 * c1 + d0 * d1;
    this.elements[4] = a0 * e1 + c0 * f1 + e0;
    this.elements[5] = b0 * e1 + d0 * f1 + f0;
    return this;
  }

  translate(tx, ty) {
    this.elements[4] += this.elements[0] * tx + this.elements[2] * ty;
    this.elements[5] += this.elements[1] * tx + this.elements[3] * ty;
    return this;
  }

  rotate(rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const a0 = this.elements[0], b0 = this.elements[1];
    const c0 = this.elements[2], d0 = this.elements[3];

    this.elements[0] = a0 * cos + c0 * sin;
    this.elements[1] = b0 * cos + d0 * sin;
    this.elements[2] = a0 * -sin + c0 * cos;
    this.elements[3] = b0 * -sin + d0 * cos;
    return this;
  }

  scale(sx, sy = sx) {
    this.elements[0] *= sx;
    this.elements[1] *= sx;
    this.elements[2] *= sy;
    this.elements[3] *= sy;
    return this;
  }

  skew(skewXRad, skewYRad = 0) {
    const tanX = Math.tan(skewXRad);
    const tanY = Math.tan(skewYRad);
    const a0 = this.elements[0], b0 = this.elements[1];
    const c0 = this.elements[2], d0 = this.elements[3];

    this.elements[0] = a0 + c0 * tanY;
    this.elements[1] = b0 + d0 * tanY;
    this.elements[2] = a0 * tanX + c0;
    this.elements[3] = b0 * tanX + d0;
    return this;
  }

  determinant() {
    return this.elements[0] * this.elements[3] - this.elements[1] * this.elements[2];
  }

  invert() {
    const a = this.elements[0], b = this.elements[1];
    const c = this.elements[2], d = this.elements[3];
    const e = this.elements[4], f = this.elements[5];
    const det = a * d - b * c;
    if (Math.abs(det) < 1e-12) return null;

    const invDet = 1 / det;
    this.elements[0] = d * invDet;
    this.elements[1] = -b * invDet;
    this.elements[2] = -c * invDet;
    this.elements[3] = a * invDet;
    this.elements[4] = (c * f - d * e) * invDet;
    this.elements[5] = (b * e - a * f) * invDet;
    return this;
  }

  getInverse() {
    const clone = this.clone();
    return clone.invert();
  }

  transformPoint(x, y) {
    return {
      x: this.elements[0] * x + this.elements[2] * y + this.elements[4],
      y: this.elements[1] * x + this.elements[3] * y + this.elements[5]
    };
  }

  transformVector(x, y) {
    return {
      x: this.elements[0] * x + this.elements[2] * y,
      y: this.elements[1] * x + this.elements[3] * y
    };
  }

  toScreenPoint(layerX, layerY) {
    return this.transformPoint(layerX, layerY);
  }

  toLayerPoint(screenX, screenY) {
    const inv = this.getInverse();
    if (!inv) return null;
    return inv.transformPoint(screenX, screenY);
  }

  computeLayerScreenMapping(layerW, layerH, screenW, screenH) {
    const b = this.elements;
    const m0 = b[0], m1 = b[1], m2 = b[2], m3 = b[3], m4 = b[4], m5 = b[5];

    const s0 = (m0 * layerW) / screenW;
    const s1 = (-m2 * layerH) / screenW;
    const s3 = (-m0 * layerW * 0.5 + m2 * layerH * 0.5 + m4) / screenW;

    const s4 = (-m1 * layerW) / screenH;
    const s5 = (m3 * layerH) / screenH;
    const s7 = 1 - (-m1 * layerW * 0.5 + m3 * layerH * 0.5 + m5) / screenH;

    const toScreen = new Float32Array(16);
    toScreen[0] = s0;  toScreen[1] = s1;  toScreen[2] = 0; toScreen[3] = s3;
    toScreen[4] = s4;  toScreen[5] = s5;  toScreen[6] = 0; toScreen[7] = s7;
    toScreen[8] = 0;   toScreen[9] = 0;   toScreen[10] = 1; toScreen[11] = 0;
    toScreen[12] = 0;  toScreen[13] = 0;  toScreen[14] = 0; toScreen[15] = 1;

    let det = s0 * s5 - s1 * s4;
    if (Math.abs(det) < 1e-12) {
      det = det < 0 ? -1e-12 : 1e-12;
    }
    const invDet = 1 / det;
    const l0 = s5 * invDet;
    const l1 = -s1 * invDet;
    const l4 = -s4 * invDet;
    const l5 = s0 * invDet;

    const toLayer = new Float32Array(16);
    toLayer[0] = l0;   toLayer[1] = l1;   toLayer[2] = 0; toLayer[3] = -(l0 * s3 + l1 * s7);
    toLayer[4] = l4;   toLayer[5] = l5;   toLayer[6] = 0; toLayer[7] = -(l4 * s3 + l5 * s7);
    toLayer[8] = 0;    toLayer[9] = 0;    toLayer[10] = 1; toLayer[11] = 0;
    toLayer[12] = 0;   toLayer[13] = 0;   toLayer[14] = 0; toLayer[15] = 1;

    return {
      toScreen,
      toLayer,
      sizePx: [layerW * Math.hypot(m0, m1), layerH * Math.hypot(m2, m3)],
      sizeNorm: [Math.hypot(s0, s4), Math.hypot(s1, s5)],
      centerPx: [m4, m5],
      centerNorm: [m4 / screenW, 1 - m5 / screenH],
      valid: true
    };
  }

  toMat4() {
    const a = this.elements[0], b = this.elements[1];
    const c = this.elements[2], d = this.elements[3];
    const e = this.elements[4], f = this.elements[5];
    return new Float32Array([
      a, b, 0, 0,
      c, d, 0, 0,
      0, 0, 1, 0,
      e, f, 0, 1
    ]);
  }

  toArray() {
    return Array.from(this.elements);
  }

  toFloat32Array() {
    return new Float32Array(this.elements);
  }
}
