import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ArticleDetailType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {CommentsService} from "../../../shared/services/comments.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article: ArticleDetailType | null = null;
  relatedArticles: ArticleDetailType[] = [];
  title: string = "Название статьи";
  isLoggedIn: boolean = false;
  commentText: string = ''
  commentsCount: number = 0;
  comments: CommentType[] = [];

  constructor(private titleService: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private articleService: ArticlesService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private commentsService: CommentsService) {
    this.titleService.setTitle("Статья");
    this.isLoggedIn = this.authService.getIsLoggedIn();

  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })

    this.proceedArticle(true)
  }

  proceedArticle(getRelated?:boolean): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleDetailType) => {
            this.article = data;
            this.comments = data.comments;
            this.commentsCount = data.commentsCount;
            this.titleService.setTitle(data.title)
            console.log(this.article);
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.router.navigate(['/404 ']).then();
          }
        });
      if (getRelated) {
        this.articleService.getRelatedArticles(params['url'])
          .subscribe({
            next: data => {
              this.relatedArticles = data;
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.log(errorResponse);
            }
          });
      }
    });
  }

  sendComment(): void {
    if (this.commentText && this.article) {
      this.commentsService.sendComment({text: this.commentText, article: this.article.id})
        .subscribe(data => {
          this._snackBar.open(data.message);
          if (!data.error) {
            this.commentText = '';
            this.getComments(0, true);
          }
        })
    }

  }

  getComments(offset: number = this.comments.length, newComment= false) {
    if (this.article) {
      this.commentsService.getComments({offset: offset, article: this.article.id})
        .subscribe({
          next: data => {
            this.commentsCount = data.allCount;
            if (newComment) {
              this.comments = [data.comments[0], ...this.comments]
            } else {
              this.comments.push(...data.comments);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.message);
          }
        })
    }
  }
}
