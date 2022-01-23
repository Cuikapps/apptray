import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/kernel/internal/services/file.service';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss'],
})
export class TransferListComponent implements OnInit {
  isListOpen = true;

  constructor(public readonly file: FileService) {}

  ngOnInit(): void {}
}
