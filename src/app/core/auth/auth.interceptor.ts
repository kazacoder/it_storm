import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private _snackBar: MatSnackBar,) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokens = this.authService.getTokens();

    if (tokens && !tokens.accessToken && tokens.refreshToken) {
      this.authService.logout();
      this.userService.removeUserName();
      this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
      throw new Error('Access token not found');
    }

    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });
      return next.handle(authReq)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 500 && err.error.message === 'jwt expired' && !authReq.url.includes('/login')
              && !authReq.url.includes('/refresh')) {
              return this.handleJwtExpiredError(authReq, next);
            }
            return throwError(() => err);
          }),
          finalize(() => {
            // hide loader
          })
        );
    }

    return next.handle(req).pipe(finalize(() => {
      // hide loader
    }));
  }

  handleJwtExpiredError(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).message !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as LoginResponseType;
          if (!refreshResult.refreshToken || !refreshResult.accessToken || !refreshResult.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            return throwError(() => error);
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken),
          });

          return next.handle(authReq);
        }),
        catchError(error => {
          this.authService.logout();
          this.userService.removeUserName();
          this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
          // this.router.navigate(['/']).then();
          return throwError(() => error);
        })
      );
  }
}
