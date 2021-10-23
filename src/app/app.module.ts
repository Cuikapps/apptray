import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KernelModule } from './kernel/kernel.module';

import { CirclesToRhumbusesSpinnerModule } from 'angular-epic-spinners';
import { HomeComponent } from './home/home.component';
import { ChangeThemeComponent } from './home/change-theme/change-theme.component';
import { ClockComponent } from './home/clock/clock.component';
import { TaskBarComponent } from './home/task-bar/task-bar.component';
import { NavMenuComponent } from './home/nav-menu/nav-menu.component';
import { ProgramManagerComponent } from './home/program-manager/program-manager.component';
import { MainMenuComponent } from './home/main-menu/main-menu.component';
import { SettingsComponent } from './home/main-menu/settings/settings.component';
import { MenuTabComponent } from './home/main-menu/menu-tab/menu-tab.component';
import { SettingsMenuComponent } from './home/main-menu/settings/settings-menu/settings-menu.component';
import { TaskComponent } from './home/task-bar/task/task.component';
import { TaskMenuComponent } from './home/task-menu/task-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangeThemeComponent,
    ClockComponent,
    TaskBarComponent,
    NavMenuComponent,
    ProgramManagerComponent,
    MainMenuComponent,
    SettingsComponent,
    MenuTabComponent,
    SettingsMenuComponent,
    TaskComponent,
    TaskMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KernelModule,
    CirclesToRhumbusesSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
