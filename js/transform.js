/**
 * 
 */

import { Vec2, Vec3 } from "./vectors.js";
import * as m4 from "./matrix.js";


export class Transform {
  constructor () {
    this.position = new Vec3();
    this.rotation = new Vec3();
    this.scale = new Vec3(1, 1, 1);
    this._matrix = m4.create();
    this._changed = false;
  }

  _updateMatrix() {
    m4.identity(this._matrix);
    m4.translate(this._matrix, this._matrix, this.position.xyz);
    m4.rotate(this._matrix, this._matrix, this.rotation.x, [1, 0, 0]);
    m4.rotate(this._matrix, this._matrix, this.rotation.y, [0, 1, 0]);
    m4.rotate(this._matrix, this._matrix, this.rotation.z, [0, 0, 1]);
    m4.scale(this._matrix, this._matrix, this.scale.xyz);
  }

  get changed() {
    if (this.rotation._changed || this.position._changed || this.scale._changed) {
      this.position._changed = false;
      this.rotation._changed = false;
      this.scale._changed = false;
      return true;
    }
    return false;
  }

  get matrix() {
    if (this.changed) {
      this._updateMatrix();
    }
    return this._matrix;
  }
}