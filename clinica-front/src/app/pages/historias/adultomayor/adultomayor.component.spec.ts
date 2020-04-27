import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdultomayorComponent } from './adultomayor.component';

describe('AdultomayorComponent', () => {
  let component: AdultomayorComponent;
  let fixture: ComponentFixture<AdultomayorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdultomayorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdultomayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
