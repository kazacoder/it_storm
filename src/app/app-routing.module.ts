import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent, title: 'Главная'},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: '**', component: PageNotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
