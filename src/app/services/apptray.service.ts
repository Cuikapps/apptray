import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { App } from '@app/interfaces/app';
import { UserApp } from '@app/interfaces/user-app';
import { Subject } from 'rxjs';
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
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((value) => {
        if (value) {
          this.retrieveUserApps();
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

  async retrieveUserApps(): Promise<void> {
    let userApps: UserApp = { apps: [''] };

    const newUserApps = await this.fs.read<UserApp>(
      '/users-apps/' + localStorage.getItem('user'),
      false
    );

    userApps = newUserApps as UserApp;

    const apps: App[] = [
      {
        id: '',
        desc: '',
        downloads: 0,
        images: [''],
        owner: '',
        public: false,
        rating: {
          numberOfReviews: 0,
          stars: 0,
        },
        title: '',
        urls: [''],
      },
    ];

    /**
     * Goes through the apps that the users has and adds each to the apps array.
     */
    apps.pop();
    for (const appId of userApps.apps) {
      const app = await this.fs.read<App>('/apptray-apps/' + appId, false);
      apps.push(app as App);
    }

    this.$appList.next(apps);
  }

  async deleteApp(appId: string): Promise<void> {
    if (
      confirm(
        'Are you sure you want to delete this app. Deleting this app will remove it from everybody else who it is shared with.'
      )
    ) {
      let userApps: UserApp = { apps: [''] };

      const newUserApps = await this.fs.read<UserApp>(
        '/users-apps/' + localStorage.getItem('user'),
        false
      );

      userApps = newUserApps as UserApp;

      for (let i = 0; i < userApps.apps.length; i++) {
        if (userApps.apps[i] === appId) {
          userApps.apps.splice(i, 1);
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
    const newUserApps = await this.fs.read<UserApp>(
      '/users-apps/' + localStorage.getItem('user'),
      false
    );

    const userApps = newUserApps as UserApp;

    for (let i = 0; i < userApps.apps.length; i++) {
      if (userApps.apps[i] === appId) {
        userApps.apps.splice(i, 1);
        break;
      }
    }
    await this.fs.update<UserApp>(
      'users-apps/' + localStorage.getItem('user'),
      {
        apps: userApps.apps,
      }
    );

    await this.retrieveUserApps();
  }

  async moveApp(from: number, to: number): Promise<void> {
    let userApps: UserApp = { apps: [''] };

    const newUserApps = await this.fs.read<UserApp>(
      '/users-apps/' + localStorage.getItem('user'),
      false
    );

    userApps = newUserApps as UserApp;
    // swap the selected elements;
    [userApps.apps[from], userApps.apps[to]] = [
      userApps.apps[to],
      userApps.apps[from],
    ];

    await this.fs.update<UserApp>(
      'users-apps/' + localStorage.getItem('user'),
      {
        apps: userApps.apps,
      }
    );

    await this.retrieveUserApps();
  }

  async createApp(data: App): Promise<void> {
    let userApps: UserApp;
    const newUserApps = await this.fs.read<UserApp>(
      '/users-apps/' + localStorage.getItem('user'),
      false
    );

    userApps = newUserApps as UserApp;
    userApps.apps.push(data.id);
    this.fs.create('/apptray-apps/' + data.id, data, false);
    await this.fs.store
      .doc<UserApp>('/users-apps/' + localStorage.getItem('user'))
      .set(userApps);

    await this.retrieveUserApps();
  }

  async updateApp(data: Partial<App>): Promise<void> {
    await this.fs.update<App>('/apptray-apps/' + data.id, data);
    await this.retrieveUserApps();
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
}
