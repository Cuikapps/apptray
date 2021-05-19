import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { App } from '@app/interfaces/app';
import { ApptrayService } from '@app/services/apptray.service';
import { FirestoreService } from '@app/services/firestore.service';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-app-creator',
  templateUrl: './app-creator.component.html',
  styleUrls: ['./app-creator.component.scss'],
})
export class AppCreatorComponent implements OnInit {
  constructor(
    public state: StateService,
    private fs: FirestoreService,
    private apptray: ApptrayService
  ) {}

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  createdApp: App = {
    id: this.fs.genRandID(),
    title: '',
    desc: '',
    public: false,
    urls: [''],
    images: [''],
    downloads: 0,
    rating: {
      numberOfReviews: 0,
      stars: 0,
    },
    owner: localStorage.getItem('user') || '',
  };

  tempImages!: File[];

  submit() {
    //Check to see if links are valid
    for (let url of this.createdApp.urls) {
      if (!url.includes('https://')) {
        alert(`Your url: ${url}, does not begin with "https://"`);
        return;
      }
    }

    //Check if images are set
    if (this.tempImages == undefined || null) {
      console.log(this.tempImages);
      alert('You must have image(s)');
    }
    this.apptray
      .setAppImages(this.tempImages, this.createdApp.id)
      .then((urls) => {
        this.createdApp.images = urls;
        this.apptray.createApp(this.createdApp);
        this.state.creatorToggle = false;
      });
  }

  setUrls(urls: string[]) {
    this.createdApp.urls = urls;
  }

  setTitle(title: string) {
    this.createdApp.title = title;
  }

  setTempImages(files: File[]) {
    this.tempImages = files;
  }

  ngOnInit(): void {}
}
