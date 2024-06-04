## Classes

<dl>
<dt><a href="#Mesh">Mesh</a></dt>
<dd><p>The mesh class represents the vertex and face data of a shape. Meshses are 
created with shape primitives or by loading models.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Vertex">Vertex</a> : <code>object</code></dt>
<dd><p>A single vertex.Contains 1 or more named attributes.</p>
</dd>
<dt><a href="#Face">Face</a> : <code>array.&lt;number&gt;</code></dt>
<dd><p>A single face. Contains an array of 3 or more indices into a vertex list.</p>
</dd>
</dl>

<a name="Mesh"></a>

## Mesh
The mesh class represents the vertex and face data of a shape. Meshses are 
created with shape primitives or by loading models.

**Kind**: global class  

* [Mesh](#Mesh)
    * [new Mesh(vertices, faces, meta)](#new_Mesh_new)
    * [.vertices](#Mesh+vertices) : [<code>array.&lt;Vertex&gt;</code>](#Vertex)
    * [.faces](#Mesh+faces) : [<code>array.&lt;Face&gt;</code>](#Face)
    * [.name](#Mesh+name) : <code>string</code>
    * [.id](#Mesh+id) : <code>string</code>
    * [.triangulate()](#Mesh+triangulate) ↩︎
    * [.render()](#Mesh+render) ⇒ <code>object</code>
    * [.renderEdges()](#Mesh+renderEdges) ⇒ <code>object</code>
    * [.renderPoints()](#Mesh+renderPoints) ⇒ <code>object</code>
    * [.renderNormals(length)](#Mesh+renderNormals) ⇒ <code>object</code>
    * [.findGroups()](#Mesh+findGroups) ↩︎
    * [.fill(col)](#Mesh+fill) ↩︎
    * [.inflate(amt)](#Mesh+inflate) ↩︎
    * [.getEdges()](#Mesh+getEdges) ⇒ <code>array.&lt;array.&lt;Vector3&gt;&gt;</code>
    * [.shadeFlat()](#Mesh+shadeFlat) ↩︎
    * [.shadeSmooth(tolerance)](#Mesh+shadeSmooth) ↩︎
    * [.applyTransform(transform)](#Mesh+applyTransform) ↩︎
    * [.join(The)](#Mesh+join) ↩︎
    * [.flipNormals()](#Mesh+flipNormals) ↩︎
    * [.copy()](#Mesh+copy) ⇒ [<code>Mesh</code>](#Mesh)
    * [.attributeMap(func)](#Mesh+attributeMap)

<a name="new_Mesh_new"></a>

### new Mesh(vertices, faces, meta)
Construct a mesh from a list of vertices and faces.


| Param | Type | Description |
| --- | --- | --- |
| vertices | [<code>array.&lt;Vertex&gt;</code>](#Vertex) |  |
| faces | [<code>array.&lt;Face&gt;</code>](#Face) |  |
| meta | <code>object</code> | Additional meta information about the mesh. Name and      more. |

<a name="Mesh+vertices"></a>

### mesh.vertices : [<code>array.&lt;Vertex&gt;</code>](#Vertex)
The array of vertices for this mesh. Each entry is object with with 
named attributes and arrays for the value.

**Kind**: instance property of [<code>Mesh</code>](#Mesh)  
<a name="Mesh+faces"></a>

### mesh.faces : [<code>array.&lt;Face&gt;</code>](#Face)
The array of faces for this mesh. An array of arrays. The internal array
contains indices into the vertex array. Quads and ngons are allowed but 
must be triangulated before being sent to the card.

**Kind**: instance property of [<code>Mesh</code>](#Mesh)  
<a name="Mesh+name"></a>

### mesh.name : <code>string</code>
A name for this mesh.

**Kind**: instance property of [<code>Mesh</code>](#Mesh)  
<a name="Mesh+id"></a>

### mesh.id : <code>string</code>
The id for this mesh.

**Kind**: instance property of [<code>Mesh</code>](#Mesh)  
<a name="Mesh+triangulate"></a>

### mesh.triangulate() ↩︎
Triangulate this mesh. Turns any quads and ngons into triangles. Is done 
before passing to GL anyway.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  
<a name="Mesh+render"></a>

### mesh.render() ⇒ <code>object</code>
Creates a render-able version of the mesh that works with a gl.drawArrays()
call.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: <code>object</code> - The flattened, triangulates, GL ready data.  
<a name="Mesh+renderEdges"></a>

### mesh.renderEdges() ⇒ <code>object</code>
Creates a wireframe version of this mesh that works with a gl.drawArrays()
call. Use gl.LINES mode.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: <code>object</code> - The flattened GL ready edge data.  
<a name="Mesh+renderPoints"></a>

### mesh.renderPoints() ⇒ <code>object</code>
Render points as the vertices of this mesh. Uses gl.POINTS mode.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: <code>object</code> - The flattened GL ready point data.  
<a name="Mesh+renderNormals"></a>

### mesh.renderNormals(length) ⇒ <code>object</code>
Render the vertex normal data as wireframe lines using the gl.LINES mode

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: <code>object</code> - The flattened GL ready edge data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| length | <code>number</code> | <code>0.05</code> | The length in world units to debug normals with. |

<a name="Mesh+findGroups"></a>

### mesh.findGroups() ↩︎
Attach group info to this mesh. Adds another attrib (surfaceId) to each 
vertex. The surfaceId value will be unique for each set of disjoint 
vertices in the mesh.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  
<a name="Mesh+fill"></a>

### mesh.fill(col) ↩︎
Fill the vertex colors for the mesh with a single vertex color.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| col | <code>color</code> \| <code>function</code> | The color to apply to each vertex OR a function      to map to each vertex that returns a color. |

<a name="Mesh+inflate"></a>

### mesh.inflate(amt) ↩︎
Inflate the mesh along its normals.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| amt | <code>number</code> | <code>0</code> | The amount to inflate the mesh by. Can be positive or  negative. |

<a name="Mesh+getEdges"></a>

### mesh.getEdges() ⇒ <code>array.&lt;array.&lt;Vector3&gt;&gt;</code>
Get a position-only edge list where p0, p1, p2, p3 are vec3s and the edge 
list is [[p0, p1], [p1, [p2], [p3, p4]]...].

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: <code>array.&lt;array.&lt;Vector3&gt;&gt;</code> - The nested edge array.  
<a name="Mesh+shadeFlat"></a>

### mesh.shadeFlat() ↩︎
Convert this mesh to flat-shaded vertices.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  
<a name="Mesh+shadeSmooth"></a>

### mesh.shadeSmooth(tolerance) ↩︎
Convert this mesh to smooth-shaded vertices.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| tolerance | <code>number</code> | Vertices that are closer-together than tolerance     will me merged. |

<a name="Mesh+applyTransform"></a>

### mesh.applyTransform(transform) ↩︎
Transforms all the positions and normals in this mesh by some 3D 
transformation.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| transform | <code>Transform</code> | The Gum Transform to use. |

<a name="Mesh+join"></a>

### mesh.join(The) ↩︎
Join another mesh into this one.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| The | [<code>Mesh</code>](#Mesh) | other mesh. |

<a name="Mesh+flipNormals"></a>

### mesh.flipNormals() ↩︎
Invert this meshes normals.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Chainable**  
<a name="Mesh+copy"></a>

### mesh.copy() ⇒ [<code>Mesh</code>](#Mesh)
Return a full deep copy of this mesh.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Returns**: [<code>Mesh</code>](#Mesh) - The new mesh.  
<a name="Mesh+attributeMap"></a>

### mesh.attributeMap(func)
Map a function over the vertices in this mesh.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  
**Exmaple**: // This function copies the vertex position, normalizes it, then uses 
// that as the vertex color rgb.
function vertFunc (vert) {
  const pos = g.vec3(...vert.position);
  pos.normalize();
  return {
     color: [...pos, 1]
  };
}

myMesh.attributeMap(vertFunc);  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | A vertex->vertex callback. |

<a name="Vertex"></a>

## Vertex : <code>object</code>
A single vertex.Contains 1 or more named attributes.

**Kind**: global typedef  
<a name="Face"></a>

## Face : <code>array.&lt;number&gt;</code>
A single face. Contains an array of 3 or more indices into a vertex list.

**Kind**: global typedef  
