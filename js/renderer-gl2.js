/**
 * @fileoverview The RenderContext class creates a helpful level of abstraction 
 *     between an app and the web gl rendering context.
 */
import { vertexAttributeLayout } from './renderer-gl2-attributes.js';
import { defaultUniformValues } from './default-uniform-values.js';


export class RendererGL2 {
  /**
   * Construct a RenderContext.
   * @param {HTMLCanvasElement} canvas The canvas to render into. The 'null' 
   *     render target.
   * @param {number} w The width.
   * @param {number} h The height.
   * @param {object} config Optional configuration.
   * @returns {RenderContext} The new render context instance.
   */
  constructor (canvas, w, h, config) {

    /**
     * The canvas.
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;
    this.canvas.width = w; 
    this.canvas.height = h;
    
    /**
     * The aspect ratio.
     * @type {number}
     */
    this.aspectRatio = w / h;

    /**
     * Settings for the WebGl2 context.
     */
    this.glSettings = {
      // Frame buffers do not support antialias, so skip it.
      antialias: false, 

      // Mimic Processing's optional clear pattern.
      preserveDrawingBuffer: true,
    };

    // Apply the config to the gl settings.
    if (config) {
      Object.assign(this.glSettings, config);
    }
    
    /**
     * The WebGl2 context.
     * @type {WebGL2RenderingContext}
    */
    this.gl = canvas.getContext('webgl2', this.glSettings);
   
    if (!this.gl) {
      console.warn('Web GL 2 not available!');
      return;
    }
    
    /**
     * Default configuration for GL rendering.
     * @private
     */
    this._configuration = {
      depthTest: true,
      depthWrite: true,
      faceCulling: 'back',
    };

    this._configure(config);

    /**
     * The available shader programs.
     */
    this.shaderPrograms = {};

    /**
     * The uniforms available in each program.
     * @type {Object}
     */
    this.shaderProgramUniforms = {};

    /**
     * The render targets.
     */
    this.renderTargets = {
      'canvas': null,
      'default': null,
    };

    /**
     * The default clear color.
     */
    this.clearColor = [0, 0, 0, 1];
    
    /**
     * The name of the active program.
     */
    this.activeProgram;

    /**
     * The name of the active render target.
     */
    this.renderTarget;

    /**
     * The last used texture unit when binding frame buffer textures.
     */
    this.textureUnitIndex = 0;

    /**
     * The maximun number of samplers available.
     */ 
    this.MAX_TEX_UNIT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    /**
     * The GL uniform setter function keyed by the GL type.
     */
    this.uniformTypes = {
      'FLOAT'      : 'uniform1f',
      'FLOAT_VEC2' : 'uniform2fv',
      'FLOAT_VEC3' : 'uniform3fv',
      'FLOAT_VEC4' : 'uniform4fv',
      'FLOAT_MAT4' : 'uniformMatrix4fv',
      'SAMPLER_2D' : 'uniform1i',
    };
    
    /**
     * The available meshes.
     */
    this.meshes = {};

    /**
     * Which texture unit each frame buffer ends up on.
     */
    this.texturesByName = {};

    /**
     * A list of the the vertex attributes.
     */ 
    this.vertexAttributes = [...vertexAttributeLayout];

    if (config.attributes) {
      this.vertexAttributes.push(...config.attributes);
    }

    /**
     * Attrib info hashes keyed by name.
     */ 
    this.attributeInfoByName = {};
    this.vertexAttributes.forEach((attrib, i) => {
      this.attributeInfoByName[attrib.name] = attrib;
      this.attributeInfoByName[attrib.name].index = i;
    });

    this.globalUniformBlock = {};
  }


  /**
   * Configure any or all of the render behaviors: depth testing, depth writing,
   * and face culling.
   * @param {object} settings 
   */
  _configure (settings) {
    if (settings) {
      for (let setting in settings) {
        this._configuration[setting] = settings[setting];
      }
    }
    
    this.depthTest(this._configuration.depthTest);
    this.depthWrite(this._configuration.depthWrite);
    this.cullFace(this._configuration.faceCulling);
  }


  /**
   * Turn depth testing on or off.
   * @param {boolean} flag Whether depth testing is enabled.
   */
  depthTest (flag) {
    const gl = this.gl;
    this._configuration.depthTest = flag;
    gl.disable(gl.DEPTH_TEST);
    if (flag) {
      gl.enable(gl.DEPTH_TEST);
    }
  }
  

  /**
   * Turn depth writing on or off.
   * @param {boolean} flag Whether depth writing is enabled.
   */
  depthWrite (flag) {
    const gl = this.gl;
    this._configuration.depthWrite = flag;
    gl.depthMask(flag);
  }


  /**
   * Set which faces we want to cull.
   * @param {string} face The face to cull. Either 'back', 'front', 'none', or 
   *     'all'.
   */
  cullFace (face) {
    const gl = this.gl;
    this._configuration.faceCulling = face;

    switch (('' + face).toUpperCase()) {
      case 'NONE':
        gl.disable(gl.CULL_FACE);
        break;

      case 'ALL':
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT_AND_BACK);
        break;

      case 'FRONT':
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        break;

      case 'BACK':
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        break;

      default:
        gl.disable(gl.CULL_FACE);
    }
  }


  /**
   * Add the 'a' to an attribute name if it is not already there. For example 
   * this function called on 'position' yields 'aPosition'. 
   * TODO : Hmm what if an attribute starts with 'a'.
   * @param {string} name 
   * @returns {string}
   * @private
   */
  _prefixAttribName (name) {
    if (name[0] === 'a') {
      return name;
    }
    return 'a' + name[0].toUpperCase() + name.slice(1);
  }


  /**
   * Set the active shader program.
   * @param {string} program The name of the program to use.
   * @returns {void}
   */
  setProgram (program) {
    if (!this.shaderPrograms[program]) {
      console.warn('No program found:', mesh.program);
      return;
    }
    
    if (this.activeProgram === program) {
      return;
    }

    this.gl.useProgram(this.shaderPrograms[program]);
    this.activeProgram = program;

    this.setGlobalUniformBlock();
  }


  /**
   * Set the active render target.
   * @param {string|null} target The name of the target. If null render to the 
   *     canvas.
   * @returns {void}
   */
  setRenderTarget (target) {
    if (target === null || this.renderTargets[target] === null) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.renderTarget = null;
      return;
    }

    if (this.renderTargets[target] === undefined) {
      return;
    }

    if (this.renderTarget === target) {
      return;
    }

    const rt = this.renderTargets[target];
    const frameBuffer = rt.frameBuffer;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
    this.renderTarget = target;
  }


  /**
   * Add a render target.
   * @param {string} name A unique name for the render target. 
   * @param {boolean} depth Whether to create a depth texture as well.
   */
  createRenderTarget (name, depth) {
    const target = {};
    const gl = this.gl;

    target.colorTexUnit = this.textureUnitIndex;
    target.colorTexture = gl.createTexture();

    this.texturesByName[name + '.color'] = {
      unit: target.colorTexUnit,
      texture: target.colorTexture,
    };

    this.textureUnitIndex ++;

    gl.activeTexture(gl.TEXTURE0 + target.colorTexUnit);

    // Make a texture to be the color of the target.
    gl.bindTexture(gl.TEXTURE_2D, target.colorTexture);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, 
      this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    // Create the frame buffer.
    target.frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.colorTexture, 0);
    
    if (depth) {
      target.depthTexUnit = this.textureUnitIndex;
      target.depthTexture = gl.createTexture();
      
      this.texturesByName[name + '.depth'] = {
        unit: target.depthTexUnit,
        texture: target.depthTexture,
      };
      
      this.textureUnitIndex ++;


      gl.activeTexture(gl.TEXTURE0 + target.depthTexUnit);
      gl.bindTexture(gl.TEXTURE_2D, target.depthTexture);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, 
        this.canvas.width, this.canvas.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, target.depthTexture, 0);
    }

    this.renderTargets[name] = target;
  }


  /**
   * Draw a named mesh.
   * @param {string} mesh 
   * @returns 
   */
  draw (meshName, uniforms = {}, program = null) {
    if (!this.meshes[meshName]) {
      console.warn('No mesh found:', meshName);
      return;
    }
    
    const mesh = this.meshes[meshName];

    if (program && program !== this.activeProgram) {
      this.setProgram(program);
    }

    if (mesh.program && mesh.program !== this.activeProgram) {
      this.setProgram(mesh.program);
    } 

    for (let uniform in uniforms) {
      this.uniform(uniform, uniforms[uniform]);
    }

    this.gl.bindVertexArray(mesh.vao);
    this.gl.drawArrays(this.gl[mesh.data.mode], 0, mesh.data.vertexCount);
    this.gl.bindVertexArray(null);
  }
  

  /**
   * Find the constant name of a uniform type by the returned uniform type 
   * pointer
   */
  findUniformType (typePointer) {
    for (let namedType of Object.keys(this.uniformTypes)) {
      if (this.gl[namedType] === typePointer) {
        return namedType;
      }
    }
    return false;
  }


  /**
   * Create a shader program.
   * @param {string} name The name of the program
   * @param {string} vert The vertex shader source.
   * @param {string} frag The fragment shader source.
   * @returns 
   */
  createProgram (name, vert, frag) {

    const program = this.gl.createProgram();

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vert);
    this.gl.compileShader(vertexShader);
    this.gl.attachShader(program, vertexShader);
    
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, frag);
    this.gl.compileShader(fragmentShader);
    this.gl.attachShader(program, fragmentShader);

    this.bindVertexAttributeLocations(program);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getShaderInfoLog(vert));
      console.log(this.gl.getShaderInfoLog(frag));
      return;
    }

    // Use the program so that default uniforms can be set.
    this.gl.useProgram(program);

    // Store information on any uniforms in the program.
    const uniformBlock = {};
    const uniformCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = this.gl.getActiveUniform(program, i);
      const { size, type, name } = uniformInfo;
      
      let namedType = this.findUniformType(type);
      
      if (!namedType) {
        continue;
      }
      
      uniformBlock[name] = {
        type: namedType,
        location: this.gl.getUniformLocation(program, name),
      };

      // Set defaults.
      if (defaultUniformValues[name] && this.uniformTypes[namedType]) {
        const value = defaultUniformValues[name];
        const location = uniformBlock[name].location;
        const isMatrix = namedType.indexOf('MAT') > -1;
        this._uniform(this.uniformTypes[namedType], location, value, isMatrix);
      }
    }
    
    this.shaderPrograms[name] = program;
    this.shaderProgramUniforms[name] = uniformBlock;
    return program;
  }


  /**
   * Enforce an identical attribute layout across the programs.
   * @param {*} program 
   */
  bindVertexAttributeLocations (program) {
    for (let i = 0; i < this.vertexAttributes.length; i++) {
      const attrib = this.vertexAttributes[i];
      this.gl.bindAttribLocation(program, i, attrib.name);
    }
  }
  

  _bufferAttribs (vao, attribs) {
    const gl = this.gl;

    gl.bindVertexArray(vao);

    for (const [attrib, data] of Object.entries(attribs)) {

      const attribName = this._prefixAttribName(attrib);
      const attribInfo = this.attributeInfoByName[attribName];
      
      if (!attribInfo) {
        continue;
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      
      const { index, size, type, normalized } = attribInfo;
      gl.vertexAttribPointer(index, size, gl[type], normalized, 0, 0);
      gl.enableVertexAttribArray(index);
    }

    gl.bindVertexArray(null);
  }


  _getMeshId (name) {
    const n = name.toLowerCase();
    let postFix = ''
    let num = 1;
    while (this.meshes[n + postFix]) {
      postFix = '.' + ('' + num).padStart(3, '0');
      num += 1;
    }
    return n + postFix;
  }

  
  addMesh (meshData) {
    let data;
    
    if (meshData.render) {  
      data = data.render();
    } else {
      data = meshData;
    }

    let name = data.name || 'mesh';
    name = this._getMeshId(name);


    if (this.meshes[name]) { 
      this.updateMesh(name, data);
      return;
    }

    const mesh = { data };
    data.name = name;
    mesh.vao = this.gl.createVertexArray();

    mesh.program = data.program ?? null;

    console.log('add mesh: ', name)
    this._bufferAttribs(mesh.vao, data.attribs);
    
    this.meshes[name] = mesh;
    return name;
  }


  updateMesh (name, data) {
    if (!this.meshes[name]) {
      return;
    }

    const mesh = this.meshes[name];
    // this.gl.deleteVertexArray(mesh.vao);

    mesh.data = data;
    // mesh.vao = this.gl.createVertexArray();
    
    this._bufferAttribs(mesh.vao, data.attribs);
  }


  /**
   * Set a uniform in the active program.
   * @param {string} name The name of the uniform.
   * @param {any} value The value to set.
   */
  uniform (name, value) {
    const uniforms = this.shaderProgramUniforms[this.activeProgram];

    if (!uniforms[name]) {
      return;
    }

    const { type, location } = uniforms[name];

    if (type.indexOf('MAT') > -1) {
      this._uniform(this.uniformTypes[type], location, value, true);
      return;
    }

    // Allow the user to pass the name of the texture as a uniform value.
    if (typeof value === 'string' && this.texturesByName[value] !== undefined) {
      const unit = this.texturesByName[value].unit;
      this._uniform(this.uniformTypes[type], location, unit);
      return;
    }
    this._uniform(this.uniformTypes[type], location, value);
  }


  /**
   * Private internal uniform setter.
   * @param {string} fn The name of the uniform setting function. 
   * @param {WebGLUniformLocation} location The location in the program.
   * @param {array|float|int} value The value to set.
   * @param {boolean} isMatrix Matrix flag.
   */ 
  _uniform (fn, location, value, isMatrix = false) {
    if (isMatrix) {
      this.gl[fn](location, false, value);
    } else {
      this.gl[fn](location, value);
    }
  }


  clear (color) {
    this.gl.clearColor(...color);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  clearDepth () {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }



  hardFind (pointer) {
    for (const [key, value] of Object.entries(this.gl.constructor)) {
      if (typeof value !== 'number') {
        continue;
      }

      if (value === pointer) {
        console.log(key);
        return key;
      }
    }
  }


  addTexture (name, imageData, settings) {
    const gl = this.gl;

    // No more than 8 textures per app.
    if (this.textureUnitIndex >= this.MAX_TEX_UNIT) { 
      console.warn('Maximum texture units exceeded.');
      return; 
    }

    let unit, texture;
    
    if (this.texturesByName[name]) {
      unit = this.texturesByName[name].unit;
      texture = this.texturesByName[name].texture;
    } else {
      unit = this.textureUnitIndex;
      texture = gl.createTexture();
      this.texturesByName[name] = { unit, texture };
      this.textureUnitIndex ++;
    }

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    const { width, height, filter, clamp } = settings;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    
    if (clamp) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filter]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);
    
    return unit;
  }


  /**
   * Get the total number of vertices in this mesh.
   */ 
  totalVertices () {
    return Object.values(this.meshes).reduce((a, b) => a + b.data.vertexCount, 0);
  }


  /**
   * Set any uniforms in the global block.
   */
  setGlobalUniformBlock () {
    for (let uniform in this.globalUniformBlock) {
      this.uniform(uniform, this.globalUniformBlock[uniform]);
    }
  }
  
}