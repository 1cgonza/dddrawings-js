import Point from './Point';
import Rectangle from './Rectangle';
import Matrix from './Matrix';
import Vector from './Vector';
import Transform from './Transform';

export const PI = Math.PI;
export const TWO_PI = PI * 2;
export const HALF_PI = PI / 2;
export const QUARTER_PI = PI / 4;
export const toRad = PI / 180;

export function random(min, max, isFloat) {
  let random = Math.floor(Math.random() * (max - min)) + min;

  if (isFloat) {
    random = Math.random() * (max - min) + min;
  }

  return random;
}

export function sizeFromPercentage(percent, totalSize) {
  return (percent / 100) * totalSize;
}

export function getPercent(section, total) {
  return (section / total) * 100;
}

export function isPowerOfTwo(width, height) {
  return (
    width > 0 &&
    (width & (width - 1)) === 0 &&
    height > 0 &&
    (height & (height - 1)) === 0
  );
}

export { Transform, Point, Rectangle, Matrix, Vector };
