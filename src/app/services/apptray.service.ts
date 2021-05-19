import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { App } from '@app/interfaces/app';
import { UserApp } from '@app/interfaces/user-app';
import { Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';
@Injectable({
  providedIn: 'root',
})
export class ApptrayService {
  constructor(
    private fs: FirestoreService,
    private fstorage: AngularFireStorage
  ) {
    this.retrieveUserApps();
  }

  public $appList: Subject<App[]> = new Subject<App[]>();

  retrieveUserApps() {
    let userApps: UserApp = { apps: [''] };

    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = <UserApp>v;

        let apps: App[] = [
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
        for (let appId of userApps.apps) {
          this.fs.read<App>('/apptray-apps/' + appId, false).then((v) => {
            apps.push(<App>v);
          });
        }

        this.$appList.next(apps);
      });
  }

  deleteApp(appId: string) {
    let userApps: UserApp = { apps: [''] };

    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = <UserApp>v;

        for (let i = 0; i < userApps.apps.length; i++) {
          if (userApps.apps[i] == appId) {
            userApps.apps.splice(i, 1);
            break;
          }
        }
        //Update the users current apps
        this.fs.update<UserApp>('users-apps/' + localStorage.getItem('user'), {
          apps: userApps.apps,
        });

        //Delete the app data
        this.fs.delete('/apptray-apps/' + appId);

        //Delete all files in the apps images folder.
        this.fstorage
          .ref('/apptray-images/' + appId)
          .listAll()
          .toPromise()
          .then((result) => {
            result.items.forEach((file) => {
              file.delete();
            });
          })
          .then(() => this.retrieveUserApps());
      });
  }

  removeUserApp(appId: string) {
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        let userApps = <UserApp>v;

        for (let i = 0; i < userApps.apps.length; i++) {
          if (userApps.apps[i] == appId) {
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

  moveApp(from: number, to: number) {
    let userApps: UserApp = { apps: [''] };

    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = <UserApp>v;
        //swap the selected elements;
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

  createApp(data: App) {
    let userApps: UserApp;
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = <UserApp>v;
        userApps.apps.push(data.id);
        this.fs.create('/apptray-apps/' + data.id, data, false);
        this.fs.store
          .doc<UserApp>('/users-apps/' + localStorage.getItem('user'))
          .set(userApps)
          .then(() => this.retrieveUserApps());
      });
  }

  updateApp(data: App) {
    this.fs.update<App>('/apptray-apps/' + data.title, data);
  }

  async setAppImages(images: File[], appId: string): Promise<string[]> {
    let renamedImgs: File[] = [];

    for (let i = 0; i < images.length; i++) {
      let blob = images[i].slice(0, images[i].size, images[i].type);
      renamedImgs[i] = new File([blob], `Image_${i}`, { type: images[i].type });
    }

    for (let i = 0; i < renamedImgs.length; i++) {
      await this.fstorage
        .ref(`/apptray-images/${appId}/${renamedImgs[i].name}`)
        .put(renamedImgs[i]);
    }

    let refArr: AngularFireStorageReference[] = [];
    for (let i = 0; i < renamedImgs.length; i++) {
      refArr.push(
        this.fstorage.ref(`/apptray-images/${appId}/${renamedImgs[i].name}`)
      );
    }

    let urls: string[] = [];

    for (let i = 0; i < refArr.length; i++) {
      urls[i] = await refArr[i].getDownloadURL().toPromise();
    }

    return urls;
  }
}
