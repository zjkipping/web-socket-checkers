import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LobbyComponent } from './lobby/lobby.component';

@NgModule({
  declarations: [
    LandingComponent,
    LobbyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LandingRoutingModule
  ],
})
export class LandingModule { }
