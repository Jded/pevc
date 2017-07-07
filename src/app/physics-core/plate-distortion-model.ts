import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';
import { BoxGeometry } from 'three'
import { PiezoPlateGeometry } from '../plate-renderer/rendering-extensions/plate-geometry';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { Constants } from './constants';
import { CalculationHelper } from './calculation.helper';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { isUndefined } from 'util';
import { PlateState } from './plate-state';
import { Quartz } from '../materials/materials/quartz.material';
import { hasOwnProperty } from 'tslint/lib/utils';

export class PlateDistortionModel extends PlateState {

  public static initState: PlateState = {
    resolution:  [10, 50, 10],
    dimensions:  [10, 1, 10],
    boundaryConditions:  [],
  }

  timeExpansion: number
  harmonicNumber:  number
  frequency:  number
  strain:  number[][]
  stress:  number[][]
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
    this.timeExpansion = 10;
    this.linearExaggeration = 1;
    this.harmonicNumber = 2;
    this.frequency = 0;
    this.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.stress = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.initTime = initTime;
    this.time = 0;
    this.boundaryConditions = [];
    this.mode = new PressureOpen();
    this.material = Quartz;
    this.voltage = 0;
    this.externalForces = 1;
    this.setOverrides();
    this.fillGeometries();
  }

  fillGeometries() {
    this.basicGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
    this.box = new BoxGeometry(this.dimensions[0], this.dimensions[1], this.dimensions[2])
    this.modifiedGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
  }

  resetTime(time) {
    this.initTime = time;
  }

  distortModel() {
    this.mode.distortModel(this, this.time);
    console.log(this.modifiedGeometry)
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
      case 'stretch':
        return [CalculationHelper.getElongation (this.basicGeometry, this.modifiedGeometry, 'x'),
          CalculationHelper.getElongation (this.basicGeometry, this.modifiedGeometry, 'y'),
          CalculationHelper.getElongation (this.basicGeometry, this.modifiedGeometry, 'z')];
      default:
        return null;
    }
  }

  getOutputValues(): ModelValueDTO {
    const output = new ModelValueDTO();
    for (const prop in this.mode.api) {
      if (hasOwnProperty(this.mode.api, prop)) {
        if (this.mode.api[prop] === ModeApiValue.OUTPUT) {
          output[prop] = this[prop];
        }
        if (this.mode.api[prop] === ModeApiValue.CALCULATED_OUTPUT) {
          output[prop] = this.getValue(prop);
        }
      }
    }
    return output;
  }

  consumeState(state: PlateState) {
    Object.assign(this, state);
    this.mode.clearCache();
    this.fillGeometries();
  }

  setInputValues (data: ModelValueDTO) {
    if (!this.mode) { return; }
    this.mode.clearCache();
    for (const prop in this.mode.api) {
      if (this.mode.api[prop] === ModeApiValue.INPUT) {
        this[prop] = data[prop];
      }
    }
  }

  setOverrides() {
    console.log('override')
    for (const propKey in this.mode.override) {
      if (this.mode.override[propKey]) {
        this[propKey] = this.mode.override[propKey];
      }
    }
  }

}
