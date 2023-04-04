/**
 * @file Bundle all the separate shader files into a js module.
 */

const fs = require('fs');
console.time('Bundle Shaders');

let bundled = ''
bundled += '/**\n';
bundled += ' * The available shaders. File created by bundleShaders.js.\n';
bundled += ' * To edit shaders, edit the source and re-bundle.\n'
bundled += ' */';
bundled += '\n\n';
bundled += 'export const shaders = ';


// Make an object to dump the shader file contents into.
const shaders = {};


/**
 * Register a shaded based on its file name.
 * @param {string} fileName 
 * @param {string} fileContents 
 */
function registerShader (fileName, fileContents) {
  const [name, step] = fileName.split('.');
  if (shaders[name]) {
    shaders[name][step] = fileContents;
  } else {
    const shader = {};
    shader[step] = fileContents;
    shaders[name] = shader;
  }
}

const dir = __dirname;

for (const file of fs.readdirSync(dir)) {
  // Ignore js files.
  if (file.indexOf('.js') > -1) { continue; }
  const contents = fs.readFileSync(dir + '/' + file, {encoding: 'utf-8'});
  registerShader(file, contents);
}

bundled += JSON.stringify(shaders, null, 2);
bundled += ';\n';

fs.writeFileSync(dir + '/shaders.js', bundled);
fs.writeFileSync(dir + '/../js/shaders.js', bundled);
console.timeEnd('Bundle Shaders');
