import { Component, OnInit } from '@angular/core';
import { RenderParameters } from '../../plate-renderer/render-parameters';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pevc-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.css']
})
export class TimeDisplayComponent implements OnInit {

  renderStatus$: Observable<RenderParameters>

  constructor(private renderStore$: Store<RenderParameters>) {
    this.renderStatus$ = this.renderStore$.select('render');
  }

  ngOnInit() {
  }
}
