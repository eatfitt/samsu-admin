import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PolicyDocument {
  name: string;
  fileUrls: string;
  id?: number;
}
@Injectable({
  providedIn: 'root'
})
export class PolicyDocumentService {

  apiEndPoint: string="";
  constructor(private http: HttpClient, protected router: Router) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  public getAllPolicyDocuments() {
    return this.http.get(`${this.apiEndPoint}/policyDocuments`).pipe(
      catchError((error) => {
        console.error("Error in getAllPolicyDocuments:", error);
        return throwError(error);
      })
    );
  }
  public createPolicyDocument(document: PolicyDocument) {
    return this.http.post(`${this.apiEndPoint}/policyDocuments`, document).pipe(
      catchError((error) => {
        console.error("Error in createPolicyDocument:", error);
        return throwError(error);
      })
    );
  }
}
