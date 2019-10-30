attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute float aAlpha;

attribute vec2 aPositionCoord;
attribute float aRotation;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;
varying float vAlpha;

void main(void){
  float cosine = cos(aRotation);
  float sine = sin(aRotation);

  vec3 v;
  v.x = aVertexPosition.x * cosine - aVertexPosition.y * sine;
  v.y = aVertexPosition.x * sine + aVertexPosition.y * cosine;
  v.z = 1.0;

  // Move
  v.xy += aPositionCoord;

  gl_Position = vec4(projectionMatrix * v, 1.0);

  vTextureCoord = aTextureCoord;
  vAlpha = aAlpha;
}