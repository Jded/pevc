import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { ViewSettingsModule } from '../view-settings/view-settings.module';
import { PlateRendererModule } from '../plate-renderer/plate-renderer.module';
import { DataPlotterModule } from '../data-plotter/data-plotter.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    UiComponentsModule,
    ViewSettingsModule,
    PlateRendererModule,
    DataPlotterModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
