import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Consulta1vezComponent } from './consulta1vez.component';

describe('Consulta1vezComponent', () => {
  let component: Consulta1vezComponent;
  let fixture: ComponentFixture<Consulta1vezComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Consulta1vezComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Consulta1vezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
