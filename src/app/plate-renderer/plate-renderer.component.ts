import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

import { PerspectiveCamera, BoxGeometry } from '@types/three'
import { PlateRenderer } from './plate-renderer';
import { Store } from '@ngrx/store';
import { PlateState } from '../physics-core/plate-state';
import { Observable } from 'rxjs/Observable';
import { PlateService } from '../core/plate.service';
import { RenderParameters } from './render-parameters';

@Component({
  selector: 'pevc-plate-renderer',
  templateUrl: './plate-renderer.component.html',
  styleUrls: ['./plate-renderer.component.css']
})
export class PlateRendererComponent implements OnInit {

  renderer: PlateRenderer;
  plateState$: Observable<PlateState>;
  renderTrigger$: Observable<RenderParameters>;

  constructor(private element: ElementRef,
              private store: Store<PlateState>,
              private plateService: PlateService,
              private renderStore: Store<RenderParameters>
              ) {
    this.renderTrigger$ = renderStore.select('render');
    this.plateState$ = store.select('plate');
  }

  ngOnInit() {
    this.renderer = new PlateRenderer(this.element.nativeElement.parentNode.offsetWidth - 48, this.plateService);
    this.element.nativeElement.append(this.renderer.getDomElement());
    this.renderer.setupScene();
    this.renderer.render();
    this.setupEvents();
  }

  private setupEvents() {
    this.plateState$.subscribe((state: PlateState) => {
      this.plateService.consumeState(state);
      this.renderer.swapGeometry();
      this.renderer.render();
    })
    this.renderTrigger$.subscribe((renderParams: RenderParameters) => {
      if (renderParams.shouldSwapGeometry) {
        this.renderer.swapGeometry();
      }
      this.renderer.render();
    })
  }

  @HostListener('window:resize', ['$event']) onResize(resize) {
    this.renderer.displayResize(this.element.nativeElement.parentNode.offsetWidth - 48)
  }
}
