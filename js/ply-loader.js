/**
 * @fileoverview Provides a static class to load and parse .ply (Stanford 
 *     Triangle Format) files.
 */
import { Mesh } from "./mesh.js";

export class PlyLoader {
  
  /**
   * Make a new Loader. A given project should only need one loader instance.
   * @param {boolean} verbose 
   */
  constructor (verbose = false) {
    
    /** The queue of files to be loaded. */
    this._filesToLoad = [];

    /** The current loading state. */
    this._isLoading = false;

    /** Char code of end of line. */
    this.RETURN = 10;

    /** Char code for space, which delimits ascii values on one line. */
    this.SPACE = 32;

    /** String that delimits the end of the header. */
    this.END_HEADER = 'end_header';

    /** Toggle certain debugging console.logs */
    this._verbose = verbose;

    /** 
     * The PLY format defines data types with these strings. This object helps
     * shim those to javascript ready values.
     */
    this.PLY_TYPES = {
      'char':   { bytes: 1, getter: 'getInt8'},
      'uchar':  { bytes: 1, getter: 'getUint8'},
      'short':  { bytes: 2, getter: 'getInt16'},
      'ushort': { bytes: 2, getter: 'getUint16'},
      'int':    { bytes: 4, getter: 'getInt32'},
      'uint':   { bytes: 4, getter: 'getUint32'},
      'float':  { bytes: 4, getter: 'getFloat32'},
      'double': { bytes: 8, getter: 'getFloat64'},
    };

    /**
     * Mappings to convert from PLY vertex attributes to the names used in the 
     * Mesh class.
     */
    this.PLY_MAPPINGS = {
      'x'    : { attrib: 'position', index: 0 },
      'y'    : { attrib: 'position', index: 1 },
      'z'    : { attrib: 'position', index: 2 },

      'nx'   : { attrib: 'normal'  , index: 0 },
      'ny'   : { attrib: 'normal'  , index: 1 },
      'nz'   : { attrib: 'normal'  , index: 2 },

      's'    : { attrib: 'texCoord', index: 0 },
      't'    : { attrib: 'texCoord', index: 1 },

      'red'  : { attrib: 'color'   , index: 0 },
      'green': { attrib: 'color'   , index: 1 },
      'blue' : { attrib: 'color'   , index: 2 },
      'alpha': { attrib: 'color'   , index: 3 },
    };
  } 


  /**
   * Load and parse a PLY file asynchronously.
   * @param {string} file The path to the file.
   * @param {function} fn The callback function to handle the mesh data.
   */
  async load (file, fn) {
    // If loading, add task to the queue.
    if (this._isLoading) {
      this._filesToLoad.push([file, fn]);
      return;
    }

    const response = await fetch(file);

    if (!response.ok) {
      console.error('Error fetching ' + file);
      this._finishLoading();
      return;
    }

    // Get the response as an array buffer to handle both ascii and binary PLYs.
    const buffer = await response.arrayBuffer();
    
    const header = this._parseHeader(buffer);

    if (!header.valid) {
      console.error('Malformed data. Missing ply header: ' + file);
      this._finishLoading();
      return;
    }

    let [ vertices, faces ] = this._unpackData(buffer, header);
    vertices = this._unfoldVertices(vertices, header.vertexFormat);
    faces    = this._trimFaces(faces);

    const mesh = new Mesh(vertices, faces, { name: file });
    mesh.name = file;

    if (this._verbose) {
      console.log(`Loaded ${file} with ${vertices.length} vertices.`);
    }

    if (fn && typeof fn === 'function') {
      fn(mesh);
    }

    this._finishLoading();
  }


  /**
   * Flag that we are done loading and then check to queue of next files to
   * load.
   * @private
   */
  _finishLoading () {
    this._isLoading = false;
    if (this._filesToLoad.length) {
      this.load(...this._filesToLoad.shift());
    }
  }


  /**
   * Parse the plain text header from the array buffer.
   * @param {ArrayBuffer} buffer The array buffer representing the ply file. 
   * @returns {array<string>} The contents of the ply file as an array of 
   *    strings where each entry represents one line of text.
   * @private
   */
  _bufferToHeaderStrings (buffer) {
    const chars = new Uint8Array(buffer);
    const headerStrings = [];

    // The byte index of the current character.
    let charIndex = 0;
    let currentLine = '';

    while (charIndex < chars.length) {
      const charCode = chars[charIndex];

      if (charCode === this.RETURN) {
        headerStrings.push(currentLine);
        if (currentLine === this.END_HEADER) {
          break;
        }
        currentLine = '';
      } else {
        currentLine += String.fromCharCode(charCode);
      }
      charIndex++;
    }

    return headerStrings;
  }


  /**
   * Convert the PLY file buffer into a hash of header info that will tell us 
   * how to parse the rest of the file.
   * @param {array<string>} data The array of lines from
   * @return {object} A header object.
   * @private
   */
  _parseHeader (buffer) {
    const headerStrings = this._bufferToHeaderStrings(buffer);

    const header = {
      valid: false,
      format: null, 
      vertexCount: 0,
      vertexFormat: [],
      vertexStart: 0,
      bytesPerVertex: 0,
      totalVertexBytes: 0,
      faceCount: 0,
      faceFormat: [],
      faceStart: 0,
    };

    let headerByteLength = 0;
    let mode = 'vertex';

    for (const str of headerStrings) {
      
      // Track the byte length of the header. The extra 1 is for the return 
      // carriage which got trimmed already. 
      headerByteLength += str.length + 1;

      const values = str.split(' ');

      switch (values[0]) {
        case 'ply' :
          header.valid = true;
          break; 

        case 'format' : 
          header.format = values[1];
          break;
        
        case 'comment' :
          break;
        
        case 'element' : 
          if (values[1] === 'vertex') {
            header.vertexCount = parseInt(values[2]);
            mode = 'vertex';
          } else if (values[1] === 'face') {
            header.faceCount = parseInt(values[2]);
            mode = 'face';
          }
          break;
        
        case 'property' :
          if (mode === 'vertex') {
            const type = values[1], property = values[2];
            header.vertexFormat.push({ type, property });
            header.bytesPerVertex += this.PLY_TYPES[type].bytes;
          } else {
            header.faceFormat = values.slice(1);
          }
          break;
      }
    }

    header.vertexStart = headerByteLength;
    if (header.format === 'ascii') {
      // header.vertexStart += 1;
    }

    header.totalVertexBytes = header.vertexCount * header.bytesPerVertex;
    header.faceStart = header.vertexStart + header.totalVertexBytes;

    return header;
  }


  /**
   * Trim the first value from each array in the faces array. Because PLY is 
   * tightly packed, a face has to tell how many 
   */
  _trimFaces (faces) {
    return faces.map(face => face.slice(1));
  }


  /** 
   * Unfold the vertex data from a flat array to a structured object. 
   */
  _unfoldVertex (vertex, format) {
    const v = {};

    for (let i = 0; i < format.length; i++) {
      const property = format[i].property;
      const { attrib, index } = this.PLY_MAPPINGS[property];

      if (!v[attrib]) {
        v[attrib] = [];
      }

      v[attrib][index] = vertex[i];
    }
    return v;
  }


  /** 
   * Unfold all the vertices.
   */
  _unfoldVertices (vertices, format) {
    return vertices.map(vertex => this._unfoldVertex(vertex, format));
  }


  /**
   * Unpack the data from the ply file into a vertex and face array.
   * @param {*} buffer The PLY file buffer.
   * @param {*} header The parsed PLY header.
   * @returns 
   */
  _unpackData(buffer, header) {
    if (header.format === 'ascii') {
      return this._unpackDataAscii(buffer, header);
    }
    return this._unpackDataBinary(buffer, header);
  }


  /**
   * Unpack the the vertex and face data from the ply buffer in ascii (plain
   * text) mode.
   * @param {ArrayBuffer} byteArray The ply file buffer.
   * @param {object} header The parsed header meta data.
   */
  _unpackDataAscii (buffer, header) {
    const byteArray = new Uint8Array(buffer);
    
    const vertices = [];
    const faces = [];
    
    let currentValue = '';
    let currentArray = [];

    for (let i = header.vertexStart; i < byteArray.length; i++) {
      const charCode = byteArray[i];

      switch (charCode) {

        case this.SPACE:
          currentArray.push(Number(currentValue));
          currentValue = '';
          break;

        case this.RETURN:
          currentArray.push(Number(currentValue));
          currentValue = '';

          if (vertices.length < header.vertexCount) {
            vertices.push(currentArray)
          } else {
            faces.push(currentArray);
          }

          currentArray = [];
          break;

        default:
          currentValue += String.fromCharCode(charCode);
          break;
      }
    }

    return [ vertices, faces ];
  }


  /**
   * Unpack the the vertex and face data from the ply file. Binary mode.
   * @param {ArrayBuffer} buffer The array buffer of the file.
   * @param {object} header The parsed header structure.
   */
  _unpackDataBinary (buffer, header) {
    // A DataView lets us fetch any type from the buffer from any index.
    const view = new DataView(buffer);

    const { vertexFormat, faceFormat } = header;

    const littleEndian = (header.format === 'binary_little_endian');

    const vertices = [];
    const faces = [];

    /**
     * Local helper to unpack a slice of the buffer into one vertex.
     * @param {number} start The start index of the vertex. Vertices in PLY are 
     *     a fixed length so we only need 
     * @returns {array<number>} The attribute values for the vertex.
     */
    const unpackVert = (start) => {
      const vertex = [];
      let byteIndex = start;

      for (let { type } of vertexFormat) {
        const { bytes, getter } = this.PLY_TYPES[type];
        vertex.push(view[getter](byteIndex, littleEndian));
        byteIndex += bytes;
      }

      return vertex;
    }

    
    /**
     * Local helper to unpack a slice of the buffer into one vertex.
     * @param {number} start The start index of the vertex. Vertices in PLY are 
     *     a fixed length so we only need 
     * @returns {array<number>} The attribute values for the vertex.
     */
    const unpackFace = (start) => {
      const face = [];
      let bytesConsumed = 0;
      let byteIndex = start;

      const vertexCountType = this.PLY_TYPES[faceFormat[1]];
      const vertexIndexType = this.PLY_TYPES[faceFormat[2]];

      const vertexCount = view[vertexCountType.getter](byteIndex, littleEndian);
      face.push(vertexCount);

      bytesConsumed += vertexCountType.bytes;
      byteIndex += vertexCountType.bytes;

      for (let v = 0; v < vertexCount; v++) {
        const index = view[vertexIndexType.getter](byteIndex, littleEndian);
        face.push(index);
        bytesConsumed += vertexIndexType.bytes;
        byteIndex += vertexIndexType.bytes;
      }

      return { bytesConsumed, face };
    }

    for (let v = 0; v < header.vertexCount; v++) {
      const start = header.vertexStart + v * header.bytesPerVertex;
      vertices.push(unpackVert(start));
    }
    
    let faceStartIndex = header.faceStart;
    for (let f = 0; f < header.faceCount; f++) {
      const { bytesConsumed, face } = unpackFace(faceStartIndex);
      faces.push(face);
      faceStartIndex += bytesConsumed;
    }

    return [vertices, faces];
  }
}