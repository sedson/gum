/**
 * An edge collection is used to display any number of disjoint edges
 */ 

export class EdgeCollection {
  constructor (edges, color) {
    this.edges = edges;
    this.color = color || [1, 1, 1, 1];
    this.thickness = 2;
    this.name = 'edge_collection_' + (Date.now() % 253); 

  }

  render () {
    const mode = 'TRIANGLES';
    const vertexCount = this.edges.length * 6;
    const program = 'line2';
    const name = this.name;

    const attribs = {
      position: [],
      normal: [],
      register1: [],
      color: [],
    };
    
    for (let i = 0; i < this.edges.length; i++) {

      const current = this.edges[i][0];
      const next = this.edges[i][1];

      // Submit position for each vert.
      attribs.position.push(
        current[0], current[1], current[2],
        current[0], current[1], current[2],
        current[0], current[1], current[2],
        current[0], current[1], current[2],
        current[0], current[1], current[2],
        current[0], current[1], current[2],
      );

      // Submit next position for each vert.
      attribs.register1.push(
        next[0], next[1], next[2], 1, 
        next[0], next[1], next[2], 1, 
        next[0], next[1], next[2], 1, 
        next[0], next[1], next[2], 1, 
        next[0], next[1], next[2], 1, 
        next[0], next[1], next[2], 1, 
      );

      // Submit color for each vert.
      attribs.color.push(
        ...this.color, 
        ...this.color,
        ...this.color,
        ...this.color,
        ...this.color,
        ...this.color
      );

      // Submit thickness and vert index. The vertex shader will unpack the vert index and apply 
      // the needed transformations in screen space. 
      attribs.normal.push(
        this.thickness, 3, 0,
        this.thickness, 1, 0,
        this.thickness, 2, 0,
        this.thickness, 0, 0,
        this.thickness, 1, 0,
        this.thickness, 2, 0,
      );
    }

    for (let attrib in attribs) {
      attribs[attrib] = new Float32Array(attribs[attrib]);
    }

    return { mode, vertexCount, attribs, name, program };
  }


}