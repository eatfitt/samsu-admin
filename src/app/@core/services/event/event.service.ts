import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Department, GetAllUsersListResponse } from '../user/user.service';
import { Semester } from '../semester/semester.service';
import { EventProposal } from '../../../../services/event-propsal.service';
export interface Event {
  id?: number;
  semestersName: string;
  title: string;
  content?: string;
  status: number;
  createAt?: Date;
  startTime: Date;
  duration: string;
  bannerUrl: string;
  fileUrls?: string;
  attendances?: number; // k cos nay
  attendScore?: number;
  creator?: GetAllUsersListResponse;
  eventLeader?: GetAllUsersListResponse;
  departments?: Department[];
  semester?: Semester;
  eventProposal?: EventProposal;
}

export interface FeedbackQuestionRequest {
  type: number;
  question: string;
  answer: string;
}

interface AssigneeRequest {
  status: number;
  rollnumber: string;
}

interface TaskRequests {
  title: string;
  content: string;
  status: number;
  score: number;
  assignees: AssigneeRequest[];
  assignee: string[];
}

export interface CreateEventRequest {
  status: number;
  duration: number;
  attendScore: number;
  title: string;
  content: string;
  eventProposalId: number;
  eventLeaderRollnumber: string;
  semester: string;
  bannerUrl: string;
  fileUrls: string;
  startTime: Date;
  feedbackQuestionRequestList: FeedbackQuestionRequest[];
  departmentIds?: string[];
  rollnumbers: string[];
  taskRequests?: TaskRequests[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  public createEvent(event: CreateEventRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .post(`${this.apiEndPoint}/events`, JSON.stringify(event), options)
      .pipe(
        catchError((error) => {
          console.error("Error in createEvent:", error);
          return throwError(error);
        })
      );
  }

  public getAllEvents() {
    return this.http.get(`${this.apiEndPoint}/events`).pipe(
      catchError((error) => {
        console.error("Error in getAllEvents:", error);
        return throwError(error);
      })
    );
  }

  public getEvent(id: number) {
    return this.http.get(`${this.apiEndPoint}/events/${id}`).pipe(
      catchError((error) => {
        console.error("Error in getEvent:", error);
        return throwError(error);
      })
    );
  }

  public updateEvent(event: CreateEventRequest, id: string) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/events/${id}`, JSON.stringify(event), options)
      .pipe(
        catchError((error) => {
          console.error("Error in updateEvent:", error);
          return throwError(error);
        })
      );
  }
}
