import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetarioComponent } from './recetario.component';

describe('RecetarioComponent', () => {
  let component: RecetarioComponent;
  let fixture: ComponentFixture<RecetarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecetarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecetarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
