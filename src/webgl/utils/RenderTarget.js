import { Rectangle, Matrix } from '../../math';

export default class RenderTarget {
  constructor(gl, width, height) {
    this.gl = gl;
    this.size = new Rectangle(0, 0, 1, 1);
    this.projectionMatrix = new Matrix();
    this.resize(width, height);
  }
  resize(width, height) {
    width = width | 0;
    height = height | 0;
    if (this.size.width === width && this.size.height === height) {
      return;
    }
    this.size.width = width;
    this.size.height = height;
    var pm = this.projectionMatrix.identity();
    pm.a = 2 / this.size.width;
    pm.d = -2 / this.size.height;
    pm.tx = -1;
    pm.ty = 1;
  }
}
