import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { GetAllUsersListResponse } from '../user/user.service';


export interface Group {
  id: number;
  name: string;
  users: GetAllUsersListResponse[]
}

export interface PutUpdateGroupRequest {
  id?: number;
  name: string;
  userRollnumbers: string[];
}

export interface CreateGroupRequest {
  name: string;
  userRollnumbers: string[];
}

export interface GetSingleGroupResponse {
  id: number;
  name: string;
  users: GroupUser[];
}

export interface GroupUser {
  createdAt: number,
  id: 6,
  name: string,
  username: string,
  email: string,
  department: Object,
  avatar: string,
  dob: number,
  role: number,
  status: number,
  rollnumber: string
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

  public createGroup(bearerToken: string, group: CreateGroupRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.post(`${this.apiEndPoint}/groups`, JSON.stringify(group), options).pipe(
      catchError((error) => {
        console.error("Error in getAllGroups:", error);
        return throwError(error);
      })
    );
  }

  public putUpdateGroup(bearerToken: string, group: PutUpdateGroupRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http.put(`${this.apiEndPoint}/groups/${group.id}`, JSON.stringify(group), options).pipe(
      catchError((error) => {
        console.error("Error in getAllGroups:", error);
        return throwError(error);
      })
    );
  }

  public getSingleGroup(bearerToken: string, id: number) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/groups/${id}`, options).pipe(
      catchError((error) => {
        console.error("Error in getSingleGroup:", error);
        return throwError(error);
      })
    );
  }

  public deleteGroup(bearerToken: string, id: number) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.delete(`${this.apiEndPoint}/groups/${id}`, options).pipe(
      catchError((error) => {
        console.error("Error in getSingleGroup:", error);
        return throwError(error);
      })
    );
  }
}
