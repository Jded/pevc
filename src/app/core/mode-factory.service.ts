import { Injectable } from '@angular/core';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ForcedVibrations } from '../distortion-modes/modes/forced-vibrations';
import { FreeVibrations } from '../distortion-modes/modes/free-vibrations';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';
import { PressureShorted } from '../distortion-modes/modes/pressure-shorted';
import { VoltageShear } from '../distortion-modes/modes/voltage-shear';
import { HarvesterE31 } from '../distortion-modes/modes/harvester-e31';
import { HarvesterBase } from '../distortion-modes/modes/harvester-base';
import { HarvesterE33 } from '../distortion-modes/modes/harvester-e33';
// import { VoltageShear } from './modes/voltageInput-shear';

@Injectable()
export class ModeFactoryService {

  modeOptions: object[] = [
    {name: 'Forced Vibrations', id: ModesEnum.ForcedVibrations},
    {name: 'Free Vibrations', id: ModesEnum.FreeVibrations},
    {name: 'Pressure Open', id: ModesEnum.PressureOpen},
    {name: 'Pressure Shorted', id: ModesEnum.PressureShorted},
    {name: 'VoltageShear', id: ModesEnum.VoltageShear},
    {name: 'Harvester Base', id: ModesEnum.HarvesterBase},
    {name: 'Harvester E31', id: ModesEnum.HarvesterE31},
    {name: 'Harvester E33', id: ModesEnum.HarvesterE33}
  ]

  defaultMode = ModesEnum.FreeVibrations;

  constructor() { }

  getMode(id: ModesEnum) {
    switch (id) {
      case ModesEnum.ForcedVibrations:
        return ForcedVibrations;
      case ModesEnum.FreeVibrations:
        return FreeVibrations;
      case ModesEnum.PressureOpen:
        return PressureOpen;
      case ModesEnum.PressureShorted:
        return PressureShorted;
      case ModesEnum.VoltageShear:
        return VoltageShear;
      case ModesEnum.HarvesterE31:
        return HarvesterE31;
      case ModesEnum.HarvesterE33:
        return HarvesterE33;
      case ModesEnum.HarvesterBase:
        return HarvesterBase;
    }
  }
}
