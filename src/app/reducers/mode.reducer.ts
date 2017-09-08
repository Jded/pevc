
import { Action } from '@ngrx/store';
import { ModelActionTypes } from '../actions/model.actions';
import { ModesEnum } from '../distortion-modes/modes.enum';


export function modeReducer (state: ModesEnum = ModesEnum.PressureOpen, action: Action) {

  switch (action.type) {
    case ModelActionTypes.SELECT_MODE:
      return action.payload;
    default:
      return state;
  }
}
