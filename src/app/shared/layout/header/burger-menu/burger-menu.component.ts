import { Component } from '@angular/core';

@Component({
  selector: 'burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent {

  isOpen: boolean = false;

  constructor() { }

  toggleMEnu() {
    this.isOpen = !this.isOpen;
  }

}
