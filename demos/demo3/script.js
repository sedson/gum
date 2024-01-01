import { Gum } from '/js/GUM.js';

window.g = new Gum('#canvas', 1000, 1000, { scale: 0.5 });

const bg = g.color('#333');
const col = g.color('rawsienna');


window.grid = g.shapes.grid(2, 5).findGroups();


let spin;

const shapes = [];
let time = 0;

g.background(bg); 
g.camera.fov = 30;
g.defaultPass = 'default';
function setup () {

  spin = g.node('camera.root');
  g.camera.setParent(spin);

  g.node('C').setGeometry(g.mesh(grid.fill(col).renderEdges()));

  g.plyLoader.load('/models/roundcube.ply', mesh => {
    g.node('A').setGeometry(g.mesh(mesh.fill(g.color('#888')).renderEdges()));
    g.node('B').setGeometry(g.mesh(mesh.fill(g.color('#0ff')).renderNormals(0.1)));
  });
}

function draw (delta) {
  g.clear(g.color('#333'));
  g.axes();
  g.drawScene();
  time += 0.05 * delta;

  spin.rotate(0, time * 0.1, 0);

}

g.run(setup, draw);