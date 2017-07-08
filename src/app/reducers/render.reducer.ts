import { Action } from '@ngrx/store';
import { RenderActionTypes } from '../actions/render.actions';
import { RenderParameters } from '../plate-renderer/render-parameters';

const defaultState: RenderParameters = {
  shouldRender: false,
  shouldSwapGeometry: false,
  updateTime: false,
  time: 0
}

export const renderReducer = (state: RenderParameters = defaultState, action: Action) => {
  let override;
  switch (action.type) {
    case RenderActionTypes.RERENDER:
       override = {
         shouldRender: true,
         shouldSwapGeometry: true
       }
       return Object.assign({}, state, override) as RenderParameters;
    case RenderActionTypes.START_TIMER:
      override = {
        updateTime: true
      }
      return Object.assign({}, state, override) as RenderParameters;
    case RenderActionTypes.STOP_TIMER:
      override = {
        updateTime: false
      }
      return Object.assign({}, state, override) as RenderParameters;
    case RenderActionTypes.TICK:
      override = {
        shouldRender: true,
        shouldSwapGeometry: false,
        time: action.payload.time,
        scaledTime: action.payload.scaledTime
      }
      return Object.assign({}, state, override) as RenderParameters;
    default:
      return state;
  }
}
