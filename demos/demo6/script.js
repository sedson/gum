import { Gum } from '/js/GUM.js'

window.g = new Gum('#canvas', 1000, 1000, { scale: 0.5 });


// Make an icosphere. Radius = 1, subdivisions = 2, and flat shading is true.
let sphere = g.shapes.icosphere(1.4, 1, false).findGroups();
let cube = g.shapes.cube(1.4, 1, true).findGroups();

let a, b;

let spinAngle = 0;

/**
 * Runs once at the beginning of the gum's life cycle.
 */
function setup () {
  const edges = new g.EdgeCollection(sphere.getEdges(), g.color('orange').rgba);
  edges.thickness = 20;
  const edges1 = new g.EdgeCollection(cube.getEdges(), g.color('ginger').rgba);
  edges1.thickness = 20;


  g.addProgram('line2');
  g.addProgram('line');

  g.addEffect('post-outline2');

  a = g.node('a').setGeometry(g.mesh(edges.render()));
  // a = g.node('a').setGeometry(g.mesh(sphere.renderEdges()));


  b = g.node('b').setGeometry(g.mesh(edges1));

  g.orbit();
  g.node('c').setGeometry(g.mesh(
    sphere.inflate(-0.01).fill(g.color('lilac'))
  )).setParent(a);
}


/**
 * Runs each frame;
 */
function draw () {
  g.clear(g.color('#333'));



  
  let r = g.remap(g.sin(g.time * 0.005), -1, 1, 0, 100);
  let s = g.radians(spinAngle);
  let x = Math.cos(s) * 5;
  let z = Math.sin(s) * 5;
  // g.camera.transform.position.set(x, 2, z)

  a.rotate(x * 0.35, z * 0.29, 0);


  spinAngle += 1;



  g.drawScene();
}

g.run(setup, draw);