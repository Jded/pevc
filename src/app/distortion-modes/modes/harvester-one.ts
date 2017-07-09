import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';

class Cache {
  mechanicalFrequency: number;
  frequency: number;
  ksi: number;
  class: MaterialClass;
}

export class HarvesterOne implements DistortionMode {
  static supportedClasses = [MaterialClass.Ceramic_TP];
  static api: ModeApi = Object.assign( new ModeApi(), {
    externalForces: ModeApiValue.INPUT,
    frequency: ModeApiValue.INPUT,
    strain: ModeApiValue.OUTPUT_TENSOR_STATIC,
    linearExaggeration: ModeApiValue.INPUT,
    stretch: ModeApiValue.OUTPUT_TENSOR_STATIC,
    springStiffness: ModeApiValue.INPUT,
    dampingMass: ModeApiValue.INPUT,
    mechanicalDampingCoefficient: ModeApiValue.INPUT,
    internalFrequency: ModeApiValue.OUTPUT_SCALAR_STATIC,
    amplitude: ModeApiValue.INPUT,
    powerOutput: ModeApiValue.OUTPUT_SCALAR_DYNAMIC
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = HarvesterOne.api;
  calculationCache: Cache;

  clearCache() {
    this.calculationCache = null;
  }
  distortModel(model: PlateService, time: number) {

    const initVoltage = 10;
    const h = model.dimensions[1] / 1000;
    const timeModifier = Math.pow(10, model.modelValues.timeExpansion - 1);

    if (this.calculationCache === undefined) {
      this.calculationCache = new Cache();


      const cepsilon = model.material.c[2][2] * model.material.epsilon[0][0] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr31 = (model.material.e[2][0] * model.material.e[2][0]) / cepsilon;
      const electricalDampingCoefficient = ksqr31;
      const mechanicalFrequency = Math.sqrt(model.modelValues.springStiffness / model.modelValues.dampingMass);
      const mechanicalDampingDimensionless = model.modelValues.mechanicalDampingCoefficient / (2 * model.modelValues.dampingMass * mechanicalFrequency);
      const electricalDampingDimensionless = electricalDampingCoefficient / (2 * model.modelValues.dampingMass * mechanicalFrequency);
      const frequencyRelation = model.modelValues.frequency / mechanicalFrequency;
      const powerNominator =

      const powerDenominator = (1 - frequencyRelation * frequencyRelation) * (1 - frequencyRelation * frequencyRelation) +
        (2 * )

a
      const c33 = model.material.c[2][2] * Math.pow(10, Constants.C_EXP);
      if (!(model.modelValues.harmonicNumber % 2)) {
        const ksqr_t = ksqr / (1 + ksqr);
        const ksi = CalculationHelper.getKsi(ksqr_t, h, model.modelValues.harmonicNumber);
        this.calculationCache.ksi = ksi;
        this.calculationCache.frequency = ksi * Math.sqrt(c33 * (1 + ksqr) / model.material.density);
      } else {
        const coeff = Math.sqrt((c33 * (1 + ksqr)) / model.material.density);
        this.calculationCache.frequency = (coeff * model.modelValues.harmonicNumber * Math.PI) / h;
        this.calculationCache.ksi = model.modelValues.harmonicNumber * Math.PI / h;
      }
    }

    model.modelValues.frequency = this.calculationCache.frequency;
    const constantAmplitude = 0.5 * model.dimensions[1] / model.dimensions[0];
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 +
        0.1 * Math.cos(source.y / 1000 * this.calculationCache.ksi) *
        Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier)));
    });
    model.modelValues.voltageOutput = initVoltage * Math.cos(this.calculationCache.frequency * time / (1000 * timeModifier));
  }

  constructor() {
    this.modeId = 'Energy harvester 1';
    this.modeName = `Vibration energy harvesting device, made of piezoelectric transducer,
     damping mass and spring. Only the transducer is visualized`;
    this.override = new ModelValueDTO();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];
  }
}
