import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Вход'},
  {path: 'signup', component: SignupComponent, title: 'Регистрация'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
