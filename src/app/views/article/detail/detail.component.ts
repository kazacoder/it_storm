import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ArticleDetailType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {CommentsService} from "../../../shared/services/comments.service";
import {ActionsType} from "../../../../types/reactions.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {delay} from "rxjs";

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
  action = ActionsType;
  loading: boolean = false;

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
      if (!loggedIn) {
        this.comments.map(comment => delete comment.action)
      }
    })

    this.proceedArticle(true)
  }

  proceedArticle(getRelated?:boolean): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleDetailType) => {
            this.article = data;
            if (this.isLoggedIn) {
              this.comments = this.addReactionToComments(this.article.id, data.comments)
            } else {
              this.comments = data.comments;
            }
            this.commentsCount = data.commentsCount;
            this.titleService.setTitle(data.title)
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
      this.loading = true
      this.commentsService.getComments({offset: offset, article: this.article.id})
        // Тестирование Loader --start--
        .pipe(
          delay(1500)
        )
        // Тестирование Loader --end--
        .subscribe({
          next: data => {
            this.commentsCount = data.allCount;
            if (newComment) {
              this.comments = [data.comments[0], ...this.comments]
            } else {
              if (this.isLoggedIn) {
                this.comments.push(...this.addReactionToComments(this.article!.id, data.comments))
              } else {
                this.comments.push(...data.comments);
              }
            }
            this.loading = false
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.loading = false;
            console.log(errorResponse.message);
          }
        });
    }
  }

  addReactionToComments(articleId: string, comments: CommentType[]) {
    this.commentsService.getCommentsActions(articleId).
    subscribe(reactions => {
      if ((reactions as DefaultResponseType).error !== undefined) {
        console.log((reactions as DefaultResponseType).message)
      } else {
        comments = comments.map(comment => {
          comment.action = (reactions as { comment: string, action: ActionsType}[]).find(reaction => reaction.comment === comment.id)?.action
          return comment;
        })
      }
    });
    return comments;
  }

  proceedReaction(id: string, action: ActionsType):void {
    if (this.isLoggedIn) {
      this.commentsService.applyCommentAction(id, {action: action})
        .subscribe({
          next: () => {
            if (action === ActionsType.violate) {
              this._snackBar.open('Жалоба отправлена.');
            } else {
              // update reaction
              const currentComment = this.comments.find(comment => comment.id === id)
              let updatedComment: { comment: string, action: ActionsType } | undefined = undefined;
              this.commentsService.getCommentActions(currentComment!.id).subscribe({
                next: data => {
                  updatedComment = (data as { comment: string, action: ActionsType }[])[0]
                  if (updatedComment) {
                    currentComment!.action = action;
                  } else {
                    delete currentComment?.action
                  }
                },
                error: (errorResponse: HttpErrorResponse) => {
                  console.log(errorResponse.error.message)
                }
              })
              //update count Todo попробовать упростить код
              if (action === currentComment!.action && action === this.action.dislike) {
                currentComment!.dislikesCount -= 1
              }
              if (action !== currentComment!.action && action === this.action.dislike) {
                currentComment!.dislikesCount += 1
                if (currentComment!.action === this.action.like) {
                  currentComment!.likesCount -= 1
                }
              }
              if (action === currentComment!.action && action === this.action.like) {
                currentComment!.likesCount -= 1
              }
              if (action !== currentComment!.action && action === this.action.like) {
                currentComment!.likesCount += 1
                if (currentComment!.action === this.action.dislike) {
                  currentComment!.dislikesCount -= 1
                }
              }

              this._snackBar.open('Ваш голос учтен.');
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.error)
            if (action === ActionsType.violate && errorResponse.error.message === 'Это действие уже применено к комментарию') {
              this._snackBar.open('Жалоба уже отправлена.');
            } else {
              this._snackBar.open('Что-то пошло не так, повторите попытку позже.');
            }
          }
        });
    }
  }
}
