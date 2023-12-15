import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Grade {
  id: number;
  score: number;
  time: Date | number;
  title: string;
  type: number;
}

export interface GetAllGradesBySemesterResponse {
  studentGrade: StudentGrade[];
  gradeSubCriteriaResponses: GradeSubCriteriaResponse[];
  gradeCriteriaResponses: GradeCriteriaResponse[];
}

export interface StudentGrade {
  scoreWithSubCriteria: Map<string, number>,
  userProfileReduce: {
    name: string;
    username: string;
    avatar: string;
    rollnumber: string;
  }
}
export interface GradeSubCriteriaResponse {
  id?: number;
  content: string;
  minScore: number;
  maxScore: number;
  gradeCriteriaId: number;
}
export interface GradeCriteriaResponse {
  id: number;
  content: string;
  policyDocumentId: number;
  defaultScore: number;
  maxScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public getGradeBySemesterAndRollnumber(semester: string, rollnumber: string) {
    return this.http.get(`${this.apiEndPoint}/grade/history/semester/${ semester }/rollnumber/${ rollnumber }`).pipe(
      catchError((error) => {
        console.error("Error in getGradeBySemesterAndRollnumber:", error);
        return throwError(error);
      })
    );
  }

  public getAllGradesBySemester (semester: string) {
    return this.http.get(`${this.apiEndPoint}/grade/all/semester/${ semester }`).pipe(
      catchError((error) => {
        console.error("Error in getGradeBySemesterAndRollnumber:", error);
        return throwError(error);
      })
    );
  }
}
