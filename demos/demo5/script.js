import { g, Gum } from '/js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 200, 200);
console.log(gum.canvas)

const bg = g.color('#333');

window.grid = g.shapes.grid(2, 5).findGroups();


const turnTable = gum.node('turntable');
gum.camera.setParent(turnTable);

gum.camera.fov = 30;

gum.defaultPass = 'unlit';



let spin = 0;
let mesh;

// gum.addEffect('post-outline2');

gum.addEffect('post-blur');
gum.addEffect('post-chromatic2');






function setup () {
  gum.orbit();
  gum.recycleBuffer = true;

  gum.plyLoader.load('/models/treescene.ply', (mesh) => {
    window.mesh = mesh;
    gum.node('tree').setGeometry(gum.addMesh(
      mesh.findGroups().render()
    ));
    gum.node('tree2').setGeometry(
      gum.addMesh(
        mesh.inflate(0.002).fill(g.color('grayishlavendera')).renderEdges()
      )
    );

  });

}

function draw (delta) {
  // gum.background(bg);
  gum.clearDepth();
  gum.drawScene();

  spin += .005 * delta;
}

gum.run(setup, draw);