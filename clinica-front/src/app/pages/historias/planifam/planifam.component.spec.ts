import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanifamComponent } from './planifam.component';

describe('PlanifamComponent', () => {
  let component: PlanifamComponent;
  let fixture: ComponentFixture<PlanifamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanifamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanifamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
