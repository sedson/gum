<a name="Node"></a>

## Node
The Node class represents a scene-graph node.

**Kind**: global class  

* [Node](#Node)
    * [new Node(name, geometry, transform)](#new_Node_new)
    * [.name](#Node+name) : <code>string</code>
    * [.id](#Node+id) : <code>string</code>
    * [.renderId](#Node+renderId) : <code>number</code>
    * [.geometry](#Node+geometry) : <code>string</code> \| <code>null</code>
    * [.transform](#Node+transform) : <code>Transform</code>
    * [.visible](#Node+visible) : <code>boolean</code>
    * [.parent](#Node+parent) : [<code>Node</code>](#Node) \| <code>null</code>
    * [.children](#Node+children) : [<code>array.&lt;Node&gt;</code>](#Node)
    * [.uniforms](#Node+uniforms) : <code>object</code>
    * [.program](#Node+program) : <code>string</code>
    * [.position](#Node+position) : <code>Vec3</code>
    * [.rotation](#Node+rotation) : <code>Vec3</code>
    * [.scale](#Node+scale) : <code>Vec3</code>
    * [.x](#Node+x) : <code>number</code>
    * [.y](#Node+y) : <code>number</code>
    * [.z](#Node+z) : <code>number</code>
    * [.rx](#Node+rx) : <code>number</code>
    * [.ry](#Node+ry) : <code>number</code>
    * [.rz](#Node+rz) : <code>number</code>
    * [.move(x, y, z)](#Node+move) ↩︎
    * [.rotate(x, y, z)](#Node+rotate) ↩︎
    * [.rescale(x, y, z)](#Node+rescale) ↩︎
    * [.setParent(node)](#Node+setParent) ↩︎
    * [.setGeometry(geo)](#Node+setGeometry) ↩︎
    * [.setProgram(prog)](#Node+setProgram) ↩︎
    * [.createChildNode(name, geometry)](#Node+createChildNode) ⇒ [<code>Node</code>](#Node)
    * [.traverse(fn)](#Node+traverse)
    * [.uniform(name, value)](#Node+uniform) ↩︎
    * [.uniforms(uniforms)](#Node+uniforms) ↩︎

<a name="new_Node_new"></a>

### new Node(name, geometry, transform)
Construct a new Node. None of the arguments are strictly necessary.


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| geometry | <code>string</code> | 
| transform | <code>Transform</code> | 

<a name="Node+name"></a>

### node.name : <code>string</code>
The name of the node.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+id"></a>

### node.id : <code>string</code>
A short unique id.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+renderId"></a>

### node.renderId : <code>number</code>
A numeric render id.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+geometry"></a>

### node.geometry : <code>string</code> \| <code>null</code>
The pointer to the mesh name in the render system.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+transform"></a>

### node.transform : <code>Transform</code>
This objects 3D transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+visible"></a>

### node.visible : <code>boolean</code>
Whether this object is visible to the scene.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+parent"></a>

### node.parent : [<code>Node</code>](#Node) \| <code>null</code>
The parent node. Always use the .setParent() method to manage parenting.

**Kind**: instance property of [<code>Node</code>](#Node)  
**Read only**: true  
<a name="Node+children"></a>

### node.children : [<code>array.&lt;Node&gt;</code>](#Node)
The children list. Always use the .setParent() method to manage parenting.

**Kind**: instance property of [<code>Node</code>](#Node)  
**Read only**: true  
<a name="Node+uniforms"></a>

### node.uniforms : <code>object</code>
The shader uniforms attached to this node.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+program"></a>

### node.program : <code>string</code>
The name of the shader program to use when rendering this object.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+position"></a>

### node.position : <code>Vec3</code>
Reference to the transform position.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+rotation"></a>

### node.rotation : <code>Vec3</code>
Reference to the transform rotation.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+scale"></a>

### node.scale : <code>Vec3</code>
Reference to the transform scale.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+x"></a>

### node.x : <code>number</code>
The x position of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+y"></a>

### node.y : <code>number</code>
The y position of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+z"></a>

### node.z : <code>number</code>
The z position of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+rx"></a>

### node.rx : <code>number</code>
The x rotation of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+ry"></a>

### node.ry : <code>number</code>
The y rotation of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+rz"></a>

### node.rz : <code>number</code>
The z rotation of this object's transform.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="Node+move"></a>

### node.move(x, y, z) ↩︎
Move this node somewhere.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 

<a name="Node+rotate"></a>

### node.rotate(x, y, z) ↩︎
Rotate this node.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 

<a name="Node+rescale"></a>

### node.rescale(x, y, z) ↩︎
Scale this node.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 

<a name="Node+setParent"></a>

### node.setParent(node) ↩︎
Parent this node to another one. This node's transform is now in the local space 
ogf its parent.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type |
| --- | --- |
| node | [<code>Node</code>](#Node) | 

<a name="Node+setGeometry"></a>

### node.setGeometry(geo) ↩︎
Set the geometry (mesh) used to render this node.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| geo | <code>string</code> | The string geometry pointer. |

<a name="Node+setProgram"></a>

### node.setProgram(prog) ↩︎
Set the program (shader) used when rendering this node and its children (unless they override);

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| prog | <code>string</code> | The string program pointer. |

<a name="Node+createChildNode"></a>

### node.createChildNode(name, geometry) ⇒ [<code>Node</code>](#Node)
Create a child node under this node. Return the new child.

**Kind**: instance method of [<code>Node</code>](#Node)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| geometry | <code>string</code> | 

<a name="Node+traverse"></a>

### node.traverse(fn)
Recursively walk this node and its children, calling a callback at each node.

**Kind**: instance method of [<code>Node</code>](#Node)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A func(node) => { doSomethingTo(node) } shaped callback. |

<a name="Node+uniform"></a>

### node.uniform(name, value) ↩︎
Set a single uniform on this node.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the uniform. |
| value | <code>number</code> \| <code>array</code> | The GL value to set. |

<a name="Node+uniforms"></a>

### node.uniforms(uniforms) ↩︎
Set multiple uniforms on this node.

**Kind**: instance method of [<code>Node</code>](#Node)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| uniforms | <code>object</code> | A {name: str -> val: number or array } object to set. |

