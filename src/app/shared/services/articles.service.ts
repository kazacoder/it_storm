import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ArticleType} from "../../../types/article.type";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top')
  }
}
