import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CuikInputComponent } from './cuik-input/cuik-input.component';
import { ToolTipDirective } from './tool-tip.directive';

@NgModule({
  declarations: [CuikInputComponent, ToolTipDirective],
  imports: [CommonModule],
  exports: [CuikInputComponent, ToolTipDirective],
})
export class FeatureModule {}
