import { Action } from '@ngrx/store';
import { ModelActionTypes } from '../actions/model.actions';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';


export const modelOutpusReducer = (state: ModelValueDTO = new ModelValueDTO(), action: Action) => {
  switch (action.type) {
    case ModelActionTypes.MODEL_OUTPUTS_CHANGE:
      return Object.assign(new ModelValueDTO(), state, action.payload );
    default:
      return state;
  }
}
