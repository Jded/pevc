import { Action } from '@ngrx/store';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModelActionTypes } from '../actions/model.actions';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { PressureOpen } from '../distortion-modes/modes/pressure-open';

export const modelApiReducer = (state: ModeApi = PressureOpen.api, action: Action) => {
  switch (action.type) {
    case ModelActionTypes.MODEL_API_UPDATE:
      return action.payload;
    default:
      return state;
  }
}
