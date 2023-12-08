import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { GetAllUsersListResponse } from "../user/user.service";
import { FeedbackQuestionRequest } from "../event/event.service";

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

  deleteQuestion(questionId: number) {
    return this.http.delete(`${this.apiEndPoint}/feedback/questions/${ questionId }`).pipe(
      catchError((error) => {
        console.error("Error in deleteQuestion:", error);
        return throwError(error);
      })
    );
  }
  addQuestionByEventId(eventId: number, feedback: FeedbackQuestionRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .post(`${this.apiEndPoint}/feedback/questions/event/${eventId}`, JSON.stringify(feedback), options)
      .pipe(
        catchError((error) => {
          console.error("Error in addQuestionByEventId:", error);
          return throwError(error);
        })
      );
  }

  edtQuestionById(id: number, feedback: FeedbackQuestionRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/feedback/questions/${id}`, JSON.stringify(feedback), options)
      .pipe(
        catchError((error) => {
          console.error("Error in edtQuestionById:", error);
          return throwError(error);
        })
      );
  }
}
