import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cuik-input',
  templateUrl: './cuik-input.component.html',
  styleUrls: ['./cuik-input.component.scss'],
})
export class CuikInputComponent implements OnInit {
  constructor() {}

  @Input() type!: string;
  @Input() placeHolder!: string;
  @Input() toolTip!: string;

  @Output() cuikKeyup: EventEmitter<string> = new EventEmitter<string>();

  toolTipToggle: boolean = false;

  ngOnInit(): void {}
}
