import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeDisplayComponent } from './time-display/time-display.component';
import { DataOutputComponent } from './data-output.component';
import { PlotterComponent } from './plotter/plotter.component';
import { SharedModule } from '../shared/shared.module';
import { UiComponentsModule } from '../ui-components/ui-components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UiComponentsModule
  ],
  declarations: [
    DataOutputComponent,
    TimeDisplayComponent,
    PlotterComponent
  ],
  exports: [
    DataOutputComponent
  ]
})
export class DataOutputModule { }
