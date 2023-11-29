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
  // fragColor = vec4(vTexCoord, 0.0, 1.0);
  // float f = smoothstep(0.39, 0.4, distance(vTexCoord, vec2(0.5, 0.5)));
  // fragColor = vec4(vec3(f), 1.0);
}