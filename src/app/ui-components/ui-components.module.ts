import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, MdInputModule, MdSelectModule, MdOptionModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule, MdInputModule, MdSelectModule, MdOptionModule],
  exports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule, MdInputModule, MdSelectModule, MdOptionModule],
  declarations: []
})
export class UiComponentsModule { }
