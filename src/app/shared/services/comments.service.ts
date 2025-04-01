import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CommentType} from "../../../types/comment.type";
import {ActionsType, ReactionsType} from "../../../types/reactions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  sendComment(params: { text: string, article: string }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', params);
  }

  getComments(params: { offset: number, article: string }): Observable<{ allCount: number, comments: CommentType[] }> {
    return this.http.get<{ allCount: number, comments: CommentType[] }>(environment.api + 'comments',
      {params: params});
  }

  applyCommentAction(id: string, body: ReactionsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', body);
  }

  getCommentsActions(articleId: string): Observable<DefaultResponseType | { comment: string, action: ActionsType }[]> {
    return this.http.get<DefaultResponseType | { comment: string, action: ActionsType }[]>(environment.api +
      'comments/article-comment-actions', {params: {articleId: articleId}});
  }

  getCommentActions(commentId: string): Observable<DefaultResponseType | { comment: string, action: ActionsType }[]> {
    return this.http.get<DefaultResponseType | { comment: string, action: ActionsType }[]>(environment.api +
      'comments/' + commentId + '/actions', {params: {articleId: commentId}});
  }

}
