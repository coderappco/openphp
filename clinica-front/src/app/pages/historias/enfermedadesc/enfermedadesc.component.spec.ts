import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermedadescComponent } from './enfermedadesc.component';

describe('EnfermedadescComponent', () => {
  let component: EnfermedadescComponent;
  let fixture: ComponentFixture<EnfermedadescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnfermedadescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnfermedadescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
