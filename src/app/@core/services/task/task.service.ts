import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Assignee } from '../../../pages/management/events/task-detail/task-detail.component';

export interface UpdateTaskByIdRequest {
  title: string;
  content: string;
  status: number;
  score: number;
  gradeSubCriteriaId: number;
  eventId: number;
  assignees: Assignee[];
  deadline: Date;
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  updateTaskById(id: number, task: UpdateTaskByIdRequest) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/tasks/${id}`, JSON.stringify(task), options)
      .pipe(
        catchError((error) => {
          console.error("Error in updateTaskById:", error);
          return throwError(error);
        })
      );
    
  }
}
