#version 300 es

precision mediump float;

// Defualt uniforms.
uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;

// Custom uniforms.
uniform vec4 uBlendColor;

in vec2 vTexCoord;
out vec4 fragColor;


void main() {
  vec4 col = texture(uMainTex, vTexCoord);
  fragColor = col;
  fragColor.rgb = mix(col, uBlendColor, uBlendColor.a).rgb;
}