

import {g, Gum} from '/js/GUM.js'
// const { ft, FeltApp } = FELT;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
window.app = new Gum('#canvas', 1000, 1000, { scale: 0.5 });

// Make a background color.
const bg = g.color('#222');

const blue = g.color('salviablue');

// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(0.5, 1, true).findGroups();
let cube = g.shapes.cube(1).findGroups();

let spinAngle = 0;

let A, B;

let tex = new g.Texer(64);

// let blueTex = new g.Texer(32);
// blueTex.fill(g.color('green').rgbString());
// blueTex.clear();


app.defaultPass = 'textured';


/**
 * Runs once at the beginning of the app's life cycle.
 */
function setup () {
  // Draw axes in the app.
  app.axes();

  A = app.node('A');
  B = app.node('B');

  A.geometry = app.addMesh(cube);
  B.geometry = app.addMesh(sphere);

  B.move(0, 1, 0).scale(0.5).setParent(A);

  A.texture = tex.id;
  B.texture = tex.id;

  app.plyLoader.load('/models/uvsphere.ply', mesh => {
    B.geometry = app.addMesh(mesh.render());
  });

  app.addTexer(tex);
  // app.addTexer(blueTex);
  
  // app.addEffect();
}


/**
 * Runs each frame;
 */
function draw () {
  app.background(bg);

  
  let r = g.remap(g.sin(app.time() * 0.005), -1, 1, 0, 100);

  tex.fill('#333').clear();
  tex.fill(g.color('yellowocher').rgbString()).pixels(0, 0, r, r);
  
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  app.camera.transform.position.set(x, 2, z)


  spinAngle += 1;
  A.rotate(0, 0, z / 3)

  app.drawScene();
}

app.run(setup, draw);