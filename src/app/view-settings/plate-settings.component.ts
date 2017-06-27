import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PlateDistortionModel } from '../core/plate-distortion-model';
import { Action, Store } from '@ngrx/store';
import { UpdateDimensionAction } from '../actions/plate-model.actions';
import { PlateState } from '../core/plate-state';

@Component({
  selector: 'pevc-plate-settings',
  templateUrl: './plate-settings.component.html',
  styleUrls: ['./plate-settings.component.css']
})
export class PlateSettingsComponent implements OnInit {

  plateState$: Observable<PlateState>;

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

  constructor(private fb: FormBuilder, private store: Store<PlateState>) {
    this.plateState$ = store.select('plate');
    this.plateParameters = this.fb.group(this.controlsConfig)
    this.plateParameters.valueChanges.subscribe(data => this.valueChange(data));
    this.plateState$.first().subscribe((initState: PlateState) => {
      this.plateParameters.setValue({
        plateX: initState.dimensions[0],
        plateY: initState.dimensions[1],
        plateZ: initState.dimensions[2],
        resolutionX: initState.resolution[0],
        resolutionY: initState.resolution[1],
        resolutionZ: initState.resolution[2]
      })
    })
  }

  updateValidation(plateForm) {
    for (const field in this.controlsConfig) {
      if (this.controlsConfig.hasOwnProperty(field)) {
        this.formErrors[field] = null;
        const formField = plateForm.get(field);
        if (formField && !formField.valid) {
          this.formErrors[field] = Object.keys(formField.errors)
            .map(k => { if (formField.errors[k]) {return k; }})
            .filter( (k) => k )
        }else {
          this.formErrors[field] = null;
        }
      }
    }
  }

  updateModel(value) {
    const action: Action = new UpdateDimensionAction(value);
    this.store.dispatch(action);
  }

  valueChange(data?: any) {
    const plateForm = this.plateParameters;
    this.updateValidation(plateForm);
    if (plateForm.valid) {
      this.updateModel(plateForm.value)
    }
  }

  ngOnInit() {
  }

}
