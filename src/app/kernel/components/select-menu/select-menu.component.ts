import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
})
export class SelectMenuComponent implements OnInit {
  @Input() default!: number;
  @Input() options!: string[];

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  isOpen = false;

  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.container.nativeElement &&
        !this.container.nativeElement.contains(e.target as Node)
      ) {
        this.isOpen = false;
      }
    });
  }

  ngOnInit(): void {}
}
