import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {PasswordInputComponent} from "../../shared/components/password-input/password-input.component";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PasswordInputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule,
    MatIconModule,
  ]
})
export class UserModule { }
