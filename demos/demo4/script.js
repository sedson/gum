import { Gum } from '/js/GUM.js';

window.g = new Gum('#canvas', 1000, 1000, { scale: 1});

const bg = g.color('#333');
const col = g.color('rawsienna');

window.grid = g.shapes.grid(2, 5).findGroups();


let spin;

const shapes = [];
let time = 0;

g.background(bg); 
g.camera.fov = 30;
g.pixelRatio = 0.25;
g.canvas.style.imageRendering = 'pixelated'


// g.addEffect('post-outline'); 
// g.addEffect('post-chromatic2'); 




let sphere = g.shapes.icosphere(1, 3, true).findGroups();





const points = [];
let mesh = '';

const pts = 40;
for (let i = 0; i <= pts; i++) {
  const theta = (i / pts) * 2 * Math.PI;
  const x = Math.cos(theta) * 1;
  const y = Math.sin(theta) * 1;
  const z = Math.sin(4 * theta);
  points.push([x, y, z])
}

console.log({col})
const line = new g.Line(points, col.rgba)
line.thickness = 0.3
console.log(line.render())

function setup () {
  spin = g.node('camera.root');
  g.camera.setParent(spin);

  g.addProgram('line');

  mesh = g.mesh(line.render());


  let b = g.node('b')
  b.geometry = g.mesh(sphere);


  const l = g.node('line');
  l.geometry = mesh;
}

function draw (delta) {
  g.clear(g.color('#333'));
  g.axes();
  g.drawScene();
  time += 0.05 * delta;

  for (let i = 0; i <= pts; i++) {
    const theta = (i / pts) * 2 * Math.PI;
    const x = Math.cos(1.11 * theta) * 1;
    const y = Math.cos(2.87 * theta) * 1;
    const z = Math.sin(3 * theta  + time) * 1;
    line.points[i] = [x,y,z];
    g.renderer.updateMesh(mesh, line.render());
  }

  spin.rotate(0, time * 0.5, 0);

}

g.run(setup, draw);