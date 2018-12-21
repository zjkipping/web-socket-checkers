import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyListComponent } from './lobby-list/lobby-list.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    LandingComponent,
    LobbyListComponent,
    LobbyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LandingRoutingModule,
    MaterialModule
  ],
})
export class LandingModule { }
