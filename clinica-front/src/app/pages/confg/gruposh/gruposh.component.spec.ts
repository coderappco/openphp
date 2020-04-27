import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposhComponent } from './gruposh.component';

describe('GruposhComponent', () => {
  let component: GruposhComponent;
  let fixture: ComponentFixture<GruposhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
