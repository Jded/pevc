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
  static api: ModeApi = Object.assign( new ModeApi(), {
    voltage: ModeApiValue.INPUT,
    frequency: ModeApiValue.INPUT,
    time: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    linearExaggeration: ModeApiValue.INPUT,
    timeExpansion: ModeApiValue.INPUT,
    stretch: ModeApiValue.OUTPUT_TENSOR_DYNAMIC
  });

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
    model.modelValues.stretch = [
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'x'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'y'),
      CalculationHelper.getElongation (model.basicGeometry, model.modifiedGeometry, 'z')
    ];
  }

  distortCrystal(plateModel: PlateService, time: number) {
    const V = plateModel.modelValues.voltageInput;
    const f = plateModel.modelValues.frequency;
    const h = plateModel.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, plateModel.modelValues.timeExpansion - 1);
    const cepsilon = plateModel.material.c[5][5] * plateModel.material.epsilon[1][1] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
    const ksqr = (plateModel.material.e[1][5] * plateModel.material.e[1][5]) / cepsilon;
    const e26eps22 = plateModel.material.e[1][5] * plateModel.material.e[1][5] / plateModel.material.epsilon[1][1] * Math.pow(10, Constants.EPSILON_EXP);
    const c66 = plateModel.material.c[5][5] * Math.pow(10, Constants.C_EXP);
    const ksi = Math.sqrt(plateModel.material.density / (c66 * (1 + ksqr))) * f;
    const divider = c66 * (1 + ksqr) * ksi * h * Math.cos(ksi * h / 2) - e26eps22 * Math.sin(ksi * h / 2);
    const Acoeff = (-V * plateModel.material.e[1][5]) / divider;
    const exaggeration = Math.pow(10, plateModel.modelValues.linearExaggeration);
    plateModel.basicGeometry.vertices.forEach((source, index) => {
      const target = plateModel.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x * (1 + exaggeration * Acoeff * Math.sin(ksi * source.y) * Math.cos(f * time / (1000 * timeModifier)));
      target.y = source.y;
    })
  }


  distortCeramic(plateModel: PlateService, time: number) {
    const V = plateModel.modelValues.voltageInput;
    const f = plateModel.modelValues.frequency;
    const h = plateModel.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, plateModel.modelValues.timeExpansion - 1);
    const cepsilon = plateModel.material.c[2][2] * plateModel.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
    const ksqr = (plateModel.material.e[2][2] * plateModel.material.e[2][2]) / cepsilon;
    const e33eps33 = plateModel.material.e[2][2] * plateModel.material.e[2][2] / plateModel.material.epsilon[2][2] * Math.pow(10, Constants.EPSILON_EXP);
    const c33 = plateModel.material.c[2][2] * Math.pow(10, Constants.C_EXP);
    const ksi = Math.sqrt(plateModel.material.density / (c33 * (1 + ksqr))) * f;
    const divider = c33 * (1 + ksqr) * ksi * h * Math.cos(ksi * h / 2) - e33eps33 * Math.sin(ksi * h / 2);
    const Acoeff = (-V * plateModel.material.e[2][2]) / divider;
    const exaggeration = Math.pow(10, plateModel.modelValues.linearExaggeration);
    plateModel.basicGeometry.vertices.forEach((source, index) => {
      const target = plateModel.modifiedGeometry.vertices[index];
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
    this.override.voltageInput = 10;
    this.override.frequency = 10000;
  }
}
