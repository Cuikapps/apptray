import { Component, OnDestroy, OnInit } from '@angular/core';
import { App } from '@app/interfaces/app';
import { ApptrayService } from '@app/services/apptray.service';
import { AuthService } from '@app/services/auth.service';
import { StateService } from '@app/services/state.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  appData!: App[];

  subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public appService: ApptrayService,
    public state: StateService
  ) {
    this.subscriptions[0] = this.appService.$appList.subscribe((app) => {
      this.appData = app;
    });
  }

  ngOnInit(): void {}

  signOut(): void {
    this.subscriptions[0].unsubscribe();
    this.authService.SignOut();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
