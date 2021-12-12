import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../../interface/setting';
import { SettingsService } from './settings.service';

@Injectable()
export class ThemeService {
  currentTheme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>('Default');

  constructor(private readonly settings: SettingsService) {
    settings.$settings.subscribe((setting) =>
      this.currentTheme.next(setting.theme)
    );
  }

  async changeTheme(theme: Theme): Promise<void> {
    await this.settings.updateTheme(theme);

    const link: HTMLLinkElement | null =
      document.querySelector('link[rel="icon"]');

    if (link) {
      link.href = `Apptray_Logo_${theme}.ico`;
    }

    this.currentTheme.next(theme);
  }
}
