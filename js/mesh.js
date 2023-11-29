/**
 * @fileoverview Provide a polygonal mesh class.
 */

import * as MeshOps from './mesh-ops.js';
import { Vec3 } from './vectors.js';

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
  constructor (vertices, faces, meta = {}) {
    
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
}


  /**
   * Triangulate this mesh.
   * @chainable
   */
  triangulate () {
    this.faces = MeshOps.triangulate(this.faces);
    return this;
  }


  /**
   * Create a render-able version of the mesh that works with a gl.drawArrays()
   * call. 
   * TODO : Rename this.
   * @returns 
   */
  render () {
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

    const name = this.name;
    return { mode, vertexCount, attribs, name };
  }


  renderEdges () {
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

    const name = this.name + '_edges'
    return { mode, vertexCount, attribs, name };
  }


  renderPoints () {
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

    const name = this.name + '_points';
    return { mode, vertexCount, attribs, name};
  }


  renderNormals (length = 0.05) {
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

    const name = this.name + '_normals';
    return { mode, vertexCount, attribs, name };
  }


  /**
   * Attach group info to this mesh. Adds another attrib (surfaceId) to each 
   * vertex. The surfaceId value will be unique for each set of disjoint 
   * vertices in the mesh.
   * @chainable 
   */
  findGroups () {
    const groups = MeshOps.findGroups(this.faces);
    this.vertices = MeshOps.applyAttribVarying('surfaceId', groups, this.vertices);
    return this;
  }


  /**
   * Fill the vetex colors for the mesh with a single vertex color.
   */
  fill (col) {
    this.vertices = MeshOps.applyAttribConstant('color', col.rgba, this.vertices);
    return this;
  }


  /**
   * Inflate the mesh along its normals.
   */ 
  inflate (amt = 0) {
    for (let vi = 0; vi < this.vertices.length; vi++) {
      const vertex = this.vertices[vi];
      if (!(vertex.position && vertex.normal)) continue;

      for (let i = 0; i < 3; i++) {
        vertex.position[i] += vertex.normal[i] * amt;
      }
    }
    return this;
  }


  getEdges () {
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

  shadeFlat () {
    const { vertices, faces } = MeshOps.shadeFlat(this.vertices, this.faces);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }

  shadeSmooth (tolerance) {
    const { vertices, faces } = MeshOps.shadeSmooth(this.vertices, this.faces, tolerance);
    this.vertices = vertices;
    this.faces = faces;
    return this;
  }

  
}