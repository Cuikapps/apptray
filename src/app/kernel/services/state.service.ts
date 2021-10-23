import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { App } from '../interface/app';
import { OpenApps } from '../interface/open-apps';
import { SettingsService } from '../internal/services/settings.service';

@Injectable()
export class StateService {
  constructor(private readonly settings: SettingsService) {}

  initOpenApps: OpenApps = {
    fileExplorers: [],
  };

  openApps: BehaviorSubject<OpenApps> = new BehaviorSubject<OpenApps>(
    this.initOpenApps
  );

  openMenuTab: BehaviorSubject<string> = new BehaviorSubject<string>(
    'settings'
  );

  isTaskMenuOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isSearchOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMainMenuOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  getAppByID(id: number): App | null {
    const currentOpenApps = this.openApps.value;

    for (const apps in currentOpenApps) {
      if (currentOpenApps[apps] !== []) {
        for (const app of currentOpenApps[apps]) {
          if (app.id === id) {
            return app;
          }
        }
      } else {
        return null;
      }
    }
    return null;
  }

  getAllOpenApps(): App[] {
    const currentOpenApps = this.openApps.value;

    const openApps: App[] = [];

    for (const apps in currentOpenApps) {
      if (currentOpenApps[apps] !== []) {
        for (const app of currentOpenApps[apps]) {
          openApps.push(app);
        }
      } else {
        return [];
      }
    }
    return openApps;
  }

  unminimizeApp(id: number): void {
    const tempOpenApps = { ...this.openApps.value };

    for (const apps in tempOpenApps) {
      if (tempOpenApps[apps] !== []) {
        tempOpenApps[apps] = tempOpenApps[apps].map<App>((a) => {
          if (a.id === id) {
            a.isMinimized = !a.isMinimized;
          }
          return a;
        });

        this.openApps.next(tempOpenApps);
      } else {
        return;
      }
    }
  }

  closeApp(props: App): void {
    const tempOpenApps = { ...this.openApps.value };

    for (const apps in tempOpenApps) {
      if (tempOpenApps[apps] !== []) {
        tempOpenApps[apps] = tempOpenApps[apps].filter((app) => app !== props);
        this.openApps.next(tempOpenApps);
      } else {
        return;
      }
    }
  }
}
