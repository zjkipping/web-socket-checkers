import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyLeaveGuardService } from './lobby/lobby-leave-guard.service';
import { LobbyEnterGuardService } from './lobby/lobby-enter-guard.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'landing', component: LandingComponent },
      { path: 'lobby', component: LobbyComponent, canDeactivate: [LobbyLeaveGuardService], canActivate: [LobbyEnterGuardService] },
      { path: '**', redirectTo: 'landing' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
