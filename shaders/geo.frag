#version 300 es

precision mediump float;

uniform vec3 uEye;
uniform vec4 uColor;

in vec4 vWorldPosition;
in vec4 vColor;
in vec3 vWorldNormal;
in vec3 vViewNormal;
in vec3 vSurfaceId;
in float vDepth;
in float vId;

out vec4 fragColor;

void main() {
  vec3 lightDir = normalize(vec3(3.0, 4.0, 2.0));
  float nDotL = clamp(dot(vWorldNormal, lightDir), 0.0, 1.0);
  float light = clamp(smoothstep(0.1, 0.4, nDotL) + 0.8, 0.0, 1.0);
  float nDotV = dot(vViewNormal, vec3(0.0, 0.0, 1.0));

  fragColor = vec4(vId, nDotV, nDotL, 1.0);

  fragColor = vec4(vViewNormal * 0.5 + 0.5, 1.0);
  fragColor = vec4(vSurfaceId, 1.0);
}