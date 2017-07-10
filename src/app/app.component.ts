import { Component } from '@angular/core';
import { TranslationService } from './core/translation.service';

@Component({
  selector: 'pevc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pevc';
  constructor( private translator: TranslationService) {

  }

  setPL() {
    this.translator.changeLanguage('pl');
  }

  setEN() {
    this.translator.changeLanguage('en');
  }
}
