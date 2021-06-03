import { state } from '@angular/animations';
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
  @Input() index!: number;

  selectedFirst = false;
  selectedSecond = false;

  ngOnInit(): void {
    this.selectedFirst = false;
    this.selectedSecond = false;
  }

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
    } else if (this.state.activeControl === 'move') {
      this.move();
    } else if (this.state.activeControl === 'edit') {
      this.editApp();
    } else if (this.state.activeControl === 'trash-can') {
      this.removeApp();
    }
  }

  removeApp(): void {
    if (this.appData.owner === localStorage.getItem('user')) {
      this.apptray.deleteApp(this.appData.id);
    } else {
      this.apptray.removeUserApp(this.appData.id);
    }
  }

  move(): void {
    if (this.state.selectedApp === -1) {
      this.selectedFirst = true;
      this.state.setSelectedApp(this.index, this);
    } // This toggles every thing back
    else if (this.state.selectedApp === this.index) {
      this.selectedFirst = false;
      this.state.setSelectedApp(-1, this);
    } else if (this.state.moveToApp === -1) {
      this.selectedSecond = true;
      this.state.setMoveToApp(this.index, this);
    } // This toggles every thing back
    else if (this.state.moveToApp === this.index) {
      this.selectedSecond = false;
      this.state.setMoveToApp(-1, this);
    }
  }

  resetSelection(): void {
    this.selectedFirst = false;
    this.selectedSecond = false;
  }
}
