## Functions

<dl>
<dt><a href="#triangulate">triangulate(faces)</a> ⇒ <code>array.&lt;array&gt;</code></dt>
<dd><p>Triangulate a mesh. Discard any &quot;faces&quot; with fewer than 3 vertices. Convert 
any faces with 4+ vertices to triangles using a triangle fan method. For 
example the quad [0, 1, 2, 3] becomes the two tris [0, 1, 2] and [0, 2, 3] 
rather than [0, 1, 2] and [1, 2, 3].</p>
</dd>
<dt><a href="#validate">validate(vertices, faces)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validate a mesh. Make sure that all indices used in the face list are 
within bounds on the vertex list.</p>
</dd>
<dt><a href="#findGroups">findGroups(faces)</a> ⇒ <code>array.&lt;number&gt;</code></dt>
<dd><p>If two faces share a vertex consider them grouped. Iterate over all the faces 
and compute the distinct groups, returning a list of group ids in vertex 
order. A smooth-shaded sphere will have only 1 group. Meaning the returned 
list will have only 1 value. Like [0, 0, ... 0]. A flat-shaded model will 
have one group per flat-shaded face. That return data might look like 
[0, 0, 0, 1, 1, 1, ... 12, 12, 12]. If the mesh is valid and has no loose 
vertices, the returned list will have the same length as the mesh&#39;s vertex 
list.</p>
</dd>
<dt><a href="#applyAttribVarying">applyAttribVarying(attribName, attribValues, vertices)</a> ⇒ <code>array.&lt;Vertex&gt;</code></dt>
<dd><p>Apply a new attribute to the vertices of a mesh where the attributes can 
vary across the vertices.</p>
</dd>
<dt><a href="#applyAttribConstant">applyAttribConstant(attribName, attribValue, vertices, filter)</a> ⇒ <code>array.&lt;vertex&gt;</code></dt>
<dd><p>Apply a new attribute to the vertices of a mesh where the attribute is the same 
at each vertex.</p>
</dd>
</dl>

<a name="triangulate"></a>

## triangulate(faces) ⇒ <code>array.&lt;array&gt;</code>
Triangulate a mesh. Discard any "faces" with fewer than 3 vertices. Convert 
any faces with 4+ vertices to triangles using a triangle fan method. For 
example the quad [0, 1, 2, 3] becomes the two tris [0, 1, 2] and [0, 2, 3] 
rather than [0, 1, 2] and [1, 2, 3].

**Kind**: global function  
**Returns**: <code>array.&lt;array&gt;</code> - The list of of updated faces.  

| Param | Type | Description |
| --- | --- | --- |
| faces | <code>array.&lt;array&gt;</code> | The list of input faces. |

<a name="validate"></a>

## validate(vertices, faces) ⇒ <code>boolean</code>
Validate a mesh. Make sure that all indices used in the face list are 
within bounds on the vertex list.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>array.&lt;Vertex&gt;</code> | The list of vertices. |
| faces | <code>array.&lt;Face&gt;</code> | The list of faces. |

<a name="findGroups"></a>

## findGroups(faces) ⇒ <code>array.&lt;number&gt;</code>
If two faces share a vertex consider them grouped. Iterate over all the faces 
and compute the distinct groups, returning a list of group ids in vertex 
order. A smooth-shaded sphere will have only 1 group. Meaning the returned 
list will have only 1 value. Like [0, 0, ... 0]. A flat-shaded model will 
have one group per flat-shaded face. That return data might look like 
[0, 0, 0, 1, 1, 1, ... 12, 12, 12]. If the mesh is valid and has no loose 
vertices, the returned list will have the same length as the mesh's vertex 
list.

**Kind**: global function  
**Returns**: <code>array.&lt;number&gt;</code> - A list of group IDs that can be applied to a mesh 
    using applyAttribVarying().  

| Param | Type | Description |
| --- | --- | --- |
| faces | <code>array.&lt;Face&gt;</code> | The mesh's face list. |

<a name="findGroups..join"></a>

### findGroups~join(a, b)
Join a set with another set or a list.

**Kind**: inner method of [<code>findGroups</code>](#findGroups)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Set</code> | The receiving set. |
| b | <code>Ser</code> \| <code>array</code> | The giving set or list. |

<a name="applyAttribVarying"></a>

## applyAttribVarying(attribName, attribValues, vertices) ⇒ <code>array.&lt;Vertex&gt;</code>
Apply a new attribute to the vertices of a mesh where the attributes can 
vary across the vertices.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| attribName | <code>string</code> | The name of the attribute to attach to each     vertex. |
| attribValues | <code>array.&lt;(array\|number)&gt;</code> | An array of values to attach.     Must be the same length as vertices. |
| vertices | <code>array.&lt;Vertex&gt;</code> | The mesh's vertex list. |

<a name="applyAttribConstant"></a>

## applyAttribConstant(attribName, attribValue, vertices, filter) ⇒ <code>array.&lt;vertex&gt;</code>
Apply a new attribute to the vertices of a mesh where the attribute is the same 
at each vertex.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| attribName | <code>string</code> | The name of the attribute to attach to each     vertex. |
| attribValue | <code>array.&lt;(array\|number\|function())&gt;</code> | The value to attach. |
| vertices | <code>array.&lt;Vertex&gt;</code> | The mesh's vertex list. |
| filter | <code>function</code> | An optional filter function to operate |

