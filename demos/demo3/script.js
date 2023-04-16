import { g, Gum } from '/js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 1000, 1000, { scale: 0.5 });

const bg = g.color('#333');
const col = g.color('rawsienna');


window.cube = g.shapes.cube(0.2, 1, false).findGroups();


let spin;

const shapes = [];
let time = 0;

gum.background(bg); 
gum.camera.fov = 30;
gum.axes();
gum.defaultPass = 'unlit';



function setup () {

  spin = gum.node('camera.root');
  gum.camera.setParent(spin);

  gum.plyLoader.load('/models/uvsphere.ply', mesh => {
    gum.node('A').setGeometry(gum.addMesh(mesh.fill(g.color('#888')).renderEdges()));
    gum.node('B').setGeometry(gum.addMesh(mesh.fill(g.color('#0ff')).renderNormals()));
  });
}

function draw (delta) {
  gum.background(g.color('#333'));
  gum.drawScene();
  time += 0.05 * delta;

  spin.rotate(0, time * 0.1, 0);

}

gum.run(setup, draw);