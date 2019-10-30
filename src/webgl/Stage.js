import { isPowerOfTwo } from '../math';
import Point from '../math/Point';

export default class Stage {
  constructor(imgData, renderer, batchSize) {
    this.children = [];
    this.texture = {};
    this.data = imgData;
    this.renderer = renderer;
    this.loadImg(imgData.url);
    this.setBatchSize(batchSize);
  }
  setBatchSize(batchSize) {
    var maxBatchSize = 16384;
    var maxSize = 15000;
    if (batchSize > maxBatchSize) {
      batchSize = maxBatchSize;
    }
    if (batchSize > maxSize) {
      batchSize = maxSize;
    }
    this.batchSize = batchSize;
  }
  renderWebGL(renderer) {
    renderer.currentRenderer.render(this);
  }
  bindTexture() {
    var gl = this.renderer.gl;
    var texture = this.texture;
    if (!texture.glTexture) {
      texture.glTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
    /*----------  SET ALPHA  ----------*/
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.img
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (texture.mipmap && texture.isPowerOfTwo) {
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    if (!texture.isPowerOfTwo) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    return true;
  }
  loadImg(url) {
    this.img = new Image();
    this.img.onload = this.imgLoaded.bind(this);
    this.img.src = url;
  }
  imgLoaded() {
    var w = this.img.naturalWidth;
    var h = this.img.naturalHeight;
    var texture = {
      loaded: true,
      isPowerOfTwo: isPowerOfTwo(w, h)
    };
    var frames = [];
    for (var i = 0; i < this.data.frames.length; i++) {
      var frame = this.data.frames[i];
      frames.push({
        width: frame.w,
        height: frame.h,
        uvs: [
          frame.x / w,
          frame.y / h,
          (frame.x + frame.w) / w,
          (frame.y + frame.h) / h
        ]
      });
    }
    this.renderer.frames = frames;
    this.texture = texture;
    this.bindTexture();
    if (this.data.cb) {
      this.data.cb();
    }
  }
  particle(obj) {
    obj = obj || {};
    obj.scale = obj.scale || new Point(1, 1);
    obj.alpha = obj.alpha || 1;
    obj.rotation = obj.rotation || 0;
    obj.x = obj.x || 0;
    obj.y = obj.y || 0;
    obj.frame = obj.frame || 0;
    this.children.push(obj);
    if (this.children.length > this.batchSize) {
      this.setBatchSize(this.children.length);
    }
    return obj;
  }
}
