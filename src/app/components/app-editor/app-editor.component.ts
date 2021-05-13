import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-app-editor',
  templateUrl: './app-editor.component.html',
  styleUrls: ['./app-editor.component.scss'],
})
export class AppEditorComponent implements OnInit {
  constructor(public state: StateService) {}

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}
}
