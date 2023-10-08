#version 300 es

precision mediump float;

// Defualt uniforms.
uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uTexSize;

// Custom uniforms.
uniform float kernel;
uniform float dist;
uniform float weight;

in vec2 vTexCoord;
out vec4 fragColor;


void main() {
  vec4 col = texture(uMainTex, vTexCoord);

  vec3 accum = vec3(0.0);
  vec3 weightSum = vec3(0.0);

  vec2 pix = vec2(dist, dist) / uTexSize;



  for (float i = -kernel; i <= kernel; i++) {
    for (float j = -kernel; j <= kernel; j++) {
      vec2 sampleCoord = vTexCoord + (vec2(i, j) * pix);
      accum += texture(uMainTex, sampleCoord).rgb * weight;
      weightSum += weight;
    }
  }

  vec3 avg = accum / weightSum;

  
  fragColor = vec4(avg, 1.0);

}