// const editor = document.getElementById('editor');

import { Project } from './project.js';
import { Gum } from '/js/GUM.js';


// const { Gum } = GUM3D;

const getId = () => performance.now() % 2347;


let editorPanel;
let gumPanel;
let mainCanvas;
let codeMirror;
let g;
let currentProject;

function stripImport (text) {
  return text.split('\n').filter(x => x.indexOf('import') === -1).join('\n');
} 

function main () {
  editorPanel = document.querySelector('.playground-editor-container');
  gumPanel = document.querySelector('.gum-panel');
  codeMirror = Editor(editorPanel);
  loadCurrent();

  document.getElementById('run').onclick = run;
  document.getElementById('save').onclick = saveLocal;

}


function setEditor (code) {
   codeMirror.dispatch({changes: {
    from: 0,
    to: codeMirror.state.doc.length,
    insert: code
  }});
}


async function loadCurrent (url) {

  const cachedProject = localStorage.getItem('cachedProject');
  if (cachedProject) {
    currentProject = new Project(JSON.parse(cachedProject)); 
    setEditor(currentProject.codeFiles.main);
    run();
    return;

  }
  
  const defaultProject = new Project(getId());
  console.log({defaultProject})

  let res = await fetch('boilerplate.js');
  let text = await res.text();
  text = stripImport(text);
  defaultProject.codeFiles.main = text;
  currentProject = defaultProject;
  setEditor(text);
  run();
}

function saveLocal () {
  currentProject.thumbnail = g ? g.screenshot(100, 100) : '';
  currentProject.codeFiles.main = codeMirror.state.doc.toString();
  console.log(currentProject.toJSON())
  localStorage.setItem('cachedProject', currentProject.toJSON());
}

function run () {
  if (mainCanvas) {
    mainCanvas.remove();
  }

  if (g) {
    g.dispose();
    g.tick = () => {};
  }

  gumPanel.innerHTML = '';

  mainCanvas = document.createElement('canvas');
  mainCanvas.style.imageRendering = 'pixelated';
  mainCanvas.id = 'canvas';
  gumPanel.append(mainCanvas);

  g = new Gum('#canvas', 200, 200, { pixelRatio: 1 });

  let appCode = codeMirror.state.doc.toString();

  appCode += `\nreturn {
    setup: setup ?? (() => false),
    draw: draw ?? (() => false),
  };`

  const { setup, draw } = Function('g', appCode)(g);
  g.run(setup, draw);
  window.g = g;
}

window.addEventListener('DOMContentLoaded', main);





const keyBindings = {
  '82' : run, // r 
  '83' : saveLocal // s
}


window.addEventListener('keydown', (e) => {
  // if (e.target !== document.body) return;

  if (!e.ctrlKey) return;

  if (!keyBindings[e.keyCode]) return;

  keyBindings[e.keyCode]();

})
