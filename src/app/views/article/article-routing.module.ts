import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BlogComponent} from "./blog/blog.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
  {path: 'articles', component: BlogComponent, title: 'Блог'},
  {path: 'article/:url', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
