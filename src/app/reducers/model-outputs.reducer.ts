import { Action } from '@ngrx/store';
import { ModelActionTypes } from '../actions/model.actions';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';


export const modelOutputReducer = (state: Map<ModeApiValue, ModelValueDTO> = new Map<ModeApiValue, ModelValueDTO>(), action: Action) => {
  switch (action.type) {
    case ModelActionTypes.MODEL_OUTPUTS_CHANGE:
      return action.payload;
    default:
      return state;
  }
}
