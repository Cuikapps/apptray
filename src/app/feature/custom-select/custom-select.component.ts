import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cuik-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  constructor() {}

  @Input() values!: string[];
  @Input() default!: number;

  @Output() update: EventEmitter<string> = new EventEmitter<string>();

  selectedValue!: string;
  open = false;

  ngOnInit(): void {
    if (this.values) {
      this.selectedValue = this.values[this.default];
    }
  }

  select(v: string): void {
    this.selectedValue = v;
    this.update.emit(this.selectedValue);
    this.toggleSelect();
  }

  toggleSelect(): void {
    this.open = !this.open;
  }
}
