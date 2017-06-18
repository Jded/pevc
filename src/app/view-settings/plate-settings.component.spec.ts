import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateSettingsComponent } from './plate-settings.component';

describe('PlateSettingsComponent', () => {
  let component: PlateSettingsComponent;
  let fixture: ComponentFixture<PlateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlateSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
