import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { App } from 'src/app/kernel/interface/app';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.scss'],
})
export class TaskMenuComponent implements OnInit {
  apps: App[] = [];
  subscriptions: Subscription[] = [];

  constructor(public readonly state: StateService) {
    this.subscriptions[0] = state.openApps.subscribe((_) => {
      this.apps = state.getAllOpenApps();
    });
  }

  ngOnInit(): void {}
}
