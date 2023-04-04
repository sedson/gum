import * as m4 from './js/matrix.js';
import * as shaders from './js/shaders.js';
import * as primitives from './js/mesh-primitives.js';
import { RendererGL2 } from './js/renderer-gl2.js';
import { PlyLoader } from './js/ply-loader.js';
import { Scene } from './js/scene.js';
import * as MeshOps from './js/mesh-ops.js'
import { color } from './js/Color.js';

window.meshOps = MeshOps;

const GRAY = color('neutralgray');
const SLATE = color('slatecolor');
const ORANGE = color('orange');

const POST_PASS_ENABLED = false; 

// State.
let canvas;
let renderer;
let lastNow = Date.now();
let lastRenderTime = 0;
let aspect;
let instances = {};
let loader;
let scene = new Scene();
let stats;

// Basic camera object.
let camera = {
  theta: 0,
  lift: 25,
  radius: 7,
  fov: 20,
  near: 0.5,
  far: 100,
  spin: true,
};

window.camera = camera;

// Angle conversion.
let rad = deg => Math.PI * deg / 180;
let deg = rad => 180 * rad / Math.PI;

/**
 * Runs once at start.
 */ 
async function setup () {
  
  // Grab the canvas and GL context.
  canvas = document.getElementById('canvas');

  renderer = new RendererGL2(canvas, 2000, 2000);
  window.renderer = renderer;

  renderer.createRenderTarget('gBuffer', true);
  renderer.createProgram('geometry', shaders.geometryPass.vertex, shaders.geometryPass.fragment);
  renderer.createProgram('post', shaders.postPass.vertex, shaders.postPass.fragment);
  
  // Make some meshes.
  const boxMesh = primitives.cube(1);
  const icoMesh = primitives.icosphere(1, 1, true);
  const icoMesh2 = primitives.icosphere(1, 3);
  const plane = primitives.quad(10);

  const orangeSphere = renderer.addMesh(icoMesh2.color(ORANGE).render());
  console.log(orangeSphere);
  renderer.addMesh(primitives.cube(0.1).color(color('yellowocher')).render());
  renderer.addMesh(primitives.quad(1).color(SLATE).render());

  // Add some instances
  window.a = scene.createChildNode('BALL', orangeSphere);
  window.b = scene.createChildNode('smooth', 'smooth');
  b.move(1, 0, 1).rotate(1, 3, 4);
  b.setParent(a);
  window.d = scene.createChildNode('plane', 'plane');
  let last = b;

  // Make a bunch of little boxes.
  for (let i = 0; i < 10; i++) {

    let c = last.createChildNode(i, 'little');
    c.rotate(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    c.move(Math.random() * 1 - .5, Math.random() * 1 - .5, Math.random() * 1 - .5);
    last = [a, b, c, c, b][i % 5];
  }

  scene.updateSceneGraph();
  
  // Make accessible to the ui code in another module.
  window.camera = camera;
  window.instances = instances;

  loader = new PlyLoader(true);
  loader.load('./models/pottedplant.ply', mesh => {
    window.mesh1 = mesh;
    renderer.addMesh(mesh.findGroups().color(GRAY).render());
  });

  window.scene = scene;

  stats = document.createElement('div');
  stats.classList.add('stats');
  document.body.append(stats);

  if (POST_PASS_ENABLED) {
    renderer.addMesh('fullScreenQuad', primitives.fsQuad());
  }

  draw();
}


/**
 * Runs once per animation frame.
 */
function draw () {
  let now = Date.now();
  
  let elapsed = (now - lastNow) / 16.67;

  lastNow = now;

  a.traverse(x => {
    // x.transform.rotation.x += 0.01 * elapsed;
  });



  renderer.setRenderTarget(POST_PASS_ENABLED ? 'gBuffer' : null);
  
  renderer.setProgram('geometry');
  renderer.clear([0.1, 0.1, 0.1, 1]);  
  renderer.uniform('uNear', camera.near);
  renderer.uniform('uFar', camera.far);
  
  // Rotate the cam.
  if (camera.spin) {
    camera.theta -= 0.5 * elapsed; 
  }

  aspect = canvas.clientWidth / canvas.clientHeight;

  // Move cam and calculate view and projection.
  let x = Math.sin(rad(camera.theta)) * camera.radius;
  let z = Math.cos(rad(camera.theta)) * camera.radius;
  let y = Math.sin(rad(camera.lift))  * camera.radius;
  
  let view = m4.lookAt(m4.create(), [x, y, z], [0, 0, 0], [0, 1, 0]);
  let projection = m4.perspective(m4.create(), rad(camera.fov), aspect, camera.near, camera.far);
  
  // Set the uniforms.
  renderer.uniform('uView', view);
  renderer.uniform('uProjection', projection);
  renderer.uniform('uEye', [x, y, z]);
    
  // Draw any instances.
  
  scene.updateSceneGraph();

  for (let call of scene.drawCalls()) {
    for (let [uniform, value] of Object.entries(call.uniforms)) {
      renderer.uniform(uniform, value);
    }
    renderer.draw(call.geometry);
  }

  if (POST_PASS_ENABLED) {
    renderer.setRenderTarget(null);
    renderer.setProgram('post');
    renderer.clear([1, 0, 0, 1]);
    renderer.uniform('uMainTex', 0)
    renderer.uniform('uDepthTex', 1)
    renderer.uniform('uTexSize', [canvas.width, canvas.height]);
    renderer.uniform('uNear', camera.near);
    renderer.uniform('uFar', camera.far);
    renderer.draw('fullScreenQuad');
  }

  requestAnimationFrame(draw);

  let renderTime = (Date.now() - now) + lastRenderTime;
  
  // stats.innerText = `Render time : ${renderTime} ms. FPS:`
  stats.innerHTML = scene.print();
}


addEventListener('DOMContentLoaded', setup);
