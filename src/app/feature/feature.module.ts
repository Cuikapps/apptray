import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CuikInputComponent } from './cuik-input/cuik-input.component';
import { ToolTipDirective } from './tool-tip.directive';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { YesNoPipe } from './pipes/yes-no.pipe';

@NgModule({
  declarations: [
    CuikInputComponent,
    ToolTipDirective,
    CustomSelectComponent,
    YesNoPipe,
  ],
  imports: [CommonModule],
  exports: [
    CuikInputComponent,
    ToolTipDirective,
    CustomSelectComponent,
    YesNoPipe,
  ],
})
export class FeatureModule {}
