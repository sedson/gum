var gum = (function (exports) {
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

  const ColorDict = {
    'hermosapink': '#ffb3f0',
    'corinthianpink': '#ffa6d9',
    'cameopink': '#e6adcf',
    'fawn': '#d1b0b3',
    'lightbrowndrab': '#b08699',
    'coralred': '#ff7399',
    'freshcolor': '#ff788c',
    'grenadinepink': '#ff616b',
    'eosinepink': '#ff5ec4',
    'spinelred': '#ff4dc9',
    'oldrose': '#d94d99',
    'eugeniareda': '#ed3d66',
    'eugeniaredb': '#e62e73',
    'rawsienna': '#b85e00',
    'vinaceoustawny': '#c74300',
    'jasperred': '#fa2b00',
    'spectrumred': '#f20000',
    'redorange': '#e81900',
    'etruscanred': '#c9303e',
    'burntsienna': '#a93400',
    'ochrered': '#a7374b',
    'scarlet': '#d50c42',
    'carmine': '#d60036',
    'indianlake': '#cc1a97',
    'rosolancpurple': '#b319ab',
    'pomegranitepurple': '#b90078',
    'hydrangeared': '#9e194d',
    'brickred': '#a32100',
    'carminered': '#a10b2b',
    'pompeianred': '#a90636',
    'red': '#a10045',
    'brown': '#6c2b11',
    'haysrusset': '#681916',
    'vandykered': '#740909',
    'pansypurple': '#6f0043',
    'paleburntlake': '#730f1f',
    'violetred': '#3d0079',
    'vistorislake': '#5c2c45',
    'sulpheryellow': '#f5f5b8',
    'palelemonyellow': '#fff59e',
    'naplesyellow': '#faed8f',
    'ivorybuff': '#ebd999',
    'seashellpink': '#ffcfc4',
    'lightpinkishcinnamon': '#ffbf99',
    'pinkishcinnamon': '#f2ad78',
    'cinnamonbuff': '#ffbf6e',
    'creamyellow': '#ffb852',
    'goldenyellow': '#fa9442',
    'vinaceouscinnamon': '#f59994',
    'ochraceoussalmon': '#d99e73',
    'isabellacolor': '#c3a55c',
    'maple': '#c2975a',
    'olivebuff': '#bcd382',
    'ecru': '#c0b490',
    'yellow': '#ffff00',
    'lemonyellow': '#f2ff26',
    'apricotyellow': '#ffe600',
    'pyriteyellow': '#c4bf33',
    'oliveocher': '#d1bd19',
    'yellowocher': '#e0b81f',
    'orangeyellow': '#ffab00',
    'yelloworange': '#ff8c00',
    'apricotorange': '#ff7340',
    'orange': '#ff5200',
    'peachred': '#ff3319',
    'englishred': '#de4500',
    'cinnamonrufous': '#c2612c',
    'orangerufous': '#c05200',
    'sulphineyellow': '#baa600',
    'khaki': '#b68400',
    'citronyellow': '#a6d40d',
    'buffycitrine': '#888d2a',
    'darkcitrine': '#7e8743',
    'lightgrayisholive': '#76844e',
    'krongbergsgreen': '#759243',
    'olive': '#718600',
    'orangecitrine': '#8c6510',
    'sudanbrown': '#9b5348',
    'olivegreen': '#58771e',
    'lightbrownisholive': '#706934',
    'deepgrayisholive': '#505423',
    'palerawumber': '#5e4017',
    'sepia': '#503d00',
    'madderbrown': '#651300',
    'marsbrowntobacco': '#522000',
    'vandykebrown': '#362304',
    'turquoisegreen': '#b5ffc2',
    'glaucousgreen': '#b3e8c2',
    'darkgreenishglaucous': '#b3d9a3',
    'yellowgreen': '#a6ff47',
    'lightgreenyellow': '#bdf226',
    'nightgreen': '#7aff00',
    'oliveyellow': '#99b333',
    'artemesiagreen': '#65a98f',
    'andovergreen': '#5c8a73',
    'rainettegreen': '#85b857',
    'pistachiogreen': '#56aa69',
    'seagreen': '#33ff7d',
    'benzolgreen': '#00d973',
    'lightporcelaingreen': '#23c17c',
    'green': '#40c945',
    'dullviridiangreen': '#19cc33',
    'oilgreen': '#6ea900',
    'diaminegreen': '#1b8e13',
    'cossackgreen': '#328e13',
    'lincolngreen': '#405416',
    'blackisholive': '#324e2a',
    'deepslateolive': '#172713',
    'nileblue': '#bfffe6',
    'palekingsblue': '#abf5ed',
    'lightglaucousblue': '#a6e6db',
    'salviablue': '#96bfe6',
    'cobaltgreen': '#94ff94',
    'calamineblue': '#80ffcc',
    'venicegreen': '#6bffb3',
    'cerulianblue': '#29bdad',
    'peacockblue': '#00cf91',
    'greenblue': '#2dbc94',
    'olympicblue': '#4f8fe6',
    'blue': '#0d75ff',
    'antwarpblue': '#008aa1',
    'helvetiablue': '#0057ba',
    'darkmediciblue': '#417777',
    'duskygreen': '#00592e',
    'deeplyonsblue': '#0024cc',
    'violetblue': '#202d85',
    'vandarpoelsblue': '#003e83',
    'darktyrianblue': '#0d2b52',
    'dullvioletblack': '#06004f',
    'deepindigo': '#000831',
    'deepslategreen': '#0f261f',
    'grayishlavendera': '#b8b8ff',
    'grayishlavenderb': '#bfabcc',
    'laeliapink': '#cc85d1',
    'lilac': '#b875eb',
    'eupatoriumpurple': '#bf36e0',
    'lightmauve': '#9161f2',
    'aconiteviolet': '#9c52f2',
    'dullblueviolet': '#6e66d4',
    'darksoftviolet': '#4d52de',
    'blueviolet': '#4733ff',
    'purpledrab': '#754260',
    'deepvioletplumbeous': '#5c7287',
    'veroniapurple': '#7e3075',
    'darkslatepurple': '#53225c',
    'taupebrown': '#6b2e63',
    'violetcarmine': '#531745',
    'violet': '#2619d1',
    'redviolet': '#3400a3',
    'cotingapurple': '#340059',
    'duskymadderviolet': '#2d0060',
    'white': '#ffffff',
    'neutralgray': '#b5d1cc',
    'mineralgray': '#9fc2b2',
    'warmgray': '#9cb29e',
    'slatecolor': '#1b3644',
    'black': '#000000',
  };

  const containerStyle = {
    display: 'flex',
    position: 'fixed',
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
      container = tag('div#swatches', containerStyle);
      document.body.append(container);
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
        return blendRGB_(src, target, amt);

      case 'HSL' :
        return blendHSL_(src, target, amt);
    }
  }



  function blendRGB_ (src, target, amt = 0.5) {
    if (!isColor(src) || !isColor(target)) {
      return new Color();
    }

    amt *= target.a;

    const r = lerp(src.r, target.r, amt);
    const g = lerp(src.g, target.g, amt);
    const b = lerp(src.b, target.b, amt);
    return new Color(r, g, b, src.a);
  }


  function blendHSL_ (src, target, amt = 0.5) {
    if (!isColor(src) || !isColor(target)) {
      return new Color();
    }

    amt *= target.a;

    const h= lerp(src.h, target.h, amt);
    const s = lerp(src.s, target.s, amt);
    const l = lerp(src.l, target.l, amt);
    return new Color(...hslToRgb(h, s, l, src.a));
  }



  window.Color = Color;

  /**
   * The available shaders. File created by bundleShaders.js.
   * To edit shaders, edit the source and re-bundle.
   */

  const shaders = {
    "default": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nin vec4 vColor;\nout vec4 fragColor;\n\nvoid main() {\n  fragColor = vec4(vColor.rgb, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nin vec4 aPosition;\nin vec4 aColor;\n\nout vec4 vColor;\n\n\nvoid main() \n{\n  mat4 modelView = uView * uModel;\n  gl_Position = uProjection * uView * uModel * aPosition;\n  vColor = aColor;\n}"
    },
    "geo": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform vec3 uEye;\nuniform vec4 uColor;\n\nin vec4 vWorldPosition;\nin vec4 vColor;\nin vec3 vWorldNormal;\nin vec3 vViewNormal;\nin vec3 vSurfaceId;\nin float vDepth;\nin float vId;\n\nout vec4 fragColor;\n\nvoid main() {\n  vec3 lightDir = normalize(vec3(3.0, 4.0, 2.0));\n  float nDotL = clamp(dot(vWorldNormal, lightDir), 0.0, 1.0);\n  float light = clamp(smoothstep(0.1, 0.4, nDotL) + 0.8, 0.0, 1.0);\n  float nDotV = dot(vViewNormal, vec3(0.0, 0.0, 1.0));\n\n  fragColor = vec4(vId, nDotV, nDotL, 1.0);\n\n  fragColor = vec4(vViewNormal * 0.5 + 0.5, 1.0);\n  fragColor = vec4(vSurfaceId, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\nuniform float uNear;\nuniform float uFar;\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec4 aColor;\n\nin vec4 aNormal;\nin float aSurfaceId;\n\nout vec4 vWorldPosition;\nout vec4 vColor;\nout vec3 vWorldNormal;\nout vec3 vViewNormal;\nout vec3 vSurfaceId;\nout float vDepth;\nout float vId;\n\n/**\n *\n */\nvec3 hashId(float id) {\n  float r = fract(mod(id * 25738.32498, 456.221));\n  float g = fract(mod(id * 565612.08321, 123.1231));\n  float b = fract(mod(id * 98281.32498, 13.221));\n  return vec3(r, g, b);\n}\n\n/**\n *\n */\nvoid main() {\n  gl_PointSize = 4.0;\n  mat4 modelView = uView * uModel;\n  mat3 normMatrix = transpose(inverse(mat3(modelView)));\n  vViewNormal = normalize(normMatrix * aNormal.xyz);\n  vWorldNormal = normalize(mat3(uModel) * aNormal.xyz);\n  vColor = aColor;\n\n  gl_Position = uProjection * uView * uModel * aPosition;\n\n  vec3 rounded = round(gl_Position.xyz * 10.0) / 10.0;\n  // gl_Position.xyz = rounded;\n\n  float id = mod(aSurfaceId + uObjectId, 255.0);\n  vId = id / 255.0 + (1.0 / 255.0);\n\n  vSurfaceId = hashId(aSurfaceId + uObjectId);\n\n  vWorldPosition = gl_Position;\n}"
    },
    "post-chromatic": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uTexSize;\nuniform float uNear;\nuniform float uFar;\n\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\n\nvoid main() {\n  vec2 rOff = vec2(0.0, 4.0);\n  vec2 gOff = vec2(0.0, 0.0);\n  vec2 bOff = vec2(4.0, 0.0);\n  vec2 pixelSize = 1.0 / uTexSize;\n  vec4 col = texture(uMainTex, vTexCoord);\n\n  fragColor = col;\n  float r = texture(uMainTex, vTexCoord + (pixelSize * rOff)).r;\n  float g = texture(uMainTex, vTexCoord + (pixelSize * gOff)).g;\n  float b = texture(uMainTex, vTexCoord + (pixelSize * bOff)).b;\n\n  fragColor.rgb = vec3(r, g, b);\n\n  // vec2 uv = vTexCoord;\n  // uv *= 1.0 - uv.xy;\n\n  // float vig = uv.x * uv.y * 15.0;\n\n  // vig = pow(vig, 0.03);\n\n  // fragColor.rgb *= vig;\n}"
    },
    "post-outline": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uMainTex;\nuniform sampler2D uDepthTex;\nuniform vec2 uTexSize;\nuniform float uNear;\nuniform float uFar;\n\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nfloat linearDepth(float d, float near, float far) {\n  float z = d * 2.0 - 1.0;\n  return (2.0 * near * far) / (far + near - d * (far - near)) / far;\n}\n\nvec4 gradient(sampler2D tex, vec2 coord) {\n  vec2 offset = vec2(1.0, 1.0) / uTexSize;\n\n  vec4 xSum = vec4(0.0);\n  vec4 ySum = vec4(0.0);\n\n  xSum += texture(tex, coord + vec2(-offset.x, 0.0)) * -1.0;\n  xSum += texture(tex, coord + vec2(+offset.x, 0.0));\n\n  ySum += texture(tex, coord + vec2(0.0, -offset.y)) * -1.0;\n  ySum += texture(tex, coord + vec2(0.0, +offset.y));\n\n  return sqrt(xSum * xSum + ySum * ySum);\n}\n\nvoid main() {\n  vec4 col = texture(uMainTex, vTexCoord);\n  float depth = texture(uDepthTex, vTexCoord).r;\n  float lDepth = linearDepth(depth, uNear, uFar);\n\n  vec4 colGrad = gradient(uMainTex, vTexCoord);\n  vec4 depthGrad = gradient(uDepthTex, vTexCoord);\n\n  float idQ = mix(colGrad.r, 0.0, smoothstep(0.0, 0.3, lDepth));\n\n  float idEdge = step(0.0001, colGrad.x);\n\n  float depthQ = mix(0.0, 100.0, smoothstep(0.0, 0.01, col.g));\n\n  float depthEdge = step(0.01, depthGrad.r);\n\n  float normEdge = step(0.3, colGrad.g);\n\n  float edge = max(idEdge, depthEdge);\n\n  vec3 grad = vec3(idEdge, depthEdge, 0.0);\n\n  float fog = smoothstep(4.0, 40.0, lDepth * (uFar - uNear));\n\n  // float surfaceId = round(col.r * 20.0);\n  fragColor.rgb = mix(vec3(0.2, 0.2, 0.2), vec3(0.6, 0.5, 0.5), 1.0 - fog);\n  // fragColor.rgb *= 1.0 - ((1.0 - fog) * edge);\n  // fragColor.a = 1.0;\n\n  fragColor = vec4(vec3(edge * 0.4 + 0.1), 1.0);\n\n  // fragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\n  // fragColor = vec4(mix(vec3(1.0, 1.0, 0.2), vec3(0.1, 0.1, 0.1), edge), 1.0);\n\n  // fragColor = vec4(1.0, 0.0, 0.0, 1.0);\n  // fragColor = vec4(vec3(idEdge), 1.0);\n  // fragColor = vec4(colGrad.ggg, 1.0);\n  // fragColor = vec4(1.0, 0.0, 1.0, 1.0);\n  // fragColor = vec4(vec3(fog), 1.0);\n\n}"
    },
    "post": {
      "vert": "#version 300 es\n\nin vec2 aPosition;\nout vec2 vTexCoord;\n\nvoid main() {\n  vTexCoord = (aPosition + 1.0) / 2.0;\n  gl_Position = vec4(aPosition, 0.0, 1.0);\n}"
    },
    "textured": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D uTex;\n\nin vec4 vColor;\nin vec2 vTexCoord;\nout vec4 fragColor;\n\nvoid main() {\n  fragColor.rg = vTexCoord;\n  fragColor.a = 1.0;\n\n  fragColor = texture(uTex, vTexCoord);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec3 aNormal;\nin vec2 aTexCoord;\nin vec4 aColor;\nin float aSurfaceId;\n\nout vec4 vColor;\nout vec2 vTexCoord;\n\nvec3 hashId(float id) {\n  float r = fract(mod(id * 25738.32498, 456.221));\n  float g = fract(mod(id * 565612.08321, 123.1231));\n  float b = fract(mod(id * 98281.32498, 13.221));\n  return vec3(r, g, b);\n}\n\nvoid main() {\n  mat4 modelView = uView * uModel;\n  gl_Position = uProjection * uView * uModel * aPosition;\n  vColor = aColor;\n  vTexCoord = aTexCoord;\n}"
    },
    "unlit": {
      "frag": "#version 300 es\n\nprecision mediump float;\n\nin vec4 vColor;\nout vec4 fragColor;\n\nvoid main() {\n  fragColor = vec4(vColor.rgb, 1.0);\n}",
      "vert": "#version 300 es\n\nuniform mat4 uModel;\nuniform mat4 uView;\nuniform mat4 uProjection;\n\nuniform float uObjectId;\n\nin vec4 aPosition;\nin vec3 aNormal;\nin vec4 aColor;\nin float aSurfaceId;\n\nout vec4 vColor;\n\nvec3 hashId (float id) \n{\n  float r = fract(mod(id * 25738.32498, 456.221));\n  float g = fract(mod(id * 565612.08321, 123.1231));\n  float b = fract(mod(id * 98281.32498, 13.221));\n  return vec3(r, g, b);\n}\n\nvoid main() \n{\n  mat4 modelView = uView * uModel;\n  gl_Position = uProjection * uView * uModel * aPosition;\n  \n\n  vec3 vertexColor = aColor.rgb;\n  vec3 localNormal = aNormal.rgb * 0.5 + 0.5;\n  vec3 surfaceId = hashId(uObjectId + aSurfaceId);\n\n  vColor.a = 1.0;\n  vColor.rgb = vertexColor;\n}"
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
    console.log(outEdges);
    return outEdges;
  }

  var meshOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    applyAttribConstant: applyAttribConstant,
    applyAttribVarying: applyAttribVarying,
    facesToEdges: facesToEdges,
    findGroups: findGroups,
    triangulate: triangulate,
    validate: validate,
    verticesToNormals: verticesToNormals
  });

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
      const triangles   = triangulate(this.faces);
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

      const name = this.name;
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

      const name = this.name + '_edges';
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

      const name = this.name + '_points';
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

      const name = this.name + '_normals';
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

    
  }

  /**
   * @file Provide geometric primitives.
   */


  /**
   * Make a cube shape.
   * @param {number} size The size of the cube.
   * @return {object} A vertex attribute array.
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
        {position: positions[a], normal, color, texCoord: [0, 0]},
        {position: positions[b], normal, color, texCoord: [1, 0]},
        {position: positions[c], normal, color, texCoord: [1, 1]},
        {position: positions[d], normal, color, texCoord: [0, 1]},
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
   * Make a icosphere shape.
   * @param {number} size The radius of the sphere.
   * @param {number} level The subdivision level to use.
   * @param {boolean} flat Whether to use flat shading. Default smooth (false).
   * @return {object} A vertex attribute array.
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
      [0, 8, 4], //*
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
     * 
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
   * Make a quad. Faces UP along y axis.
   * @param {number} size The size of the quad.
   * @return {object} A vertex attribute array.
   */ 
  function quad (size) {
    const s = size / 2;
    const positions = [
      new Vec3(-s, 0, -s),
      new Vec3(+s, 0, -s),
      new Vec3(+s, 0, +s),
      new Vec3(-s, 0, +s),
    ];
    
    const faces = [[0, 2, 1,], [0, 3, 2]];
    const vertices = positions.map(pos => {
      return { position: pos.xyz, normal: [0, 1, 0] };
    });

    return new Mesh(vertices, faces, { name: 'quad' });
  }




  /**
   * Make a full screen quad for rendering post effects..
   * @return {object} A vertex attribute array.
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
   * Make a quad. Faces UP along y axis.
   * @param {number} size The size of the quad.
   * @return {object} A vertex attribute array.
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
    cube: cube,
    icosphere: icosphere,
    quad: quad
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
  function perspective(out, fovy, aspect, near, far) {
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
  function translate(out, a, v) {
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
  function rotate(out, a, rad, axis) {
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
  function identity(out) {
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
  function multiply(out, a, b) {
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
  function copy(out, a) {
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
   * 
   */


  class Transform {
    constructor () {
      this.position = new Vec3();
      this.rotation = new Vec3();
      this.scale = new Vec3(1, 1, 1);
      this._matrix = create();
      this._changed = false;
    }

    _updateMatrix() {
      identity(this._matrix);
      translate(this._matrix, this._matrix, this.position.xyz);
      rotate(this._matrix, this._matrix, this.rotation.x, [1, 0, 0]);
      rotate(this._matrix, this._matrix, this.rotation.y, [0, 1, 0]);
      rotate(this._matrix, this._matrix, this.rotation.z, [0, 0, 1]);
      scale(this._matrix, this._matrix, this.scale.xyz);
    }

    get changed() {
      if (this.rotation._changed || this.position._changed || this.scale._changed) {
        this.position._changed = false;
        this.rotation._changed = false;
        this.scale._changed = false;
        return true;
      }
      return false;
    }

    get matrix() {
      if (this.changed) {
        this._updateMatrix();
      }
      return this._matrix;
    }
  }

  /**
   * A single node (gameObject).
   */


  class Node {

    constructor(name, geometry, transform) {
      this.name = name;
      this.id = this.generateId();
      this.geometry = geometry || null;
      this.transform = transform || new Transform();
      this.visible = true;
      this.parent = null;
      this.children = [];
      this._worldMatrix = create();
      this.uniforms = {};
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


    scale (x) {
      this.transform.scale.set(x, x, x);
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


    generateId () {
      let id = '';
      for (let i = 0; i < 4; i++) {
        id += Math.floor(Math.random() * 10);
      }
      return id;
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
      output += `<em>${this.name}</em> : ${geometry}`;
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
        drawList.push({
          name: this.name,
          geometry: this.geometry,
          uniforms: {
            uModel: this._worldMatrix,
            uObjectId: this.id,
            uTex: this.texture || 'none',
          }
        });
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

      this.updateViewProjection();
    }

    get eye () { return this.worldPosition }
    set aspect (val) { this._aspect = val; }


    updateViewProjection () {
      lookAt(this.view, this.eye, this.target.xyz, [0, 1, 0]);
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
    overflow: 'hidden',
    whiteSpace: 'pre',
    padding: '1em',
  };

  function SceneGraph () {
    let graph = tag('div#scene-graph', graphStyle);
    document.body.append(graph);
    return graph;
  }

  /**
   * A shared layout for vertex attributes. Not every shader has to implement 
   * these attribs, but any that it does have will be forced to use the same 
   * layout.
   */
  const vertexAttributeLayout = {
    
    'aPosition': {
      index: 0,
      size: 3,
      type: 'FLOAT',
      normalized: false,
    },

    'aNormal': {
      index: 1,
      size: 3,
      type: 'FLOAT',
      normalized: false,
    },

    'aTexCoord': {
      index: 2,
      size: 2,
      type: 'FLOAT',
      normalized: false,
    },
    
    'aColor': {
      index: 3,
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },

    'aSurfaceId': {
      index: 4,
      size: 1,
      type: 'FLOAT',
      normalized: false,
    },

    'aRegister1': {
      index: 5, 
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },

    'aRegister2': {
      index: 6,
      size: 4,
      type: 'FLOAT',
      normalized: false,
    },
  };

  /**
   * @fileoverview The RenderContext class creates a helpful level of abstraction 
   *     between an app and the web gl rendering context.
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
        return;
      }
      
      if (this.activeProgram === program) {
        return;
      }

      this.gl.useProgram(this.shaderPrograms[program]);
      this.activeProgram = program;
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
    draw (mesh) {
      if (!this.meshes[mesh]) {
        return;
      }

      const call = this.meshes[mesh];
      this.gl.bindVertexArray(call.vao);
      this.gl.drawArrays(this.gl[call.data.mode], 0, call.data.vertexCount);
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
      for (const [attrib, info] of Object.entries(vertexAttributeLayout)) {
        this.gl.bindAttribLocation(program, info.index, attrib);
      }
    }
    

    _bufferAttribs (vao, attribs) {
      const gl = this.gl;

      gl.bindVertexArray(vao);

      for (const [attrib, data] of Object.entries(attribs)) {

        const attribName = this._prefixAttribName(attrib);
        const attribInfo = vertexAttributeLayout[attribName];
        
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
      let postFix = '';
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
      mesh.vao = this.gl.createVertexArray();

      this._bufferAttribs(mesh.vao, data.attribs);
      
      this.meshes[name] = mesh;
      return name;
    }


    updateMesh (name, data) {
      if (!this.meshes[name]) {
        return;
      }

      const mesh = this.meshes[name];
      this.gl.deleteVertexArray(mesh.vao);

      mesh.data = data;
      mesh.vao = this.gl.createVertexArray();
      
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
        this.gl[this.uniformTypes[type]](location, false, value);
        return;
      }

      // Allow the user to pass the name of the texture as a uniform value.
      if (typeof value === 'string' && this.texturesByName[value] !== undefined) {
        const unit = this.texturesByName[value].unit;
        this.gl[this.uniformTypes[type]](location, unit);
        return;
      }

      this.gl[this.uniformTypes[type]](location, value);
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
      if (this.textureUnitIndex >= 7) { return; }

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
          const { bytes, getter } = this.PLY_TYPES[type];
          vertex.push(view[getter](byteIndex, littleEndian));
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
    constructor (size, feltApp) {

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
      this.size = size;

      this.id = 'texer.' + generateId();

      this.canvas = tag('canvas.texer', this.texerStyle);
      select('.felt-panel').append(this.canvas);

      this.canvas.width = size;
      this.canvas.height = size;

      this.ctx = this.canvas.getContext('2d');

      this.textureSettings = {
        width: size,
        height: size, 
        clamp: true,
        filter: 'NEAREST'
      };
      
      

      this.style = '#111';

      this._changed = false;
      this.fill(this.style);
      this.pixels(0, 0, size, size);
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
   * @file Index for GUM. Sets up the g name space and the Gum class.
   */


  /**
   * The g (gum tools) namespace provides all the helpful ~static~ functions 
   * to do cool things inside a gum app.
   * @namespace
   */
  const g = {
    sin: Math.sin, 
    cos: Math.cos,
    vec2: (x, y) => new Vec2(x, y),
    vec3: (x, y, z) =>  new Vec3(x, y, z),
    Vec2: Vec2,
    Vec3: Vec3,
    Mesh: Mesh,
    Texer: Texer,
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
    
    const color$1 = color(...args);
    this._usedColors[argString] = color$1;
    return color$1;
  }.bind(g);



  /**
   * The class for one instance of Gum. It has a renderer, a scene-graph, etc.
   */
  class Gum {
    constructor (canvas, w, h, settings) {
      settings = settings || {};

      /**
       * The canvas.
       * @type {HTMLCanvasElement}
       */
      this.canvas = select(canvas);

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
      this._imMatrix = create();
     
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
      if (color instanceof Color) {
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
      
      identity(this._imMatrix);

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
        this._timeAtLastInfo = now;
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
      this._axesMesh = this.renderer.addMesh(_axes());
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
        const fsQuad = _fsQuad();
        fsQuad.name = 'effect-quad';
        this.renderer.addMesh(fsQuad);
        this.renderer.renderTargets['default'] = targetInfo;
      }

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
      this.renderer.drawMesh(mesh);
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

  exports.Gum = Gum;
  exports.g = g;

  return exports;

})({});
