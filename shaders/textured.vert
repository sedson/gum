#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform float uObjectId;

in vec4 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;
in vec4 aColor;
in float aSurfaceId;

out vec4 vColor;
out vec2 vTexCoord;

vec3 hashId(float id) {
  float r = fract(mod(id * 25738.32498, 456.221));
  float g = fract(mod(id * 565612.08321, 123.1231));
  float b = fract(mod(id * 98281.32498, 13.221));
  return vec3(r, g, b);
}

void main() {
  mat4 modelView = uView * uModel;
  gl_Position = uProjection * uView * uModel * aPosition;
  vColor = aColor;
  vTexCoord = aTexCoord;
}