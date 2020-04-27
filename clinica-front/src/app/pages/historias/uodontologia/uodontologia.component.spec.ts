import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UodontologiaComponent } from './uodontologia.component';

describe('UodontologiaComponent', () => {
  let component: UodontologiaComponent;
  let fixture: ComponentFixture<UodontologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UodontologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UodontologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
