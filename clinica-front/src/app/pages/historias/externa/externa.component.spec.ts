import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternaComponent } from './externa.component';

describe('ExternaComponent', () => {
  let component: ExternaComponent;
  let fixture: ComponentFixture<ExternaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
