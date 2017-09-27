import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialEditorComponent } from './material-editor.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialViewComponent } from './material-view/material-view.component';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import { NoMaterialComponent } from './no-material/no-material.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UiComponentsModule } from '../ui-components/ui-components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    UiComponentsModule
  ],
  declarations: [MaterialEditorComponent, MaterialListComponent, MaterialViewComponent, MaterialEditComponent, NoMaterialComponent],
  exports: [MaterialEditorComponent]
})
export class MaterialEditorModule { }
