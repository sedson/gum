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
    // this.particle = circle(16);

    /** Bind and upload mesh to the gpu. */
    // const verts = this.instance.attribs.position;
    // this.vertexBuffer = this.gl.createBuffer();
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    // this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.DYNAMIC_DRAW, 0);

    this.instanceVao = this.renderer.attribsToVao(this.instance.attribs);


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



  /**
   * Hightlight one category.
   * @param {number} categoery The category index to select.
   * @param {number} 0->1 amount of selection.
   * 
   */ 
  selectCategory (category, amt) {

    if (category === -1) {
      for (let i = 0; i < this.selectionsByGroup.length; i++) {
        this.selectionsByGroup[i] = amt;
      }
    }

    this.selectionsByGroup[category] = amt; 
    this.changed = true;
  }

  addMorph (name, positions) {
    if (this.morphPointer === this.morphLimit) {
      console.warn(`More than ${this.morphLimit} morphs added.`);
      return;
    }

    this.morphs[name] = positions;
    this.morphIndicesByName[name] = this.morphPointer;

    for (let i = 0; i < this.count; i++) {


      const index = (i * 3) % positions.length;
      const x = positions[index];
      const y = positions[index + 1];
      const z = positions[index + 2];
      // console.log([x, y, z]);

      const xLoc = (i * this.gpuDataStride) + 8 + (4 * this.morphPointer);
      const yLoc = (i * this.gpuDataStride) + 8 + (4 * this.morphPointer) + 1;
      const zLoc = (i * this.gpuDataStride) + 8 + (4 * this.morphPointer) + 2;


      this.gpuData[xLoc] = x;
      this.gpuData[yLoc] = y;
      this.gpuData[zLoc] = z;
    }

    this.morphPointer ++;
  }

  addRandomMorph () {
    const random = [];

    for (let i = 0; i < this.count / 3; i++) {
      seed = i * 49734321;

      const theta = dRand() * 2 * Math.PI;
      const lift = dRand() * 2 * Math.PI;;
      const rad = dRand();
      const x = Math.cos(theta) * rad;
      const y = Math.sin(theta) * rad;
      const z = Math.sin(lift) * rad;

      random.push(x, y, z);
    }

    this.addMorph('random', random);
  }

  morph (target, amt) {
    if (target === 'clear') {
      this.currentMorphTargets = {};
      this.changed = true;
      return;
    }

    if (!this.morphs[target]) {
      return;
    }

    this.currentMorphTargets[target] = amt;
    this.updateMorphs();
  }


  updateMorphs () {
    for (const [name, value] of Object.entries(this.currentMorphTargets)) {
      const morphIndex = this.morphIndicesByName[name];
      if (morphIndex === undefined) return;
      this.renderer.uniform('uMorphFactor' + morphIndex, value);
    }
  }


  /** 
   * Load the particles from some blob data 
   */ 
  async setFromFileBlob (blob) {
    const buffer = await blob.arrayBuffer();
    const floats = new Float32Array(buffer);
    this.iniitialize(floats);
  }


  /** 
   * Load the particles from some blob data 
   */ 
  saveToFileBlob () {
    const blob = new Blob([this.data], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'particle_buffer.blob';
    link.click();
  }


  findParticleAtPosition (x, y) {
    let minDist = Infinity;
    let index = -1;

    for (let i = 0; i < this.count; i++) {
      let ox = this.getAttr(i, 'ox');
      let oy = this.getAttr(i, 'oy');
      let px = ox, py = oy;

      for (let target in this.currentMorphTargets) {
        const amt = this.currentMorphTargets[target];
        const pts = this.morphs[target];

        const ptsIndex = (i * 3) % pts.length;

        const dx = pts[ptsIndex] - ox;
        const dy = pts[ptsIndex + 1] - oy;

        px += dx * amt;
        py += dy * amt;
      }

      const dx = x - px;
      const dy = y - py;
      

      const d2 = dx * dx + dy * dy;

      if (d2 < minDist) {
        minDist = d2;
        index = i;
      }
    }
    return index;
  }


  recolorGroup (groupIndex, newColor) {
    const [r, g, b] = hexToNormalizedRGB(newColor.slice(1));

    for (let i = 0; i < this.count; i++) {
      const group = this.getAttr(i, 'cat');

      if (group === groupIndex) {
        this.setAttr(i, 'r', r);
        this.setAttr(i, 'g', g);
        this.setAttr(i, 'b', b);
      }
    }
  }


  getParticlePosition (index) {

    const ox = this.getAttr(index, 'ox');
    const oy = this.getAttr(index, 'oy');
    const oz = this.getAttr(index, 'oz');

    let x = ox, y = oy, z = oz;

    for (let target in this.currentMorphTargets) {
      const amt = this.currentMorphTargets[target];
      const pts = this.morphs[target];

      const ptsIndex = (index * 3) % pts.length;

      const dx = pts[index] - ox;
      const dy = pts[index + 1] - oy;
      const dz = pts[index + 2] - oz;

      x += dx * amt;
      y += dy * amt;
      z += dz * amt;

    }

    return [x, y, z];
  }
}

