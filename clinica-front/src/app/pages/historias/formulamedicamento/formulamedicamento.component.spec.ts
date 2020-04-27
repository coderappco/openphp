import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulamedicamentoComponent } from './formulamedicamento.component';

describe('FormulamedicamentoComponent', () => {
  let component: FormulamedicamentoComponent;
  let fixture: ComponentFixture<FormulamedicamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulamedicamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulamedicamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
