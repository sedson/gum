/**
 * @file Provide the operations used on meshes.
 */
import { Vec3 } from './vectors.js';

/**
 * Triangulate a mesh. Discard any "faces" with fewer than 3 vertices. Convert 
 * any faces with 4+ vertices to triangles using a triangle fan method. For 
 * example the quad [0, 1, 2, 3] becomes the two tris [0, 1, 2] and [0, 2, 3] 
 * rather than [0, 1, 2] and [1, 2, 3].
 * @param {array<array>} faces The list of input faces.
 * @return {array<array>} The list of of updated faces.
 */
export function triangulate (faces) {
  const outFaces = [];

  faces.forEach(face => {
    if (face.length < 3) {
      return;
    }

    if (face.length === 3 ) {
      outFaces.push(face);
      return;
    }

    for (let i = 1; i < face.length - 1; i++) {
      outFaces.push([face[0], face[i], face[i+1]]);
    }
  });

  return outFaces;
}


/**
 * Validate a mesh. Make sure that all indices used in the face list are 
 * within bounds on the vertex list.
 * @param {array<Vertex>} vertices The list of vertices.
 * @param {array<Face>} faces The list of faces.
 * @return {boolean}
 */
export function validate (vertices, faces) { 
  for (let f = 0; f < faces.length; f++) {
    const face = faces[f];
    for (let vi = 0; vi < face.length; vi++ ){
      if (face[vi] > vertices.length) {
        return false;
      }
    }
  }
  return true;
}


/**
 * If two faces share a vertex consider them grouped. Iterate over all the faces 
 * and compute the distinct groups, returning a list of group ids in vertex 
 * order. A smooth-shaded sphere will have only 1 group. Meaning the returned 
 * list will have only 1 value. Like [0, 0, ... 0]. A flat-shaded model will 
 * have one group per flat-shaded face. That return data might look like 
 * [0, 0, 0, 1, 1, 1, ... 12, 12, 12]. If the mesh is valid and has no loose 
 * vertices, the returned list will have the same length as the mesh's vertex 
 * list.
 * @param {array<Face>} faces The mesh's face list.
 * @returns {array<number>} A list of group IDs that can be applied to a mesh 
 *     using applyAttribVarying().
 */
export function findGroups (faces) {
  let groups = [];

  /**
   * Join a set with another set or a list.
   * @param {Set} a The receiving set. 
   * @param {Ser|array} b The giving set or list.
   * @returns 
   */
  const join = (a, b) => {
    if (b instanceof Set) {
      for (let val of b.values()) {
        a.add(val);
      }
      return;
    } 
    b.forEach(val => a.add(val));
  }

  for (let fi = 0; fi < faces.length; fi++) {
    const vertices = faces[fi];
    for (let vi = 0; vi < vertices.length; vi++) {

      const v = vertices[vi];
      let markedGroups = [];

      for (let gi = 0; gi < groups.length; gi++) {
        const group = groups[gi];
        if (group.has(v)) {
          join(group, vertices);
          markedGroups.push(gi);
        }
      }

      if (markedGroups.length === 0) {
        const newGroup = new Set();
        join(newGroup, vertices);
        groups.push(newGroup);
      }

      if (markedGroups.length > 1) {
        const receivingGroup = groups[markedGroups[0]];

        for (let mgi = 1; mgi < markedGroups.length; mgi++) {
          join(receivingGroup, groups[markedGroups[mgi]]);
          groups[markedGroups[mgi]] = false;
        }

        groups = groups.filter(x => x);
      }
    }
  }

  // Groups now contains one or more sets. Between these groups every vertex 
  // index in the mesh should be included. 
  const groupsByVertIndex = [];
  groups.forEach((group, groupIndex) => {
    for (let vertIndex of group.values()) {
      groupsByVertIndex[vertIndex] = groupIndex;
    }
  }); 

  return groupsByVertIndex;
}


/**
 * Apply a new attribute to the vertices of a mesh where the attributes can 
 * vary across the vertices.
 * @param {string} attribName The name of the attribute to attach to each
 *     vertex. 
 * @param {array<(array|number)>} attribValues An array of values to attach.
 *     Must be the same length as vertices. 
 * @param {array<Vertex>} vertices The mesh's vertex list.
 * @returns 
 */
export function applyAttribVarying (attribName, attribValues, vertices) {
  const outVertices = [];
  if (vertices.length !== attribValues.length) {
    console.error(`Cannot apply attribute: ${attribName} Mismatched length.`);
    return vertices;
  }

  for (let vi = 0; vi < vertices.length; vi++) {
    const vertex = vertices[vi];
    const outVertex = {};
    for (let attrib in vertex) {
      outVertex[attrib] = [...vertex[attrib]];
    }
    if (Array.isArray(attribValues[vi])) {
      outVertex[attribName] = [...attribValues[vi]];
    } else {
      outVertex[attribName] = [attribValues[vi]];
    }
    outVertices.push(outVertex);
  }
  return outVertices;
}


export function applyAttribConstant (attribName, attribValue, vertices) {
  const outVertices = [];
  for (let vi = 0; vi < vertices.length; vi++) {
    const vertex = vertices[vi];
    const outVertex = {};
    for (let attrib in vertex) {
      outVertex[attrib] = [...vertex[attrib]];
    }
    if (Array.isArray(attribValue)) {
      outVertex[attribName] = [...attribValue];
    } else {
      outVertex[attribName] = [attribValue];
    }
    outVertices.push(outVertex);
  }
  return outVertices;
}


export function facesToEdges (faces) {
  const outEdges = [];
  for (let fi = 0; fi < faces.length; fi++) {
    const face = faces[fi];
    for(let vi = 0; vi < face.length; vi++) {
      outEdges.push([face[vi], face[(vi + 1) % face.length]]);
    }
  }
  return outEdges;
}


export function verticesToNormals (vertices) {
  const outEdges = [];
  for (let vi = 0; vi < vertices.length; vi++) {
    const vertex = vertices[vi];
    if (!vertex.position || !vertex.normal) { continue; }

    const { position, normal } = vertex;
    const position2 = new Vec3(...position);
    position2.add(new Vec3(...normal).normalize(1));

    outEdges.push(vertex);

    const vertex2 = { 
      ...vertex,
      position: position2
    };

    outEdges.push(vertex2);
  }
  console.log(outEdges)
  return outEdges;
}

