import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ArticleDetailType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article: ArticleDetailType | null = null;
  relatedArticles: ArticleDetailType[] = [];

  constructor(private titleService: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private articleService: ArticlesService,) {
    this.titleService.setTitle("Название статьи");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleDetailType) => {
            this.article = data;
            console.log(this.article);
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.router.navigate(['/404 ']).then();
          }
        });
      this.articleService.getRelatedArticles(params['url'])
        .subscribe({
          next: data => {
            this.relatedArticles = data;
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
          }
        });
    });
  }

}
