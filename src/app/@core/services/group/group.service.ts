import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GetAllUsersListResponse } from '../user/user.service';

export interface Group {
  id: number;
  name: string;
  users: GetAllUsersListResponse[]
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  public getAllGroups(bearerToken: string) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/groups`, options).pipe(
      catchError((error) => {
        console.error("Error in getAllGroups:", error);
        return throwError(error);
      })
    );
  }
}
