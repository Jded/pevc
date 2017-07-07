import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModeApi } from '../distortion-modes/mode-api';
import { RenderParameters } from '../plate-renderer/render-parameters';
import { Observable } from 'rxjs/Observable';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';
import { PlateService } from '../core/plate.service';
import { ModelValueDTO } from '../distortion-modes/model-value-dto';

@Component({
  selector: 'pevc-data-output',
  templateUrl: './data-output.component.html',
  styleUrls: ['./data-output.component.css']
})
export class DataOutputComponent implements OnInit {

  ModeApiValue = ModeApiValue;
  currentModeApi$: Observable<ModeApi>;
  modelOutputTensor$: Observable<ModelValueDTO>
  constructor(
    private renderStore: Store<RenderParameters>,
    private modeApiStore$: Store<ModeApi>,
    private plateService: PlateService
  ) {
    /*this.currentModeApi$ = modeApiStore$.select('modeApi');
    const dataMultiplexer = this.renderStore.select('render')
      .filter((rPar: RenderParameters) => rPar.shouldRender)
      .map(() => plateService.getOutputValues())
      .share();
    dataMultiplexer.map((params: ModelValueDTO) => {
      new ModelValueDTO()
    })
*/  }

  ngOnInit() {
  }

}
