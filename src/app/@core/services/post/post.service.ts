import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { Event } from "../event/event.service";
import { GetAllUsersListResponse } from "../user/user.service";

export interface Post {
  title: string;
  body: string;
  kudos: number;
  eventId: number;
  userRollnumber: string;
  image_urls: string;
  file_urls: string;
  status: number;
}
export interface PostResponse {
  id: number;
  title: string;
  body: string;
  kudos: number;
  event: Event;
  user: GetAllUsersListResponse;
  image_urls: string;
  file_urls: string;
  status: number;
}
@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  createPost(post: Post) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    const options = { headers: headers };
    return this.http
      .post(`${this.apiEndPoint}/posts`, JSON.stringify(post), options)
      .pipe(
        catchError((error) => {
          console.error("Error in createPost:", error);
          return throwError(error);
        })
      );
  }

  getPostsByEventId() {

  }
}
