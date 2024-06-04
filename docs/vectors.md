## Classes

<dl>
<dt><a href="#Vec2">Vec2</a></dt>
<dd><p>The Vec2 class.</p>
</dd>
<dt><a href="#Vec3">Vec3</a></dt>
<dd><p>The Vec3 class.</p>
</dd>
</dl>

<a name="Vec2"></a>

## Vec2
The Vec2 class.

**Kind**: global class  

* [Vec2](#Vec2)
    * [new Vec2(x, y)](#new_Vec2_new)
    * [.x](#Vec2+x)
    * [.y](#Vec2+y)
    * [.xy](#Vec2+xy)
    * [.changed()](#Vec2+changed) ⇒ <code>boolean</code>
    * [.set(x, y)](#Vec2+set) ↩︎
    * [.copy()](#Vec2+copy) ⇒ [<code>Vec2</code>](#Vec2)
    * [.add(a)](#Vec2+add) ↩︎
    * [.distance(a)](#Vec2+distance) ⇒ <code>number</code>
    * [.distance2(a)](#Vec2+distance2) ⇒ <code>number</code>
    * [.vectorTo(a)](#Vec2+vectorTo) ⇒ [<code>Vec2</code>](#Vec2)

<a name="new_Vec2_new"></a>

### new Vec2(x, y)
Construct a new Vec2. Gum vectors extend native JS arrays, so the 
myVec[0] syntax works but myVec.x is preferred.


| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> | <code>0</code> | 
| y | <code>number</code> | <code>0</code> | 

<a name="Vec2+x"></a>

### vec2.x
The x value.

**Kind**: instance property of [<code>Vec2</code>](#Vec2)  
<a name="Vec2+y"></a>

### vec2.y
The x value.

**Kind**: instance property of [<code>Vec2</code>](#Vec2)  
<a name="Vec2+xy"></a>

### vec2.xy
Get or set both x and y using a plain array.

**Kind**: instance property of [<code>Vec2</code>](#Vec2)  
<a name="Vec2+changed"></a>

### vec2.changed() ⇒ <code>boolean</code>
Check if the vector has been changed since changed() was last checked.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  
<a name="Vec2+set"></a>

### vec2.set(x, y) ↩︎
Set this vector.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  
**Chainable**  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="Vec2+copy"></a>

### vec2.copy() ⇒ [<code>Vec2</code>](#Vec2)
Copy this vector.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  
<a name="Vec2+add"></a>

### vec2.add(a) ↩︎
Add another vector to this one. IN PLACE!

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec2</code>](#Vec2) | The other vector. |

<a name="Vec2+distance"></a>

### vec2.distance(a) ⇒ <code>number</code>
Get the distance from this vector to another.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec2</code>](#Vec2) | The other vector. |

<a name="Vec2+distance2"></a>

### vec2.distance2(a) ⇒ <code>number</code>
Get the squared distance from this vector to another.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec2</code>](#Vec2) | The other vector. |

<a name="Vec2+vectorTo"></a>

### vec2.vectorTo(a) ⇒ [<code>Vec2</code>](#Vec2)
Get a new vector, from a pointing back to this.

**Kind**: instance method of [<code>Vec2</code>](#Vec2)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec2</code>](#Vec2) | The other vector. |

<a name="Vec3"></a>

## Vec3
The Vec3 class.

**Kind**: global class  

* [Vec3](#Vec3)
    * [new Vec3(x, y, z)](#new_Vec3_new)
    * [.x](#Vec3+x)
    * [.y](#Vec3+y)
    * [.z](#Vec3+z)
    * [.xyz](#Vec3+xyz)
    * [.changed()](#Vec3+changed) ⇒ <code>boolean</code>
    * [.set(x, y, z)](#Vec3+set) ↩︎
    * [.copy()](#Vec3+copy) ⇒ [<code>Vec3</code>](#Vec3)
    * [.add(a)](#Vec3+add) ↩︎
    * [.sub(a)](#Vec3+sub) ↩︎
    * [.distance(a)](#Vec3+distance) ⇒ <code>number</code>
    * [.distance2(a)](#Vec3+distance2) ⇒ <code>number</code>
    * [.mag()](#Vec3+mag) ⇒ <code>number</code>
    * [.mult(s)](#Vec3+mult) ↩︎
    * [.div(s)](#Vec3+div) ↩︎
    * [.normalize(n)](#Vec3+normalize) ↩︎
    * [.dot(a)](#Vec3+dot) ⇒ <code>number</code>
    * [.cross(a)](#Vec3+cross) ⇒ [<code>Vec3</code>](#Vec3)
    * [.vectorTo(a)](#Vec3+vectorTo) ⇒ [<code>Vec3</code>](#Vec3)
    * [.equals(a, [tolerance])](#Vec3+equals) ⇒ <code>boolean</code>

<a name="new_Vec3_new"></a>

### new Vec3(x, y, z)
Construct a new Vec3. Gum vectors extend native JS arrays, so the 
myVec[0] syntax works but myVec.x is preferred.


| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> | <code>0</code> | 
| y | <code>number</code> | <code>0</code> | 
| z | <code>number</code> | <code>0</code> | 

<a name="Vec3+x"></a>

### vec3.x
The x value.

**Kind**: instance property of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+y"></a>

### vec3.y
The y value.

**Kind**: instance property of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+z"></a>

### vec3.z
The z value.

**Kind**: instance property of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+xyz"></a>

### vec3.xyz
Get or x, y, and z using a plain array.

**Kind**: instance property of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+changed"></a>

### vec3.changed() ⇒ <code>boolean</code>
Check if the vector has been changed since changed() was last checked.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+set"></a>

### vec3.set(x, y, z) ↩︎
Set this vector.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 

<a name="Vec3+copy"></a>

### vec3.copy() ⇒ [<code>Vec3</code>](#Vec3)
Copy this vector.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+add"></a>

### vec3.add(a) ↩︎
Add another vector to this one. IN PLACE!

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other vector. |

<a name="Vec3+sub"></a>

### vec3.sub(a) ↩︎
Subtract another vector from this one. IN PLACE!

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other vector. |

<a name="Vec3+distance"></a>

### vec3.distance(a) ⇒ <code>number</code>
Distance from this to another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other vector. |

<a name="Vec3+distance2"></a>

### vec3.distance2(a) ⇒ <code>number</code>
Squared distance from this to another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other vector. |

<a name="Vec3+mag"></a>

### vec3.mag() ⇒ <code>number</code>
Magnitude of this vector.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
<a name="Vec3+mult"></a>

### vec3.mult(s) ↩︎
Multiply this vector by a scalar. IN PLACE!

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>number</code> | The scalar. |

<a name="Vec3+div"></a>

### vec3.div(s) ↩︎
Divide this vector by a scalar. IN PLACE!

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>number</code> | The scalar. |

<a name="Vec3+normalize"></a>

### vec3.normalize(n) ↩︎
Normalize this vector. IN PLACE!

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | The length of the normalized vector. Defualt 1. |

<a name="Vec3+dot"></a>

### vec3.dot(a) ⇒ <code>number</code>
Dot this vector with another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other. |

<a name="Vec3+cross"></a>

### vec3.cross(a) ⇒ [<code>Vec3</code>](#Vec3)
Cross this vector with another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Returns**: [<code>Vec3</code>](#Vec3) - A new vector.  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other. |

<a name="Vec3+vectorTo"></a>

### vec3.vectorTo(a) ⇒ [<code>Vec3</code>](#Vec3)
Get the vector pointing from this vector to another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  
**Returns**: [<code>Vec3</code>](#Vec3) - A new vector.  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other. |

<a name="Vec3+equals"></a>

### vec3.equals(a, [tolerance]) ⇒ <code>boolean</code>
Equality test this vector with another.

**Kind**: instance method of [<code>Vec3</code>](#Vec3)  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Vec3</code>](#Vec3) | The other vector. |
| [tolerance] | <code>number</code> | The min distance to consider equal. |

