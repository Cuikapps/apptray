import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { App } from '@app/interfaces/app';
import { IUser } from '@app/interfaces/iuser';
import { AuthService } from '@app/services/auth.service';
import { StateService } from '@app/services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cuik-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {
  constructor(public state: StateService, public auth: AuthService) {}

  @Output() closeTab: EventEmitter<void> = new EventEmitter<void>();

  @Input() apps!: App[];
  activeApp!: App;
  ownerData: IUser | undefined;

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.apps.forEach((app) => {
      if (app.id === this.state.viewingApp) {
        this.activeApp = app;
      }
    });

    this.auth
      .getUserFromID(this.activeApp.owner)
      .toPromise()
      .then((data) => {
        this.ownerData = data.data();
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
