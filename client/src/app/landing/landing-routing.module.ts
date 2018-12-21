import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyLeaveGuardService } from './lobby/lobby-leave-guard.service';
import { LobbyEnterGuardService } from './lobby/lobby-enter-guard.service';
import { LobbyListComponent } from './lobby-list/lobby-list.component';

const routes: Routes = [
  {
    component: LandingComponent,
    path: '',
    children: [
      { path: 'lobbies', component: LobbyListComponent },
      { path: 'lobby', component: LobbyComponent, canDeactivate: [LobbyLeaveGuardService], canActivate: [LobbyEnterGuardService] },
      { path: '**', redirectTo: 'lobbies' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
