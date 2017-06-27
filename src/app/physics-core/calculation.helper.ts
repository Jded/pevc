import { Vector3 } from 'three';

export class CalculationHelper {
  static getKsi(ksqr, h, number) {
    // function for numerically solving tan (ksi*h) = ksi * h /k33^2 for ksi
    let nextKsi, prevKsi;
    prevKsi = Math.PI * 2 * number;
    nextKsi = (Math.atan(prevKsi * h / ksqr) + Math.PI * 2 * number) / h;
    while ((nextKsi - prevKsi) / prevKsi > 0.0001) {
      prevKsi = nextKsi;
      nextKsi = (Math.atan(prevKsi * h / ksqr) + Math.PI * 2 * number) / h;
    }
    return nextKsi;
  }

  static getElongation (geometry1, geometry2, axis) {
    const max1: number = geometry1.vertices.reduce((previous: number, current: Vector3, index: number) => {
      return Math.max(previous, current[axis])
    }, -Infinity);
    const min1: number = geometry1.vertices.reduce((previous: number, current: Vector3, index: number) => {
      return Math.min(previous, current[axis])
    }, Infinity);
    const max2: number = geometry2.vertices.reduce((previous: number, current: Vector3, index: number) => {
      return Math.max(previous, current[axis])
    }, -Infinity);
    const min2: number = geometry2.vertices.reduce((previous: number, current: Vector3, index: number) => {
      return Math.min(previous, current[axis])
    }, Infinity);
    const base: number = max1 - min1;
    const mod: number = max2 - min2;
    return base ? mod / base : 0;
  }

}
