import { Component, OnInit } from '@angular/core';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(public state: StateService) {}

  engines: string[] = [
    'Google',
    'MS Bing',
    'Yahoo',
    'Yandex',
    'DuckDuckGo',
    'Ask.com',
    'Ecosia',
    'Aol.com',
  ];

  mails: string[] = ['Gmail', 'Yahoo Mail', 'Outlook'];

  defaultEngine: number = this.engines.indexOf(this.state.searchEngine);

  defaultEmail: number = this.mails.indexOf(this.state.emailService);

  updateSearchEngine(v: string): void {
    this.state.searchEngine = v;
  }

  updateEmailService(v: string): void {
    this.state.emailService = v;
  }

  ngOnInit(): void {}
}
