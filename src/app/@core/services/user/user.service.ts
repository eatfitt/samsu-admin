import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { SocialUser } from "../../../../utils/social-login/public-api";
import { Store } from "@ngrx/store";
import {
  setUserJwt,
  setUserSocialUser,
  setUserUserSummary,
} from "../../../app-state/user";

export interface InitUserRequest {
  username: string;
  password: string;
}

export interface GetAllUsersListResponse {
  created_at: string;
  id: number;
  name: string;
  username: string;
  email: string;
  department: string;
  avatar: string;
  dob: string;
  role: number;
  status: number;
  rollnumber: string;
}
export interface GetAllUsersResponse {
  content: GetAllUsersListResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AddListUserRequest {
  username: string;
  password?: string;
  name: string;
  rollnumber: string;
  email: string;
  role: string;
  dob?: string;
}

export interface AddUserRequest {}

export interface AddListUserResponse {
  amount: number;
  success: number;
  failed: number;
  userImportsFail: Array<Object>;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
    private store: Store<{ user: SocialUser }>
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public initUser(
    bearerToken: string,
    initUser: InitUserRequest
  ): Observable<any> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/users/init`, JSON.stringify(initUser), options)
      .pipe(
        catchError((error) => {
          console.error("Error in getUserToken:", error);
          return throwError(error);
        })
      );
  }

  public getMe(bearerToken: string) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/users/me`, options).pipe(
      catchError((error) => {
        console.error("Error in getMe:", error);
        return throwError(error);
      })
    );
  }

  public getAllUsers(bearerToken: string, page = 0, size = 30) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/users`, options).pipe(
      catchError((error) => {
        console.error("Error in getAllUsers:", error);
        return throwError(error);
      })
    );
  }

  public addUser(bearerToken: string, user: AddUserRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http
      .post(`${this.apiEndPoint}/users`, JSON.stringify(user), options)
      .pipe(
        catchError((error) => {
          console.error("Error in getAllUsers:", error);
          return throwError(error);
        })
      );
  }

  public addListUser(bearerToken: string, users: AddListUserRequest[]) {
    const mappedUsers = JSON.stringify(users);
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http
      .post(`${this.apiEndPoint}/users/list`, mappedUsers, options)
      .pipe(
        // map((res: AddListUserResponse) => {
        //   if (res.failed > 0 || res.success < res.amount) {
        //     console.log("Error in getAllUsers: ",res.userImportsFail);
        //     return throwError(res.userImportsFail);
        //   }
        // }),
        catchError((error) => {
          console.error("Error in getAllUsers:", error);
          return throwError(error);
        })
      );
  }

  checkLoggedIn() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("socialUser"));
    const loggedInJwt = JSON.parse(sessionStorage.getItem("jwt"));
    const loggedInUserSummary = JSON.parse(
      sessionStorage.getItem("userSummary")
    );
    if (!!loggedInJwt) {
      this.store.dispatch(setUserSocialUser({ socialUser: loggedInUser }));
      this.store.dispatch(setUserJwt({ jwt: loggedInJwt }));
      this.store.dispatch(
        setUserUserSummary({ userSummary: loggedInUserSummary })
      );
      // this.router.navigate(["pages"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  logOut() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("userSummary");
    sessionStorage.removeItem("socialUser");
    this.router.navigateByUrl("/");
  }
}
