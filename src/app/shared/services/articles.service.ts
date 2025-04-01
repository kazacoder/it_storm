import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ArticleDetailType, ArticleType} from "../../../types/article.type";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CategoryType} from "../../../types/category.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleDetailType> {
    return this.http.get<ArticleDetailType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticleDetailType[]> {
    return this.http.get<ArticleDetailType[]>(environment.api + 'articles/related/' + url);
  }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }
}
