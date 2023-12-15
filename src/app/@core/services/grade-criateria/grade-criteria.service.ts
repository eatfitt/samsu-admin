import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface GradeCriteria {
  id?: number;
  content: string;
  policyDocumentId: number;
  defaultScore: number;
  maxScore: number;
}
@Injectable({
  providedIn: 'root'
})
export class GradeCriteriaService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public getAllGradeCriterias(page = 0, size = 30) {
    return this.http.get(`${this.apiEndPoint}/gradeCriterias?page=${page}&size=${size}`).pipe(
      catchError((error) => {
        console.error("Error in getAllGradeCriterias:", error);
        return throwError(error);
      })
    );
  }

  public createGradeCriteria(criteria: GradeCriteria) {
    return this.http.post(`${this.apiEndPoint}/gradeCriterias`, criteria).pipe(
      catchError((error) => {
        console.error("Error in createGradeCriteria:", error);
        return throwError(error);
      })
    );
  }

  public updateGradeCriteria(id: number, criteria: GradeCriteria) {
    return this.http.put(`${this.apiEndPoint}/gradeCriterias/${id}`, criteria).pipe(
      catchError((error) => {
        console.error("Error in updateGradeCriteria:", error);
        return throwError(error);
      })
    );
  }
}
