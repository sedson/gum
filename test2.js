import { g, Gum } from './js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 1000, 1000, { scale: 0.5 });

// Make some colors.
const bg    = g.color('#333');
const red   = g.color('#fff');
const blue  = g.color('#fff333');

// Make a sphere.
const sphereShape = g.shapes.icosphere(0.2, 3);

let spin;

const shapes = [];
let time = 0;

gum.background(bg); 
gum.camera.fov = 10;


spin = gum.node('camera.root');
gum.camera.setParent(spin);

for (let i = 0; i < 50; i++) {
  let n = gum.node('n' + i);

  let fac = i / 49;
  let col = red.blend(blue, fac, 'hsl');

  n.geometry = gum.addMesh(sphereShape.fill(col));
  n.move((i - 25) * 0.01, 0, 0);
  shapes.push(n);
}

gum.addEffect();


function setup () {}

function draw (delta) {
  gum.background(bg);
  gum.drawScene();
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    s.move(s.x, g.sin(time + (i * 0.1)) * 0.3, 0)
  }
  time += 0.05 * delta;

  spin.rotate(0, time * 0.1, 0);

}

gum.run(setup, draw);



