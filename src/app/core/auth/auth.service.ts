import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {UserService} from "../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';

  private isLogged: boolean = false;
  public isLogged$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient,
              private userService: UserService,
              private _snackBar: MatSnackBar,) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
    this.isLogged$.next(this.isLogged);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login',
      {email, password, rememberMe});
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup',
      {name, email, password});
  }

  logout() {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      this.http.post<DefaultResponseType>(environment.api + 'logout',
        {refreshToken: tokens.refreshToken},);
    }
    this.removeTokens();
    this.userId = null;
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      });
    }
    this.logout();
    this.userService.removeUserName();
    this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
    throw throwError(() => "Can't find the tokens" );
  }

  getIsLoggedIn() {
    return this.isLogged;
  }

  setTokens(accessTokens: string, refreshTokens: string): void {
    localStorage.setItem(this.accessTokenKey, accessTokens);
    localStorage.setItem(this.refreshTokenKey, refreshTokens);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

}
