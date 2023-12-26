

import { Gum } from '/js/GUM.js'
// const { ft, FeltApp } = FELT;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
const g = new Gum('#canvas', 1000, 1000, { scale: 0.5 });
console.log({g, Gum, 'proto': Gum.prototype, 'clamp': g.clamp })
window.g = g;

// Make a background color.
const bg = g.color('#222');

// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(0.5, 1, true).findGroups();
let cube = g.shapes.cube(1);

let spinAngle = 0;

let A, B;

let tex = new g.Texer(64);


g.defaultPass = 'textured';
g.pixelRatio = 2;


/**
 * Runs once at the beginning of the app's life cycle.
 */
function setup () {

  A = g.node('A');
  B = g.node('B');

  A.geometry = g.mesh(cube.render());
  B.geometry = A.geometry;

  B.move(0, 1, 0).scale(0.5).setParent(A);

  A.uniform('uTex', tex.id);
  B.uniform('uTex', tex.id);

  g.plyLoader.load('/models/uvsphere.ply', mesh => {
    console.log(mesh);
    B.geometry = g.mesh(mesh);
  });

  g.addTexer(tex);
}


/**
 * Runs each frame;
 */
function draw () {
  g.clear(bg);
  g.axes();

  
  let r = g.remap(g.sin(g.time * 0.005), -1, 1, 0, 100);

  tex.fill('#333').clear();
  tex.fill(g.color('melon').rgbString()).pixels(0, 0, r, r);
  
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  g.camera.transform.position.set(x, 2, z)


  spinAngle += 1;
  A.rotate(0, 0, z / 3)

  g.drawScene();
}

g.run(setup, draw);