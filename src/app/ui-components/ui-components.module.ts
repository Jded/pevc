import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule],
  exports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule],
  declarations: []
})
export class UiComponentsModule { }
