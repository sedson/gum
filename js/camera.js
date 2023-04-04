import { Node } from "./node.js";
import * as m4 from "./matrix.js";
import { Vec3 } from "./vectors.js";
import { radians } from "./common.js";

export class Camera extends Node {
  constructor (transform, fov) { 
    super ('camera', null, transform);

    this.fov = fov || 35;
    this.near = 0.5;
    this.far = 100;
    
    this.view = m4.create();

    this.projection = m4.create();

    this.target = new Vec3(0, 0, 0);

    this.updateViewProjection();
  }

  get eye () { return this.worldPosition }
  set aspect (val) { this._aspect = val; }


  updateViewProjection () {
    m4.lookAt(this.view, this.eye, this.target.xyz, [0, 1, 0]);
    m4.perspective(this.projection, radians(this.fov), this._aspect, this.near, this.far);
  }
}