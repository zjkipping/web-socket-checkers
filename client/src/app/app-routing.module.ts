import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoggedInGuardService } from '@services/logged-in-guard.service';
import { AuthGuardService } from '@services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuardService] },
  { path: '', loadChildren: './landing/landing.module#LandingModule', canActivate: [AuthGuardService] },
  // { path: 'login', component: LoginComponent},
  // { path: 'register', component: RegisterComponent },
  // { path: '', loadChildren: './landing/landing.module#LandingModule' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
