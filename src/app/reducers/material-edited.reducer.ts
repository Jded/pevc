
import { Action } from '@ngrx/store';
import { MaterialActionTypes } from '../actions/material.action';

export const materialEditedReducer = (state: object = null, action: Action) => {

  switch (action.type) {
    case MaterialActionTypes.UPDATE_MATERIAL:
      if (state['id'] === action.payload['id']) {
        return Object.assign({}, action.payload);
      }
      return state;
    case MaterialActionTypes.SELECT_EDITED_MATERIAL:
      return Object.assign({}, action.payload);
    default:
      return state;
  }
}
