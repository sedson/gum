import {g, Gum} from '/js/GUM.js'

window.g = g;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
window.gum = new Gum('#canvas', 1000, 1000, { scale: 0.5 });

let turntable, cube, sphere;


gum.defaultPass = 'lit';

/**
 * Runs once at the beginning of the gum's life cycle.
 */
function setup () {

  turntable = gum.node('turntable');

  gum.orbit();

  gum.addProgram('line')

  gum.addEffect('post-dither', {
    uColorA: g.color('sand').rgba,
    uColorB: g.color('burgundy').rgba,
  });
  
  gum.node('ground')
    .setGeometry(gum.addMesh(g.shapes.grid(2).fill(g.color('white'))))
    .setParent(turntable);

  sphere = gum.node('sphere')
    .setGeometry(gum.addMesh(g.shapes.icosphere(0.5, 3).fill(g.color('white'))))
    .move(0.5, 0.25, 0)
    .setParent(turntable);


  cube = gum.node('cube')
    .setGeometry(gum.addMesh(g.shapes.cube(0.5).findGroups().fill(g.color('white'))))
    .move(-0.5, 0.25, 0)
    .setParent(turntable);

  const line = new g.Line([ [0,0,0] , [3, 3, 3] ], [1, 1, 1, 1]);

  console.log(line.render());

  gum.node('line')
    .setGeometry(gum.addMesh(line.render()))
}


/**
 * Runs each frame;
 */
function draw () {
  gum.background(g.color('#333'));

  // turntable.rotate(0, gum.time() * 0.001, 0);
  cube.rotate(0, gum.time() * 0.0003, 0);
  sphere.rotate(0, gum.time() * 0.0003, 0);


  gum.drawScene();
}

gum.run(setup, draw);