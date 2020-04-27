import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesmedicasComponent } from './ordenesmedicas.component';

describe('OrdenesmedicasComponent', () => {
  let component: OrdenesmedicasComponent;
  let fixture: ComponentFixture<OrdenesmedicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesmedicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesmedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
