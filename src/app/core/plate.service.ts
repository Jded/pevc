import { Injectable } from '@angular/core';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ModeFactoryService } from './mode-factory.service';
import { MaterialManagerService } from './material-manager.service';

import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';
import { BoxGeometry } from 'three'
import { PiezoPlateGeometry } from '../plate-renderer/rendering-extensions/plate-geometry';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { isUndefined } from 'util';
import { Quartz } from '../materials/materials/quartz.material';
import { hasOwnProperty } from 'tslint/lib/utils';
import { PlateState } from '../physics-core/plate-state';
import { CalculationHelper } from '../physics-core/calculation.helper';

@Injectable()
export class PlateService extends PlateState {

  public static initState: PlateState = {
    resolution:  [10, 50, 10],
    dimensions:  [3, 0.002, 2.4],
    boundaryConditions:  [],
  }

  public modelValues: ModelValueDTO;
  // timeExpansion: number
  // harmonicNumber:  number
  // frequency:  number
  // strain:  number[][]
  // stress:  number[][]
  initTime: number;
  // time: number;
  mode: DistortionMode;
  material: Material;
  // voltageInput: number;
  // voltageOutput: number;
  // externalForces: number;
  // linearExaggeration: number;
  // stretch: number[];
  box: BoxGeometry;
  basicGeometry: PiezoPlateGeometry;
  modifiedGeometry: PiezoPlateGeometry;

  constructor(private modeFactory: ModeFactoryService,
              private materialManager: MaterialManagerService) {
    super();
    Object.assign(this, PlateService.initState);
    this.modelValues = new ModelValueDTO();
    this.modelValues.timeExpansion = 10;
    this.modelValues.harmonicNumber = 2;
    this.modelValues.frequency = 0;

    this.modelValues.linearExaggeration = 1;

    this.modelValues.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.modelValues.stress = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.initTime = Date.now();
    this.modelValues.time = 0;
    this.mode = new PressureOpen();
    this.material = Quartz;
    this.modelValues.voltageInput = 0;
    this.modelValues.externalForces = 1;
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
    this.mode.distortModel(this, this.modelValues.time);
    this.modifiedGeometry.verticesNeedUpdate = true;
  }

  updateTime(timestamp) {
    if (this.mode.api.time === ModeApiValue.INPUT) {
      this.modelValues.time = timestamp - this.initTime;
      return true;
    }
    return false;
  }

  getScaledTime = function (time) {
    return (this.modelValues.time / Math.pow(10, this.modelValues.timeExpansion - 1));
  }

  appendToOutputSet(prop: string, apiValue: ModeApiValue, output: Map<ModeApiValue, ModelValueDTO>) {
    if (!output.has(apiValue)) {
      output.set(apiValue, new ModelValueDTO());
    }
    output.get(apiValue)[prop] = this.modelValues[prop];
  }

  getOutputValues(): Map<ModeApiValue, ModelValueDTO> {
    const output = new Map<ModeApiValue, ModelValueDTO>();
    for (const prop in this.mode.api) {
      if (hasOwnProperty(this.mode.api, prop)) {
        switch (this.mode.api[prop]) {
          case ModeApiValue.OUTPUT_SCALAR_STATIC:
            this.appendToOutputSet(prop, ModeApiValue.OUTPUT_SCALAR_STATIC, output);
            break;
          case ModeApiValue.OUTPUT_SCALAR_DYNAMIC:
            this.appendToOutputSet(prop, ModeApiValue.OUTPUT_SCALAR_DYNAMIC, output);
            break;
          case ModeApiValue.OUTPUT_TENSOR_STATIC:
            this.appendToOutputSet(prop, ModeApiValue.OUTPUT_TENSOR_STATIC, output);
            break;
          case ModeApiValue.OUTPUT_TENSOR_DYNAMIC:
            this.appendToOutputSet(prop, ModeApiValue.OUTPUT_TENSOR_DYNAMIC, output);
            break;
          default:
            break;
        }
      }
    }
    return output;
  }

  consumeState(state: PlateState) {
    Object.assign(this, state);
    this.mode.clearCache();
    this.fillGeometries();
    this.distortModel();
  }

  setInputValues (data: ModelValueDTO) {
    console.log(data)
    if (!this.mode) { return; }
    this.mode.clearCache();
    for (const prop in this.mode.api) {
      if (this.mode.api[prop] === ModeApiValue.INPUT) {
        this.modelValues[prop] = data[prop];
      }
    }
  }

  setOverrides() {
    for (const propKey in this.mode.override) {
      if (this.mode.override[propKey]) {
        this.modelValues[propKey] = this.mode.override[propKey];
      }
    }
  }

  public setMode(modeId: ModesEnum) {
    this.mode = new (this.modeFactory.getMode(modeId))();
    this.setOverrides();
    this.distortModel();
    return this.mode;
  }

  setMaterial(materialId: number) {
    this.material = this.materialManager.getMaterial(materialId);
    this.distortModel();
  }

  setModelInputs(inputValues: ModelValueDTO) {
    this.setInputValues(inputValues);
    this.distortModel();
  }

  setTime(time: number) {
    this.updateTime(time);
    this.distortModel();
    return this.modelValues.time;
  }
}
