import { Action } from '@ngrx/store';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModelValueOverride } from '../distortion-modes/model-value-override';

export const ModeActionTypes = {
  SELECT_MODE: 'SELECT_MODE',
  MODE_API_UPDATE: 'MODE_API_UPDATE',
  MODEL_INPUTS_SET: 'MODEL_INPUTS_SET',
  MODEL_INPUTS_CHANGE: 'MODEL_INPUTS_CHANGE'
}

export class SelectModeAction implements Action {
  type: string = ModeActionTypes.SELECT_MODE;
  payload: ModesEnum;

  constructor(payload: ModesEnum) {
    this.payload = payload;
  }
}

export class ModeApiChangeAction implements Action {
  type: string = ModeActionTypes.MODE_API_UPDATE;
  payload: ModeApi;

  constructor(payload: ModeApi) {
    this.payload = payload;
  }
}

export class ModelInputsSetupAction implements Action {
  type: string = ModeActionTypes.MODEL_INPUTS_SET;
  payload: ModelValueOverride;

  constructor(payload: ModelValueOverride) {
    this.payload = payload;
  }
}

export class ModelInputsChangeAction implements Action {
  type: string = ModeActionTypes.MODEL_INPUTS_CHANGE;
  payload: ModelValueOverride;

  constructor(payload: ModelValueOverride) {
    this.payload = payload;
  }
}
