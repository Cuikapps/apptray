import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
        this.fs.update<UserApp>('users-apps/' + localStorage.getItem('user'), {
          apps: userApps.apps,
        });

        this.fs.delete('/apptray-apps/' + appId);

        this.retrieveUserApps();
      });
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
      });

    this.retrieveUserApps();
  }

  createApp(data: App) {
    let userApps: UserApp;
    this.fs
      .read<UserApp>('/users-apps/' + localStorage.getItem('user'), false)
      .then((v) => {
        userApps = <UserApp>v;
        userApps.apps.push(data.title);
        this.fs.create('/apptray-apps/' + data.title, data, false);
        this.fs.update<UserApp>('/user-apps/' + localStorage.getItem('user'), {
          apps: userApps.apps,
        });
      });
  }

  updateApp(data: App) {
    this.fs.update<App>('/apptray-apps/' + data.title, data);
  }

  setAppImages(images: File[], appId: string) {
    this.fstorage.upload('/apptray-images/' + appId, images);
  }
}
