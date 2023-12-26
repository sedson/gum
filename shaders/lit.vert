#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform float uObjectId;

in vec4 aPosition;
in vec3 aNormal;
in vec4 aColor;
in vec4 aRegister1;
in float aSurfaceId;

out vec4 vColor;
out vec3 vNormal;

void main() 
{
  vec4 pos = aPosition;
  pos.xyz += aRegister1.xyz;
  gl_Position = uProjection * uView * uModel * pos;
  mat3 normMatrix = transpose(inverse(mat3(uView * uModel)));
  vColor = aColor;
  vNormal = transpose(inverse(mat3(uModel))) * aNormal;
}