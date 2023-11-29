# TODOS
[] Mesh loading extents for hit box 
[] Default values for uniforms



# Vertex Attributes 

**Currently handling vertex attributes like this:**

Draw calls are managed with WebGL VAOs. Each time a mesh is added or updated, the system registers a new VAO that conforms to a pre established vertex attribute layout. This way the same VAO can be bound and used in multiple gl programs. 

The system therefore has a preset layout for the attributes. If a shader wants to use vertex attributes, it should use these names. Custom shaders can use the data for whatever they want, but they should use these names. 

aPosition   {vec4}  location 0 - Vertex position.
aNormal     {vec3}  location 1 - Vertex normal.
aTexCoord   {vec2}  location 2 - UV coordinate.
aColor      {vec4}  location 3 - Vertex color.
aSurfaceId  {float} location 4 - A unique value for each surface in the mesh.
aRegister1  {vec4}  location 5 - 4 advanced/arbitrary data slots.
aRegister2  {vec4}  location 6 - 4 more advanced/arbitrary data slots.

Inside any js that is pre-rendererGL2 the code will refer to the attribute without 
the 'a' prefix. ie 'texCoord' not 'aTexCoord'.


# Nodes/Game Objects 
The list of node methods in open frame works is good reference.

https://openframeworks.cc/documentation/3d/ofNode

Should the base node class have a tick? 

Should there be a behavior class that you can glue to a node?

```js
class Behavior {
  constructor (node) {
    this.node = node;
    this.start();
  }
  start () {}
  update () {}
}

class Bobber {
  start () {
    this.timer = 0;
  }
  update (deltaTime) {
    this.node.transform.y = ft.sin(this.timer);
    this.timer += 0.001 * deltaTime;
  }
}
```




# API Thoughts
I want the API to include a patentable scene graph with retained, bound meshes.


```html
<script src=felt.js></script>
<script>
  const ft = FeltTools;
  const app = new FeltApp('#canvas', 400, 400);

  const ball = app.node();                            // type Node

  
  const sphereGeometry = ft.shapes.icosphere(0.5, 2); // type Mesh

  
  f.setup = function () {
    ball.setMesh(ft.shapes.cube(1));

    f.background('yellow');
    f.scene.add(ball);
  }


  f.draw = function () {
    f.background('yellow');

    // Any immediate mode drawing commands. 

    // This would be internal code 
    f.computeMatrices(f.camera);
    f.updateSceneGraph();
    f.renderer.render(f.scene, f.camera);
  }
</script>
```



