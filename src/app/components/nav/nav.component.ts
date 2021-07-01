import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(public authService: AuthService, public state: StateService) {}

  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}

  goToDash(): void {
    window.open('https://cuikapps.com/dashboard');
  }

  openSite(): void {
    this.state.activeControl = 'none';
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
    window.open(searchURL + search, '_top');
  }
}
