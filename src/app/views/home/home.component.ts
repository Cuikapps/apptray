import { Component, OnDestroy, OnInit } from '@angular/core';
import { App } from '@app/interfaces/app';
import { ApptrayService } from '@app/services/apptray.service';
import { AuthService } from '@app/services/auth.service';
import { StateService } from '@app/services/state.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  appData!: App[];

  constructor(
    public authService: AuthService,
    public appService: ApptrayService,
    public state: StateService
  ) {
    this.appService.$appList.subscribe((app) => {
      this.appData = app;
    });
  }

  ngOnInit(): void {}

  goToDash() {
    window.open('https://cuikapps.com/dashboard');
  }

  openSite() {
    window.open('https://cuikapps.com');
  }

  ngOnDestroy() {
    this.appService.$appList.unsubscribe();
  }
}
