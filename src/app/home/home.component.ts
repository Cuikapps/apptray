import { Component, OnInit } from '@angular/core';
import { AuthService } from '../kernel/internal/services/auth.service';
import { ThemeService } from '../kernel/internal/services/theme.service';
import { ShellService } from '../kernel/services/shell.service';
import { StateService } from '../kernel/services/state.service';

interface AreaStyle {
  top: string;
  left: string;
  right: string;
  bottom: string;
  width: string;
  height: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isOptionsOpen = false;
  isNavMenuOpen = false;
  isSelectAreaOpen = false;

  menuItems: string[] = [];
  menuEvents: (() => void)[] = [() => {}];
  menuLeft = 'unset';

  // Mouse data
  mouseXPosClick = 0;
  mouseYPosClick = 0;
  mouseXPosCurrent = 0;
  mouseYPosCurrent = 0;
  mouseXPosStart = 0;
  mouseYPosStart = 0;
  isMouseDown = false;

  selectAreaStyle: AreaStyle = {
    top: 'unset',
    bottom: 'unset',
    right: 'unset',
    left: 'unset',
    width: '0px',
    height: '0px',
  };

  hovered = false;

  constructor(
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    public readonly state: StateService,
    public readonly shell: ShellService
  ) {}

  ngOnInit(): void {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  clicked(event: MouseEvent): void {
    this.mouseXPosClick = event.clientX;
    this.mouseYPosClick = event.clientY;
    switch (event.button) {
      case 0: {
        this.closeAll();
        break;
      }
      case 2: {
        this.openOptions();
        break;
      }
    }
    // Reset Select area
    this.openSelectArea();
    this.isSelectAreaOpen = false;
    this.isMouseDown = false;
  }

  mouseDown(e: MouseEvent): void {
    this.isMouseDown = true;
    this.mouseXPosStart = e.clientX;
    this.mouseYPosStart = e.clientY;
  }

  mouseMoved(e: MouseEvent): void {
    this.mouseXPosCurrent = e.clientX;
    this.mouseYPosCurrent = e.clientY;

    if (this.isMouseDown) {
      this.openSelectArea();
    }
  }

  openSearchBar(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.state.isSearchOpen.next(true);
  }

  openOptions(): void {
    if (this.hovered === false) {
      this.isOptionsOpen = true;
    }
  }

  closeAll(): void {
    this.state.isSearchOpen.next(false);
    this.isOptionsOpen = false;
  }

  openSelectArea(): void {
    const deltaX = this.mouseXPosCurrent - this.mouseXPosStart;
    const deltaY = this.mouseYPosCurrent - this.mouseYPosStart;

    const quadrant = this.getMovementQuadrant();

    if (quadrant > 0) {
      this.isSelectAreaOpen = true;
    } else {
      this.isSelectAreaOpen = false;
    }

    switch (quadrant) {
      case 1: {
        this.selectAreaStyle.top = 'unset';
        this.selectAreaStyle.right = 'unset';
        this.selectAreaStyle.left = this.mouseXPosStart + 'px';
        this.selectAreaStyle.bottom =
          this.getWindowHeight() - this.mouseYPosStart + 'px';

        this.selectAreaStyle.width = Math.abs(deltaX) + 'px';
        this.selectAreaStyle.height = Math.abs(deltaY) + 'px';
        break;
      }
      case 2: {
        this.selectAreaStyle.top = 'unset';
        this.selectAreaStyle.right =
          this.getWindowWidth() - this.mouseXPosStart + 'px';
        this.selectAreaStyle.left = 'unset';
        this.selectAreaStyle.bottom =
          this.getWindowHeight() - this.mouseYPosStart + 'px';

        this.selectAreaStyle.width = Math.abs(deltaX) + 'px';
        this.selectAreaStyle.height = Math.abs(deltaY) + 'px';
        break;
      }
      case 3: {
        this.selectAreaStyle.top = this.mouseYPosStart + 'px';
        this.selectAreaStyle.right =
          this.getWindowWidth() - this.mouseXPosStart + 'px';
        this.selectAreaStyle.left = 'unset';
        this.selectAreaStyle.bottom = 'unset';

        this.selectAreaStyle.width = Math.abs(deltaX) + 'px';
        this.selectAreaStyle.height = Math.abs(deltaY) + 'px';
        break;
      }
      case 4: {
        this.selectAreaStyle.top = this.mouseYPosStart + 'px';
        this.selectAreaStyle.right = 'unset';
        this.selectAreaStyle.left = this.mouseXPosStart + 'px';
        this.selectAreaStyle.bottom = 'unset';

        this.selectAreaStyle.width = Math.abs(deltaX) + 'px';
        this.selectAreaStyle.height = Math.abs(deltaY) + 'px';
        break;
      }
      default: {
        this.selectAreaStyle.top = 'unset';
        this.selectAreaStyle.right = 'unset';
        this.selectAreaStyle.left = 'unset';
        this.selectAreaStyle.bottom = 'unset';

        this.selectAreaStyle.width = '0px';
        this.selectAreaStyle.height = '0px';
        break;
      }
    }
  }

  getMovementQuadrant(): number {
    // If Increase in X direction and Decrease in Y direction
    if (
      this.mouseXPosCurrent > this.mouseXPosStart &&
      this.mouseYPosCurrent < this.mouseYPosStart
    ) {
      return 1;
    }
    // If  Decrease in XY direction
    if (
      this.mouseXPosCurrent < this.mouseXPosStart &&
      this.mouseYPosCurrent < this.mouseYPosStart
    ) {
      return 2;
    }
    // If Decrease in X direction and Increase in Y direction
    if (
      this.mouseXPosCurrent < this.mouseXPosStart &&
      this.mouseYPosCurrent > this.mouseYPosStart
    ) {
      return 3;
    }
    // If Increase in XY direction
    if (
      this.mouseXPosCurrent > this.mouseXPosStart &&
      this.mouseYPosCurrent > this.mouseYPosStart
    ) {
      return 4;
    }
    return 0;
  }

  getWindowWidth(): number {
    return window.innerWidth;
  }
  getWindowHeight(): number {
    return window.innerHeight;
  }

  openNavMenu(type: string): void {
    switch (type) {
      case 'settings': {
        const left = '15px';
        this.isNavMenuOpen = !(this.menuLeft === left && this.isNavMenuOpen);
        this.menuLeft = this.menuLeft === left ? 'unset' : left;
        this.menuItems = ['Search Engine', 'Email'];
        this.menuEvents = [
          () => {
            this.shell.run(['settings --open="true"']);
          },
          () => {
            this.shell.run(['settings --open="true"']);
          },
        ];
        break;
      }
      case 'store': {
        const left = '60px';
        this.isNavMenuOpen = !(this.menuLeft === left && this.isNavMenuOpen);
        this.menuLeft = this.menuLeft === left ? 'unset' : left;
        this.menuItems = ['Open', 'Downloaded', 'Your Apps'];
        this.menuEvents = [
          () => {
            this.shell.run(['store --open="true"']);
          },
          () => {
            this.shell.run(['store --open="true"']);
          },
          () => {
            this.shell.run(['store --open="true"']);
          },
        ];
        break;
      }
      case 'help': {
        const left = '95px';
        this.isNavMenuOpen = !(this.menuLeft === left && this.isNavMenuOpen);
        this.menuLeft = this.menuLeft === left ? 'unset' : left;
        this.menuItems = ['Documentation', 'Support'];
        break;
      }
      case 'user': {
        const left = 'calc(50vw - 60px)';
        this.isNavMenuOpen = !(this.menuLeft === left && this.isNavMenuOpen);
        this.menuLeft = this.menuLeft === left ? 'unset' : left;
        this.menuItems = ['Documentation', 'Support'];
        this.menuEvents = [
          () => {
            this.shell.run(['help --open="true"']);
          },
          () => {
            this.shell.run(['help --open="true"']);
          },
        ];
        break;
      }
    }
  }
}
