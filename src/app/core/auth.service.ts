import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';

  private isLogged: boolean = false;
  public isLogged$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login() {
  }

}
