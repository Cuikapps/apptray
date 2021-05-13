import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { App } from '@app/interfaces/app';
import { FirestoreService } from '@app/services/firestore.service';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-app-creator',
  templateUrl: './app-creator.component.html',
  styleUrls: ['./app-creator.component.scss'],
})
export class AppCreatorComponent implements OnInit {
  constructor(public state: StateService, private fs: FirestoreService) {}

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
    for (let url of this.createdApp.urls) {
      if (!url.includes('https://')) {
        alert(`Your url: ${url}, does not begin with "https://"`);
        return;
      }
    }
    if (this.tempImages == undefined || null) {
      alert('You must have image(s)');
    }
    console.log(this.createdApp);
  }

  setUrls(urls: string[]) {
    this.createdApp.urls = urls;
  }

  setTitle(title: string) {
    this.createdApp.title = title;
  }

  ngOnInit(): void {}
}
