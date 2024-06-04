## Classes

<dl>
<dt><a href="#Color">Color</a></dt>
<dd><p>A Color class with rgb and hsl state. Ideally colors are not mutable. To 
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
<dt><a href="#hslToRgb">hslToRgb(h, s, l)</a> ⇒ <code>array</code></dt>
<dd><p>Convert hsl values to an rgb array.</p>
</dd>
<dt><a href="#rgbToHsl">rgbToHsl(r, g, b)</a> ⇒ <code>array</code></dt>
<dd><p>Convert rgb values to an hsl array.</p>
</dd>
<dt><a href="#isColor">isColor()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if an object is an instance of Color.</p>
</dd>
<dt><a href="#blend">blend(src, target, amt, mode)</a> ⇒ <code><a href="#Color">Color</a></code></dt>
<dd><p>Blend two colors – src and target - by amount using mode.</p>
</dd>
</dl>

<a name="Color"></a>

## Color
A Color class with rgb and hsl state. Ideally colors are not mutable. To 
get a new color, create a new color.

**Kind**: global class  

* [Color](#Color)
    * [new Color()](#new_Color_new)
    * [.r](#Color+r) : <code>number</code>
    * [.g](#Color+g) : <code>number</code>
    * [.b](#Color+b) : <code>number</code>
    * [.h](#Color+h) : <code>number</code>
    * [.s](#Color+s) : <code>number</code>
    * [.l](#Color+l) : <code>number</code>
    * [.a](#Color+a) : <code>number</code>
    * [.rgb](#Color+rgb) : <code>array</code>
    * [.rgba](#Color+rgba) : <code>array</code>
    * [.hsl](#Color+hsl) : <code>array</code>
    * [.hsla](#Color+hsla) : <code>array</code>
    * [.rgbString()](#Color+rgbString) ⇒ <code>string</code>
    * [.hslString()](#Color+hslString) ⇒ <code>string</code>
    * [.blend(other, amt, mode)](#Color+blend) ⇒ [<code>Color</code>](#Color)
    * [.copy()](#Color+copy) ⇒ [<code>Color</code>](#Color)
    * [.shiftHue(amt)](#Color+shiftHue) ⇒ [<code>Color</code>](#Color)
    * [.lighten(amt)](#Color+lighten) ⇒ [<code>Color</code>](#Color)
    * [.saturate(amt)](#Color+saturate) ⇒ [<code>Color</code>](#Color)

<a name="new_Color_new"></a>

### new Color()
Construct a Color from normalized rgba values. In general, API usage should 
discourage calling 'new Color()' and should rely on the color() generator.

<a name="Color+r"></a>

### color.r : <code>number</code>
The red value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+g"></a>

### color.g : <code>number</code>
The green value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+b"></a>

### color.b : <code>number</code>
The blue value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+h"></a>

### color.h : <code>number</code>
The hue value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+s"></a>

### color.s : <code>number</code>
The saturation value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+l"></a>

### color.l : <code>number</code>
The lightness value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+a"></a>

### color.a : <code>number</code>
The alpha value.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+rgb"></a>

### color.rgb : <code>array</code>
RGB as a plain array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+rgba"></a>

### color.rgba : <code>array</code>
RGBA as a plain array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+hsl"></a>

### color.hsl : <code>array</code>
HSL as a plain array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+hsla"></a>

### color.hsla : <code>array</code>
HSLA as a plain array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+rgbString"></a>

### color.rgbString() ⇒ <code>string</code>
Get the CSS-ready rgb or rgba string representation of this color.

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+hslString"></a>

### color.hslString() ⇒ <code>string</code>
Get the CSS-ready hsl or hsla string representation of this color.

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+blend"></a>

### color.blend(other, amt, mode) ⇒ [<code>Color</code>](#Color)
Blend this color with other by amount using mode.

**Kind**: instance method of [<code>Color</code>](#Color)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| other | [<code>Color</code>](#Color) |  | The other color. |
| amt | <code>number</code> | <code>0.5</code> | The aboumt to blend (0:1). |
| mode | <code>string</code> | <code>&quot;RGB&quot;</code> | The color space to blend in. Options are 'RGB' (default) and      'HSL'. |

<a name="Color+copy"></a>

### color.copy() ⇒ [<code>Color</code>](#Color)
Copy this color.

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+shiftHue"></a>

### color.shiftHue(amt) ⇒ [<code>Color</code>](#Color)
Hue shift.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - A new color.  

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>number</code> | The amount of hue shift in degrees. |

<a name="Color+lighten"></a>

### color.lighten(amt) ⇒ [<code>Color</code>](#Color)
Lighten or darken the color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - A new color.  

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>number</code> | The lightness change. Positive for lighter. Negative for darker.     Overall lightness is (0:100). |

<a name="Color+saturate"></a>

### color.saturate(amt) ⇒ [<code>Color</code>](#Color)
Saturate or desaturate the color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - A new color.  

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>number</code> | The saturation change. Positive for more. Negative for less.     Overall saturation is (0:100). |

<a name="color"></a>

## color(color) ⇒ [<code>Color</code>](#Color)
Create a new color. Accepts a hex value, an rgb(r255, g255, b255) string,
an hsl(h360, s100, l100) string, an array of 3 or 4 rgba[0->1] values, spread 
out versions of those values, or an existing color object. If no params 
passed get a random color.

**Kind**: global function  
**Exampe**: const red = color('rgb(255, 0, 0)');
const yellow = color('#ffff00');
const randomColor = color();  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | The color. |

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

## isColor() ⇒ <code>boolean</code>
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

