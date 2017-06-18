import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateSettingsComponent } from './plate-settings.component';
import { ModelSettingsComponent } from './model-settings.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PlateSettingsComponent, ModelSettingsComponent],
  exports: [PlateSettingsComponent, ModelSettingsComponent]
})
export class ViewSettingsModule { }
