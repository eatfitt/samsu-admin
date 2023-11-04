import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface SignInRequest {
  usernameOrEmail: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  
  public getServerToken(googleAccessToken: string) {
    return this.http.post(`${this.apiEndPoint}/auth/login-google?accessToken=${googleAccessToken}`, {}).pipe(
      catchError((error) => {
        console.error('Error in getUserToken:', error);
        return throwError(error);
      })
    );
  }

  public signIn(signInRequest: SignInRequest) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
    const options = { headers: headers };
    return this.http.post(`${this.apiEndPoint}/auth/signin`, JSON.stringify(signInRequest), options).pipe(
      catchError((error) => {
        console.error('Error in getUserToken:', error);
        return throwError(error);
      })
    );
  }
}
