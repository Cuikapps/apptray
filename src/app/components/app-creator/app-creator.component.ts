import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cuik-app-creator',
  templateUrl: './app-creator.component.html',
  styleUrls: ['./app-creator.component.scss'],
})
export class AppCreatorComponent implements OnInit {
  constructor() {}

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}
}
