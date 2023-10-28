import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SocialUser } from '../../../../utils/social-login/public-api';
import { Store } from '@ngrx/store';
import { setUserJwt, setUserSocialUser, setUserUserSummary } from '../../../app-state/user';

export interface InitUserRequest {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router, private store: Store<{user: SocialUser}>) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public initUser(bearerToken: string, initUser: InitUserRequest): Observable<any> {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', bearerToken);
    const options = { headers: headers };
    return this.http.put(`${this.apiEndPoint}/users/init`, JSON.stringify(initUser), options).pipe(
      catchError((error) => {
        console.error('Error in getUserToken:', error);
        return throwError(error);
      })
    );
  }

  public getMe(bearerToken: string) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', bearerToken);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/users/me`, options).pipe(
      catchError((error) => {
        console.error('Error in getMe:', error);
        return throwError(error);
      })
    );
  }

  checkLoggedIn() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('socialUser'));
    const loggedInJwt = JSON.parse(sessionStorage.getItem('jwt'));
    const loggedInUserSummary = JSON.parse(sessionStorage.getItem('userSummary'));
    if (!!loggedInJwt) {
      this.store.dispatch(setUserSocialUser({ socialUser: loggedInUser }));
      this.store.dispatch(setUserJwt({jwt: loggedInJwt}))
      this.store.dispatch(setUserUserSummary({userSummary: loggedInUserSummary}))
      this.router.navigate(['pages']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logOut() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userSummary');
    sessionStorage.removeItem('socialUser');
    this.router.navigateByUrl('/');
  }
}
