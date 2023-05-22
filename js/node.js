/**
 * A single node (gameObject).
 */
import * as m4 from './matrix.js';
import { Transform } from './transform.js';


export class Node {

  constructor(name, geometry, transform) {
    this.name = name;
    this.id = this.generateId();
    this.geometry = geometry || null;
    this.transform = transform || new Transform();
    this.visible = true;
    this.parent = null;
    this.children = [];
    this._worldMatrix = m4.create();
    this.uniforms = {
      uObjectId: this.id,
      uModel: this._worldMatrix,
      uTex: 'none',
    };
  }

  get x ()  { return this.transform.position.x };
  get y ()  { return this.transform.position.y };
  get z ()  { return this.transform.position.z };
  
  get rx () { return this.transform.rotation.x };
  get ry () { return this.transform.rotation.y };
  get rz () { return this.transform.rotation.z };


  /** 
   * Move this node to a location, this is the local position.
   */
  move (x, y, z) {
    this.transform.position.set(x, y, z);
    return this;
  }


  rotate (x, y, z) {
    this.transform.rotation.set(x, y, z);
    return this;
  }


  scale (x) {
    this.transform.scale.set(x, x, x);
    return this;
  }

  get worldPosition () {
    return ([this._worldMatrix[12], this._worldMatrix[13], this._worldMatrix[14]]);
  }


  _calculateWorldMatrix (parent) {
    if (parent) {
      m4.multiply(this._worldMatrix, parent._worldMatrix, this.transform.matrix);
    } else {
      m4.copy(this._worldMatrix, this.transform.matrix);
    }

    this.children.forEach(child => {
      child._calculateWorldMatrix(this);
    });
  }


  setParent (node) {
    if (this.parent) {
      this.parent._removeChild(this);
    }

    this.parent = node;
    this.parent._addChild(this);
    this._dirty = true;
    return this;
  }

  setGeometry (geo) {
    this.geometry = geo;
    return this;
  }

  createChildNode (name, geometry) {
    let node = new Node(name, geometry);
    node.setParent(this);
    return node;
  }


  generateId () {
    let id = '';
    for (let i = 0; i < 4; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }


  _removeChild (node) {
    this.children = this.children.filter(n => n !== node);
  }


  _addChild (node) {
    this.children.push(node);
    this._dirty = true;
  }


  _print (output, depth) {
    if (depth > 0) {
      for (let i = 1; i < depth; i++) { 
        output += '  ';
      }
      output += '└─'
    }

    const geometry = this.geometry ? 'm.' + this.geometry : '';
    output += `<em>${this.name}</em> : ${geometry}`;
    output += '\n';
    if (this.children) {
      output += this.children.map(c => c._print('', depth + 1)).join('');
    }

    return output;
  }

  _toDrawList (drawList, children = true) {
    if (!this.visible) {
      return;
    }

    if (this.geometry) {
      drawList.push(this);
    }

    if (children) {
      this.children.forEach(child => child._toDrawList(drawList));
    }

    return drawList;
  }


  traverse (fn) {
    fn(this);
    this.children.forEach(child => child.traverse(fn));
  }

  uniform (name, value) {
    this.uniforms[name] = value;
  }
}