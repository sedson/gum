## Functions

<dl>
<dt><a href="#select">select(tag)</a> ⇒ <code>HTMLElement</code> | <code>false</code></dt>
<dd><p>Proxy for document.querySelector.</p>
</dd>
<dt><a href="#tag">tag(tag, styleObject)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Proxy for document.createElement with some extra utility for adding ids and 
classes.</p>
</dd>
<dt><a href="#style">style(elem, styleObject)</a></dt>
<dd><p>Apply styles from a js object to an element.</p>
</dd>
</dl>

<a name="select"></a>

## select(tag) ⇒ <code>HTMLElement</code> \| <code>false</code>
Proxy for document.querySelector.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | A selector. |

<a name="tag"></a>

## tag(tag, styleObject) ⇒ <code>HTMLElement</code>
Proxy for document.createElement with some extra utility for adding ids and 
classes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag to make. Examples: 'a', 'div.container',     'p#bio.large-text.red', or 'p #bio .large-text .red'. |
| styleObject | <code>object</code> |  |

<a name="style"></a>

## style(elem, styleObject)
Apply styles from a js object to an element.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>HTMLElement</code> | The html element. |
| styleObject | <code>object</code> | The style object – with keys is either js      camelCase form or string wrapped 'background-color' css form. |

