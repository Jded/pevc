import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorTranslatorPipe } from './error-translator.pipe';
import { FormatTimePipe } from './format-time.pipe';
import { TranslationPipe } from './translation.pipe';
import { TensorOutputComponent } from './tensor-output/tensor-output.component';
import { NumberOutputComponent } from './number-output/number-output.component';
import { MaterialTypePipe } from './material-type.pipe';
import { UiComponentsModule } from '../ui-components/ui-components.module';

@NgModule({
  imports: [
    CommonModule,
    UiComponentsModule
  ],
  declarations: [ErrorTranslatorPipe, FormatTimePipe, TranslationPipe, TensorOutputComponent, NumberOutputComponent, MaterialTypePipe],
  exports: [ErrorTranslatorPipe, FormatTimePipe, TranslationPipe, TensorOutputComponent, NumberOutputComponent, MaterialTypePipe]
})
export class SharedModule { }
