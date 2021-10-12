import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellService } from './services/shell.service';
import { ExecutablesService } from './services/executables.service';
import { HttpClientModule } from '@angular/common/http';
import { LoadingService } from './internal/services/loading.service';
import { CookieService } from './internal/services/cookie.service';
import { AuthService } from './internal/services/auth.service';
import { FormatParamService } from './internal/services/format-param.service';
import { ThemeService } from './internal/services/theme.service';
import { OptionsMenuComponent } from './components/options-menu/options-menu.component';
import { StateService } from './services/state.service';
import { SettingsService } from './internal/services/settings.service';
import { FileExplorerComponent } from './components/apps/file-explorer/file-explorer.component';
import { SearchComponent } from './components/apps/search/search.component';
import { SelectMenuComponent } from './components/select-menu/select-menu.component';

@NgModule({
  declarations: [
    OptionsMenuComponent,
    FileExplorerComponent,
    SearchComponent,
    SelectMenuComponent,
  ],
  imports: [CommonModule, HttpClientModule],
  providers: [
    ShellService,
    ExecutablesService,
    CookieService,
    AuthService,
    LoadingService,
    FormatParamService,
    ThemeService,
    StateService,
    SettingsService,
  ],
  exports: [
    OptionsMenuComponent,
    FileExplorerComponent,
    SearchComponent,
    SelectMenuComponent,
  ],
})
export class KernelModule {}
