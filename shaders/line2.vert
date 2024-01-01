#version 300 es

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform float uNear;
uniform float uFar;
uniform float uAspect;
uniform float uObjectId;
uniform vec2 uScreenSize;

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

  float thickness = aNormal.x;
  float orientation = aNormal.y;  

  // Calculate the screen space 
  vec4 current = mvp * vec4(aPosition.xyz, 1.0);
  vec4 next = mvp * vec4(aRegister1.xyz, 1.0);

  vec2 currentScreen = current.xy / current.w;
  vec2 nextScreen = next.xy / next.w;

  vec2 lineDir = normalize(nextScreen - currentScreen);
  vec2 normal = vec2(-lineDir.y, lineDir.x);

  float persp = current.w;
  if (orientation > 1.5) {
    persp = next.w;
  }

  vec2 offset = persp * thickness * normal / uScreenSize;
  vec2 extension = 0.25 * persp * thickness * lineDir / uScreenSize;

  if (orientation < 1.0) {

    current.xy += -offset - extension;
    gl_Position = current;

  } else if (orientation < 2.0) {

    current.xy += +offset - extension;
    gl_Position =  current;

  } else if (orientation < 3.0) {

    next.xy += -offset + extension;
    gl_Position = next;

  } else {

    next.xy += +offset + extension;
    gl_Position = next;

  }
  vColor = aColor;
}