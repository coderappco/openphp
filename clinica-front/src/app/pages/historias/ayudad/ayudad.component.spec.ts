import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudadComponent } from './ayudad.component';

describe('AyudadComponent', () => {
  let component: AyudadComponent;
  let fixture: ComponentFixture<AyudadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AyudadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
