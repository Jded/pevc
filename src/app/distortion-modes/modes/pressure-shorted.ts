import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';

export class PressureShorted implements DistortionMode {
  static supportedClasses = [MaterialClass.Ceramic_TP];
  static api: ModeApi = {
    externalForces: ModeApiValue.INPUT,
    voltage: ModeApiValue.IGNORE,
    frequency: ModeApiValue.IGNORE,
    time: ModeApiValue.IGNORE,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    harmonicNumber: ModeApiValue.IGNORE,
    linearExaggeration: ModeApiValue.INPUT,
    timeExpansion: ModeApiValue.IGNORE,
    voltageOutput: ModeApiValue.IGNORE,
    stretch: ModeApiValue.OUTPUT_TENSOR_STATIC
  };
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = PressureShorted.api;

  clearCache() {}

  distortModel(model: PlateService, time: number) {
    if (!model.material) { return; }
    if (model.material.type === MaterialClass.Ceramic_TP) {
      model.voltage = 0;
      model.strain[2][2] = -model.externalForces / (model.material.c[2][2] * Math.pow(10, Constants.C_EXP));
      model.stress[0][0] = model.stress[1][1] = model.strain[2][2] * model.material.c[0][2] * Math.pow(10, Constants.C_EXP);
      const exaggeration = Math.pow(10, model.linearExaggeration)
      let correction = (1 + model.strain[2][2] * exaggeration);
      if (correction < 0) {
        correction = 0;
      }
      model.basicGeometry.vertices.forEach((source, index) => {
        const target = model.modifiedGeometry.vertices[index];
        target.z = source.z;
        target.x = source.x;
        target.y = source.y * correction;
      })
    }
    model.stretch = [
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'x'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'y'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'z')
    ];
  }

  constructor() {
    this.modeId = 'PRESSURE_SHORTED';
    this.modeName = 'Pressure on plate, shorted electrodes';
    this.override = new ModelValueDTO();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];
  }
}
