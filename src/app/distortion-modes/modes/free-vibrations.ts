import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { CalculationHelper } from '../../physics-core/calculation.helper';
import { PlateService } from '../../core/plate.service';

class Cache {
  frequency: number;
  ksi: number;
}

export class FreeVibrations implements DistortionMode {
  static supportedClasses = [MaterialClass.Crystal, MaterialClass.Ceramic_TP];
  static api: ModeApi = Object.assign( new ModeApi(), {
    frequency: ModeApiValue.OUTPUT_SCALAR_STATIC,
    time: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    harmonicNumber: ModeApiValue.INPUT,
    linearExaggeration: ModeApiValue.INPUT,
    timeExpansion: ModeApiValue.INPUT,
    voltageOutput: ModeApiValue.OUTPUT_SCALAR_DYNAMIC,
    stretch: ModeApiValue.OUTPUT_TENSOR_DYNAMIC
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = FreeVibrations.api;
  calculationCache: Cache;

  clearCache() {
    this.calculationCache = null;
  }

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

  distortCrystal(model: PlateService, time: number) {
    const initVoltage = 10;
    const timeModifier = Math.pow(10, model.modelValues.timeExpansion - 1);
    if (!this.calculationCache) {
      this.calculationCache = new Cache();
      const cepsilon = model.material.c[5][5] * model.material.epsilon[1][1] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (model.material.e[1][5] * model.material.e[1][5]) / cepsilon;
      const h = model.dimensions[1] / 1000;
      const c66 = model.material.c[5][5] * Math.pow(10, Constants.C_EXP);
      if (model.modelValues.harmonicNumber % 2) {
        const ksqr_t = ksqr / (1 + ksqr);
        const ksi = CalculationHelper.getKsi(ksqr_t, h, model.modelValues.harmonicNumber);
        this.calculationCache.ksi = ksi;
        this.calculationCache.frequency = ksi * Math.sqrt((c66 * (1 + ksqr)) / model.material.density);
      } else {
        const coeff = Math.sqrt((c66 * (1 + ksqr)) / model.material.density);
        this.calculationCache.frequency = (coeff * model.modelValues.harmonicNumber * Math.PI) / h;
        this.calculationCache.ksi = model.modelValues.harmonicNumber * Math.PI / h;
      }
    }
    model.modelValues.frequency = this.calculationCache.frequency;
    const constantAmplitude = 0.1 * model.dimensions[1] / model.dimensions[0];

    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x * (1 +
        constantAmplitude * Math.cos((target.y / 1000) * this.calculationCache.ksi)
        * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier)));
      target.y = source.y;
    })
    model.modelValues.voltageOutput = initVoltage * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier));
  }

  distortCeramic(plateModel: PlateService, time: number) {
    const initVoltage = 10;
    const h = plateModel.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, plateModel.modelValues.timeExpansion - 1);

    if (this.calculationCache === undefined) {
      this.calculationCache = new Cache();
      const cepsilon = plateModel.material.c[2][2] * plateModel.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (plateModel.material.e[2][2] * plateModel.material.e[2][2]) / cepsilon;
      const c33 = plateModel.material.c[2][2] * Math.pow(10, Constants.C_EXP);
      if (!(plateModel.modelValues.harmonicNumber % 2)) {
        const ksqr_t = ksqr / (1 + ksqr);
        const ksi = CalculationHelper.getKsi(ksqr_t, h, plateModel.modelValues.harmonicNumber);
        this.calculationCache.ksi = ksi;
        this.calculationCache.frequency = ksi * Math.sqrt(c33 * (1 + ksqr) / plateModel.material.density);
      } else {
        const coeff = Math.sqrt((c33 * (1 + ksqr)) / plateModel.material.density);
        this.calculationCache.frequency = (coeff * plateModel.modelValues.harmonicNumber * Math.PI) / h;
        this.calculationCache.ksi = plateModel.modelValues.harmonicNumber * Math.PI / h;
      }
    }

    plateModel.modelValues.frequency = this.calculationCache.frequency;
    const constantAmplitude = 0.5 * plateModel.dimensions[1] / plateModel.dimensions[0];
    plateModel.basicGeometry.vertices.forEach((source, index) => {
      const target = plateModel.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 +
        0.1 * Math.cos(source.y / 1000 * this.calculationCache.ksi) *
        Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier)));
    });
    plateModel.modelValues.voltageOutput = initVoltage * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier));

  }

  constructor() {
    this.modeId = 'FREE_VIBRATIONS';
    this.modeName = 'Free vibrations (dynamic)';
    this.override = new ModelValueDTO();
    this.override.harmonicNumber = 1;
    this.override.timeExpansion = 8;
    this.override.linearExaggeration = 1;
  }
}
