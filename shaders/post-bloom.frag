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
uniform float uThreshold;

in vec2 vTexCoord;
out vec4 fragColor;

#pragma include utils.glsl

void main() {
  vec4 col = texture(uMainTex, vTexCoord);

  vec3 accum = vec3(0.0);
  vec3 weightSum = vec3(0.0);

  vec2 pix = vec2(uDist, uDist) / uScreenSize;

  for (float i = -uKernel; i <= uKernel; i++) {
    for (float j = -uKernel; j <= uKernel; j++) {
      vec2 sampleCoord = vTexCoord + (vec2(i, j) * pix);
      

      vec4 sampleCol = texture(uMainTex, sampleCoord);
      float mask = step(uThreshold, brightness(sampleCol.rgb));


      accum += sampleCol.rgb * mask * uWeight;

      weightSum += uWeight;
    }
  }

  vec3 avg = accum / weightSum;

  

  fragColor = col;
  fragColor.rgb += avg;
      float mask = step(uThreshold, brightness(col.rgb));

  // fragColor = vec4(vec3(mask), 1.0);
  fragColor = vec4(avg, 1.0);
  

}