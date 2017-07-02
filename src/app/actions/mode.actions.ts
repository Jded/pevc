import { Action } from '@ngrx/store';
import { Material } from '../materials/material';
import { DistortionMode } from '../distortion-modes/distortion-mode';

export const ModeActionTypes = {
  SELECT_MODE: 'SELECT_MODE'
}

export class SelectMaterialAction implements Action {
  type: string = ModeActionTypes.SELECT_MODE;
  payload: DistortionMode;

  constructor(payload: DistortionMode) {
    this.payload = payload;
  }
}
