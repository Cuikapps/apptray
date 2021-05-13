import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[cuikToolTip]',
})
export class ToolTipDirective {
  tooltip!: HTMLElement;
  @Input('tooltip') tooltipTitle!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseover') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseout') onMouseLeave() {
    this.renderer.removeChild(this.el.nativeElement, this.tooltip);
    // on mouse over it will remove the tooltip element
  }

  showTooltip() {
    this.tooltip = this.renderer.createElement('span');
    // creating a span

    this.tooltip.innerHTML = this.tooltipTitle;

    this.renderer.appendChild(this.el.nativeElement, this.tooltip);
    // appending to the document
    this.renderer.addClass(this.tooltip, 'tooltip');
    // adding the tooltip styles
  }
}
