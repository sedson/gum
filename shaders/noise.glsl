float rand (float n) {
  return fract(sin(n) * 43748.5453123);
}

float rand (vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float bnoise (float p) {
  float pInt = floor(p);
  float pFract = fract(p);
  return mix(rand(pInt), rand(pInt + 1.0), pFract);
}

float bnoise (vec2 p) {
  vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(p);
  vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(p));
  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}