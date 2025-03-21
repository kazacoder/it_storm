import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userNameKey: string = 'userName';
  userName$: Subject<string | null> = new Subject<string | null>();

  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users')
  }

  setUserName(userName: string): void {
    this.userName$.next(userName);
    localStorage.setItem(this.userNameKey, userName);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  removeUserName(): void {
    localStorage.removeItem(this.userNameKey);
    this.userName$.next(null);
  }
}
