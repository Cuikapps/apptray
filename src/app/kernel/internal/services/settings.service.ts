import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  MailProvider,
  SearchEngine,
  Setting,
  Theme,
} from '../../interface/setting';
import { ApptrayURLs } from '../data/EApiUrls';
import { LoadingService } from './loading.service';

@Injectable()
export class SettingsService {
  $settings: BehaviorSubject<Setting> = new BehaviorSubject<Setting>({
    searchEngine: 'Google',
    mailProvider: 'Gmail',
    theme: 'Default',
  });

  constructor(
    private readonly loading: LoadingService,
    private readonly http: HttpClient
  ) {
    this.refetch();
  }

  private async refetch(): Promise<void> {
    try {
      await this.loading.load(async () => {
        const settings = await firstValueFrom(
          this.http.get<Setting>(
            environment.apiURL + ApptrayURLs.GET_SETTINGS,
            {
              withCredentials: true,
            }
          )
        );

        this.$settings.next(settings);
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  private async updateSettings(settings: Partial<Setting>): Promise<void> {
    try {
      await this.loading.load(async () => {
        const newSettings = await firstValueFrom(
          this.http.post<Setting>(
            environment.apiURL + ApptrayURLs.SET_SETTINGS,
            {
              ...settings,
            },
            {
              withCredentials: true,
            }
          )
        );

        this.$settings.next(newSettings);
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async updateSearchEngine(se: SearchEngine): Promise<void> {
    await this.updateSettings({ searchEngine: se });
  }

  async updateMailProvider(mp: MailProvider): Promise<void> {
    await this.updateSettings({ mailProvider: mp });
  }

  async updateTheme(theme: Theme): Promise<void> {
    await this.updateSettings({ theme });
  }
}
