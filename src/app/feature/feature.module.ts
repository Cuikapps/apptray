import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CuikInputComponent } from './cuik-input/cuik-input.component';
import { ToolTipDirective } from './tool-tip.directive';
import { CustomSelectComponent } from './custom-select/custom-select.component';

@NgModule({
  declarations: [CuikInputComponent, ToolTipDirective, CustomSelectComponent],
  imports: [CommonModule],
  exports: [CuikInputComponent, ToolTipDirective, CustomSelectComponent],
})
export class FeatureModule {}
