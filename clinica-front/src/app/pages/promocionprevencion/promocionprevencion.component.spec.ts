import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionprevencionComponent } from './promocionprevencion.component';

describe('PromocionprevencionComponent', () => {
  let component: PromocionprevencionComponent;
  let fixture: ComponentFixture<PromocionprevencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocionprevencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionprevencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
