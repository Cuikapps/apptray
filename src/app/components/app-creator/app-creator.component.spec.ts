import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreatorComponent } from './app-creator.component';

describe('AppCreatorComponent', () => {
  let component: AppCreatorComponent;
  let fixture: ComponentFixture<AppCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
