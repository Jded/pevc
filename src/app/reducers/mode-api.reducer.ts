import { Action } from '@ngrx/store';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModeActionTypes } from '../actions/mode.actions';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';

export const modeApiReducer = (state: ModeApi = PressureOpen.api, action: Action) => {
  switch (action.type) {
    case ModeActionTypes.MODE_API_UPDATE:
      console.log('WHY MODE API', action.payload)
      return action.payload;
    default:
      return state;
  }
}
