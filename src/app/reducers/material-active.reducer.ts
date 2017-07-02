
import { Action } from '@ngrx/store';
import { MaterialActionTypes } from '../actions/material.action';
import { Quartz } from '../materials/materials/quartz.material';
import { MaterialClass } from '../materials/material-class.enum';
import { BaTiO3 } from '../materials/materials/batio3.material';
import { ModeActionTypes } from '../actions/mode.actions';
import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';

const defaultMaterials = new Map <MaterialClass, Material> ();
defaultMaterials[MaterialClass.Crystal] = Quartz;
defaultMaterials[MaterialClass.Ceramic_TP] = BaTiO3;

export const materialActiveReducer = (state: object = defaultMaterials[MaterialClass.Crystal].serialize(), action: Action) => {

  switch (action.type) {
    case MaterialActionTypes.UPDATE_MATERIAL:
      if (state['id'] === action.payload['id']) {
        return Object.assign({}, action.payload);
      }
      return state;
    case MaterialActionTypes.SELECT_ACTIVE_MATERIAL:
      return Object.assign({}, action.payload);
    case ModeActionTypes.SELECT_MODE:
      const mode: DistortionMode = action.payload;
      if (mode.supportedClasses.indexOf(state['type']) < 0) {
        return defaultMaterials[mode.supportedClasses[0]].serialize();
      }
      return state;
    default:
      return state;
  }
}
