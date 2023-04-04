import { g, Gum } from './js/GUM.js';

window.g = g;
window.gum = new Gum('#canvas', 1000, 1000, { scale: 1 });

const bg = g.color('#fff');
const col = g.color('rawsienna');


window.cube = g.shapes.cube(0.2, 1, false).findGroups();


let spin;

const shapes = [];
let time = 0;

gum.background(bg); 
gum.camera.fov = 5;
gum.axes();
gum.defaultPass = 'unlit';



function setup () {

  spin = gum.node('camera.root');
  gum.camera.setParent(spin);

  let a = gum.addMesh(
    cube.fill(g.color('#fff'))
    .render()
  );
  
  let b = gum.addMesh(
    cube.fill(g.color('pink'))
    .renderNormals()
  );

  let c = gum.addMesh(
    cube.fill(g.color('#000'))
    .renderEdges()
  );

  // gum.node('A').setGeometry(a);
  gum.node('B').setGeometry(b).scale(1);
  gum.node('C').setGeometry(c).scale(1);

  


}

function draw (delta) {
  gum.background(g.color('#fff'));
  gum.drawScene();
  time += 0.05 * delta;

  spin.rotate(0, time * 0.1, 0);

}

gum.run(setup, draw);