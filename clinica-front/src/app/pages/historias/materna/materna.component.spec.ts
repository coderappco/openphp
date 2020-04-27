import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaternaComponent } from './materna.component';

describe('MaternaComponent', () => {
  let component: MaternaComponent;
  let fixture: ComponentFixture<MaternaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaternaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
