import Shader from './Shader';

export default class ObjectRenderer {
  constructor(gl, renderer) {
    this.renderer = renderer;
    this.gl = gl;
    this.start();
  }
  start() {
    var gl = this.gl;
    var shader = new Shader(gl);
    this.properties = [
      // verticesData
      {
        attribute: shader.attributes.aVertexPosition,
        size: 2
      },
      // positionData
      {
        attribute: shader.attributes.aPositionCoord,
        size: 2
      },
      // rotationData
      {
        attribute: shader.attributes.aRotation,
        size: 1
      },
      // uvsData
      {
        attribute: shader.attributes.aTextureCoord,
        size: 2
      },
      // alphaData
      {
        attribute: shader.attributes.aAlpha,
        size: 1
      }
    ];
    for (var i = 0; i < this.properties.length; i++) {
      gl.enableVertexAttribArray(i);
    }
    var m = this.renderer.renderTarget.projectionMatrix;
    gl.uniformMatrix3fv(
      shader.uniforms.projectionMatrix._location,
      false,
      m.toArray(true)
    );
  }
  render(container) {
    var texture = container.texture;
    var children = container.children;
    var total = children.length;
    var maxSize = container.maxSize;
    this.size = container.batchSize;
    var gl = this.gl;
    if (total === 0) {
      return;
    } else if (total > maxSize) {
      total = maxSize;
    }
    if (!this.data) {
      this.initBuffers();
      for (var i = 0; i < this.properties.length; i++) {
        var property = this.properties[i];
        gl.vertexAttribPointer(
          property.attribute,
          property.size,
          gl.FLOAT,
          false,
          this.stride * 4,
          property.offset * 4
        );
      }
    }
    this.updateData(children, total);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data);
    gl.drawElements(gl.TRIANGLES, total * 6, gl.UNSIGNED_SHORT, 0);
  }
  initBuffers() {
    var gl = this.gl;
    var dynamicOffset = 0;
    this.stride = 0;
    for (var i = 0; i < this.properties.length; i++) {
      var property = this.properties[i];
      property.offset = dynamicOffset;
      dynamicOffset += property.size;
      this.stride += property.size;
    }
    this.data = new Float32Array(this.size * this.stride * 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
    var numIndices = this.size * 6;
    var indices = new Uint16Array(numIndices);
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
      indices[i] = j;
      indices[i + 1] = j + 1;
      indices[i + 2] = j + 2;
      indices[i + 3] = j;
      indices[i + 4] = j + 2;
      indices[i + 5] = j + 3;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }
  updateData(children, amount) {
    var stride = this.stride;
    var n = 0;
    var data = this.data;
    var textures = this.renderer.frames;
    for (var i = 0; i < amount; i++) {
      var target = children[i];
      var texture = textures[target.frame];
      var w = texture.width * target.scale;
      var h = texture.height * target.scale;
      var x = target.x;
      var y = target.y;
      var r = target.rotation;
      var uvs = texture.uvs;
      var a = target.alpha;
      /*
        [
          vertice   pos   rot   uvs    alpha
          w,h,      x,y,  r,    x,y,   a
          w,h,      x,y,  r,    x,y,   a
          w,h,      x,y,  r,    x,y,   a
          w,h,      x,y,  r,    x,y,   a
        ]
     */
      /*----------  Vertex 1  ----------*/
      data[n] = -w;
      data[++n] = -h; // Size
      data[++n] = x;
      data[++n] = y; // Pos
      data[++n] = r; // Rotation
      data[++n] = uvs[0];
      data[++n] = uvs[1]; // Uvs
      data[++n] = a; // Alpha
      /*----------  Vertex 2  ----------*/
      data[++n] = w;
      data[++n] = -h;
      data[++n] = x;
      data[++n] = y;
      data[++n] = r;
      data[++n] = uvs[2];
      data[++n] = uvs[1];
      data[++n] = a;
      /*----------  Vertex 3  ----------*/
      data[++n] = w;
      data[++n] = h;
      data[++n] = x;
      data[++n] = y;
      data[++n] = r;
      data[++n] = uvs[2];
      data[++n] = uvs[3];
      data[++n] = a;
      /*----------  Vertex 4  ----------*/
      data[++n] = -w;
      data[++n] = h;
      data[++n] = x;
      data[++n] = y;
      data[++n] = r;
      data[++n] = uvs[0];
      data[++n] = uvs[3];
      data[++n] = a;
      n++;
    }
  }
}
