node shaders/bundleShaders.js
rollup js/GUM.js --file dist/gum.js --format iife --name "GUM3D"
rollup js/GUM.js --file dist/gum.module.js --format es --name "GUM3D"
terser dist/gum.js -o dist/gum.min.js