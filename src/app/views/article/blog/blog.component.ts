import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})



export class BlogComponent implements OnInit, AfterViewInit {

  filterOpened: boolean = false;
  categories: CategoryType[] = [];
  categoriesFilterList: CategoryType[] = [];
  articles: ArticleType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  filterDropDown: Element | null = null;
  pages: number[] = [];

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
  }

  ngAfterViewInit() {
    // ToDo Why it doesn't work???
    this.filterDropDown = document.querySelector('blog-filters');
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

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.filterDropDown) {
      this.filterDropDown = document.querySelector('.blog-filters');
    }

    if (!document.querySelector('.blog-filters')?.contains(event.target as Node)) {
      this.filterOpened = false;
    }
  }


  toggleFilter() {
    this.filterOpened = !this.filterOpened;
  }

  applyFilter(categoryId: string): void {
    const currentCategory = this.categories.find((category) => category.id === categoryId);
    this.activeParams.page = 1;

    if (currentCategory) {
      if (currentCategory.filterOn) {
        currentCategory.filterOn = false;
        this.activeParams.categories = this.activeParams.categories.filter(category => category !== currentCategory.url);

      } else {
        currentCategory.filterOn = true;
        this.activeParams.categories = [...this.activeParams.categories, currentCategory.url];
      }
    }

    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: this.activeParams }).then();
  }

  proceedArticles() {
    this.activatedRoute.queryParams.subscribe(params => {

      if (!this.activatedRoute.snapshot.queryParams['page']) {
        this.activeParams.page = 1;
      }

      // сброс всех фильтров при переходе по ссылке без параметров
      if (!this.activatedRoute.snapshot.queryParams['categories']) {
        this.activeParams.categories = [];
        this.categoriesFilterList = [];
        this.categories.map(category => category.filterOn = false);
      }

      if (params.hasOwnProperty("categories")) {
        this.categoriesFilterList = [];
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        this.activeParams.categories.forEach((categoryUrl) => {
          const currentCategory = this.categories.find((category) => category.url === categoryUrl);
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
          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }

        },
        error: (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      });
    });
  }

  openPage(page: number): void {
    if (this.activeParams.page === undefined && this.activeParams.page === page ||
      this.activeParams.page === undefined && page === 1) {
      return;
    }
    this.activeParams.page = page;
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: this.activeParams }).then();
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: this.activeParams }).then();
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: this.activeParams }).then();
    }
  }
}
