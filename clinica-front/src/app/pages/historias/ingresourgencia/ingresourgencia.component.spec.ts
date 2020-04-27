import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresourgenciaComponent } from './ingresourgencia.component';

describe('IngresourgenciaComponent', () => {
  let component: IngresourgenciaComponent;
  let fixture: ComponentFixture<IngresourgenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresourgenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresourgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
