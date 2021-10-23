import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DesktopService } from 'src/app/kernel/services/desktop.service';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-program-manager',
  templateUrl: './program-manager.component.html',
  styleUrls: ['./program-manager.component.scss'],
})
export class ProgramManagerComponent implements OnInit {
  constructor(
    public readonly state: StateService,
    public readonly desktop: DesktopService
  ) {}

  subscriptions: Subscription[] = [];

  ngOnInit(): void {}
}
