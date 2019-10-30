precision lowp float;

varying vec2 vTextureCoord;
varying float vAlpha;

uniform sampler2D uImage;

void main(void){
  vec4 color = texture2D(uImage, vTextureCoord) * vAlpha;
  if (color.a == 0.0) discard;
  gl_FragColor = color;
}