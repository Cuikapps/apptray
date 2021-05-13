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

@NgModule({
  declarations: [
    SidePanelComponent,
    AppCreatorComponent,
    AppIconComponent,
    AppEditorComponent,
    UrlBoxComponent,
    ImgUploadComponent,
  ],
  imports: [CommonModule, FeatureModule, FormsModule],
  exports: [
    SidePanelComponent,
    AppCreatorComponent,
    AppIconComponent,
    AppEditorComponent,
    UrlBoxComponent,
    ImgUploadComponent,
    FeatureModule,
  ],
})
export class ComponentsModule {}
