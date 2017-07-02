import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateSettingsComponent } from './plate-settings.component';
import { ModelSettingsComponent } from './model-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [PlateSettingsComponent, ModelSettingsComponent],
  exports: [PlateSettingsComponent, ModelSettingsComponent]
})
export class ViewSettingsModule { }
