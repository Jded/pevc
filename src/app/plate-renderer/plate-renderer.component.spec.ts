import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateRendererComponent } from './plate-renderer.component';

describe('PlateRendererComponent', () => {
  let component: PlateRendererComponent;
  let fixture: ComponentFixture<PlateRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlateRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
