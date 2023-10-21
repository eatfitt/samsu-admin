import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

declare const gapi: any;
const API_ENDPOINT = 'http://localhost:8082/api';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // login(): Promise<any> {
  //   return new Promise((resolve) => {
  //     localStorage.setItem('loggedIn', 'true');
  //     resolve(true);
  //   });
  // }

  // isLoggedIn(): boolean {
  //   return !!localStorage.getItem('loggedIn');
  // }
  constructor(private http: HttpClient, protected router: Router, private socialAuthService: SocialAuthService) { }

  public authenticateUser(clientId: string): Observable<any> {
    return new Observable((observer) => {
      let auth2: any;
      gapi.load('auth2', () => {
        auth2 = gapi.auth2.init({ client_id: clientId, scope: 'profile email' });

        // Login button reference
        let element: any = document.getElementById('google-login-button');

        auth2.attachClickHandler(element, {}, (googleUser) => {
          // Emit the user data
          observer.next(googleUser.Oc);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      });
    }).pipe(
      catchError((error) => {
        console.error('Error in authenticateUser:', error);
        return throwError(error);
      })
    );
  }
  /**
* Logout user from Google
* @param callback Callback to function
*/
  userLogout(callback) {
    //You will be redirected to this URL after logging out from Google.
    let homeUrl = "http://localhost:4200";
    let logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah" +
        "/logout?continue=" + homeUrl;
    document.location.href = logoutUrl;
    callback();
  }
  
  public getServerToken(googleAccessToken: string) {
    return this.http.get(`${API_ENDPOINT}/auth/mobile/login-google?accessToken=${googleAccessToken}`).pipe(
      catchError((error) => {
        console.error('Error in getUserToken:', error);
        return throwError(error);
      })
    );
  }

  public getUserToken(): Observable<any> {
    return from(this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)).pipe(
      switchMap(accessToken => {
        return this.http.get(`${API_ENDPOINT}/auth/mobile/login-google?accessToken=${accessToken}`).pipe(
          catchError((error) => {
            console.error('Error in getUserToken:', error);
            return throwError(error);
          })
        );
      })
    );
  }
}
