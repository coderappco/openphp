import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DermatologicaComponent } from './dermatologica.component';

describe('DermatologicaComponent', () => {
  let component: DermatologicaComponent;
  let fixture: ComponentFixture<DermatologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DermatologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DermatologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
