export default class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  copy(p) {
    this.set(p.x, p.y);
  }
  equals(p) {
    return p.x === this.x && p.y === this.y;
  }
  set(x, y) {
    this.x = x || 0;
    this.y = y || y !== 0 ? this.x : 0;
  }
}
