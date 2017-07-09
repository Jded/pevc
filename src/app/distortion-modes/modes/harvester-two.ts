import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { CalculationHelper } from '../../physics-core/calculation.helper';
import { Silicon } from '../../materials/helper-material/silicon';

class Cache {
  mechanicalFrequency: number;
  frequency: number;
  ksi: number;
  class: MaterialClass;
}




export class HarvesterTwo implements DistortionMode {
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
    powerOutput: ModeApiValue.OUTPUT_SCALAR_DYNAMIC,
    substrateThickness: ModeApiValue.INPUT
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = HarvesterTwo.api;
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

/*
      const cepsilon = model.material.c[2][2] * model.material.epsilon[0][0] * Math.pow(10, Constants.C_EXP + Constants.EPSILON_EXP);
      const ksqr31 = (model.material.e[2][0] * model.material.e[2][0]) / cepsilon;
      const electricalDampingCoefficient = ksqr31;
      */
      // const mechanicalFrequency = Math.sqrt(model.modelValues.springStiffness / model.modelValues.dampingMass);



      const mechDamping = 1

      const electricalDamping = 1

      const mP = model.dimensions[0] * model.dimensions[1] * model.dimensions[2] * model.material.density;
      const mS = model.dimensions[0] * model.modelValues.substrateThickness * model.dimensions[2] * Silicon.density;

      const mT = mP + mS;
      const m = model.modelValues.dampingMass;

      const L = model.dimensions[0];

      const wS = model.dimensions[2];
      const wP = wS;

      const hP = model.dimensions[1];
      const hS = model.modelValues.substrateThickness;


      const Ep = model.material.youngModulus[0] /
        (1 - Math.pow(model.material.poisonRatio, 2));

      const Es = Silicon.young[0] /
        (1 - Math.pow(Silicon.poisonRatio, 2));

      const zP = 0.5 * hP;
      const zS = hP + 0.5 * hS;

      const zN = (Ep * hP * zP + Es * hS * zS) / (Ep * hP + Es * hS);

      const EI = Ep * wP * hP * ( Math.pow(zP - zN, 2) + Math.pow(hP, 2) / 12) +
        Es * wS * hS * (Math.pow(zS - zN, 2) + Math.pow(hS, 2) / 12);

      const omegaN = Math.sqrt( 3 * EI / ((m + 33 * mT / 140) * Math.pow(L , 3)))

      const frequency = omegaN / (2 * Math.PI);

      const mechanicalDampingRation = model.modelValues.mechanicalDampingCoefficient / (2 * model.modelValues.dampingMass * resonantFrequency);
      // const electricalDampingDimensionless = electricalDampingCoefficient / (2 * model.modelValues.dampingMass * mechanicalFrequency);
      const frequencyRelation = model.modelValues.frequency / mechanicalFrequency;


      const powerNominator = mass
        * mechanicalDampingRation
        * Math.pow(model.modelValues.amplitude, 2)
        * frequencyRelation
        * Math.pow(model.modelValues.frequency, 3)


      const powerMaxNominator = mass *


      const E_I =

      const systemFrequency = (1 / 2 * Math.PI) * Math.sqrt( 3 * E_I / ()} )

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
    this.modeName = `Vibration energy harvesting device, made of micro piezoelectric transducer in d31 mode on a silicate substrate.
     Only the transducer is visualized`;
    this.override = new ModelValueDTO();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]];
  }
}
