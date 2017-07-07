import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeDisplayComponent } from './time-display/time-display.component';
import { DataOutputComponent } from './data-output.component';
import { PlotterComponent } from './plotter/plotter.component';
import { TensorOutputComponent } from './tensor-output/tensor-output.component';
import { NumberOutputComponent } from './number-output/number-output.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DataOutputComponent,
    TimeDisplayComponent,
    PlotterComponent,
    TensorOutputComponent,
    NumberOutputComponent
  ],
  exports: [
    DataOutputComponent
  ]
})
export class DataOutputModule { }
