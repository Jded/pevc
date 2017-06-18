import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSettingsComponent } from './model-settings.component';

describe('ModelSettingsComponent', () => {
  let component: ModelSettingsComponent;
  let fixture: ComponentFixture<ModelSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
