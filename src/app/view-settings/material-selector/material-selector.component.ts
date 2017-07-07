import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SelectActiveMaterialAction } from '../../actions/material.action';
import { ModeFactoryService } from '../../core/mode-factory.service';
import { MaterialManagerService } from '../../core/material-manager.service';
import 'rxjs/add/operator/take';

@Component({
  selector: 'pevc-material-selector',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './material-selector.component.html',
  styleUrls: ['./material-selector.component.css']
})
export class MaterialSelectorComponent implements OnInit {

  controlsConfig: object = {
    material: ['', [Validators.required] ]
  }
  modelSettings: FormGroup;
  materialOptions$: Observable<object[]>;
  currentMaterial$: Observable<number>;

  constructor(private fb: FormBuilder,
              // private materialManager: MaterialManagerService,
              private materialOptionStore: Store<object[]>,
              private materialActiveStore: Store<number>
  ) {

    this.modelSettings = this.fb.group(this.controlsConfig);
    this.materialOptions$ = materialOptionStore.select('materialOptions');
    this.currentMaterial$ = materialActiveStore.select('materialActive');
    this.currentMaterial$.take(1).subscribe( (material) => this.modelSettings.patchValue({material: material}));


    this.modelSettings.valueChanges
      .subscribe((formData) => this.internalMaterialChange(formData));

    this.currentMaterial$
      .withLatestFrom(this.modelSettings.valueChanges)
      .subscribe(([material, formData ]) => this.externalMaterialChange(material, formData))
  }

  internalMaterialChange(formData) {
    const material: number = parseInt(formData['material'], 10);
    this.materialActiveStore.dispatch(new SelectActiveMaterialAction(material))
  }

  externalMaterialChange(material, formData) {
    if (!formData || material !== formData['material']) {
      this.modelSettings.patchValue({material: material});
    }
  }

  ngOnInit() {

  }

}
