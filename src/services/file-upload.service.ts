// file-upload.service.ts

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { SKIP_JWT_AUTHENTICATION_INJECTION } from '../utils/jwt-interceptor';


export const PRESIGNED_URL_ENDPOINT = 'https://upload.samsu-fpt.software/presigned-url';
export const FILE_URL_SEPARATOR = '$$$';

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {

    constructor(private http: HttpClient) { }

    uploadFile(file: File): Observable<string> {
        const formData = new FormData();

        const fileNameWithExtension = file.name;
        const urlWithQuery = `${PRESIGNED_URL_ENDPOINT}?filename=${encodeURIComponent(fileNameWithExtension)}`;

        return this.http.get(urlWithQuery).pipe(
            // Assuming the response is of type string, modify this as needed
            switchMap((preSignedPostData: any) => {
                for (const field in preSignedPostData.fields) {
                    formData.append(field, preSignedPostData.fields[field]);
                }
                formData.append('file', file);
                return this.http.post(preSignedPostData.url, formData, {
                    context: new HttpContext().set(SKIP_JWT_AUTHENTICATION_INJECTION, true),
                }).pipe(
                    map(() => {
                        const downloadUrl = `${preSignedPostData.url}/${preSignedPostData.fields['key']}`;
                        return downloadUrl;
                    })
                );
            })
        );
    }
    uploadFiles(files: File[]): Observable<string[]> {
        // Use forkJoin to handle multiple file uploads in parallel
        return forkJoin(
            files.map(file => this.uploadFile(file))
        );
    }
}
