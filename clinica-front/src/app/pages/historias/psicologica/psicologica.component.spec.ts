import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsicologicaComponent } from './psicologica.component';

describe('PsicologicaComponent', () => {
  let component: PsicologicaComponent;
  let fixture: ComponentFixture<PsicologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsicologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsicologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
