import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RenderParameters } from '../../plate-renderer/render-parameters';
import { SmoothieChart, TimeSeries } from 'smoothie'
import { colorGenerator } from './color-generator';

@Component({
  selector: 'pevc-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements AfterViewInit {

  @ViewChild('plotterCanvas') plotterCanvas: ElementRef;
  @Input() tensorStream$: Observable<object>;
  @Input() scalarStream$: Observable<object>;
  renderStatus$: Observable<RenderParameters>
  chart: SmoothieChart
  activeTimeSeries = {};
  isRendering = false;
  colorIndex = 0;

  constructor(
    private element: ElementRef,
    private renderStore$: Store<RenderParameters>
  ) {
    this.renderStatus$ = this.renderStore$.select('render');

  }

  renderParameterChange(status: RenderParameters) {
    if (!this.isRendering && status.updateTime) {
      console.log('start')
      this.chart.start();
      this.isRendering = true;
    }
    if (this.isRendering && !status.updateTime) {
      console.log('stop')
      this.chart.stop();
      this.isRendering = false;
    }
  }

  ngAfterViewInit(): void {
    this.renderChart();
    this.scalarStream$
      .subscribe((data) => this.updateChart(data))
    this.canvasResize();
  }


  updateChart(data) {
    const lookup = {};
    const time = Date.now();
    for (const el of data) {
      lookup[el.name] = true;
      if (!this.activeTimeSeries[el.name]) {
        const ts = new TimeSeries();
        this.activeTimeSeries[el.name] = ts;
        this.chart.addTimeSeries(ts, {lineWidth: 0.8, strokeStyle: colorGenerator(10, this.colorIndex++)});
      }
      this.activeTimeSeries[el.name].append(time, el.value);
    }
  }

  renderChart() {
    function YRangeFunction(a) {
      return { max: a.max + 1, min: a.min - 1 };
    }
    this.chart = new SmoothieChart({
      millisPerPixel: 20,
      grid: { fillStyle: '#ffffff', strokeStyle: 'rgba(119,119,119,0.17)', verticalSections: 5 },
      labels: { fillStyle: '#000000' }
    });
    this.chart.streamTo(this.plotterCanvas.nativeElement, 1000);
    this.chart.stop();
    this.renderStatus$.subscribe((status: RenderParameters) => this.renderParameterChange(status))
  }

  @HostListener('window:resize', ['$event']) canvasResize() {
    const width = this.element.nativeElement.parentNode.offsetWidth;
    this.plotterCanvas.nativeElement.setAttribute('width', width );
    this.plotterCanvas.nativeElement.setAttribute('height', width / 2);
  }
}
