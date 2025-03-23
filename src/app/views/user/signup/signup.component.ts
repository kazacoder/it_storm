import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../shared/services/user.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../components/dialog/dialog.component";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s+[А-ЯЁ][а-яё]*)*\s*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _matSnackBar: MatSnackBar,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.name
      && this.signupForm.value.email && this.signupForm.value.password ) {
      this.authService.signup(
        this.signupForm.value.name,
        this.signupForm.value.email,
        this.signupForm.value.password,
      ).subscribe({
        next: (data: DefaultResponseType | LoginResponseType) => {
          let error = null;
          if((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = (data as LoginResponseType)
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка регистрации'
          }

          if (error) {
            this._matSnackBar.open(error);
            throw new Error(error)
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this.userService.setUserName(this.signupForm.value.name!);
          this._matSnackBar.open('Вы успешно зарегистрировались');
          this.router.navigate(['/']).then();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._matSnackBar.open(errorResponse.error.message);
          } else {
            this._matSnackBar.open('Ошибка регистрации');
          }
        }
      })
    }
  }

  openDialog(anchor?: string | null) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.signupForm.patchValue({agree: result});
      }
    })
    if (anchor) {
      // this.viewportScroller.scrollToAnchor(anchor); ?? doesn't work
      document.getElementById(anchor)!.scrollIntoView({behavior: 'smooth'});
    }
  }

}
