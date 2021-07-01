import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { App } from '@app/interfaces/app';
import { IUser } from '@app/interfaces/iuser';
import { ApptrayService } from '@app/services/apptray.service';
import { FirestoreService } from '@app/services/firestore.service';

@Component({
  selector: 'cuik-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss'],
})
export class AppViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private fs: FirestoreService,
    public apptray: ApptrayService
  ) {}

  appData!: App;
  stars = 1;

  ownerProfile = {
    profilePic: '',
    name: '',
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fs.read<App>('apptray-apps/' + params.id, false).then((app) => {
        this.appData = app as App;

        this.fs
          .read<IUser>('users/' + this.appData.owner, false)
          .then((doc) => {
            const user: IUser = doc as IUser;

            if (this.appData.ratedBy) {
              const indexOfRating: number = this.appData.ratedBy.findIndex(
                (obj) => obj.id === user.uid
              );
              if (this.appData.ratedBy[indexOfRating]) {
                this.stars = this.appData.ratedBy[indexOfRating].rating;
              }
            }

            this.ownerProfile.name = user.displayName;
            this.ownerProfile.profilePic =
              user.photoURL || '../../../assets/account.png';
          });
      });
    });
  }

  hasMultipleImages(data: App): boolean {
    return data.images.length > 1 ? true : false;
  }

  run(): void {
    for (const url of this.appData.urls) {
      window.open(url, '_blank');
    }
  }

  copyLink(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `https://apptray.cuikapps.com/store/${this.appData.id}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    alert('Link has been copied');
  }
}
