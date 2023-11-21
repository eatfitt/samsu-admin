import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../environments/environment";



export interface EventProposal {
    id: number;
    title: string;
    feedback: string;
    content: string;
    status: EventProposalStatus;
    creatorRollnumber: string;
    accepterRollnumber: string;
    fileUrls: string;
    modifyAt: string;
    createAt: string;
}
export enum EventProposalStatus {
    PROCESSING = 'PROCESSING',
    APPROVED = 'APPROVED',
    REVIEWED = 'REVIEWED',
    REJECTED = 'REJECTED',
    USED = 'USED'
}

@Injectable({
    providedIn: 'root'
})
export class EventProposalService {
    constructor(private http: HttpClient,
        protected router: Router) {
        this.apiEndPoint = environment.apiEndPoint;

    }
    apiEndPoint: string = '';

    public getMyEventProposal() {
        return this.http.get(`${this.apiEndPoint}/event/proposals/me`).pipe(
            catchError((error) => {
                console.error("Error in get event proposal:", error);
                return throwError(error);
            })
        )
    }
    postEventProposal(proposalBody: any): Observable<any> {
        const url = `${this.apiEndPoint}/event/proposals`;
        return this.http.post(url, proposalBody).pipe(
            catchError(this.handleError)
        );
    }

    getAllEventProposals(): Observable<any> {
        const url = `${this.apiEndPoint}/event/proposals`;
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    getEventProposalById(id: string): Observable<EventProposal> {
        const url = `${this.apiEndPoint}/event/proposals/${id}`;
        return this.http.get<EventProposal>(url).pipe(
            catchError(this.handleError)
        );
    }

    putEventProposalManager(proposalId: string, updatedProposal: any): Observable<any> {
        //content, title, fileURls, default status = PROCESSING
        const url = `${this.apiEndPoint}/event/proposals/${proposalId}`;
        const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
        const options = { headers: headers };

        return this.http.put(url, JSON.stringify(updatedProposal), options).pipe(
            catchError(this.handleError)
        );
    }

    putEventProposalAdmin(proposalId: string, updatedProposal: any): Observable<any> {
        //status and feedback
        const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
        const options = { headers: headers };
        const url = `${this.apiEndPoint}/event/proposals/evaluate/${proposalId}`;
        return this.http.put(url, JSON.stringify(updatedProposal), options).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        // Your error handling logic goes here
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
    }
}