/**
 * @fileoverview A scene contains a transform hierarchy that can be rendered by 
 * a renderer. It also contains a camera.
 */

import { Node } from './node.js';
import { Camera } from './camera.js';


/**
 * 
 */
export class Scene extends Node {
  constructor() {
    super('scene', null);
    this.camera = new Camera();
    this.camera.setParent(this);
    this._drawCalls = [];
  }

  print () {
    return this._print('* ', 0);
  }

  drawCalls () {
    this._drawCalls = [];
    return this._toDrawList(this._drawCalls);
  }

  add () {
    
  }

  
  updateSceneGraph () {
    this._calculateWorldMatrix();
  }


  
}