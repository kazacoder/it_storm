import { Component, OnInit } from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  filterOpened: boolean = false;

  articles: ArticleType[] = [];
  constructor(private articleService: ArticlesService) { }

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data.items
      console.log(this.articles)
    })
  }

  toggleFilter() {
    this.filterOpened = !this.filterOpened;
  }

}
