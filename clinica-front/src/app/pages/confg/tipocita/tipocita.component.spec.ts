import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocitaComponent } from './tipocita.component';

describe('TipocitaComponent', () => {
  let component: TipocitaComponent;
  let fixture: ComponentFixture<TipocitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
