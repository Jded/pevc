import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { ViewSettingsModule } from '../view-settings/view-settings.module';
import { PlateRendererModule } from '../plate-renderer/plate-renderer.module';
import { DataOutputModule } from '../data-output/data-output.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    UiComponentsModule,
    ViewSettingsModule,
    PlateRendererModule,
    DataOutputModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
