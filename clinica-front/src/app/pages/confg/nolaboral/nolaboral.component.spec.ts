import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NolaboralComponent } from './nolaboral.component';

describe('NolaboralComponent', () => {
  let component: NolaboralComponent;
  let fixture: ComponentFixture<NolaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NolaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NolaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
