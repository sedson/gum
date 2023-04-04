#version 300 es

precision mediump float;

uniform sampler2D uTex;

in vec4 vColor;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  fragColor.rg = vTexCoord;
  fragColor.a = 1.0;

  fragColor = texture(uTex, vTexCoord);
}