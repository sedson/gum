#version 300 es

precision mediump float;

in vec4 vColor;
in vec3 vNormal;

out vec4 fragColor;

void main() {
  if (!gl_FrontFacing) {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    return;
  }

  vec3 l = normalize(vec3(1.0, 1.0, 1.0));
  float ndotl = dot(normalize(vNormal), l);

  ndotl = clamp(ndotl, 0.0, 1.0);


  fragColor = vec4(vColor.rgb * ndotl, 1.0);

  // fragColor = vec4(vNormal, 1.0);

}