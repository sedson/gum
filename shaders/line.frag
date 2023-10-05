#version 300 es

precision mediump float;

uniform vec3 uEye;

in vec4 vColor;

out vec4 fragColor;

void main () {
  fragColor = vColor;
}