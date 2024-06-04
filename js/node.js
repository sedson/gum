/**
 * @file A single node (gameObject).
 */
import * as m4 from './matrix.js';
import { Transform } from './transform.js';
import { uuid } from './id.js';

// Track a hidden render node id.
let id = 0;

/**
 * The Node class represents a scene-graph node.
 */
class Node {
  /**
   * Construct a new Node. None of the arguments are strictly necessary.
   * @param {string} name 
   * @param {string} geometry 
   * @param {Transform} transform 
   */
  constructor(name, geometry, transform) {
    /**
     * The name of the node.
     * @type {string} 
     */
    this.name = name;

    /**
     * A short unique id.
     * @type {string} 
     */
    this.id = uuid();

    /**
     * A numeric render id.
     * @type {number}
     */
    this.renderId = id++;

    /**
     * The pointer to the mesh name in the render system.
     * @type {string|null}
     */
    this.geometry = geometry || null;
    
    /**
     * This objects 3D transform.
     * @type {Transform}
     */
    this.transform = transform || new Transform();

    /**
     * Whether this object is visible to the scene.
     * @type {boolean}
     */
    this.visible = true;

    /**
     * The parent node. Always use the .setParent() method to manage parenting.
     * @readonly
     * @type {Node|null}
     */
    this.parent = null;

    /**
     * The children list. Always use the .setParent() method to manage parenting.
     * @readonly
     * @type {array<Node>}
     */
    this.children = [];

    /**
     * The private world matrix.
     * @private
     */
    this._worldMatrix = m4.create();
    
    /**
     * The shader uniforms attached to this node.
     * @type {object}
     */
    this.uniforms = {
      uObjectId: this.renderId,
      uModel: this._worldMatrix,
      uTex: 'none',
    };

    /**
     * The name of the shader program to use when rendering this object.
     * @type {string}
     */
    this.program = 'default';
  }

  /**
   * Reference to the transform position.
   * @type {Vec3}
   */
  get position () { return this.transform.position; }

  /**
   * Reference to the transform rotation.
   * @type {Vec3}
   */
  get rotation () { return this.transform.rotation; }

  /**
   * Reference to the transform scale.
   * @type {Vec3}
   */
  get scale () { return this.transform.scale; }

  /**
   * The x position of this object's transform.
   * @type {number}
   */
  get x ()  { return this.transform.position.x };
  
  /**
   * The y position of this object's transform.
   * @type {number}
   */
  get y ()  { return this.transform.position.y };
  
  /**
   * The z position of this object's transform.
   * @type {number}
   */
  get z ()  { return this.transform.position.z };
  
  /**
   * The x rotation of this object's transform.
   * @type {number}
   */
  get rx () { return this.transform.rotation.x };

  /**
   * The y rotation of this object's transform.
   * @type {number}
   */
  get ry () { return this.transform.rotation.y };

  /**
   * The z rotation of this object's transform.
   * @type {number}
   */
  get rz () { return this.transform.rotation.z };


  /**
   * Move this node somewhere.
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @chainable
   */
  move (x, y, z) {
    this.transform.position.set(x, y, z);
    return this;
  }

  /**
   * Rotate this node.
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @chainable
   */
  rotate (x, y, z) {
    this.transform.rotation.set(x, y, z);
    return this;
  }

  /**
   * Scale this node.
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @chainable
   */
  rescale (x, y, z) {
    if (arguments.length === 1) {
      this.transform.scale.set(x, x, x);
    } else {
      this.transform.scale.set(x, y, z);    
    }
    return this;
  }

  get worldPosition () {
    return ([this._worldMatrix[12], this._worldMatrix[13], this._worldMatrix[14]]);
  }

  /**
   * 
   * @param {*} parent 
   * @private
   */
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

  /**
   * Parent this node to another one. This node's transform is now in the local space 
   * ogf its parent.
   * @param {Node} node 
   * @chainable
   */
  setParent (node) {
    if (this.parent) {
      this.parent._removeChild(this);
    }

    this.parent = node;
    this.parent._addChild(this);
    this._dirty = true;
    return this;
  }

  /**
   * Set the geometry (mesh) used to render this node.
   * @param {string} geo The string geometry pointer. 
   * @chainable
   */
  setGeometry (geo) {
    this.geometry = geo;
    return this;
  }

  /**
   * Set the program (shader) used when rendering this node and its children (unless they override);
   * @param {string} prog The string program pointer. 
   * @chainable
   */
  setProgram (prog) {
    this.program = prog;
    return this;
  }

  /**
   * Create a child node under this node. Return the new child.
   * @param {string} name 
   * @param {string} geometry 
   * @returns {Node} 
   */
  createChildNode (name, geometry) {
    let node = new Node(name, geometry);
    node.setParent(this);
    return node;
  }

  /**
   * 
   * @param {*} node 
   * @private
   */
  _removeChild (node) {
    this.children = this.children.filter(n => n !== node);
  }

  /**
   * 
   * @param {*} node 
   * @private
   */
  _addChild (node) {
    this.children.push(node);
    this._dirty = true;
  }

  /**
   * 
   * @param {*} output 
   * @param {*} depth 
   * @returns {string}
   * @private
   */
  _print (output, depth) {
    if (depth > 0) {
      for (let i = 1; i < depth; i++) { 
        output += '  ';
      }
      output += '└─'
    }

    const geometry = this.geometry ? 'm.' + this.geometry : '';
    const name = this.name ? this.name : 'id: ' + this.id;
    output += `<em>${name}</em> : ${geometry}`;
    output += '\n';
    if (this.children) {
      output += this.children.map(c => c._print('', depth + 1)).join('');
    }

    return output;
  }

  /**
   * 
   * @param {*} drawList 
   * @param {*} children 
   * @returns {array}
   * @private
   */
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

  /**
   * Recursively walk this node and its children, calling a callback at each node.
   * @param {Function} fn A func(node) => { doSomethingTo(node) } shaped callback.
   */
  traverse (fn) {
    fn(this);
    this.children.forEach(child => child.traverse(fn));
  }
  
  /**
   * Set a single uniform on this node.
   * @param {string} name The name of the uniform.
   * @param {number|array} value The GL value to set.
   * @chainable
   */
  uniform (name, value) {
    this.uniforms[name] = value;
    return this;
  }

  /**
   * Set multiple uniforms on this node.
   * @param {object} uniforms A {name: str -> val: number or array } object to set.
   * @chainable
   */
  uniforms (uniforms) {
    for (let [name, value] of Object.entries(uniforms)) {
      this.uniform(name, value)
    }
    return this;
  }
}

export { Node }