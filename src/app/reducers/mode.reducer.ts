
import { Action } from '@ngrx/store';
import { ModeActionTypes } from '../actions/mode.actions';
import { ModesEnum } from '../distortion-modes/modes.enum';


export const modeReducer = (state: ModesEnum = ModesEnum.PressureOpen, action: Action) => {

  switch (action.type) {
    case ModeActionTypes.SELECT_MODE:
      return action.payload;
    default:
      return state;
  }
}
