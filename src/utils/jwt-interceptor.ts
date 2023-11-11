// jwt-interceptor.ts

import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export const SKIP_JWT_AUTHENTICATION_INJECTION = new HttpContextToken(() => false);

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Retrieve the JWT token from localStorage
        const jwt = localStorage.getItem('jwt');
        const parsedJwtToken = JSON.parse(jwt);
        const skipInjection = request.context.get(SKIP_JWT_AUTHENTICATION_INJECTION);

        // If a token exists, add it to the Authorization header
        if (parsedJwtToken?.jwtToken?.accessToken && !skipInjection) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${parsedJwtToken.jwtToken.accessToken}`
                }
            });
        }

        // Pass the modified request to the next handler
        return next.handle(request);
    }
}
