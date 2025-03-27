import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";

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
  activeParams: ActiveParamsType = {categories: []}

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.articleService.getCategories().subscribe({
      next: data => {
        this.categories = data.map(item => {
          item.filterOn = false;
          return item;
        });
        this.proceedArticles();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
        this.proceedArticles();
      }
    });

  }

  toggleFilter() {
    this.filterOpened = !this.filterOpened;
  }

  applyFilter(categoryId: string, filterOn?: boolean): void {
    const currentCategory = this.categories.find((category) => category.id === categoryId);

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {

    }

    if (currentCategory) {
      if (currentCategory.filterOn) {
        currentCategory.filterOn = false;
        // this.categoriesFilterList = this.categoriesFilterList.filter(category => category.id !== currentCategory.id);
        this.activeParams.categories = this.activeParams.categories.filter(category => category !== currentCategory.url);

      } else {
        currentCategory.filterOn = true;
        // this.categoriesFilterList.push(currentCategory);
        this.activeParams.categories.push(currentCategory.url);
        // this.activeParams.categories = []
        // this.activeParams.page = 1
        console.log('here1')
      }
    }

    this.router.navigate(['/articles'], {queryParams: this.activeParams}).then();
    // this.proceedArticles()

    console.log(this.categories)
    console.log(currentCategory)
    console.log(this.activeParams.categories)

  }

  proceedArticles() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('here2')
      if (params.hasOwnProperty("categories")) {
        this.categoriesFilterList = [];

        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        this.activeParams.categories.forEach((categoryUrl) => {
          const currentCategory = this.categories.find((category) => category.url === categoryUrl);
          console.log(categoryUrl);
          if (currentCategory) {
            this.categoriesFilterList.push(currentCategory);
            currentCategory.filterOn = true;
          }

        });
      }

      if (params.hasOwnProperty('page')) {
        this.activeParams.page = +params['page'];
      }

      this.articleService.getArticles(this.activeParams).subscribe({
        next: data => {
          this.articles = data.items;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      });

      // this.router.navigate(['/articles'], {queryParams: this.activeParams}).then();

    });
  }
}
