## Classes

<dl>
<dt><a href="#Color">Color</a></dt>
<dd><p>Color class with rgb and hsl state. Ideally colors are not mutable. To 
get a new color, create a new color.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#color">color(color)</a> ⇒ <code><a href="#Color">Color</a></code></dt>
<dd><p>Create a new color. Accepts a hex value, an rgb(r255, g255, b255) string,
an hsl(h360, s100, l100) string, an array of 3 or 4 rgba[0-&gt;1] values, spread 
out versions of those values, or an existing color object. If no params 
passed get a random color.</p>
</dd>
<dt><a href="#validColorArray">validColorArray(arr)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if an array is a valid array of parse-able numbers with at least three
values.</p>
</dd>
<dt><a href="#colorFormat">colorFormat(str)</a> ⇒ <code>string</code></dt>
<dd><p>Get the color format from a string.</p>
</dd>
<dt><a href="#extractNumbers">extractNumbers(str)</a> ⇒ <code>array.&lt;number&gt;</code></dt>
<dd><p>Get all the numbers out of a color string.</p>
</dd>
<dt><a href="#strToRgb">strToRgb(str, normalized)</a> ⇒ <code>array.&lt;number&gt;</code></dt>
<dd><p>Get rgb values from a string.</p>
</dd>
<dt><a href="#strToHsl">strToHsl(str, normalized)</a> ⇒ <code>array.&lt;number&gt;</code></dt>
<dd><p>Get hsl values from a string.</p>
</dd>
<dt><a href="#hexToRgb">hexToRgb(str, normalized)</a> ⇒ <code>array.&lt;number&gt;</code></dt>
<dd><p>Get rgb values from a hex string.</p>
</dd>
<dt><a href="#hslToRgb">hslToRgb(h, s, l)</a> ⇒ <code>array</code></dt>
<dd><p>Convert hsl values to an rgb array.</p>
</dd>
<dt><a href="#rgbToHsl">rgbToHsl(r, g, b)</a> ⇒ <code>array</code></dt>
<dd><p>Convert rgb values to an hsl array.</p>
</dd>
<dt><a href="#isColor">isColor()</a></dt>
<dd><p>Check if an object is an instance of Color.</p>
</dd>
<dt><a href="#blend">blend(src, target, amt, mode)</a> ⇒ <code><a href="#Color">Color</a></code></dt>
<dd><p>Blend two colors – src and target - by amount using mode.</p>
</dd>
</dl>

<a name="color"></a>

## color(color) ⇒ [<code>Color</code>](#Color)
Create a new color. Accepts a hex value, an rgb(r255, g255, b255) string,
an hsl(h360, s100, l100) string, an array of 3 or 4 rgba[0->1] values, spread 
out versions of those values, or an existing color object. If no params 
passed get a random color.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | The color. |

<a name="validColorArray"></a>

## validColorArray(arr) ⇒ <code>boolean</code>
Check if an array is a valid array of parse-able numbers with at least three
values.

**Kind**: global function  
**Returns**: <code>boolean</code> - Whether the array is valid.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | An array of potential color values. |

<a name="colorFormat"></a>

## colorFormat(str) ⇒ <code>string</code>
Get the color format from a string.

**Kind**: global function  
**Returns**: <code>string</code> - 'HEX' | 'RGB' | 'HSL'.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The input color string. |

<a name="extractNumbers"></a>

## extractNumbers(str) ⇒ <code>array.&lt;number&gt;</code>
Get all the numbers out of a color string.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | An rgb or hsl string. |

<a name="strToRgb"></a>

## strToRgb(str, normalized) ⇒ <code>array.&lt;number&gt;</code>
Get rgb values from a string.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | An rgb string. |
| normalized | <code>boolean</code> | <code>true</code> | If true return components in the [0->1] range. If     not leave them in rgb[0->255]. |

<a name="strToHsl"></a>

## strToHsl(str, normalized) ⇒ <code>array.&lt;number&gt;</code>
Get hsl values from a string.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | An hsl string. |
| normalized | <code>boolean</code> | <code>true</code> | If true return components in h[0->360] sl[0->1]      range. If not leave them in h[0->360] sl[0->100]. |

<a name="hexToRgb"></a>

## hexToRgb(str, normalized) ⇒ <code>array.&lt;number&gt;</code>
Get rgb values from a hex string.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | An hex string. |
| normalized | <code>boolean</code> | If true return components in the [0->1] range. If     not leave them in rgb[0->255]. |

<a name="hslToRgb"></a>

## hslToRgb(h, s, l) ⇒ <code>array</code>
Convert hsl values to an rgb array.

**Kind**: global function  
**Returns**: <code>array</code> - Normalized RGB color array.  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>number</code> | Hue in the 0->360 range. |
| s | <code>number</code> | Saturation in the 0->1 range. |
| l | <code>number</code> | Lightness in the 0->1 range. |

<a name="rgbToHsl"></a>

## rgbToHsl(r, g, b) ⇒ <code>array</code>
Convert rgb values to an hsl array.

**Kind**: global function  
**Returns**: <code>array</code> - HSL color array.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>number</code> | red in the 0->1 range. |
| g | <code>number</code> | green in the 0->1 range. |
| b | <code>number</code> | blue in the 0->1 range. |

<a name="isColor"></a>

## isColor()
Check if an object is an instance of Color.

**Kind**: global function  
<a name="blend"></a>

## blend(src, target, amt, mode) ⇒ [<code>Color</code>](#Color)
Blend two colors – src and target - by amount using mode.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| src | [<code>Color</code>](#Color) | The source color. |
| target | [<code>Color</code>](#Color) | The target color. |
| amt | <code>number</code> | The 0->1 blend amount. |
| mode | <code>string</code> | The blend space. 'RGB' or 'HSL'. |

