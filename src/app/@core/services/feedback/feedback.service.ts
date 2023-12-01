import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { GetAllUsersListResponse } from "../user/user.service";

export interface GetAllQuestionsByEventIdResponse {
  id: number;
  type: number;
  question: string;
  answer: string;
  eventId: number;
}

export interface GetAllAnswersByQuestionIdResponse {
  id: number;
  content: string;
  feedbackQuestionId: number;
  userProfileReduce: GetAllUsersListResponse;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  getAllQuestionsByEventId(id: number) {
    return this.http.get(`${this.apiEndPoint}/feedback/event/${id}/questions`).pipe(
      catchError((error) => {
        console.error("Error in getAllQuestionsByEventId:", error);
        return throwError(error);
      })
    );
  }

  getAllAnswersByQuestionId(id: number) {
    return this.http.get(`${this.apiEndPoint}/feedback/answers/questionId/${id}`).pipe(
      catchError((error) => {
        console.error("Error in getAllAnswersByQuestionId:", error);
        return throwError(error);
      })
    );
  }
}
