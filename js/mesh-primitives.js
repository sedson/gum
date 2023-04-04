/**
 * @file Provide geometric primitives.
 */

import { Vec3 } from "./vectors.js";
import { Mesh } from "./mesh.js";


/**
 * Make a cube shape.
 * @param {number} size The size of the cube.
 * @return {object} A vertex attribute array.
 */ 
export function cube (size = 1) {
  const s = size / 2;
  
  //   7-----6
  //  /|    /|
  // 4-----5 |
  // | 3---|-2
  // |/    |/
  // 0-----1

  const positions = [
    [-s, -s, +s],
    [+s, -s, +s],
    [+s, -s, -s],
    [-s, -s, -s],
    
    [-s, +s, +s],
    [+s, +s, +s],
    [+s, +s, -s],
    [-s, +s, -s]
  ];


  const vertices = [];
  const faces = [];
  let i = 0;

  const quad = function (a, b, c, d, normal, color) {
    vertices.push(
      {position: positions[a], normal, color, texCoord: [0, 0]},
      {position: positions[b], normal, color, texCoord: [1, 0]},
      {position: positions[c], normal, color, texCoord: [1, 1]},
      {position: positions[d], normal, color, texCoord: [0, 1]},
    );

    faces.push([i, i + 1, i + 2, i + 3]);
    
    i += 4;
  }

  quad(0, 1, 5, 4, [0, 0, +1], [1, 0, 0, 1], 1); // FRONT
  quad(2, 3, 7, 6, [0, 0, -1], [0, 1, 1, 1], 2); // BACK

  quad(4, 5, 6, 7, [0, +1, 0], [1, 0, 1, 1], 3); // TOP
  quad(1, 0, 3, 2, [0, -1, 0], [0, 1, 0, 1], 4); // BOTTOM

  quad(3, 0, 4, 7, [-1, 0, 0], [0, 0, 1, 1], 5); // LEFT
  quad(1, 2, 6, 5, [+1, 0, 0], [1, 1, 0, 1], 6); // RIGHT

  let mesh = new Mesh(vertices, faces, { name: 'cube' });
  return mesh;
}


/**
 * Make a icosphere shape.
 * @param {number} size The radius of the sphere.
 * @param {number} level The subdivision level to use.
 * @param {boolean} flat Whether to use flat shading. Default smooth (false).
 * @return {object} A vertex attribute array.
 */ 
export function icosphere (size = 1, level = 1, flat = false) {
  
  const radius = size / 2;

  // Start with an icosahedron, using this aspect ratio to generate points.
  // The positions of the the twelve icosahedron vertices.
  const t = (1 + Math.sqrt(5)) / 2;

  let positions = [
    /**00*/ new Vec3(-t,  0, -1).normalize(radius),
    /**01*/ new Vec3(+t,  0, -1).normalize(radius),
    /**02*/ new Vec3(+t,  0, +1).normalize(radius),
    /**03*/ new Vec3(-t,  0, +1).normalize(radius),
    /**04*/ new Vec3(-1, -t,  0).normalize(radius),
    /**05*/ new Vec3(+1, -t,  0).normalize(radius),
    /**06*/ new Vec3(+1, +t,  0).normalize(radius),
    /**07*/ new Vec3(-1, +t,  0).normalize(radius),
    /**08*/ new Vec3( 0, -1, -t).normalize(radius),
    /**09*/ new Vec3( 0, -1, +t).normalize(radius),
    /**10*/ new Vec3( 0, +1, +t).normalize(radius),
    /**11*/ new Vec3( 0, +1, -t).normalize(radius),
  ];

  let faces = [
    [0, 3, 7],
    [0, 7, 11],
    [0, 11, 8],
    [0, 8, 4], //*
    [0, 4, 3],

    [2, 1, 6],
    [2, 6, 10],
    [2, 10, 9],
    [2, 9, 5],
    [2, 5, 1],

    [3, 9, 10],
    [3, 10, 7],
    [3, 4, 9],

    [1, 8, 11],
    [1, 11, 6],
    [1, 5, 8],
    
    [8, 5, 4],
    [9, 4, 5],
    [10, 6, 7],
    [11, 7, 6],
  ];


  /**
   * Add a new position. Normalize its position so it sits on the surface of 
   * the sphere.
   * @param {*} pos 
   */
  const addPosition = (pos) => {
    positions.push(pos.normalize(radius));
  }

  const foundMidPoints = {};

  /**
   * 
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  const getMidPoint = (a, b) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;

    if (foundMidPoints[key]) {
      return foundMidPoints[key];
    }
    
    const posA = positions[a].copy();
    const posB = positions[b].copy();
    const midPoint = posA.copy().add(posB).div(2);
    
    addPosition(midPoint);
    
    const index = positions.length - 1;
    foundMidPoints[key] = index;
    return index;
  }


  let faceBuffer = [];
  let vertices = [];
  
  for (let i = 0; i < level; i++) {
    faceBuffer = [];

    for (const face of faces) {
      const a = getMidPoint(face[0], face[1]);
      const b = getMidPoint(face[1], face[2]);
      const c = getMidPoint(face[2], face[0]);

      faceBuffer.push([face[0], a, c]);
      faceBuffer.push([face[1], b, a]);
      faceBuffer.push([face[2], c, b]);
      faceBuffer.push([a, b, c]);
    }
    faces = faceBuffer;
  }
  
  // For flat shading we need to split each vertex into 3 new ones and 
  // re-index the faces.
  if (flat) {
    faceBuffer = [];

    for (const face of faces) {
      const a = positions[face[0]];
      const b = positions[face[1]];
      const c = positions[face[2]];

      const ba = b.copy().sub(a);
      const ca = c.copy().sub(a);

      const normal = ba.cross(ca).normalize();

      const pointer = vertices.length;

      vertices.push(
        { position: a.xyz, normal: normal.xyz },
        { position: b.xyz, normal: normal.xyz },
        { position: c.xyz, normal: normal.xyz }
      );

      faceBuffer.push([pointer, pointer + 1, pointer + 2]);
    }

    faces = faceBuffer;

  } else {
    
    vertices = positions.map(pos => {
      return { position: pos.xyz, normal: pos.normalize().xyz };
    });
  }

  return new Mesh(vertices, faces, { name: 'icosphere' });
}


/**
 * Make a quad. Faces UP along y axis.
 * @param {number} size The size of the quad.
 * @return {object} A vertex attribute array.
 */ 
export function quad (size) {
  const s = size / 2;
  const positions = [
    new Vec3(-s, 0, -s),
    new Vec3(+s, 0, -s),
    new Vec3(+s, 0, +s),
    new Vec3(-s, 0, +s),
  ];
  
  const faces = [[0, 2, 1,], [0, 3, 2]];
  const vertices = positions.map(pos => {
    return { position: pos.xyz, normal: [0, 1, 0] };
  });

  return new Mesh(vertices, faces, { name: 'quad' });
}




/**
 * Make a full screen quad for rendering post effects..
 * @return {object} A vertex attribute array.
 */
export function _fsQuad() {

  const vertices = [
    [-1, -1, 0],
    [+1, -1, 0],
    [-1, +1, 0],

    [-1, +1, 0],
    [+1, -1, 0],
    [+1, +1, 0],
  ];

  return {
    mode: 'TRIANGLES',
    vertexCount: 6,
    attribs: {
      aPosition: new Float32Array(vertices.flat()),
    }
  }
}


/**
 * Make a quad. Faces UP along y axis.
 * @param {number} size The size of the quad.
 * @return {object} A vertex attribute array.
 */ 
export function _axes () {
  const positions = [
    [0, 0, 0], [1, 0, 0],
    [0, 0, 0], [0, 1, 0],
    [0, 0, 0], [0, 0, 1],
    [0, 0, 0], [-1, 0, 0],
    [0, 0, 0], [0, -1, 0],
    [0, 0, 0], [0, 0, -1],
  ];

  const colors = [
    [1, 0, 0, 1], [1, 0, 0, 1],
    [0, 1, 0, 1], [0, 1, 0, 1],
    [0, 0, 1, 1], [0, 0, 1, 1],
    [0, 1, 1, 1], [0, 1, 1, 1],
    [1, 0, 1, 1], [1, 0, 1, 1],
    [1, 1, 0, 1], [1, 1, 0, 1],
  ];

  const normals = [
    [1, 0, 0], [1, 0, 0],
    [0, 1, 0], [0, 1, 0],
    [0, 0, 1], [0, 0, 1],
    [-1, 0, 0], [-1, 0, 0],
    [0, -1, 0], [0, -1, 0],
    [0, 0, -1], [0, 0, -1],
  ];

  const vertices = positions.map((pos, i) => {
    return { position: pos, color: colors[i] };
  });

  return {
    mode: 'LINES',
    vertexCount: 12,
    attribs: {
      position: new Float32Array(positions.flat(2)),
      color: new Float32Array(colors.flat(2)),
      normal: new Float32Array(normals.flat(2)),
    }
  }
}
