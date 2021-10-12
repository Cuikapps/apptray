import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  constructor(public readonly state: StateService) {}

  ngOnInit(): void {}
}
