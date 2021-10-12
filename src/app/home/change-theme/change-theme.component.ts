import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html',
  styleUrls: ['./change-theme.component.scss'],
})
export class ChangeThemeComponent implements OnInit, OnDestroy {
  constructor(private readonly theme: ThemeService) {}

  buttonClass = '';

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions[0] = this.theme.currentTheme.subscribe((theme) => {
      this.buttonClass = theme;
    });
  }

  async spot1(): Promise<void> {
    await this.theme.changeTheme('Light');
  }
  async spot2(): Promise<void> {
    await this.theme.changeTheme('Default');
  }
  async spot3(): Promise<void> {
    await this.theme.changeTheme('Dark');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
