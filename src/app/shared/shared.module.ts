import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTranslatorPipe } from './error-translator.pipe';
import { FormatTimePipe } from './format-time.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ErrorTranslatorPipe, FormatTimePipe],
  exports: [ErrorTranslatorPipe, FormatTimePipe]
})
export class SharedModule { }
