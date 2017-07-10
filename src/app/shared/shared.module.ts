import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTranslatorPipe } from './error-translator.pipe';
import { FormatTimePipe } from './format-time.pipe';
import { TranslationPipe } from './translation.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ErrorTranslatorPipe, FormatTimePipe, TranslationPipe],
  exports: [ErrorTranslatorPipe, FormatTimePipe, TranslationPipe]
})
export class SharedModule { }
