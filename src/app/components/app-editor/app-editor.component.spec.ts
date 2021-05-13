import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditorComponent } from './app-editor.component';

describe('AppEditorComponent', () => {
  let component: AppEditorComponent;
  let fixture: ComponentFixture<AppEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
