/**
 * 2 element vector class.
 */
export class Vec2 {
  constructor(x, y, z) {
    this._x = x || 0;
    this._y = y || 0;
    this._changed = false;
  }

  get x ()    { return this._x; }
  set x (val) { this._x = val; this._changed = true; }
  get y ()    { return this._y; }
  set y (val) { this._y = val; this._changed = true; }
  
  get xy ()   { return [this.x, this.y]; }
  set xy (xy) { this.set(...xy); }

  changed () {
    if (this._changed) {
      this._changed = false;
      return true;
    }
    return false;
  }

  set (x, y) {
    this._x = x;
    this._y = y;
    this._changed = true;
    return this;
  }

  copy () {
    return new Vec2(...this.xy);
  }
  
  add (a) {
    this.x += a.x;
    this.y += a.y;
    return this;
  }

  distance (a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distance2 (a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    return dx * dx + dy * dy;
  }
  
}


/**
 * 3 element vector class.
 */
export class Vec3 {
  constructor(x, y, z) {
    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._changed = false;
  }
  
  get x ()    { return this._x; }
  set x (val) { this._x = val; this._changed = true; }
  get y ()    { return this._y; }
  set y (val) { this._y = val; this._changed = true; }
  get z ()    { return this._z; }
  set z (val) { this._z = val; this._changed = true; }

  get xyz ()    { return [this.x, this.y, this.z]; }
  set xyz (xyz) { this.set(...xyz); } 
  

  changed () {
    if (this._changed) {
      this._changed = false;
      return true;
    }
    return false;
  }

  set (x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._changed = true;
    return this;
  }
 
  copy () {
    return new Vec3(...this.xyz);
  }

  add (a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  sub (a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this;
  }

  distance (a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    const dz = this.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  distance2 (a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    const dz = this.z - a.z;
    return dx * dx + dy * dy + dz * dz;
  }

  mag () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  mult (s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  div (s) {
    return this.mult(1 / s);
  }


  normalize (len = 1) {
    const mag = this.mag(); 
    if (mag === 0) {
      return this;
    }
    let scalar = len / mag;
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  dot (a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  cross (a) {
    const x = this.y * a.z - this.z * a.y;
    const y = this.z * a.x - this.x * a.z;
    const z = this.x * a.y - this.y * a.x;
    return new Vec3(x, y, z);
  }

  equals (a, tolerance = Number.EPSILON) {
    return Math.abs(this.x - a.x) < tolerance &&
           Math.abs(this.y - a.y) < tolerance && 
           Math.abs(this.z - a.z) < tolerance;
  }


}