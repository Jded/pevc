import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeFactoryService } from '../core/mode-factory.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MaterialManagerService } from '../core/material-manager.service';

@Component({
  selector: 'pevc-model-settings',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.css']
})
export class ModelSettingsComponent implements OnInit {

  modelSettings: FormGroup;
  modeOptions: object[];
  materialOptions$: Observable<object[]>;


  controlsConfig: object = {
    material: ['', [Validators.required] ],
    mode: ['', [Validators.required] ]
  }

  formErrors: Map<string, string[]> = new Map();

  constructor(private fb: FormBuilder,
              modeFactory: ModeFactoryService,
              materialManager: MaterialManagerService,
              materialOptionStore: Store<object[]>) {
    this.materialOptions$ = materialOptionStore.select('materialOptions');
    this.materialOptions$.forEach((e) => console.log(e))
    this.modelSettings = this.fb.group(this.controlsConfig)
    this.modelSettings.valueChanges.subscribe(data => this.valueChange(data));
    this.modeOptions = modeFactory.modeOptions;
  }

  valueChange(data) {
    console.log(data)
  }


  ngOnInit() {
  }

}
