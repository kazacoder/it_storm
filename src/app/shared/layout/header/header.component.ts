import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userName: string | null = null;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userService.userName$.subscribe(userName => {
      this.userName = userName;
    });

    const userNameFromLocalStorage = this.userService.getUserName();
    if (userNameFromLocalStorage) {
      this.userService.setUserName(userNameFromLocalStorage);
    }
  }

  logout(): void {
    this.authService.logout();
    this.userService.removeUserName();
    this._snackBar.open('Вы вышли из системы');
  }

}
