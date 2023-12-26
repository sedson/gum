const bg = g.color()
const fg = g.color()

const mesh = g.shapes.icosphere(2, 3)
  .fill(fg)
g.defaultPass = 'lit';


let a;


/**
 * Setup function.
 */
function setup () {
  a = g.node('a').setGeometry(g.mesh(mesh));
  g.addEffect('post-dither', {
    uColorA: bg.rgba,
    uColorB: fg.rgba
  })
}

/**
 * Draw loop.
 */
function draw () {
  g.background(bg);
  g.drawScene();
  a.rotate(g.sin(g.time * 0.001), 0, 0)
} 