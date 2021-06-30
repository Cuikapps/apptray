import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';
import { PageNotFoundGuard } from './guards/page-not-found.guard';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./views/home/home.module').then((m) => m.HomeModule),
    canActivate: [LoggedInGuard],
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./views/store/store.module').then((m) => m.StoreModule),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    component: PageNotFoundGuard,
    canActivate: [PageNotFoundGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
