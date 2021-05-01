import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { AppCreatorComponent } from './app-creator/app-creator.component';

@NgModule({
  declarations: [SidePanelComponent, AppCreatorComponent],
  imports: [CommonModule],
  exports: [SidePanelComponent, AppCreatorComponent],
})
export class ComponentsModule {}
