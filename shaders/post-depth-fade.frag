#version 300 es

precision mediump float;

uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;
uniform float uNear;
uniform float uFar;
uniform float uStart;
uniform float uEnd;


uniform vec4 uBlendColor;

in vec2 vTexCoord;
out vec4 fragColor;

float linearDepth(float d, float near, float far) {
  float z = d * 2.0 - 1.0;
  return (2.0 * near * far) / (far + near - d * (far - near)) / far;
}


void main() {
  float depth = texture(uDepthTex, vTexCoord).r;
  float lDepth = linearDepth(depth, uNear, uFar);
  float m = smoothstep(uStart, uEnd, lDepth * (uFar - uNear) + uNear);
  vec4 col = texture(uMainTex, vTexCoord);
  fragColor = col;
  fragColor.rgb = mix(col.rgb, uBlendColor.rgb, m * uBlendColor.a);
}