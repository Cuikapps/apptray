import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { App } from 'src/app/kernel/interface/app';
import { FileNode, FolderNode } from 'src/app/kernel/interface/nodes';
import { FileService } from 'src/app/kernel/internal/services/file.service';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { WindowUtilService } from 'src/app/kernel/internal/services/window-util.service';
import { DesktopService } from 'src/app/kernel/services/desktop.service';
import { StateService } from 'src/app/kernel/services/state.service';
import { Names, Targets } from './types';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() props!: App;

  @ViewChild('panel') panel!: ElementRef<HTMLDivElement>;
  @ViewChild('nameCreator') nameCreator!: ElementRef<HTMLDivElement>;

  style: { [key: string]: string } = {
    width: '800px',
    height: '600px',
    top: window.innerHeight / 2 - 300 + 'px',
    left: window.innerWidth / 2 - 400 + 'px',
    borderRadius: '10px',
  };

  minWidth = 430;
  minHeight = 200;

  maximized = false;
  memStyle: { [key: string]: string } = {};

  isExpanding = false;
  isToolBarOpen = false;
  isOptionsOpen = false;
  isNewFolderOpen = false;
  isUploadOpen = false;
  isUploading = false;

  expandDir = '';
  optionsType: Targets = 'none';
  renamingName = '';

  drives: string[] = [];

  currentFolders: FolderNode[] = [];
  currentFiles: FileNode[] = [];

  selectedNames: string[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    public readonly theme: ThemeService,
    public readonly renderer: Renderer2,
    public readonly desktop: DesktopService,
    public readonly state: StateService,
    public readonly file: FileService,
    public readonly windowUtil: WindowUtilService
  ) {}

  ngOnInit(): void {
    this.subscriptions[1] = this.file.fileTree.subscribe((folders) => {
      // Update the drives list
      this.drives = folders.folders.map((folder) => folder.folderName);

      const modPath = this.props.path?.split('/').filter((p) => p !== '');

      // Update Current files and folders
      this.currentFolders = this.gotoPath(folders, modPath ?? []).folders;
      this.currentFiles = this.gotoPath(folders, modPath ?? []).files;
    });
  }

  ngAfterViewInit(): void {
    this.updateStyle();
    this.subscriptions[0] = this.desktop.mouseUpEvent.subscribe((e) => {
      if (this.desktop.duringFocusChange()) {
        return;
      }

      this.moveStart(e);
      if (this.isExpanding) {
        switch (this.expandDir) {
          case 'r': {
            this.expandRight(e);
            break;
          }
          case 'd': {
            this.expandDown(e);
            break;
          }
          case 'b': {
            this.expandBoth(e);
            break;
          }
        }
      }
    });
  }

  openOptions(e: MouseEvent, target: Targets): void {
    this.desktop.mouseXPosClick = e.clientX;
    this.desktop.mouseYPosClick = e.clientY;
    this.optionsType = target;
    this.isOptionsOpen = true;
  }

  open(): void {
    if (this.optionsType === 'folder') {
      this.goto(this.props.path + this.selectedNames[0]);
    }
  }

  async newFolder(name: string): Promise<void> {
    await this.file.createFolder(this.props.path ?? '', name);
  }

  async renameFolder(names: Names): Promise<void> {
    await this.file.renameFolder(
      this.props.path ?? '',
      names.oldName,
      names.newName
    );
    this.renamingName = '';
  }

  async renameFile(names: Names): Promise<void> {
    await this.file.renameFile(
      this.props.path ?? '',
      names.oldName,
      names.newName
    );
    this.renamingName = '';
  }

  async downloadSelected(): Promise<void> {
    await this.file.downloadFiles(this.props.path ?? '', this.selectedNames);

    this.selectedNames = [];
  }

  async upload(input: HTMLInputElement): Promise<void> {
    if (input.files) {
      this.isUploading = true;

      // FileList does not have an iterator for a 'for of' loop
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < input.files?.length; i++) {
        await this.file.uploadFile(input.files[i], this.props.path ?? '');
      }
      this.isUploading = false;
    }
  }

  async deleteSelected(): Promise<void> {
    for (const name of this.selectedNames) {
      if (name.endsWith('/')) {
        await this.file.deleteFolder(this.props.path ?? '', name);
      } else {
        await this.file.deleteFile(this.props.path ?? '', name);
      }
    }

    this.selectedNames = [];
  }

  rename(): void {
    this.renamingName = this.selectedNames[0];
  }

  select(name: string): void {
    if (!this.selectedNames.includes(name)) {
      this.selectedNames.push(name);
    } else {
      this.selectedNames = this.selectedNames.filter((n) => n !== name);
    }
  }

  rightClickOn(name: string): void {
    if (this.props.path !== '') {
      if (!this.selectedNames.includes(name)) {
        this.selectedNames = [name];
      }
    }
  }

  gotoPath(folder: FolderNode, path: string[]): FolderNode {
    // If nested at the correct path then return that folder
    if (path.length === 1) {
      for (const nestedFolder of folder.folders) {
        if (nestedFolder.folderName === path[0]) {
          return nestedFolder;
        }
      }
    }

    if (path.length > 1) {
      for (let nestedFolder of folder.folders) {
        if (nestedFolder.folderName === path[0]) {
          path.shift();

          nestedFolder = this.gotoPath(nestedFolder, path);

          return nestedFolder;
        }
      }
    }

    return folder;
  }

  goto(path: string): void {
    if (path === '/') {
      path = '';
    }

    const updatedApp = { ...this.props };
    updatedApp.path = path;
    updatedApp.title = `File Explorer | ${path}`;

    this.state.updateApp(this.props.id, updatedApp);

    const modPath = path.split('/').filter((p) => p !== '');

    const newTree = this.gotoPath(this.file.fileTree.value, modPath ?? []);

    // Update Current files and folders
    this.currentFolders = newTree.folders;
    this.currentFiles = newTree.files;

    this.selectedNames = [];
  }

  closeAll(): void {
    this.selectedNames = [];
  }

  mouseDown(e: MouseEvent, expand?: string): void {
    e.preventDefault();
    this.desktop.mouseXPosStart = e.clientX;
    this.desktop.mouseYPosStart = e.clientY;
    this.desktop.isMouseDown = true;
    this.desktop.isMouseFocused = true;
    this.desktop.focusApp(this.props.id);

    if (expand) {
      this.expandDir = expand;
      this.isExpanding = true;
    }
  }

  moveStart(e: MouseEvent): void {
    this.desktop.mouseXPosClick = e.clientX;
    this.desktop.mouseYPosClick = e.clientY;

    const deltaX = this.desktop.mouseXPosClick - this.desktop.mouseXPosStart;
    const deltaY = this.desktop.mouseYPosClick - this.desktop.mouseYPosStart;

    const currentLeft = parseFloat(
      this.style.left.substring(0, this.style.left.length - 2)
    );
    const currentTop = parseFloat(
      this.style.top.substring(0, this.style.top.length - 2)
    );

    if (
      this.desktop.isMouseDown &&
      this.desktop.isMouseFocused &&
      this.desktop.focusedApp.value === this.props.id &&
      !this.maximized &&
      !this.isExpanding
    ) {
      if (deltaX !== 0) {
        this.style.left = `${currentLeft + deltaX}px`;
      }
      if (deltaY !== 0) {
        this.style.top = `${currentTop + deltaY}px`;
      }
    }

    this.updateStyle();
  }

  expandRight(e: MouseEvent): void {
    this.desktop.mouseXPosClick = e.clientX;

    const deltaX = this.desktop.mouseXPosClick - this.desktop.mouseXPosStart;

    const currentWidth = parseFloat(
      this.style.width.substring(0, this.style.width.length - 2)
    );

    if (
      this.desktop.isMouseDown &&
      this.desktop.isMouseFocused &&
      this.desktop.focusedApp.value === this.props.id &&
      !this.maximized &&
      this.isExpanding
    ) {
      if (deltaX !== 0) {
        if (currentWidth + deltaX > this.minWidth) {
          this.style.width = `${currentWidth + deltaX}px`;
        } else {
          this.style.width = `${this.minWidth}px`;
        }
      }
    }
    this.isExpanding = false;
    this.updateStyle();
  }

  expandDown(e: MouseEvent): void {
    this.desktop.mouseYPosClick = e.clientY;

    const deltaY = this.desktop.mouseYPosClick - this.desktop.mouseYPosStart;

    const currentHeight = parseFloat(
      this.style.height.substring(0, this.style.height.length - 2)
    );

    if (
      this.desktop.isMouseDown &&
      this.desktop.isMouseFocused &&
      this.desktop.focusedApp.value === this.props.id &&
      !this.maximized &&
      this.isExpanding
    ) {
      if (deltaY !== 0) {
        if (currentHeight + deltaY > this.minHeight) {
          this.style.height = `${currentHeight + deltaY}px`;
        } else {
          this.style.height = `${this.minHeight}px`;
        }
      }
    }
    this.isExpanding = false;
    this.updateStyle();
  }

  expandBoth(e: MouseEvent): void {
    this.desktop.mouseXPosClick = e.clientX;
    this.desktop.mouseYPosClick = e.clientY;

    const deltaX = this.desktop.mouseXPosClick - this.desktop.mouseXPosStart;
    const deltaY = this.desktop.mouseYPosClick - this.desktop.mouseYPosStart;

    const currentWidth = parseFloat(
      this.style.width.substring(0, this.style.width.length - 2)
    );
    const currentHeight = parseFloat(
      this.style.height.substring(0, this.style.height.length - 2)
    );

    if (
      this.desktop.isMouseDown &&
      this.desktop.isMouseFocused &&
      this.desktop.focusedApp.value === this.props.id &&
      !this.maximized &&
      this.isExpanding
    ) {
      if (deltaX !== 0) {
        if (currentWidth + deltaX > this.minWidth) {
          this.style.width = `${currentWidth + deltaX}px`;
        } else {
          this.style.width = `${this.minWidth}px`;
        }
      }
      if (deltaY !== 0) {
        if (currentHeight + deltaY > this.minHeight) {
          this.style.height = `${currentHeight + deltaY}px`;
        } else {
          this.style.height = `${this.minHeight}px`;
        }
      }
    }
    this.isExpanding = false;
    this.updateStyle();
  }

  updateStyle(): void {
    for (const prop in this.style) {
      if (this.style[prop]) {
        this.renderer.setStyle(
          this.panel.nativeElement,
          prop,
          this.style[prop]
        );
      }
    }
  }

  maximize(): void {
    if (this.maximized) {
      this.style = { ...this.memStyle };
    } else {
      this.memStyle = { ...this.style };
      this.style.width = `${window.innerWidth}px`;
      this.style.height = `${window.innerHeight}px`;
      this.style.borderRadius = '0px';
      this.style.top = '0px';
      this.style.left = '0px';
    }
    this.updateStyle();
    this.maximized = !this.maximized;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
