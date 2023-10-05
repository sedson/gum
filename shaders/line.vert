#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform float uNear;
uniform float uFar;
uniform float uAspect;
uniform float uObjectId;

in vec4 aPosition;
in vec4 aColor;
in vec4 aRegister1; // .xyz is previous
in vec4 aRegister2; // .xyz is next
in vec3 aNormal;    // .x is thickness
                    // .y is orinetation

out vec4 vColor;


/**
 * 
 */ 
void main () {
  mat4 mvp = uProjection * uView * uModel;
  vec2 aspect = vec2(uAspect, 1.0);

  float thickness = aNormal.x;
  float orientation = aNormal.y;

  vec4 current = mvp * vec4(aPosition.xyz, 1.0);
  vec4 previous = mvp * vec4(aRegister1.xyz, 1.0);
  vec4 next = mvp * vec4(aRegister2.xyz, 1.0);


  // could use z component to scale by distance.
  vec2 currentScreen = current.xy / current.w * aspect;
  vec2 previousScreen = previous.xy / previous.w * aspect;
  vec2 nextScreen = next.xy / next.w * aspect;

  vec2 lineDir = vec2(0.0);
  
  if (currentScreen == previousScreen) {
    lineDir = normalize(nextScreen - currentScreen);
  } 
  else if (currentScreen == nextScreen) {
    lineDir = normalize(currentScreen - previousScreen);
  }
  else {
    vec2 dirA = normalize(currentScreen - previousScreen);
    if (orientation == 1.0) {
      vec2 dirB = normalize(nextScreen - currentScreen);

      vec2 tangent = normalize(dirA + dirB);
      vec2 perp = vec2(-dirA.y, dirA.x);
      vec2 miter = vec2(-tangent.y, tangent.x);

      lineDir = tangent;
      thickness = thickness / dot(miter, perp);

      thickness = clamp(thickness, 0.0, aNormal.x * 3.0);

    } else {
      lineDir = dirA;
    }
  }

  vec2 normal = vec2(-lineDir.y, lineDir.x) * thickness * 0.5;
  normal.x /= uAspect;

  vec4 offset = vec4(normal * orientation, 0.0, 0.0);

  gl_Position = current + offset;
  vColor = aColor;
}