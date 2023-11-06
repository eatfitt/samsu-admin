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

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }
}
