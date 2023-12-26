import { g, Gum } from '/js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 1000, 1000, { scale: 1});

const bg = g.color('#333');
const col = g.color('rawsienna');

window.grid = g.shapes.grid(2, 5).findGroups();


let spin;

const shapes = [];
let time = 0;

gum.background(bg); 
gum.camera.fov = 30;

// gum.addEffect('post-outline'); 
gum.addEffect('post-chromatic2'); 




let sphere = g.shapes.icosphere(1, 3, true).findGroups();





const points = [];
let mesh = '';

const pts = 80;
for (let i = 0; i <= pts; i++) {
  const theta = (i / pts) * 2 * Math.PI;
  const x = Math.cos(theta) * 1;
  const y = Math.sin(theta) * 1;
  const z = Math.sin(4 * theta);
  points.push([x, y, z])
}

console.log({col})
const line = new g.Line(points, col.rgba)
console.log(line.render())

function setup () {
  spin = gum.node('camera.root');
  gum.camera.setParent(spin);

  gum.addProgram('line');

  mesh = gum.addMesh(line.render());


  let b = gum.node('b')
  b.geometry = gum.addMesh(sphere);


  const l = gum.node('line');
  l.geometry = mesh;
}

function draw (delta) {
  gum.background(g.color('#333'));
  gum.axes();
  gum.drawScene();
  time += 0.05 * delta;

  for (let i = 0; i <= pts; i++) {
    const theta = (i / pts) * 2 * Math.PI;
    const x = Math.cos(1.11 * theta) * 1;
    const y = Math.cos(2.87 * theta) * 1;
    const z = Math.sin(3 * theta  + time) * 1;
    line.points[i] = [x,y,z];
    gum.renderer.updateMesh(mesh, line.render());
  }

  spin.rotate(0, time * 0.5, 0);

}

gum.run(setup, draw);