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

vec3 hashId (float id) 
{
  float r = fract(mod(id * 25738.32498, 456.221));
  float g = fract(mod(id * 565612.08321, 123.1231));
  float b = fract(mod(id * 98281.32498, 13.221));
  return vec3(r, g, b);
}

void main() 
{
  mat4 modelView = uView * uModel;
  vec4 pos = aPosition;
  pos.xyz += aRegister1.xyz;
  
  gl_Position = uProjection * uView * uModel * pos;
  

  vec3 vertexColor = aColor.rgb;
  vec3 localNormal = aNormal.rgb * 0.5 + 0.5;
  vec3 surfaceId = hashId(uObjectId + aSurfaceId);

  vColor.a = 1.0;
  vColor = aColor;
}