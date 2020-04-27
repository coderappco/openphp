import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Aiepi2mComponent } from './aiepi2m.component';

describe('Aiepi2mComponent', () => {
  let component: Aiepi2mComponent;
  let fixture: ComponentFixture<Aiepi2mComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Aiepi2mComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Aiepi2mComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
