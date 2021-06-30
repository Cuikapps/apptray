import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { AppCreatorComponent } from './app-creator/app-creator.component';
import { AppIconComponent } from './app-icon/app-icon.component';
import { AppEditorComponent } from './app-editor/app-editor.component';
import { FeatureModule } from '../feature/feature.module';
import { UrlBoxComponent } from './url-box/url-box.component';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { NavComponent } from './nav/nav.component';
import { InfoComponent } from './info/info.component';
import { AppViewComponent } from './app-view/app-view.component';
import { RouterModule } from '@angular/router';
import { StarViewComponent } from './star-view/star-view.component';

@NgModule({
  declarations: [
    SidePanelComponent,
    AppCreatorComponent,
    AppIconComponent,
    AppEditorComponent,
    UrlBoxComponent,
    ImgUploadComponent,
    SettingsComponent,
    NavComponent,
    InfoComponent,
    AppViewComponent,
    StarViewComponent,
  ],
  imports: [CommonModule, FeatureModule, FormsModule, RouterModule],
  exports: [
    SidePanelComponent,
    AppCreatorComponent,
    AppIconComponent,
    AppEditorComponent,
    UrlBoxComponent,
    ImgUploadComponent,
    SettingsComponent,
    FeatureModule,
    NavComponent,
    InfoComponent,
    AppViewComponent,
    StarViewComponent,
  ],
})
export class ComponentsModule {}
