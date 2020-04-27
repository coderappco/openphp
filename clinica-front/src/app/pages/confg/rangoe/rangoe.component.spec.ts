import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangoeComponent } from './rangoe.component';

describe('RangoeComponent', () => {
  let component: RangoeComponent;
  let fixture: ComponentFixture<RangoeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangoeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
