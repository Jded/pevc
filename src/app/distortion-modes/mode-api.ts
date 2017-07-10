import { ModeApiValue } from './mode-api-value.enum';

export class ModeApi {
  externalForces: ModeApiValue = ModeApiValue.IGNORE;
  linearExaggeration: ModeApiValue = ModeApiValue.IGNORE;
  strain: ModeApiValue = ModeApiValue.IGNORE;
  timeExpansion: ModeApiValue = ModeApiValue.IGNORE;
  voltageInput: ModeApiValue = ModeApiValue.IGNORE;
  frequency: ModeApiValue = ModeApiValue.IGNORE;
  time: ModeApiValue = ModeApiValue.IGNORE;
  harmonicNumber: ModeApiValue = ModeApiValue.IGNORE;
  voltageOutput: ModeApiValue = ModeApiValue.IGNORE;
  stretch: ModeApiValue = ModeApiValue.IGNORE;
  dampingMass: ModeApiValue = ModeApiValue.IGNORE;
  mechanicalDampingCoefficient: ModeApiValue = ModeApiValue.IGNORE;
  internalFrequency: ModeApiValue = ModeApiValue.IGNORE;
  amplitude: ModeApiValue = ModeApiValue.IGNORE;
  powerOutput: ModeApiValue = ModeApiValue.IGNORE;
  maxPowerOutput: ModeApiValue = ModeApiValue.IGNORE;
  substrateThickness: ModeApiValue = ModeApiValue.IGNORE;
  receiverResistance: ModeApiValue = ModeApiValue.IGNORE;
  beamDistance: ModeApiValue = ModeApiValue.IGNORE;
  electricalDampingCoefficient: ModeApiValue = ModeApiValue.IGNORE;
}
