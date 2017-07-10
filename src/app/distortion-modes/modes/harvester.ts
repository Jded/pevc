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
  internalFrequency: number;
  power: number;
  maxPower: number;
  displacement: number;
}

export class Harvester implements DistortionMode {
  static supportedClasses = [MaterialClass.Ceramic_TP];
  static api: ModeApi = Object.assign( new ModeApi(), {
    externalForces: ModeApiValue.INPUT,
    frequency: ModeApiValue.INPUT,
    strain: ModeApiValue.IGNORE,
    linearExaggeration: ModeApiValue.INPUT,
    stretch: ModeApiValue.IGNORE,
    dampingMass: ModeApiValue.INPUT,
    mechanicalDampingCoefficient: ModeApiValue.INPUT,
    internalFrequency: ModeApiValue.OUTPUT_SCALAR_STATIC,
    amplitude: ModeApiValue.INPUT,
    powerOutput: ModeApiValue.OUTPUT_SCALAR_STATIC,
    powerOutputMax: ModeApiValue.OUTPUT_SCALAR_STATIC,
    substrateThickness: ModeApiValue.INPUT,
    receiverResistance: ModeApiValue.INPUT
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = Harvester.api;
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

      const mP = model.dimensions[0] * model.dimensions[1] * model.dimensions[2] * model.material.density;
      const mS = model.dimensions[0] * model.modelValues.substrateThickness * model.dimensions[2] * Silicon.density;

      const mT = mP + mS;
      const m = model.modelValues.dampingMass;

      const L = model.dimensions[0];

      const wS = model.dimensions[2];
      const wP = wS;

      const hP = model.dimensions[1];
      const hS = model.modelValues.substrateThickness;

      const capacitance = ( L * wS / hP ) * ( model.material.epsilon[2][2] -
        (Math.pow(model.material.e[2][0], 2) / model.material.c[0][0]) )

      const Ep = model.material.youngModulus[0] /
        (1 - Math.pow(model.material.poisonRatio, 2));

      const Es = Silicon.young[0] /
        (1 - Math.pow(Silicon.poisonRatio, 2));

      const zP = 0.5 * hP;
      const zS = hP + 0.5 * hS;

      const zN = (Ep * hP * zP + Es * hS * zS) / (Ep * hP + Es * hS);

      const EI = Ep * wP * hP * ( Math.pow(zP - zN, 2) + Math.pow(hP, 2) / 12) +
        Es * wS * hS * (Math.pow(zS - zN, 2) + Math.pow(hS, 2) / 12);

      const resonantFrequency = Math.sqrt( 3 * EI / ((m + 33 * mT / 140) * Math.pow(L , 3)))

      const outputFrequency = resonantFrequency / (2 * Math.PI);

      const electricalDampingCoeff = ksqr31 / (capacitance * resonantFrequency)

      const mechanicalDamping = model.modelValues.mechanicalDampingCoefficient / (2 * m * resonantFrequency);

      const electricalDamping = electricalDampingCoeff / (2 * m * resonantFrequency);

      const frequencyRelation = model.modelValues.frequency / resonantFrequency;

      const maxDisplacementNominator = frequencyRelation * model.modelValues.amplitude;

      const powerNominator = m
        * electricalDamping
        * Math.pow(model.modelValues.amplitude, 2)
        * frequencyRelation
        * Math.pow(model.modelValues.frequency, 3)

      const powerOrDisplacementDenominator = Math.pow(1 - Math.pow(frequencyRelation, 2), 2) +
        Math.pow(2 * (electricalDamping + mechanicalDamping) * frequencyRelation, 2)

      const powerMaxNominator = m
        * electricalDamping
        * Math.pow(model.modelValues.amplitude, 2)
        * frequencyRelation
        * Math.pow(model.modelValues.frequency, 3)

      const powerMaxDenominator = 4 *
        Math.pow(2 * (electricalDamping + mechanicalDamping), 2)

      const power = powerNominator / powerOrDisplacementDenominator;
      const maxPower = powerMaxNominator / powerMaxDenominator;
      const maxDisplacement = maxDisplacementNominator / powerOrDisplacementDenominator;

      this.calculationCache.internalFrequency = outputFrequency;
      this.calculationCache.power = power;
      this.calculationCache.maxPower = maxPower;
      this.calculationCache.displacement = maxDisplacement;
    }

    model.modelValues.internalFrequency = this.calculationCache.internalFrequency;
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 +
        this.calculationCache.displacement *
        Math.cos(model.modelValues.frequency * time / (1000 * timeModifier)));
    });
    model.modelValues.powerOutput = this.calculationCache.power;
    model.modelValues.maxPowerOutput = this.calculationCache.maxPower;
    model.modelValues.voltageOutput = Math.sqrt(model.modelValues.powerOutput / Math.pow (model.modelValues.receiverResistance, 2))  }

  constructor() {
    this.modeId = 'Energy harvester';
    this.modeName = `Vibration energy harvesting device, made of micro piezoelectric transducer in d31 mode on a silicate substrate.
     Only the transducer is visualized`;
    this.override = new ModelValueDTO();
    this.override.externalForces = 100;
    this.override.linearExaggeration = 9;
    this.override.receiverResistance = 10;
    this.override.substrateThickness = 0.05;
    this.override.dampingMass = 3;
    this.override.mechanicalDampingCoefficient = 0.5;
    this.override.amplitude = 1;
  }
}
