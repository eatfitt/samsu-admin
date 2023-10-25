import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface InitUserRequest {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
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
}
