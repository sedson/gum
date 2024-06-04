node shaders/bundleShaders.js
rollup js/GUM.js --file gum.js --format iife --name "GUM3D"
rollup js/GUM.js --file gum.module.js --format es --name "GUM3D"
terser gum.js -o gum.min.js