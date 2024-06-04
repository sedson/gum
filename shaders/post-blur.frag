#version 300 es

precision mediump float;

// Defualt uniforms.
uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;

// Custom uniforms.
uniform float uKernel;
uniform float uDist;
uniform float uWeight;

in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  vec4 col = texture(uMainTex, vTexCoord);

  vec3 accum = vec3(0.0);
  vec3 weightSum = vec3(0.0);

  vec2 pix = vec2(uDist, uDist) / uScreenSize;

  for (float i = -uKernel; i <= uKernel; i++) {
    for (float j = -uKernel; j <= uKernel; j++) {
      vec2 sampleCoord = vTexCoord + (vec2(i, j) * pix);
      accum += texture(uMainTex, sampleCoord).rgb * uWeight;
      weightSum += uWeight;
    }
  }

  vec3 avg = accum / weightSum;

  fragColor = vec4(avg, 1.0);
}