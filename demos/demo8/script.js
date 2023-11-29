

import {g, Gum} from '/js/GUM.js'
// const { ft, FeltApp } = FELT;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
window.app = new Gum('#canvas', 1000, 1000, { scale: 0.5 });
window.g = g;

// Make a background color.
const bg = g.color('#333');

// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(0.5, 1, true).findGroups();
let cube = g.shapes.icosphere(1, 2, true);

let spinAngle = 0;

let A, B;

let tex = new g.Texer(64);

// let blueTex = new g.Texer(32);
// blueTex.fill(g.color('green').rgbString());
// blueTex.clear();


app.defaultPass = 'unlit';


// app.addEffect('post-dither', {
//   uColorA: [1, 1, 1, 1],
//   uColorB: g.color('red').rgba,
// });



/**
 * Runs once at the beginning of the app's life cycle.
 */
function setup () {

  app.addProgram('line2');

  A = app.node('A');
  B = app.node('B');

  app.orbit();

  cube.shadeSmooth(0.2);
  A.geometry = app.addMesh(cube.fill(g.color('rose')).render());
  const edges = new g.EdgeCollection(cube.inflate(0.01).getEdges(), g.color('red').rgba);

  B.geometry = app.addMesh(edges);

  // B.move(0, 1, 0).scale(0.5).setParent(A);




  A.uniform('uTex', tex.id);
  B.uniform('uTex', tex.id);

  app.plyLoader.load('/models/uvsphere.ply', mesh => {
    // console.log(mesh);
    // B.geometry = app.addMesh(mesh);
  }); 





  let img = g.dom.tag('img.texture');
  img.onload = () => {
    console.log(img);
    let unit = app.texture('grid', img, {
      width: img.naturalWidth, 
      height: img.naturalHeight,
      filter: 'LINEAR',
      clamp: true,
    });
    A.uniform('uTex', 'grid');

  }


  img.src = '/img/uv.jpg';

  app.addTexer(tex);
}


/**
 * Runs each frame;
 */
function draw () {
  app.background(bg);
  app.axes();

  
  let r = g.remap(g.sin(app.time() * 0.005), -1, 1, 0, 100);

  tex.fill('white').clear();
  // tex.fill(g.color('gray').rgbString()).pixels(0, 0, r, r);
  
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  // app.camera.transform.position.set(x, 2, z)


  // spinAngle += 1;

  app.drawScene();
}

app.run(setup, draw);