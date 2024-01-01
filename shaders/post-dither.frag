#version 300 es
precision mediump float;

// Defualt uniforms.
uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;

// Custom uniforms.
uniform vec4 uColorA;
uniform vec4 uColorB;


in vec2 vTexCoord;
out vec4 fragColor;

#pragma include noise.glsl

const int[64] BAYER64 = int[](
  0, 32, 8, 40, 2, 34, 10, 42,    /* 8x8 Bayer ordered dithering */
  48, 16, 56, 24, 50, 18, 58, 26, /* pattern. Each input pixel */
  12, 44, 4, 36, 14, 46, 6, 38,   /* is scaled to the 0..63 range */
  60, 28, 52, 20, 62, 30, 54, 22, /* before looking in this table */
  3, 35, 11, 43, 1, 33, 9, 41,    /* to determine the action. */
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

void main() {
  vec4 col = texture(uMainTex, vTexCoord);
  float brightness = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));

  vec2 xy = vTexCoord * uScreenSize;

  int x = int(mod(xy.x, 8.0));
  int y = int(mod(xy.y, 8.0));

  float n = float(BAYER64[y * 8 + x]);

  brightness += (bnoise(vTexCoord * uScreenSize) * 2.0 - 1.0) * 0.0;

  float pix = step(n, brightness * 63.0);


  vec3 rgb = mix(uColorB.rgb,  uColorA.rgb, pix);
  fragColor = vec4(rgb, 1.0);
  // fragColor = vec4(vec3(noise), 1.0);

  // fragColor = vec4(gl_FragCoord.xy / uScreenSize, 0.0, 1.0);

}