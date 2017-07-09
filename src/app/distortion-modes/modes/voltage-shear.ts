import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';

export class VoltageShear implements DistortionMode {
  static supportedClasses = [MaterialClass.Crystal];
  static api: ModeApi = Object.assign( new ModeApi(), {
    voltage: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    linearExaggeration: ModeApiValue.INPUT,
    voltageOutput: ModeApiValue.OUTPUT_SCALAR_STATIC,
    stretch: ModeApiValue.OUTPUT_TENSOR_STATIC
  });

  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = VoltageShear.api;

  clearCache() {}

  distortModel(model: PlateService, time: number) {
    if (!model.material) {return; }
    if (model.material.type === MaterialClass.Crystal) {
      const thickness = model.dimensions[1] / 1000;
      model.modelValues.strain[1][0] = -(model.material.e[1][5] * model.modelValues.voltageInput) / (model.material.c[5][5] * Math.pow(10, Constants.C_EXP) * thickness);
      const exaggeration = Math.pow(10, model.modelValues.linearExaggeration);
      model.basicGeometry.vertices.forEach((source, index) => {
        const target = model.modifiedGeometry.vertices[index];
        target.z = source.z;
        target.x = source.x + source.y * model.modelValues.strain[1][0] * exaggeration;
        target.y = source.y;
      })
    }
    model.modelValues.stretch = [
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'x'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'y'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'z')
    ];
  }

  constructor() {
    this.modeId = 'VOLTAGE_SHEAR';
    this.modeName = 'Shear deformation from applied Voltage';
    this.override = new ModelValueDTO();
    this.override.linearExaggeration = 6;
    this.override.voltageInput = 100;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];
  }
}
