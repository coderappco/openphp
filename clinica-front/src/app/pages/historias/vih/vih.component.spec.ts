import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VihComponent } from './vih.component';

describe('VihComponent', () => {
  let component: VihComponent;
  let fixture: ComponentFixture<VihComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VihComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VihComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
