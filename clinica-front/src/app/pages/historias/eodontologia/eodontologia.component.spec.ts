import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EodontologiaComponent } from './eodontologia.component';

describe('EodontologiaComponent', () => {
  let component: EodontologiaComponent;
  let fixture: ComponentFixture<EodontologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EodontologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EodontologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
