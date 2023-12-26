import {g, Gum} from '/js/GUM.js'

window.g = g;

// Create a new felt app that renders to the '#canvas' element. The size 
// is 2000 by 2000 pixels.
window.gum = new Gum('#canvas', 1000, 1000, { scale: 1 });

let sphere, cube;

let instanceMesh = g.shapes.icosphere(0.5, 2).fill(g.color('#00f'));

let instancer;


gum.defaultPass = 'geo';

/**
 * Runs once at the beginning of the gum's life cycle.
 */
function setup () {

  const ico = g.shapes.icosphere(0.6, 2);
  const pts = ico.vertices.length;

  gum.addProgram('unlit');

  instancer = new g.Instancer(instanceMesh, pts, gum.renderer, 'unlit');
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

  gum.node('PARTICLES').setGeometry(instancer);



  // console.log(instancer)

  gum.orbit();

  // gum.addEffect('post-dither', {
  //   uColorA: g.color('sand').rgba,
  //   uColorB: g.color('burgundy').rgba,
  // });
  
  // gum.node('ground')
  //   .setGeometry(gum.addMesh(g.shapes.grid(2).fill(g.color())))

  sphere = gum.node('sphere')
    .setGeometry(gum.addMesh(g.shapes.icosphere(0.5, 3).fill(g.color())))
    .move(0.5, 0.25, 0)


  cube = gum.node('cube')
    .setGeometry(gum.addMesh(g.shapes.cube(0.5).fill(g.color())))
    .move(-0.5, 0.25, 0)

  const line = new g.Line([ [0,0,0] , [3, 3, 3] ], [1, 1, 1, 1]);

  console.log(line.render());

  // gum.addEffect('post-outline2');
  gum.addEffect('post-blur', {
    uKernal: 4,
    uDist: 1,
  });


  // gum.addEffect('post-dither', {
  //   uColorA: [0, 0, 0, 1],
  //   uColorB: [1, 1, 0, 1],
  // });
  // gum.addEffect('post-dither');


  gum.addEffect('post-chromatic2');



  gum.background(g.color('white'));
  // console.log(gum.scene)
  gum.drawScene();



  // gum.node('line')
    // .setGeometry(gum.addMesh(line.render()))
}


let f = 0; 
/**
 * Runs each frame;
 */
function draw () {
  // return;
  gum.renderer.clearDepth();



  gum.gl.bindFramebuffer(gum.gl.READ_FRAMEBUFFER, null);
  gum.gl.bindFramebuffer(gum.gl.DRAW_FRAMEBUFFER, gum.renderer.renderTargets.default.frameBuffer);
  let w = gum.canvas.width;
  let h = gum.canvas.height;
  gum.gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gum.gl.COLOR_BUFFER_BIT, gum.gl.NEAREST);


  gum.drawScene();



  // turntable.rotate(0, gum.time() * 0.001, 0);
  cube.rotate(0, gum.time() * 0.0003, 0);
  // sphere.rotate(0, gum.time() * 0.0003, 0);



  if (f % 40 === 0) {
    // gum.background(g.color('white'));

  }
  f++;
  // instancer.draw();
}

gum.run(setup, draw);