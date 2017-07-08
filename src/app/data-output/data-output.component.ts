import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModeApi } from '../distortion-modes/mode-api';
import { RenderParameters } from '../plate-renderer/render-parameters';
import { Observable } from 'rxjs/Observable';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { PlateService } from '../core/plate.service';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';
import { hasOwnProperty } from 'tslint/lib/utils';
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/partition'

@Component({
  selector: 'pevc-data-output',
  templateUrl: './data-output.component.html',
  styleUrls: ['./data-output.component.css']
})
export class DataOutputComponent implements OnInit {

  ModeApiValue = ModeApiValue;
  currentModeApi$: Observable<ModeApi>
  tensorStaticOutput$: Observable<object>
  tensorDynamicOutput$: Observable<object>
  scalarStaticOutput$: Observable<object>
  scalarDynamicOutput$: Observable<object>
  constructor(
    private outputStore$: Store<ModelValueDTO>,
    private modeApiStore$: Store<ModeApi>,
    private plateService: PlateService
  ) {
    this.currentModeApi$ = modeApiStore$.select('modeApi');
    this.streamSetup();
  }

  modeObjectToArray(api: ModeApiValue, s: Map<ModeApiValue, ModelValueDTO>) {
    if (!s.has(api)) { return []; }
    const dynamic = s.get(api);
    return Object.keys(dynamic).map((key) => ({ name: key, value: dynamic[key]}))
  }

  streamSetup() {
    const parent$ = this.outputStore$.select('modelOutput').share();
    this.scalarDynamicOutput$ = parent$
      .map((s: Map<ModeApiValue, ModelValueDTO>) => this.modeObjectToArray(ModeApiValue.OUTPUT_SCALAR_DYNAMIC, s))
    this.tensorDynamicOutput$ = parent$
      .map((s: Map<ModeApiValue, ModelValueDTO>) => this.modeObjectToArray(ModeApiValue.OUTPUT_TENSOR_DYNAMIC, s))
    this.scalarStaticOutput$ = parent$
      .map((s: Map<ModeApiValue, ModelValueDTO>) => this.modeObjectToArray(ModeApiValue.OUTPUT_SCALAR_STATIC, s))
    this.tensorStaticOutput$ = parent$
      .map((s: Map<ModeApiValue, ModelValueDTO>) => this.modeObjectToArray(ModeApiValue.OUTPUT_TENSOR_STATIC, s))
  }

  ngOnInit() {
  }

}
