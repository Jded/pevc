import { Injectable } from '@angular/core';
import { PlateDistortionModel } from './plate-distortion-model';

@Injectable()
export class PlateService {
  activePlate: PlateDistortionModel
  constructor() {
    this.activePlate = new PlateDistortionModel(Date.now())
  }
}
