import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthorisedRoutingModule } from './unauthorised-routing.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    UnauthorisedRoutingModule
  ]
})
export class UnauthorisedModule { }
