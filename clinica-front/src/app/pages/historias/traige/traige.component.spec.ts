import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraigeComponent } from './traige.component';

describe('TraigeComponent', () => {
  let component: TraigeComponent;
  let fixture: ComponentFixture<TraigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
