import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';

export class PressureOpen implements DistortionMode {
  static supportedClasses = [MaterialClass.Ceramic_TP];
  static api: ModeApi = Object.assign( new ModeApi(), {
    externalForces: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    linearExaggeration: ModeApiValue.INPUT,
    voltageOutput: ModeApiValue.OUTPUT_SCALAR_STATIC,
    stretch: ModeApiValue.OUTPUT_TENSOR_STATIC
  });

  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = PressureOpen.api;

  clearCache() {}

  distortModel(plateModel: PlateService, time: number) {
    if (!plateModel.material) { return; }
    if (plateModel.material.type === MaterialClass.Ceramic_TP) {

      const cepsilon = plateModel.material.c[2][2] * plateModel.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (plateModel.material.e[2][2] * plateModel.material.e[2][2]) / cepsilon;
      const thickness = plateModel.dimensions[1] / 1000;
      const c33 = plateModel.material.c[2][2] * Math.pow(10, Constants.C_EXP);

      plateModel.modelValues.voltageOutput = (thickness * plateModel.modelValues.externalForces * plateModel.material.e[2][2]) / (cepsilon * (1 + ksqr));
      plateModel.modelValues.strain[2][2] = - plateModel.modelValues.externalForces / (c33 * (1 + ksqr));
      plateModel.modelValues.stress[0][0] = plateModel.modelValues.stress[1][1] =
        plateModel.modelValues.strain[2][2] * plateModel.material.c[0][2] * Math.pow(10, Constants.C_EXP);
      const exaggeration = Math.pow(10, plateModel.modelValues.linearExaggeration);
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

      plateModel.modelValues.stretch = [
        CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'x'),
        CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'y'),
        CalculationHelper.getElongation (plateModel.basicGeometry, plateModel.modifiedGeometry, 'z')
      ];
    }
  }

  constructor() {
    this.modeId = 'PRESSURE_OPEN';
    this.modeName = 'Pressure on plate, open electrodes';
    this.override = new ModelValueDTO();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];
  }
}
