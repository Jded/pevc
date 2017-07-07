import { Actions, Effect } from '@ngrx/effects';
import { MaterialManagerService } from '../core/material-manager.service';
import {
  ModelActionTypes, ModelApiChangeAction, ModelInputsSetupAction, ModelOutputsChangeAction,
  SelectModeAction
} from '../actions/model.actions';
import { MaterialActionTypes, SelectActiveMaterialAction } from '../actions/material.action';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ModesEnum } from '../distortion-modes/modes.enum';
import 'rxjs/add/operator/withLatestFrom';
import { ModeFactoryService } from '../core/mode-factory.service';
import { MaterialClass } from '../materials/material-class.enum';
import { Injectable } from '@angular/core';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { ReRenderAction, TickAction } from '../actions/render.actions';
import { PlateService } from '../core/plate.service';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';

@Injectable()
export class MaterialModeInteractionEffects {

  @Effect() modeChange$: Observable<Action> = this.actions$
    .ofType(ModelActionTypes.SELECT_MODE)
    .map(action => action as SelectModeAction)
    .withLatestFrom(this.materialStore$.select('materialActive'))
    .map(([action , materialId]: [SelectModeAction, number]) => {
      console.log('sit', action, materialId)
      const supported: MaterialClass[] = action.payload ?
        this.modeFactoryService.getMode(action.payload as ModesEnum).supportedClasses :
        [];
      const materialType = this.materialManagerService.getMaterial(materialId).type;
      return [action.payload, supported.indexOf(materialType) > -1 ? null : this.materialManagerService.defaultMaterials[supported[0]].id];
    })
    .switchMap(([targetMode, targetMaterial]) => {
      const mode = this.plateService.setMode(targetMode);
      this.modelApiStore$.dispatch(new ModelApiChangeAction(mode.api));
      this.modelInputOutputStore$.dispatch(new ModelInputsSetupAction(mode.override));
      if (targetMaterial !== null) {
        return Observable.of (new SelectActiveMaterialAction(targetMaterial));
      } else {
        this.modelInputOutputStore$.dispatch(new ModelOutputsChangeAction(this.plateService.getOutputValues()));
        return Observable.of (new ReRenderAction());
      }
    }
  )

  @Effect() materialChange$: Observable<Action> = this.actions$
      .ofType(MaterialActionTypes.SELECT_ACTIVE_MATERIAL)
      .withLatestFrom(this.modeStore$.select('mode'))
      .map(([ action , mode]) => {
        const supported: MaterialClass[] = mode ?
          this.modeFactoryService.getMode(mode as ModesEnum).supportedClasses :
          [];
        const materialType = this.materialManagerService.getMaterial(action.payload).type;
        this.plateService.setMaterial(action.payload);
        return supported.indexOf(materialType) > -1 ? null : this.modeFactoryService.defaultMode;
      })
      .switchMap(targetMode => {
        console.log('this', [targetMode])
        if (targetMode !== null) {
          Observable.of(new SelectModeAction(targetMode))
        } else {
          this.modelInputOutputStore$.dispatch(new ModelOutputsChangeAction(this.plateService.getOutputValues()));
          return Observable.of(new ReRenderAction());
        }
      }
    )


  @Effect() modelInputChange: Observable<Action> = this.actions$
      .ofType(ModelActionTypes.MODEL_INPUTS_CHANGE)
      .switchMap(action  => {
        this.plateService.setModelInputs(action.payload as ModelValueDTO);
        return Observable.of(new ReRenderAction());
      })

  constructor(private actions$: Actions,
              private modeStore$: Store<ModesEnum>,
              private materialStore$: Store<number>,
              private modelApiStore$: Store<ModeApiValue>,
              private modelInputOutputStore$: Store<ModelValueDTO>,
              private materialManagerService: MaterialManagerService,
              private modeFactoryService: ModeFactoryService,
              private plateService: PlateService) { }
}
