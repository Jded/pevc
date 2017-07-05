import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { PlateActionTypes } from '../actions/plate-model.actions';
import { PlateState } from '../physics-core/plate-state';
import { Action } from '@ngrx/store';
import { RenderActionTypes } from '../actions/render.actions';
import { RenderParameters } from '../plate-renderer/render-parameters';

const defaultPlateState: PlateState = Object.assign({}, PlateDistortionModel.initState)

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
      console.log('override1')
      return Object.assign({}, state, override) as RenderParameters;
    case RenderActionTypes.STOP_TIMER:
      override = {
        updateTime: false
      }
      console.log('override2')
      return Object.assign({}, state, override) as RenderParameters;
    case RenderActionTypes.TICK:
      override = {
        shouldRender: true,
        shouldSwapGeometry: false,
        time: action.payload
      }
      return Object.assign({}, state, override) as RenderParameters;
    default:
      return state;
  }
}
