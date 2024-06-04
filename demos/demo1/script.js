import { Gum } from "/js/GUM.js";

const g = new Gum("#canvas", { width: 512, height: 512 });

const cube = g.shapes.cube(1)
  .fill(g.color("#0ad"));

const mesh = g.mesh(cube);

g.camera.move(2, 2, 2);

function setup() {}

function draw() {
  g.clear(g.color("#222"));
  g.axes();
  g.drawMesh(mesh);
}

g.run(setup, draw);