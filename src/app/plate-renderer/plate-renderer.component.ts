import { Component, ElementRef, OnInit } from '@angular/core';

import { PerspectiveCamera, BoxGeometry } from '@types/three'
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';
import { PlateRenderer } from './plate-renderer';

@Component({
  selector: 'pevc-plate-renderer',
  templateUrl: './plate-renderer.component.html',
  styleUrls: ['./plate-renderer.component.css']
})
export class PlateRendererComponent implements OnInit {

  plateModel: PlateDistortionModel;
  renderer: PlateRenderer;

  constructor(private element: ElementRef) {
    this.plateModel = new PlateDistortionModel(Date.now());

  }

  ngOnInit() {
    this.renderer = new PlateRenderer(this.element.nativeElement.parentNode.offsetWidth - 48, this.plateModel);
    this.element.nativeElement.append(this.renderer.getDomElement());
    this.renderer.setupScene();
    this.renderer.render();
  }

}
