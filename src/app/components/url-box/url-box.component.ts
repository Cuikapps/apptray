import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cuik-url-box',
  templateUrl: './url-box.component.html',
  styleUrls: ['./url-box.component.scss'],
})
export class UrlBoxComponent implements OnInit {
  constructor() {}

  @Input() presetUrls: string[] = [];

  // This is triggered every time keyup on inputs, Then Emits the value to parent.
  @Output() urlsEvent: EventEmitter<string[]> = new EventEmitter<string[]>();

  // The inputLength is just there to act as an array for the *ngFor, this is because if
  // urls array was used the inputs would be rendered on every update.
  inputLength: number[] = [0];
  urls: string[] = this.presetUrls.length > 0 ? this.presetUrls : [''];

  ngOnInit(): void {
    this.urls = this.presetUrls.length > 0 ? this.presetUrls : [''];
    if (this.presetUrls.length > 0) {
      for (const index of this.presetUrls) {
        if (this.presetUrls.indexOf(index) > 1) {
          this.inputLength.push(0);
        }
      }
    }
  }

  addUrl(): void {
    this.urls.push('');
    this.inputLength.push(0);
  }

  removeUrl(): void {
    if (this.urls.length > 1) {
      this.urls.pop();
      this.inputLength.pop();
    }
  }

  inputUpdate(): void {
    this.urlsEvent.emit(this.urls);
  }
}
