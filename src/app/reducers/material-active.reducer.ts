
import { Action } from '@ngrx/store';
import { MaterialActionTypes } from '../actions/material.action';
import { Quartz } from '../materials/materials/quartz.material';
import { MaterialClass } from '../materials/material-class.enum';
import { BaTiO3 } from '../materials/materials/batio3.material';
import { ModelActionTypes } from '../actions/model.actions';
import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';

export const materialActiveReducer = (state: number = Quartz.id, action: Action) => {

  switch (action.type) {
    case MaterialActionTypes.SELECT_ACTIVE_MATERIAL:
      return action.payload;
    default:
      return state;
  }
}
