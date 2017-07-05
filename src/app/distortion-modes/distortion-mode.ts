import { MaterialClass } from '../materials/material-class.enum';
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { ModelValueOverride } from './model-value-override';
import { ModeApi } from './mode-api';

export interface DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueOverride;
  api: ModeApi;
  distortModel (model: PlateDistortionModel, time: number): void;
}

