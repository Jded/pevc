import { Action } from '@ngrx/store';

export const RenderActionTypes = {
  RERENDER: 'RERENDER',
  STOP_TIMER: 'STOP_TIMER',
  START_TIMER: 'START_TIMER',
  TICK: 'TICK'
}


export class ReRenderAction implements Action {
  type: string = RenderActionTypes.RERENDER;
  payload: null;
}

export class TimerStopAction implements Action {
  type: string = RenderActionTypes.STOP_TIMER;
  payload: null;
}

export class TimerStartAction implements Action {
  type: string = RenderActionTypes.START_TIMER;
  payload: null;
}

export class TickAction implements Action {
  type: string = RenderActionTypes.TICK;
  payload: number;

  constructor (timestamp: number) {
    this.payload = timestamp;
  }
}
