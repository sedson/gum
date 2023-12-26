#version 300 es

precision mediump float;

#pragma include noise.glsl


uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uTexSize;
uniform float uNear;
uniform float uFar;


in vec2 vTexCoord;
out vec4 fragColor;


void main() {
  vec4 col = texture(uMainTex, vTexCoord);

  vec2 rOff = vec2(bnoise(col.x * 2.0), bnoise(col.y * 5.0));
  vec2 gOff = vec2(bnoise(col.y * -6.3), bnoise(col.z * 300.0));
  vec2 bOff = vec2(bnoise(col.z * -6.3), bnoise(col.x * 1.4));
  vec2 pixelSize = 1.0 / uTexSize;

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