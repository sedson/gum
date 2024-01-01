import {Gum} from '/js/GUM.js'

window.g = new Gum('#canvas', 1000, 1000, { scale: 1 });

let sphere, cube;

let instanceMesh = g.shapes.icosphere(0.01, 2).fill(g.color('#00f'));

let instancer;


g.defaultPass = 'geo';

/**
 * Runs once at the beginning of the g's life cycle.
 */
function setup () {

  const ico = g.shapes.icosphere(0.6, 2);
  const pts = ico.vertices.length;

  g.addProgram('unlit');

  instancer = new g.Instancer(instanceMesh, pts, g.renderer, 'unlit');
  window.instancer = instancer;

  for (let i = 0; i < pts; i++) {
    instancer.setAttr(i, 'x', ico.vertices[i].position[0]);
    instancer.setAttr(i, 'y', ico.vertices[i].position[1]);
    instancer.setAttr(i, 'z', ico.vertices[i].position[2]);
    instancer.setAttr(i, 'r', Math.random());
    instancer.setAttr(i, 'g', Math.random());
    instancer.setAttr(i, 'b', Math.random());



  }

  // instancer.fillRandom();

  g.node('PARTICLES').setGeometry(instancer);



  // console.log(instancer)

  g.orbit();

  // g.addEffect('post-dither', {
  //   uColorA: g.color('sand').rgba,
  //   uColorB: g.color('burgundy').rgba,
  // });
  
  // g.node('ground')
  //   .setGeometry(g.mesh(g.shapes.grid(2).fill(g.color())))

  sphere = g.node('sphere')
    .setGeometry(g.mesh(g.shapes.icosphere(0.5, 3).fill(g.color())))
    .move(0.5, 0.25, 0)


  cube = g.node('cube')
    .setGeometry(g.mesh(g.shapes.cube(0.5).fill(g.color())))
    .move(-0.5, 0.25, 0)

  const line = new g.Line([ [0,0,0] , [3, 3, 3] ], [1, 1, 1, 1]);

  console.log(line.render());

  // g.addEffect('post-outline2');
  g.addEffect('post-blur', {
    uKernal: 4,
    uDist: 1,
  });


  // g.addEffect('post-dither', {
  //   uColorA: [0, 0, 0, 1],
  //   uColorB: [1, 1, 0, 1],
  // });
  // g.addEffect('post-dither');


  g.addEffect('post-chromatic2');



  g.background(g.color('white'));
  // console.log(g.scene)
  g.drawScene();



  // g.node('line')
    // .setGeometry(g.mesh(line.render()))
}


let f = 0; 
/**
 * Runs each frame;
 */
function draw () {
  // return;
  g.renderer.clearDepth();



  g.gl.bindFramebuffer(g.gl.READ_FRAMEBUFFER, null);
  g.gl.bindFramebuffer(g.gl.DRAW_FRAMEBUFFER, g.renderer.renderTargets.default.frameBuffer);
  let w = g.canvas.width;
  let h = g.canvas.height;
  g.gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, g.gl.COLOR_BUFFER_BIT, g.gl.NEAREST);


  g.drawScene();



  // turntable.rotate(0, gum.time() * 0.001, 0);
  cube.rotate(0, g.time * 0.0003, 0);
  // sphere.rotate(0, gum.time() * 0.0003, 0);



  if (f % 40 === 0) {
    // gum.background(g.color('white'));

  }
  f++;
  // instancer.draw();
}

g.run(setup, draw);