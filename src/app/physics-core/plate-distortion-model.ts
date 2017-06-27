import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';
import { BoxGeometry } from 'three'
import { PiezoPlateGeometry } from '../plate-renderer/rendering-extensions/plate-geometry';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { Constants } from './constants';
import { CalculationHelper } from './calculation.helper';
import { ModelValueOverride } from '../distortion-modes/model-value-override';
import { isUndefined } from 'util';

export class PlateDistortionModel {
  initTime: number;
  time: number;
  timeExpansion: number;
  harmonic: number;
  frequency: number;
  strain: number[][];
  stress: number[][];
  resolution: number[];
  dimensions: number[];
  boundaryConditions: number[];
  mode: DistortionMode;
  material: Material;
  voltage: number;
  voltageOutput: number;
  externalForces: number;
  linearExaggeration: number;
  box: BoxGeometry;
  basicGeometry: PiezoPlateGeometry;
  modifiedGeometry: PiezoPlateGeometry;

  constructor(initTime) {
    // super();
    this.initTime = initTime;
    this.time = initTime;
    this.timeExpansion = 10;
    this.linearExaggeration = 1;
    this.harmonic = 2;
    this.frequency = 0;
    this.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.stress = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.resolution = [10, 50, 10];
    this.dimensions = [10, 1, 10];
    this.boundaryConditions = [];
    this.mode = new PressureOpen();
    this.material = null; // pzMaterial.getMaterial('PZT5H');
    this.voltage = 0;
    this.externalForces = 1;
    this.setOverrides();
    this.fillGeometries();
  }

  fillGeometries() {
    // var existing = !!this.basicGeometry;
    this.basicGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
    this.box = new BoxGeometry(this.dimensions[0], this.dimensions[1], this.dimensions[2])
    this.modifiedGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
    // if(existing){$rootScope.$broadcast("pzExchangeGeometry");}
  }

  update(timestamp) {
    const time: number = timestamp - this.initTime;
    // pzCalculator.updateModelData(this.mode,this,time);
    this.modifiedGeometry.verticesNeedUpdate = true;
    // $rootScope.$broadcast('pzPlateUpdate',timestamp);
  }

  resetTime(time) {
    this.initTime = time;
  }

  updateTime(timestamp) {
    if (this.mode.api.time === ModeApiValue.INPUT) {
      const time = timestamp - this.initTime;
      this.mode.distortModel(this, time);
      this.modifiedGeometry.verticesNeedUpdate = true;
      // $rootScope.$broadcast('pzTimeUpdate',timestamp);
      return true;
    }
    return false;
  }

  getScaledTime = function () {
    const timeDelta: number = Date.now() - this.initTime;
    return (timeDelta / Math.pow(10, this.timeExpansion - 1)).toFixed(Math.max(this.timeExpansion - 3, 0));
  }

  getValue(id: string) {
    switch (id) {
      case 'VOLTAGE':
        return this.voltageOutput;
      case 'PRESSURE':
        return this.externalForces;
      case 'STRAIN':
        return this.strain;
      case 'ELONGZ':
        return CalculationHelper.getElongation (this.basicGeometry, this.modifiedGeometry, 'z');
      case 'ELONGY':
        return CalculationHelper.getElongation (this.basicGeometry, this.modifiedGeometry, 'y');
    }
  }

  setParameters (data: Map<string, any>) {
    for (const prop in data) {
      if (!isUndefined(this[prop])) {
        this[prop] = data[prop];
      }
    }

  }

  setOverrides() {
    for (const propKey in this.mode.override) {
      if (this.mode.override[propKey]) {
        this[propKey] = this.mode.override[propKey];
      }
    }
  }

}
