import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucionmedComponent } from './evolucionmed.component';

describe('EvolucionmedComponent', () => {
  let component: EvolucionmedComponent;
  let fixture: ComponentFixture<EvolucionmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolucionmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
