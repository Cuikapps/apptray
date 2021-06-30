import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { ComponentsModule } from '@app/components/components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [StoreComponent],
  imports: [CommonModule, StoreRoutingModule, ComponentsModule, FormsModule],
})
export class StoreModule {}
