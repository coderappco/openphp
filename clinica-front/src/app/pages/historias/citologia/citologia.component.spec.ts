import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitologiaComponent } from './citologia.component';

describe('CitologiaComponent', () => {
  let component: CitologiaComponent;
  let fixture: ComponentFixture<CitologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
