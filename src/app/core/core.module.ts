import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateService } from './plate.service';
import { MaterialManagerService } from './material-manager.service';
import { ModeFactoryService } from './mode-factory.service';
import { TranslationService } from './translation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    PlateService,
    MaterialManagerService,
    ModeFactoryService,
    TranslationService
  ]
})
export class CoreModule { }
