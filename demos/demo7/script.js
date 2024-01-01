import {Gum} from '/js/GUM.js'

window.g = new Gum('#canvas', 1000, 1000);

let turntable, cube, sphere;


g.defaultPass = 'lit';

/**
 * Runs once at the beginning of the g's life cycle.
 */
function setup () {

  turntable = g.node('turntable');

  g.orbit();

  g.addProgram('line')

  g.addEffect('post-dither', {
    uColorA: g.color('sand').rgba,
    uColorB: g.color('burgundy').rgba,
  });
  
  g.node('ground')
    .setGeometry(g.mesh(g.shapes.grid(2).fill(g.color('white'))))
    .setParent(turntable);

  sphere = g.node('sphere')
    .setGeometry(g.mesh(g.shapes.icosphere(0.5, 3).fill(g.color('white'))))
    .move(0.5, 0.25, 0)
    .setParent(turntable);


  cube = g.node('cube')
    .setGeometry(g.mesh(g.shapes.cube(0.5).findGroups().fill(g.color('white'))))
    .move(-0.5, 0.25, 0)
    .setParent(turntable);

  const line = new g.Line([ [0,0,0] , [3, 3, 3] ], [1, 1, 1, 1]);

  console.log(line.render());

  g.node('line')
    .setGeometry(g.mesh(line.render()))
}


/**
 * Runs each frame;
 */
function draw () {
  g.clear(g.color('#333'));

  // turntable.rotate(0, g.time() * 0.001, 0);
  cube.rotate(0, g.time * 0.0003, 0);
  sphere.rotate(0, g.time * 0.0003, 0);


  g.drawScene();
}

g.run(setup, draw);