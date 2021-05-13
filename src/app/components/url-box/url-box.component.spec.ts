import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlBoxComponent } from './url-box.component';

describe('UrlBoxComponent', () => {
  let component: UrlBoxComponent;
  let fixture: ComponentFixture<UrlBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
