import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalaabComponent } from './escalaab.component';

describe('EscalaabComponent', () => {
  let component: EscalaabComponent;
  let fixture: ComponentFixture<EscalaabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalaabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalaabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
