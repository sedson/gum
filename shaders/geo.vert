#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform float uNear;
uniform float uFar;
uniform float uObjectId;
uniform float uAspect;

in vec4 aPosition;
in vec4 aColor;

in vec4 aNormal;
in float aSurfaceId;

out vec4 vWorldPosition;
out vec4 vColor;
out vec3 vWorldNormal;
out vec3 vViewNormal;
out vec3 vSurfaceId;
out float vDepth;
out float vId;

/**
 *
 */
vec3 hashId(float id) {
  float r = fract(mod(id * 25738.32498, 456.221));
  float g = fract(mod(id * 565612.08321, 123.1231));
  float b = fract(mod(id * 98281.32498, 13.221));
  return vec3(r, g, b);
}


/**
 *
 */
void main() {
  gl_PointSize = 20.0;
  mat4 modelView = uView * uModel;
  mat3 normMatrix = transpose(inverse(mat3(modelView)));
  vViewNormal = normalize(normMatrix * aNormal.xyz);
  vWorldNormal = normalize(mat3(uModel) * aNormal.xyz);
  vColor = aColor;

  gl_Position = uProjection * uView * uModel * aPosition;

  vec3 rounded = round(gl_Position.xyz * 20.0) / 20.0;
  // gl_Position.xyz = rounded;

  float id = mod(aSurfaceId + uObjectId, 255.0);
  vId = id / 255.0 + (1.0 / 255.0);

  vSurfaceId = hashId(aSurfaceId + uObjectId);

  vWorldPosition = uModel * aPosition;
}