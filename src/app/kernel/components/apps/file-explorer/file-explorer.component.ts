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
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { DesktopService } from 'src/app/kernel/services/desktop.service';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() props!: App;

  @ViewChild('panel') panel!: ElementRef<HTMLDivElement>;

  style: { [key: string]: string } = {
    width: '800px',
    height: '600px',
    top: '50px',
    left: '100px',
  };

  minWidth = 430;
  minHeight = 200;

  maximized = false;
  memStyle: { [key: string]: string } = {};

  isExpanding = false;
  isToolBarOpen = false;

  expandDir = '';

  subscriptions: Subscription[] = [];

  constructor(
    public readonly theme: ThemeService,
    public readonly renderer: Renderer2,
    public readonly desktop: DesktopService,
    public readonly state: StateService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateStyle();
    this.subscriptions[0] = this.desktop.mouseUpEvent.subscribe((e) => {
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

  mouseDown(e: MouseEvent, expand?: string): void {
    e.preventDefault();
    this.desktop.mouseXPosStart = e.clientX;
    this.desktop.mouseYPosStart = e.clientY;
    this.desktop.isMouseDown = true;
    this.desktop.isMouseFocused = true;
    this.desktop.focusedApp.next(this.props.id);

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
    console.log(e);

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
