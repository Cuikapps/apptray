import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { ShellService } from 'src/app/kernel/services/shell.service';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-task-bar',
  templateUrl: './task-bar.component.html',
  styleUrls: ['./task-bar.component.scss'],
})
export class TaskBarComponent implements OnInit {
  constructor(
    public readonly theme: ThemeService,
    public readonly state: StateService,
    public readonly shell: ShellService
  ) {}

  @Input() barOpen = '';

  ngOnInit(): void {}

  openSearch(): void {
    this.state.isSearchOpen.next(true);
  }

  openMail(): void {
    this.shell.run(['mail --open="true"']);
  }
}
