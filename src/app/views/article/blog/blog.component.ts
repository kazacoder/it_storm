import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  filterOpened: boolean = false;
  categories: CategoryType[] = [];
  categoriesFilterList: CategoryType[] = [];
  articles: ArticleType[] = [];

  constructor(private articleService: ArticlesService) {
  }

  ngOnInit(): void {
    this.articleService.getArticles({categories: []}).subscribe({
      next: data => {
        this.articles = data.items
      },
      error: (err: HttpErrorResponse) => {
      console.log(err.message)
    }
    })

    this.articleService.getCategories().subscribe({
      next: data => {
        this.categories = data.map(item => {
          item.filterOn = false;
          return item;
        })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message)
      }
    })
  }

  toggleFilter() {
    this.filterOpened = !this.filterOpened;
  }

  applyFilter(categoryId: string): void {
    const currentCategory = this.categories.find((category) => category.id === categoryId);
    if (currentCategory) {
      if (currentCategory.filterOn) {
        currentCategory.filterOn = false;
        this.categoriesFilterList = this.categoriesFilterList.filter(category => category.id !== currentCategory.id);
      } else {
        currentCategory.filterOn = true;
        this.categoriesFilterList.push(currentCategory);
      }
    }
    this.articleService.getArticles({categories: this.categoriesFilterList.map(item => item.url)}).subscribe({
      next: data => {
        this.articles = data.items
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message)
      }
    })
  }
}
