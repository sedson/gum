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
export function clamp (x, min = 0, max = 1) {
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
export function lerp (a, b, fac = 0.5) {
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
export function remap (x, min, max, outMin = 0, outMax = 1) {
  return clamp((x - min) / (max - min)) * (outMax - outMin) + outMin;
};


/**
 * Get a random value between 0 and 1 value or between 2 numbers.
 * @param {number} a The min.
 * @param {number} b The max.
 * @returns {number} The random number.
 * @global
 */
export function random(a = 1, b) {
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
export function degrees (radians) {
  return 180 * radians / Math.PI;
}


/**
 * Convert a number from degrees to radians.
 * @param {number} degrees 
 * @returns {number}
 */
export function radians (degrees) {
  return Math.PI * degrees / 180;
}


export function generateId() {
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
}