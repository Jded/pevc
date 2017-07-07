import { MaterialClass } from '../materials/material-class.enum';
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { ModelValueDTO } from './model-value-dto';
import { ModeApi } from './mode-api';

export interface DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api: ModeApi;
  distortModel (model: PlateDistortionModel, time: number): void;
  clearCache(): void;
}

