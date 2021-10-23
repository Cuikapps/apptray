import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerToolBarComponent } from './file-explorer-tool-bar.component';

describe('FileExplorerToolBarComponent', () => {
  let component: FileExplorerToolBarComponent;
  let fixture: ComponentFixture<FileExplorerToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileExplorerToolBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExplorerToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
