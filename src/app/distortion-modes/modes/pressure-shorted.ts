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
  static api: ModeApi = Object.assign( new ModeApi(), {
    externalForces: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    linearExaggeration: ModeApiValue.INPUT,
    stretch: ModeApiValue.OUTPUT_TENSOR_STATIC
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = PressureShorted.api;

  clearCache() {}

  distortModel(plateModel: PlateService, time: number) {
    if (!plateModel.material) { return; }
    if (plateModel.material.type === MaterialClass.Ceramic_TP) {
      plateModel.modelValues.voltageInput = 0;
      plateModel.modelValues.strain[2][2] = - plateModel.modelValues.externalForces / (plateModel.material.c[2][2] * Math.pow(10, Constants.C_EXP));
      plateModel.modelValues.stress[0][0] = plateModel.modelValues.stress[1][1] =
        plateModel.modelValues.strain[2][2] * plateModel.material.c[0][2] * Math.pow(10, Constants.C_EXP);
      const exaggeration = Math.pow(10, plateModel.modelValues.linearExaggeration)
      let correction = (1 + plateModel.modelValues.strain[2][2] * exaggeration);
      if (correction < 0) {
        correction = 0;
      }
      plateModel.basicGeometry.vertices.forEach((source, index) => {
        const target = plateModel.modifiedGeometry.vertices[index];
        target.z = source.z;
        target.x = source.x;
        target.y = source.y * correction;
      })
    }
    plateModel.modelValues.stretch = [
      CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'x'),
      CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'y'),
      CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'z')
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
