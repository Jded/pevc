import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInputsComponent } from './model-inputs.component';

describe('ModelInputsComponent', () => {
  let component: ModelInputsComponent;
  let fixture: ComponentFixture<ModelInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
