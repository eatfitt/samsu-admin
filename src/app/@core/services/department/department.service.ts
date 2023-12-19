import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Department {
  name: string;
  id?: number;
}
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public getAllDepartments(page = 0, size = 30) {
    return this.http.get(`${this.apiEndPoint}/departments?page=${page}&size=${size}`).pipe(
      catchError((error) => {
        console.error("Error in getAllDepartments:", error);
        return throwError(error);
      })
    );
  }

  public createDepartment(name: string) {
    return this.http.post(`${this.apiEndPoint}/departments`, name).pipe(
      catchError((error) => {
        console.error("Error in createDepartment:", error);
        return throwError(error);
      })
    );
  }


  public getDepartmentById(id: number) {
    return this.http.get(`${this.apiEndPoint}/departments/${id}`).pipe(
      catchError((error) => {
        console.error("Error in getDepartmentById:", error);
        return throwError(error);
      })
    );
  }

  public deleteDepartment(id: number) {
    return this.http.delete(`${this.apiEndPoint}/departments/${id}`).pipe(
      catchError((error) => {
        console.error("Error in deleteDepartment:", error);
        return throwError(error);
      })
    );
  }

  public viewDepartmentUsers(id: number) {
    return this.http.get(`${this.apiEndPoint}/departments/${id}/staff`).pipe(
      catchError((error) => {
        console.error("Error in viewDepartmentUsers:", error);
        return throwError(error);
      })
    );
  }

  public updateDepartment(id: number, de: string) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
    const options = { headers: headers };
    return this.http
      .put(`${this.apiEndPoint}/departments/${id}`, de, options)
      .pipe(
        catchError((error) => {
          console.error("Error in checkInUser:", error);
          return throwError(error);
        })
      );
  }
}
