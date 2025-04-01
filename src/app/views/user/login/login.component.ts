import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../shared/services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  next: [] | null = null

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _matSnackBar: MatSnackBar,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['next']) {
      this.next = this.activatedRoute.snapshot.queryParams['next'];
    }
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
        !!this.loginForm.value.rememberMe
      ).subscribe({
        next: (data: DefaultResponseType | LoginResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = (data as LoginResponseType)
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка авторизации'
          }

          if (error) {
            this._matSnackBar.open(error);
            throw new Error(error)
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this.userService.getUserInfo().subscribe({
            next: data => {
              if ((data as DefaultResponseType).error !== undefined) {
                this.authService.logout();
                this.userService.removeUserName();
                throw new Error((data as DefaultResponseType).message);
              }
              this.userService.setUserName((data as UserInfoType).name);

            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.message) {
                this.authService.logout();
                this.userService.removeUserName();
              }
            }
          });
          this._matSnackBar.open('Вы успешно авторизовались');
          if (this.next) {
            this.router.navigate(this.next, {fragment: 'comments'}).then();
          } else {
            this.router.navigate(['/']).then();
          }

        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._matSnackBar.open(errorResponse.error.message);
          } else {
            this._matSnackBar.open('Ошибка Авторизации');
          }
        }
      })
    }
  }

  setPass(value: string): void {
    this.loginForm.get('password')?.setValue(value);
  }
}
