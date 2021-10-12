import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MailProvider,
  SearchEngine,
  Theme,
} from 'src/app/kernel/interface/setting';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { ChangeSettingData } from '../settings.component';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  @Input() default!: number;
  @Input() display!: string;
  @Input() options!: string[];

  @Output() changeSetting: EventEmitter<ChangeSettingData> =
    new EventEmitter<ChangeSettingData>();

  constructor(public readonly theme: ThemeService) {}

  ngOnInit(): void {}

  setSetting(select: string): void {
    this.changeSetting.emit({
      for: this.display,
      data: select as Theme | SearchEngine | MailProvider,
    });
  }
}
