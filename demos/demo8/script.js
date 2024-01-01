
import {Gum} from '/js/GUM.js'



window.g = new Gum('#canvas', 1000, 1000, { scale: 1 });

// Make a background color.
const bg = g.color('#333');

// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(0.5, 1, true).findGroups();
let cube = g.shapes.icosphere(1, 2, false);

let spinAngle = 0;

let A, B;

let tex = new g.Texer(64);

// let blueTex = new g.Texer(32);
// blueTex.fill(g.color('green').rgbString());
// blueTex.clear();


g.defaultPass = 'geo';


// g.addEffect('post-dither', {
//   uColorA: [1, 1, 1, 1],
//   uColorB: g.color('red').rgba,
// });
g.addEffect('post-outline');

g.addEffect('post-dither', {
  uColorA: g.color('lime').rgba,
  uColorB: g.color('vert').rgba,
});



/**
 * Runs once at the beginning of the g's life cycle.
 */
function setup () {

  g.addProgram('line2');

  A = g.node('A');
  B = g.node('B');

  g.orbit();
  let C = g.node('C');

  cube.applyTransform(C.transform);

  // cube.shadeSmooth(0.);
  A.geometry = g.mesh(cube.fill(g.color('rose')).render());
  const edges = new g.EdgeCollection(cube.inflate(0.1).getEdges(), g.color('black').rgba);
  edges.thickness = 0.05;

  B.geometry = g.mesh(edges);

  // B.move(0, 1, 0).scale(0.5).setParent(A);



  A.uniform('uTex', tex.id);
  B.uniform('uTex', tex.id);

  g.plyLoader.load('/models/uvsphere.ply', mesh => {
    // console.log(mesh);
    C.geometry = g.mesh(mesh.fill(g.color('vert')));
    C.move(0, 1, 0).scale(0.2)
  }); 





  let img = g.dom.tag('img.texture');
  img.onload = () => {
    console.log(img);
    let unit = g.texture('grid', img, {
      width: img.naturalWidth, 
      height: img.naturalHeight,
      filter: 'LINEAR',
      clamp: true,
    });
    A.uniform('uTex', 'grid');

  }


  img.src = '/img/uv.jpg';

  g.addTexer(tex);
}


/**
 * Runs each frame;
 */
function draw () {
  g.clear(bg);
  g.axes();

  
  let r = g.remap(g.sin(g.time * 0.005), -1, 1, 0, 100);

  tex.fill('white').clear();
  // tex.fill(g.color('gray').rgbString()).pixels(0, 0, r, r);
  
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  g.camera.transform.position.set(x, 2, z)


  spinAngle += 1;

  g.drawScene();
}

g.run(setup, draw);