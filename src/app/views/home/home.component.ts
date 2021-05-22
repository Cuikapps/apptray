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

  goToDash(): void {
    window.open('https://cuikapps.com/dashboard');
  }

  openSite(): void {
    window.open('https://cuikapps.com');
  }

  signOut(): void {
    this.subscriptions[0].unsubscribe();
    this.authService.SignOut();
  }

  search(search: string): void {
    let searchURL = 'https://google.com/search?q=';

    switch (this.state.searchEngine) {
      case 'Google': {
        searchURL = 'https://google.com/search?q=';
        break;
      }
      case 'MS Bing': {
        searchURL = 'https://www.bing.com/search?q=';
        break;
      }
      case 'Yahoo': {
        searchURL = 'https://search.yahoo.com/search?p=';
        break;
      }
      case 'Yandex': {
        searchURL = 'https://yandex.com/search/?text=';
        break;
      }
      case 'DuckDuckGo': {
        searchURL = 'https://duckduckgo.com/?q=';
        break;
      }
      case 'Ask.com': {
        searchURL = 'https://www.ask.com/web?q=';
        break;
      }
      case 'Ecosia': {
        searchURL = 'https://www.ecosia.org/search?q=';
        break;
      }
      case 'Aol.com': {
        searchURL = 'https://search.aol.com/aol/search?q=';
        break;
      }
    }
    // TODO change _blank to _top.
    window.open(searchURL + search, '_blank');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
