import { Component, Input, OnInit } from '@angular/core';
import { App } from '@app/interfaces/app';
import { ApptrayService } from '@app/services/apptray.service';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class AppIconComponent implements OnInit {
  constructor(public state: StateService, public apptray: ApptrayService) {}

  @Input('app-data') appData!: App;

  ngOnInit(): void {}

  hasMultipleImages() {
    if (this.appData.images.length > 1) return true;
    else return false;
  }

  editApp() {
    this.state.editingApp = this.appData.id;
    this.state.editorToggle = true;
  }

  open() {
    if (this.state.activeControl == 'none')
      for (let i = 0; i < this.appData.urls.length; i++) {
        window.open(this.appData.urls[i], '_blank');
      }
  }

  removeApp() {
    if (this.appData.owner == localStorage.getItem('user')) {
      if (
        confirm(
          'You are the owner of this app, so the app will be deleted for ever.'
        )
      ) {
        this.apptray.deleteApp(this.appData.id);
      }
    } else {
      this.apptray.removeUserApp(this.appData.id);
    }
  }
}
