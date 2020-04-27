import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoexamenComponent } from './pedidoexamen.component';

describe('PedidoexamenComponent', () => {
  let component: PedidoexamenComponent;
  let fixture: ComponentFixture<PedidoexamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoexamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoexamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
