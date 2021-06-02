import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { App } from '@app/interfaces/app';
import { UserApp } from '@app/interfaces/user-app';
import { Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { StateService } from './state.service';
@Injectable({
  providedIn: 'root',
})
export class ApptrayService {
  constructor(
    private fs: FirestoreService,
    private fstorage: AngularFireStorage,
    private state: StateService
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

  retrieveUserApps(): void {
    let userApps: UserApp = { apps: [''] };

    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = v as UserApp;

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
          this.fs
            .read<App>('/apptray-apps/' + appId, false)
            .then((app): void => {
              apps.push(app as App);
            });
        }

        this.$appList.next(apps);
      });
  }

  deleteApp(appId: string): void {
    if (
      confirm(
        'Are you sure you want to delete this app. Deleting this app will remove it from everybody else who it is shared with.'
      )
    ) {
      let userApps: UserApp = { apps: [''] };

      this.fs
        .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
        .then((v) => {
          userApps = v as UserApp;

          for (let i = 0; i < userApps.apps.length; i++) {
            if (userApps.apps[i] === appId) {
              userApps.apps.splice(i, 1);
              break;
            }
          }

          // removes app from the users who have it
          this.fs
            .collection<UserApp>('users-apps')
            .where('apps', 'array-contains', appId)
            .get()
            .then((docs) => {
              docs.forEach((doc) => {
                let newApps = doc.data().apps;
                newApps = newApps.filter((item) => item !== appId);

                doc.ref.set({ apps: newApps }, { merge: true });
              });
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              // Delete the app data
              this.fs.delete('/apptray-apps/' + appId);

              // Delete all files in the apps images folder.
              this.fstorage
                .ref('/apptray-images/' + appId)
                .listAll()
                .toPromise()
                .then((result) => {
                  result.items.forEach((file) => {
                    file.delete();
                  });
                })
                .finally(() => this.retrieveUserApps());
            });
        });
    }
  }

  removeUserApp(appId: string): void {
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        const userApps = v as UserApp;

        for (let i = 0; i < userApps.apps.length; i++) {
          if (userApps.apps[i] === appId) {
            userApps.apps.splice(i, 1);
            break;
          }
        }
        this.fs.update<UserApp>('users-apps/' + localStorage.getItem('user'), {
          apps: userApps.apps,
        });
      })
      .then(() => this.retrieveUserApps());
  }

  moveApp(from: number, to: number): void {
    let userApps: UserApp = { apps: [''] };

    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = v as UserApp;
        // swap the selected elements;
        [userApps.apps[from], userApps.apps[to]] = [
          userApps.apps[to],
          userApps.apps[from],
        ];

        this.fs.update<UserApp>('users-apps/' + localStorage.getItem('user'), {
          apps: userApps.apps,
        });
        this.retrieveUserApps();
      });
  }

  createApp(data: App): void {
    let userApps: UserApp;
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = v as UserApp;
        userApps.apps.push(data.id);
        this.fs.create('/apptray-apps/' + data.id, data, false);
        this.fs.store
          .doc<UserApp>('/users-apps/' + localStorage.getItem('user'))
          .set(userApps)
          .then(() => this.retrieveUserApps());
      });
  }

  updateApp(data: Partial<App>): void {
    this.fs
      .update<App>('/apptray-apps/' + data.id, data)
      .then(() => this.retrieveUserApps());
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
