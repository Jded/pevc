import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModeFactoryService } from '../core/mode-factory.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'
import { MaterialManagerService } from '../core/material-manager.service';
import { RenderParameters } from '../plate-renderer/render-parameters';
import { TimerStartAction, TimerStopAction } from '../actions/render.actions';
import { ModeApi } from '../distortion-modes/mode-api';
import { ModeApiValue } from '../distortion-modes/mode-api-value.enum';

@Component({
  selector: 'pevc-model-settings',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.css']
})
export class ModelSettingsComponent implements AfterViewInit {

  @ViewChild('toggleTime') toggleButton: ElementRef;
  timer$: Observable<boolean>;
  timerActive$: Observable<boolean>;

  constructor( private renderStore: Store<RenderParameters>, private apiStore: Store<ModeApi> ) {
    this.timerActive$ = apiStore.select('modeApi').map((p: ModeApi) => p.time === ModeApiValue.INPUT)
    this.timer$ = this.renderStore.select('render').map((p: RenderParameters) => p.updateTime);
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
