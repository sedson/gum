## Functions

<dl>
<dt><a href="#clamp">clamp(x, min, max)</a> ⇒ <code>number</code></dt>
<dd><p>Clamp a value between min and max.</p>
</dd>
<dt><a href="#lerp">lerp(a, b, fac)</a> ⇒ <code>number</code></dt>
<dd><p>Linear interpolate 2 numbers.</p>
</dd>
<dt><a href="#remap">remap(x, min, max, outMin, outMax)</a> ⇒ <code>number</code></dt>
<dd><p>Remap a value from an input range to an output range.</p>
</dd>
<dt><a href="#random">random(a, b)</a> ⇒ <code>number</code></dt>
<dd><p>Get a random value between 0 and 1 value or between 2 numbers.</p>
</dd>
<dt><a href="#degrees">degrees(radians)</a> ⇒ <code>number</code></dt>
<dd><p>Convert a number from radians to degrees.</p>
</dd>
<dt><a href="#radians">radians(degrees)</a> ⇒ <code>number</code></dt>
<dd><p>Convert a number from degrees to radians.</p>
</dd>
</dl>

<a name="clamp"></a>

## clamp(x, min, max) ⇒ <code>number</code>
Clamp a value between min and max.

**Kind**: global function  
**Returns**: <code>number</code> - The clamped value.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The value. |
| min | <code>number</code> | The min. Default 0. |
| max | <code>number</code> | The max. Default 1. |

<a name="lerp"></a>

## lerp(a, b, fac) ⇒ <code>number</code>
Linear interpolate 2 numbers.

**Kind**: global function  
**Returns**: <code>number</code> - The lerped number.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The first number. |
| b | <code>number</code> | The second number. |
| fac | <code>number</code> | The factor. Default 0.5. |

<a name="remap"></a>

## remap(x, min, max, outMin, outMax) ⇒ <code>number</code>
Remap a value from an input range to an output range.

**Kind**: global function  
**Returns**: <code>number</code> - The remapped number.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The value. |
| min | <code>number</code> | Minimum of the input range. |
| max | <code>number</code> | Maximum of the input range. |
| outMin | <code>number</code> | Minimum of the output range. |
| outMax | <code>number</code> | Maximum of the output range. |

<a name="random"></a>

## random(a, b) ⇒ <code>number</code>
Get a random value between 0 and 1 value or between 2 numbers.

**Kind**: global function  
**Returns**: <code>number</code> - The random number.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The min. |
| b | <code>number</code> | The max. |

<a name="degrees"></a>

## degrees(radians) ⇒ <code>number</code>
Convert a number from radians to degrees.

**Kind**: global function  

| Param | Type |
| --- | --- |
| radians | <code>number</code> | 

<a name="radians"></a>

## radians(degrees) ⇒ <code>number</code>
Convert a number from degrees to radians.

**Kind**: global function  

| Param | Type |
| --- | --- |
| degrees | <code>number</code> | 

