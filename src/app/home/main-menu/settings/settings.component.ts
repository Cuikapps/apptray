import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MailProvider,
  SearchEngine,
  Theme,
} from 'src/app/kernel/interface/setting';
import { SettingsService } from 'src/app/kernel/internal/services/settings.service';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';

export interface ChangeSettingData {
  for: string;
  data: Theme | SearchEngine | MailProvider;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  constructor(
    public readonly settings: SettingsService,
    public readonly theme: ThemeService
  ) {}

  subscriptions: Subscription[] = [];

  readonly themeOptions = ['Light', 'Default', 'Dark'];
  currentThemeIndex = 1;

  readonly searchEngineOptions = [
    'Google',
    'MS Bing',
    'Yahoo',
    'Yandex',
    'Ask.com',
    'DuckDuckGo',
    'Ecosia',
    'Aol.com',
  ];
  currentSearchEngineIndex = 0;

  readonly mailProviderOptions = ['Gmail', 'Outlook', 'Yahoo'];
  currentMailProviderIndex = 0;

  ngOnInit(): void {
    this.subscriptions[0] = this.settings.$settings.subscribe((setting) => {
      this.currentThemeIndex = this.themeOptions.indexOf(setting.theme);
      this.currentSearchEngineIndex = this.searchEngineOptions.indexOf(
        setting.searchEngine
      );
      this.currentMailProviderIndex = this.mailProviderOptions.indexOf(
        setting.mailProvider
      );
    });
  }

  async change(selected: ChangeSettingData): Promise<void> {
    switch (selected.for) {
      case 'Theme': {
        this.theme.changeTheme(selected.data as Theme);
        break;
      }
      case 'Search Engine': {
        this.settings.updateSearchEngine(selected.data as SearchEngine);
        break;
      }
      case 'Mail Provider': {
        this.settings.updateMailProvider(selected.data as MailProvider);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
