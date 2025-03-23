import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  bannersOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 0,
    navText: [
      "<img src='../../../assets/images/previous.png' alt='prev img'>",
      "<img src='../../../assets/images/next.png' alt='next img'>"
    ],
    items: 1,
    nav: true
  }

  constructor() { }

  ngOnInit(): void {
  }

}
