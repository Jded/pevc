
import { Action } from '@ngrx/store';
import { ModeActionTypes } from '../actions/mode.actions';
import { DistortionMode } from '../distortion-modes/distortion-mode';

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
