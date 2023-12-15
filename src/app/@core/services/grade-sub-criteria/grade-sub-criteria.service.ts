import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface GradeSubCriteria {
  id?: number;
  content: string;
  minScore: number;
  maxScore: number;
  gradeCriteriaId: number;
}
@Injectable({
  providedIn: 'root'
})
export class GradeSubCriteriaService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public getAllGradeSubCriterias(page = 0, size = 30) {
    return this.http.get(`${this.apiEndPoint}/gradeSubCriterias?page=${page}&size=${size}`).pipe(
      catchError((error) => {
        console.error("Error in getAllGradeSubCriterias:", error);
        return throwError(error);
      })
    );
  }

  public createSubGradeCriteria(subCriteria: GradeSubCriteria) {
    return this.http.post(`${this.apiEndPoint}/gradeSubCriterias`, subCriteria).pipe(
      catchError((error) => {
        console.error("Error in createGradeCriteria:", error);
        return throwError(error);
      })
    );
  }

  public updateSubGradeCriteria(id: number, criteria: GradeSubCriteria) {
    return this.http.put(`${this.apiEndPoint}/gradeSubCriterias/${id}`, criteria).pipe(
      catchError((error) => {
        console.error("Error in updateSubGradeCriteria:", error);
        return throwError(error);
      })
    );
  }
}
