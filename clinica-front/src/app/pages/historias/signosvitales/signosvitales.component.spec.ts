import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosvitalesComponent } from './signosvitales.component';

describe('SignosvitalesComponent', () => {
  let component: SignosvitalesComponent;
  let fixture: ComponentFixture<SignosvitalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignosvitalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignosvitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
