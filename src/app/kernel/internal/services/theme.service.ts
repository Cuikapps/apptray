import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../../interface/setting';
import { SettingsService } from './settings.service';

@Injectable()
export class ThemeService {
  currentTheme: BehaviorSubject<string> = new BehaviorSubject<string>(
    'default'
  );

  constructor(private readonly settings: SettingsService) {
    settings.$settings.subscribe((setting) =>
      this.currentTheme.next(setting.theme)
    );
  }

  async changeTheme(theme: Theme): Promise<void> {
    await this.settings.updateTheme(theme);
    this.currentTheme.next(theme);
  }
}
