import {g, Gum} from '/js/GUM.js'

window.g = g;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
window.gum = new Gum('#canvas', 1000, 1000, { scale: 0.5 });


// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(1.4, 1, false).findGroups();
let cube = g.shapes.cube(1.4, 1, true).findGroups();

let a, b;

let spinAngle = 0;

/**
 * Runs once at the beginning of the gum's life cycle.
 */
function setup () {
  const edges = new g.EdgeCollection(sphere.getEdges(), g.color('peachred').rgba);
  const edges1 = new g.EdgeCollection(cube.getEdges(), g.color('white').rgba);

  gum.addProgram('line2');
  gum.addProgram('line');

  // gum.addEffect('post-outline2');
  gum.addEffect('post-blur', {
    kernel: 3,
    weight: 0.3,
    dist: 3,
  });
  gum.addEffect('post-chromatic');



  a = gum.node('a').setGeometry(gum.addMesh(edges.render()));
  // a = gum.node('a').setGeometry(gum.addMesh(sphere.renderEdges()));


  b = gum.node('b').setGeometry(gum.addMesh(edges1));

  gum.node('c').setGeometry(gum.addMesh(
    sphere.inflate(-0.01).fill(g.color('yellowocher'))
  )).setParent(a);
}


/**
 * Runs each frame;
 */
function draw () {
  gum.background(g.color('black'));



  
  let r = g.remap(g.sin(gum.time() * 0.005), -1, 1, 0, 100);
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  gum.camera.transform.position.set(x, 2, z)

  a.rotate(x * 0.35, z * 0.29, 0);


  spinAngle += 1;



  gum.drawScene();
}

gum.run(setup, draw);