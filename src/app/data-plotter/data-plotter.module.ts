import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPlotterComponent } from './data-plotter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DataPlotterComponent
  ],
  exports: [
    DataPlotterComponent
  ]
})
export class DataPlotterModule { }
