import { ModelValueDTO } from './model-value-dto';
import { ModeApi } from './mode-api';
import { PlateService } from '../core/plate.service';

export interface DistortionMode {
  modeId: string;
  modeName: string;
  override: ModelValueDTO;
  api: ModeApi;
  distortModel (model: PlateService, time: number): void;
  clearCache(): void;
}

