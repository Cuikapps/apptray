import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
} from '@angular/core';
import { App } from '@app/interfaces/app';
import { ApptrayService } from '@app/services/apptray.service';
import { StateService } from '@app/services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cuik-app-editor',
  templateUrl: './app-editor.component.html',
  styleUrls: ['./app-editor.component.scss'],
})
export class AppEditorComponent implements OnInit, OnDestroy {
  constructor(public state: StateService, public apptray: ApptrayService) {}

  @Output() closeTab: EventEmitter<void> = new EventEmitter<void>();

  @Input() apps!: App[];
  activeApp!: App;

  tempDesc!: string;
  tempPublic!: boolean;
  tempUrls!: string[];
  tempImages!: string[];
  tempTitle!: string;

  // temporary files
  Images!: File[];

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.apps.forEach((app) => {
      if (app.id === this.state.editingApp) {
        this.activeApp = app;
      }
    });

    this.tempPublic = this.activeApp.public;
    this.tempUrls = this.activeApp.urls;
    this.tempDesc = this.activeApp.desc;
    this.tempTitle = this.activeApp.title;
    this.tempImages = this.activeApp.images;
  }

  setTitle(title: string): void {
    if (title.length < 29) {
      this.tempTitle = title;
    } else {
      alert('The title must be less than 29 characters.');
    }
  }

  setUrls(urls: string[]): void {
    this.tempUrls = urls;
  }

  setTempImages(files: File[]): void {
    this.Images = files;
  }

  submit(): void {
    // Check to see if links are valid
    for (const url of this.tempUrls) {
      if (!url.includes('https://')) {
        alert(`Your url: ${url}, does not begin with "https://"`);
        return;
      }
    }

    // Check if images are set
    if (this.tempImages === undefined || null) {
      console.log(this.tempImages);
      alert('You must have image(s)');
    }
    if (this.Images && this.Images.length > 0) {
      this.apptray.setAppImages(this.Images, this.activeApp.id).then((urls) => {
        this.tempImages = urls;
        this.apptray.updateApp({
          title: this.tempTitle,
          desc: this.tempDesc,
          public: this.tempPublic,
          images: this.tempImages,
          urls: this.tempUrls,
          id: this.activeApp.id,
        });
        this.state.editorToggle = false;
      });
    } else {
      this.apptray.updateApp({
        title: this.tempTitle,
        desc: this.tempDesc,
        public: this.tempPublic,
        images: this.tempImages,
        urls: this.tempUrls,
        id: this.activeApp.id,
      });
      this.state.editorToggle = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
