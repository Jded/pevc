import { Geometry, Vector3, Face3 } from 'three'

export class PiezoPlateGeometry extends Geometry {
  dimensions: number[];
  resolution: number[];

  constructor(dimensions: number[], resolution: number[]) {
    super();
    this.dimensions = dimensions;
    this.resolution = resolution;
    this.addSideSet([0, 2, 1]);
    this.addSideSet([0, 1, 2]);
    this.addSideSet([2, 1, 0]);
  }

  addSideSet (sideMap: number[]) {
    const startPoint = [-(this.dimensions[sideMap[0]] / 2), -(this.dimensions[sideMap[1]] / 2)];
    const endPoint = [(this.dimensions[sideMap[0]] / 2), (this.dimensions[sideMap[1]] / 2)];
    const constant = -this.dimensions[sideMap[2]] / 2;
    const effectiveResolution = [this.resolution[sideMap[0]], this.resolution[sideMap[1]]];
    this.addSide(sideMap, startPoint, endPoint, constant, effectiveResolution);
    this.addSide(sideMap, startPoint, endPoint, -constant, effectiveResolution);
  }

  addSide (sideMap, startPoint, endPoint, constantDimension, effectiveResolution) {
    const startIndex = this.vertices.length;
    const distance: number = startPoint.map((start, index) => {
      return (endPoint[index] - startPoint[index]) / (effectiveResolution[index] - 1);
    })
    for (let j = 0; j < effectiveResolution[1]; j++) {
      for (let i = 0; i < effectiveResolution[0]; i++) {
        const temp = [];
        temp[sideMap[0]] = startPoint[0] + distance[0] * i;
        temp[sideMap[1]] = startPoint[1] + distance[1] * j;
        temp[sideMap[2]] = constantDimension;
        this.vertices.push(new Vector3(temp[0], temp[1], temp[2]))
      }
    }
    for (let i = 0; i < effectiveResolution[0] - 1; i++) {
      for (let j = 0; j < effectiveResolution[1] - 1; j++) {
        const faceStartPoint: number = startIndex + i + j * effectiveResolution[0];
        this.faces.push(new Face3(faceStartPoint, faceStartPoint + 1, faceStartPoint + effectiveResolution[0]));
        this.faces.push(new Face3(faceStartPoint + effectiveResolution[0],
          faceStartPoint + 1, faceStartPoint + 1 + effectiveResolution[0]));
      }
    }
  }
}
