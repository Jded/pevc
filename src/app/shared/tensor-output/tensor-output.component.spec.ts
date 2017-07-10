import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorOutputComponent } from './tensor-output.component';

describe('TensorOutputComponent', () => {
  let component: TensorOutputComponent;
  let fixture: ComponentFixture<TensorOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TensorOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TensorOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
