import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentinfComponent } from './concentinf.component';

describe('ConcentinfComponent', () => {
  let component: ConcentinfComponent;
  let fixture: ComponentFixture<ConcentinfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcentinfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentinfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
