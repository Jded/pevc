import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTranslatorPipe } from './error-translator.pipe';
import { PlateService } from './plate.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ErrorTranslatorPipe],
  exports: [ErrorTranslatorPipe],
  providers: [PlateService]
})
export class CoreModule { }
