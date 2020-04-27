import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiquiatricaComponent } from './psiquiatrica.component';

describe('PsiquiatricaComponent', () => {
  let component: PsiquiatricaComponent;
  let fixture: ComponentFixture<PsiquiatricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsiquiatricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiquiatricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
