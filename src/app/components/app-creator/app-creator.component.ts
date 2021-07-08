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

  @Output() closeCreate: EventEmitter<void> = new EventEmitter<void>();

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
      stars: 1,
    },
    owner: localStorage.getItem('user') || '',
    creation: '',
    update: '',
    ratedBy: [
      {
        id: '',
        rating: 1,
      },
    ],
  };

  tempImages!: File[];

  submit(): void {
    // Check to see if links are valid
    for (const url of this.createdApp.urls) {
      if (!(url.includes('https://') || url.includes('http://'))) {
        alert(`Your url: ${url}, does not begin with "https://" or "http://"`);
        return;
      }
    }

    // Check if images are set
    if (this.tempImages === undefined || null) {
      alert('You must have image(s)');
    }
    this.apptray
      .setAppImages(this.tempImages, this.createdApp.id)
      .then((urls) => {
        this.createdApp.images = urls;

        this.createdApp.creation = new Date().toDateString();
        this.createdApp.update = new Date().toDateString();

        this.apptray.createApp(this.createdApp);
        this.state.creatorToggle = false;
      });
  }

  setUrls(urls: string[]): void {
    this.createdApp.urls = urls;
  }

  setTitle(title: string): void {
    if (title.length < 29) {
      this.createdApp.title = title;
    } else {
      alert('The title must be less than 29 characters.');
    }
  }

  setTempImages(files: File[]): void {
    this.tempImages = files;
  }

  ngOnInit(): void {}
}
