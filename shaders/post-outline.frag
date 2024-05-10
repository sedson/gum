#version 300 es

precision mediump float;

uniform sampler2D uMainTex;
uniform sampler2D uDepthTex;
uniform vec2 uScreenSize;
uniform float uNear;
uniform float uFar;

uniform vec4 uColorA;
uniform vec4 uColorB;
uniform float uDist;


in vec2 vTexCoord;
out vec4 fragColor;

float linearDepth(float d, float near, float far) {
  float z = d * 2.0 - 1.0;
  return (2.0 * near * far) / (far + near - d * (far - near)) / far;
}

vec4 gradient(sampler2D tex, vec2 coord) {
  vec2 offset = vec2(uDist, uDist) / uScreenSize;

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
  float depth = texture(uDepthTex, vTexCoord).r;
  float lDepth = linearDepth(depth, uNear, uFar);

  vec4 colGrad = gradient(uMainTex, vTexCoord);
  vec4 depthGrad = gradient(uDepthTex, vTexCoord);

  float idQ = mix(colGrad.r, 0.0, smoothstep(0.0, 0.3, lDepth));

  float idEdge = step(0.0001, colGrad.x);

  float depthQ = mix(0.0, 100.0, smoothstep(0.0, 0.01, col.g));

  float depthEdge = step(0.01, depthGrad.r);

  float normEdge = step(0.3, colGrad.g);

  float edge = max(idEdge, depthEdge);

  vec3 grad = vec3(idEdge, depthEdge, 0.0);

  float fog = smoothstep(4.0, 40.0, lDepth * (uFar - uNear));

  fragColor.rgb = mix(uColorA.rgb, uColorB.rgb, edge);
  fragColor.a = 1.0;

  // float surfaceId = round(col.r * 20.0);
  // fragColor.rgb = mix(vec3(0.2, 0.2, 0.2), vec3(0.6, 0.5, 0.5), 1.0 - fog);
  // fragColor.rgb *= 1.0 - ((1.0 - fog) * edge);
  // fragColor.a = 1.0;

  // fragColor = vec4(vec3(edge * 0.4 + 0.1), 1.0);

  // fragColor = vec4(1.0, 0.0, 0.0, 1.0);

  // fragColor = vec4(mix(vec3(1.0, 1.0, 0.2), vec3(0.1, 0.1, 0.1), edge), 1.0);

  // fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  // fragColor = vec4(vec3(idEdge), 1.0);
  // fragColor = vec4(colGrad.ggg, 1.0);
  // fragColor = vec4(1.0, 0.0, 1.0, 1.0);
  // fragColor = vec4(vec3(fog), 1.0);

}