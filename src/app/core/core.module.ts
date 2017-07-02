import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateService } from './plate.service';
import { MaterialManagerService } from './material-manager.service';
import { ModeFactoryService } from './mode-factory.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    PlateService,
    MaterialManagerService,
    ModeFactoryService
  ]
})
export class CoreModule { }
