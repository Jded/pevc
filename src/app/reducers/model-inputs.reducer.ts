import { Action } from '@ngrx/store';
import { ModeActionTypes } from '../actions/mode.actions';
import { ModelValueOverride } from '../distortion-modes/model-value-override';

const override = new ModelValueOverride();
override.externalForces = 100;
override.linearExaggeration = 9;
override.strain = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]];

export const modelInputsReducer = (state: ModelValueOverride = override, action: Action) => {
  switch (action.type) {
    case ModeActionTypes.MODEL_INPUTS_SET:
      return Object.assign(new ModelValueOverride(), state, action.payload );
    case ModeActionTypes.MODEL_INPUTS_SET:
      return Object.assign(new ModelValueOverride(), state, action.payload );
    default:
      return state;
  }
}
