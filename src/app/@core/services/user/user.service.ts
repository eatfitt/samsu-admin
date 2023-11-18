import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { SocialAuthService, SocialUser } from "../../../../utils/social-login/public-api";
import {
  setUserJwt,
  setUserSocialUser,
  setUserUserSummary,
} from "../../../app-state/user";

export enum RoleEnum {
  ROLE_ADMIN = 0,
  ROLE_MANAGER = 1,
  ROLE_STAFF = 2,
  ROLE_STUDENT = 3,
}

export interface InitUserRequest {
  password: string;
}

export interface GetAllUsersListResponse {
  createdAt?: Date;
  id?: number;
  name: string;
  username: string;
  email: string;
  department?: string;
  avatar?: string;
  dob?: string | number;
  role: string | number;
  status?: number;
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
  role: string | number;
  dob?: string;
  createAt?: Date;
  department?: Department;
  avatar?: string;
  status?: number;
}

export interface Department {
  name: string;
}

export interface AddUserRequest {}

export interface AddListUserResponse {
  amount: number;
  success: number;
  failed: number;
  userImportsFail?: Array<UserImportsFail>;
}
export interface UserImportsFail {
  message: string;
  userImport: UserImport;
}
export interface UserImport {
  email: string;
  name: string;
  password: string;
  role: string;
  rollnumber: string;
  username: string;
  valid: boolean;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
    private socialAuthService: SocialAuthService,
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
    return this.http.get(`${this.apiEndPoint}/users?page=${page}&size=${size}`, options).pipe(
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
        catchError((error) => {
          console.error("Error in getAllUsers:", error);
          return throwError(error);
        })
      );
  }

  public deleteUser(bearerToken: string, rollnumber: string) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http
      .delete(`${this.apiEndPoint}/users/${rollnumber}`, options)
      .pipe(
        catchError((error) => {
          console.error("Error in deleteUser:", error);
          return throwError(error);
        })
      );
  }

  public updateUser(bearerToken: string, rollnumber: string, user: AddListUserRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", bearerToken);
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/users/${rollnumber}`, JSON.stringify(user), options)
      .pipe(
        catchError((error) => {
          console.error("Error in deleteUser:", error);
          return throwError(error);
        })
      );
  }

  checkLoggedIn(isNavigate = false) {
    const loggedInUser = JSON.parse(localStorage.getItem("socialUser"));
    const loggedInJwt = JSON.parse(localStorage.getItem("jwt"));
    const loggedInUserSummary = JSON.parse(
      localStorage.getItem("userSummary")
    );
    if (!!loggedInJwt) {
      this.store.dispatch(setUserSocialUser({ socialUser: loggedInUser }));
      this.store.dispatch(setUserJwt({ jwt: loggedInJwt }));
      this.store.dispatch(
        setUserUserSummary({ userSummary: loggedInUserSummary })
      );
      if (isNavigate) this.router.navigate(["pages"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  logOut() {
    localStorage.removeItem("jwt");
    this.store.dispatch(setUserSocialUser(null));
    this.store.dispatch(setUserJwt({ jwt: null }));
    this.store.dispatch(setUserUserSummary(null));
    localStorage.removeItem("userSummary");
    localStorage.removeItem("socialUser");
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.socialAuthService.signOut();
    localStorage.setItem('loggedOut', 'true');
    this.router.navigateByUrl("/");
  }
}
