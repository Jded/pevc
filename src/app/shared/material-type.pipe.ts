import { Pipe, PipeTransform } from '@angular/core';
import { MaterialClass } from '../materials/material-class.enum';

@Pipe({
  name: 'materialType'
})
export class MaterialTypePipe implements PipeTransform {

  transform(value: MaterialClass, args?: any): any {
    switch (value) {
      case MaterialClass.Crystal:
        return 'crystal';
      case MaterialClass.Ceramic_TP:
        return 'ceramic_tp';
      case MaterialClass.Ceramic_LP:
        return 'ceramic_lp';
      default:
        return 'unknown';
    }
    }

}
