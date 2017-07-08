import { Action } from '@ngrx/store';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';

export const ModelActionTypes = {
  SELECT_MODE: 'SELECT_MODE',
  MODEL_API_UPDATE: 'MODEL_API_UPDATE',
  MODEL_INPUTS_SET: 'MODEL_INPUTS_SET',
  MODEL_INPUTS_CHANGE: 'MODEL_INPUTS_CHANGE',
  MODEL_OUTPUTS_CHANGE: 'MODEL_OUTPUTS_CHANGE'
}

export class SelectModeAction implements Action {
  type: string = ModelActionTypes.SELECT_MODE;
  payload: ModesEnum;

  constructor(payload: ModesEnum) {
    this.payload = payload;
  }
}

export class ModelApiChangeAction implements Action {
  type: string = ModelActionTypes.MODEL_API_UPDATE;
  payload: ModeApi;

  constructor(payload: ModeApi) {
    this.payload = payload;
  }
}

export class ModelInputsSetupAction implements Action {
  type: string = ModelActionTypes.MODEL_INPUTS_SET;
  payload: ModelValueDTO;

  constructor(payload: ModelValueDTO) {
    this.payload = payload;
  }
}

export class ModelInputsChangeAction implements Action {
  type: string = ModelActionTypes.MODEL_INPUTS_CHANGE;
  payload: ModelValueDTO;

  constructor(payload: ModelValueDTO) {
    this.payload = payload;
  }
}

export class ModelOutputsChangeAction implements Action {
  type: string = ModelActionTypes.MODEL_OUTPUTS_CHANGE;
  payload: Map<ModeApiValue, ModelValueDTO>;

  constructor(payload: Map<ModeApiValue, ModelValueDTO>) {
    this.payload = payload;
  }
}
