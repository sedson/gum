/**
 * @file Manage the particle drawing 
 */


export class Instancer {

  constructor (instance, count, renderer, program) {
    
    /** The instance mesh */
    this.instance = instance;
    if (this.instance.render) {
      this.instance = this.instance.render();
    }

    /** How many instances. */
    this.count = count;

    /** Pointer to the renderer. */
    this.renderer = renderer;

    /** The name of the shader program */
    this.program = program;
    
    /** Pointer to gl context. */
    this.gl = this.renderer.gl;

    /** The total attributes. */
    this.attrs = ['x', 'y', 'z', 'w', 'r', 'g', 'b', 'a'];
    
    /** The total attributes. */
    this.stride = this.attrs.length;

    /** The data is one float per attr per vert. */
    this.data = new Float32Array(this.count * this.stride);

    /** Store the index of each attr by name */
    this.attribIndices = new Map();
    this.attrs.forEach((attr, i) => { this.attribIndices.set(attr, i); });

    /** The particle mesh for each instance. */
    this.instanceVao = this.renderer._createVao(this.instance.attribs);

    /** Shader attr pointer to the position. Position of the verts per instance. */
    this.posLoc = this.gl.getAttribLocation(this.renderer.shaderPrograms[this.program], 'aPosition');
    
    /** Shader attr pointer to the color. */
    this.colorLoc = this.gl.getAttribLocation(this.renderer.shaderPrograms[this.program], 'aColor');

    this.regLoc = this.gl.getAttribLocation(this.renderer.shaderPrograms[this.program], 'aRegister1');

    /** Whether we need to re-render */
    this.changed = true;

    /** The gl buffer. */
    this.buffer = this.gl.createBuffer();
  }

  /** 
   * Fill the particles with randomized data.
   */ 
  iniitialize (data = null) {
    if (!data) {
      this.fillRandom();
      this.changed = true;
      return;
    }

    this.data = data;
    this.count = this.data.length / this.stride;

    this.changed = true;
  }


  /** 
   * Fill the particles with randomized data.
   */ 
  fillRandom () {
    for (let i = 0; i < this.count; i++) { 
      this.setAttr(i, 'x', Math.random());
      this.setAttr(i, 'y', Math.random());
      this.setAttr(i, 'z', Math.random());
      this.setAttr(i, 'r', 1);
      this.setAttr(i, 'g', 0);
      this.setAttr(i, 'b', 1);
      this.setAttr(i, 'a', 1);
    }
  }

  /**
   * Set an attr. 
   * @param {int} index The particle index.
   * @param {string} attr The attr 
   * @param {float} value
   */ 
  setAttr(index, attr, val) {
    this.data[index * this.stride + this.attribIndices.get(attr)] = val;
  }

  /**
   * Get an attr. 
   * @param {int} index The particle index.
   * @param {string} attr The attr.
   */ 
  getAttr(index, attr) {
    return this.data[index * this.stride + this.attribIndices.get(attr)];
  }

  /**
   * Copy the desired data from the main buffer into the gpu buffer.
   */ 
  renderPoints () {
   
  }

  draw () {
    this.renderer.setProgram(this.program);

    // Prep the quad mesh for the particle.
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    // this.gl.enableVertexAttribArray(this.posLoc);
    // this.gl.vertexAttribPointer(this.posLoc, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindVertexArray(this.instanceVao);

    // Prep the instances.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    
    // Buffer Data?
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);

    const byteSize = this.stride * 4;

    this.gl.vertexAttribPointer(this.regLoc, 4, this.gl.FLOAT, false, byteSize, 0);
    this.gl.vertexAttribDivisor(this.regLoc, 1);
    this.gl.enableVertexAttribArray(this.regLoc);

    this.gl.vertexAttribPointer(this.colorLoc, 4, this.gl.FLOAT, false, byteSize, 16);
    this.gl.vertexAttribDivisor(this.colorLoc, 1);
    this.gl.enableVertexAttribArray(this.colorLoc);

    this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, this.instance.vertexCount, this.count);
  }
}