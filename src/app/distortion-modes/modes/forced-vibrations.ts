import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';


export class ForcedVibrations implements DistortionMode {
  static supportedClasses = [MaterialClass.Crystal, MaterialClass.Ceramic_TP];
  static api: ModeApi = {
    externalForces: ModeApiValue.IGNORE,
    voltage: ModeApiValue.INPUT,
    frequency: ModeApiValue.INPUT,
    time: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    harmonicNumber: ModeApiValue.IGNORE,
    linearExaggeration: ModeApiValue.INPUT,
    timeExpansion: ModeApiValue.INPUT,
    voltageOutput: ModeApiValue.IGNORE,
    stretch: ModeApiValue.OUTPUT_TENSOR_DYNAMIC
  };

  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = ForcedVibrations.api;

  clearCache() {}

  distortModel(model: PlateService, time: number) {
    if (!model.material) {return; }
    if (model.material.type === MaterialClass.Ceramic_TP) {
      this.distortCeramic(model, time)
    } else {
      this.distortCrystal(model, time)
    }
    model.stretch = [
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'x'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'y'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'z')
    ];
  }

  distortCrystal(model: PlateService, time: number) {
    const V = model.voltage;
    const f = model.frequency;
    const h = model.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, model.timeExpansion - 1);
    const cepsilon = model.material.c[5][5] * model.material.epsilon[1][1] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
    const ksqr = (model.material.e[1][5] * model.material.e[1][5]) / cepsilon;
    const e26eps22 = model.material.e[1][5] * model.material.e[1][5] / model.material.epsilon[1][1] * Math.pow(10, Constants.EPSILON_EXP);
    const c66 = model.material.c[5][5] * Math.pow(10, Constants.C_EXP);
    const ksi = Math.sqrt(model.material.density / (c66 * (1 + ksqr))) * f;
    const divider = c66 * (1 + ksqr) * ksi * h * Math.cos(ksi * h / 2) - e26eps22 * Math.sin(ksi * h / 2);
    const Acoeff = (-V * model.material.e[1][5]) / divider;
    const exaggeration = Math.pow(10, model.linearExaggeration);
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x * (1 + exaggeration * Acoeff * Math.sin(ksi * source.y) * Math.cos(f * time / (1000 * timeModifier)));
      target.y = source.y;
    })
  }


  distortCeramic(model: PlateService, time: number) {
    const V = model.voltage;
    const f = model.frequency;
    const h = model.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, model.timeExpansion - 1);
    const cepsilon = model.material.c[2][2] * model.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
    const ksqr = (model.material.e[2][2] * model.material.e[2][2]) / cepsilon;
    const e33eps33 = model.material.e[2][2] * model.material.e[2][2] / model.material.epsilon[2][2] * Math.pow(10, Constants.EPSILON_EXP);
    const c33 = model.material.c[2][2] * Math.pow(10, Constants.C_EXP);
    const ksi = Math.sqrt(model.material.density / (c33 * (1 + ksqr))) * f;
    const divider = c33 * (1 + ksqr) * ksi * h * Math.cos(ksi * h / 2) - e33eps33 * Math.sin(ksi * h / 2);
    const Acoeff = (-V * model.material.e[2][2]) / divider;
    const exaggeration = Math.pow(10, model.linearExaggeration);
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 + exaggeration * Acoeff * Math.sin(ksi * source.y) * Math.cos(f * time / (1000 * timeModifier)));
      ;
    })
  }

  constructor() {
    this.modeId = 'FORCED_VIBRATIONS';
    this.modeName = 'Forced vibrations';
    this.override = new ModelValueDTO();
    this.override.timeExpansion = 4;
    this.override.linearExaggeration = 6;
    this.override.voltage = 10;
    this.override.frequency = 10000;
  }
}
