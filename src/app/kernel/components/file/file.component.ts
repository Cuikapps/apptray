import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FileNode } from '../../interface/nodes';
import { Names } from '../apps/file-explorer/types';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit, AfterContentInit {
  @Input() props!: FileNode;
  @Input() selected!: boolean;
  @Input() rename!: boolean;

  newName = '';

  @Output() openFile: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectFile: EventEmitter<string> = new EventEmitter<string>();
  @Output() renameFile: EventEmitter<Names> = new EventEmitter<Names>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.newName = this.props.fileName;
  }
}
