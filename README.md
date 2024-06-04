# Gum

Gum is a JavaScript and WebGL library for creative coding in 3D. Gum is great if you're interested in building up from light-weight abstractions and writing your own shaders. Gum is less great if you want out-of-the box support for advanced 3D features like physically-based rendering or animation support.

![grid](https://github.com/user-attachments/assets/81d7c8d2-a24e-4218-a1c8-62a5d9638d7c)

## Disclaimer/other WebGL Libraries

Gum is a personal project to scaffold my own expriements with WebGL. The API is not stable and I am still actively (though slowly) iterating on core functions. The library is pretty small (~170kb with comments, pre min-zip) and pretty flexible, but other projects might suit your needs better. 

- [three.jS](https://threejs.org/) is obviously the go-to. Its extremely well featured, has fantastic documentation, and is backed a ton of great learning resources.
- [ogl](https://github.com/oframe/ogl) is a minimal WebGL library.
- [twgl](https://github.com/greggman/twgl.js) is really minimal.

## Importing Gum

I want Gum to be easy to include in projects without a bundler. You can grab it from `/dist` in one of two formats:

#### Script (IIFE)
Grab `/dist/gum.js` (or `/dist/gum.min.js` if you want it minified) and include it as an script tag before your own script. This will attach a global `GUM3D` object to the window.
```html
<script type="text/javascript" src="/dist/gum.js"></script>
<script type="text/javascript">
  // GUM3D is attached to the window. GUM3D.Gum constructs a new Gum instance.
  const g = new GUM3D.Gum("#my-canvas", { width: 512, height: 512 });
  g.clear(g.color("#00f"));
</script>
```

#### Module
Grab `/dist/gum.module.js` and import the `Gum` class inside a JavaScript module.
```html
<script type="module">
  // Import the Gum constructor.
  import { Gum } from "/dist/gum.module.js";
  
  const g = new Gum("#my-canvas", { width: 512, height: 512 });
  g.clear(g.color("#00f"));
</script>
```

The module file comes with JSDoc comments. This means that it plays pretty nicely with JavaScript/TypeScript LSPs and other autocomplete tooling.


## Example

Here's a tiny example showing a bit of the current API. Gum borrows the `setup` and `draw` pattern from Processing.

```javascript
import { Gum } from "/dist/gum.module.js";

// Create a new Gum instance.
const g = new Gum("#canvas", { width: 512, height: 512 });

// Create a cube. This holde the mesh in JS memory.
const cube = g.shapes.cube(1)
  .fill(g.color("#0ad"));

// Send the mesh data to the GPU, and get back a pointer to it.
const mesh = g.mesh(cube);

// Nothing to set up here.
function setup() {}

// Draw something.
function draw() {
  g.camera.move(2, 2, 2);
  g.clear(g.color("#222"));
  g.axes();
  g.drawMesh(mesh);
}

g.run(setup, draw);
```