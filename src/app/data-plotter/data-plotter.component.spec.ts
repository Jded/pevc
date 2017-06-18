import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPlotterComponent } from './data-plotter.component';

describe('DataPlotterComponent', () => {
  let component: DataPlotterComponent;
  let fixture: ComponentFixture<DataPlotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPlotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
