import { Injectable } from '@angular/core';

export interface Event {
  creatorUsersId?: number;
  eventProposalsId?: number;
  eventLeaderUsersId?: number;
  semestersName: string;
  title: string;
  content?: string;
  status: string;
  createAt?: Date;
  startTime: Date;
  duration: string;
  bannerUrls: string;
  fileUrls?: string;
  attendances?: number;
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

  constructor() { }
  public createEvent(event: CreateEventRequest) {
    
  }
}
