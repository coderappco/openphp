import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NenfermeriaComponent } from './nenfermeria.component';

describe('NenfermeriaComponent', () => {
  let component: NenfermeriaComponent;
  let fixture: ComponentFixture<NenfermeriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NenfermeriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NenfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
