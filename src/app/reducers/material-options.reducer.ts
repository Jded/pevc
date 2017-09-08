import { Action } from '@ngrx/store';
import { MaterialActionTypes } from '../actions/material.action';

export function materialOptionsReducer (state: object[] = [], action: Action) {
  let newState;
  switch (action.type) {
    case MaterialActionTypes.UPDATE_MATERIAL:
      newState = state.map((m) => {
        const clone = Object.assign({}, m);
        if (m['id'] === action.payload.id) { clone['name'] = action.payload.name; clone['type'] = action.payload['type']}
      });
      return newState;
    case MaterialActionTypes.ADD_MATERIALS:
      newState = state.map((m) => Object.assign({}, m))
        .concat(action.payload.map((m) => ({id: m.id, name: m.name, type: m.type})));
      return newState;
    case MaterialActionTypes.REMOVE_MATERIAL:
      newState = state.filter((m) => m['id'] !== action.payload);
      return newState;
    default:
      return state;
  }
}
