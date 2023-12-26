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

/** Lines. */
import { Line } from './line.js';
import { EdgeCollection } from './edge-collection.js';


/** Vector and matrix math. */
import { Vec2, Vec3 } from './vectors.js';
import * as m4 from './matrix.js';

/** Scenes */
import { Scene } from './scene.js';
import { SceneGraph } from './scene-graph.js';

/** The renderer. */
import { RendererGL2 } from './renderer-gl2.js';
import { PlyLoader } from './ply-loader.js';

import { Texer } from './texer.js';
import { Instancer } from './instancer.js';

import { ColorDict } from './color-dict.js';
import { uuid } from './id.js'

/**
 * Some global helpers.
 * @namespace
 */
const globals = {
  sin: Math.sin, 
  cos: Math.cos,
  vec2: (x, y) => new Vec2(x, y),
  vec3: (x, y, z) =>  new Vec3(x, y, z),
  Vec2: Vec2,
  Vec3: Vec3,
  Mesh: Mesh,
  Line: Line,
  Instancer: Instancer,
  EdgeCollection: EdgeCollection,
  Texer: Texer,
  m4: m4,
  colors: ColorDict,
};




/**
 * The class for one instance of Gum. It has a renderer, a scene-graph, etc.
 */
export class Gum {
  constructor (canvas, settings) {
    settings = settings || {};

    this.instanceId = uuid();

    /**
     * The pixel ratio for display.
     */ 
    this.pixelRatio = settings.pixelRatio || window.devicePixelRatio || 1;

    /**
     * The canvas.
     * @type {HTMLCanvasElement}
     */
    this.canvas = dom.select(canvas);
    this.canvas.classList.add('gum-main-canvas');

    /** 
     * The width of the canvas.
     */
    this.w = 500;

    /** 
     * The height of the canvas.
     */ 
    this.h = 500;

    /*
     * The renderer.
     * @type {RendererGL2}
     */
    this.renderer = new RendererGL2(this.canvas, this.w, this.h, settings);
    this.renderer.instanceId = this.instanceId;
    
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
      colorBufferA: null,
      depthBufferA: null,
      colorBufferB: null,
      depthBufferB: null,
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
     * Keep a clean identity to reset shaders.
     */ 
    this._identity = m4.create();
   
    /**
     * The name of the default geometry pass.
     */
    this.defaultPass = 'unlit';

    /**
     * Some global uniforms.
     */ 
    this.globalUniforms = {
      'uNear': 0.1,
      'uFar': 1000,
      'uEye': [0, 0, 0],
      'uView': m4.create(),
      'uProjection': m4.create(),
      'uAspect': 1,
    };

    this._frameStats = {
      frameStart: 0,
      frameTime: 0,
      avgFrameTime: 0,
    };

    /** 
     * Whether do do some extra blitting to get the full buffer ~after post processing~
     * back into the drawing buffer.
     */ 
    this.recycleBuffer = false;

    this._usedColors = {};

    this._info();

   
  } 


  /**
   * Internal set up. Runs dierectly before user setup.
   */
  _setup () {
    if (this.vert && this.frag) {
      this.renderer.createProgram('default', this.vert, this.frag);
      return;
    }

    const { vert, frag } = shaders[this.defaultPass];

    this.renderer.createProgram('default', vert, frag);
    this.renderer.setProgram('default');
    
    // Make a default magenta texture.
    this.renderer.addTexture('none', new Uint8Array([255, 0, 255, 255]), { width: 1, height: 1, clamp: true, filter: 'NEAREST' });
  }


  /**
   * Run this Gum App. 
   * TODO : This is ugly. Find a way to automatically find the setup and draw 
   *     functions.
   * @param {function} setup 
   * @param {function} draw 
   */
  run (setup, draw) {
    this._onresize();

    this._setup();

    // Do the pre draw routine once incase any code in setup asks to draw.
    this._preDraw();


    // 1) Call the user's custom setup.
    setup();

    // 2) Call one pass of post draw in case the set up fn did any drawing.
    this._postDraw();

    this._info();

    // 3) Bind the draw function.
    this._draw = draw;

    // 4) start animating.
    this._tick();

    window.addEventListener('resize', this._onresize.bind(this));
  }


  /**
   * Set the background color. Like processing also has the effect of 
   * a full canvas clean
   * @param {Color} color 
   * @returns 
   */
  clear (color) {
    if (color instanceof col.Color) {
      this.renderer.clear(color.rgba);
      return;
    }

    if (Array.isArray(color)) {
      this.renderer(clear(color));
    }
  }

  background (color) {

  }

  size (w, h) {
    this.canvas.style.w = w;
    this.canvas.style.h = h;
    this._isFixedSize = true;
  }


  clearDepth () {
    this.renderer.clearDepth();
  }

  /**
   * Make or get a color.
   */
  color (...args) {
    const argString = args.join('');
    if (argString && this._usedColors[argString]) {
      return this._usedColors[argString];
    }
    
    const color = col.color(...args);
    this._usedColors[argString] = color;
    return color;
  }



  /** 
   * The fire once per frame animation handler. 
   */
  _tick () {
    if (this._disposed) return;
    let now = performance.now();
    let delta = 0.001 * (now - this._lastNow) / (1 / 60);
    this._lastNow = now;

    this._time = now - this._timeAtLaunch;
    
    m4.identity(this._imMatrix);

    this.renderer.setProgram('default');
    this.renderer.setRenderTarget('default');

    if (this._loop && this._draw) {
      this._preDraw();
      this._draw(delta);
      this._postDraw();
    }

    const elapsed = now - this._timeAtLastInfo;
    if (elapsed > 1000) {
      this._info();
      this._timeAtLastInfo = now
    }
    
    requestAnimationFrame(this.tick);
  }


  /**
   * Update any 'engine-level' gui components.
   */
  _info () {
    this.sceneGraph.innerHTML = '';
    const verts = (this.renderer.totalVertices() / 1000).toFixed(1);
    const time = this._frameStats.avgFrameTime.toFixed(2);
    const fps = (1000 / time).toFixed(2);
    this.sceneGraph.innerHTML += 'verts: ' + verts + 'k\n';
    this.sceneGraph.innerHTML += 'frame time: ' + time + 'ms — fps: ' + fps + '\n';
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
  get time () {
    return this._time;
  }
  set time (val) {}

  get frame () {
    return this._frame;
  }
  set frame (val) {}


  loadMesh (model, fn) {
    this.plyLoader.load(model, function (mesh) {
      if (fn) { mesh = fn(mesh); }
      this.renderer.addMesh(mesh);
    });
  } 


  addTexer (texer) {
    this.texers.push(texer);
    this.renderer.addTexture(texer.id, texer.canvas, texer.textureSettings);
  }

  axes () {
    if (!this._axes) {
      this._axes = this.renderer.addMesh(primitives._axes());
    }
    
    this.renderer.uniform('uModel', this.scene.transform.matrix);
    this.renderer.draw(this._axes);
  }

  node (name) {
    return this.scene.createChildNode(name, null);
  }

  mesh (msh) {
    if (msh.render) {
      return this.renderer.addMesh(msh.render());
    }
    return this.renderer.addMesh(msh);
  }


  _preDraw (settings = {}) {
    this._frameStats.frameStart = performance.now();

    const pixelRatio = this.pixelRatio;
    let dWidth = Math.round(this.canvas.clientWidth * pixelRatio);
    let dHeight = Math.round(this.canvas.clientHeight * pixelRatio);

    if (settings.screenshot) {
      const { width, height } = settings.screenshot;
      dWidth = width > 0 ? width : dWidth;
      dHeight = height > 0 ? height: dHeight;
    }

    // const needsResize = this._updateCanvasSize();
    // if (needsResize) {
    //   this.resized = true;
    //   this.renderer.resize(this.w, this.h);
    // }

    this.camera.aspect = dWidth / dHeight; 
    this.camera.updateViewProjection();

    this.globalUniforms['uNear'] = this.camera.near;
    this.globalUniforms['uFar'] = this.camera.far;
    this.globalUniforms['uEye'] = this.camera.eye;
    this.globalUniforms['uAspect'] = this.camera.aspect;
    this.globalUniforms['uView'] = this.camera.view;
    this.globalUniforms['uProjection'] = this.camera.projection;

    this.renderer.setProgram('default');
    this.renderer.setRenderTarget('default');

    this.renderer.globalUniformBlock = this.globalUniforms;
    this.renderer.setGlobalUniformBlock();

    this.gl.viewport(0, 0, this.w, this.h);

    for (let texer of this.texers) {
      if (texer.changed()) {
        this.renderer.addTexture(texer.id, texer.canvas, texer.textureSettings);
      }
    }
  }


  _postDraw () {
    this.renderer.gl.finish();
    if (this.postProcessingStack.effects.length > 0) {
      
      const { colorBufferA, 
              colorBufferB, 
              depthBufferA, 
              depthBufferB } = this.postProcessingStack;
      
      this.postProcessingStack.effects.forEach((effect, i) => {
        
        this.renderer.setProgram(effect.program);


        if (i % 2 === 0) {
          this.renderer.setRenderTarget('bufferB');
          this.renderer.uniform('uMainTex', colorBufferA);
          this.renderer.uniform('uDepthTex', depthBufferA);
        } else {
          this.renderer.setRenderTarget('bufferA');
          this.renderer.uniform('uMainTex', colorBufferB);
          this.renderer.uniform('uDepthTex', depthBufferB);
        }

        if (i === this.postProcessingStack.effects.length - 1) {
          this.renderer.setRenderTarget('canvas');
        }

        this.renderer.uniform('uView', this._identity);
        this.renderer.uniform('uModel', this._identity);
        this.renderer.uniform('uProjection', this._identity);
        this.renderer.uniform('uTexSize', [this.canvas.width, this.canvas.height]);
        this.renderer.uniform('uNear', this.camera.near);
        this.renderer.uniform('uFar', this.camera.far);
        this.renderer.clear([1, 0, 0, 1]);

        for (let uniform in effect.uniforms) {
          this.renderer.uniform(uniform, effect.uniforms[uniform]);
        }

        // Pass false to draw without global uniforms.
        this.renderer.draw('effect-quad', false);
      });

      if (this.recycleBuffer) {
        const defaultBuffer = this.renderer.renderTargets['default'].frameBuffer;
        this.renderer.blitBuffer(null, defaultBuffer);
      }
    }


    this._frame ++;
    this.resized = false;

    let frameEnd = performance.now();
    this._frameStats.frameTime = frameEnd - this._frameStats.frameStart;

    this._frameStats.avgFrameTime = 
      ((this._frameStats.avgFrameTime || this._frameStats.frameTime) + this._frameStats.frameTime) / 2;

  }


  addEffect (shader, uniforms = {}) {
    
    if (this.postProcessingStack.effects.length === 0) {
      this.renderer.createRenderTarget('bufferA', true);
      this.renderer.createRenderTarget('bufferB', true);

      const bufferA = this.renderer.renderTargets['bufferA'];
      const bufferB = this.renderer.renderTargets['bufferB'];

      this.postProcessingStack.colorBufferA = bufferA.colorTexUnit;
      this.postProcessingStack.colorBufferB = bufferB.colorTexUnit;

      this.postProcessingStack.depthBufferA = bufferA.depthTexUnit;
      this.postProcessingStack.depthBufferB = bufferB.depthTexUnit;


      const fsQuad = primitives._fsQuad();
      fsQuad.name = 'effect-quad';
      this.renderer.addMesh(fsQuad);
      this.renderer.renderTargets['default'] = bufferA;
      this.renderer.setRenderTarget('default');
    }

    const effect = {
      name: shader,
      program: shader,
      uniforms: uniforms,
    };

    if (!this.renderer.shaderPrograms[shader]) {
      const vert = shaders.post.vert;
      const frag = shaders[shader].frag;
      this.renderer.createProgram(shader, vert, frag);
    }

    this.postProcessingStack.effects.push(effect);
  }

  
  addProgram (programName) {
    if (shaders[programName].vert && shaders[programName].frag) {
      this.renderer.createProgram(programName, shaders[programName].vert, shaders[programName].frag);
    }
  }
  


  /**
   * Render the whole 3D scene.
   */
  drawScene () {
    this.scene.updateSceneGraph();

    this.renderer.uniform('uTex', 'none');

    for (let call of this.scene.drawCalls()) {
      this.renderer.draw(call.geometry, call.uniforms, call.program);
      // console.log(call);
    }
  }


  /**
   * Render one 3D node.
   */
  drawNode (node, children = true) {
    let draws = [];
    node._toDrawList(draws, children);
    for (let call of draws) {
      this.renderer.draw(call.geometry, call.uniforms, call.program);
    }
  }

  
  /**
   * Render one 3D mesh with the default matrix.
   */
  drawMesh (mesh) {
    this.renderer.uniform('uModel', this._imMatrix);
    this.renderer.draw(mesh);
  }


  /**
   * Set up orbit in the current scene.
   */ 
  orbit (distance = 3) {
    let theta = 0;
    let lift = 30;
    let zoom = distance;
    let mouseDown = false;

    const moveCam = (e = {}, force = false) => {
      if (!mouseDown && !force) return;

      theta += e.movementX ?? 0;
      lift -= e.movementY ?? 0;

      lift = common.clamp(lift, 1, 180);

      const x = Math.sin(common.radians(lift)) * Math.cos(common.radians(theta));
      const z = Math.sin(common.radians(lift)) * Math.sin(common.radians(theta));
      const y = Math.cos(common.radians(lift));

      let pos = new Vec3(x,y,z).normalize(zoom);
      this.camera.move(...pos.xyz)
    }

    moveCam({}, true);

    this.canvas.onpointerdown = () => mouseDown = true;
    window.onpointerup = () => mouseDown = false;
    window.onmousemove = (e) => moveCam(e);

    canvas.onwheel = (e) => {

      zoom += e.deltaY * -0.1;
      zoom = common.clamp(zoom, 0.1, 30);
      moveCam(e, true);
    }
  }

  texture (name, imageData, settings = {}) {
    let result = this.renderer.addTexture(name, imageData, settings);
    return result === false ? false : result;
  }

  dispose () {
    this._disposed = true; 
    this.renderer.dispose();
    this.tick = () => {};
  }

  screenshot (w = 100, h = 100) {
    this._preDraw({ screenshot: { width: w, height: h }});
    this._draw();
    this._postDraw();
    const data = this.canvas.toDataURL();
    return data;
  }


  _onresize () {
    if (this._isFixedSize) {
      return;
    }
    const cW = Math.floor(this.canvas.clientWidth * this.pixelRatio);
    const cH = Math.floor(this.canvas.clientHeight * this.pixelRatio);
    if (cW !== this.w || cH !== this.h) {
      this.resized = true;
      this.canvas.width = cW;
      this.canvas.height = cH;
      this.w = cW;
      this.h = cH;
      this.renderer.resize(this.w, this.h);
      this.onresize();          
    }
  }

  // NOOP to be overrridden.
  onresize () {}
}


/**
 * Inline any public functions from a module into the g namespace.
 * @param {Module} module An imported module.
 * @param {string} target An optional string location to put the module under.  
 */
function _inlineModule (module, context, target) {
  let targetObj = context;


  if (target) {
    if (context[target]) {
      targetObj = context[target];
    } else {
      targetObj = {};
      context[target] = targetObj;
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

_inlineModule(common, Gum.prototype);
_inlineModule(globals, Gum.prototype);
_inlineModule(dom, Gum.prototype, 'dom');
_inlineModule(primitives, Gum.prototype, 'shapes');
_inlineModule(meshOps, Gum.prototype, 'meshops');


