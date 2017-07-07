import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModeFactoryService } from '../core/mode-factory.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MaterialManagerService } from '../core/material-manager.service';
import { RenderParameters } from '../plate-renderer/render-parameters';
import { TimerStartAction, TimerStopAction } from '../actions/render.actions';

@Component({
  selector: 'pevc-model-settings',
  providers: [ModeFactoryService, MaterialManagerService],
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.css']
})
export class ModelSettingsComponent implements AfterViewInit {

  @ViewChild('toggleTime') toggleButton: ElementRef;
  timer$: Observable<boolean>;

  constructor( private renderStore: Store<RenderParameters> ) {
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
