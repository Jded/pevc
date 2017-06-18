import { MaterialClass } from '../materials/material-class.enum';
import { PlateModel } from '../plate-renderer/plate-model';
import { ModelValueOverride } from './model-value-override';
import { ModeApi } from './mode-api';

export interface DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueOverride;
  api: ModeApi;
  supportedClasses: MaterialClass[];
  distortModel (model: PlateModel, time: number): void;
}
