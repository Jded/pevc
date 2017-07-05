import { Injectable } from '@angular/core';
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { ModeFactoryService } from './mode-factory.service';
import { MaterialManagerService } from './material-manager.service';
import { PlateRenderer } from '../plate-renderer/plate-renderer';
import { ModelValueOverride } from '../distortion-modes/model-value-override';

@Injectable()
export class PlateService {
  activePlate: PlateDistortionModel
  activeRenderer: PlateRenderer

  constructor(private modeFactory: ModeFactoryService,
              private materialManager: MaterialManagerService) {
    this.activePlate = new PlateDistortionModel(Date.now())
  }

  setMode(modeId: ModesEnum) {
    this.activePlate.mode = new (this.modeFactory.getMode(modeId))();
    this.activePlate.distortModel();
    return this.activePlate.mode;
  }

  setMaterial(materialId: number) {
    this.activePlate.material = this.materialManager.getMaterial(materialId);
    this.activePlate.distortModel();
  }

  setModelInputs(inputValues: ModelValueOverride) {
    this.activePlate.setParameters(inputValues)
  }

  setTime(time: number) {
    this.activePlate.updateTime(time);
    this.activePlate.distortModel();
  }

}
