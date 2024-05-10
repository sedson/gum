/**
 * @fileoverview Provide a polygonal mesh class.
 */

import * as MeshOps from './mesh-ops.js';
import { Vec3 } from './vectors.js';
import * as m4 from './matrix.js';
import { uuid } from './id.js';

/**
 * A single vertex. Contains 1 or more named attributes. 
 * @typedef {object} Vertex
 */

/**
 * A single face. Contains an array of 3 or more indices into a vertex list.
 * @typedef {array<number>} Face
 */


export class Mesh {
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
     * @example 
     */
    this.vertices = vertices;

    /**
     * The array of faces for this mesh. An array of arrays. The internal array
     * contains indices into the vertex array. Quads and ngons are allowed but 
     * must be triangulated before being sent to the 
     * @type {array<Face>}
     */
    this.faces = faces;

    /**
     * A name for this mesh.
     */
    this.name = meta.name || 'mesh';

    /**
     * The id for this mesh.
     */
    this.id = uuid();
  }


  /**
   * Triangulate this mesh.
   * @chainable
   */
  triangulate() {
    this.faces = MeshOps.triangulate(this.faces);
    return this;
  }


  /**
   * Create a render-able version of the mesh that works with a gl.drawArrays()
   * call. 
   * TODO : Rename this.
   * @returns 
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
   * Fill the vetex colors for the mesh with a single vertex color.
   * @param {color|function} col The color to apply to each vertex OR a function 
   *     to map to each vertex that returns a color.
   */
  fill(col) {

    if (col.rgba) {
      this.vertices = MeshOps.applyAttribConstant('color', col.rgba, this.vertices);
    } else if (typeof col === 'function') {
      this.vertices = MeshOps.applyAttribConstant('color', col, this.vertices);
    } else {
      console.warn(`${col} was not of type color or function.`);
    }

    return this;
  }


  /**
   * Inflate the mesh along its normals.
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

  shadeFlat() {
    const { vertices, faces } = MeshOps.shadeFlat(this.vertices, this.faces);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }

  shadeSmooth(tolerance) {
    const { vertices, faces } = MeshOps.shadeSmooth(this.vertices, this.faces, tolerance);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }

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

  join(other) {
    const offset = this.vertices.length;

    const newFaces = other.faces.map(face => {
      return face.map(index => index + offset);
    });

    this.vertices = this.vertices.concat(other.vertices);
    this.faces = this.faces.concat(newFaces);

    return this;
  }

  flipNormals() {
    const flipNormal = n => n.map(x => x * -1);
    this.vertices = MeshOps.mapFuncToAttributes(this.vertices, 'normal', flipNormal);
    return this;
  }

  copy() {
    const copyVertices = JSON.parse(JSON.stringify(this.vertices));
    const copFaces = JSON.parse(JSON.stringify(this.faces));
    return new Mesh(copyVertices, copFaces, { name: this.name });
  }
}