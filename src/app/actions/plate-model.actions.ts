import { Action } from '@ngrx/store';

export const PlateActionTypes = {
  UPDATE_DIMENSIONS: 'UPDATE_DIMENSIONS',
  UPDATE_MATERIAL: 'UPDATE_MATERIAL'
}

export class UpdateDimensionAction implements Action {
  type: string = PlateActionTypes.UPDATE_DIMENSIONS;
  payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }
}
