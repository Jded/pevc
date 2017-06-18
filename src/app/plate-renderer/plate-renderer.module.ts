import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlateRendererComponent} from './plate-renderer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PlateRendererComponent,
  ],
  exports: [
    PlateRendererComponent
  ]
})
export class PlateRendererModule { }
