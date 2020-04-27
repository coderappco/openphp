import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsiquiatricaComponent } from './npsiquiatrica.component';

describe('NpsiquiatricaComponent', () => {
  let component: NpsiquiatricaComponent;
  let fixture: ComponentFixture<NpsiquiatricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsiquiatricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsiquiatricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
