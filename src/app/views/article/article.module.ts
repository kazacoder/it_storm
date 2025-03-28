import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ArticleRoutingModule} from './article-routing.module';
import {BlogComponent} from './blog/blog.component';
import {ArticleCardComponent} from "../../shared/components/article-card/article-card.component";
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    BlogComponent,
    ArticleCardComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    // AppModule,

  ],
  exports: [
    ArticleCardComponent,
  ]
})
export class ArticleModule {
}
