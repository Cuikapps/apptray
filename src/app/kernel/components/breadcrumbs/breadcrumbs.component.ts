import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() path!: string;
  @Output() pathChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() reload: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  goto(index: number): void {
    const splitPath = this.path.split('/').slice(0, -1);

    this.pathChange.emit(splitPath.slice(0, index));
  }
}
