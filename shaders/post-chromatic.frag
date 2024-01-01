#version 300 es

precision mediump float;

uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;
uniform float uNear;
uniform float uFar;


in vec2 vTexCoord;
out vec4 fragColor;


void main() {
  vec2 rOff = vec2(0.0, 4.0);
  vec2 gOff = vec2(0.0, 0.0);
  vec2 bOff = vec2(4.0, 0.0);
  vec2 pixelSize = 1.0 / uScreenSize;
  vec4 col = texture(uMainTex, vTexCoord);

  fragColor = col;
  float r = texture(uMainTex, vTexCoord + (pixelSize * rOff)).r;
  float g = texture(uMainTex, vTexCoord + (pixelSize * gOff)).g;
  float b = texture(uMainTex, vTexCoord + (pixelSize * bOff)).b;

  fragColor.rgb = vec3(r, g, b);

  // vec2 uv = vTexCoord;
  // uv *= 1.0 - uv.xy;

  // float vig = uv.x * uv.y * 15.0;

  // vig = pow(vig, 0.03);

  // fragColor.rgb *= vig;
}