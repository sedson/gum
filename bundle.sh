node shaders/bundleShaders.js
rollup js/GUM.js --file gum.js --format iife --name "gum"
terser gum.js -o gum.min.js