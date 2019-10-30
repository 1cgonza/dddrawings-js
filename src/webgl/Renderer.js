import RenderTarget from './utils/RenderTarget';
import ObjectRenderer from './utils/ObjectRenderer';

export default class Renderer {
  constructor(container, canvasOptions) {
    this.container = container;
    canvasOptions = canvasOptions || {};
    this.width = canvasOptions.width || window.innerWidth;
    this.height = canvasOptions.height || window.innerHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    container.appendChild(this.canvas);
    var gl =
      this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl', ctxOptions);
    this.gl = gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    this.renderTarget = new RenderTarget(gl, this.width, this.height);
    this.currentRenderer = new ObjectRenderer(gl, this);
    this.resize(this.width, this.height);
  }
  render(object) {
    object.renderWebGL(this);
  }
  resize(width, height) {
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}
