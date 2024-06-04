/**
 * @file Color management.
 */

import { ColorDict } from './color-dict.js'
import { ColorSwatch } from './color-swatch.js';
import { lerp } from './common.js';

/* I like default black, but default white is arguably more useful. */
const defR = 0;
const defG = 0;
const defB = 0;
const defA = 1;


/**
 * A Color class with rgb and hsl state. Ideally colors are not mutable. To 
 * get a new color, create a new color. 
 */
class Color {
  /** 
   * Construct a Color from normalized rgba values. In general, API usage should 
   * discourage calling 'new Color()' and should rely on the color() generator.
   */
  constructor(r, g, b, a) {
    this._rgb = [r ?? defR, g ?? defG, b ?? defB];
    this._hsl = rgbToHsl(...this._rgb);
    this._a = a ?? defA;
    ColorSwatch(this.rgbString());
  }
  
  /**
   * The red value.
   * @member
   * @type {number}
   */
  get r() { return this._rgb[0]; }
  
  /**
   * The green value.
   * @member
   * @type {number}
   */
  get g() { return this._rgb[1]; }
  
  /**
   * The blue value.
   * @member
   * @type {number}
   */
  get b() { return this._rgb[2]; }

  /**
   * The hue value.
   * @member
   * @type {number}
   */
  get h() { return this._hsl[0]; }

  /**
   * The saturation value.
   * @member
   * @type {number}
   */
  get s() { return this._hsl[1]; }
  
  /**
   * The lightness value.
   * @member
   * @type {number}
   */
  get l() { return this._hsl[2]; }

  /**
   * The alpha value.
   * @member
   * @type {number}
   */
  get a() { return this._a };
  set a(a) { this._a = a; }
 
  /**
   * RGB as a plain array.
   * @member
   * @type {array}
   */
  get rgb() { return [...this._rgb]; }

  /**
   * RGBA as a plain array.
   * @member
   * @type {array}
   */
  get rgba() { return [...this._rgb, this._a]; }

  /**
   * HSL as a plain array.
   * @member
   * @type {array}
   */
  get hsl() { return [...this._hsl]; }
  
  /**
   * HSLA as a plain array.
   * @member
   * @type {array}
   */
  get hsla() { return [...this._hsl, this._a]; }

  set r(r) {
    this._rgb[0] = r;
    this._hsl = rgbToHsl(...this._rgb);
  }
  set g(g) {
    this._rgb[1] = g;
    this._hsl = rgbToHsl(...this._rgb);
  }
  set b(b) {
    this._rgb[2] = b;
    this._hsl = rgbToHsl(...this._rgb);
  }

  set h(h) {
    this._hsl[0] = h;
    this._rgb = hslToRgb(...this._hsl);
  }
  set s(s) {
    this._hsl[1] = s;
    this._rgb = hslToRgb(...this._hsl);
  }
  set l(l) {
    this._hsl[2] = l;
    this._rgb = hslToRgb(...this._hsl);
  }


  /**
   * Get the CSS-ready rgb or rgba string representation of this color.
   * @returns {string}
   */
  rgbString() {
    const r255 = Math.round(this._rgb[0] * 255);
    const g255 = Math.round(this._rgb[1] * 255);
    const b255 = Math.round(this._rgb[2] * 255);
    if (this._a === 1) {
      return `rgb(${r255}, ${g255}, ${b255})`;
    }
    return `rgba(${r255}, ${g255}, ${b255}, this._a)`;
  }


  /**
   * Get the CSS-ready hsl or hsla string representation of this color.
   * @returns {string}
   */
  hslString() {
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
   * @param {Color} other The other color.
   * @param {number} amt The aboumt to blend (0:1).
   * @param {string} mode The color space to blend in. Options are 'RGB' (default) and 
   *     'HSL'. 
   * @returns {Color}
   */
  blend(other, amt = 0.5, mode = 'RGB') {
    return blend(this, other, amt, mode);
  }

  /** 
   * Copy this color.
   * @returns {Color}
   */
  copy() {
    return new Color(...this.rgba);
  }

  /**
   * Hue shift.
   * @param {number} amt The amount of hue shift in degrees.
   * @returns {Color} A new color.
   */
  shiftHue(amt) {
    return new Color(...hslToRgb(this.h + amt, this.s, this.l, this.a));
  }

  /**
   * Lighten or darken the color.
   * @param {number} amt The lightness change. Positive for lighter. Negative for darker.
   *     Overall lightness is (0:100).
   * @returns {Color} A new color.
   */
  lighten(amt) {
    return new Color(...hslToRgb(this.h, this.s, this.l + amt, this.a));
  }

  /**
   * Saturate or desaturate the color.
   * @param {number} amt The saturation change. Positive for more. Negative for less.
   *     Overall saturation is (0:100).
   * @returns {Color} A new color.
   */
  saturate(amt) {
    return new Color(...hslToRgb(this.h, this.s + amt, this.l, this.a));
  }
}


/**
 * Create a new color. Accepts a hex value, an rgb(r255, g255, b255) string,
 * an hsl(h360, s100, l100) string, an array of 3 or 4 rgba[0->1] values, spread 
 * out versions of those values, or an existing color object. If no params 
 * passed get a random color.
 * @param {string} color The color.
 * @exampe 
 * const red = color('rgb(255, 0, 0)');
 * const yellow = color('#ffff00');
 * const randomColor = color();
 * @returns {Color}
 */
export function color(...args) {

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
  case 'HEX':
    return new Color(...hexToRgb(col, true));

  case 'RGB':
    return new Color(...strToRgb(col, true));

  case 'HSL':
    return new Color(hslToRgb(...strToHsl(col, true)));
  }

  return new Color(Math.random(), Math.random(), Math.random());
}



/**
 * Check if an array is a valid array of parse-able numbers with at least three
 * values.
 * @param {array} arr An array of potential color values. 
 * @returns {boolean} Whether the array is valid.
 * @private
 */
function validColorArray(arr) {
  if (Array.isArray(arr) && arr.length >= 3) {
    return arr.every(x => x !== '' && !isNaN(Number(x)));
  }
  return false;
}


/**
 * Get the color format from a string.
 * @param {string} str The input color string. 
 * @returns {string} 'HEX' | 'RGB' | 'HSL'.
 * @private
 */
function colorFormat(str) {
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
 * @private
 */
function extractNumbers(str) {
  const parts = str.replace(/[^0-9|\.]+/g, '-').split('-');
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
 * @private
 */
function strToRgb(str, normalized = true) {
  if (str.indexOf('rgb') === -1) { return [defR, defG, defB]; }

  const numbers = extractNumbers(str);
  if (numbers.length < 3) { return [defR, defG, defB]; }

  const m = normalized ? 1 / 255 : 1;
  const color = [
    numbers[0] * m,
    numbers[1] * m,
    numbers[2] * m,
  ];
  if (numbers[3] !== undefined) {
    color.push(numbers[3])
  }
  return color;
}


/**
 * Get hsl values from a string.
 * @param {string} str An hsl string.
 * @param {boolean} normalized If true return components in h[0->360] sl[0->1] 
 *     range. If not leave them in h[0->360] sl[0->100].
 * @returns {array<number>}
 * @private
 */
function strToHsl(str, normalized = true) {
  if (str.indexOf('hsl') === -1) { return [0, 0, 0]; }

  const numbers = extractNumbers(str);
  if (numbers.length < 3) { return [0, 0, 0]; }

  const m = normalized ? 1 / 100 : 1;
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
 * @private
 */
function hexToRgb(hex, normalized = true) {
  const h = hex.slice(1);
  const m = normalized ? (1 / 255) : 1;
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
export function hslToRgb(h = 0, s = 0, l = 0, a = 1) {
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
    r = c;
    g = x;
    b = 0;
  } else if (h1 < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (h1 < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (h1 < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (h1 < 5) {
    r = x;
    g = 0;
    b = c;
  } else if (h1 <= 6) {
    r = c;
    g = 0;
    b = x;
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
export function rgbToHsl(r = 0, g = 0, b = 0, a = 1) {
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
 * @returns {boolean}
 */
export function isColor(any) {
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
export function blend(src, target, amt = 0.5, mode = 'RGB') {
  switch (mode.toUpperCase()) {
  case 'RGB':
    return _blendRgb(src, target, amt);

  case 'HSL':
    return _blendHSL(src, target, amt);
  }
}


/**
 * Blend in RGB space.
 * @param {*} src 
 * @param {*} target 
 * @param {*} amt 
 * @private
 * @returns {Color}
 */
function _blendRgb(src, target, amt = 0.5) {
  if (!isColor(src) || !isColor(target)) {
    return new Color();
  }

  amt *= target.a;

  const r = lerp(src.r, target.r, amt);
  const g = lerp(src.g, target.g, amt);
  const b = lerp(src.b, target.b, amt);
  return new Color(r, g, b, src.a);
}

/**
 * Blend in HSL
 * @param {*} src 
 * @param {*} target 
 * @param {*} amt 
 * @private
 * @returns {Color}
 */
function _blendHSL(src, target, amt = 0.5) {
  if (!isColor(src) || !isColor(target)) {
    return new Color();
  }

  amt *= target.a;

  const h = lerp(src.h, target.h, amt);
  const s = lerp(src.s, target.s, amt);
  const l = lerp(src.l, target.l, amt);
  return new Color(...hslToRgb(h, s, l, src.a));
}

export { Color }