import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundGuard } from './guards/not-found.guard';
import { ReturningAgainGuard } from './guards/returning-again.guard';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [ReturningAgainGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', component: NotFoundGuard, canActivate: [NotFoundGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
