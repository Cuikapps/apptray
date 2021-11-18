import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { App } from 'src/app/kernel/interface/app';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { ShellService } from 'src/app/kernel/services/shell.service';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-task-bar',
  templateUrl: './task-bar.component.html',
  styleUrls: ['./task-bar.component.scss'],
})
export class TaskBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() barOpen = '';

  apps: App[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    public readonly theme: ThemeService,
    public readonly state: StateService,
    public readonly shell: ShellService
  ) {
    this.subscriptions[0] = state.openApps.subscribe((_) => {
      this.apps = state.getAllOpenApps();
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  openSearch(): void {
    this.state.isSearchOpen.next(true);
  }

  openMail(): void {
    this.shell.run(['mail --open="true"']);
  }

  openFileExplorer(): void {
    this.shell.run(['file --open="true" --path=""']);
  }

  openFavorites(): void {
    this.shell.run(['file --open="true" --path="favorites/"']);
  }

  openTrash(): void {
    this.shell.run(['file --open="true" --path="trash/"']);
  }

  openTaskMenu(): void {
    this.state.isTaskMenuOpen.next(!this.state.isTaskMenuOpen.value);
  }

  openStore(): void {
    this.state.isMainMenuOpen.next(true);
    this.state.openMenuTab.next('store');
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
