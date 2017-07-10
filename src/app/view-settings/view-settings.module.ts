import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateSettingsComponent } from './plate-settings.component';
import { ModelSettingsComponent } from './model-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ModeSelectorComponent } from './mode-selector/mode-selector.component';
import { MaterialSelectorComponent } from './material-selector/material-selector.component';
import { ModelInputsComponent } from './model-inputs/model-inputs.component';
import { UiComponentsModule } from '../ui-components/ui-components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UiComponentsModule
  ],
  declarations: [
    PlateSettingsComponent,
    ModelSettingsComponent,
    ModeSelectorComponent,
    MaterialSelectorComponent,
    ModelInputsComponent],
  exports: [PlateSettingsComponent, ModelSettingsComponent]
})
export class ViewSettingsModule {
}
