import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ModesEnum } from '../../distortion-modes/modes.enum';
import { Store } from '@ngrx/store';
import { SelectModeAction } from '../../actions/model.actions';
import { ModeFactoryService } from '../../core/mode-factory.service';
import { MaterialManagerService } from '../../core/material-manager.service';

@Component({
  selector: 'pevc-mode-selector',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.css']
})
export class ModeSelectorComponent implements OnInit {

  modelSettings: FormGroup;
  modeOptions: object[];
  currentMode$: Observable<ModesEnum>;
  controlsConfig: object = {
    mode: ['', [Validators.required] ]}

  constructor(
    private fb: FormBuilder,
    private modeFactory: ModeFactoryService,
    private modeStore: Store<ModesEnum>
  ) {
    this.modeOptions = modeFactory.modeOptions;
    this.modelSettings = this.fb.group(this.controlsConfig);
    this.currentMode$ = modeStore.select('mode');
    this.currentMode$.take(1).subscribe( (mode) => this.modelSettings.patchValue({mode: mode}));
    this.modelSettings.valueChanges
      .subscribe((formData) => this.internalModeChange(formData));

    this.currentMode$
      .withLatestFrom(this.modelSettings.valueChanges)
      .subscribe(([mode, formData ]) => this.externalModeChange(mode, formData))
  }

  externalModeChange(mode, formData) {
    if (!formData || mode !== formData['mode']) {
      this.modelSettings.patchValue({mode: mode}, { emitEvent: false });
    }
  }

  internalModeChange(formData) {
    const mode: ModesEnum = parseInt(formData['mode'], 10);
    this.modeStore.dispatch(new SelectModeAction(mode))
  }

  ngOnInit() {

  }

}
