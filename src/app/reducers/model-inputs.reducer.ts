import { Action } from '@ngrx/store';
import { ModelActionTypes } from '../actions/model.actions';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';

const override = new ModelValueDTO();
override.externalForces = 100;
override.linearExaggeration = 9;
override.strain = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]];

export function modelInputsReducer (state: ModelValueDTO = override, action: Action) {
  switch (action.type) {
    case ModelActionTypes.MODEL_INPUTS_SET:
      return Object.assign(new ModelValueDTO(), state, action.payload );
    case ModelActionTypes.MODEL_INPUTS_CHANGE:
      return Object.assign(new ModelValueDTO(), state, action.payload );
    default:
      return state;
  }
}
