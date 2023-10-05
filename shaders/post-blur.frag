#version 300 es

precision mediump float;

uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uTexSize;

in vec2 vTexCoord;
out vec4 fragColor;

const float kernel = 2.0;
const float dist = 2.0;
const float weight = 1.0;

vec4 gradient(sampler2D tex, vec2 coord) {
  vec2 offset = vec2(1.0, 1.0) / uTexSize;

  vec4 xSum = vec4(0.0);
  vec4 ySum = vec4(0.0);

  xSum += texture(tex, coord + vec2(-offset.x, 0.0)) * -1.0;
  xSum += texture(tex, coord + vec2(+offset.x, 0.0));

  ySum += texture(tex, coord + vec2(0.0, -offset.y)) * -1.0;
  ySum += texture(tex, coord + vec2(0.0, +offset.y));

  return sqrt(xSum * xSum + ySum * ySum);
}

void main() {
  vec4 col = texture(uMainTex, vTexCoord);

  vec3 accum = vec3(0.0);
  vec3 weightSum = vec3(0.0);

  vec2 pix = vec2(1.0, 1.0) / uTexSize;



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