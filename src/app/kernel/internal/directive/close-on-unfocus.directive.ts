import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { WindowUtilService } from '../services/window-util.service';

@Directive({
  selector: '[appCloseOnUnfocus]',
})
export class CloseOnUnfocusDirective implements OnDestroy {
  @Output() unFocus: EventEmitter<void> = new EventEmitter<void>();

  @Input() unFocusCondition!: boolean;
  @Input() delay?: number;

  creationDate = Date.now();

  unListen: () => void;

  constructor(
    private readonly element: ElementRef,
    private readonly renderer: Renderer2,
    private readonly windowUtil: WindowUtilService
  ) {
    this.unListen = this.renderer.listen('window', 'click', (e: MouseEvent) => {
      if (this.delay && this.creationDate + this.delay > Date.now()) {
        return;
      }
      if (
        this.unFocusCondition &&
        !this.windowUtil.isTargetIncludingChildren(
          e,
          this.element.nativeElement
        )
      ) {
        this.unFocus.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.unListen();
  }
}
