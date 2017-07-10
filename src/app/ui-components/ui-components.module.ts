import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, MdInputModule, MdSelectModule, MdOptionModule,
  MdGridListModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule, MdInputModule, MdSelectModule, MdOptionModule, MdGridListModule],
  exports: [MdButtonModule, MdToolbarModule, MdCheckboxModule, MdCardModule, FlexLayoutModule, MdInputModule, MdSelectModule, MdOptionModule, MdGridListModule],
  declarations: []
})
export class UiComponentsModule { }
