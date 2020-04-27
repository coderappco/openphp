import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CydaintegralComponent } from './cydaintegral.component';

describe('CydaintegralComponent', () => {
  let component: CydaintegralComponent;
  let fixture: ComponentFixture<CydaintegralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CydaintegralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CydaintegralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
