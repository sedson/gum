import * as dom from './dom-utils.js';

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

export function SceneGraph () {
  let graph = dom.tag('div#scene-graph', graphStyle);
  document.body.append(graph);
  return graph;
}

