import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueOverride } from '../model-value-override';
import { PlateDistortionModel } from '../../core/plate-distortion-model';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';

export class PressureOpen implements DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueOverride;
  api: ModeApi;
  supportedClasses: MaterialClass[];

  distortModel(model: PlateDistortionModel, time: number) {
    if (model.material.type === MaterialClass.Ceramic_TP) {

      const cepsilon = model.material.c[2][2] * model.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (model.material.e[2][2] * model.material.e[2][2]) / cepsilon;
      const thickness = model.dimensions[1] / 1000;
      const c33 = model.material.c[2][2] * Math.pow(10, Constants.C_EXP);

      model.voltageOutput = (thickness * model.externalForces * model.material.e[2][2]) / (cepsilon * (1 + ksqr));
      model.strain[2][2] = -model.externalForces / (c33 * (1 + ksqr));
      model.stress[0][0] = model.stress[1][1] = model.strain[2][2] * model.material.c[0][2] * Math.pow(10, Constants.C_EXP);
      const exaggeration = Math.pow(10, model.linearExaggeration);
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
  }

  constructor() {
    this.modeId = 'PRESSURE_OPEN';
    this.modeName = 'Pressure on plate, open electrodes';
    this.supportedClasses = [MaterialClass.Ceramic_TP];
    this.override = new ModelValueOverride();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];

    this.api = new ModeApi();
    this.api.pressure = ModeApiValue.INPUT;
    this.api.voltage = ModeApiValue.OUTPUT;
    this.api.frequency = ModeApiValue.IGNORE;
    this.api.time = ModeApiValue.IGNORE;
    this.api.strain = ModeApiValue.OUTPUT;
    this.api.harmonicNumber = ModeApiValue.IGNORE;
    this.api.stretch = ModeApiValue.INPUT;

  }
}
