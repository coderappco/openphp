import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JovenpypComponent } from './jovenpyp.component';

describe('JovenpypComponent', () => {
  let component: JovenpypComponent;
  let fixture: ComponentFixture<JovenpypComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JovenpypComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JovenpypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
