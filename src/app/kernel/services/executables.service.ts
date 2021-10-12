import { Injectable } from '@angular/core';
import { Param } from '../interface/Param';
import { MailProviderURL, SearchEngineURL } from '../interface/setting';
import { AuthService } from '../internal/services/auth.service';
import { SettingsService } from '../internal/services/settings.service';
import { StateService } from './state.service';

@Injectable()
export class ExecutablesService {
  constructor(
    private readonly auth: AuthService,
    private readonly state: StateService,
    private readonly settings: SettingsService
  ) {}

  public async launch(name: string, params: Param): Promise<void> {
    try {
      switch (name) {
        case 'sign-in': {
          this.auth.signIn(params);
          break;
        }
        case 'settings': {
          this.settingsCommand(params);
          break;
        }
        case 'store': {
          this.storeCommand(params);
          break;
        }
        case 'help': {
          this.helpCommand(params);
          break;
        }
        case 'search': {
          this.searchCommand(params);
          break;
        }
        case 'mail': {
          this.mailCommand(params);
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  private searchCommand(params: Param): void {
    if (params.q || params.query) {
      const query = params.q ?? params.query;

      let searchEngineUri: string;

      switch (this.settings.$settings.value.searchEngine) {
        case 'Google': {
          searchEngineUri = SearchEngineURL.GOOGLE;
          break;
        }
        case 'MS Bing': {
          searchEngineUri = SearchEngineURL.MS_BING;
          break;
        }
        case 'Aol.com': {
          searchEngineUri = SearchEngineURL.AOL_DOT_COM;
          break;
        }
        case 'Ask.com': {
          searchEngineUri = SearchEngineURL.ASK_DOT_COM;
          break;
        }
        case 'DuckDuckGo': {
          searchEngineUri = SearchEngineURL.DUCK_DUCK_GO;
          break;
        }
        case 'Ecosia': {
          searchEngineUri = SearchEngineURL.ECOSIA;
          break;
        }
        case 'Yahoo': {
          searchEngineUri = SearchEngineURL.YAHOO;
          break;
        }
        case 'Yandex': {
          searchEngineUri = SearchEngineURL.YANDEX;
          break;
        }
        default: {
          searchEngineUri = SearchEngineURL.GOOGLE;
          break;
        }
      }

      const searchUrl = searchEngineUri + query;

      window.open(searchUrl, '_top');
    }
  }

  private mailCommand(params: Param): void {
    if (params.open) {
      let mailProviderUrl: string;

      switch (this.settings.$settings.value.mailProvider) {
        case 'Gmail': {
          mailProviderUrl = MailProviderURL.GMAIL;
          break;
        }
        case 'Outlook': {
          mailProviderUrl = MailProviderURL.OUTLOOK;
          break;
        }
        case 'Yahoo': {
          mailProviderUrl = MailProviderURL.YAHOO;
          break;
        }
      }

      window.open(mailProviderUrl, '_top');
    }
  }
  private settingsCommand(params: Param): void {
    if (params.open) {
      this.state.isMainMenuOpen.next(true);
      this.state.openMenuTab.next('settings');
    }
  }

  private storeCommand(params: Param): void {
    if (params.open) {
      this.state.isMainMenuOpen.next(true);
      this.state.openMenuTab.next('store');
    }
  }

  private helpCommand(params: Param): void {
    if (params.open) {
      this.state.isMainMenuOpen.next(true);
      this.state.openMenuTab.next('help');
    }
  }
}
