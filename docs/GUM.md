## Classes

<dl>
<dt><a href="#Gum">Gum</a></dt>
<dd><p>The class for one instance of Gum. It has a renderer, a scene-graph, etc.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#globals">globals</a> : <code>object</code></dt>
<dd><p>Some global helpers.</p>
</dd>
</dl>

<a name="Gum"></a>

## Gum
The class for one instance of Gum. It has a renderer, a scene-graph, etc.

**Kind**: global class  

* [Gum](#Gum)
    * [.pixelRatio](#Gum+pixelRatio)
    * [.canvas](#Gum+canvas) : <code>HTMLCanvasElement</code>
    * [.w](#Gum+w)
    * [.h](#Gum+h)
    * [.gl](#Gum+gl) : <code>WebGL2RenderingContext</code>
    * [.scene](#Gum+scene) : <code>Scene</code>
    * [.camera](#Gum+camera) : <code>Camera</code>
    * [.sceneGraph](#Gum+sceneGraph) : <code>SceneGraph</code>
    * [.plyLoader](#Gum+plyLoader)
    * [._loop](#Gum+_loop)
    * [._timeAtLaunch](#Gum+_timeAtLaunch)
    * [._time](#Gum+_time)
    * [._timeAtLastInfo](#Gum+_timeAtLastInfo)
    * [._frame](#Gum+_frame)
    * [._lastNow](#Gum+_lastNow)
    * [.texers](#Gum+texers)
    * [.postProcessingStack](#Gum+postProcessingStack)
    * [.tick](#Gum+tick)
    * [._imMatrix](#Gum+_imMatrix)
    * [._identity](#Gum+_identity)
    * [.defaultPass](#Gum+defaultPass)
    * [.globalUniforms](#Gum+globalUniforms)
    * [.recycleBuffer](#Gum+recycleBuffer)
    * [.time](#Gum+time) ⇒ <code>number</code>
    * [._setup()](#Gum+_setup)
    * [.run(setup, draw)](#Gum+run)
    * [.clear(color)](#Gum+clear)
    * [.size()](#Gum+size)
    * [.color()](#Gum+color)
    * [._tick()](#Gum+_tick)
    * [._info()](#Gum+_info)
    * [.loop()](#Gum+loop)
    * [.drawScene()](#Gum+drawScene)
    * [.drawNode()](#Gum+drawNode)
    * [.drawMesh()](#Gum+drawMesh)
    * [.orbit()](#Gum+orbit)

<a name="Gum+pixelRatio"></a>

### gum.pixelRatio
The pixel ratio for display.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+canvas"></a>

### gum.canvas : <code>HTMLCanvasElement</code>
The canvas.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+w"></a>

### gum.w
The width of the canvas.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+h"></a>

### gum.h
The height of the canvas.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+gl"></a>

### gum.gl : <code>WebGL2RenderingContext</code>
A reference to the raw gl context.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+scene"></a>

### gum.scene : <code>Scene</code>
The scene.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+camera"></a>

### gum.camera : <code>Camera</code>
The main camera.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+sceneGraph"></a>

### gum.sceneGraph : <code>SceneGraph</code>
The scene graph widget.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+plyLoader"></a>

### gum.plyLoader
A model loader.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_loop"></a>

### gum.\_loop
Whether the app should call user draw in tick.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_timeAtLaunch"></a>

### gum.\_timeAtLaunch
The time stamp at the beginning of the run.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_time"></a>

### gum.\_time
The current time stamp.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_timeAtLastInfo"></a>

### gum.\_timeAtLastInfo
The time stamp at the last info report.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_frame"></a>

### gum.\_frame
The current frame number.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_lastNow"></a>

### gum.\_lastNow
The time at last tick.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+texers"></a>

### gum.texers
An array of textures.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+postProcessingStack"></a>

### gum.postProcessingStack
The post processing stack.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+tick"></a>

### gum.tick
The tick handler

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_imMatrix"></a>

### gum.\_imMatrix
Keep a matrix to transform each frame for immediate mod graphics.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+_identity"></a>

### gum.\_identity
Keep a clean identity to reset shaders.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+defaultPass"></a>

### gum.defaultPass
The name of the default geometry pass.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+globalUniforms"></a>

### gum.globalUniforms
Some global uniforms.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+recycleBuffer"></a>

### gum.recycleBuffer
Whether do do some extra blitting to get the full buffer ~after post processing~
back into the drawing buffer.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
<a name="Gum+time"></a>

### gum.time ⇒ <code>number</code>
Get the time since launch.

**Kind**: instance property of [<code>Gum</code>](#Gum)  
**Returns**: <code>number</code> - Milliseconds since launch.  
<a name="Gum+_setup"></a>

### gum.\_setup()
Internal set up. Runs dierectly before user setup.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+run"></a>

### gum.run(setup, draw)
Run this Gum App. 
TODO : This is ugly. Find a way to automatically find the setup and draw 
    functions.

**Kind**: instance method of [<code>Gum</code>](#Gum)  

| Param | Type |
| --- | --- |
| setup | <code>function</code> | 
| draw | <code>function</code> | 

<a name="Gum+clear"></a>

### gum.clear(color)
Set the background color. Like processing also has the effect of 
a full canvas clear

**Kind**: instance method of [<code>Gum</code>](#Gum)  

| Param | Type |
| --- | --- |
| color | <code>Color</code> | 

<a name="Gum+size"></a>

### gum.size()
Set the size of the canvas.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+color"></a>

### gum.color()
Make or get a color.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+_tick"></a>

### gum.\_tick()
The fire once per frame animation handler.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+_info"></a>

### gum.\_info()
Update any 'engine-level' gui components.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+loop"></a>

### gum.loop()
Turn looping on or off.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+drawScene"></a>

### gum.drawScene()
Render the whole 3D scene.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+drawNode"></a>

### gum.drawNode()
Render one 3D node.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+drawMesh"></a>

### gum.drawMesh()
Render one 3D mesh with the default matrix.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="Gum+orbit"></a>

### gum.orbit()
Set up orbit in the current scene.

**Kind**: instance method of [<code>Gum</code>](#Gum)  
<a name="globals"></a>

## globals : <code>object</code>
Some global helpers.

**Kind**: global namespace  
