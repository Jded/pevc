import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'pevc-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit {

  @ViewChild('plotterCanvas') plotterCanvas: ElementRef;
  constructor() { }

  ngOnInit() {
  }

}
