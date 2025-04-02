import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit {

  isOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMEnu() {
    this.isOpen = !this.isOpen;
  }

}
