import { Injectable } from '@angular/core';

@Injectable()
export class CalculatorService {

  constructor() {
  }

  /*var modes = {};
  var modeSettings = {};
  var calculationCache = {};*/

  getKsi(ksqr, h, number) {
    // function for numerically solving tan (ksi*h) = ksi * h /k33^2 for ksi
    let nextKsi, prevKsi;
    prevKsi = Math.PI * 2 * number;
    nextKsi = (Math.atan(prevKsi * h / ksqr) + Math.PI * 2 * number) / h;
    while ((nextKsi - prevKsi) / prevKsi > 0.0001) {
      prevKsi = nextKsi;
      nextKsi = (Math.atan(prevKsi * h / ksqr) + Math.PI * 2 * number) / h;
    }
    return nextKsi;
  }

  updateModelData(modeId, model, time) {
    if (!modes[modeId]) {
      throw "Unrecognized calculation mode";
    }
    calculationCache = {};
    return modes[modeId].modeHandler(model, time, calculationCache);
  }

  updateTime(modeId, model, time) {
    if (!modes[modeId]) {
      throw "Unrecognized calculation mode";
    }
    return modes[modeId].modeHandler(model, time, calculationCache);
  }

  registerMode(modeId, mode) {
    modes[modeId] = mode;
  }

  getDefaultMode() {
    var def = _.find(modes, function (mode) {
      return mode.default;
    });
    return def ? def.modeId : null;
  }

  getModeSettings(modeId) {
    if (!modes[modeId]) {
      throw "Unrecognized calculation mode";
    }
    return modes[modeId].modeSettings;
  }

  getModeSelection(modeId) {
    return _.map(modes, function (mode) {
      return { modeId: mode.modeId, name: mode.modeName }
    });
  }

  getOverrides(modeId) {
    if (!modes[modeId]) {
      throw "Unrecognized calculation mode";
    }
    return modes[modeId].overrides;
  }

  getSupported(modeId) {
    if (!modes[modeId]) {
      throw "Unrecognized calculation mode";
    }
    return modes[modeId].supported;
  }

}
