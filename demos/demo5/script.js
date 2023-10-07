import { g, Gum } from '/js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 1600, 1600, { scale: 0.5 });

const bg = g.color('grayishlavenderb');

window.grid = g.shapes.grid(2, 5).findGroups();


const turnTable = gum.node('turntable');
gum.camera.setParent(turnTable);
gum.camera.move(0, 2, 4);
gum.camera.target = g.vec3(0, 1, 0);

// gum.camera.fov = 5;

gum.defaultPass = 'geo';



let spin = 0;
let mesh;

gum.addEffect('post-outline2');
// gum.addEffect('post-chromatic');




function setup () {
  gum.plyLoader.load('/models/treescene.ply', (mesh) => {
    window.mesh = mesh;
    gum.node('tree').setGeometry(gum.addMesh(
      mesh.findGroups().findGroups()
    ));
    // gum.node('tree2').setGeometry(
    //   gum.addMesh(
    //     mesh.inflate(0.002).fill(g.color('grayishlavendera')).renderEdges()
    //   )
    // );

  });
}

function draw (delta) {
  gum.background(bg);
  gum.drawScene();

  spin += .005 * delta;
  turnTable.rotate(0, spin, 0);
}

gum.run(setup, draw);