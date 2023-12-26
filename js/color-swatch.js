import * as dom from './dom-utils.js';

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

export function ColorSwatch (color) {

  let container = dom.select('#swatches');
  if (!container) {
    container = dom.tag('div#swatches.gum-swatches', containerStyle);
    const panel = dom.select('.gum-panel');
    if (panel) {
      panel.append(container);
    }
  }

  const swatch = dom.tag('div.swatch', swatchStyle);
  dom.style(swatch, { backgroundColor: color });
  container.append(swatch);
  return swatch;
}

