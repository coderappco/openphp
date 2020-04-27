import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaexComponent } from './consultaex.component';

describe('ConsultaexComponent', () => {
  let component: ConsultaexComponent;
  let fixture: ComponentFixture<ConsultaexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
