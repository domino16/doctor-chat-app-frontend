import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AuthUser } from './authuser.model';

@Injectable()
export class JwtInterceptorService  implements HttpInterceptor {
  constructor(private authService: AuthService) {}
   currentUser!:AuthUser;


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
      const idToken:{email: string;
        _token: string;
        _tokenExpirationDate: string;
      }  = JSON.parse(localStorage.getItem("userData") || '{}');

      console.log(idToken._token);
      if (idToken._token) {
          request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${idToken._token}`
              }
          });
      }
      return next.handle(request);
  }
}

export const jwtInterceptorProvider = { provide: HTTP_INTERCEPTORS,  useClass:JwtInterceptorService,  multi: true};
