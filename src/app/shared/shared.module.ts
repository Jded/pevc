import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTranslatorPipe } from './error-translator.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ErrorTranslatorPipe],
  exports: [ErrorTranslatorPipe]
})
export class SharedModule { }
