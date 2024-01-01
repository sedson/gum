#version 300 es

precision mediump float;

// Defualt uniforms.
uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;

// Custom uniforms.
uniform vec4 uTexOffset;

in vec2 vTexCoord;
out vec4 fragColor;


void main() {
  vec2 texCoord = vTexCoord * 2.0 - 1.0;
  texCoord = (texCoord * uTexOffset.xy) + uTexOffset.zw;

  texCoord = (texCoord + 1.0) * 0.5;

  fragColor = texture(uMainTex, texCoord);
}