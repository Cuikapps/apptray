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
import { DesktopService } from './services/desktop.service';
import { FileExplorerToolBarComponent } from './components/apps/file-explorer/file-explorer-tool-bar/file-explorer-tool-bar.component';
import { FileService } from './internal/services/file.service';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FolderComponent } from './components/folder/folder.component';
import { FileComponent } from './components/file/file.component';
import { WindowUtilService } from './internal/services/window-util.service';
import { CloseOnUnfocusDirective } from './internal/directive/close-on-unfocus.directive';
import { PopUpService } from './internal/services/pop-up.service';
import { NewFolderComponent } from './components/new-folder/new-folder.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OptionsMenuComponent,
    FileExplorerComponent,
    SearchComponent,
    SelectMenuComponent,
    FileExplorerToolBarComponent,
    BreadcrumbsComponent,
    FolderComponent,
    FileComponent,
    CloseOnUnfocusDirective,
    NewFolderComponent,
  ],
  imports: [CommonModule, HttpClientModule, FormsModule],
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
    DesktopService,
    FileService,
    WindowUtilService,
    PopUpService,
  ],
  exports: [
    OptionsMenuComponent,
    FileExplorerComponent,
    SearchComponent,
    SelectMenuComponent,
    FileExplorerToolBarComponent,
    BreadcrumbsComponent,
    FolderComponent,
    FileComponent,
    CloseOnUnfocusDirective,
    NewFolderComponent,
  ],
})
export class KernelModule {}
