#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform float uNear;
uniform float uFar;
uniform float uAspect;
uniform float uObjectId;

in vec3 aPosition;
in vec4 aColor;
in vec4 aRegister1; // .xyz is next
in vec3 aNormal;    // .x is thickness
                    // .y is corner index

out vec4 vColor;


/**
 * 
 */ 
void main () {
  mat4 mvp = uProjection * uView * uModel;
  vec2 aspect = vec2(uAspect, 1.0);

  float thickness = aNormal.x;
  float orientation = aNormal.y;

  float extension = thickness * 0.25;

  vec4 current = mvp * vec4(aPosition.xyz, 1.0);
  vec4 next = mvp * vec4(aRegister1.xyz, 1.0);

  // could use z component to scale by distance.
  vec2 currentScreen = current.xy / current.w;
  vec2 nextScreen = next.xy / next.w;

  vec2 lineDir = normalize(nextScreen - currentScreen);


  vec2 normal = vec2(-lineDir.y, lineDir.x) * 0.5 * thickness;

  normal.x /= uAspect;


  if (aNormal.y < 1.0) {

    current.xy -= normal;
    current.xy -= lineDir * extension;
    gl_Position = current;

  } else if (aNormal.y < 2.0) {

    current.xy += normal;
    current.xy -= lineDir * extension;
    gl_Position = current;

  } else if (aNormal.y < 3.0) {

    next.xy -= normal;
    next.xy += lineDir * extension;
    gl_Position = next;

  } else {

    next.xy += normal;
    next.xy += lineDir * extension;
    gl_Position = next;

  }

  vColor = aColor;
}