import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OpenApps } from '../interface/open-apps';
import { SettingsService } from '../internal/services/settings.service';

@Injectable()
export class StateService {
  constructor(public readonly settings: SettingsService) {}

  initOpenApps: OpenApps = {
    fileExplorers: [],
  };

  openApps: BehaviorSubject<OpenApps> = new BehaviorSubject<OpenApps>(
    this.initOpenApps
  );

  openMenuTab: BehaviorSubject<string> = new BehaviorSubject<string>(
    'settings'
  );

  isSearchOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMainMenuOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
}
