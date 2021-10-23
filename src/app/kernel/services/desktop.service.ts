import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class DesktopService {
  constructor() {}

  mouseXPosClick = 0;
  mouseYPosClick = 0;
  mouseXPosCurrent = 0;
  mouseYPosCurrent = 0;
  mouseXPosStart = 0;
  mouseYPosStart = 0;
  isMouseDown = false;
  isMouseFocused = false;

  focusedApp: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  mouseUpEvent: Subject<MouseEvent> = new Subject<MouseEvent>();

  mouseUp(event: MouseEvent): void {
    this.mouseUpEvent.next(event);
  }
}
