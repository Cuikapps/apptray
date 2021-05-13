import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuikInputComponent } from './cuik-input.component';

describe('CuikInputComponent', () => {
  let component: CuikInputComponent;
  let fixture: ComponentFixture<CuikInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuikInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuikInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
