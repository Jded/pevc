import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialEditorComponent } from './material-editor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MaterialEditorComponent],
  exports: [MaterialEditorComponent]
})
export class MaterialEditorModule { }
