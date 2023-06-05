/**
 * @file Index for GUM. Sets up the g name space and the Gum class.
 */


/** Basic utilities. */
import * as common from './common.js'
import * as dom from './dom-utils.js';
import * as col from './color.js';

/** Import the bundled default shaders. */
import { shaders } from './shaders.js';

/** Meshes. */
import { Mesh } from './mesh.js';
import * as meshOps from './mesh-ops.js';
import * as primitives from './mesh-primitives.js';

/** Vector and matrix math. */
import { Vec2, Vec3 } from './vectors.js';
import * as m4 from './matrix.js';

import { Scene } from './scene.js';
import { SceneGraph } from './scene-graph.js';

/** The renderer. */
import { RendererGL2 } from './renderer-gl2.js';

/** Model loader. */
import { PlyLoader } from './ply-loader.js';

/** Dynamic texer */
import { Texer } from './texer.js';


/**
 * The g (gum tools) namespace provides all the helpful ~static~ functions 
 * to do cool things inside a gum app.
 * @namespace
 */
export const g = {
  sin: Math.sin, 
  cos: Math.cos,
  vec2: (x, y) => new Vec2(x, y),
  vec3: (x, y, z) =>  new Vec3(x, y, z),
  Vec2: Vec2,
  Vec3: Vec3,
  Mesh: Mesh,
  Texer: Texer,
  m4: m4,
};

_inlineModule(common);
_inlineModule(dom, 'dom');
_inlineModule(primitives, 'shapes');
_inlineModule(meshOps, 'meshops');

window.g = g;



/**
 * 
 */
g._usedColors = {};
g.color = function (...args) {
  const argString = args.join('');
  if (this._usedColors[argString]) {
    return this._usedColors[argString];
  }
  
  const color = col.color(...args);
  this._usedColors[argString] = color;
  return color;
}.bind(g);



/**
 * The class for one instance of Gum. It has a renderer, a scene-graph, etc.
 */
export class Gum {
  constructor (canvas, w, h, settings) {
    settings = settings || {};

    /**
     * The canvas.
     * @type {HTMLCanvasElement}
     */
    this.canvas = dom.select(canvas);

    /**
     * The renderer.
     * @type {RendererGL2}
    */
    this.renderer = new RendererGL2(this.canvas, w, h, settings);
    
    const scale = settings?.scale ?? 1;
    this.canvas.style.transform = `scale(${scale})`;
   
    /**
     * A reference to the raw gl context.
     * @type {WebGL2RenderingContext}
     */
    this.gl = this.renderer.gl;
    
    /**
     * The scene.
     * @type {Scene}
     */
    this.scene = new Scene();

    /**
     * The main camera.
     * @type {Camera}
     */
    this.camera = this.scene.camera;
    this.camera.move(0, 3, 5); // Default camera position.


    /**
     * The scene graph widget.
     * @type {}
     */
    this.sceneGraph = SceneGraph();

    /**
     * A model loader.
     */
    this.plyLoader = new PlyLoader(true);

    /** 
     * Whether the app should call user draw in tick. 
     * */
    this._loop = true;

    /**
     * The time stamp at the beginning of the run.
     */
    this._timeAtLaunch = performance.now();

    /**
     * The time stamp at the last info report.
     */
    this._timeAtLastInfo = performance.now();

    /**
     * The current frame number.
     */
    this._frame = 0;

    /**
     * The time at last tick. 
     */
    this._lastNow = 0;

    /**
     * An array of textures.
    */
   this.texers = [];
   
   
    /**
     * The post processing stack.
     */
    this.postProcessingStack = {
      frameBufferTex: null,
      frameBufferDepth: null,
      effects: [],
    };

    /**
     * The tick handler
     */
    this.tick = this._tick.bind(this);

    /**
     * Keep a matrix to transform each frame for immediate mod graphics.
     */
    this._imMatrix = m4.create();
   
    /**
     * The name of the default geometry pass.
     */
    this.defaultPass = 'unlit';
    this._info();
  } 


  /**
   * Set up.
   * @returns 
   */
  _setup () {
    if (this.vert && this.frag) {
      this.renderer.createProgram('default', this.vert, this.frag);
      return;
    }

    const { vert, frag } = shaders[this.defaultPass];

    this.renderer.createProgram('default', vert, frag);
    
    // Make a default magenta texture.
    this.renderer.addTexture('none', new Uint8Array([255, 0, 255, 255]), {width: 1, height: 1, clamp: true, filter: 'NEAREST'});
  }


  /**
   * Run this Gum App. 
   * TODO : This is ugly. Find a way to automatically find the setup and draw 
   *     functions.
   * @param {function} setup 
   * @param {function} draw 
   */
  run (setup, draw) {
    this._setup();

    // 1) Call the user's custom setup.
    setup();

    this._info();

    // 3) Bind the draw function.
    this._draw = draw;

    // 4) start animating.
    this._tick();
  }


  /**
   * Set the background color. Like processing also has the effect of 
   * a full canvas clean
   * @param {Color} color 
   * @returns 
   */
  background (color) {
    if (color instanceof col.Color) {
      this.renderer.clear(color.rgba);
      return;
    }

    if (Array.isArray(color)) {
      this.renderer(clear(color));
    }
  }


  /** 
   * The fire once per frame animation handler. 
   */
  _tick () {
    let now = performance.now();
    let delta = 0.001 * (now - this._lastNow) / (1 / 60);
    this._lastNow = now;
    
    m4.identity(this._imMatrix);

    this.renderer.setProgram('default');
    this.renderer.setRenderTarget(null);

    if (this._loop && this._draw) {
      this._preDraw();
      this._draw(delta);
      this._postDraw();
    }

    if (this._axesMesh) {
      this.renderer.uniform('uModel', this.scene.transform.matrix);
      this.renderer.draw(this._axesMesh);
    }
    
    const elapsed = now - this._timeAtLastInfo;
    if (elapsed > 1000) {
      this._info();
      this._timeAtLastInfo = now
    }
    
    window.requestAnimationFrame(this.tick);
  }


  /**
   * Update any 'engine-level' gui components.
   */
  _info () {
    this.sceneGraph.innerHTML = '';
    const verts = (this.renderer.totalVertices() / 1000).toFixed(1);
    this.sceneGraph.innerHTML += 'verts: ' + verts + 'k\n';   
    this.sceneGraph.innerHTML += this.scene.print();

  }


  /** 
   * Turn looping on or off. 
   */
  loop (val) { 
    this._loop = val;
  }


  /**
   * Get the time since launch.
   * @returns {number} Milliseconds since launch.
   */
  time () {
   return performance.now() - this._timeAtLaunch;
  }


  loadMesh (model, fn) {
    this.plyLoader.load('/models/' + model, function (mesh) {
      if (fn) { mesh = fn(mesh); }
      this.renderer.addMesh(fn(mesh));
    });
  } 


  addTexer (texer) {
    this.texers.push(texer);
    this.renderer.addTexture(texer.id, texer.canvas, texer.textureSettings);
  }

  axes () {
    this._axesMesh = this.renderer.addMesh(primitives._axes());
  }

  node (name) {
    return this.scene.createChildNode(name, null);
  }

  addMesh (mesh) {
    if (mesh.render) {
      return this.renderer.addMesh(mesh.render());
    }
    return this.renderer.addMesh(mesh);
  }


  _preDraw () {
    this.renderer.setProgram('default');
    this.renderer.setRenderTarget('default');

    const dWidth = this.canvas.clientWidth;
    const dHeight = this.canvas.clientHeight;

    const needsResize = this.canvas.width !== dWidth || this.canvas.height !== dHeight;

    if (needsResize) {
      this.canvas.width = dWidth;
      this.canvas.height = dHeight;
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
   
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight; 
    this.camera.updateViewProjection();
    
    this.renderer.uniform('uNear', this.camera.near);
    this.renderer.uniform('uFar',  this.camera.far);
    this.renderer.uniform('uEye', this.camera.eye);
    this.renderer.uniform('uView', this.camera.view);
    this.renderer.uniform('uProjection', this.camera.projection);

    for (let texer of this.texers) {
      if (texer.changed()) {
        this.renderer.addTexture(texer.id, texer.canvas, texer.textureSettings);
      }
    }
  }


  _postDraw () {

    if (this.postProcessingStack.effects.length > 0) {
      const { frameBufferTex, frameBufferDepth } = this.postProcessingStack;
      for (let effect of this.postProcessingStack.effects) {
        
        this.renderer.setProgram(effect.program);
        this.renderer.setRenderTarget('canvas');
        this.renderer.uniform('uMainTex', frameBufferTex);
        this.renderer.uniform('uDepthTex', frameBufferDepth);
        this.renderer.uniform('uTexSize', [
          this.canvas.width, this.canvas.height,
        ]);
        this.renderer.uniform('uNear', this.camera.near);
        this.renderer.uniform('uFar', this.camera.far);
        this.renderer.clear([1, 0, 0, 1]);
        this.renderer.draw('effect-quad');
      }
    }
  }


  addEffect (name, type) {
    
    if (this.postProcessingStack.effects.length === 0) {
      this.renderer.createRenderTarget('frameBuffer', true);
      const targetInfo = this.renderer.renderTargets['frameBuffer'];
      this.postProcessingStack.frameBufferTex = targetInfo.colorTexUnit;
      this.postProcessingStack.frameBufferDepth = targetInfo.depthTexUnit;
      const fsQuad = primitives._fsQuad();
      fsQuad.name = 'effect-quad';
      this.renderer.addMesh(fsQuad);
      this.renderer.renderTargets['default'] = targetInfo;
    };


    const effect = {
      name: name,
      program: name,
    };

    
    const vert = shaders.post.vert;
    const frag = shaders['post-chromatic'].frag;
    
    this.renderer.createProgram(name, vert, frag);

    this.postProcessingStack.effects.push(effect);
  }
  


  /**
   * Render the whole 3D scene.
   */
  drawScene () {
    this.scene.updateSceneGraph();

    this.renderer.uniform('uTex', 'none');

    for (let call of this.scene.drawCalls()) {
      for (let [uniform, value] of Object.entries(call.uniforms)) {
        this.renderer.uniform(uniform, value);
      }
      this.renderer.draw(call.geometry);
    }
  }


  /**
   * Render one 3D node.
   */
  drawNode (node, children = true) {
    let draws = [];
    node._toDrawList(draws, children);
    for (let call of draws) {
      for (let [uniform, value] of Object.entries(call.uniforms)) {
        this.renderer.uniform(uniform, value);
      }
      this.renderer.draw(call.geometry);
    }
  }

  
  /**
   * Render one 3D node.
   */
  drawMesh (mesh) {
    this.renderer.uniform('uModel', this._imMatrix);
    this.renderer.draw(mesh);
  }
}


/**
 * Inline any public functions from a module into the g namespace.
 * @param {Module} module An imported module.
 * @param {string} target An optional string location to put the module under.  
 */
function _inlineModule (module, target) {
  let targetObj = g;

  if (target) {
    if (g[target]) {
      targetObj = g[target];
    } else {
      targetObj = {};
      g[target] = targetObj;
    }
  }

  for (const fn in module) {
    if (typeof module[fn] === 'function' && fn[0] !== '_') {
      if (!(fn in window)) {
        targetObj[fn] = module[fn];
      }
    }
  }
}