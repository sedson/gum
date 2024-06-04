## Constants

<dl>
<dt><a href="#EPSILON">EPSILON</a></dt>
<dd><p>Matrix math borrowed from GlMatrix.
<a href="https://github.com/toji/gl-matrix/blob/master/src/mat4.js">https://github.com/toji/gl-matrix/blob/master/src/mat4.js</a>.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#create">create()</a> ⇒ <code>Float32Array</code></dt>
<dd><p>Generate an Identity Matrix.</p>
</dd>
<dt><a href="#lookAt">lookAt(out, eye, center, up)</a> ⇒ <code>Float32Array</code></dt>
<dd><p>Generate a view matrix.</p>
</dd>
<dt><a href="#perspective">perspective(out, fovy, aspect, near, far)</a> ⇒ <code>Float32Array</code></dt>
<dd><p>Generate a perspective projection matrix.</p>
</dd>
<dt><a href="#translate">translate(out, a, v)</a> ⇒ <code>Float32Array</code></dt>
<dd><p>Translate a transform matrix by a vector.</p>
</dd>
<dt><a href="#rotate">rotate(out, a, rad, axis)</a> ⇒ <code>mat4</code></dt>
<dd><p>Rotates a mat4 by the given angle around the given axis</p>
</dd>
<dt><a href="#identity">identity(out)</a> ⇒ <code>mat4</code></dt>
<dd><p>Reset a given matrix to the identity.</p>
</dd>
<dt><a href="#multiply">multiply(out, a, b)</a> ⇒ <code>mat4</code></dt>
<dd><p>Multiplies two mat4s</p>
</dd>
<dt><a href="#copy">copy(out, a)</a> ⇒ <code>mat4</code></dt>
<dd><p>Copy the values from one mat4 to another</p>
</dd>
<dt><a href="#scale">scale(out, a, v)</a> ⇒ <code>mat4</code></dt>
<dd><p>Scales the mat4 by the dimensions in the given vec3 not using vectorization</p>
</dd>
<dt><a href="#invert">invert(out, a)</a> ⇒ <code>mat4</code></dt>
<dd><p>Inverts a mat4</p>
</dd>
<dt><a href="#transformMat4">transformMat4(out, a, m)</a> ⇒ <code>vec3</code></dt>
<dd><p>Transforms the vec3 with a mat4.
4th vector component is implicitly &#39;1&#39;</p>
</dd>
<dt><a href="#transpose">transpose(out, a)</a> ⇒ <code>mat4</code></dt>
<dd><p>Transpose the values of a mat4</p>
</dd>
</dl>

<a name="EPSILON"></a>

## EPSILON
Matrix math borrowed from GlMatrix.
https://github.com/toji/gl-matrix/blob/master/src/mat4.js.

**Kind**: global constant  
<a name="create"></a>

## create() ⇒ <code>Float32Array</code>
Generate an Identity Matrix.

**Kind**: global function  
**Returns**: <code>Float32Array</code> - Identity Matrix  
<a name="lookAt"></a>

## lookAt(out, eye, center, up) ⇒ <code>Float32Array</code>
Generate a view matrix.

**Kind**: global function  
**Returns**: <code>Float32Array</code> - View matrix.  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>Float32Array</code> | Matrix to put values into. |
| eye | <code>Array</code> | Position of eye [x, y, z]. |
| center | <code>Array</code> | Look target [x, y, z]. |
| up | <code>Array</code> | description |

<a name="perspective"></a>

## perspective(out, fovy, aspect, near, far) ⇒ <code>Float32Array</code>
Generate a perspective projection matrix.

**Kind**: global function  
**Returns**: <code>Float32Array</code> - Projection matrix.  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>Float32Array</code> | Matrix to put values into. |
| fovy | <code>Number</code> | The vertical fov. |
| aspect | <code>Number</code> | Aspect ratio. |
| near | <code>Number</code> | Near clip plane. |
| far | <code>Number</code> | Far clip plane. |

<a name="translate"></a>

## translate(out, a, v) ⇒ <code>Float32Array</code>
Translate a transform matrix by a vector.

**Kind**: global function  
**Returns**: <code>Float32Array</code> - Transform matrix.  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>Float32Array</code> | Matrix to put values into. |
| a | <code>Float32Array</code> | Input matrix. |
| v | <code>Array</code> | [x, y, z] Vector array. |

<a name="rotate"></a>

## rotate(out, a, rad, axis) ⇒ <code>mat4</code>
Rotates a mat4 by the given angle around the given axis

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the matrix to rotate |
| rad | <code>Number</code> | the angle to rotate the matrix by |
| axis | <code>ReadonlyVec3</code> | the axis to rotate around |

<a name="identity"></a>

## identity(out) ⇒ <code>mat4</code>
Reset a given matrix to the identity.

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |

<a name="multiply"></a>

## multiply(out, a, b) ⇒ <code>mat4</code>
Multiplies two mat4s

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the first operand |
| b | <code>ReadonlyMat4</code> | the second operand |

<a name="copy"></a>

## copy(out, a) ⇒ <code>mat4</code>
Copy the values from one mat4 to another

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the source matrix |

<a name="scale"></a>

## scale(out, a, v) ⇒ <code>mat4</code>
Scales the mat4 by the dimensions in the given vec3 not using vectorization

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the matrix to scale |
| v | <code>ReadonlyVec3</code> | the vec3 to scale the matrix by |

<a name="invert"></a>

## invert(out, a) ⇒ <code>mat4</code>
Inverts a mat4

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the source matrix |

<a name="transformMat4"></a>

## transformMat4(out, a, m) ⇒ <code>vec3</code>
Transforms the vec3 with a mat4.
4th vector component is implicitly '1'

**Kind**: global function  
**Returns**: <code>vec3</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>vec3</code> | the receiving vector |
| a | <code>ReadonlyVec3</code> | the vector to transform |
| m | <code>ReadonlyMat4</code> | matrix to transform with |

<a name="transpose"></a>

## transpose(out, a) ⇒ <code>mat4</code>
Transpose the values of a mat4

**Kind**: global function  
**Returns**: <code>mat4</code> - out  

| Param | Type | Description |
| --- | --- | --- |
| out | <code>mat4</code> | the receiving matrix |
| a | <code>ReadonlyMat4</code> | the source matrix |

