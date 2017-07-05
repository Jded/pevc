import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueOverride } from '../model-value-override';
import { PlateDistortionModel } from '../../physics-core/plate-distortion-model';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { CalculationHelper } from '../../physics-core/calculation.helper';

class Cache {
  frequency: number;
  ksi: number;
  class: MaterialClass;
}

export class FreeVibrations implements DistortionMode {
  static supportedClasses = [MaterialClass.Crystal, MaterialClass.Ceramic_TP];
  static api: ModeApi = {
    externalForces: ModeApiValue.IGNORE,
    voltage: ModeApiValue.OUTPUT,
    frequency: ModeApiValue.OUTPUT,
    time: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT,
    harmonicNumber: ModeApiValue.INPUT,
    stretch: ModeApiValue.IGNORE,
    linearExaggeration: ModeApiValue.INPUT,
    timeExpansion: ModeApiValue.INPUT
  };
  modeId: string;
  modeName: string;
  override: ModelValueOverride;
  api = FreeVibrations.api;
  calculationCache: Cache;

  clearCache() {
    this.calculationCache = null;
  }

  distortModel(model: PlateDistortionModel, time: number) {
    if (!model.material) {return;}
    if (model.material.type === MaterialClass.Ceramic_TP) {
      this.distortCeramic(model, time)
    } else {
      this.distortCrystal(model, time)
    }
  }

  distortCrystal(model: PlateDistortionModel, time: number) {
    const initVoltage = 10;
    const timeModifier = Math.pow(10, model.timeExpansion - 1);
    console.log('timemmod', model.timeExpansion)
    if (!this.calculationCache) {
      this.calculationCache = new Cache();
      const cepsilon = model.material.c[5][5] * model.material.epsilon[1][1] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (model.material.e[1][5] * model.material.e[1][5]) / cepsilon;
      const h = model.dimensions[1] / 1000;
      const c66 = model.material.c[5][5] * Math.pow(10, Constants.C_EXP);
      if (model.harmonicNumber % 2) {
        const ksqr_t = ksqr / (1 + ksqr);
        const ksi = CalculationHelper.getKsi(ksqr_t, h, model.harmonicNumber);
        this.calculationCache.ksi = ksi;
        this.calculationCache.frequency = ksi * Math.sqrt((c66 * (1 + ksqr)) / model.material.density);
      } else {
        const coeff = Math.sqrt((c66 * (1 + ksqr)) / model.material.density);
        this.calculationCache.frequency = (coeff * model.harmonicNumber * Math.PI) / h;
        this.calculationCache.ksi = model.harmonicNumber * Math.PI / h;
      }
    }
    model.frequency = this.calculationCache.frequency;
    const constantAmplitude = 0.1 * model.dimensions[1] / model.dimensions[0];

    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x * (1 +
        constantAmplitude * Math.cos((target.y / 1000) * this.calculationCache.ksi)
        * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier)));
      target.y = source.y;
    })
    model.voltageOutput = initVoltage * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier));
  }

  distortCeramic(model: PlateDistortionModel, time: number) {
    const initVoltage = 10;
    const h = model.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, model.timeExpansion - 1);

    if (this.calculationCache === undefined) {
      this.calculationCache = new Cache();
      const cepsilon = model.material.c[2][2] * model.material.epsilon[2][2] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr = (model.material.e[2][2] * model.material.e[2][2]) / cepsilon;
      const c33 = model.material.c[2][2] * Math.pow(10, Constants.C_EXP);
      if (!(model.harmonicNumber % 2)) {
        const ksqr_t = ksqr / (1 + ksqr);
        const ksi = CalculationHelper.getKsi(ksqr_t, h, model.harmonicNumber);
        this.calculationCache.ksi = ksi;
        this.calculationCache.frequency = ksi * Math.sqrt(c33 * (1 + ksqr) / model.material.density);
      } else {
        const coeff = Math.sqrt((c33 * (1 + ksqr)) / model.material.density);
        this.calculationCache.frequency = (coeff * model.harmonicNumber * Math.PI) / h;
        this.calculationCache.ksi = model.harmonicNumber * Math.PI / h;
      }
    }

    model.frequency = this.calculationCache.frequency;
    const constantAmplitude = 0.5 * model.dimensions[1] / model.dimensions[0];
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 +
        0.1 * Math.cos(source.y / 1000 * this.calculationCache.ksi) *
        Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier)));
    });
    model.voltageOutput = initVoltage * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier));

  }

  constructor() {
    this.modeId = 'FREE_VIBRATIONS';
    this.modeName = 'Free vibrations (dynamic)';
    this.override = new ModelValueOverride();
    this.override.timeExpansion = 8;
    this.override.linearExaggeration = 1;
  }
}
