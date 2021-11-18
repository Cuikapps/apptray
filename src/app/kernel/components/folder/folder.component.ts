import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FolderNode } from '../../interface/nodes';
import { Names } from '../apps/file-explorer/types';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
})
export class FolderComponent implements OnInit, AfterContentInit {
  @Input() props!: FolderNode;
  @Input() selected!: boolean;
  @Input() rename!: boolean;

  newName = '';

  @Output() openFolder: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectFolder: EventEmitter<string> = new EventEmitter<string>();
  @Output() renameFolder: EventEmitter<Names> = new EventEmitter<Names>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.newName = this.props.folderName;
  }
}
