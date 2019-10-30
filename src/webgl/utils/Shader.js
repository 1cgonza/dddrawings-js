import particlesVS from '../shaders/particles.vs';
import particlesFS from '../shaders/particles.fs';

export default class Shader {
  constructor(gl) {
    this.gl = gl;
    this.uniforms = {
      projectionMatrix: {}
    };
    this.attributes = {};
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, particlesVS);
    gl.compileShader(vertexShader);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, particlesFS);
    gl.compileShader(fragmentShader);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // clear shader from memory after linking program
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    this.program = program;
    gl.useProgram(program);
    this.cacheUniformLocations(['projectionMatrix']);
    this.cacheAttributeLocations([
      'aVertexPosition',
      'aTextureCoord',
      'aAlpha',
      'aPositionCoord',
      'aRotation'
    ]);
  }
  cacheUniformLocations(keys) {
    for (var i = 0; i < keys.length; ++i) {
      this.uniforms[keys[i]]._location = this.gl.getUniformLocation(
        this.program,
        keys[i]
      );
    }
  }
  cacheAttributeLocations(keys) {
    for (var i = 0; i < keys.length; ++i) {
      this.attributes[keys[i]] = this.gl.getAttribLocation(
        this.program,
        keys[i]
      );
    }
  }
}
