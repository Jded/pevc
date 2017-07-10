import { DistortionMode } from '../distortion-mode';
import { MaterialClass } from '../../materials/material-class.enum';
import { ModeApi } from '../mode-api';
import { ModelValueDTO } from '../model-value-dto';
import { Constants } from '../../physics-core/constants';
import { ModeApiValue } from '../mode-api-value.enum';
import { PlateService } from '../../core/plate.service';
import { Silicon } from '../../materials/helper-material/silicon';

export class HarvesterBase implements DistortionMode {
  static supportedClasses = [MaterialClass.Ceramic_TP];
  static api: ModeApi = Object.assign( new ModeApi(), {
    frequency: ModeApiValue.INPUT,
    strain: ModeApiValue.IGNORE,
    linearExaggeration: ModeApiValue.INPUT,
    stretch: ModeApiValue.IGNORE,
    dampingMass: ModeApiValue.INPUT,
    mechanicalDampingCoefficient: ModeApiValue.INPUT,
    internalFrequency: ModeApiValue.OUTPUT_SCALAR_STATIC,
    amplitude: ModeApiValue.INPUT,
    powerOutput: ModeApiValue.OUTPUT_SCALAR_STATIC,
    maxPowerOutput: ModeApiValue.OUTPUT_SCALAR_STATIC,
    substrateThickness: ModeApiValue.INPUT,
    receiverResistance: ModeApiValue.INPUT,
    beamDistance: ModeApiValue.INPUT,
    electricalDampingCoefficient: ModeApiValue.INPUT
  });
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api = HarvesterBase.api;

  clearCache() {
  }
  distortModel(model: PlateService, time: number) {
/*
    const inputFrequency = model.modelValues.frequency * 2 * Math.PI;
    const L = model.dimensions[0] / 1000;

    const totalL = model.modelValues.beamDistance / 1000;

    const wS = model.dimensions[2] / 1000;
    const wP = wS;

    const hP = model.dimensions[1] / 1000;
    const hS = model.modelValues.substrateThickness  / 1000;

    const mP = L * wP * hP * model.material.density;
    const mS = L * hS * wS * Silicon.density;
    const mT = mP + mS;
    const m = model.modelValues.dampingMass;

    const amplitude = model.modelValues.amplitude / 1000;

    const Ep = model.material.youngModulus[0] *  Math.pow(10, Constants.YOUNG_MODULUS_EXPONENT) /
      (1 - Math.pow(model.material.poisonRatio, 2));

    const Es = Silicon.young[0] * Math.pow(10, Constants.YOUNG_MODULUS_EXPONENT) /
      (1 - Math.pow(Silicon.poisonRatio, 2));

    const zP = 0.5 * hP;
    const zS = hP + 0.5 * hS;

    const zN = (Ep * hP * zP + Es * hS * zS) / (Ep * hP + Es * hS);

    const EI = Ep * wP * hP * ( Math.pow(zP - zN, 2) + Math.pow(hP, 2) / 12) +
      Es * wS * hS * (Math.pow(zS - zN, 2) + Math.pow(hS, 2) / 12);

    const resonantFrequency = Math.sqrt( 3 * EI / ((m + (33 * mT / 140)) * Math.pow(totalL , 3)))

    const outputFrequency = resonantFrequency / (2 * Math.PI);

    const electricalDampingCoeff = model.modelValues.electricalDampingCoefficient;

    const mechanicalDamping = model.modelValues.mechanicalDampingCoefficient / (2 * m * resonantFrequency);

    const electricalDamping = electricalDampingCoeff / (2 * m * resonantFrequency);

    const frequencyRelation = inputFrequency / resonantFrequency;

    const maxDisplacementNominator = frequencyRelation * amplitude;

    const powerNominator = m
      * electricalDamping
      * Math.pow(amplitude, 2)
      * frequencyRelation
      * Math.pow(inputFrequency, 3)

    const powerOrDisplacementDenominator = Math.pow(1 - Math.pow(frequencyRelation, 2), 2) +
      Math.pow(2 * (electricalDamping + mechanicalDamping) * frequencyRelation, 2)

    const powerMaxNominator = m
      * electricalDamping
      * Math.pow(amplitude, 2)
      * Math.pow(resonantFrequency, 3)

    const powerMaxDenominator = Math.pow(2 * (electricalDamping + mechanicalDamping), 2)

    const power = powerNominator / powerOrDisplacementDenominator;
    const maxPower = powerMaxNominator / powerMaxDenominator;
    const maxDisplacement = maxDisplacementNominator / powerOrDisplacementDenominator;

    model.modelValues.internalFrequency = outputFrequency;
    model.basicGeometry.vertices.forEach((source, index) => {
      const target = model.modifiedGeometry.vertices[index];
      target.z = source.z;
      target.x = source.x;
      target.y = source.y * (1 +
        maxDisplacement);
    });
    model.modelValues.powerOutput = power;
    model.modelValues.maxPowerOutput = maxPower;
    model.modelValues.voltageOutput = Math.sqrt(model.modelValues.powerOutput / Math.pow (model.modelValues.receiverResistance, 2))*/
  }

  constructor() {
    this.modeId = 'Energy harvester';
    this.modeName = `Vibration energy harvesting device, made of micro piezoelectric transducer in d31 mode on a silicate substrate.
     Only the transducer is visualized`;
    this.override = new ModelValueDTO();
    /*this.override.linearExaggeration = 9;
    this.override.receiverResistance = 10;
    this.override.substrateThickness = 0.05;
    this.override.dampingMass = 0.02;
    this.override.mechanicalDampingCoefficient = 0.5;
    this.override.amplitude = 1;
    this.override.frequency = 500;
    this.override.beamDistance = 11;
    this.override.electricalDampingCoefficient = 0.5;*/
  }
}
