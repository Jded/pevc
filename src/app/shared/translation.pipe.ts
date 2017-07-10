import { Pipe, PipeTransform } from '@angular/core';
import { Translator } from './translator';
import { TranslationService } from '../core/translation.service';

@Pipe({
  name: 'translation',
  pure: false
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationService: TranslationService) {

  }

  transform(value: any, args?: any): any {
    if (!Translator[value]) { return value; }
    return Translator[value][this.translationService.language];
  }

}
