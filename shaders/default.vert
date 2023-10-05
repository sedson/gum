#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

in vec4 aPosition;
in vec4 aColor;

out vec4 vColor;

void main() 
{
  mat4 modelView = uView * uModel;
  gl_Position = uProjection * uView * uModel * aPosition;
  vColor = aColor;
}