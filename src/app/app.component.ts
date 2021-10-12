import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './kernel/internal/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'apptray';

  appLoading = false;

  subscriptions: Subscription[] = [];

  constructor(public readonly loading: LoadingService) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.loading.appIsLoading.subscribe(
      (appLoading) => {
        this.appLoading = appLoading;
      }
    );
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
