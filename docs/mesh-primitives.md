<a name="module_shapes"></a>

## shapes

* [shapes](#module_shapes)
    * [.cube(size)](#module_shapes.cube) ⇒ <code>Mesh</code>
    * [.icosphere(size, level, flat)](#module_shapes.icosphere) ⇒ <code>Mesh</code>
    * [.uvsphere(size, level, flat)](#module_shapes.uvsphere) ⇒ <code>Mesh</code>
    * [.quad(size)](#module_shapes.quad) ⇒ <code>Mesh</code>
    * [.grid(size, subdivisions)](#module_shapes.grid) ⇒ <code>Mesh</code>
    * [.circle(size, resolution, fill)](#module_shapes.circle) ⇒ <code>Mesh</code>
    * [.cylinder(size, resolution, fill)](#module_shapes.cylinder) ⇒ <code>Mesh</code>
    * [.cone(size, resolution, fill)](#module_shapes.cone) ⇒ <code>Mesh</code>

<a name="module_shapes.cube"></a>

### shapes.cube(size) ⇒ <code>Mesh</code>
Make a cube. Centered on the origin with w, h, d of size.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The size of the cube. |

<a name="module_shapes.icosphere"></a>

### shapes.icosphere(size, level, flat) ⇒ <code>Mesh</code>
Make an icosphere shape with diameter size.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The diameter of the sphere. |
| level | <code>number</code> | The subdivision level to use. 0 is low poly. 5 is very very high poly. |
| flat | <code>boolean</code> | Whether to use flat shading. Default smooth (false). |

<a name="module_shapes.uvsphere"></a>

### shapes.uvsphere(size, level, flat) ⇒ <code>Mesh</code>
Make a UV Sphere - like a mercator globe.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The diameter of the sphere. |
| level | <code>number</code> | The segments level. 1 is very low poly. 40 is pretty high poly. |
| flat | <code>boolean</code> | Whether to use flat shading. Default smooth (false). |

<a name="module_shapes.quad"></a>

### shapes.quad(size) ⇒ <code>Mesh</code>
Make a quad facing up along y axis.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The w and d of the quad. |

<a name="module_shapes.grid"></a>

### shapes.grid(size, subdivisions) ⇒ <code>Mesh</code>
Make a grid facing up along y axis.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The size (w, h) of the grid. |
| subdivisions | <code>number</code> | The number of subdivisions. Default 10. |

<a name="module_shapes.circle"></a>

### shapes.circle(size, resolution, fill) ⇒ <code>Mesh</code>
Make a circle with diameter size facing up along y axis.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The size of the circle. |
| resolution | <code>number</code> | The number of straight line segments to use. Default 12. |
| fill | <code>string</code> | The fill type to use. 'ngon' is default and does not require an     extra vertex at the center. 'fan' places an extra vert at the center and connects      all the verts to that like spokes. |

<a name="module_shapes.cylinder"></a>

### shapes.cylinder(size, resolution, fill) ⇒ <code>Mesh</code>
Make a circle with diameter size facing up along y axis.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The size of the circle. |
| resolution | <code>number</code> | The number of straight line segments to use. |
| fill | <code>string</code> | The fill type to use. 'ngon' is default and does not require an     extra vertex at the center. 'fan' places an extra vert at the center and connects      all the verts to that like spokes. |

<a name="module_shapes.cone"></a>

### shapes.cone(size, resolution, fill) ⇒ <code>Mesh</code>
Make a cone with diameter size facing up along y axis.
https://stackoverflow.com/questions/19245363/opengl-glut-surface-normals-of-cone
TODO : proper normals for the cone.

**Kind**: static method of [<code>shapes</code>](#module_shapes)  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | The size of the circle. |
| resolution | <code>number</code> | The number of straight line segments to use. |
| fill | <code>string</code> | The fill type to use. 'ngon' is default and does not require an     extra vertex at the center. 'fan' places an extra vert at the center and connects      all the verts to that like spokes. |

