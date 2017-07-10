import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TranslationService {

  language = 'en';
  translationChange$: BehaviorSubject<string>;

  constructor() {
    this.translationChange$ = new BehaviorSubject<string>(this.language);
  }

  changeLanguage(target: string) {
    this.language = target;
    this.translationChange$.next(this.language);
  }

}
