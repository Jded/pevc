import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeApiValue } from '../../distortion-modes/mode-api-value.enum';
import { Observable } from 'rxjs/Observable';
import { ModelValueDTO } from '../../distortion-modes/model-value-dto';
import { ModeApi } from '../../distortion-modes/mode-api';
import { ModelInputsChangeAction } from '../../actions/model.actions';
import { Store } from '@ngrx/store';
import { hasOwnProperty } from 'tslint/lib/utils';

@Component({
  selector: 'pevc-model-inputs',
  templateUrl: './model-inputs.component.html',
  styleUrls: ['./model-inputs.component.css']
})
export class ModelInputsComponent implements OnInit {

  public ModeApiValue = ModeApiValue;
  modelInputs: FormGroup;
  currentModeApi$: Observable<ModeApi>;
  currentModeInputs$: Observable<ModelValueDTO>;
  modelInputsConfig: object = {
    frequency: ['', []],
    harmonicNumber: ['', []],
    externalForces: ['', []],
    voltage: ['', []],
    timeExpansion: ['', [Validators.required]],
    linearExaggeration: ['', [Validators.required]],
  }

  constructor(private fb: FormBuilder,
              private modelInputsStore: Store<ModelValueDTO>,
              private modeApiStore$: Store<ModeApi>
  ) {
    this.currentModeApi$ = modeApiStore$.select('modeApi');
    this.modelInputs = this.fb.group(this.modelInputsConfig);
    this.currentModeInputs$ = this.modelInputsStore.select('modelInput');

    this.modelInputs.valueChanges
      .withLatestFrom(this.currentModeApi$, this.currentModeInputs$)
      .subscribe( ([formData, modeApi, oldValues]) => this.internalInputValuesChange(formData, modeApi, oldValues));

    this.currentModeInputs$.subscribe((state: ModelValueDTO) => {
      this.modelInputs.patchValue({
        frequency: state.frequency,
        harmonicNumber: state.harmonicNumber,
        externalForces: state.externalForces,
        voltage: state.voltageInput,
        timeExpansion: state.timeExpansion,
        linearExaggeration: state.linearExaggeration,
      })
    })
  }

  internalInputValuesChange(formData, modeApi, oldValues) {
    const override = new ModelValueDTO();
    let changed = false;
    for (const prop in modeApi) {
      if (hasOwnProperty(modeApi, prop)) {
        if (modeApi[prop] === ModeApiValue.INPUT) {
          if (formData[prop] && formData[prop] !== oldValues[prop]) {
            changed = true;
          }
          override[prop] = formData[prop];
        }


      }
    }
    if (changed) {
      this.modelInputsStore.dispatch(new ModelInputsChangeAction(override));
    }
  }

  ngOnInit() {
  }

}
