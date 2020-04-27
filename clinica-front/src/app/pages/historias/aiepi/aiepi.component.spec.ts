import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiepiComponent } from './aiepi.component';

describe('AiepiComponent', () => {
  let component: AiepiComponent;
  let fixture: ComponentFixture<AiepiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiepiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiepiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
