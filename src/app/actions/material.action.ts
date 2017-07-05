import { Action } from '@ngrx/store';
import { Material } from '../materials/material';

export const MaterialActionTypes = {
  ADD_MATERIALS: 'ADD_MATERIALS',
  UPDATE_MATERIAL: 'UPDATE_MATERIAL',
  REMOVE_MATERIAL: 'REMOVE_MATERIAL',
  SELECT_ACTIVE_MATERIAL: 'SELECT_ACTIVE_MATERIAL',
  SELECT_EDITED_MATERIAL: 'SELECT_EDITED_MATERIAL'
}

export class AddMaterialsAction implements Action {
  type: string = MaterialActionTypes.ADD_MATERIALS;
  payload: Material[];

  constructor(payload: Material[]) {
    this.payload = payload;
    console.log('running', this);
  }
}

export class UpdateMaterialAction implements Action {
  type: string = MaterialActionTypes.UPDATE_MATERIAL;
  payload: Material;

  constructor(payload: Material) {
    this.payload = payload;
  }
}

export class RemoveMaterialAction implements Action {
  type: string = MaterialActionTypes.REMOVE_MATERIAL;
  payload: number;

  constructor(payload: number) {
    this.payload = payload;
  }
}

export class SelectActiveMaterialAction implements Action {
  type: string = MaterialActionTypes.SELECT_ACTIVE_MATERIAL;
  payload: number;

  constructor(payload: number) {
    this.payload = payload;
  }
}

export class SelectEditedMaterialAction implements Action {
  type: string = MaterialActionTypes.SELECT_EDITED_MATERIAL;
  payload: number;

  constructor(payload: number) {
    this.payload = payload;
  }
}
