import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articles: ArticleType[] = [];

  reviews = [
    {
      image: '1.jpg',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: '2.jpg',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: '3.jpg',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      image: '1.jpg',
      name: 'Станислав',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      image: '2.jpg',
      name: 'Алёна',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

  bannersOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 0,
    items: 1,
    nav: false
  }

  reviewsOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 25,
    items: 3,
    nav: false,
  }

  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.articlesService.getTopArticles()
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.articles = data as ArticleType[];
      })
  }

}
