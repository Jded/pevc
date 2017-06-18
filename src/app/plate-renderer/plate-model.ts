import { DistortionMode } from '../distortion-modes/distortion-mode';
import { Material } from '../materials/material';
import { BoxGeometry } from 'three'
import { PiezoPlateGeometry } from './rendering-extensions/plate-geometry';

export class PlateModel {
  initTime: number;
  timeExpansion: number;
  linearExaggeration: number;
  harmonic: number;
  frequency: number;
  strain: number[][];
  stress: number[][];
  resolution: number[];
  dimensions: number[];
  boundaryConditions: number[];
  mode: DistortionMode;
  material: Material;
  voltage: number;
  externalForces: number;
  box: BoxGeometry;
  basicGeometry: PiezoPlateGeometry;
  modifiedGeometry: PiezoPlateGeometry;

  constructor(initTime) {
    this.initTime = initTime;
    this.timeExpansion = 10;
    this.linearExaggeration = 1;
    this.harmonic = 2;
    this.frequency = 0;
    this.strain = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.stress = [[0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.resolution = [10, 50, 10];
    this.dimensions = [10, 1, 10];
    this.boundaryConditions = [];
    this.mode = null; // pzCalculator.getDefaultMode();
    this.material = null; // pzMaterial.getMaterial('PZT5H');
    this.voltage = 0;
    this.externalForces = 1;
    this.setOverrides();
    this.fillGeometries();
  }

  fillGeometries() {
    // var existing = !!this.basicGeometry;
    this.basicGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
    this.box = new BoxGeometry(this.dimensions[0], this.dimensions[1], this.dimensions[2])
    this.modifiedGeometry = new PiezoPlateGeometry(this.dimensions, this.resolution);
    // if(existing){$rootScope.$broadcast("pzExchangeGeometry");}
  }

  update(timestamp) {
    const time: number = timestamp - this.initTime;
    // pzCalculator.updateModelData(this.mode,this,time);
    this.modifiedGeometry.verticesNeedUpdate = true;
    // $rootScope.$broadcast('pzPlateUpdate',timestamp);
  }

  resetTime(time) {
    this.initTime = time;
  }

  updateTime(timestamp) {
    /*if(pzCalculator.getModeSettings(this.mode).TIME === VARMODE.INPUT){
      var time = timestamp - this.initTime;
      pzCalculator.updateTime(this.mode,this,time);
      this.modifiedGeometry.verticesNeedUpdate = true;
      $rootScope.$broadcast('pzTimeUpdate',timestamp);
      return true;
    }
    return false;*/
  }

  getScaledTime = function () {
    const timeDelta: number = Date.now() - this.initTime;
    return (timeDelta / Math.pow(10, this.timeExpansion - 1)).toFixed(Math.max(this.timeExpansion - 3, 0));
  }

  getValue(id: string) {
    /*switch(id){
      case 'VOLTAGE':
        return this.voltageO;
        break;
      case 'PRESSURE':
        return this.externalForces;
        break;
      case 'STRAIN':
        return this.strain;
        break;
      case TRACK.ELONGZ:
        return getElongation (this.basicGeometry,this.modifiedGeometry,'z');
        break;
      case TRACK.ELONGY:
        return getElongation (this.basicGeometry,this.modifiedGeometry,'y');
        break;
    }*/
  }


  setOverrides() {
    /*var that = this;
    _.each(pzCalculator.getOverrides(this.mode), function(value,key){
      that[key] = value;
    })*/
  }

}
