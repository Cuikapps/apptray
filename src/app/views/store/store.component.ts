import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { App } from '@app/interfaces/app';
import { UserApp } from '@app/interfaces/user-app';
import { ApptrayService } from '@app/services/apptray.service';
import { FirestoreService } from '@app/services/firestore.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cuik-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit, OnDestroy {
  constructor(
    public apptray: ApptrayService,
    public fs: FirestoreService,
    private router: Router
  ) {}

  sorting = 'pop';
  searchQuery = '';

  queriedApps: QueryDocumentSnapshot<App>[] = [];

  subscriptions: Subscription[] = [];

  hoverApps: boolean[] = [];

  ngOnInit(): void {
    this.subscriptions[0] = this.apptray.$storeApps.subscribe((snapshots) => {
      this.queriedApps = snapshots;
    });
    this.apptray.updateStoreAppsWithSorting(this.sorting);
  }

  sort(): void {
    this.apptray.updateStoreAppsWithSorting(this.sorting);
  }

  search(): void {
    this.apptray.updateStoreAppsWithSearch(this.searchQuery);
  }

  hasMultipleImages(data: App): boolean {
    return data.images.length > 1 ? true : false;
  }

  goto(appId: string): void {
    this.router.navigate(['/store', appId]);
  }

  run(urls: string[]): void {
    for (const url of urls) {
      window.open(url, '_blank');
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  install(appId: string): void {
    this.apptray.installApp(appId);
  }
}
