import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { PlateService } from '../core/plate.service';
import { RenderActionTypes, ReRenderAction, TickAction, TimerStartAction } from '../actions/render.actions';
import 'rxjs/add/observable/timer';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { ModelOutputsChangeAction } from '../actions/model.actions';

@Injectable()
export class RenderTriggerEffects {

  @Effect() startTimer(): Observable<Action> {
    return this.actions$
      .ofType(RenderActionTypes.START_TIMER)
      .switchMap(action => {
        this.plateService.resetTime(Date.now());
        return Observable
          .timer(20, 20)
          .takeUntil(this.actions$.ofType(RenderActionTypes.STOP_TIMER))
          .switchMap(() => {
            const time = this.plateService.setTime(Date.now());
            const scaledTime = this.plateService.getScaledTime();
            this.outputValueStore$.dispatch(new ModelOutputsChangeAction(this.plateService.getOutputValues()));
            return Observable.of(new TickAction(time, scaledTime))
          });
        }
      )
  }

  constructor(private actions$: Actions,
              private outputValueStore$: Store<ModelValueDTO>,
              private plateService: PlateService) { }
}
