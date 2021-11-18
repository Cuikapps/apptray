import { Injectable } from '@angular/core';

@Injectable()
export class WindowUtilService {
  constructor() {}

  isTarget(e: MouseEvent, self: Element): boolean {
    return e.target === self ? true : false;
  }

  isTargetIncludingChildren(e: MouseEvent, self: Element): boolean {
    return e.target === self || self.contains(e.target as Node);
  }
}
