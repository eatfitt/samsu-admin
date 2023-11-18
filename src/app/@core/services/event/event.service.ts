import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  bannerUrls: string;
  fileUrls?: string;
  attendances?: number; // k cos nay
  attendScore?: number;
  creatorUser?: GetAllUsersListResponse;
  eventLeaderUser?: GetAllUsersListResponse;
  departments?: Department[];
  semester?: Semester;
  eventProposal?: EventProposal;
}

interface FeedbackQuestionRequest {
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

interface CreateEventRequest {
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
  departmentIds: string[];
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
    
  }

  public getAllEvents() {
    return this.http.get(`${this.apiEndPoint}/events`).pipe(
      catchError((error) => {
        console.error("Error in getAllEvents:", error);
        return throwError(error);
      })
    );
  }
}
