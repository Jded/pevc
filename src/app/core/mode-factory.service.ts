import { Injectable } from '@angular/core';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ForcedVibrations } from '../distortion-modes/modes/forced-vibrations';
import { FreeVibrations } from '../distortion-modes/modes/free-vibrations';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';
import { PressureShorted } from '../distortion-modes/modes/pressure-shorted';
// import { VoltageShear } from './modes/voltage-shear';

@Injectable()
export class ModeFactoryService {

  modeOptions: object[] = [
    {name: 'Forced Vibrations', id: ModesEnum.ForcedVibrations},
    {name: 'Free Vibrations', id: ModesEnum.FreeVibrations},
    {name: 'Pressure Open', id: ModesEnum.PressureOpen},
    {name: 'Pressure Shorted', id: ModesEnum.PressureShorted},
    {name: 'VoltageShear', id: ModesEnum.VoltageShear}
  ]

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
     /* case ModesEnum.VoltageShear:
        return VoltageShear;*/
    }
  }
}
