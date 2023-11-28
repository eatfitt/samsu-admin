import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { GetAllUsersListResponse } from "../user/user.service";
import { GradeSubCriteria } from "../grade-sub-criteria/grade-sub-criteria.service";

export interface GradeTicket {
  id: number;
  title: string;
  content: string;
  evidenceUrls: string;
  feedback: string;
  creator: GetAllUsersListResponse;
  accepter: GetAllUsersListResponse;
  gradeSubCriteria: GradeSubCriteria;
  status: number;
  score: number;
} 
export interface GradeTicketCreateRequest {
  title: string;
  content: string;
  evidenceUrls: string;
  feedback: string;
}
export interface UpdateGradeTicketRequest {
  status: number;
  score: number;
  feedback: string;
  gradeSubCriteriaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class GradeTicketService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  public getAllGradeTickets() {
    return this.http.get(`${this.apiEndPoint}/gradeTicket`).pipe(
      catchError((error) => {
        console.error("Error in getAllGradeTickets:", error);
        return throwError(error);
      })
    );
  }

  public updateGradeTicket(id: number, ticketRequest: UpdateGradeTicketRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/gradeTicket/${id}`, JSON.stringify(ticketRequest), options)
      .pipe(
        catchError((error) => {
          console.error("Error in updateGradeTicket:", error);
          return throwError(error);
        })
      );
  }
}
