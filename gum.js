var GUM3D = (function (exports) {
  'use strict';

  /**
   * @file Provide math utilities.
   */


  /**
   * Clamp a value between min and max.
   * @param {number} x The value. 
   * @param {number} min The min. Default 0.
   * @param {number} max The max. Default 1.
   * @returns {number} The clamped value.
   * @global
  */
  function clamp (x, min = 0, max = 1) {
    return Math.min(Math.max(x, min), max);
  }


  /**
   * Linear interpolate 2 numbers.
   * @param {number} a The first number.
   * @param {number} b The second number.
   * @param {number} fac The factor. Default 0.5.
   * @returns {number} The lerped number.
   * @global
   */
  function lerp (a, b, fac = 0.5) {
    fac = clamp(fac);
    return b * fac + (1 - fac) * a;
  }


  /**
   * Remap a value from an input range to an output range.
   * @param {number} x The value.
   * @param {number} min Minimum of the input range.
   * @param {number} max Maximum of the input range.
   * @param {number} outMin Minimum of the output range.
   * @param {number} outMax Maximum of the output range.
   * @returns {number} The remapped number.
   * @global
   */
  function remap (x, min, max, outMin = 0, outMax = 1) {
    return clamp((x - min) / (max - min)) * (outMax - outMin) + outMin;
  }

  /**
   * Get a random value between 0 and 1 value or between 2 numbers.
   * @param {number} a The min.
   * @param {number} b The max.
   * @returns {number} The random number.
   * @global
   */
  function random(a = 1, b) {
    if (b === undefined) {
      b = a;
      a = 0;
    }

    return a + (Math.random() * (b - a));
  }


  /**
   * Convert a number from radians to degrees.
   * @param {number} radians 
   * @returns {number}
   */
  function degrees (radians) {
    return 180 * radians / Math.PI;
  }


  /**
   * Convert a number from degrees to radians.
   * @param {number} degrees 
   * @returns {number}
   */
  function radians (degrees) {
    return Math.PI * degrees / 180;
  }


  function generateId() {
    let id = '';
    for (let i = 0; i < 4; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }

  var common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clamp: clamp,
    degrees: degrees,
    generateId: generateId,
    lerp: lerp,
    radians: radians,
    random: random,
    remap: remap
  });

  /**
   * @file Dom utilities.
   */


  /**
   * Proxy for document.querySelector.
   * @param {string} tag A selector.
   * @returns {HTMLElement|false}
   */
  function select (tag) {
    if (tag instanceof HTMLElement) {
      return tag;
    }
    const elem = document.querySelector(tag);
    if (!elem) { return false;}
    return elem;
  }


  /**
   * Proxy for document.createElement with some extra utility for adding ids and 
   * classes.
   * @param {string} tag The tag to make. Examples: 'a', 'div.container',
   *     'p#bio.large-text.red', or 'p #bio .large-text .red'.
   * @param {object} styleObject 
   * @returns {HTMLElement}
   */
  function tag (string, styleObject) {
    const tag = string.split(/#|\./)[0].trim();
    const elem = document.createElement(tag);

    const idRegEx = /#(\w|-)+/g;
    const id = string.match(idRegEx);
    if (id) {
      elem.id = id[0].replace('#', '');
    }

    const classRegEx = /\.(\w|-)+/g;
    const classList = string.match(classRegEx);
    if (classList) {
      classList.forEach((x) => elem.classList.add(x.replace('.', '')));
    }

    if (styleObject) { style(elem, styleObject); }  return elem;
  }


  /**
   * Apply styles from a js object to an element.
   * @param {HTMLElement} elem The html element.
   * @param {object} styleObject The style object – with keys is either js 
   *     camelCase form or string wrapped 'background-color' css form.
   */
  function style (elem, styleObject) {
    for (const property in styleObject) {
      elem.style[property] = styleObject[property];
    }
  }

  var dom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    select: select,
    style: style,
    tag: tag
  });

  const SimpleColorDict = {
    burgundy: '#5e183b',
    raspberry: '#b7274d',
    red: '#e54127',
    orange: '#ff8c00',
    mango: '#ffc20e',
    lime: '#d8eb27',
    forest: '#003c38',
    vert: '#006922',
    turquoise: '#007b82',
    blue: '#2311e4',
    sky: '#78c5f8',
    mint: '#b2e1d2',
    lilac: '#bdbdf7',
    rose: '#f892c5',
    sand: '#e8e1d6',
    melon: '#f3c1aa',
    ginger: '#cd9a62',
    chocolate: '#945526',
    black: '#000000',
    gray: '#b8bbb5',
    white: '#f6f2eA',
  };

  const ColorDict = SimpleColorDict;

  const containerStyle = {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    bottom: 0,
    left: 0,
    zIndex: 10, 
  };

  const swatchStyle = {
    width: '24px',
    height: '24px',
  };

  function ColorSwatch (color) {

    let container = select('#swatches');
    if (!container) {
      container = tag('div#swatches.gum-swatches', containerStyle);
      const panel = select('.gum-panel');
      if (panel) {
        panel.append(container);
      }
    }

    const swatch = tag('div.swatch', swatchStyle);
    style(swatch, { backgroundColor: color });
    container.append(swatch);
    return swatch;
  }

  /**
   * @file Color management.
   */

  /* I like default black, but default white is arguably more useful. */
  const defR = 0; const defG = 0; const defB = 0; const defA = 1;


  /**
   * Color class with rgb and hsl state. Ideally colors are not mutable. To 
   * get a new color, create a new color. 
   */
  class Color {
    /** 
     * Construct a Color from normalized rgba values. In general, API usage should 
     * discourage calling 'new Color()' and should rely on the color() generator.
     */
    constructor (r, g, b, a) {
      this._r = r ?? defR;
      this._g = g ?? defG;
      this._b = b ?? defB;
      this._a = a ?? defA;
      this._hsl = rgbToHsl(this._r, this._g, this._b);

      ColorSwatch(this.rgbString());
    }
    
    get r    () { return this._r }; 
    get g    () { return this._g }; 
    get b    () { return this._b }; 
    get a    () { return this._a }; 

    get rgb  () { return [this._r, this._g, this._b]; }
    get rgba () { return [this._r, this._g, this._b, this._a]; }
    
    get h    () { return this._hsl[0]; }
    get s    () { return this._hsl[1]; }
    get l    () { return this._hsl[2]; }

    get hsl  () { return this._hsl; }
    get hsla () { return [...this._hsl, this._a]; }


    /**
     * Get the CSS-ready rgb or rgba string representation of this color.
     * @returns {string}
     */
    rgbString () {
      const r255 = Math.round(this._r * 255);
      const g255 = Math.round(this._g * 255);
      const b255 = Math.round(this._b * 255);
      if (this._a === 1) {
        return `rgb(${r255}, ${g255}, ${b255})`;
      }
      return `rgba(${r255}, ${g255}, ${b255}, this._a)`;
    }


    /**
     * Get the CSS-ready hsl or hsla string representation of this color.
     * @returns {string}
     */
    hslString () {
      const h360 = Math.round(this.h);
      const s100 = Math.round(this.s * 100);
      const l100 = Math.round(this.s * 100);
      if (this._a === 1) {
        return `hsl(${h360}, ${s100}, ${l100})`;
      }
      return `hsla(${h360}, ${s100}, ${l100}, this._a)`;
    }

    /**
     * Blend this color with other by amount using mode. 
     * 
     */
    blend (other, amt = 0.5, mode = 'RGB') {
      return blend(this, other, amt, mode);
    }

    /**
     * Hue shift
     * @param {number} amt The amount of hue shift in degrees.
     * @returns {Color} A new color object.
     */ 
    shiftHue (amt) {
      return new Color(...hslToRgb(this.h + amt, this.s, this.l, this.a));
    }

    lighten (amt) {
      return new Color(...hslToRgb(this.h, this.s, this.l + amt, this.a));
    }

    saturate (amt) {
      return new Color(...hslToRgb(this.h, this.s + amt, this.l, this.a));
    }
  }


  /**
   * Create a new color. Accepts a hex value, an rgb(r255, g255, b255) string,
   * an hsl(h360, s100, l100) string, an array of 3 or 4 rgba[0->1] values, spread 
   * out versions of those values, or an existing color object. If no params 
   * passed get a random color.
   * @param {string} color The color.
   * @returns {Color}
   */
  function color (...args) {

    if (args.length === 0) {
      return new Color(Math.random(), Math.random(), Math.random());
    }
    
    // 3 or more numbers were passed.
    if (validColorArray(args)) {
      return new Color(...args);
    }

    // 3 or more numbers were passed as an array.
    if (validColorArray(args[0])) {
      return new Color(...args[0]);
    }

    let col = args[0];
    if (col instanceof Color) {
      return new Color(col.r, col.g, col.g, col.a);
    }

    // Look for a named color.
    if (ColorDict[col]) { col = ColorDict[col]; }

    switch (colorFormat(col)) {
      case 'HEX' :
        return new Color(...hexToRgb(col, true));
      
      case 'RGB' : 
        return new Color(...strToRgb(col, true));
      
      case 'HSL' :
        return new Color(hslToRgb(...strToHsl(col, true)));
    }

    return new Color(Math.random(), Math.random(), Math.random());
  }



  /**
   * Check if an array is a valid array of parse-able numbers with at least three
   * values.
   * @param {array} arr An array of potential color values. 
   * @returns {boolean} Whether the array is valid.
   */
  function validColorArray (arr) {
    if (Array.isArray(arr) && arr.length >= 3 ) {
      return arr.every(x => x !== '' && !isNaN(Number(x)));
    }
    return false;
  }


  /**
   * Get the color format from a string.
   * @param {string} str The input color string. 
   * @returns {string} 'HEX' | 'RGB' | 'HSL'.
   */
  function colorFormat (str) {
    if (str.indexOf('#') === 0) {
      return 'HEX';
    } else if (str.indexOf('rgb') === 0) {
      return 'RGB';
    } else if (str.indexOf('hsl') === 0) {
      return 'HSL';
    }
  }


  /**
   * Get all the numbers out of a color string.
   * @param {string} str An rgb or hsl string.
   * @returns {array<number>}
   */
  function extractNumbers (str) {
    const parts =  str.replace(/[^0-9|\.]+/g, '-').split('-');
    const numbers = [];
    for (let part of parts) {
      if (part === '') continue;
      const n = Number(part);
      if (!isNaN(n)) numbers.push(n);
    }
    return numbers;
  }


  /**
   * Get rgb values from a string.
   * @param {string} str An rgb string.
   * @param {boolean} normalized If true return components in the [0->1] range. If
   *     not leave them in rgb[0->255].
   * @returns {array<number>}
   */
  function strToRgb (str, normalized = true) {
    if (str.indexOf('rgb') === -1) { return [defR, defG, defB]; }
    
    const numbers = extractNumbers(str);
    if (numbers.length < 3) { return [defR, defG, defB]; }

    const m = normalized ? 1 / 255  : 1;
    const color = [
      numbers[0] * m,
      numbers[1] * m,
      numbers[2] * m,
    ];
    if (numbers[3] !== undefined) {
      color.push(numbers[3]);
    }
    return color;
  }


  /**
   * Get hsl values from a string.
   * @param {string} str An hsl string.
   * @param {boolean} normalized If true return components in h[0->360] sl[0->1] 
   *     range. If not leave them in h[0->360] sl[0->100].
   * @returns {array<number>}
   */
  function strToHsl (str, normalized = true) {
    if (str.indexOf('hsl') === -1) { return [0, 0, 0]; }
    
    const numbers = extractNumbers(str);
    if (numbers.length < 3) { return [0, 0, 0]; }

    const m = normalized ? 1 / 100  : 1;
    const color = [ 
      numbers[0],
      numbers[1] * m,
      numbers[2] * m,
    ];
    if (numbers[3] !== undefined) {
      color.push(numbers[3]);
    }
    return color;
  }


  /**
   * Get rgb values from a hex string.
   * @param {string} str An hex string.
   * @param {boolean} normalized If true return components in the [0->1] range. If
   *     not leave them in rgb[0->255].
   * @returns {array<number>}
   */
  function hexToRgb (hex, normalized = true) {
    const h = hex.slice(1);
    const m = normalized ? (1/ 255) : 1;
    const parse = v => m * parseInt(v, 16);

    if (h.length === 3) {
      return [
        parse(h[0] + h[0]),
        parse(h[1] + h[1]),
        parse(h[2] + h[2])
      ];
    }

    if (h.length === 6) {
      return [
        parse(h[0] + h[1]),
        parse(h[2] + h[3]),
        parse(h[4] + h[5])
      ];
    }

    if (h.length === 8) {
      return [
        parse(h[0] + h[1]),
        parse(h[2] + h[3]),
        parse(h[4] + h[5]),
        parse(h[6] + h[7])
      ];
    }

    return [defR, defG, defB];
  }


  /** 
   * Convert hsl values to an rgb array.
   * @param {number} h Hue in the 0->360 range.
   * @param {number} s Saturation in the 0->1 range.
   * @param {number} l Lightness in the 0->1 range.
   * @return {array} Normalized RGB color array.
   */
  function hslToRgb (h = 0, s = 0, l = 0, a = 1) {
    // Validate hsv.
    h = (h + 360) % 360;
    s = Math.max(Math.min(s, 1), 0);
    l = Math.max(Math.min(l, 1), 0);

    // Chroma.
    const c = (1 - Math.abs(2 * l - 1)) * s;

    // Piecewise hue.
    const h1 = h / 60;

    // Using the temporary value (x), map r, g, and b at a particular chroma.
    const x = c * (1 - Math.abs((h1 % 2) - 1));
    let r, g, b;

    if (h1 < 1) {
      r = c; g = x; b = 0;
    } else if (h1 < 2) {
      r = x; g = c; b = 0;
    } else if (h1 < 3) {
      r = 0; g = c; b = x;
    } else if (h1 < 4) {
      r = 0; g = x; b = c;
    } else if (h1 < 5) {
      r = x; g = 0; b = c;
    } else if (h1 <= 6) {
      r = c; g = 0; b = x;
    }
    
    // Apply the lightness 
    const m = l - (c / 2);
    return [r + m, g + m, b + m, a];
  }


  /** 
   * Convert rgb values to an hsl array.
   * @param {number} r red in the 0->1 range.
   * @param {number} g green in the 0->1 range.
   * @param {number} b blue in the 0->1 range.
   * @return {array} HSL color array.
   */
  function rgbToHsl (r = 0, g = 0, b = 0, a = 1) {
    // Validate rgb.
    r = Math.min(Math.max(r, 0), 1);
    g = Math.min(Math.max(g, 0), 1);
    b = Math.min(Math.max(b, 0), 1);

    // Min and max components let us calculate chroma.
    const xMax = Math.max(r, g, b);
    const xMin = Math.min(r, g, b);

    // Value.
    const v = xMax;
    
    // Chroma.
    const c = xMax - xMin;

    // Lightness.
    const l = (xMax + xMin) / 2;

    let h = 0;
    if (c === 0) {
      h = 0;
    } else if (v === r) {
      h = 60 * (0 + (g - b) / c);
    } else if (v === g) {
      h = 60 * (2 + (b - r) / c);
    } else if (v === b) {
      h = 60 * (4 + (r - g) / c);
    }

    let s = 0;
    if (l > 0 && l < 1) {
      s = (v - l) / (Math.min(l, 1 - l));
    }

    return [h, s, l, a];
  }


  /**
   * Check if an object is an instance of Color.
   */ 
  function isColor (any) {
    return (any instanceof Color);
  }

  /**
   * Blend two colors – src and target - by amount using mode. 
   * @param {Color} src The source color.
   * @param {Color} target The target color.
   * @param {number} amt The 0->1 blend amount.
   * @param {string} mode The blend space. 'RGB' or 'HSL'.
   * @return {Color}
   */
  function blend (src, target, amt = 0.5, mode = 'RGB') {
    switch (mode.toUpperCase()) {
      case 'RGB' : 
        return _blendRgb(src, target, amt);

      case 'HSL' :
        return _blendHSL(src, target, amt);
    }
  }



  function _blendRgb (src, target, amt = 0.5) {
    if (!isColor(src) || !isColor(target)) {
      return new Color();
    }

    amt *= target.a;

    const r = lerp(src.r, target.r, amt);
    const g = lerp(src.g, target.g, amt);
    const b = lerp(src.b, target.b, amt);
    return new Color(r, g, b, src.a);
  }


  function _blendHSL (src, target, amt = 0.5) {
    if (!isColor(src) || !isColor(target)) {
      return new Color();
    }

    amt *= target.a;

    const h= lerp(src.h, target.h, amt);
    const s = lerp(src.s, target.s, amt);
    const l = lerp(src.l, target.l, amt);
    return new Color(...hslToRgb(h, s, l, src.a));
  }

  /**
   * The available shaders. File created by bundleShaders.js.
   * To edit shaders, edit the source and re-bundle.
   */

  const shaders = {
    "default": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nin vec4 vColor;\nout vec4 fragColor;\n\nvoid main() {\nfragColor = vec4(vColor.rgb, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nin vec4 aPosition;\nin vec4 aColor;\n\nout vec4 vColor;\n\nvoid main()\n{\nmat4 modelView = uView * uModel;\ngl_Position = uProjection * uView * uModel * vec4(aPosition.xyz, 1.0);\nvColor = aColor;\n}"
    },
    "geo": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform vec3 uEye;\nuniform vec4 uColor;\n\nin vec4 vWorldPosition;\nin vec4 vColor;\nin vec3 vWorldNormal;\nin vec3 vViewNormal;\nin vec3 vSurfaceId;\nin float vDepth;\nin float vId;\n\nout vec4 fragColor;\n\nvoid main() {\nvec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));\nfloat nDotL = clamp(dot(vWorldNormal, lightDir), 0.0, 1.0);\nfloat light = clamp(smoothstep(0.1, 0.4, nDotL) + 0.2, 0.0, 1.0);\nfloat nDotV = dot(vViewNormal, vec3(0.0, 0.0, 1.0));\n\nfragColor = vec4(vId, nDotV, nDotL, 1.0);\n\n// fragColor = vec4(vec3(light), 1.0);\n\nfragColor = vec4(vViewNormal * 0.5 + 0.5, 1.0);\nfragColor = vec4(vSurfaceId, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\nuniform float uNear;\nuniform float uFar;\nuniform float uObjectId;\nuniform float uAspect;\n\nin vec4 aPosition;\nin vec4 aColor;\n\nin vec4 aNormal;\nin float aSurfaceId;\n\nout vec4 vWorldPosition;\nout vec4 vColor;\nout vec3 vWorldNormal;\nout vec3 vViewNormal;\nout vec3 vSurfaceId;\nout float vDepth;\nout float vId;\n\n/**\n*\n*/\nvec3 hashId(float id) {\nfloat r = fract(mod(id * 25738.32498, 456.221));\nfloat g = fract(mod(id * 565612.08321, 123.1231));\nfloat b = fract(mod(id * 98281.32498, 13.221));\nreturn vec3(r, g, b);\n}\n\n\n/**\n*\n*/\nvoid main() {\ngl_PointSize = 20.0;\nmat4 modelView = uView * uModel;\nmat3 normMatrix = transpose(inverse(mat3(modelView)));\nvViewNormal = normalize(normMatrix * aNormal.xyz);\nvWorldNormal = normalize(mat3(uModel) * aNormal.xyz);\nvColor = aColor;\n\ngl_Position = uProjection * uView * uModel * aPosition;\n\nvec3 rounded = round(gl_Position.xyz * 20.0) / 20.0;\n// gl_Position.xyz = rounded;\n\nfloat id = mod(aSurfaceId + uObjectId, 255.0);\nvId = id / 255.0 + (1.0 / 255.0);\n\nvSurfaceId = hashId(aSurfaceId + uObjectId);\n\nvWorldPosition = uModel * aPosition;\n}"
    },
    "line": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform vec3 uEye;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main () {\nfragColor = vColor;\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uNear;\nuniform float uFar;\nuniform float uAspect;\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec4 aColor;\nin vec4 aRegister1; // .xyz is previous\nin vec4 aRegister2; // .xyz is next\nin vec3 aNormal;    // .x is thickness\n// .y is orinetation\n\nout vec4 vColor;\n\n\n/**\n*\n*/\nvoid main () {\nmat4 mvp = uProjection * uView * uModel;\nvec2 aspect = vec2(uAspect, 1.0);\n\nfloat thickness = aNormal.x;\nfloat orientation = aNormal.y;\n\nvec4 current = mvp * vec4(aPosition.xyz, 1.0);\nvec4 previous = mvp * vec4(aRegister1.xyz, 1.0);\nvec4 next = mvp * vec4(aRegister2.xyz, 1.0);\n\n\n// could use z component to scale by distance.\nvec2 currentScreen = current.xy / current.w * aspect;\nvec2 previousScreen = previous.xy / previous.w * aspect;\nvec2 nextScreen = next.xy / next.w * aspect;\n\nvec2 lineDir = vec2(0.0);\n\nif (currentScreen == previousScreen) {\nlineDir = normalize(nextScreen - currentScreen);\n}\nelse if (currentScreen == nextScreen) {\nlineDir = normalize(currentScreen - previousScreen);\n}\nelse {\nvec2 dirA = normalize(currentScreen - previousScreen);\nif (orientation == 1.0) {\nvec2 dirB = normalize(nextScreen - currentScreen);\n\nvec2 tangent = normalize(dirA + dirB);\nvec2 perp = vec2(-dirA.y, dirA.x);\nvec2 miter = vec2(-tangent.y, tangent.x);\n\nlineDir = tangent;\nthickness = thickness / dot(miter, perp);\n\nthickness = clamp(thickness, 0.0, aNormal.x * 3.0);\n\n} else {\nlineDir = dirA;\n}\n}\n\nvec2 normal = vec2(-lineDir.y, lineDir.x) * thickness * 0.5;\nnormal.x /= uAspect;\n\nvec4 offset = vec4(normal * orientation, 0.0, 0.0);\n\ngl_Position = current + offset;\nvColor = aColor;\n}"
    },
    "line2": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform vec3 uEye;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main () {\nfragColor = vColor;\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uNear;\nuniform float uFar;\nuniform float uAspect;\nuniform float uObjectId;\nuniform vec2 uScreenSize;\n\nin vec3 aPosition;\nin vec4 aColor;\nin vec4 aRegister1; // .xyz is next\nin vec3 aNormal;    // .x is thickness\n// .y is corner index\n\nout vec4 vColor;\n\n\n/**\n*\n*/\nvoid main () {\nmat4 mvp = uProjection * uView * uModel;\n\nfloat thickness = aNormal.x;\nfloat orientation = aNormal.y;\n\n// Calculate the screen space\nvec4 current = mvp * vec4(aPosition.xyz, 1.0);\nvec4 next = mvp * vec4(aRegister1.xyz, 1.0);\n\nvec2 currentScreen = current.xy / current.w;\nvec2 nextScreen = next.xy / next.w;\n\nvec2 lineDir = normalize(nextScreen - currentScreen);\nvec2 normal = vec2(-lineDir.y, lineDir.x);\n\nfloat persp = current.w;\nif (orientation > 1.5) {\npersp = next.w;\n}\n\nvec2 offset = persp * thickness * normal / uScreenSize;\nvec2 extension = 0.25 * persp * thickness * lineDir / uScreenSize;\n\nif (orientation < 1.0) {\n\ncurrent.xy += -offset - extension;\ngl_Position = current;\n\n} else if (orientation < 2.0) {\n\ncurrent.xy += +offset - extension;\ngl_Position =  current;\n\n} else if (orientation < 3.0) {\n\nnext.xy += -offset + extension;\ngl_Position = next;\n\n} else {\n\nnext.xy += +offset + extension;\ngl_Position = next;\n\n}\nvColor = aColor;\n}"
    },
    "lit": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nin vec4 vColor;\nin vec3 vNormal;\n\nout vec4 fragColor;\n\nvoid main() {\nif (!gl_FrontFacing) {\nfragColor = vec4(1.0, 0.0, 0.0, 1.0);\nreturn;\n}\n\nvec3 l = normalize(vec3(1.0, 1.0, 1.0));\nfloat ndotl = dot(normalize(vNormal), l);\n\nndotl = ndotl * 0.5 + 0.5;\nndotl *= ndotl;\n\nndotl += 0.3;\nndotl = clamp(ndotl, 0.0, 1.0);\n\n\nfragColor = vec4(vColor.rgb * ndotl, 1.0);\n\n\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec3 aNormal;\nin vec4 aColor;\nin vec4 aRegister1;\nin float aSurfaceId;\n\nout vec4 vColor;\nout vec3 vNormal;\n\nvoid main()\n{\nvec4 pos = aPosition;\npos.xyz += aRegister1.xyz;\ngl_Position = uProjection * uView * uModel * pos;\nmat3 normMatrix = transpose(inverse(mat3(uView * uModel)));\nvColor = aColor;\nvNormal = transpose(inverse(mat3(uModel))) * aNormal;\n}"
    },
    "noise": {
      "glsl": "float rand (float n) {\nreturn fract(sin(n) * 43748.5453123);\n}\n\nfloat rand (vec2 n) {\nreturn fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nfloat bnoise (float p) {\nfloat pInt = floor(p);\nfloat pFract = fract(p);\nreturn mix(rand(pInt), rand(pInt + 1.0), pFract);\n}\n\nfloat bnoise (vec2 p) {\nvec2 d = vec2(0.0, 1.0);\nvec2 b = floor(p);\nvec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(p));\nreturn mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n}"
    },
    "post-bloom": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\n// Defualt uniforms.\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\n\n// Custom uniforms.\nuniform float uKernel;\nuniform float uDist;\nuniform float uWeight;\nuniform float uThreshold;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat brightness (vec3 col) {\n  return dot(col, vec3(0.2126, 0.7152, 0.0722));\n}\n\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\n\nvec3 accum = vec3(0.0);\nvec3 weightSum = vec3(0.0);\n\nvec2 pix = vec2(uDist, uDist) / uScreenSize;\n\nfor (float i = -uKernel; i <= uKernel; i++) {\nfor (float j = -uKernel; j <= uKernel; j++) {\nvec2 sampleCoord = vTexCoord + (vec2(i, j) * pix);\n\n\nvec4 sampleCol = texture(uMainTex, sampleCoord);\nfloat mask = step(uThreshold, brightness(sampleCol.rgb));\n\n\naccum += sampleCol.rgb * mask * uWeight;\n\nweightSum += uWeight;\n}\n}\n\nvec3 avg = accum / weightSum;\n\n\n\nfragColor = col;\nfragColor.rgb += avg;\nfloat mask = step(uThreshold, brightness(col.rgb));\n\n// fragColor = vec4(vec3(mask), 1.0);\nfragColor = vec4(avg, 1.0);\n\n\n}"
    },
    "post-blur": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\n// Defualt uniforms.\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\n\n// Custom uniforms.\nuniform float uKernel;\nuniform float uDist;\nuniform float uWeight;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\n\nvec3 accum = vec3(0.0);\nvec3 weightSum = vec3(0.0);\n\nvec2 pix = vec2(uDist, uDist) / uScreenSize;\n\n\n\nfor (float i = -uKernel; i <= uKernel; i++) {\nfor (float j = -uKernel; j <= uKernel; j++) {\nvec2 sampleCoord = vTexCoord + (vec2(i, j) * pix);\naccum += texture(uMainTex, sampleCoord).rgb * uWeight;\nweightSum += uWeight;\n}\n}\n\nvec3 avg = accum / weightSum;\n\n\nfragColor = vec4(avg, 1.0);\n\n}"
    },
    "post-chromatic": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\nuniform float uNear;\nuniform float uFar;\n\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\nvec2 rOff = vec2(0.0, 4.0);\nvec2 gOff = vec2(0.0, 0.0);\nvec2 bOff = vec2(4.0, 0.0);\nvec2 pixelSize = 1.0 / uScreenSize;\nvec4 col = texture(uMainTex, vTexCoord);\n\nfragColor = col;\nfloat r = texture(uMainTex, vTexCoord + (pixelSize * rOff)).r;\nfloat g = texture(uMainTex, vTexCoord + (pixelSize * gOff)).g;\nfloat b = texture(uMainTex, vTexCoord + (pixelSize * bOff)).b;\n\nfragColor.rgb = vec3(r, g, b);\n\n// vec2 uv = vTexCoord;\n// uv *= 1.0 - uv.xy;\n\n// float vig = uv.x * uv.y * 15.0;\n\n// vig = pow(vig, 0.03);\n\n// fragColor.rgb *= vig;\n}"
    },
    "post-chromatic2": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nfloat rand (float n) {\n  return fract(sin(n) * 43748.5453123);\n}\n\nfloat rand (vec2 n) {\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nfloat bnoise (float p) {\n  float pInt = floor(p);\n  float pFract = fract(p);\n  return mix(rand(pInt), rand(pInt + 1.0), pFract);\n}\n\nfloat bnoise (vec2 p) {\n  vec2 d = vec2(0.0, 1.0);\n  vec2 b = floor(p);\n  vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(p));\n  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n}\n\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\nuniform float uNear;\nuniform float uFar;\n\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\n\nvec2 rOff = vec2(bnoise(col.x * 2.0), bnoise(col.y * 5.0));\nvec2 gOff = vec2(bnoise(col.y * -6.3), bnoise(col.z * 300.0));\nvec2 bOff = vec2(bnoise(col.z * -6.3), bnoise(col.x * 1.4));\nvec2 pixelSize = 1.0 / uScreenSize;\n\nfragColor = col;\nfloat r = texture(uMainTex, vTexCoord + (pixelSize * rOff)).r;\nfloat g = texture(uMainTex, vTexCoord + (pixelSize * gOff)).g;\nfloat b = texture(uMainTex, vTexCoord + (pixelSize * bOff)).b;\n\nfragColor.rgb = vec3(r, g, b);\n\n// vec2 uv = vTexCoord;\n// uv *= 1.0 - uv.xy;\n\n// float vig = uv.x * uv.y * 15.0;\n\n// vig = pow(vig, 0.03);\n\n// fragColor.rgb *= vig;\n}"
    },
    "post-color-overlay": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\n// Defualt uniforms.\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\n\n// Custom uniforms.\nuniform vec4 uBlendColor;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\nfragColor = col;\nfragColor.rgb = mix(col, uBlendColor, uBlendColor.a).rgb;\n}"
    },
    "post-depth-fade": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\nuniform float uNear;\nuniform float uFar;\nuniform float uStart;\nuniform float uEnd;\n\n\nuniform vec4 uBlendColor;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat linearDepth(float d, float near, float far) {\nfloat z = d * 2.0 - 1.0;\nreturn (2.0 * near * far) / (far + near - d * (far - near)) / far;\n}\n\n\nvoid main() {\nfloat depth = texture(uDepthTex, vTexCoord).r;\nfloat lDepth = linearDepth(depth, uNear, uFar);\nfloat m = smoothstep(uStart, uEnd, lDepth * (uFar - uNear) + uNear);\nvec4 col = texture(uMainTex, vTexCoord);\nfragColor = col;\nfragColor.rgb = mix(col.rgb, uBlendColor.rgb, m * uBlendColor.a);\n}"
    },
    "post-dither": {
      "frag": "#version 300 es\nprecision mediump float;\n\n// Defualt uniforms.\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\n\n// Custom uniforms.\nuniform vec4 uColorA;\nuniform vec4 uColorB;\n\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat rand (float n) {\n  return fract(sin(n) * 43748.5453123);\n}\n\nfloat rand (vec2 n) {\n  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nfloat bnoise (float p) {\n  float pInt = floor(p);\n  float pFract = fract(p);\n  return mix(rand(pInt), rand(pInt + 1.0), pFract);\n}\n\nfloat bnoise (vec2 p) {\n  vec2 d = vec2(0.0, 1.0);\n  vec2 b = floor(p);\n  vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(p));\n  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n}\n\nconst int[64] BAYER64 = int[](\n0, 32, 8, 40, 2, 34, 10, 42,    /* 8x8 Bayer ordered dithering */\n48, 16, 56, 24, 50, 18, 58, 26, /* pattern. Each input pixel */\n12, 44, 4, 36, 14, 46, 6, 38,   /* is scaled to the 0..63 range */\n60, 28, 52, 20, 62, 30, 54, 22, /* before looking in this table */\n3, 35, 11, 43, 1, 33, 9, 41,    /* to determine the action. */\n51, 19, 59, 27, 49, 17, 57, 25,\n15, 47, 7, 39, 13, 45, 5, 37,\n63, 31, 55, 23, 61, 29, 53, 21\n);\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\nfloat brightness = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));\n\nvec2 xy = vTexCoord * uScreenSize;\n\nint x = int(mod(xy.x, 8.0));\nint y = int(mod(xy.y, 8.0));\n\nfloat n = float(BAYER64[y * 8 + x]);\n\nbrightness += (bnoise(vTexCoord * uScreenSize) * 2.0 - 1.0) * 0.0;\n\nfloat pix = step(n, brightness * 63.0);\n\n\nvec3 rgb = mix(uColorB.rgb,  uColorA.rgb, pix);\nfragColor = vec4(rgb, 1.0);\n// fragColor = vec4(vec3(noise), 1.0);\n\n// fragColor = vec4(gl_FragCoord.xy / uScreenSize, 0.0, 1.0);\n\n}"
    },
    "post-outline": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\nuniform float uNear;\nuniform float uFar;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat linearDepth(float d, float near, float far) {\nfloat z = d * 2.0 - 1.0;\nreturn (2.0 * near * far) / (far + near - d * (far - near)) / far;\n}\n\nvec4 gradient(sampler2D tex, vec2 coord) {\nvec2 offset = vec2(1.0, 1.0) / uScreenSize;\n\nvec4 xSum = vec4(0.0);\nvec4 ySum = vec4(0.0);\n\nxSum += texture(tex, coord + vec2(-offset.x, 0.0)) * -1.0;\nxSum += texture(tex, coord + vec2(+offset.x, 0.0));\n\nySum += texture(tex, coord + vec2(0.0, -offset.y)) * -1.0;\nySum += texture(tex, coord + vec2(0.0, +offset.y));\n\nreturn sqrt(xSum * xSum + ySum * ySum);\n}\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\nfloat depth = texture(uDepthTex, vTexCoord).r;\nfloat lDepth = linearDepth(depth, uNear, uFar);\n\nvec4 colGrad = gradient(uMainTex, vTexCoord);\nvec4 depthGrad = gradient(uDepthTex, vTexCoord);\n\nfloat idQ = mix(colGrad.r, 0.0, smoothstep(0.0, 0.3, lDepth));\n\nfloat idEdge = step(0.0001, colGrad.x);\n\nfloat depthQ = mix(0.0, 100.0, smoothstep(0.0, 0.01, col.g));\n\nfloat depthEdge = step(0.01, depthGrad.r);\n\nfloat normEdge = step(0.3, colGrad.g);\n\nfloat edge = max(idEdge, depthEdge);\n\nvec3 grad = vec3(idEdge, depthEdge, 0.0);\n\nfloat fog = smoothstep(4.0, 40.0, lDepth * (uFar - uNear));\n\n// float surfaceId = round(col.r * 20.0);\nfragColor.rgb = mix(vec3(0.2, 0.2, 0.2), vec3(0.6, 0.5, 0.5), 1.0 - fog);\n// fragColor.rgb *= 1.0 - ((1.0 - fog) * edge);\n// fragColor.a = 1.0;\n\nfragColor = vec4(vec3(edge * 0.4 + 0.1), 1.0);\n\n// fragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\n// fragColor = vec4(mix(vec3(1.0, 1.0, 0.2), vec3(0.1, 0.1, 0.1), edge), 1.0);\n\n// fragColor = vec4(1.0, 0.0, 0.0, 1.0);\n// fragColor = vec4(vec3(idEdge), 1.0);\n// fragColor = vec4(colGrad.ggg, 1.0);\n// fragColor = vec4(1.0, 0.0, 1.0, 1.0);\n// fragColor = vec4(vec3(fog), 1.0);\n\n}"
    },
    "post-outline2": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\nuniform float uNear;\nuniform float uFar;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat linearDepth(float d, float near, float far) {\nfloat z = d * 2.0 - 1.0;\nreturn (2.0 * near * far) / (far + near - d * (far - near)) / far;\n}\n\nvec4 gradient(sampler2D tex, vec2 coord) {\nvec2 offset = vec2(1.0, 1.0) / uScreenSize;\n\nvec4 xSum = vec4(0.0);\nvec4 ySum = vec4(0.0);\n\nxSum += texture(tex, coord + vec2(-offset.x, 0.0)) * -1.0;\nxSum += texture(tex, coord + vec2(+offset.x, 0.0));\n\nySum += texture(tex, coord + vec2(0.0, -offset.y)) * -1.0;\nySum += texture(tex, coord + vec2(0.0, +offset.y));\n\nreturn sqrt(xSum * xSum + ySum * ySum);\n}\n\nvoid main() {\nvec4 col = texture(uMainTex, vTexCoord);\nfloat depth = texture(uDepthTex, vTexCoord).r;\nfloat lDepth = linearDepth(depth, uNear, uFar);\n\nvec4 colGrad = gradient(uMainTex, vTexCoord);\nvec4 depthGrad = gradient(uDepthTex, vTexCoord);\n\nfloat idQ = mix(colGrad.r, 0.0, smoothstep(0.0, 0.3, lDepth));\n\nfloat idEdge = step(0.0001, colGrad.x);\n\nfloat depthQ = mix(0.0, 100.0, smoothstep(0.0, 0.01, col.g));\n\nfloat depthEdge = step(0.01, depthGrad.r);\n\nfloat normEdge = step(0.3, colGrad.g);\n\nfloat edge = max(idEdge, depthEdge);\n\nvec3 grad = vec3(idEdge, depthEdge, 0.0);\n\nfloat fog = smoothstep(4.0, 40.0, lDepth * (uFar - uNear));\n\n// float surfaceId = round(col.r * 20.0);\nfragColor.rgb = mix(vec3(0.2, 0.2, 0.2), vec3(0.6, 0.5, 0.5), 1.0 - fog);\n// fragColor.rgb *= 1.0 - ((1.0 - fog) * edge);\n// fragColor.a = 1.0;\n\nfragColor.rgb = mix(col.rgb, vec3(0.1), edge);\nfragColor.a = 1.0;\n\n\n\n\n// fragColor = vec4(1.0, 0.0, 0.0, 1.0);\n// fragColor = vec4(vec3(depthEdge), 1.0);\n// fragColor = vec4(colGrad.ggg, 1.0);\n// fragColor = vec4(1.0, 0.0, 1.0, 1.0);\n// fragColor = vec4(vec3(fog), 1.0);\n\n}"
    },
    "post-tex-scale": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\n// Defualt uniforms.\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uScreenSize;\n\n// Custom uniforms.\nuniform vec4 uTexOffset;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\nvec2 texCoord = vTexCoord * 2.0 - 1.0;\ntexCoord = (texCoord * uTexOffset.xy) + uTexOffset.zw;\n\ntexCoord = (texCoord + 1.0) * 0.5;\n\nfragColor = texture(uMainTex, texCoord);\n}"
    },
    "post": {
      "vert": "#version 300 es\n\nin vec2 aPosition;\nout vec2 vTexCoord;\n\nvoid main() {\nvTexCoord = (aPosition + 1.0) / 2.0;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}"
    },
    "textured": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uTex;\n\nin vec4 vColor;\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nvoid main() {\nfragColor.rg = vTexCoord;\nfragColor.a = 1.0;\n\nfragColor = texture(uTex, vTexCoord);\n// fragColor = vec4(vTexCoord, 0.0, 1.0);\n// float f = smoothstep(0.39, 0.4, distance(vTexCoord, vec2(0.5, 0.5)));\n// fragColor = vec4(vec3(f), 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec3 aNormal;\nin vec2 aTexCoord;\nin vec4 aColor;\nin float aSurfaceId;\n\nout vec4 vColor;\nout vec2 vTexCoord;\n\nvec3 hashId(float id) {\nfloat r = fract(mod(id * 25738.32498, 456.221));\nfloat g = fract(mod(id * 565612.08321, 123.1231));\nfloat b = fract(mod(id * 98281.32498, 13.221));\nreturn vec3(r, g, b);\n}\n\nvoid main() {\nmat4 modelView = uView * uModel;\ngl_Position = uProjection * uView * uModel * aPosition;\nvColor = aColor;\nvTexCoord = aTexCoord;\n}"
    },
    "unlit": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nin vec4 vColor;\nout vec4 fragColor;\n\nvoid main() {\nfragColor = vec4(vColor.rgb, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec3 aNormal;\nin vec4 aColor;\nin vec4 aRegister1;\nin float aSurfaceId;\n\nout vec4 vColor;\n\nvec3 hashId (float id)\n{\nfloat r = fract(mod(id * 25738.32498, 456.221));\nfloat g = fract(mod(id * 565612.08321, 123.1231));\nfloat b = fract(mod(id * 98281.32498, 13.221));\nreturn vec3(r, g, b);\n}\n\nvoid main()\n{\nmat4 modelView = uView * uModel;\nvec4 pos = aPosition;\npos.xyz += aRegister1.xyz;\n\ngl_Position = uProjection * uView * uModel * pos;\n\n\nvec3 vertexColor = aColor.rgb;\nvec3 localNormal = aNormal.rgb * 0.5 + 0.5;\nvec3 surfaceId = hashId(uObjectId + aSurfaceId);\n\nvColor.a = 1.0;\nvColor = aColor;\n}"
    },
    "utils": {
      "glsl": "float brightness (vec3 col) {\nreturn dot(col, vec3(0.2126, 0.7152, 0.0722));\n}\n"
    }
  };

  /**
   * 2 element vector class.
   */
  class Vec2 {
    constructor(x, y, z) {
      this._x = x || 0;
      this._y = y || 0;
      this._changed = false;
    }

    get x ()    { return this._x; }
    set x (val) { this._x = val; this._changed = true; }
    get y ()    { return this._y; }
    set y (val) { this._y = val; this._changed = true; }
    
    get xy ()   { return [this.x, this.y]; }
    set xy (xy) { this.set(...xy); }

    changed () {
      if (this._changed) {
        this._changed = false;
        return true;
      }
      return false;
    }

    set (x, y) {
      this._x = x;
      this._y = y;
      this._changed = true;
      return this;
    }

    copy () {
      return new Vec2(...this.xy);
    }
    
    add (a) {
      this.x += a.x;
      this.y += a.y;
      return this;
    }

    distance (a) {
      const dx = this.y - a.x;
      const dy = this.y - a.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    distance2 (a) {
      const dx = this.y - a.x;
      const dy = this.y - a.y;
      return dx * dx + dy * dy;
    }
    
  }


  /**
   * 3 element vector class.
   */
  class Vec3 {
    constructor(x, y, z) {
      this._x = x || 0;
      this._y = y || 0;
      this._z = z || 0;
      this._changed = false;
    }
    
    get x ()    { return this._x; }
    set x (val) { this._x = val; this._changed = true; }
    get y ()    { return this._y; }
    set y (val) { this._y = val; this._changed = true; }
    get z ()    { return this._z; }
    set z (val) { this._z = val; this._changed = true; }

    get xyz ()    { return [this.x, this.y, this.z]; }
    set xyz (xyz) { this.set(...xyz); } 
    

    changed () {
      if (this._changed) {
        this._changed = false;
        return true;
      }
      return false;
    }

    set (x, y, z) {
      this._x = x;
      this._y = y;
      this._z = z;
      this._changed = true;
      return this;
    }
   
    copy () {
      return new Vec3(...this.xyz);
    }

    add (a) {
      this.x += a.x;
      this.y += a.y;
      this.z += a.z;
      return this;
    }

    sub (a) {
      this.x -= a.x;
      this.y -= a.y;
      this.z -= a.z;
      return this;
    }

    distance (a) {
      const dx = this.y - a.x;
      const dy = this.y - a.y;
      const dz = this.z - a.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    distance2 (a) {
      const dx = this.y - a.x;
      const dy = this.y - a.y;
      const dz = this.z - a.z;
      return dx * dx + dy * dy + dz * dz;
    }

    mag () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    mult (s) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }

    div (s) {
      return this.mult(1 / s);
    }


    normalize (len = 1) {
      const mag = this.mag(); 
      if (mag === 0) {
        return this;
      }
      let scalar = len / mag;
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }

    dot (a) {
      return this.x * a.x + this.y * a.y + this.z * a.z;
    }

    cross (a) {
      const x = this.y * a.z - this.z * a.y;
      const y = this.z * a.x - this.x * a.z;
      const z = this.x * a.y - this.y * a.x;
      return new Vec3(x, y, z);
    }

    equals (a, tolerance = Number.EPSILON) {
      return Math.abs(this.x - a.x) < tolerance &&
             Math.abs(this.y - a.y) < tolerance && 
             Math.abs(this.z - a.z) < tolerance;
    }


  }

  /**
   * @file Provide the operations used on meshes.
   */


  function copyVertex (vertex) {
    const vertexCopy = {};
    for (let attr in vertex) {
      if (Array.isArray(vertex[attr])) {
        vertexCopy[attr] = [...vertex[attr]];
      } else {
        vertexCopy[attr] = {...vertex[attr]};
      }
    }
    return vertexCopy;
  }

  /**
   * Triangulate a mesh. Discard any "faces" with fewer than 3 vertices. Convert 
   * any faces with 4+ vertices to triangles using a triangle fan method. For 
   * example the quad [0, 1, 2, 3] becomes the two tris [0, 1, 2] and [0, 2, 3] 
   * rather than [0, 1, 2] and [1, 2, 3].
   * @param {array<array>} faces The list of input faces.
   * @return {array<array>} The list of of updated faces.
   */
  function triangulate (faces) {
    const outFaces = [];

    faces.forEach(face => {
      if (face.length < 3) {
        return;
      }

      if (face.length === 3 ) {
        outFaces.push(face);
        return;
      }

      for (let i = 1; i < face.length - 1; i++) {
        outFaces.push([face[0], face[i], face[i+1]]);
      }
    });

    return outFaces;
  }


  /**
   * Validate a mesh. Make sure that all indices used in the face list are 
   * within bounds on the vertex list.
   * @param {array<Vertex>} vertices The list of vertices.
   * @param {array<Face>} faces The list of faces.
   * @return {boolean}
   */
  function validate (vertices, faces) { 
    for (let f = 0; f < faces.length; f++) {
      const face = faces[f];
      for (let vi = 0; vi < face.length; vi++ ){
        if (face[vi] > vertices.length) {
          return false;
        }
      }
    }
    return true;
  }


  /**
   * If two faces share a vertex consider them grouped. Iterate over all the faces 
   * and compute the distinct groups, returning a list of group ids in vertex 
   * order. A smooth-shaded sphere will have only 1 group. Meaning the returned 
   * list will have only 1 value. Like [0, 0, ... 0]. A flat-shaded model will 
   * have one group per flat-shaded face. That return data might look like 
   * [0, 0, 0, 1, 1, 1, ... 12, 12, 12]. If the mesh is valid and has no loose 
   * vertices, the returned list will have the same length as the mesh's vertex 
   * list.
   * @param {array<Face>} faces The mesh's face list.
   * @returns {array<number>} A list of group IDs that can be applied to a mesh 
   *     using applyAttribVarying().
   */
  function findGroups (faces) {
    let groups = [];

    /**
     * Join a set with another set or a list.
     * @param {Set} a The receiving set. 
     * @param {Ser|array} b The giving set or list.
     * @returns 
     */
    const join = (a, b) => {
      if (b instanceof Set) {
        for (let val of b.values()) {
          a.add(val);
        }
        return;
      } 
      b.forEach(val => a.add(val));
    };

    for (let fi = 0; fi < faces.length; fi++) {
      const vertices = faces[fi];
      for (let vi = 0; vi < vertices.length; vi++) {

        const v = vertices[vi];
        let markedGroups = [];

        for (let gi = 0; gi < groups.length; gi++) {
          const group = groups[gi];
          if (group.has(v)) {
            join(group, vertices);
            markedGroups.push(gi);
          }
        }

        if (markedGroups.length === 0) {
          const newGroup = new Set();
          join(newGroup, vertices);
          groups.push(newGroup);
        }

        if (markedGroups.length > 1) {
          const receivingGroup = groups[markedGroups[0]];

          for (let mgi = 1; mgi < markedGroups.length; mgi++) {
            join(receivingGroup, groups[markedGroups[mgi]]);
            groups[markedGroups[mgi]] = false;
          }

          groups = groups.filter(x => x);
        }
      }
    }

    // Groups now contains one or more sets. Between these groups every vertex 
    // index in the mesh should be included. 
    const groupsByVertIndex = [];
    groups.forEach((group, groupIndex) => {
      for (let vertIndex of group.values()) {
        groupsByVertIndex[vertIndex] = groupIndex;
      }
    }); 

    return groupsByVertIndex;
  }


  /**
   * Apply a new attribute to the vertices of a mesh where the attributes can 
   * vary across the vertices.
   * @param {string} attribName The name of the attribute to attach to each
   *     vertex. 
   * @param {array<(array|number)>} attribValues An array of values to attach.
   *     Must be the same length as vertices. 
   * @param {array<Vertex>} vertices The mesh's vertex list.
   * @returns 
   */
  function applyAttribVarying (attribName, attribValues, vertices) {
    const outVertices = [];
    if (vertices.length !== attribValues.length) {
      console.error(`Cannot apply attribute: ${attribName} Mismatched length.`);
      return vertices;
    }

    for (let vi = 0; vi < vertices.length; vi++) {
      const vertex = vertices[vi];
      const outVertex = {};
      for (let attrib in vertex) {
        outVertex[attrib] = [...vertex[attrib]];
      }
      if (Array.isArray(attribValues[vi])) {
        outVertex[attribName] = [...attribValues[vi]];
      } else {
        outVertex[attribName] = [attribValues[vi]];
      }
      outVertices.push(outVertex);
    }
    return outVertices;
  }


  function applyAttribConstant (attribName, attribValue, vertices) {
    const outVertices = [];
    for (let vi = 0; vi < vertices.length; vi++) {
      const vertex = vertices[vi];
      const outVertex = {};
      for (let attrib in vertex) {
        outVertex[attrib] = [...vertex[attrib]];
      }
      if (Array.isArray(attribValue)) {
        outVertex[attribName] = [...attribValue];
      } else {
        outVertex[attribName] = [attribValue];
      }
      outVertices.push(outVertex);
    }
    return outVertices;
  }


  function facesToEdges (faces) {
    const outEdges = [];
    for (let fi = 0; fi < faces.length; fi++) {
      const face = faces[fi];
      for(let vi = 0; vi < face.length; vi++) {
        outEdges.push([face[vi], face[(vi + 1) % face.length]]);
      }
    }
    return outEdges;
  }


  function verticesToNormals (vertices) {
    const outEdges = [];
    for (let vi = 0; vi < vertices.length; vi++) {
      const vertex = vertices[vi];
      if (!vertex.position || !vertex.normal) { continue; }

      const { position, normal } = vertex;
      const position2 = new Vec3(...position);
      position2.add(new Vec3(...normal).normalize(1));

      outEdges.push(vertex);

      const vertex2 = { 
        ...vertex,
        position: position2
      };

      outEdges.push(vertex2);
    }
    return outEdges;
  }


  function shadeFlat (vertices, faces) {
    const outVerts = []; 
    const outFaces = [];

    let outVertIndex = 0;


    for (let fi = 0; fi < faces.length; fi++) {
      const face = faces[fi];
      let avgNormal;

      
      for (let vi = 0; vi < face.length; vi++) {
        const vertLoc = face[vi];
        const vert = vertices[vertLoc];
        const vertCopy = {};

        for (let attr in vert) {
          vertCopy[attr] = [...vert[attr]];

          if (attr === 'normal') {
            if (!avgNormal) {
              avgNormal = new Vec3(...vert.normal);
            } else {
              avgNormal.add(new Vec3(...vert.normal));
            }
          }
        }

        outVerts.push(vertCopy);
      }

      const faceCopy = [];
      for (let n = 0; n < face.length; n++) {
        faceCopy.push(n + outVertIndex);
        if (avgNormal) {
          outVerts[n + outVertIndex].normal = [...avgNormal.normalize().xyz];
        }
      }

      outVertIndex += face.length;
      outFaces.push(faceCopy);
    }

    return { vertices: outVerts, faces: outFaces };
  }



  function shadeSmooth (vertices, faces, tolerance = 0.001) {
    const outVerts = [];
    const smoothNormals = new Map();

    const fToS = f => Math.round(f / tolerance);

    const hashVector = (v) => {
      if (v['x']) {
        return `${fToS(v.x)},${fToS(v.y)},${fToS(v.z)}`;    
      }
      return `${fToS(v[0])},${fToS(v[1])},${fToS(v[2])}`;    
    };

    for (let vi = 0; vi < vertices.length; vi++) {
      const vert = vertices[vi];
      const vertCopy = copyVertex(vert);

      outVerts.push(vertCopy);

      if (!vert.position && !vert.normal) {
        continue;
      }

      const hash = hashVector(vert.position);

      if (!smoothNormals.get(hash)) {
        const data = {
          normal: new Vec3(...vert.normal),
          position: new Vec3(...vert.position),
          replaceMap: [vi]
        };
        smoothNormals.set(hash, data);
      } else {

        const data = smoothNormals.get(hash);
        data.normal.add(new Vec3(...vert.normal)).normalize();
        data.position.add(new Vec3(...vert.position)).mult(0.5);
        data.replaceMap.push(vi);
      }
    }
    smoothNormals.forEach(data => {
      for (let vi of data.replaceMap) {
        outVerts[vi].normal = data.normal.xyz;
        outVerts[vi].position = data.position.xyz;
      }
    });

    return { vertices: outVerts, faces: faces };
  }


  function mapFuncToAttributes (vertices, attribName, func) {
    const outVertices = [];
    for (let vi = 0; vi < vertices.length; vi++) {
      const vert = vertices[vi];
      const copy = copyVertex(vert);
      if (copy[attribName]) {
        copy[attribName] = func(copy[attribName]);
      }
      outVertices.push(copy);
    }
    return outVertices;
  }

  var meshOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    applyAttribConstant: applyAttribConstant,
    applyAttribVarying: applyAttribVarying,
    copyVertex: copyVertex,
    facesToEdges: facesToEdges,
    findGroups: findGroups,
    mapFuncToAttributes: mapFuncToAttributes,
    shadeFlat: shadeFlat,
    shadeSmooth: shadeSmooth,
    triangulate: triangulate,
    validate: validate,
    verticesToNormals: verticesToNormals
  });

  /**
   * Matrix math borrowed from GlMatrix.
   * https://github.com/toji/gl-matrix/blob/master/src/mat4.js.
   */ 
   
  const EPSILON = 0.0000001;

  /**
   * Generate an Identity Matrix.
   * @return {Float32Array} Identity Matrix 
   */ 
  function create () {

    let out;
    {
      out = new Array(16).fill(0);
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;  
  }


  /**
   * Generate a view matrix.
   * @param  {Float32Array} out Matrix to put values into. 
   * @param  {Array} eye Position of eye [x, y, z].
   * @param  {Array} center Look target [x, y, z]. 
   * @param  {Array} up description 
   * @return {Float32Array} View matrix. 
   */ 
  function lookAt (out, eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return out;
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
  }


  /**
   * Generate a perspective projection matrix.
   * @param  {Float32Array} out Matrix to put values into. 
   * @param  {Number} fovy The vertical fov.
   * @param  {Number} aspect Aspect ratio.
   * @param  {Number} near Near clip plane.
   * @param  {Number} far Far clip plane.
   * @return {Float32Array} Projection matrix. 
   */ 
  function perspective (out, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }


  /**
   * Translate a transform matrix by a vector.
   * @param {Float32Array} out Matrix to put values into. 
   * @param {Float32Array} a Input matrix.
   * @param {Array} v [x, y, z] Vector array.
   * @return {Float32Array} Transform matrix. 
   */ 
  function translate (out, a, v) {
    let x = v[0],
      y = v[1],
      z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];

      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;

      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
  }

  /**
   * Rotates a mat4 by the given angle around the given axis
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {ReadonlyVec3} axis the axis to rotate around
   * @returns {mat4} out
   */
  function rotate (out, a, rad, axis) {
    let x = axis[0],
      y = axis[1],
      z = axis[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }


  /**
   * Reset a given matrix to the identity.
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */
  function identity (out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }


  /**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the first operand
   * @param {ReadonlyMat4} b the second operand
   * @returns {mat4} out
   */
  function multiply (out, a, b) {
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    // Cache only the current line of the second matrix
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }


  /**
   * Copy the values from one mat4 to another
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */
  function copy (out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }


  /**
   * Scales the mat4 by the dimensions in the given vec3 not using vectorization
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to scale
   * @param {ReadonlyVec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/
  function scale(out, a, v) {
    let x = v[0],
      y = v[1],
      z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }


  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */
  function invert (out, a) {
    let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }


  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to transform
   * @param {ReadonlyMat4} m matrix to transform with
   * @returns {vec3} out
   */
  function transformMat4(out, a, m) {
    let x = a[0],
      y = a[1],
      z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }


  /**
   * Transpose the values of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */
  function transpose (out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a01 = a[1],
        a02 = a[2],
        a03 = a[3];
      let a12 = a[6],
        a13 = a[7];
      let a23 = a[11];

      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }

    return out;
  }


  function print (a) {
    let str = '';
    for (let i = 0; i < 16; i++) {
      str += a[i].toFixed(2);
      str += i % 4 === 3 ? '\n' : ' ';
    }
    return str;
  }

  var m4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    copy: copy,
    create: create,
    identity: identity,
    invert: invert,
    lookAt: lookAt,
    multiply: multiply,
    perspective: perspective,
    print: print,
    rotate: rotate,
    scale: scale,
    transformMat4: transformMat4,
    translate: translate,
    transpose: transpose
  });

  const CHARS = 'abcdefghijfklmnopqrstuvwxyzABCDEFGHIJFKLMNOPQRSTUVWXYZ0123456789_@!';
  const buffer = new Uint8Array(128);
  let index = buffer.byteLength;

  function fillBuffer () {
    crypto.getRandomValues(buffer);
    index = 0;
  }

  function uuid (length = 6) {
    if (index + length >= buffer.byteLength) fillBuffer();
    let id = '';
    while(id.length < length) {
      id += CHARS[buffer[index] % CHARS.length];
      ++ index;
    }
    return id;
  }

  /**
   * @fileoverview Provide a polygonal mesh class.
   */

  /**
   * A single vertex. Contains 1 or more named attributes. 
   * @typedef {object} Vertex
   */

  /**
   * A single face. Contains an array of 3 or more indices into a vertex list.
   * @typedef {array<number>} Face
   */


  class Mesh {
    /**
     * Construct a mesh from a list of vertices and faces.
     * @param {array<Vertex>} vertices 
     * @param {array<Face>} faces 
     * @param {object} meta Additional meta information about the mesh. Name and 
     *     more.
     */
    constructor (vertices, faces, meta = {}) {
      
      /** 
       * The array of vertices for this mesh. Each entry is object with with 
       * named attributes and arrays for the value.
       * @type {array<Vertex>}
       * @example 
       */
      this.vertices = vertices;

      /**
       * The array of faces for this mesh. An array of arrays. The internal array
       * contains indices into the vertex array. Quads and ngons are allowed but 
       * must be triangulated before being sent to the 
       * @type {array<Face>}
       */
      this.faces = faces;

      /**
       * A name for this mesh.
       */
      this.name = meta.name || 'mesh';

      /**
       * The id for this mesh.
       */ 
      this.id = uuid();
    }


    /**
     * Triangulate this mesh.
     * @chainable
     */
    triangulate () {
      this.faces = triangulate(this.faces);
      return this;
    }


    /**
     * Create a render-able version of the mesh that works with a gl.drawArrays()
     * call. 
     * TODO : Rename this.
     * @returns 
     */
    render () {
      const mode = 'TRIANGLES';
      const triangles = triangulate(this.faces);
      const vertexCount = triangles.length * 3;
      const attribs = {};
      
      for (let f = 0; f < triangles.length; f++) {
        const face = triangles[f];

        for (let v = 0; v < 3; v++) {
          const vertex = this.vertices[face[v]];

          for (let attrib in vertex) {
            const data = vertex[attrib];
            if (!attribs[attrib]) {
              attribs[attrib] = [];
            }
            attribs[attrib].push(...data);
          }
        }
        
      }
      for (let attrib in attribs) {
        attribs[attrib] = new Float32Array(attribs[attrib]);
      }

      const name = `${this.name}_${this.id}`;
      return { mode, vertexCount, attribs, name };
    }


    renderEdges () {
      const mode = 'LINES';
      const edges = facesToEdges(this.faces);
      const vertexCount = edges.length * 2;
      const attribs = {};

      for (let ei = 0; ei < edges.length; ei++) {
        const edge = edges[ei];
        for (let vi = 0; vi < 2; vi++) {
          const vertex = this.vertices[edge[vi]];
          for (let attrib in vertex) {
            const data = vertex[attrib];
            if (!attribs[attrib]) {
              attribs[attrib] = [];
            }
            attribs[attrib].push(...data);
          }
        }
      }
      for (let attrib in attribs) {
        attribs[attrib] = new Float32Array(attribs[attrib]);
      }

      const name = `${this.name}_${this.id}_edges`;
      return { mode, vertexCount, attribs, name };
    }


    renderPoints () {
      const mode = 'POINTS';
      const vertexCount = this.vertices.length;
      const attribs = {};

      for (let vi = 0; vi < this.vertices.length; vi++) {
        const vertex = this.vertices[vi];
        for (let attrib in vertex) {
          const data = vertex[attrib];
          if (!attribs[attrib]) {
            attribs[attrib] = [];
          }
          attribs[attrib].push(...data);
        }
      }
      
      for (let attrib in attribs) {
        attribs[attrib] = new Float32Array(attribs[attrib]);
      }

      const name = `${this.name}_${this.id}_points`;
      return { mode, vertexCount, attribs, name};
    }


    renderNormals (length = 0.05) {
      const mode = 'LINES';
      const vertexCount = this.vertices.length * 2;
      const attribs = {};

      for (let vi = 0; vi < this.vertices.length; vi++) {
        const vertex = this.vertices[vi];


        for (let attrib in vertex) {
          const data = vertex[attrib];
          if (!attribs[attrib]) {
            attribs[attrib] = [];
          }
          attribs[attrib].push(...data);

          if (attrib === 'position' && vertex['normal']) {
            const { position, normal } = vertex;
            const position2 = new Vec3(...position);
            position2.add(new Vec3(...normal).normalize(length));
            attribs[attrib].push(...position2.xyz);
          } else {
              attribs[attrib].push(...data);
          }
        }
      }

      for (let attrib in attribs) {
        attribs[attrib] = new Float32Array(attribs[attrib]);
      }

      const name = `${this.name}_${this.id}_normals`;
      return { mode, vertexCount, attribs, name };
    }


    /**
     * Attach group info to this mesh. Adds another attrib (surfaceId) to each 
     * vertex. The surfaceId value will be unique for each set of disjoint 
     * vertices in the mesh.
     * @chainable 
     */
    findGroups () {
      const groups = findGroups(this.faces);
      this.vertices = applyAttribVarying('surfaceId', groups, this.vertices);
      return this;
    }


    /**
     * Fill the vetex colors for the mesh with a single vertex color.
     */
    fill (col) {
      this.vertices = applyAttribConstant('color', col.rgba, this.vertices);
      return this;
    }


    /**
     * Inflate the mesh along its normals.
     */ 
    inflate (amt = 0) {
      for (let vi = 0; vi < this.vertices.length; vi++) {
        const vertex = this.vertices[vi];
        if (!(vertex.position && vertex.normal)) continue;

        for (let i = 0; i < 3; i++) {
          vertex.position[i] += vertex.normal[i] * amt;
        }
      }
      return this;
    }


    getEdges () {
      const edges = facesToEdges(this.faces);
      const outEdges = [];

      for (let ei = 0; ei < edges.length; ei++) {
        const edge = edges[ei];
        const pos1 = this.vertices[edge[0]].position;
        const pos2 = this.vertices[edge[1]].position;
        outEdges.push([pos1, pos2]);
      }
      return outEdges;
    }

    shadeFlat () {
      const { vertices, faces } = shadeFlat(this.vertices, this.faces);
      this.vertices = vertices;
      this.faces = faces;
      return this;
    }

    shadeSmooth (tolerance) {
      const { vertices, faces } = shadeSmooth(this.vertices, this.faces, tolerance);
      this.vertices = vertices;
      this.faces = faces;
      return this;
    }

    applyTransform (transform) {
      for (let vi = 0; vi < this.vertices.length; vi++) {
        const vert = this.vertices[vi];
        if (vert.position) {
          vert.position = transform.transformPoint(vert.position);
        }
        if (vert.normal) {
          vert.normal = transform.transformNormal(vert.normal);
        }
      }
      return this;
    }

    join (other) {
      const offset = this.vertices.length;

      const newFaces = other.faces.map(face => {
        return face.map(index => index + offset);
      });

      this.vertices = this.vertices.concat(other.vertices);
      this.faces = this.faces.concat(newFaces);
      
      return this;
    }  

    flipNormals () {
      const flipNormal = n => n.map(x => x * -1);
      this.vertices = mapFuncToAttributes(this.vertices, 'normal', flipNormal);
      return this;
    }
  }

  /**
   * @file Provide geometric primitives.
   */


  /**
   * Make a cube. Centered on the origin with w, h, d of size.
   * @param {number} size The size of the cube.
   * @return {Mesh}
   */ 
  function cube (size = 1) {
    const s = size / 2;
    
    //   7-----6
    //  /|    /|
    // 4-----5 |
    // | 3---|-2
    // |/    |/
    // 0-----1

    const positions = [
      [-s, -s, +s],
      [+s, -s, +s],
      [+s, -s, -s],
      [-s, -s, -s],
      
      [-s, +s, +s],
      [+s, +s, +s],
      [+s, +s, -s],
      [-s, +s, -s]
    ];


    const vertices = [];
    const faces = [];
    let i = 0;

    const quad = function (a, b, c, d, normal, color) {
      vertices.push(
        {position: [...positions[a]], normal, color, texCoord: [0, 0]},
        {position: [...positions[b]], normal, color, texCoord: [1, 0]},
        {position: [...positions[c]], normal, color, texCoord: [1, 1]},
        {position: [...positions[d]], normal, color, texCoord: [0, 1]},
      );

      faces.push([i, i + 1, i + 2, i + 3]);
      
      i += 4;
    };

    quad(0, 1, 5, 4, [0, 0, +1], [1, 0, 0, 1]); // FRONT
    quad(2, 3, 7, 6, [0, 0, -1], [0, 1, 1, 1]); // BACK

    quad(4, 5, 6, 7, [0, +1, 0], [1, 0, 1, 1]); // TOP
    quad(1, 0, 3, 2, [0, -1, 0], [0, 1, 0, 1]); // BOTTOM

    quad(3, 0, 4, 7, [-1, 0, 0], [0, 0, 1, 1]); // LEFT
    quad(1, 2, 6, 5, [+1, 0, 0], [1, 1, 0, 1]); // RIGHT

    let mesh = new Mesh(vertices, faces, { name: 'cube' });
    return mesh;
  }


  /**
   * Make an icosphere shape with diameter size.
   * @param {number} size The diameter of the sphere.
   * @param {number} level The subdivision level to use.
   * @param {boolean} flat Whether to use flat shading. Default smooth (false).
   * @return {Mesh}
   */ 
  function icosphere (size = 1, level = 1, flat = false) {
    
    const radius = size / 2;

    // Start with an icosahedron, using this aspect ratio to generate points.
    // The positions of the the twelve icosahedron vertices.
    const t = (1 + Math.sqrt(5)) / 2;

    let positions = [
      /**00*/ new Vec3(-t,  0, -1).normalize(radius),
      /**01*/ new Vec3(+t,  0, -1).normalize(radius),
      /**02*/ new Vec3(+t,  0, +1).normalize(radius),
      /**03*/ new Vec3(-t,  0, +1).normalize(radius),
      /**04*/ new Vec3(-1, -t,  0).normalize(radius),
      /**05*/ new Vec3(+1, -t,  0).normalize(radius),
      /**06*/ new Vec3(+1, +t,  0).normalize(radius),
      /**07*/ new Vec3(-1, +t,  0).normalize(radius),
      /**08*/ new Vec3( 0, -1, -t).normalize(radius),
      /**09*/ new Vec3( 0, -1, +t).normalize(radius),
      /**10*/ new Vec3( 0, +1, +t).normalize(radius),
      /**11*/ new Vec3( 0, +1, -t).normalize(radius),
    ];

    let faces = [
      [0, 3, 7],
      [0, 7, 11],
      [0, 11, 8],
      [0, 8, 4],
      [0, 4, 3],

      [2, 1, 6],
      [2, 6, 10],
      [2, 10, 9],
      [2, 9, 5],
      [2, 5, 1],

      [3, 9, 10],
      [3, 10, 7],
      [3, 4, 9],

      [1, 8, 11],
      [1, 11, 6],
      [1, 5, 8],
      
      [8, 5, 4],
      [9, 4, 5],
      [10, 6, 7],
      [11, 7, 6],
    ];


    /**
     * Add a new position. Normalize its position so it sits on the surface of 
     * the sphere.
     * @param {*} pos 
     */
    const addPosition = (pos) => {
      positions.push(pos.normalize(radius));
    };

    const foundMidPoints = {};

    /**
     * @param {*} a 
     * @param {*} b 
     * @returns 
     */
    const getMidPoint = (a, b) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;

      if (foundMidPoints[key]) {
        return foundMidPoints[key];
      }
      
      const posA = positions[a].copy();
      const posB = positions[b].copy();
      const midPoint = posA.copy().add(posB).div(2);
      
      addPosition(midPoint);
      
      const index = positions.length - 1;
      foundMidPoints[key] = index;
      return index;
    };


    let faceBuffer = [];
    let vertices = [];
    
    for (let i = 0; i < level; i++) {
      faceBuffer = [];

      for (const face of faces) {
        const a = getMidPoint(face[0], face[1]);
        const b = getMidPoint(face[1], face[2]);
        const c = getMidPoint(face[2], face[0]);

        faceBuffer.push([face[0], a, c]);
        faceBuffer.push([face[1], b, a]);
        faceBuffer.push([face[2], c, b]);
        faceBuffer.push([a, b, c]);
      }
      faces = faceBuffer;
    }
    
    // For flat shading we need to split each vertex into 3 new ones and 
    // re-index the faces.
    if (flat) {
      faceBuffer = [];

      for (const face of faces) {
        const a = positions[face[0]];
        const b = positions[face[1]];
        const c = positions[face[2]];

        const ba = b.copy().sub(a);
        const ca = c.copy().sub(a);

        const normal = ba.cross(ca).normalize();

        const pointer = vertices.length;

        vertices.push(
          { position: a.xyz, normal: normal.xyz },
          { position: b.xyz, normal: normal.xyz },
          { position: c.xyz, normal: normal.xyz }
        );

        faceBuffer.push([pointer, pointer + 1, pointer + 2]);
      }
      faces = faceBuffer;

    } else {
      vertices = positions.map(pos => {
        return { position: pos.xyz, normal: pos.normalize().xyz };
      });
    }

    return new Mesh(vertices, faces, { name: 'icosphere' });
  }


  /**
   * 
   */ 
  function uvsphere (size = 1, level = 1, flat = false) {
    const radius = size / 2;

    const segments = level + 2;

    const getSphericalPos = (uFac, vFac) => {
      const r = Math.sin(Math.PI * vFac);
      const x = Math.cos(2 * Math.PI * uFac) * r * radius;
      const y = -Math.cos(Math.PI * vFac) * radius;
      const z = Math.sin(2 * Math.PI * uFac) * r * radius;
      return [x, y, z];
    };


    let step = size / segments;

    const positions = [];
    const texCoords = [];
    const faces = [];

    let vertIndex = 0;
    console.log(segments);

    for (let v = 0; v < segments; v++) {
      
      for (let u = 0; u < segments; u++) {

        const uf0 = u / segments;
        const uf1 = (u + 1) / segments;
        
        const vf0 = v / segments;
        const vf1 = (v + 1) / segments;

        // South pole case.
        if (v === 0) {


          positions.push(
            getSphericalPos(uf0, vf0),
            getSphericalPos(uf1, vf1),
            getSphericalPos(uf0, vf1)
          );

          texCoords.push(
            [uf0 + (0.5 * step), vf0],
            [uf1, vf1],
            [uf0, vf1]
          );

          faces.push([vertIndex, vertIndex + 2, vertIndex + 1]);

          vertIndex += 3;
          continue;


        } 

        // North pole case. 
        if (v === segments - 1) {
          positions.push(
            getSphericalPos(uf0, vf0),
            getSphericalPos(uf1, vf0),
            getSphericalPos(uf1, vf1),
          );

          texCoords.push(
            [uf0, vf0],
            [uf1, vf0],
            [uf1 - (0.5 / segments), vf1],
          );

          faces.push([vertIndex, vertIndex + 2, vertIndex + 1]);
          vertIndex += 3;
          continue;
        }


        

        positions.push(
          getSphericalPos(uf0, vf0),
          getSphericalPos(uf1, vf0),
          getSphericalPos(uf1, vf1),
          getSphericalPos(uf0, vf1)
        );


        texCoords.push(
          [uf0, vf0],
          [uf1, vf0],
          [uf1, vf1],
          [uf0, vf1]
        );

        // texCoords.push(
        //   [0, 1],
        //   [1, 1],
        //   [1, 0],
        //   [0, 0]
        // );


        faces.push([vertIndex, vertIndex + 3, vertIndex + 2, vertIndex + 1]);
        vertIndex += 4;

      }
    }

    console.log(positions, faces);

    const vertices = positions.map((pos, i) => {
      return { position: pos, normal: pos, texCoord: texCoords[i]};
    });

    return new Mesh(vertices, faces, { name: 'uvsphere' });
   
  }

  /**
   * Make a quad facing up along y axis.
   * @param {number} size The w and d of the quad.
   * @return {Mesh}
   */ 
  function quad (size) {
    const s = size / 2;
    const positions = [
      new Vec3(-s, 0, -s),
      new Vec3(+s, 0, -s),
      new Vec3(+s, 0, +s),
      new Vec3(-s, 0, +s),
    ];
    
    const faces = [[0, 3, 2, 1]];
    const vertices = positions.map(pos => {
      return { position: pos.xyz, normal: [0, 1, 0] };
    });

    return new Mesh(vertices, faces, { name: 'quad' });
  }


  /**
   * Make a grid facing up along y axis.
   * @param {number} size The size of the quad.
   * @param {number} subdivisions The number of subdivisions.
   * @return {Mesh}
   */ 
  function grid (size, subdivisions = 10, flat = false) {
    const s = size / 2;
    const step = size / (subdivisions + 1);

    const positions = [];
    const faces = [];

    if (flat) {

      // Flat normals case. Copy shared verts.
      let vertIndex = 0;
      for (let i = 0; i < subdivisions + 1; i++) {
        const z = i * step;
        for (let j = 0; j < subdivisions + 1; j++) {
          const x = j * step;
          positions.push([-s + x,        0, -s + z]);
          positions.push([-s + x + step, 0, -s + z]);
          positions.push([-s + x + step, 0, -s + z + step]);
          positions.push([-s + x       , 0, -s + z + step]);
          
          faces.push([vertIndex, vertIndex + 3, vertIndex + 2, vertIndex + 1]);
          vertIndex += 4;
        }
      }

    } else {

      // Smooth normals case. Reuse shared verts.
      for (let i = 0; i < subdivisions + 2; i++) {
        const z = i * step;
        for (let j = 0; j < subdivisions + 2; j++) {
          const x = j * step;
          positions.push([-s + x, 0, -s + z]);

          if (i < subdivisions + 1 && j < subdivisions + 1) {
            const a = i * (subdivisions + 2) + j;
            const b = a + 1;
            const c = a + subdivisions + 2;
            const d = c + 1;
            faces.push([a, c, d, b]);
          }
        }
      }
    }

    const vertices = positions.map(pos => {
      return { position: pos, normal: [0, 1, 0] };
    });

    return new Mesh(vertices, faces, { name: 'grid' });
  }


  /**
   * Make a circle with diameter size facing up along y axis.
   * @param {number} size The size of the quad.
   * @param {number} resolution The number of straight line segments to use.
   * @return {Mesh}
   */ 
  function circle (size, resolution = 12, fill = 'ngon') {
    const positions = [];
    const faces = [];

    if (fill === 'fan') {
      positions.push([0, 0, 0]);
    } else if (fill === 'ngon') {
      faces[0] = [];
    }

    for (let i = 0; i < resolution; i++) {
      const theta = -i * Math.PI * 2 / resolution;
      const x = Math.cos(theta) * (size / 2);
      const z = Math.sin(theta) * (size / 2);

      positions.push([x, 0, z]);

      if (fill === 'fan') {
        const next = (i + 1) % (resolution);
        faces.push([0, i + 1, next + 1]);
      } else if (fill === 'ngon') {
        faces[0].push(i);
      }
    }

    const vertices = positions.map(pos => {
      return { position: pos, normal: [0, 1, 0] };
    });
    return new Mesh(vertices, faces, { name: 'circle' });
  }


  /**
   * Make a full screen quad for rendering post effects..
   */
  function _fsQuad() {
    const vertices = [
      [-1, -1, 0],
      [+1, -1, 0],
      [-1, +1, 0],

      [-1, +1, 0],
      [+1, -1, 0],
      [+1, +1, 0],
    ];

    return {
      mode: 'TRIANGLES',
      vertexCount: 6,
      attribs: {
        aPosition: new Float32Array(vertices.flat()),
      }
    }
  }


  /**
   * Make an axes gizmo.
   */ 
  function _axes () {
    const positions = [
      [0, 0, 0], [1, 0, 0],
      [0, 0, 0], [0, 1, 0],
      [0, 0, 0], [0, 0, 1],
      [0, 0, 0], [-1, 0, 0],
      [0, 0, 0], [0, -1, 0],
      [0, 0, 0], [0, 0, -1],
    ];

    const colors = [
      [1, 0, 0, 1], [1, 0, 0, 1],
      [0, 1, 0, 1], [0, 1, 0, 1],
      [0, 0, 1, 1], [0, 0, 1, 1],
      [0, 1, 1, 1], [0, 1, 1, 1],
      [1, 0, 1, 1], [1, 0, 1, 1],
      [1, 1, 0, 1], [1, 1, 0, 1],
    ];

    const normals = [
      [1, 0, 0], [1, 0, 0],
      [0, 1, 0], [0, 1, 0],
      [0, 0, 1], [0, 0, 1],
      [-1, 0, 0], [-1, 0, 0],
      [0, -1, 0], [0, -1, 0],
      [0, 0, -1], [0, 0, -1],
    ];

    return {
      mode: 'LINES',
      vertexCount: 12,
      attribs: {
        position: new Float32Array(positions.flat(2)),
        color: new Float32Array(colors.flat(2)),
        normal: new Float32Array(normals.flat(2)),
      }
    }
  }

  var primitives = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _axes: _axes,
    _fsQuad: _fsQuad,
    circle: circle,
    cube: cube,
    grid: grid,
    icosphere: icosphere,
    quad: quad,
    uvsphere: uvsphere
  });

  /**
   * 
   */ 

  class Line {
    constructor (points, color = [1, 1, 1, 1]) {
      this.points = points;
      this.color = color;
      this.thickness = .1;
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

  /**
   * An edge collection is used to display any number of disjoint edges
   */ 

  class EdgeCollection {
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

  /**
   * 
   */


  class Transform {
    constructor () {
      this.position = new Vec3();
      this.rotation = new Vec3();
      this.scale = new Vec3(1, 1, 1);
      this._matrix = create();
      this._invTranspose = create();
      this._updateMatrix();
      this._changed = false;
    }

    _updateMatrix () {
      identity(this._matrix);
      translate(this._matrix, this._matrix, this.position.xyz);
      rotate(this._matrix, this._matrix, this.rotation.x, [1, 0, 0]);
      rotate(this._matrix, this._matrix, this.rotation.y, [0, 1, 0]);
      rotate(this._matrix, this._matrix, this.rotation.z, [0, 0, 1]);
      scale(this._matrix, this._matrix, this.scale.xyz);

      invert(this._invTranspose, this._matrix);
      transpose(this._invTranspose, this._invTranspose);
    }

    get changed () {
      if (this.rotation._changed || this.position._changed || this.scale._changed) {
        this.position._changed = false;
        this.rotation._changed = false;
        this.scale._changed = false;
        return true;
      }
      return false;
    }

    get matrix () {
      if (this.changed) {
        this._updateMatrix();
      }
      return this._matrix;
    }

    get inverseTransposeMatrix () {
      if (this.changed) {
        this._updateMatrix();
      }
      return this._invTranspose;
    }

    transformPoint (point) {
      const out = [0, 0, 0];
      transformMat4(out, point, this.matrix);
      return out;
    }

    transformPointXyz (x, y, z) {
      const out = [x, y, z];
      transformMat4(out, out, this.matrix);
      return out;
    }

    transformNormal (normal) {
      const out = [0, 0, 0];
      transformMat4(out, normal, this.inverseTransposeMatrix);
      return out;
    }

    transformNormalXyz (x, y, z) {
      const out = [x, y, z];
      transformMat4(out, out, this.inverseTransposeMatrix);
      return out;
    }
  }

  /**
   * A single node (gameObject).
   */

  // Track a hidded render node id.
  let id = 0;

  class Node {

    constructor(name, geometry, transform) {
      this.name = name;
      this.id = uuid();
      this.renderId = id++;
      this.geometry = geometry || null;
      this.transform = transform || new Transform();
      this.visible = true;
      this.parent = null;
      this.children = [];
      this._worldMatrix = create();
      this.uniforms = {
        uObjectId: this.renderId,
        uModel: this._worldMatrix,
        uTex: 'none',
      };
      this.program = 'default';
    }

    get x ()  { return this.transform.position.x };
    get y ()  { return this.transform.position.y };
    get z ()  { return this.transform.position.z };
    
    get rx () { return this.transform.rotation.x };
    get ry () { return this.transform.rotation.y };
    get rz () { return this.transform.rotation.z };


    /** 
     * Move this node to a location, this is the local position.
     */
    move (x, y, z) {
      this.transform.position.set(x, y, z);
      return this;
    }


    rotate (x, y, z) {
      this.transform.rotation.set(x, y, z);
      return this;
    }


    scale (x, y, z) {
      if (arguments.length === 1) {
        this.transform.scale.set(x, x, x);
      } else {
        this.transform.scale.set(x, y, z);    
      }
      return this;
    }

    get worldPosition () {
      return ([this._worldMatrix[12], this._worldMatrix[13], this._worldMatrix[14]]);
    }


    _calculateWorldMatrix (parent) {
      if (parent) {
        multiply(this._worldMatrix, parent._worldMatrix, this.transform.matrix);
      } else {
        copy(this._worldMatrix, this.transform.matrix);
      }

      this.children.forEach(child => {
        child._calculateWorldMatrix(this);
      });
    }


    setParent (node) {
      if (this.parent) {
        this.parent._removeChild(this);
      }

      this.parent = node;
      this.parent._addChild(this);
      this._dirty = true;
      return this;
    }

    setGeometry (geo) {
      this.geometry = geo;
      return this;
    }

    createChildNode (name, geometry) {
      let node = new Node(name, geometry);
      node.setParent(this);
      return node;
    }

    _removeChild (node) {
      this.children = this.children.filter(n => n !== node);
    }


    _addChild (node) {
      this.children.push(node);
      this._dirty = true;
    }


    _print (output, depth) {
      if (depth > 0) {
        for (let i = 1; i < depth; i++) { 
          output += '  ';
        }
        output += '└─';
      }

      const geometry = this.geometry ? 'm.' + this.geometry : '';
      const name = this.name ? this.name : 'id: ' + this.id;
      output += `<em>${name}</em> : ${geometry}`;
      output += '\n';
      if (this.children) {
        output += this.children.map(c => c._print('', depth + 1)).join('');
      }

      return output;
    }

    _toDrawList (drawList, children = true) {
      if (!this.visible) {
        return;
      }

      if (this.geometry) {
        drawList.push(this);
      }

      if (children) {
        this.children.forEach(child => child._toDrawList(drawList));
      }

      return drawList;
    }


    traverse (fn) {
      fn(this);
      this.children.forEach(child => child.traverse(fn));
    }

    uniform (name, value) {
      this.uniforms[name] = value;
    }
  }

  class Camera extends Node {
    constructor (transform, fov) { 
      super ('camera', null, transform);

      this.fov = fov || 35;
      this.near = 0.5;
      this.far = 100;
      
      this.view = create();

      this.projection = create();

      this.target = new Vec3(0, 0, 0);

      this.up = new Vec3(0, 1, 0);

      this.updateViewProjection();
    }

    get eye () { return this.worldPosition }
    set aspect (val) { this._aspect = val; }
    get aspect () { return this._aspect; }


    updateViewProjection () {
      lookAt(this.view, this.eye, this.target.xyz, this.up.xyz);
      perspective(this.projection, radians(this.fov), this._aspect, this.near, this.far);
    }
  }

  /**
   * @fileoverview A scene contains a transform hierarchy that can be rendered by 
   * a renderer. It also contains a camera.
   */


  /**
   * 
   */
  class Scene extends Node {
    constructor() {
      super('scene', null);
      this.camera = new Camera();
      this.camera.setParent(this);
      this._drawCalls = [];
    }

    print () {
      return this._print('* ', 0);
    }

    drawCalls () {
      this._drawCalls = [];
      return this._toDrawList(this._drawCalls);
    }

    add () {
      
    }

    
    updateSceneGraph () {
      this._calculateWorldMatrix();
    }


    
  }

  const graphStyle = {
    width: '300px',
    height: '400px',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.25)',
    left: '1em',
    top: '1em',
    zIndex: 101,
    overflow: 'scroll',
    whiteSpace: 'pre',
    padding: '1em',
  };

  function SceneGraph () {
    let graph = tag('div#scene-graph', graphStyle);
    let panel = select('.gum-panel');
    if (panel) {
      panel.append(graph);
    }
    return graph;
  }

  /**
   * A shared layout for vertex attributes. Not every shader has to implement 
   * these attribs, but any that it does have will be forced to use the same 
   * layout.
   */
  const vertexAttributeLayout = [
     {
      name: 'aPosition',
      size: 3,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aNormal',
      size: 3,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aTexCoord',
      size: 2,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aColor',
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aSurfaceId',
      size: 1,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aRegister1',
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },
    {
      name: 'aRegister2',
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },
  ];

  /** 
   * Default values for shader unfiforms.
   */ 

  const defaultUniformValues = {
    uColorA: [0.9, 0.8, 0.9, 1],
    uColorB: [0, 0, 0, 1],
    uKernel: 2, 
    uDist: 1, 
    uWeight: 1,
  };

  /**
   * @file The RendererGL2 class provides the main interface between the main 
   * gum instance and the lower-level web gl calls.
   */


  class RendererGL2 {
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
       * The renderer's canvas.
       * @type {HTMLCanvasElement}
       */
      this.canvas = canvas;
      
      /**
       * The width of the renderer. Use the .resize(w, h) method to change.
       * @readyonly
       * @type {number}
       */ 
      this.w = w; 
      
      /**
       * The height of the renderer. Use the .resize(w, h) method to change.
       * @readyonly
       * @type {number}
       */ 
      this.h = h;
      
      /**
       * The aspect ratio. Use the .resize(w, h) method to change.
       * @readyonly 
       * @type {number}
       */
      this.aspectRatio = this.w / this.h;

      /**
       * Settings for the WebGl2 context.
       * @type {object}
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
       * @type {object}
       */
      this.shaderPrograms = {};

      /**
       * The uniforms available in each program.
       * @type {Object}
       */
      this.shaderProgramUniforms = {};

      /**
       * The render targets.
       * @type {object}
       */
      this.renderTargets = {
        'canvas': null,
        'default': null,
      };

      /**
       * The default clear color. Rgba[0,1] array.
       * @type {arrray}
       */
      this.clearColor = [0, 0, 0, 1];
      
      /**
       * The name of the active program.
       * @type {string}
       */
      this.activeProgram;

      /**
       * The name of the active render target.
       * @type {string}
       */
      this.renderTarget;

      /**
       * The last used texture unit when binding frame buffer textures.
       * @type {number}
       * @readonly
       */
      this.textureUnitIndex = 0;

      /**
       * The maximun number of samplers available on the current device.
       */ 
      this.MAX_TEX_UNIT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

      /**
       * The GL uniform setter function keyed by the GL type.
       * @type {object}
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
       * The available meshes keyed by id.
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

      /**
       * A hash to track a block of shared uniforms between programs. Useful 
       * for things like view matrices, sky colors etc.
       */ 
      this.globalUniformBlock = {};

      /**
       * Gl resource deleters by constructor name.
       */ 
      this.deleteLookup = {
        'WebGLProgram' : 'deleteProgram',
        'WebGLTexture' : 'deleteTexture',
        'WebGLFramebuffer' : 'deleteFramebuffer',
        'WebGLVertexArrayObject' : 'deleteVertexArray',
      };
      
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
     * Resize the the renderer and any render targets (frame buffers) to match 
     * the gum canvas size.
     * @param {number} w The width.
     * @param {number} h The height.
     */ 
    resize (w, h) {
      if (w === this.w && h === this.h) return;
      this.w = Math.max(w, 1);
      this.h = Math.max(h, 1);
      this.aspectRatio = this.w / this.h;
      this.canvas.width = this.w;
      this.canvas.height = this.h;
      for (let targetName in this.renderTargets) {
        this.updateRenderTarget(targetName);
      }
    }


    /**
     * Turn depth testing on or off.
     * @param {boolean} flag Whether depth testing is enabled.
     */
    depthTest (flag) {
      this._configuration.depthTest = flag;
      this.gl.disable(this.gl.DEPTH_TEST);
      if (flag) {
        this.gl.enable(this.gl.DEPTH_TEST);
      }
    }
    

    /**
     * Turn depth writing on or off.
     * @param {boolean} flag Whether depth writing is enabled.
     */
    depthWrite (flag) {
      this._configuration.depthWrite = flag;
      this.gl.depthMask(flag);
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
        console.warn('No program found:', program);
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
      const target = { w: this.w, h: this.h };
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
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.w, this.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
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

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.w, this.h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, target.depthTexture, 0);
      }

      this.renderTargets[name] = target;
    }


    /**
     * Update the dimensions of a render target by name. Scales it to match the 
     * current canvas.
     * @param 
     */ 
    updateRenderTarget (name) {
      const target = this.renderTargets[name];
      if (!target) return;

      const gl = this.gl;

      if (target.w === this.w && target.h === this.h) {
        return;
      }

      target.w = this.w;
      target.h = this.h;

      gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);

      // TODO : Option to keep the contents of the frame bufer.
      if (target.colorTexture) {
        gl.bindTexture(gl.TEXTURE_2D, target.colorTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.w, this.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.colorTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }

      if (target.depthTexture) {
        gl.bindTexture(gl.TEXTURE_2D, target.depthTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.w, this.h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, target.depthTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }


    /**
     * Draw a named mesh.
     * @param {string} mesh 
     * @returns
     */
    draw (meshName, uniforms = {}, program = null) {
      let mesh;

      // Check for a named mesh, which is stored in the renderer's responsobility.
      if (typeof meshName === 'string') {
        mesh = this.meshes[meshName];
        if (!mesh) {
          console.warn('No mesh found:', meshName);
          return;
        }
      } else {
        mesh = meshName;
      }
      

      if (program && program !== this.activeProgram) {
        this.setProgram(program);
      }

      if (mesh.program && mesh.program !== this.activeProgram) {
        this.setProgram(mesh.program);
      } 

      for (let uniform in uniforms) {
        this.uniform(uniform, uniforms[uniform]);
      }

      if (mesh.draw && typeof mesh.draw === 'function') {
        mesh.draw();
        return;
      }

      if (!mesh.vao) {
        return;
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
     * @param {WebGLProgram} program 
     */
    bindVertexAttributeLocations (program) {
      for (let i = 0; i < this.vertexAttributes.length; i++) {
        const attrib = this.vertexAttributes[i];
        this.gl.bindAttribLocation(program, i, attrib.name);
      }
    }


    /**
     * Convert attribute array to a vertex array object.
     * @param {object} attribs An object containing vertex data in the format:
     * @param {Float32Array} attribs.position
     * @param {Float32Array} attribs.normal
     *     ... any other vertex attributes.
     * @returns {WebGLVertexArrayObject}
     */ 
    _createVao (attribs) {
      const vao = this.gl.createVertexArray();
      this._bufferAttribs(vao, attribs);
      return vao;
    }
    

    _bufferAttribs (vao, attribs) {
      this.gl.bindVertexArray(vao);

      for (const [attrib, data] of Object.entries(attribs)) {
        const name = this._prefixAttribName(attrib);
        const info = this.attributeInfoByName[name];

        // If there is no attrib info, the shader stack and the renderer have no 
        // clue about that attrib name.
        if (!info) {
          continue;
        }

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        const { index, size, type, normalized } = info;
        this.gl.vertexAttribPointer(index, size, this.gl[type], normalized, 0, 0);
        this.gl.enableVertexAttribArray(index);
      }

      this.gl.bindVertexArray(null);
    }




    _getMeshId (name) {
      const n = name.toLowerCase();
      let postFix = '';
      let num = 1;
      while (this.meshes[n + postFix]) {
        postFix = '.' + ('' + num).padStart(3, '0');
        num += 1;
      }
      return n + postFix;
    }

    
    /**
     * Add a retained-mode mesh to the renderer.
     * @param {Mesh|object} 
     */ 
    addMesh (meshData) {
      let data;
      
      // Flatten a mesh 
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
      mesh.vao = this._createVao(data.attribs);

      mesh.program = data.program ?? null;
      
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


    /**
     * Blit from one frame buffer to another.
     * @param {WebGLFramebuffer|null} The source buffer or null for canvas.
     * @param {WebGLFramebuffer|null} The target buffer or null for canvas.
     */ 
    blitBuffer (src, target) {
      this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, src);
      this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, target);
      let w = this.w;
      let h = this.h;
      if (w > 0 && h > 0) {
        this.gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, this.gl.COLOR_BUFFER_BIT, this.gl.NEAREST);      
      }
    }


    /**
     * Free up gl (or js) memory for a single object.
     */ 
    _disposeGLEntity (entity) {
      if (!entity) return;
      const constructor = entity.constructor.name;
      if (this.deleteLookup[constructor]) {
        this.gl[this.deleteLookup[constructor]](entity);
      } else {
        entity = null;
      }
    }


    /**
     * Dispose of any gl resources.
     */ 
    dispose () {
      this.gl;
      console.log('disposeId', this.instanceId);
      for (let target of Object.values(this.renderTargets)) {
        if (!target) continue;
        for (let prop of Object.values(target)) {
          this._disposeGLEntity(prop);
        }
      }
      for (let tex of Object.values(this.texturesByName)) {
        if (!tex) continue;
        for (let prop of Object.values(tex)) {
          this._disposeGLEntity(prop);
        }
      }
      for (let prog of Object.values(this.shaderPrograms)) {
        this._disposeGLEntity(prog);
      }
      for (let mesh of Object.values(this.meshes)) {
        if (!mesh) continue;
        for (let prop of Object.values(mesh)) {
          this._disposeGLEntity(prop);
        }
      }
    }
  }

  /**
   * @fileoverview Provides a static class to load and parse .ply (Stanford 
   *     Triangle Format) files.
   */

  class PlyLoader {
    
    /**
     * Make a new Loader. A given project should only need one loader instance.
     * @param {boolean} verbose 
     */
    constructor (settings = {}) {
      
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
      this._verbose = settings.verbose ?? false;

      /** Whether to normalize integer data. */
      this._normalize = settings.normalize ?? true;

      /** 
       * The PLY format defines data types with these strings. This object helps
       * shim those to javascript ready values.
       */
      this.PLY_TYPES = {
        'char':   { bytes: 1, getter: 'getInt8'},
        'uchar':  { bytes: 1, getter: 'getUint8', maxValue: 255 },
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

      console.log(header);

      if (!header.valid) {
        console.error('Malformed data. Missing ply header: ' + file);
        this._finishLoading();
        return;
      }

      let [ vertices, faces ] = this._unpackData(buffer, header);
      vertices = this._unfoldVertices(vertices, header.vertexFormat);
      faces    = this._trimFaces(faces);

      const mesh = new Mesh(vertices, faces, { name: file });

      if (this._verbose) {
        console.log(`Loaded ${file} with ${vertices.length} vertices.`);
      }

      if (fn && typeof fn === 'function') {
        fn(mesh);
      }

      this._finishLoading();

      return mesh;
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
      if (header.format === 'ascii') ;

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
        const { type, property } = format[i];
        const { attrib, index } = this.PLY_MAPPINGS[property];

        if (!v[attrib]) {
          v[attrib] = [];
        }

        let val = vertex[i];
        if (this._normalize && this.PLY_TYPES[type].maxValue !== undefined) {
          val /= this.PLY_TYPES[type].maxValue;
        }

        v[attrib][index] = val;
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
              vertices.push(currentArray);
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
          const { bytes, getter, maxValue } = this.PLY_TYPES[type];
          let val = view[getter](byteIndex, littleEndian);
          vertex.push(val);
          byteIndex += bytes;
        }

        return vertex;
      };

      
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
      };

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

  /**
   * A texer is a simple dynamic canvas that can be used as a texture for the 3d 
   * scene.
   */

  class Texer {
    
    /**
     * Make a new texer.
     * @param {number} size The size used for the width and height of the canvas.
     *     Power of 2 recommended.
     */
    constructor (w, h, app) {

      /**
       * Css style for the texture canvas.
       */
      this.texerStyle = {
        position: 'absolute',
        bottom: '1em',
        right: '1em',
        zIndex: '200',
        background: '#111',
      };

      /** */
      this.w = w;
      this.h = h;

      this.id = 'texer.' + generateId();

      this.canvas = tag('canvas.texer', this.texerStyle);
      let panel = select('.gum-panel');
      if (panel) {
        panel.append(this.canvas);
      }

      this.canvas.width = w;
      this.canvas.height = h;

      this.ctx = this.canvas.getContext('2d');

      this.textureSettings = {
        width: w,
        height: h, 
        clamp: true,
        filter: 'NEAREST'
      };
      
      

      this.style = '#111';

      this._changed = false;
      this.fill(this.style);
      this.pixels(0, 0, w, h);
    }

    /**
     * Set the color to be used by the next 'pixels' call.
     */
    fill (col) {
      this.style = col;
      this.ctx.fillStyle = col;
      return this;
    }


    pixels (x1, y1, x2, y2) {
      this.ctx.fillRect(x1, y1, (x2 - x1), (y2 - y1));
      this._changed = true;
      return this;

    }

    clear () {
      this.pixels(0, 0, this.size, this.size);
      this._changed = true;
      return this;
    }


    changed () {
      const c = this._changed;
      this._changed = false;
      return c;
    }
  }

  /**
   * @file Manage the particle drawing 
   */


  class Instancer {

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

  /**
   * @file Index for GUM. Sets up the g name space and the Gum class.
   */

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
  class Gum {
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
      this.canvas = select(canvas);
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
      
      // Call on resize.
      this._onresize();

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
      this._imMatrix = create();

      /**
       * Keep a clean identity to reset shaders.
       */ 
      this._identity = create();
     
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
        'uView': create(),
        'uProjection': create(),
        'uAspect': this.w / this.h,
        'uScreenSize': [this.w, this.h],
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

      this._imageScaling = 'auto';

      this.shaders = shaders;
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
      if (color instanceof Color) {
        this.renderer.clear(color.rgba);
        return;
      }

      if (Array.isArray(color)) {
        this.renderer(clear(color));
      }
    }

    background (color) {
      this.clear(color);
    }


    /**
     * Set the size of the canvas.
     */ 
    size (w, h) {
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.w = w * this.pixelRatio;
      this.h = h * this.pixelRatio;
      this.renderer.resize(this.w, this.h);
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
      
      const color$1 = color(...args);
      this._usedColors[argString] = color$1;
      return color$1;
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
      
      identity(this._imMatrix);

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
        this._timeAtLastInfo = now;
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


    get imageScaling () {
      return this._imageScaling;
    }
    set imageScaling (val) {
      if (val.toUpperCase() === 'PIXELATED') {
        this.canvas.style.imageRendering = 'pixelated';
        this._imageScaling = 'PIXELATED';
      } else {
        this.canvas.style.imageRendering = 'auto';
        this._imageScaling = 'AUTO';
      }
    }


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
        this._axes = this.renderer.addMesh(_axes());
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

      let w = this.w;
      let h = this.h;

      if (settings.screenshot) {
        const { width, height } = settings.screenshot;
        w = width > 0 ? width : w;
        h = height > 0 ? height: h;
      }

      this.camera.aspect = w / h; 
      this.camera.updateViewProjection();

      this.globalUniforms['uNear'] = this.camera.near;
      this.globalUniforms['uFar'] = this.camera.far;
      this.globalUniforms['uEye'] = this.camera.eye;
      this.globalUniforms['uAspect'] = this.camera.aspect;
      this.globalUniforms['uScreenSize'] = [this.w, this.h];
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
          this.renderer.uniform('uScreenSize', [this.w, this.h]);
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


        const fsQuad = _fsQuad();
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

        lift = clamp(lift, 1, 180);

        const x = Math.sin(radians(lift)) * Math.cos(radians(theta));
        const z = Math.sin(radians(lift)) * Math.sin(radians(theta));
        const y = Math.cos(radians(lift));

        let pos = new Vec3(x,y,z).normalize(zoom);
        this.camera.move(...pos.xyz);
      };

      moveCam({}, true);

      this.canvas.onpointerdown = () => mouseDown = true;
      window.onpointerup = () => mouseDown = false;
      window.onmousemove = (e) => moveCam(e);

      canvas.onwheel = (e) => {

        zoom += e.deltaY * -0.1;
        zoom = clamp(zoom, 0.1, 30);
        moveCam(e, true);
      };
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
        targetObj[fn] = module[fn];
      } else if (typeof module[fn] === 'object') {
        targetObj[fn] = module[fn];
      }
    }
  }

  _inlineModule(common, Gum.prototype);
  _inlineModule(globals, Gum.prototype);
  _inlineModule(dom, Gum.prototype, 'dom');
  _inlineModule(primitives, Gum.prototype, 'shapes');
  _inlineModule(meshOps, Gum.prototype, 'meshops');

  exports.Gum = Gum;

  return exports;

})({});
