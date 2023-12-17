import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface Semester {
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  public getAllSemesters() {
    return this.http.get(`${this.apiEndPoint}/semesters`).pipe(
      catchError((error) => {
        console.error("Error in getAllSemesters:", error);
        return throwError(error);
      })
    );
  }

  addSemester(sem: Semester) {
    return this.http.post(`${this.apiEndPoint}/semesters`, sem).pipe(
      catchError((error) => {
        console.error("Error in addSemester:", error);
        return throwError(error);
      })
    );
  }
}
