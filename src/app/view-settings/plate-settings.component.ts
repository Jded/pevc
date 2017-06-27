import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pevc-plate-settings',
  templateUrl: './plate-settings.component.html',
  styleUrls: ['./plate-settings.component.css']
})
export class PlateSettingsComponent implements OnInit {

  plateModel$: Observable<PlateDistortionModel>;

  controlsConfig: object = {
    plateX: ['', [Validators.required, Validators.min(0), Validators.max(10000)] ],
    plateY: ['', [Validators.required, Validators.min(0), Validators.max(10000)] ],
    plateZ: ['', [Validators.required, Validators.min(0), Validators.max(10000)] ],
    resolutionX: ['', [Validators.required, Validators.min(1), Validators.max(1000)] ],
    resolutionY: ['', [Validators.required, Validators.min(1), Validators.max(1000)] ],
    resolutionZ: ['', [Validators.required, Validators.min(1), Validators.max(1000)] ]
  }

  formErrors: Map<string, string[]> = new Map();

  plateParameters: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<PlateDistortionModel>) {

    this.plateParameters = this.fb.group(this.controlsConfig)
    this.plateParameters.valueChanges.subscribe(data => this.valueChange(data));
  }

  valueChange(data?: any) {
    const plateForm = this.plateParameters;
    for (const field in this.controlsConfig) {
      if (this.controlsConfig.hasOwnProperty(field)) {
        this.formErrors[field] = null;
        const formField = plateForm.get(field);
        if (formField && !formField.valid) {
          console.log(formField.errors)
          this.formErrors[field] = Object.keys(formField.errors)
            .map(k => { if (formField.errors[k]) {return k; }})
            .filter( (k) => k )
        }else {
          this.formErrors[field] = null;
        }
      }

    }
  }

  ngOnInit() {
  }

}
