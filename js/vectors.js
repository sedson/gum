/**
 * The Vec2 class.
 */
class Vec2 extends Array {
  /**
   * Construct a new Vec2. Gum vectors extend native JS arrays, so the 
   * myVec[0] syntax works but myVec.x is preferred.
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    super();
    this[0] = x;
    this[1] = y;
    this._changed = false;
  }

  /**
   * The x value.
   * @member
   */
  get x() { return this[0]; }
  set x(val) {
    this[0] = val;
    this._changed = true;
  }

  /**
   * The x value.
   * @member
   */
  get y() { return this[1]; }
  set y(val) {
    this[1] = val;
    this._changed = true;
  }

  /**
   * Get or set both x and y using a plain array.
   * @member
   */
  get xy() { return [this.x, this.y]; }
  set xy(xy) { this.set(...xy); }

  /**
   * Check if the vector has been changed since changed() was last checked.
   * @returns {boolean}
   */
  changed() {
    if (this._changed) {
      this._changed = false;
      return true;
    }
    return false;
  }

  /**
   * Set this vector.
   * @param {number} x
   * @param {number} y
   * @chainable
   */
  set(x, y) {
    this[0] = x;
    this[1] = y;
    this._changed = true;
    return this;
  }

  /**
   * Copy this vector.
   * @returns {Vec2}
   */
  copy() {
    return new Vec2(...this.xy);
  }

  /**
   * Add another vector to this one. IN PLACE!
   * @param {Vec2} a The other vector.
   * @chainable
   */
  add(a) {
    this.x += a.x;
    this.y += a.y;
    return this;
  }

  /**
   * Get the distance from this vector to another.
   * @param {Vec2} a The other vector.
   * @returns {number}
   */
  distance(a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get the squared distance from this vector to another.
   * @param {Vec2} a The other vector.
   * @returns {number}
   */
  distance2(a) {
    const dx = this.y - a.x;
    const dy = this.y - a.y;
    return dx * dx + dy * dy;
  }

  /**
   * Get a new vector, from a pointing back to this.
   * @param {Vec2} a The other vector.
   * @returns {Vec2}
   */
  vectorTo(a) {
    return new Vec2(a.x - this.x, a.y - this.y);
  }

}


/**
 * The Vec3 class.
 */
class Vec3 extends Array {
  /**
   * Construct a new Vec3. Gum vectors extend native JS arrays, so the 
   * myVec[0] syntax works but myVec.x is preferred.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * 
   */
  constructor(x = 0, y = 0, z = 0) {
    super();
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this._changed = false;
  }

  /**
   * The x value.
   * @member
   */
  get x() { return this[0]; }
  set x(val) {
    this[0] = val;
    this._changed = true;
  }

  /**
   * The y value.
   * @member
   */
  get y() { return this[1]; }
  set y(val) {
    this[1] = val;
    this._changed = true;
  }

  /**
   * The z value.
   * @member
   */
  get z() { return this[2]; }
  set z(val) {
    this[2] = val;
    this._changed = true;
  }

  /**
   * Get or x, y, and z using a plain array.
   * @member
   */
  get xyz() { return [this.x, this.y, this.z]; }
  set xyz(xyz) { this.set(...xyz); }

  /**
   * Check if the vector has been changed since changed() was last checked.
   * @returns {boolean}
   */
  changed() {
    if (this._changed) {
      this._changed = false;
      return true;
    }
    return false;
  }

  /**
   * Set this vector.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @chainable
   */
  set(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this._changed = true;
    return this;
  }

  /**
   * Copy this vector.
   * @returns {Vec3}
   */
  copy() {
    return new Vec3(...this.xyz);
  }

  /**
   * Add another vector to this one. IN PLACE!
   * @param {Vec3} a The other vector.
   * @chainable
   */
  add(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  /**
   * Subtract another vector from this one. IN PLACE!
   * @param {Vec3} a The other vector.
   * @chainable
   */
  sub(a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this;
  }

  /**
   * Distance from this to another.
   * @param {Vec3} a The other vector.
   * @return {number}
   */
  distance(a) {
    const dx = this.x - a.x;
    const dy = this.y - a.y;
    const dz = this.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Squared distance from this to another.
   * @param {Vec3} a The other vector.
   * @return {number}
   */
  distance2(a) {
    const dx = this.x - a.x;
    const dy = this.y - a.y;
    const dz = this.z - a.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * Magnitude of this vector.
   * @return {number}
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Multiply this vector by a scalar. IN PLACE!
   * @param {number} s The scalar.
   * @chainable
   */
  mult(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  /**
   * Divide this vector by a scalar. IN PLACE!
   * @param {number} s The scalar.
   * @chainable
   */
  div(s) {
    return this.mult(1 / s);
  }

  /**
   * Normalize this vector. IN PLACE!
   * @param {number} n The length of the normalized vector. Defualt 1.
   * @chainable
   */
  normalize(len = 1) {
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

  /**
   * Dot this vector with another.
   * @param {Vec3} a The other.
   * @returns {number}
   */
  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  /**
   * Cross this vector with another.
   * @param {Vec3} a The other.
   * @returns {Vec3} A new vector.
   */
  cross(a) {
    const x = this.y * a.z - this.z * a.y;
    const y = this.z * a.x - this.x * a.z;
    const z = this.x * a.y - this.y * a.x;
    return new Vec3(x, y, z);
  }

  /**
   * Get the vector pointing from this vector to another.
   * @param {Vec3} a The other.
   * @returns {Vec3} A new vector.
   */
  vectorTo(a) {
    return new Vec3(a.x - this.x, a.y - this.y, a.z - this.z);
  }

  /**
   * Equality test this vector with another.
   * @param {Vec3} a The other vector.
   * @param {number=} tolerance The min distance to consider equal.
   * @returns {boolean}
   */
  equals(a, tolerance = Number.EPSILON) {
    return Math.abs(this.x - a.x) < tolerance &&
      Math.abs(this.y - a.y) < tolerance &&
      Math.abs(this.z - a.z) < tolerance;
  }
}

export { Vec2, Vec3 }