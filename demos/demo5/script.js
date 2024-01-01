import { Gum } from '/js/GUM.js';
window.g = new Gum('#canvas', 200, 200);

const bg = g.color('#333');

window.grid = g.shapes.grid(2, 5).findGroups();


const turnTable = g.node('turntable');
g.camera.setParent(turnTable);

g.camera.fov = 30;

g.defaultPass = 'geo';



let spin = 0;
let mesh;

g.addEffect('post-outline2');







function setup () {
  g.size(400, 400);
  g.orbit();
  g.recycleBuffer = true;

  g.plyLoader.load('/models/treescene.ply', (mesh) => {
    window.mesh = mesh;
    g.node('tree').setGeometry(g.mesh(
      mesh.findGroups().render()
    ));
    // g.node('tree2').setGeometry(
    //   g.mesh(
    //     mesh.inflate(0.001).fill(g.color('grayishlavendera')).renderEdges()
    //   )
    // );

  });

}

function draw (delta) {
  g.clear(bg);
  g.clearDepth();
  g.drawScene();

  spin += .005 * delta;
}

g.run(setup, draw);