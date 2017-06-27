import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueOverride } from '../model-value-override';
import { PlateDistortionModel } from '../../physics-core/plate-distortion-model';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';

class Cache {
  frequency: number;
  ksi: number;
  class: MaterialClass;
}

export class ForcedVibrations implements DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueOverride;
  api: ModeApi;
  supportedClasses: MaterialClass[];
  calculationCache: Cache;

  distortModel(model: PlateDistortionModel, time: number) {
    if (model.material.type === MaterialClass.Crystal) {
      const thickness = model.dimensions[1] / 1000;
      model.strain[1][0] = -(model.material.e[1][5] * model.voltage) / (model.material.c[5][5] * Math.pow(10, Constants.C_EXP) * thickness);
      const exaggeration = Math.pow(10, model.linearExaggeration);
      model.basicGeometry.vertices.forEach((source, index) => {
        const target = model.modifiedGeometry.vertices[index];
        target.z = source.z;
        target.x = source.x + source.y * model.strain[1][0] * exaggeration;
        target.y = source.y;
      })
    }
  }

  constructor() {
    this.modeId = 'VOLTAGE_SHEAR';
    this.modeName = 'Shear deformation from applied Voltage';
    this.supportedClasses = [MaterialClass.Crystal];
    this.override = new ModelValueOverride();
    this.override.linearExaggeration = 6;
    this.override.voltage = 100;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];

    this.api = new ModeApi();
    this.api.pressure = ModeApiValue.IGNORE;
    this.api.voltage = ModeApiValue.INPUT;
    this.api.frequency = ModeApiValue.IGNORE;
    this.api.time = ModeApiValue.IGNORE;
    this.api.strain = ModeApiValue.OUTPUT;
    this.api.harmonicNumber = ModeApiValue.IGNORE;
    this.api.stretch = ModeApiValue.INPUT;
  }
}
