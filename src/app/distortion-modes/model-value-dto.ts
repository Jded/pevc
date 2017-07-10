export class ModelValueDTO extends Object {
  externalForces?: number;
  linearExaggeration?: number;
  strain?: number[][];
  stress?: number[][];
  timeExpansion?: number;
  voltageInput?: number;
  frequency?: number;
  time?: number;
  harmonicNumber?: number;
  voltageOutput?: number;
  stretch?: number[];
  dampingMass?: number;
  mechanicalDampingCoefficient?: number;
  internalFrequency?: number;
  amplitude?: number;
  powerOutput?: number;
  maxPowerOutput?: number;
  substrateThickness?: number;
  receiverResistance?: number;
  beamDistance?: number;
  electricalDampingCoefficient?: number;
}
