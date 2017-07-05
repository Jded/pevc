import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeFactoryService } from '../core/mode-factory.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MaterialManagerService } from '../core/material-manager.service';
import { ModesEnum } from '../distortion-modes/modes.enum';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModelInputsChangeAction, SelectModeAction } from '../actions/mode.actions';
import { SelectActiveMaterialAction } from '../actions/material.action';
import { isDefined } from '@angular/compiler/src/util';
import { RenderParameters } from '../plate-renderer/render-parameters';
import { TimerStartAction, TimerStopAction } from '../actions/render.actions';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { ModelValueOverride } from '../distortion-modes/model-value-override';
import { hasOwnProperty } from 'tslint/lib/utils';

@Component({
  selector: 'pevc-model-settings',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.css']
})
export class ModelSettingsComponent implements AfterViewInit {


  @ViewChild('toggleTime') toggleButton: ElementRef;

  public ModeApiValue = ModeApiValue;
  modelSettings: FormGroup;
  modelInputs: FormGroup;
  modeOptions: object[];
  materialOptions$: Observable<object[]>;
  currentMaterial$: Observable<number>;
  currentMode$: Observable<ModesEnum>;
  currentModeApi$: Observable<ModeApi>;
  timer$: Observable<boolean>;

  controlsConfig: object = {
    material: ['', [Validators.required] ],
    mode: ['', [Validators.required] ]}

  modelInputsConfig: object = {
    frequency: ['', []],
    harmonicNumber: ['', []],
    externalForces: ['', []],
    voltage: ['', []],
    timeExpansion: ['', [Validators.required]],
    linearExaggeration: ['', [Validators.required]],
  }

  formErrors: Map<string, string[]> = new Map();

  constructor(private fb: FormBuilder,
              private modeFactory: ModeFactoryService,
              private materialManager: MaterialManagerService,
              private materialOptionStore: Store<object[]>,
              private materialActiveStore: Store<number>,
              private modelInputsStore: Store<ModelValueOverride>,
              private renderStore: Store<RenderParameters>,
              private modeStore: Store<ModesEnum>,
              private modeApiStore$: Store<ModeApi>,
              ) {
    this.materialOptions$ = materialOptionStore.select('materialOptions');
    this.currentMaterial$ = materialActiveStore.select('materialActive');
    this.currentMode$ = modeStore.select('mode');
    this.currentModeApi$ = modeApiStore$.select('modeApi');
    this.timer$ = this.renderStore.select('render').map((p: RenderParameters) => p.updateTime);
    this.modelSettings = this.fb.group(this.controlsConfig);
    this.modelInputs = this.fb.group(this.modelInputsConfig);

    this.modelSettings.valueChanges
      .withLatestFrom(this.currentMode$, this.currentMaterial$)
      .subscribe(([formData, currentMode, currentMaterial]) => this.materialModeChange(formData, currentMode, currentMaterial));
    this.modeOptions = modeFactory.modeOptions;

    this.modelInputs.valueChanges
      .withLatestFrom(this.currentModeApi$)
      .subscribe( ([formData, modeApi]) => this.inputValuesChange(formData, modeApi));

    this.currentMaterial$
      .withLatestFrom()
      .subscribe(([material, formData ]) => this.materialChange(material, formData))
    this.currentMode$
      .withLatestFrom()
      .subscribe(([mode, formData ]) => this.modeChange(mode, formData))

    this.modelInputsStore.select('modelInput').subscribe((state: ModelValueOverride) => {
      this.modelInputs.patchValue({
        frequency: state.frequency,
        harmonicNumber: state.harmonicNumber ? state.harmonicNumber : 1,
        externalForces: state.externalForces,
        voltage: state.voltage,
        timeExpansion: state.timeExpansion,
        linearExaggeration: state.linearExaggeration,
      })
    })
  }

  inputValuesChange(formData, modeApi) {
    const override = new ModelValueOverride();
    for (const prop in modeApi) {
      if (modeApi[prop] === ModeApiValue.INPUT) {
        override[prop] = formData[prop];
      }
    }
    console.log('dispatch', formData, modeApi, override)
    this.modelInputsStore.dispatch(new ModelInputsChangeAction(override))
  }

  materialModeChange(formData, currentMode, currentMaterial) {
    const mode: ModesEnum = parseInt(formData['mode'], 10);
    const material: number = parseInt(formData['material'], 10);

    if ((mode != null) && mode !== currentMode) {
         this.modeStore.dispatch(new SelectModeAction(mode))
    } else if ((material != null) && material !== currentMaterial) {
      this.modeStore.dispatch(new SelectActiveMaterialAction(material))
    }
  }

  materialChange(material, formData) {
    if (!formData || material !== formData['material']) {
      this.modelSettings.patchValue({material: material}, { emitEvent: false });
    }
  }

  modeChange(mode, formData) {
    if (!formData || mode !== formData['mode']) {
      this.modelSettings.patchValue({mode: mode}, { emitEvent: false });
    }
  }

  ngAfterViewInit(): void {
    Observable.fromEvent(this.toggleButton.nativeElement, 'click').withLatestFrom(this.timer$).subscribe(([click, timer]) => {
      if (!timer) {
        this.renderStore.dispatch(new TimerStartAction())
      } else {
        this.renderStore.dispatch(new TimerStopAction())
      }
    })
  }

}
