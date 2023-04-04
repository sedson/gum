/**
 * @file Dom utilities.
 */


/**
 * Proxy for document.querySelector.
 * @param {string} tag A selector.
 * @returns {HTMLElement|false}
 */
export function select (tag) {
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
export function tag (string, styleObject) {
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

  if (styleObject) { style(elem, styleObject) };
  return elem;
}


/**
 * Apply styles from a js object to an element.
 * @param {HTMLElement} elem The html element.
 * @param {object} styleObject The style object – with keys is either js 
 *     camelCase form or string wrapped 'background-color' css form.
 */
export function style (elem, styleObject) {
  for (const property in styleObject) {
    elem.style[property] = styleObject[property];
  }
}