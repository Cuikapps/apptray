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

  hasMultipleImages(): boolean {
    if (this.appData.images.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  editApp(): void {
    if (this.appData.owner === localStorage.getItem('user')) {
      this.state.editingApp = this.appData.id;
      this.state.editorToggle = true;
    } else {
      alert('You must the owner of this app to edit it.');
    }
  }

  open(): void {
    if (this.state.activeControl === 'none') {
      for (const url of this.appData.urls) {
        window.open(url, '_blank');
      }
    }
  }

  removeApp(): void {
    if (this.appData.owner === localStorage.getItem('user')) {
      this.apptray.deleteApp(this.appData.id);
    } else {
      this.apptray.removeUserApp(this.appData.id);
    }
  }
}
