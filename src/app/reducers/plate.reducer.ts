import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { PlateActionTypes } from '../actions/plate-model.actions';
import { PlateState } from '../physics-core/plate-state';
import { Action } from '@ngrx/store';

export const plateReducer = (state: PlateState = Object.assign({}, PlateDistortionModel.initState), action: Action) => {

  switch (action.type) {
    case PlateActionTypes.UPDATE_DIMENSIONS:
      const newState = Object.assign({}, state);
      newState.dimensions =  [action.payload.plateX, action.payload.plateY, action.payload.plateZ];
      newState.resolution =  [action.payload.resolutionX, action.payload.resolutionY, action.payload.resolutionZ];
      return newState;
    default:
      return state;
  }
}
