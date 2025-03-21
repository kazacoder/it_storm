import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {catchError, finalize, Observable, throwError} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {LoginResponseType} from "../../types/login-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url)

    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });
      return next.handle(authReq)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle401Error(authReq, next);
            }
            return throwError(() => err);
          }),
          finalize(() => {
            // hide loader
          })
        )
    }

    return next.handle(req).pipe(finalize(() => {
      // hide loader
    }))
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
    // toDo
    // return this.authService.refresh()
  }

}
