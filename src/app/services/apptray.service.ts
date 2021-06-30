import { Injectable } from '@angular/core';
import {
  Action,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { App } from '@app/interfaces/app';
import { UserApp } from '@app/interfaces/user-app';
import { Observable, Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';

// TODO add try-catch statements to all functions
@Injectable({
  providedIn: 'root',
})
export class ApptrayService {
  constructor(
    private fs: FirestoreService,
    private fstorage: AngularFireStorage
  ) {
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), true)
      .then((observable) => {
        if (observable) {
          const subscription = observable as Observable<
            Action<DocumentSnapshot<UserApp | undefined>>
          >;
          subscription.subscribe((value) => {
            this.userApps = value.payload.data()?.apps || [];
            this.retrieveUserApps(value.payload.data()?.apps || []);
          });
        } else {
          this.fs.create<UserApp>(
            '/users-apps/' + localStorage.getItem('user'),
            { apps: [] },
            false
          );
        }
      });
  }

  public $appList: Subject<App[]> = new Subject<App[]>();
  public $storeApps: Subject<QueryDocumentSnapshot<App>[]> = new Subject<
    QueryDocumentSnapshot<App>[]
  >();

  userApps: string[] = [];

  async retrieveUserApps(userApps: string[]): Promise<void> {
    const apps: App[] = [];

    /**
     * Goes through the apps that the users has and adds each to the apps array.
     */
    apps.pop();
    for (const appId of userApps) {
      const app = await this.fs.read<App>('/apptray-apps/' + appId, false);
      apps.push(app as App);
    }

    this.$appList.next(apps);
  }

  async deleteApp(appId: string): Promise<void> {
    if (
      confirm(
        'Are you sure you want to delete this app. Deleting this app will remove it from everybody else who have installed it.'
      )
    ) {
      for (let i = 0; i < this.userApps.length; i++) {
        if (this.userApps[i] === appId) {
          this.userApps.splice(i, 1);
          break;
        }
      }

      // removes app from the users who have it
      const docs = await this.fs
        .collection<UserApp>('users-apps')
        .where('apps', 'array-contains', appId)
        .get();

      docs.forEach(async (doc) => {
        let newApps = doc.data().apps;
        newApps = newApps.filter((item) => item !== appId);

        doc.ref.set({ apps: newApps }, { merge: true });

        // Delete the app data
        this.fs.delete('/apptray-apps/' + appId);

        // Delete all files in the apps images folder.
        const result = await this.fstorage
          .ref('/apptray-images/' + appId)
          .listAll()
          .toPromise();

        result.items.forEach((file) => {
          file.delete();
        });
      });
    }
  }

  async removeUserApp(appId: string): Promise<void> {
    for (let i = 0; i < this.userApps.length; i++) {
      if (this.userApps[i] === appId) {
        this.userApps.splice(i, 1);
        break;
      }
    }
    await this.fs.update<UserApp>(
      'users-apps/' + localStorage.getItem('user'),
      {
        apps: this.userApps,
      }
    );
  }

  async moveApp(from: number, to: number): Promise<void> {
    // swap the selected elements;
    [this.userApps[from], this.userApps[to]] = [
      this.userApps[to],
      this.userApps[from],
    ];

    await this.fs.update<UserApp>(
      'users-apps/' + localStorage.getItem('user'),
      {
        apps: this.userApps,
      }
    );
  }

  async createApp(data: App): Promise<void> {
    const userApps: UserApp = {
      apps: this.userApps,
    };
    userApps.apps.push(data.id);
    this.fs.create('/apptray-apps/' + data.id, data, false);
    await this.fs.store
      .doc<UserApp>('/users-apps/' + localStorage.getItem('user'))
      .set(userApps);
  }

  async updateApp(data: Partial<App>): Promise<void> {
    data.update = new Date().toDateString();

    await this.fs.update<App>('/apptray-apps/' + data.id, data);
  }

  async setAppImages(images: File[], appId: string): Promise<string[]> {
    const renamedImgs: File[] = [];

    for (let i = 0; i < images.length; i++) {
      const blob = images[i].slice(0, images[i].size, images[i].type);
      renamedImgs[i] = new File([blob], `Image_${i}`, { type: images[i].type });
    }

    for (const renamedImg of renamedImgs) {
      await this.fstorage
        .ref(`/apptray-images/${appId}/${renamedImg.name}`)
        .put(renamedImg);
    }

    const refArr: AngularFireStorageReference[] = [];
    for (const renamedImg of renamedImgs) {
      refArr.push(
        this.fstorage.ref(`/apptray-images/${appId}/${renamedImg.name}`)
      );
    }

    const urls: string[] = [];

    for (let i = 0; i < refArr.length; i++) {
      urls[i] = await refArr[i].getDownloadURL().toPromise();
    }

    return urls;
  }

  async updateStoreAppsWithSorting(sorting: string): Promise<void> {
    const orderBy = this._processOrderBy(' ', sorting);

    if (orderBy === 'rating.stars') {
      const query = await this.fs
        .collection<App>('apptray-apps')
        .where('public', '==', true)
        .orderBy('rating.stars', sorting === 'low' ? 'asc' : 'desc')
        .limit(100)
        .get();

      this.$storeApps.next(query.docs);
    } else {
      const query = await this.fs
        .collection<App>('apptray-apps')
        .where('public', '==', true)
        .orderBy('downloads', 'desc')
        .limit(100)
        .get();

      this.$storeApps.next(query.docs);
    }
  }

  async updateStoreAppsWithSearch(search: string): Promise<void> {
    const firstQuery = await this.fs
      .collection<App>('apptray-apps')
      .where('public', '==', true)
      .where('title', '>=', search)
      .where('title', '<=', search + '\uf8ff')
      .limit(100)
      .get();

    const secondQuery = await this.fs
      .collection<App>('apptray-apps')
      .where('public', '==', true)
      .where('title', 'array-contains', search)
      .limit(100)
      .get();

    this.$storeApps.next(firstQuery.docs.concat(secondQuery.docs));
  }

  async installApp(appId: string): Promise<void> {
    const userApps: UserApp = { apps: this.userApps };
    const app = (await this.fs.read('apptray-apps/' + appId, false)) as App;

    if (!this.userHasApp(appId)) {
      userApps.apps.push(appId);
      app.downloads++;

      await this.fs.update<UserApp>(
        'users-apps/' + localStorage.getItem('user'),
        userApps
      );
      await this.fs.update<App>('apptray-apps/' + appId, app);
    } else {
      alert('You already have this app.');
    }
  }

  /**
   *
   * @returns true if user has the app
   */
  userHasApp(appId: string): boolean {
    return this.userApps.includes(appId);
  }

  async rateApp(appId: string, rate: number): Promise<void> {
    const app = (await this.fs.read<App>(
      'apptray-apps/' + appId,
      false
    )) as App;

    if (!app.ratedBy) {
      app.ratedBy = [
        {
          id: '',
          rating: 1,
        },
      ];
    }

    if (
      localStorage.getItem('user') &&
      app.ratedBy.findIndex(
        (obj) => obj.id === localStorage.getItem('user') || ''
      ) === -1
    ) {
      app.ratedBy.push({
        id: localStorage.getItem('user') || '',
        rating: rate,
      });
    } else {
      const indexOfRating: number = app.ratedBy.findIndex(
        (obj) => obj.id === localStorage.getItem('user') || ''
      );

      app.ratedBy[indexOfRating] = {
        id: localStorage.getItem('user') || '',
        rating: rate,
      };
    }

    let meanRating = 0;

    for (const rateBy of app.ratedBy) {
      meanRating += rateBy.rating;
    }

    meanRating /= app.ratedBy.length;

    app.rating.numberOfReviews++;
    app.rating.stars = meanRating;

    this.fs.update<App>('apptray-apps/' + appId, app);
  }

  private _processOrderBy(orderBy: string, sorting: string): string {
    switch (sorting) {
      case 'pop': {
        orderBy = 'downloads';
        break;
      }
      case 'high': {
        orderBy = 'rating.stars';
        break;
      }
      case 'low': {
        orderBy = 'rating.stars';
        break;
      }
      default: {
        orderBy = 'downloads';
      }
    }

    return orderBy;
  }
}
