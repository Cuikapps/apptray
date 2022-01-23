import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class DesktopService {
  constructor() {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouseXPosCurrent = e.clientX;
      this.mouseYPosCurrent = e.clientY;
    });
    window.addEventListener('click', (e: MouseEvent) => {
      this.mouseXPosClick = e.clientX;
      this.mouseYPosClick = e.clientY;
      this.isMouseDown = false;
    });
    window.addEventListener('mousedown', (e: MouseEvent) => {
      this.mouseXPosStart = e.clientX;
      this.mouseYPosStart = e.clientY;
      this.isMouseDown = true;
    });
    window.addEventListener('mouseup', (e: MouseEvent) => {
      this.mouseXPosCurrent = e.clientX;
      this.mouseYPosCurrent = e.clientY;
      this.mouseXPosClick = e.clientX;
      this.mouseYPosClick = e.clientY;
      this.mouseUpEvent.next(e);
      this.isMouseDown = false;
    });
  }

  mouseXPosClick = 0;
  mouseYPosClick = 0;
  mouseXPosCurrent = 0;
  mouseYPosCurrent = 0;
  mouseXPosStart = 0;
  mouseYPosStart = 0;
  isMouseDown = false;
  isMouseFocused = false;

  oldFocusedApp = -1;
  focusedApp: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  mouseUpEvent: Subject<MouseEvent> = new Subject<MouseEvent>();

  focusApp(id: number): void {
    this.oldFocusedApp = this.focusedApp.value;
    this.focusedApp.next(id);
  }

  duringFocusChange(): boolean {
    return this.oldFocusedApp !== this.focusedApp.value;
  }
}
