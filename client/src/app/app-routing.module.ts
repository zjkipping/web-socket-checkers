import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: 'login', component: LoginComponent, canActivate: [LoggedInGuardService] },
  // { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuardService] },
  // { path: '', loadChildren: './landing/landing.module#LandingModule', canActivate: [AuthGuardService] },
  { path: '', loadChildren: './landing/landing.module#LandingModule' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
