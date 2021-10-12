import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
})
export class MenuTabComponent implements OnInit {
  @Input() content!: string;

  constructor(public readonly state: StateService) {}

  ngOnInit(): void {}
}
