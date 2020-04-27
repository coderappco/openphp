import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesurgComponent } from './ordenesurg.component';

describe('OrdenesurgComponent', () => {
  let component: OrdenesurgComponent;
  let fixture: ComponentFixture<OrdenesurgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesurgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesurgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
