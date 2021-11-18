import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { invalidNamingChars } from '../../internal/data/Constants';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.scss'],
})
export class NewFolderComponent implements OnInit {
  @Output() create = new EventEmitter<string>();

  value = 'New Folder';

  constructor() {}

  ngOnInit(): void {}

  complete(): void {
    this.create.emit(this.value);
  }
}
