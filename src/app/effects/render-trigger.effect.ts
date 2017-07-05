import { Actions, Effect } from '@ngrx/effects';
import { MaterialManagerService } from '../core/material-manager.service';
import { ModeActionTypes, ModeApiChangeAction, ModelInputsSetupAction, SelectModeAction } from '../actions/mode.actions';
import { MaterialActionTypes, SelectActiveMaterialAction } from '../actions/material.action';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ModesEnum } from '../distortion-modes/modes.enum';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeUntil';
import { ModeFactoryService } from '../core/mode-factory.service';
import { MaterialClass } from '../materials/material-class.enum';
import { Injectable } from '@angular/core';
import { PlateService } from '../core/plate.service';
import { RenderActionTypes, ReRenderAction, TickAction, TimerStartAction } from '../actions/render.actions';
import 'rxjs/add/observable/timer';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModelValueOverride } from '../distortion-modes/model-value-override';

@Injectable()
export class RenderTriggerEffects {

  @Effect() modeChange$: Observable<Action> = this.actions$
    .ofType(ModeActionTypes.SELECT_MODE)
    .map(action => action as SelectModeAction)
    .switchMap(action => {
      const mode = this.plateService.setMode(action.payload);
      this.modeApiStore$.dispatch(new ModeApiChangeAction(mode.api));
      this.modeApiStore$.dispatch(new ModelInputsSetupAction(mode.override));
      return Observable.of(new ReRenderAction());
    })

  @Effect() materialChange(): Observable<Action> {
    return this.actions$
      .ofType(MaterialActionTypes.SELECT_ACTIVE_MATERIAL)
      .switchMap(action => {
        this.plateService.setMaterial(action.payload);
        return Observable.of(new ReRenderAction());
      })
  }

  @Effect() startTimer(): Observable<Action> {
    return this.actions$
      .ofType(RenderActionTypes.START_TIMER)
      .switchMap(action => {
          return Observable
            .timer(20, 20)
            .takeUntil(this.actions$.ofType(RenderActionTypes.STOP_TIMER))
            .switchMap(() => {
              const time = Date.now();
              this.plateService.setTime(time);
              return Observable.of(new TickAction(time))
            });
        }
      )
  }

  constructor(private actions$: Actions,
              private modeStore$: Store<ModesEnum>,
              private modeApiStore$: Store<ModeApi>,
              private modelInputsStore$: Store<ModelValueOverride>,
              private materialStore$: Store<number>,
              private materialManagerService: MaterialManagerService,
              private modeFactoryService: ModeFactoryService,
              private plateService: PlateService) { }
}
