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
import { PlateState } from './plate-state';

export class PlateDistortionModel extends PlateState {

  public static initState: PlateState = {
    timeExpansion: 10,
    linearExaggeration:  1,
    harmonic:  2,
    frequency:  0,
    strain:  [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    stress:  [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    resolution:  [10, 50, 10],
    dimensions:  [10, 1, 10],
    boundaryConditions:  [],
  }

  initTime: number;
  time: number;
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
    super();
    Object.assign(this, PlateDistortionModel.initState);
    this.initTime = initTime;
    this.time = initTime;
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

  resetTime(time) {
    this.initTime = time;
  }

  distortModel() {
    this.mode.distortModel(this, this.time);
    this.modifiedGeometry.verticesNeedUpdate = true;
  }

  updateTime(timestamp) {
    if (this.mode.api.time === ModeApiValue.INPUT) {
      this.time = timestamp - this.initTime;
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

  consumeState(state: PlateState) {
    Object.assign(this, state);
    this.fillGeometries();
  }

  setParameters (data: ModelValueOverride) {
    if (!this.mode) { return; }
    for (const prop in this.mode.api) {
      if (this.mode.api[prop] === ModeApiValue.INPUT) {
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
