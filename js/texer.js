/**
 * A texer is a simple dynamic canvas that can be used as a texture for the 3d 
 * scene.
 */

import * as dom from './dom-utils.js'
import { generateId } from './common.js';

export class Texer {
  
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

    this.canvas = dom.tag('canvas.texer', this.texerStyle);
    dom.select('.felt-panel').append(this.canvas);

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