/**
 * 
 */ 

export class Line {
  constructor (points, color = [1, 1, 1, 1]) {
    this.points = points;
    this.color = color;
    this.thickness = .03;
    this.name = 'line_' + (Date.now() % 253); 

  }

  render () {
    const mode = 'TRIANGLE_STRIP';
    const vertexCount = this.points.length * 2;
    const program = 'line';
    const name = this.name;


    const attribs = {
      position: [],
      normal: [],
      register1: [],
      register2: [], 
      color: [],
    };
    
    for (let i = 0; i < this.points.length; i++) {

      const current = this.points[i];
      const previous = (i === 0) ? this.points[i] : this.points[i - 1];
      const next = (i === this.points.length - 1) ? this.points[i] : this.points[i + 1];

      // Submit position twice.
      attribs.position.push(...current, ...current);

      // x component of normal is thickness. y component is direction.
      attribs.normal.push(this.thickness, 1, 0, this.thickness, -1, 0);

      attribs.register1.push(...previous, 1, ...previous, 1);
      attribs.register2.push(...next, 1, ...next, 1);

      attribs.color.push(...this.color, ...this.color);
    }

    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    return { mode, vertexCount, attribs, name, program };

  }


}