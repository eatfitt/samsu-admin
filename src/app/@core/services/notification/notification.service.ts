import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GetAllUsersListResponse } from '../user/user.service';

export interface Notification {
  id?: number;
  type: number;
  title: string;
  content: string;
  creator?: GetAllUsersListResponse;
}
export interface SendNotificationRequest {
  title: string;
  content: string;
  image: string;
  rollnumbers: string[];
  isSendNotification: boolean;
  isSendEmail: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  getNotification(id: number) {
    return this.http.get(`${this.apiEndPoint}/notifications/${id}`).pipe(
      catchError((error) => {
        console.error("Error in getNotification:", error);
        return throwError(error);
      })
    );
  }

  editNotification(id: number, notification: Notification) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    const options = { headers: headers };
    return this.http.put(`${this.apiEndPoint}/notifications/${id}`, JSON.stringify(notification), options).pipe(
      catchError((error) => {
        console.error("Error in editNotification:", error);
        return throwError(error);
      })
    );
  }

  getCancelEventTemplate() {
    return this.getNotification(117);
  }

  sendNotification(sendNotiReq: SendNotificationRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    const options = { headers: headers };
    return this.http.post(`${this.apiEndPoint}/notifications/users`, JSON.stringify(sendNotiReq), options).pipe(
      catchError((error) => {
        console.error("Error in sendNotification:", error);
        return throwError(error);
      })
    );
  }

}
