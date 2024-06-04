/**
 * @file Provide geometric primitives.
 */

import { Vec3 } from "./vectors.js";
import { Mesh } from "./mesh.js";

/**
 * @module shapes
 */

/**
 * Make a cube. Centered on the origin with w, h, d of size.
 * @param {number} size The size of the cube.
 * @return {Mesh}
 */
export function cube(size = 1) {
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
    vertices.push({ position: [...positions[a]], normal, color, texCoord: [0, 0] }, { position: [...positions[b]], normal, color, texCoord: [1, 0] }, { position: [...positions[c]], normal, color, texCoord: [1, 1] }, { position: [...positions[d]], normal, color, texCoord: [0, 1] }, );

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
 * Make an icosphere shape with diameter size.
 * @param {number} size The diameter of the sphere.
 * @param {number} level The subdivision level to use. 0 is low poly. 5 is very very high poly.
 * @param {boolean} flat Whether to use flat shading. Default smooth (false).
 * @return {Mesh}
 */
export function icosphere(size = 1, level = 1, flat = false) {

  const radius = size / 2;

  // Start with an icosahedron, using this aspect ratio to generate points.
  // The positions of the the twelve icosahedron vertices.
  const t = (1 + Math.sqrt(5)) / 2;

  let positions = [
    /**00*/
    new Vec3(-t, 0, -1).normalize(radius),
    /**01*/
    new Vec3(+t, 0, -1).normalize(radius),
    /**02*/
    new Vec3(+t, 0, +1).normalize(radius),
    /**03*/
    new Vec3(-t, 0, +1).normalize(radius),
    /**04*/
    new Vec3(-1, -t, 0).normalize(radius),
    /**05*/
    new Vec3(+1, -t, 0).normalize(radius),
    /**06*/
    new Vec3(+1, +t, 0).normalize(radius),
    /**07*/
    new Vec3(-1, +t, 0).normalize(radius),
    /**08*/
    new Vec3(0, -1, -t).normalize(radius),
    /**09*/
    new Vec3(0, -1, +t).normalize(radius),
    /**10*/
    new Vec3(0, +1, +t).normalize(radius),
    /**11*/
    new Vec3(0, +1, -t).normalize(radius),
  ];

  let faces = [
    [0, 3, 7],
    [0, 7, 11],
    [0, 11, 8],
    [0, 8, 4],
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
   * @private
   */
  const addPosition = (pos) => {
    positions.push(pos.normalize(radius));
  }

  const foundMidPoints = {};

  /**
   * @param {*} a 
   * @param {*} b 
   * @private
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

      vertices.push({ position: a.xyz, normal: normal.xyz }, { position: b.xyz, normal: normal.xyz }, { position: c.xyz, normal: normal.xyz });

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
 * Make a UV Sphere - like a mercator globe.
 * @param {number} size The diameter of the sphere.
 * @param {number} level The segments level. 1 is very low poly. 40 is pretty high poly.
 * @param {boolean} flat Whether to use flat shading. Default smooth (false).
 * @returns {Mesh}
 */
export function uvsphere(size = 1, level = 1, flat = false) {
  const radius = size / 2;

  const segments = level + 2;

  const getSphericalPos = (uFac, vFac) => {
    const r = Math.sin(Math.PI * vFac);
    const x = Math.cos(2 * Math.PI * uFac) * r * radius;
    const y = -Math.cos(Math.PI * vFac) * radius;
    const z = Math.sin(2 * Math.PI * uFac) * r * radius;
    return [x, y, z];
  };


  let step = size / segments;

  const positions = [];
  const texCoords = [];
  const normals = [];
  const faces = [];

  let vertIndex = 0;
  console.log(segments);

  for (let v = 0; v < segments; v++) {

    for (let u = 0; u < segments; u++) {

      const uf0 = u / segments;
      const uf1 = (u + 1) / segments;

      const vf0 = v / segments;
      const vf1 = (v + 1) / segments;

      // South pole case.
      if (v === 0) {


        positions.push(
          getSphericalPos(uf0, vf0),
          getSphericalPos(uf1, vf1),
          getSphericalPos(uf0, vf1)
        );

        texCoords.push(
          [uf0 + (0.5 * step), vf0],
          [uf1, vf1],
          [uf0, vf1]
        );

        faces.push([vertIndex, vertIndex + 2, vertIndex + 1]);

        vertIndex += 3;
        continue;


      }

      // North pole case. 
      if (v === segments - 1) {
        positions.push(
          getSphericalPos(uf0, vf0),
          getSphericalPos(uf1, vf0),
          getSphericalPos(uf1, vf1),
        );

        texCoords.push(
          [uf0, vf0],
          [uf1, vf0],
          [uf1 - (0.5 / segments), vf1],
        );

        faces.push([vertIndex, vertIndex + 2, vertIndex + 1]);
        vertIndex += 3;
        continue;
      }



      positions.push(
        getSphericalPos(uf0, vf0),
        getSphericalPos(uf1, vf0),
        getSphericalPos(uf1, vf1),
        getSphericalPos(uf0, vf1)
      );


      texCoords.push(
        [uf0, vf0],
        [uf1, vf0],
        [uf1, vf1],
        [uf0, vf1]
      );

      // texCoords.push(
      //   [0, 1],
      //   [1, 1],
      //   [1, 0],
      //   [0, 0]
      // );


      faces.push([vertIndex, vertIndex + 3, vertIndex + 2, vertIndex + 1]);
      vertIndex += 4;

    }
  }

  console.log(positions, faces)

  const vertices = positions.map((pos, i) => {
    return { position: pos, normal: pos, texCoord: texCoords[i] };
  });

  return new Mesh(vertices, faces, { name: 'uvsphere' });

}

/**
 * Make a quad facing up along y axis.
 * @param {number} size The w and d of the quad.
 * @return {Mesh}
 */
export function quad(size) {
  const s = size / 2;
  const positions = [
    new Vec3(-s, 0, -s),
    new Vec3(+s, 0, -s),
    new Vec3(+s, 0, +s),
    new Vec3(-s, 0, +s),
  ];

  const faces = [
    [0, 3, 2, 1]
  ];
  const vertices = positions.map(pos => {
    return { position: pos.xyz, normal: [0, 1, 0] };
  });

  return new Mesh(vertices, faces, { name: 'quad' });
}


/**
 * Make a grid facing up along y axis.
 * @param {number} size The size (w, h) of the grid.
 * @param {number} subdivisions The number of subdivisions. Default 10.
 * @return {Mesh}
 */
export function grid(size, subdivisions = 10, flat = false) {
  const s = size / 2;
  const step = size / (subdivisions + 1);

  const positions = [];
  const faces = [];

  if (flat) {

    // Flat normals case. Copy shared verts.
    let vertIndex = 0;
    for (let i = 0; i < subdivisions + 1; i++) {
      const z = i * step;
      for (let j = 0; j < subdivisions + 1; j++) {
        const x = j * step;
        positions.push([-s + x, 0, -s + z]);
        positions.push([-s + x + step, 0, -s + z]);
        positions.push([-s + x + step, 0, -s + z + step]);
        positions.push([-s + x, 0, -s + z + step]);

        faces.push([vertIndex, vertIndex + 3, vertIndex + 2, vertIndex + 1]);
        vertIndex += 4;
      }
    }

  } else {

    // Smooth normals case. Reuse shared verts.
    for (let i = 0; i < subdivisions + 2; i++) {
      const z = i * step;
      for (let j = 0; j < subdivisions + 2; j++) {
        const x = j * step;
        positions.push([-s + x, 0, -s + z]);

        if (i < subdivisions + 1 && j < subdivisions + 1) {
          const a = i * (subdivisions + 2) + j;
          const b = a + 1;
          const c = a + subdivisions + 2;
          const d = c + 1;
          faces.push([a, c, d, b]);
        }
      }
    }
  }

  const vertices = positions.map(pos => {
    return { position: pos, normal: [0, 1, 0] };
  });

  return new Mesh(vertices, faces, { name: 'grid' });
}


/**
 * Make a circle with diameter size facing up along y axis.
 * @param {number} size The size of the circle.
 * @param {number} resolution The number of straight line segments to use. Default 12.
 * @param {string} fill The fill type to use. 'ngon' is default and does not require an
 *     extra vertex at the center. 'fan' places an extra vert at the center and connects 
 *     all the verts to that like spokes.
 * @return {Mesh}
 */
export function circle(size, resolution = 12, fill = 'ngon') {
  const positions = [];
  const faces = [];
  const radius = size / 2;

  if (fill === 'fan') {
    positions.push([0, 0, 0]);
  } else if (fill === 'ngon') {
    faces[0] = [];
  }

  for (let i = 0; i < resolution; i++) {
    const theta = -i * Math.PI * 2 / resolution;
    const x = Math.cos(theta) * (size / 2);
    const z = Math.sin(theta) * (size / 2);

    positions.push([x, 0, z]);

    if (fill === 'fan') {
      const next = (i + 1) % (resolution);
      faces.push([0, i + 1, next + 1]);
    } else if (fill === 'ngon') {
      faces[0].push(i);
    }
  }

  const vertices = positions.map(pos => {
    return { position: pos, normal: [0, 1, 0] };
  });
  return new Mesh(vertices, faces, { name: 'circle' });
}


/**
 * Make a full screen quad for rendering post effects.
 * @private
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
 * Make an axes gizmo.
 * @private
 */
export function _axes() {
  const positions = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
    [-1, 0, 0],
    [0, 0, 0],
    [0, -1, 0],
    [0, 0, 0],
    [0, 0, -1],
  ];

  const colors = [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 1, 1, 1],
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 1, 0, 1],
  ];

  const normals = [
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
    [-1, 0, 0],
    [-1, 0, 0],
    [0, -1, 0],
    [0, -1, 0],
    [0, 0, -1],
    [0, 0, -1],
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



/**
 * Make a circle with diameter size facing up along y axis.
 * @param {number} size The size of the circle.
 * @param {number} resolution The number of straight line segments to use.
 * @param {string} fill The fill type to use. 'ngon' is default and does not require an
 *     extra vertex at the center. 'fan' places an extra vert at the center and connects 
 *     all the verts to that like spokes.
 * @return {Mesh}
 */
export function cylinder(size, resolution = 12, fill = 'ngon', flat = false) {
  const positions = [];
  let faces = [];
  const normals = [];
  let ngon = [];
  const radius = size / 2;

  // Make the top and bottom face.
  for (let k = 0; k < 2; k++) {

    let y = k * 2 - 1;
    let offset = fill === 'fan' ? (resolution + 1) * k : resolution * k;

    if (fill === 'fan') {
      positions.push([0, y * radius, 0]);
      normals.push([0, y, 0]);
    }

    for (let i = 0; i < resolution; i++) {
      const theta = -i * Math.PI * 2 / resolution;
      const x = Math.cos(theta) * (size / 2);
      const z = Math.sin(theta) * (size / 2);

      positions.push([x, y * radius, z]);
      normals.push([0, y, 0]);

      if (fill === 'fan') {
        const next = ((i + 1) % (resolution));
        if (k === 0) {
          faces.push([offset, offset + next + 1, offset + i + 1]);
        } else {
          faces.push([offset, offset + i + 1, offset + next + 1]);
        }
      } else if (fill === 'ngon') {
        if (k === 0) {
          ngon.push((resolution - (i + 1)) + offset);
        } else {
          ngon.push(i + offset);
        }
      }
    }

    if (fill === 'ngon') {
      faces.push(ngon);
      ngon = [];
    }
  }

  let offset = positions.length;

  // Make the outer wall. 
  // TODO : This is smooth shading but with split verts. Make the smooth shading 
  //     work with shared verts and a flat shading vertsion work with split 
  //     verts.
  for (let i = 0; i < resolution; i++) {
    const theta = -i * Math.PI * 2 / resolution;
    const x = Math.cos(theta) * (size / 2);
    const z = Math.sin(theta) * (size / 2);

    const theta2 = -(i + 1) * Math.PI * 2 / resolution;
    const x2 = Math.cos(theta2) * (size / 2);
    const z2 = Math.sin(theta2) * (size / 2);

    positions.push(
      [x, -radius, z],
      [x, radius, z],
      [x2, -radius, z2],
      [x2, radius, z2],
    );

    normals.push(
      new Vec3(x, 0, z).normalize().xyz,
      new Vec3(x, 0, z).normalize().xyz,
      new Vec3(x2, 0, z2).normalize().xyz,
      new Vec3(x2, 0, z2).normalize().xyz,
    );

    faces.push([
      offset + 1,
      offset + 0,
      offset + 2,
      offset + 3,
    ]);

    offset += 4;
  }



  const vertices = positions.map((pos, i) => {
    return { position: pos, normal: normals[i] };
  });


  return new Mesh(vertices, faces, { name: 'cylinder' });
}



/**
 * Make a cone with diameter size facing up along y axis.
 * https://stackoverflow.com/questions/19245363/opengl-glut-surface-normals-of-cone
 * TODO : proper normals for the cone.
 * @param {number} size The size of the circle.
 * @param {number} resolution The number of straight line segments to use.
 * @param {string} fill The fill type to use. 'ngon' is default and does not require an
 *     extra vertex at the center. 'fan' places an extra vert at the center and connects 
 *     all the verts to that like spokes.
 * @return {Mesh}
 */
export function cone(size, resolution = 12, fill = 'ngon', flat = false) {
  const positions = [];
  let faces = [];
  const normals = [];
  let ngon = [];
  const radius = size / 2;

  // Make the bottom face.

  let y = -1;

  if (fill === 'fan') {
    positions.push([0, y * radius, 0]);
    normals.push([0, y, 0]);
  }

  for (let i = 0; i < resolution; i++) {
    const theta = -i * Math.PI * 2 / resolution;
    const x = Math.cos(theta) * (size / 2);
    const z = Math.sin(theta) * (size / 2);

    positions.push([x, y * radius, z]);
    normals.push([0, y, 0]);

    if (fill === 'fan') {

      const next = ((i + 1) % (resolution));
      faces.push([0, next + 1, i + 1]);

    } else if (fill === 'ngon') {

      ngon.push((resolution - (i + 1)));

    }
  }

  if (fill === 'ngon') {
    faces.push(ngon);
    ngon = [];
  }

  let offset = positions.length;

  // Make the outer wall. 
  // TODO : This is smooth shading but with split verts. Make the smooth shading 
  //     work with shared verts and a flat shading vertsion work with split 
  //     verts.
  for (let i = 0; i < resolution; i++) {
    const theta = -i * Math.PI * 2 / resolution;
    const x = Math.cos(theta) * (size / 2);
    const z = Math.sin(theta) * (size / 2);

    const theta2 = -(i + 1) * Math.PI * 2 / resolution;
    const x2 = Math.cos(theta2) * (size / 2);
    const z2 = Math.sin(theta2) * (size / 2);

    positions.push(
      [x, -radius, z],
      [0, radius, 0],
      [x2, -radius, z2],
    );

    normals.push(
      new Vec3(x, 0, z).normalize().xyz,
      new Vec3(0, 1, 0).normalize().xyz,
      new Vec3(x, 0, z).normalize().xyz,
    );

    faces.push([
      offset + 1,
      offset + 0,
      offset + 2,
    ]);

    offset += 3;
  }



  const vertices = positions.map((pos, i) => {
    return { position: pos, normal: normals[i] };
  });


  return new Mesh(vertices, faces, { name: 'cylinder' });
}