import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GradeTicketCodeService {

  apiEndPoint: string = "";
  constructor(
    private http: HttpClient,
    protected router: Router,
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  public getGradeTicketInfoForGuarantorVerify(code: string) {
    const headers = new HttpHeaders()
      .set("CodeTicket", code);
    const options = { headers: headers };
    return this.http.get(`${this.apiEndPoint}/gradeTicketCode`, options).pipe(
      catchError((error) => {
        console.error("Error in getGradeTicketInfoForGuarantorVerify:", error);
        return throwError(error);
      })
    );
  }
  public postGradeTicketInfoForGuarantorVerify(status: number, code: string) {
    const headers = new HttpHeaders()
    .set("CodeTicket", code)
    .set("Content-Type", "application/json");
    const options = { headers: headers };
    return this.http.post(`${this.apiEndPoint}/gradeTicketCode/status/${status}`, options).pipe(
      catchError((error) => {
        console.error("Error in postGradeTicketInfoForGuarantorVerify:", error);
        return throwError(error);
      })
    );
  }
}
