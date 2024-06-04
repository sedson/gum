/**
 * @fileoverview Provide a polygonal mesh class.
 */

import * as MeshOps from './mesh-ops.js';
import { Vec3 } from './vectors.js';
import { uuid } from './id.js';

/**
 * A single vertex.Contains 1 or more named attributes.
 * @typedef {object} Vertex
 */

/**
 * A single face. Contains an array of 3 or more indices into a vertex list.
 * @typedef {array<number>} Face
 */

/**
 * The mesh class represents the vertex and face data of a shape. Meshses are 
 * created with shape primitives or by loading models.
 */
class Mesh {
  /**
   * Construct a mesh from a list of vertices and faces.
   * @param {array<Vertex>} vertices 
   * @param {array<Face>} faces 
   * @param {object} meta Additional meta information about the mesh. Name and 
   *     more.
   */
  constructor(vertices, faces, meta = {}) {

    /** 
     * The array of vertices for this mesh. Each entry is object with with 
     * named attributes and arrays for the value.
     * @type {array<Vertex>}
     */
    this.vertices = vertices;

    /**
     * The array of faces for this mesh. An array of arrays. The internal array
     * contains indices into the vertex array. Quads and ngons are allowed but 
     * must be triangulated before being sent to the card.
     * @type {array<Face>}
     */
    this.faces = faces;

    /**
     * A name for this mesh.
     * @type {string}
     */
    this.name = meta.name || 'mesh';

    /**
     * The id for this mesh.
     * @type {string}
     */
    this.id = uuid();
  }


  /**
   * Triangulate this mesh. Turns any quads and ngons into triangles. Is done 
   * before passing to GL anyway.
   * @chainable
   */
  triangulate() {
    this.faces = MeshOps.triangulate(this.faces);
    return this;
  }


  /**
   * Creates a render-able version of the mesh that works with a gl.drawArrays()
   * call. 
   * @returns {object} The flattened, triangulates, GL ready data.
   */
  render() {
    const mode = 'TRIANGLES';
    const triangles = MeshOps.triangulate(this.faces);
    const vertexCount = triangles.length * 3;
    const attribs = {};

    for (let f = 0; f < triangles.length; f++) {
      const face = triangles[f];

      for (let v = 0; v < 3; v++) {
        const vertex = this.vertices[face[v]];

        for (let attrib in vertex) {
          const data = vertex[attrib];
          if (!attribs[attrib]) {
            attribs[attrib] = [];
          }
          attribs[attrib].push(...data);
        }
      }

    }
    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    const name = `${this.name}_${this.id}`;
    return { mode, vertexCount, attribs, name };
  }


  /**
   * Creates a wireframe version of this mesh that works with a gl.drawArrays()
   * call. Use gl.LINES mode.
   * @returns {object} The flattened GL ready edge data.
   */
  renderEdges() {
    const mode = 'LINES';
    const edges = MeshOps.facesToEdges(this.faces);
    const vertexCount = edges.length * 2;
    const attribs = {};

    for (let ei = 0; ei < edges.length; ei++) {
      const edge = edges[ei];
      for (let vi = 0; vi < 2; vi++) {
        const vertex = this.vertices[edge[vi]];
        for (let attrib in vertex) {
          const data = vertex[attrib];
          if (!attribs[attrib]) {
            attribs[attrib] = [];
          }
          attribs[attrib].push(...data);
        }
      }
    }
    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    const name = `${this.name}_${this.id}_edges`;
    return { mode, vertexCount, attribs, name };
  }


  /**
   * Render points as the vertices of this mesh. Uses gl.POINTS mode.
   * @returns {object} The flattened GL ready point data.
   */
  renderPoints() {
    const mode = 'POINTS';
    const vertexCount = this.vertices.length;
    const attribs = {};

    for (let vi = 0; vi < this.vertices.length; vi++) {
      const vertex = this.vertices[vi];
      for (let attrib in vertex) {
        const data = vertex[attrib];
        if (!attribs[attrib]) {
          attribs[attrib] = [];
        }
        attribs[attrib].push(...data);
      }
    }

    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    const name = `${this.name}_${this.id}_points`;
    return { mode, vertexCount, attribs, name };
  }


  /**
   * Render the vertex normal data as wireframe lines using the gl.LINES mode
   * @param {number} length The length in world units to debug normals with.
   * @returns {object} The flattened GL ready edge data.
   */
  renderNormals(length = 0.05) {
    const mode = 'LINES';
    const vertexCount = this.vertices.length * 2;
    const attribs = {};

    for (let vi = 0; vi < this.vertices.length; vi++) {
      const vertex = this.vertices[vi];


      for (let attrib in vertex) {
        const data = vertex[attrib];
        if (!attribs[attrib]) {
          attribs[attrib] = [];
        }
        attribs[attrib].push(...data);

        if (attrib === 'position' && vertex['normal']) {
          const { position, normal } = vertex;
          const position2 = new Vec3(...position);
          position2.add(new Vec3(...normal).normalize(length));
          attribs[attrib].push(...position2.xyz);
        } else {
          attribs[attrib].push(...data);
        }
      }
    }

    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    const name = `${this.name}_${this.id}_normals`;
    return { mode, vertexCount, attribs, name };
  }


  /**
   * Attach group info to this mesh. Adds another attrib (surfaceId) to each 
   * vertex. The surfaceId value will be unique for each set of disjoint 
   * vertices in the mesh.
   * @chainable 
   */
  findGroups() {
    const groups = MeshOps.findGroups(this.faces);
    this.vertices = MeshOps.applyAttribVarying('surfaceId', groups, this.vertices);
    return this;
  }


  /**
   * Fill the vertex colors for the mesh with a single vertex color.
   * @param {color|function} col The color to apply to each vertex OR a function 
   *     to map to each vertex that returns a color.
   * @chainable
   */
  fill(col) {

    if (col.rgba) {
      this.vertices = MeshOps.applyAttribConstant('color', col.rgba, this.vertices);
    } else if (typeof col === 'function') {
      this.vertices = MeshOps.applyAttribConstant('color', col, this.vertices);
    } else {
      console.warn(`Fill: ${col} was not of type color or function.`);
    }

    return this;
  }


  /**
   * Inflate the mesh along its normals.
   * @param {number} amt The amount to inflate the mesh by. Can be positive or 
   * negative.
   * @chainable
   */
  inflate(amt = 0) {
    for (let vi = 0; vi < this.vertices.length; vi++) {
      const vertex = this.vertices[vi];
      if (!(vertex.position && vertex.normal)) continue;
      for (let i = 0; i < 3; i++) {
        vertex.position[i] += vertex.normal[i] * amt;
      }
    }
    return this;
  }


  /**
   * Get a position-only edge list where p0, p1, p2, p3 are vec3s and the edge 
   * list is [[p0, p1], [p1, [p2], [p3, p4]]...]. 
   * @returns {array<array<Vector3>>} The nested edge array.
   */
  getEdges() {
    const edges = MeshOps.facesToEdges(this.faces);
    const outEdges = [];

    for (let ei = 0; ei < edges.length; ei++) {
      const edge = edges[ei];
      const pos1 = this.vertices[edge[0]].position;
      const pos2 = this.vertices[edge[1]].position;
      outEdges.push([pos1, pos2]);
    }
    return outEdges;
  }


  /**
   * Convert this mesh to flat-shaded vertices.
   * @chainable
   */
  shadeFlat() {
    const { vertices, faces } = MeshOps.shadeFlat(this.vertices, this.faces);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }


  /**
   * Convert this mesh to smooth-shaded vertices.
   * @param {number} tolerance Vertices that are closer-together than tolerance
   *     will me merged.
   * @chainable
   */
  shadeSmooth(tolerance) {
    const { vertices, faces } = MeshOps.shadeSmooth(this.vertices, this.faces, tolerance);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }


  /**
   * Transforms all the positions and normals in this mesh by some 3D 
   * transformation.
   * @param {Transform} transform The Gum Transform to use.
   * @chainable
   */
  applyTransform(transform) {
    for (let vi = 0; vi < this.vertices.length; vi++) {
      const vert = this.vertices[vi];
      if (vert.position) {
        vert.position = transform.transformPoint(vert.position);
      }
      if (vert.normal) {
        vert.normal = transform.transformNormal(vert.normal);
      }
    }
    return this;
  }


  /**
   * Join another mesh into this one.
   * @param {Mesh} The other mesh.
   * @chainable
   */
  join(other) {
    const offset = this.vertices.length;

    const newFaces = other.faces.map(face => {
      return face.map(index => index + offset);
    });

    this.vertices = this.vertices.concat(other.vertices);
    this.faces = this.faces.concat(newFaces);

    return this;
  }


  /**
   * Invert this meshes normals.
   * @chainable
   */
  flipNormals() {
    const flipNormal = n => n.map(x => x * -1);
    this.vertices = MeshOps.mapFuncToAttributes(this.vertices, 'normal', flipNormal);
    return this;
  }


  /**
   * Return a full deep copy of this mesh.
   * @returns {Mesh} The new mesh.
   */
  copy() {
    const copyVertices = JSON.parse(JSON.stringify(this.vertices));
    const copFaces = JSON.parse(JSON.stringify(this.faces));
    return new Mesh(copyVertices, copFaces, { name: this.name });
  }


  /**
   * Map a function over the vertices in this mesh.
   * @param {Function} func A vertex->vertex callback.
   * 
   * @exmaple 
   * // This function copies the vertex position, normalizes it, then uses 
   * // that as the vertex color rgb.
   * function vertFunc (vert) {
   *   const pos = g.vec3(...vert.position);
   *   pos.normalize();
   *   return {
   *      color: [...pos, 1]
   *   };
   * }
   * 
   * myMesh.attributeMap(vertFunc);
   */
  attributeMap(func) {
    this.vertices = MeshOps.attributeMap(this.vertices, func);
    return this;
  }
}

export { Mesh }